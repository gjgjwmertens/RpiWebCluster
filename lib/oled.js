
// Oled objects
var oled = require('oled-js-pi');
var font = require('oled-font-5x7');

const moment = require('moment');
const ip = require('./ip');

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
   oled.setCursor(1, 0);
   oled.writeString(font, 1,
      moment().format('dd DD.MM.YYYY   200'), 1, false);
   oled.setCursor(10, 8);
   oled.writeString(font, 2, moment().format('HH:mm:ss'));
   oled.setCursor(1, 24);
   oled.writeString(font, 1, ip);
}, 1000);
