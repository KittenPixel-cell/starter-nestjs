const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const targetURL = req.url;

  // For example, fetch and proxy the requested URL
  const requestOptions = url.parse(targetURL);
  const client = requestOptions.protocol === 'https:' ? https : http;

  client.get(targetURL, (response) => {
    let responseData = '';

    response.on('data', (chunk) => {
      responseData += chunk;
    });

    response.on('end', () => {
      // Set the response headers
      res.writeHead(200, {
        'Content-Type': response.headers['content-type'],
        'Content-Length': Buffer.byteLength(responseData),
      });

      // Send the fetched content as the response
      res.end(responseData);
    });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
