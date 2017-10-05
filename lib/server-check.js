var https = require('https');
var querystring = require('querystring');
var db = require('./my-db');


var sc = {
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
         let serverStatus = {
            statusCode: 500,
            data: '',
            server: null,
            checkTime: null
         };
         this.serverSecureOptions.hostname = srv;
         this.serverSecureOptions.headers['Content-Length'] = Buffer.byteLength(pd);

         let post_req = https.request(this.serverSecureOptions, (post_res) => {
            serverStatus.statusCode = post_res.statusCode;
            post_res.setEncoding('utf8');
            post_res.on('data', (chunk) => {
               serverStatus.data += chunk;
            });
            post_res.on('end', () => {
               if (serverStatus.statusCode === 200) {
                  let data = JSON.parse(serverStatus.data);
                  serverStatus.server = data.server;
                  serverStatus.responseStatus = data.status;
                  serverStatus.checkTime = new Date();

                  db.query('insert into iis_alive_check values(null,' +
                           'now(), ' + post_res.statusCode + ', "' +
                           serverStatus.server.COMPUTERNAME + '", "' +
                           serverStatus.server.LOCAL_ADDR + '", ' +
                           '"' + db.escape(serverStatus.data) + '")', (error, results, fields) => {
                     if (error) {
                        reject(new Error('MySQL error while inserting: ' + error));
                     }
                  });
               }
               resolve(serverStatus);
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