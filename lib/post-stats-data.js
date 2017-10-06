var https = require('https');
const ip = require('./ip');
const db = require('./my-db');
const errorLog = require('./error-log');
var querystring = require('querystring');

var psd = {

   postStatsData: {
      'secret': 'asdFjl34%^isDajopweea[Po93342jma=a213!@#',
      'rpi_name': 'Rpi_008',
      'rpi_ip': ip,
      'remote_ip': '',
      'server_name': '',
      'server_ip': ''
   },
   postStatsOptions: {
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
   },
   postServerStats: function (serverData) {
      return new Promise((resolve, reject) => {
         var postStatsStatus = {
            statusCode: 500,
            data: ''
         };
         this.postStatsData['remote_ip'] = serverData.REMOTE_ADDR;
         this.postStatsData['server_name'] = serverData.COMPUTERNAME;
         this.postStatsData['server_ip'] = serverData.LOCAL_ADDR;

         var ps_data = querystring.stringify(this.postStatsData);
         this.postStatsOptions.headers['Content-length'] = Buffer.byteLength(ps_data);

         var post_req = https.request(this.postStatsOptions, (post_res) => {
            postStatsStatus.statusCode = post_res.statusCode;
            post_res.setEncoding('utf8');
            post_res.on('data', (chunk) => {
               postStatsStatus.data += chunk;
            });
            post_res.on('end', () => {
               if (DEBUG) {
                  console.trace(postStatsStatus);
               }
               if (postStatsStatus.statusCode == 200) {
                  var data = JSON.parse(postStatsStatus.data);

                  if (data.addResult.result === false) {
                     let e = new Error(data.addResult.msg);
                     errorLog.dbErrorLog(e);
                     reject(e);
                  }
                  resolve(postStatsStatus);
               } else {
                  let e = new Error('PostServerStats returned with: ' + postStatsStatus.statusCode);
                  errorLog.dbErrorLog(e);
                  reject(e);
               }
            });
         });

         post_req.on('error', (e) => {
            e.message = `PostServerStats error: ${e.message}`;
            errorLog.dbErrorLog(e);
            reject(e);
         });

         post_req.write(ps_data);
         post_req.end();
      });
   }
};

module.exports = psd;