var oled = require('oled-js-pi');
var font = require('oled-font-5x7');

const http = require('http');

const hostname = '20.0.0.108';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
   if (DEBUG) {
      console.log(`Server running at http://${hostname}:${port}/`);
   }
});


var opts = {
  width: 128,
  height: 64,
  address: 0x3C
};
 
var oled = new oled(opts);
 
// sets cursor to x = 1, y = 1 
oled.setCursor(1, 1);
oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);
