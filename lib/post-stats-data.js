var https = require('https');
const ip = require('./ip');
const db = require('./my-db');
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
   postStatsStatus: {
      statusCode: 500,
      data: ''
   },
   postServerStats: function (serverData) {
      this.postStatsStatus = {
         statusCode: 500,
         data: ''
      };
      this.postStatsData['remote_ip'] = serverData.REMOTE_ADDR;
      this.postStatsData['server_name'] = serverData.COMPUTERNAME;
      this.postStatsData['server_ip'] = serverData.LOCAL_ADDR;

      var ps_data = querystring.stringify(this.postStatsData);
      this.postStatsOptions.headers['Content-length'] = Buffer.byteLength(ps_data);

      var post_req = https.request(this.postStatsOptions, (post_res) => {
         this.postStatsStatus.statusCode = post_res.statusCode;
         post_res.setEncoding('utf8');
         post_res.on('data', (chunk) => {
            this.postStatsStatus.data += chunk;
         });
         post_res.on('end', () => {
            if (DEBUG) {
               console.trace(this.postStatsStatus);
            }
            if (this.postStatsStatus.statusCode == 200) {
               var data = JSON.parse(this.postStatsStatus.data);

               if (data.addResult.result === false) {
                  db_error_log(new Error(data.addResult.msg));
               }
            } else {
               db_error_log(new Error('PostServerStats returned with: ' + this.postStatsStatus.statusCode));
            }
         });
      });

      post_req.on('error', (e) => {
         db_error_log(new Error(`PostServerStats error: ${e.message}`));
      });

      post_req.write(ps_data);
      post_req.end();
   }
};

module.exports = psd;