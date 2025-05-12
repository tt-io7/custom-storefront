const http = require('http');

// Make a simple GET request to the Medusa health endpoint
const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/health',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('No more data in response.');
    console.log('Server is running!');
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  console.error('Server might not be running correctly.');
});

// End the request
req.end(); 