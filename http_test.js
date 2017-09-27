/**
 * Created by G on 5-3-2017.
 */
var http = require('http');
const moment = require('moment');

var http_options = {
   hostname: 'webserver7.fmg.uva.nl',
   port: 80,
   path: '/php/index.php',
   method: 'GET'
}

console.log('start http test');

var req = http.request(http_options, (res) => {
   console.log(`http_test.js::http.request: Server Status: ${res.statusCode}`);
   console.log(`http_test.js::http.request: Headers: ${JSON.stringify(res.headers)}`);
   res.setEncoding('utf8');
   res.on('data', (chunk) => {
      console.log(`app.js::res.onData Body: ${chunk}`);
      console.log(chunk.search('php is working')>0?'Ok':'Error');
      // console.log(chunk.search(/webserver/i));
      var serverId = chunk.substr(chunk.search(/webserver/i));
      serverId = serverId.substring(0, serverId.search('</p>'));
      console.log(serverId);
   });
   res.on('end', () => {
      console.log('http_test.js::res.onEnd End of response');
   })
});

req.on('error', (e) => {
   console.log(`http_test.js::req.onError: ${e.message}`);
});



	
console.log(moment().format('dd DD.MM.YYYY HH:mm:ss'));
console.log('end http test');
req.end();
