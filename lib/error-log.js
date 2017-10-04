const db = require('./my-db');
const ip = require('./ip');

var errorLog = {
   dbErrorLog: (e) => {
      db.query('insert into error_log values(null,' +
               '"Rpi_008::' + ip + '", ' +
               '"' + e.message + '", ' +
               '"' + e.stack + '", ' +
               'now(), now())', (error, results, fields) => {
         if (error) {
            console.log("error-log.js::dbErrorLog: MySQL error while storing error: " + error);
         }
      });
   }
}

module.exports = errorLog;