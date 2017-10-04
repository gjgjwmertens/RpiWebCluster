// MySQL storage
var mysql = require('mysql');
var db = mysql.createConnection({
   host: 'localhost',
   user: 'pi',
   password: 'taz666',
   database: 'web_cluster_stats'
});

module.exports = db;