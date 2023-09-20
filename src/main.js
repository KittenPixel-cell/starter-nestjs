const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const targetURL = req.url.replace('/?URL=', ''); // Extract the target URL

  // Ignore requests for favicon.ico
  if (req.url === '/favicon.ico') {
    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }

  // Rest of your code to proxy the request
  // ...

  // Example code to proxy the request to the target URL
  const target = new URL(targetURL);
  const options = {
    hostname: target.hostname,
    port: target.port || (target.protocol === 'https:' ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = (target.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
