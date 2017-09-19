/**
 * Created by G on 4-3-2017.
 */

const DEBUG = true;

if(DEBUG) {
   var util = require('util');
}

var express = require('express');
var reload = require('reload');
var wss = new require('ws').Server({port: 3030});
var fs = require('fs');
var app = express();

// http server check
var http = require('http');
const moment = require('moment');
const ip = require('./lib/ip');

// MySQL storage
var mysql = require('mysql');
var db = mysql.createConnection({
   host: 'localhost',
   user: 'pi',
   password: '13taz666',
   database: 'web_cluster_stats'
});

// Oled objects
var oled = require('oled-js-pi');
var font = require('oled-font-5x7');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(require('./routes/index'));
app.use(require('./routes/api'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use(express.static('./public'));

// global vars for the EJS (Embedded JavaScript) framework
app.locals.siteTitle = 'RpiWebCluster'; // Control Systems title

var server = app.listen(app.get('port'), function () {
   console.log('Rpi_008 listening on port: ' + app.get('port') + '!');
});

reload(server, app);

wss.on('connection', function (ws) {
   ws.send('Welcome to cyber chat3');
   ws.on('message', function (msg) {
      if (msg == 'exit') {
         ws.close();
      }
   })
});

var oled_options = {
   width: 128,
   height: 64,
   address: 0x3C
};

var serverOptions = {
   hostname: 'webserver7.fmg.uva.nl',
   port: 80,
   path: '/php/secure/http_php_alive_check.php',
   method: 'GET'
}

var serverStatus = {
   statusCode: 500,
   server: null,
   lastCheck: null
}

function checkServerStatus(server) {
   var req = http.request(server, (res) => {
      serverStatus.statusCode = res.statusCode;
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
         // console.log(`app.js::res.onData Body: ${chunk}`);
         // console.log(chunk.search('php is working')>0?'Ok':'Error');
         // console.log(chunk.search(/webserver/i));
         // var serverId = chunk.substr(chunk.search(/webserver/i));
         // serverId = serverId.substring(0, serverId.search('</p>'));
         // console.log('app.js::onData: ' + serverId);
         serverStatus.server = JSON.parse(chunk);
         serverStatus.lastCheck = new Date();

         db.query('insert into iis_alive_check values(null,' +
                  'now(), ' + res.statusCode + ', "' +
                  serverStatus.server.COMPUTERNAME + '", "' +
                  serverStatus.server.HOST_ADDR + '", ' +
                  '"' + db.escape(chunk) + '")', (error, results, fields) => {
            if(error) {
               console.log("app.js::checkServerStatus: MySQL error inserting: " + error);
            } else {
               console.log('app.js::checkServerStatus result: ' + util.inspect(results, false, null));
               console.log('app.js::checkServerStatus fields: ' + util.inspect(fields, false, null));
            }
         });

         db.query('select count(*) from iis_alive_check', (error, results, fields) => {
            if(error) {
               console.log("app.js::checkServerStatus: MySQL error select: " + error);
            } else {
               console.log('app.js::checkServerStatus select result: ' + util.inspect(results, false, null));
               console.log('app.js::checkServerStatus select fields: ' + util.inspect(fields, false, null));
            }
         });
      });
      res.on('end', () => {
         console.log('app.js::res.onEnd End of response');
      })
   });

   req.on('error', (e) => {
      console.log(`http_test.js::req.onError: ${e.message}`);
   });
   req.end();
}

setInterval(() => {checkServerStatus(serverOptions);}, 10000);

var oled = new oled(oled_options);

// sets cursor to x = 1, y = 1

setInterval(function() {
   // console.log(serverStatus);
   oled.clearDisplay();
   if(serverStatus.statusCode == 200) {
      oled.setCursor(1, 0);
      oled.writeString(font, 1,
         moment().format('dd DD.MM.YYYY   ') + serverStatus.statusCode, 1, false);
      oled.setCursor(1, 24);
      oled.writeString(font, 1, serverStatus.server.LOCAL_ADDR);
   } else {
      oled.setCursor(1, 0);
      oled.writeString(font, 1,
         moment().format('dd DD.MM.YYYY   '), 1, false);
   }
   oled.setCursor(10, 8);
   oled.writeString(font, 2, moment().format('HH:mm:ss'));
   oled.setCursor(1, 32);
   oled.writeString(font, 1, ip);
   // wss.clients.forEach(function (ws, index, list) {
   //    ws.send('time: ' + new Date());
   // })
}, 1000);
