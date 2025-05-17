export default function RootPage() {
  return (
    <html>
      <head>
        <title>Medusa Storefront</title>
      </head>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          margin: 0,
          padding: 0
        }}>
          <h1>Medusa Storefront</h1>
          <p>Status: OK</p>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Only redirect in browser, not during Railway's health check
              if (typeof window !== 'undefined') {
                window.location.href = '/${process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"}';
              }
            `,
          }}
        />
      </body>
    </html>
  );
} 