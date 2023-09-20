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
      // Modify the HTML as needed by appending or prepending content
      responseData = responseData.replace('</head>', '<script src="your-script.js"></script></head>');
      responseData = responseData.replace('<body>', '<body><h1>Hello, World!</h1>');

      // Set the response headers
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength(responseData),
      });

      // Send the modified HTML as the response
      res.end(responseData);
    });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
