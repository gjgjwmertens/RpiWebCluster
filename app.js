/**
 * Created by G on 4-3-2017.
 */
let env = process.argv.slice(2);

global.DEBUG = false;
global.config = {
   secret: 'Unknown',
   rpi: 'Unknown'
};
if(env[0] && (env[0] == 'G')) {
   config = require('D:/inc/rpi_cluster.config');
} else {
   config = require('/home/pi/inc/rpi_cluster.config');
}

var express = require('express');
var reload = require('reload');
// var fs = require('fs');
var app = express();
var cc = require('./lib/cyber-chat');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('cc', cc);
app.set('rpi', config.rpi);

app.use(require('./routes/index'));
app.use(require('./routes/api'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use(express.static('./public'));

// global vars for the EJS (Embedded JavaScript) framework
app.locals.siteTitle = 'RpiWebCluster'; // Control Systems title
app.locals.rpi = config.rpi;

var server = app.listen(app.get('port'), function () {
   if (DEBUG) {
      console.log('Rpi_008 listening on port: ' + app.get('port') + '!');
   }
});

reload(server, app);

cc.start(config.rpi);