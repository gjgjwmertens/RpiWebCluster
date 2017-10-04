var https = require('https');
var querystring = require('querystring');
var db = require('./my-db');


var sc = {

   serverStatus: null,
   post_data: {
      'secret': 'asdFjl34%^isDajopweea[Po93342jma=a213!@#',
      'output_format': 'json'
   },
   serverSecureOptions: {
      hostname: 'az005.fmg.uva.nl',
      port: 443,
      path: '/alive_check/https_php_alive_check.php',
      method: 'POST',
      rejectUnauthorized: false, // AZ005 has no valid certificate
      headers: {
         'accept': '*/*',
         'Content-Type': 'application/x-www-form-urlencoded',
         'Content-Length': 0
      }
   },
   checkSecureServerStatus: function (srv) {
      return new Promise((resolve, reject) => {
         let pd = querystring.stringify(this.post_data);
         this.serverStatus = {
            statusCode: 500,
            data: '',
            server: null,
            checkTime: null
         };
         this.serverSecureOptions.hostname = srv;
         this.serverSecureOptions.headers['Content-Length'] = Buffer.byteLength(pd);

         let post_req = https.request(this.serverSecureOptions, (post_res) => {
            this.serverStatus.statusCode = post_res.statusCode;
            post_res.setEncoding('utf8');
            post_res.on('data', (chunk) => {
               this.serverStatus.data += chunk;
            });
            post_res.on('end', () => {
               if (this.serverStatus.statusCode === 200) {
                  let data = JSON.parse(this.serverStatus.data);
                  this.serverStatus.server = data.server;
                  this.serverStatus.responseStatus = data.status;
                  this.serverStatus.checkTime = new Date();

                  db.query('insert into iis_alive_check values(null,' +
                           'now(), ' + post_res.statusCode + ', "' +
                           this.serverStatus.server.COMPUTERNAME + '", "' +
                           this.serverStatus.server.LOCAL_ADDR + '", ' +
                           '"' + db.escape(this.serverStatus.data) + '")', (error, results, fields) => {
                     if (error) {
                        reject(new Error('MySQL error while inserting: ' + error));
                     }
                  });
               }
               resolve(this.serverStatus);
            });
         });

         post_req.on('error', (e) => {
            reject(new Error(`post_req.onError: ${e.message}`));
         });

         post_req.write(pd);
         post_req.end();
      });
   }
};

module.exports = sc;