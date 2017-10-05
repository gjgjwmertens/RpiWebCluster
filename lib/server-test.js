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
         var t = new Date();
         // var tString = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + ':' + t.getMilliseconds();
         console.log(t.formatedTime() + ' Starting Server test on ' + server);
         sc.checkSecureServerStatus(server)
           .then((r) => {
              // console.log(r);
              resolve('Done testing: ' + server);
              // psd.postServerStats(r.server);
           }, (e) => {
              errorLog.dbErrorLog(e);
              reject(e);
           });
      });
   }
};


module.exports = st;

// this.postStatsData['remote_ip'] = this.serverStatus.server.REMOTE_ADDR;
// this.postStatsData['server_name'] = this.serverStatus.server.COMPUTERNAME;
// this.postStatsData['server_ip'] = this.serverStatus.server.LOCAL_ADDR;
//
// this.postStatsOptions.headers['Content-length'] = Buffer.byteLength(querystring.stringify(this.postStatsData));
// postServerStats(postStatsOptions);
