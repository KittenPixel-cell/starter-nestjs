const https = require('https');
const tls = require('tls');
const url = require('url');

https.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const targetURL = parsedUrl.query.URL;

  if (!targetURL) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: URL parameter missing');
    return;
  }

  https.get(targetURL, (response) => {
    response.on('data', (data) => {
      res.write(data);
    });
    response.on('end', () => {
      res.end();
    });
  }).on('error', (err) => {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
}).listen(3000, () => {
  console.log('Server listening on port 3000');
});
