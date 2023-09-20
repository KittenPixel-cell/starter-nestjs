const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const targetURL = req.url;

  // Check if the requested URL is for the favicon.ico file
  if (targetURL === '/favicon.ico') {
    // Ignore the request for the favicon.ico file
    res.writeHead(204, { 'Content-Length': '0' });
    res.end();
    return;
  }

  // For example, fetch and proxy the requested URL
  const requestOptions = url.parse(targetURL);
  const client = requestOptions.protocol === 'https:' ? https : http;

  client.get(targetURL, (response) => {
    let responseData = '';

    response.on('data', (data) => {
      responseData += data;
    });

    response.on('end', () => {
      res.writeHead(response.statusCode, response.headers);
      res.end(responseData);
    });
  }).on('error', (err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
