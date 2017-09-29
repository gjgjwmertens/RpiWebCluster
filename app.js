/**
 * Created by G on 4-3-2017.
 */

const DEBUG = true;

var express = require('express');
var reload = require('reload');
var wss = new require('ws').Server({port: 3030});
// var fs = require('fs');
var app = express();

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

