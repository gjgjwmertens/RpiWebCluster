
// Oled objects
let objOled = require('oled-js-pi');
let font = require('oled-font-5x7');

const moment = require('moment');
const ip = require('./ip');

let oled_options = {
   width: 128,
   height: 64,
   address: 0x3C,
   showAddress: false
};

let oled = new objOled(oled_options);

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
   oled.setCursor(1, 32);
   oled.writeString(font, 1, global.config.rpi);
}, 1000);
