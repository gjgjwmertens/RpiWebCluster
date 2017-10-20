let https = require('https');
let querystring = require('querystring');
let db = require('./my-db');

console.log(config);
let sc = {
   post_data: {
      'secret': config.secret,
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
                  let data = undefined;
                  try{
                     data = JSON.parse(serverStatus.data);
                  } catch (e) {
                     reject(e);
                  }

                  if(data === undefined) {
                     reject(new Error('Return data is not JSON: ' + serverStatus.data));
                  } else {
                     switch(parseInt(data.status)) {
                        case 200:
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
                           break;

                        case 400:
                           reject(new Error('Secret key not found.'));
                           break;

                        case 403:
                           reject(new Error('Secret key does not match'));
                           break;

                        default:
                           reject(new Error('Unknown error code: ' + data.status));
                           break;
                     }
                  }
               } else {
                  reject(new Error('Test failed with code: ' + serverStatus.statusCode +
                  ' and data: ' + serverStatus.data))
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