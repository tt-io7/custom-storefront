const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 8000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Add default region data for cases when we can't fetch from backend
const fallbackRegions = {
  regions: [
    {
      id: "reg_01",
      name: "NA",
      countries: [
        { id: "us", iso_2: "us", display_name: "United States" },
        { id: "ca", iso_2: "ca", display_name: "Canada" }
      ]
    }
  ]
};

// Intercept and mock fetch when needed
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  // If it's a regions request and we're in production, provide fallback data
  if (typeof url === 'string' && url.includes('/store/regions') && process.env.NODE_ENV === 'production') {
    try {
      const response = await originalFetch(url, options);
      return response;
    } catch (error) {
      console.log('Error fetching regions, using fallback data:', error.message);
      return {
        ok: true,
        status: 200,
        json: async () => fallbackRegions
      };
    }
  }

  // For all other requests, use the original fetch
  return originalFetch(url, options);
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;
      
      // Handle health check endpoint
      if (pathname === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>OK</h1></body></html>');
        return;
      }

      // Handle API health endpoint
      if (pathname === '/api/health') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }

      // For all other routes, let Next.js handle it
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    console.log(`> Medusa Backend URL: ${process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'not set'}`);
  });
}); 