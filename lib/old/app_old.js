/**
 * Created by G on 4-3-2017.
 */

const DEBUG = true;

if (DEBUG) {
   var util = require('util');
}

var express = require('express');
var reload = require('reload');
var wss = new require('ws').Server({port: 3030});
var querystring = require('querystring');
var fs = require('fs');
var app = express();

// http server check
var http = require('http');
var https = require('https');
const moment = require('moment');
const ip = require('./lib/ip');

// MySQL storage
var mysql = require('mysql');
var db = mysql.createConnection({
   host: 'localhost',
   user: 'pi',
   password: 'taz666',
   database: 'web_cluster_stats'
});

// Oled objects
var oled = require('oled-js-pi');
var font = require('oled-font-5x7');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('wss', wss);

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

function db_error_log(e) {
   db.query('insert into error_log values(null,' +
            '"Rpi_008::' + ip + '", ' +
            '"' + e.message + '", ' +
            '"' + e.stack + '", ' +
            'now(), now())', (error, results, fields) => {
      if (error) {
         console.log("app.js::checkServerStatus: MySQL error inserting: " + error);
      }
   });
}

var post_data = querystring.stringify({
   'secret' : 'asdFjl34%^isDajopweea[Po93342jma=a213!@#',
   'output_format': 'json'
});

var serverOptions = {
   hostname: 'az005.fmg.uva.nl',
   port: 80,
   path: '/alive_check/http_php_alive_check.php',
   method: 'GET'
};

var serverSecureOptions_http = {
   hostname: 'az005.fmg.uva.nl',
   port: 80,
   path: '/alive_check/https_php_alive_check.php',
   method: 'POST',
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(post_data)
   }
};

var postStatsData = {
   'secret': 'asdFjl34%^isDajopweea[Po93342jma=a213!@#',
   'rpi_name': 'Rpi_008',
   'rpi_ip': ip,
   'remote_ip': '',
   'server_name': '',
   'server_ip': ''
};

var postStatsOptions = {
   hostname: 'az005.fmg.uva.nl',
   port: 443,
   path: '/zen_admin/rpi-cluster-stats/add',
   method: 'POST',
   rejectUnauthorized: false, // AZ005 has no valid certificate
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 0
   }
};

var postStatsStatus = {
   statusCode: 500,
   data: ''
};

var serverSecureOptions = {
   hostname: 'az005.fmg.uva.nl',
   port: 443,
   path: '/alive_check/https_php_alive_check.php',
   method: 'POST',
   rejectUnauthorized: false, // AZ005 has no valid certificate
   headers: {
      'accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(post_data)
   }
};

var serverStatus = {
   statusCode: 500,
   data: '',
   server: null,
   lastCheck: null
};

function checkSecureServerStatus(srv) {
   serverStatus = {
      statusCode: 500,
      data: '',
      server: null,
      lastCheck: null
   };
   var post_req = https.request(srv, (post_res) => {
      serverStatus.statusCode = post_res.statusCode;
      post_res.setEncoding('utf8');
      post_res.on('data', (chunk) => {
         serverStatus.data += chunk;
      });
      post_res.on('end', () => {
         if (serverStatus.statusCode == 200) {
            var data = JSON.parse(serverStatus.data)
            serverStatus.server = data.server;
            serverStatus.responseStatus = data.status;
            serverStatus.lastCheck = new Date();

            db.query('insert into iis_alive_check values(null,' +
                     'now(), ' + post_res.statusCode + ', "' +
                     serverStatus.server.COMPUTERNAME + '", "' +
                     serverStatus.server.LOCAL_ADDR + '", ' +
                     '"' + db.escape(serverStatus.data) + '")', (error, results, fields) => {
               if (error) {
                  console.log("app.js::checkServerStatus: MySQL error inserting: " + error);
               }
            });

            postStatsData['remote_ip'] = serverStatus.server.REMOTE_ADDR;
            postStatsData['server_name'] = serverStatus.server.COMPUTERNAME;
            postStatsData['server_ip'] = serverStatus.server.LOCAL_ADDR;

            postStatsOptions.headers['Content-length'] = Buffer.byteLength(querystring.stringify(postStatsData));
            postServerStats(postStatsOptions);

            // console.log('success: ', serverStatus);
         }
         // console.log('app.js::post_res.onEnd End of secure response.');
      });
   });

   post_req.on('error', (e) => {
      console.log(`app.js::post_req.onError: ${e.message}`);
   });

   post_req.write(post_data);
   post_req.end();
}

function postServerStats(postOptions) {
   postStatsStatus = {
      statusCode: 500,
      data: ''
   };
   var post_req = https.request(postOptions, (post_res) => {
      postStatsStatus.statusCode = post_res.statusCode;
      post_res.setEncoding('utf8');
      post_res.on('data', (chunk) => {
         postStatsStatus.data += chunk;
      });
      post_res.on('end', () => {
         if(DEBUG) {
            console.trace(postStatsStatus);
         }
         if (postStatsStatus.statusCode == 200) {
            var data = JSON.parse(postStatsStatus.data);

            if(data.addResult.result === false) {
               db_error_log(new Error(data.addResult.msg));
            }
         } else {
            db_error_log(new Error('PostServerStats returned with: ' + postStatsStatus.statusCode));
         }
      });
   });

   post_req.on('error', (e) => {
      db_error_log(new Error(`PostServerStats error: ${e.message}`));
   });

   post_req.write(querystring.stringify(postStatsData));
   post_req.end();
}

function checkServerStatus(server) {
   var req = http.request(server, (res) => {
      serverStatus.statusCode = res.statusCode;
      // console.log('statusCode: ', post_res.statusCode);
      // console.log('headers: ', post_res.headers);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
         // console.log(`app.js::res.onData Body: ${chunk}`);
         // console.log(chunk.search('php is working')>0?'Ok':'Error');
         // console.log(chunk.search(/webserver/i));
         // var serverId = chunk.substr(chunk.search(/webserver/i));
         // serverId = serverId.substring(0, serverId.search('</p>'));
         serverStatus.server = JSON.parse(chunk);
         serverStatus.lastCheck = new Date();
         // console.log('app.js::res.onData ServerStatus: ' + serverStatus);


         db.query('insert into iis_alive_check values(null,' +
                  'now(), ' + res.statusCode + ', "' +
                  serverStatus.server.COMPUTERNAME + '", "' +
                  serverStatus.server.LOCAL_ADDR + '", ' +
                  '"' + db.escape(chunk) + '")', (error, results, fields) => {
            if (error) {
               console.log("app.js::checkServerStatus: MySQL error inserting: " + error);
            } else {
               // There is useful information in results among affectedRows and insertId
               // console.log('app.js::checkServerStatus result: ' + util.inspect(results, false, null));
               // fields is undefined
               // console.log('app.js::checkServerStatus fields: ' + util.inspect(fields, false, null));
            }
         });

         db.query('select count(*) from iis_alive_check', (error, results, fields) => {
            if (error) {
               console.log("app.js::checkServerStatus: MySQL error select: " + error);
            } else {
               // the results hold the result of the select
               // console.log('app.js::checkServerStatus select result: ' + util.inspect(results, false, null));
               // console.log('app.js::checkServerStatus select fields: ' + util.inspect(fields, false, null));
            }
         });
      });
      res.on('end', () => {
         // console.log('app.js::res.onEnd End of response.');
      })
   });

   req.on('error', (e) => {
      console.log(`http_test.js::req.onError: ${e.message}`);
   });
   // the request is executed on end() (you have to call it otherwise nothing will happen!!
   req.end();
}

// setInterval(() => {checkSecureServerStatus(serverSecureOptions);}, 30000);
checkSecureServerStatus(serverSecureOptions);

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
