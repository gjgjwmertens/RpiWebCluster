global.DEBUG = false;

const WebSocket = require('ws');

let env = process.argv.slice(2);
global.config = {
   secret: 'Unknown',
   rpi: 'Unknown'
};
if(env[0] && (env[0] == 'G')) {
   config = require('D:/inc/rpi_cluster.config');
} else {
   config = require('/home/pi/inc/rpi_cluster.config');
   require('./lib/oled');
}
let tstMng = require('./lib/test-manager');
const ws = new WebSocket('ws://20.0.0.108:3030');


ws.on('open', function open() {
   ws.send('Hello from: ' + config.rpi);
});

ws.on('close', (e) => {
   console.log('Connection close: ', e);
   process.exit();
});

ws.onmessage = (payload) => {
   let data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      data.ws = ws;
      if (DEBUG) {
         console.log('headless_ws_client::ws.onmessage:object: ' +
                     data.at + ' Got command: ' + data.command + ' from ' + data.rpi);
      }
      tstMng.processWsCommand(data);
   } else {
      // processWsMessage(data);
      if(DEBUG) {
         console.log('headless_ws_client.js::ws.onmessage: ' + data);
      }
   }
};
