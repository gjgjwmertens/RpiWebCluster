// http server check
var sc = require('./server-check');
var psd = require('./post-stats-data');
var errorLog = require('./error-log');


var st = {
   wss: null,
   setWebSocketServer: function (wss) {
      if (!this.wss && wss) {
         this.wss = wss;
      }
   },
   runServerTest: function (server) {
      return new Promise((resolve, reject) => {
         if (DEBUG) {
            console.log(new Date().formattedTime() + ' Starting Server test on ' + server);
         }
         sc.checkSecureServerStatus(server)
           .then((checkServerStatus) => {
              // console.log(checkServerStatus);
              psd.postServerStats(checkServerStatus.server)
                 .then((postStatStatus) => {
                    if (DEBUG) {
                       console.log(postStatStatus);
                    }
                    resolve('Done testing ' + server + ':' + checkServerStatus.server.COMPUTERNAME);
                 }, (e) => {
                    errorLog.dbErrorLog(e);
                    reject(e);
                 });
           }, (e) => {
              errorLog.dbErrorLog(e);
              reject(e);
           });
      });
   }
};


module.exports = st;
