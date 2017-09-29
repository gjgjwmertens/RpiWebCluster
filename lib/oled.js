
// Oled objects
var oled = require('oled-js-pi');
var font = require('oled-font-5x7');

const moment = require('moment');
const ip = require('./lib/ip');

var oled_options = {
   width: 128,
   height: 64,
   address: 0x3C
};

var oled = new oled(oled_options);

// sets cursor to x = 1, y = 1

setInterval(function () {
   // console.log(serverStatus);
   oled.clearDisplay();
   if (serverStatus.statusCode == 200) {
      oled.setCursor(1, 0);
      oled.writeString(font, 1,
         moment().format('dd DD.MM.YYYY   ') + serverStatus.statusCode, 1, false);
      oled.setCursor(1, 24);
      oled.writeString(font, 1, serverStatus.server.LOCAL_ADDR ? serverStatus.server.LOCAL_ADDR :
                                serverStatus.responseStatus.toString());
      oled.setCursor(1, 40);
      oled.writeString(font, 1, serverStatus.server.REMOTE_ADDR ? serverStatus.server.REMOTE_ADDR :
                                serverStatus.responseStatus.toString());
   } else {
      oled.setCursor(1, 0);
      oled.writeString(font, 1,
         moment().format('dd DD.MM.YYYY   ') + serverStatus.statusCode, 1, false);
   }
   oled.setCursor(10, 8);
   oled.writeString(font, 2, moment().format('HH:mm:ss'));
   oled.setCursor(1, 32);
   oled.writeString(font, 1, ip);
   // wss.clients.forEach(function (ws, index, list) {
   //    ws.send('time: ' + new Date());
   // })
}, 1000);
