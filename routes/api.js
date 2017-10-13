require('../lib/helpers');
let express = require('express');
let bodyParser = require('body-parser');
let st = require('../lib/server-test');
let router = express.Router();
let runStIntVal = null;
let runCtIntVal = null;
let cc = null;
// let serverList = [
//    'webserver1.fmg.uva.nl'
//    'webserver11.fmg.uva.nl'
// ];
let serverList = [
   'AZ005.fmg.uva.nl',
   'webserver2.fmg.uva.nl',
   'webserver6.fmg.uva.nl',
   'webserver12.fmg.uva.nl',
   'webserver13.fmg.uva.nl'
];
let cluster = '145.18.151.162';

// async function rst(srv) {
//    let result = await st.runServerTest(srv);
//    return 'Server tested: ' + srv + ' with result: ' +  result;
// };

function testServers() {
   serverList.forEach((server) => {
      let t = [server, Date.now()];
      cc.send('\n' + new Date().formattedTime() + ' Starting test on ' + server);
      st.runServerTest(server).then((r) => {
         if (DEBUG) {
            console.log(r);
         }
         cc.send('\n' + new Date().formattedTime() +
                 ' Result from server test: \r\n             ' + r +
                 '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
      }, (e) => {
         cc.send('\n' + new Date().formattedTime() +
                 ' Result from server test: \r\n             ' + e +
                 '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
      });
      // cc.send('\n' + new Date().formattedTime() + ' Server test on ' + server + ' ended.');
   });
}

function testCluster() {
   let server = cluster;
   let t = [server, Date.now()];
   cc.send('\n' + new Date().formattedTime() + ' Starting test on ' + server);
   st.runServerTest(server).then((r) => {
      if (DEBUG) {
         console.log(r);
      }
      cc.send('\n' + new Date().formattedTime() +
              ' Result from server test: \r\n             ' + r +
              '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
   }, (e) => {
      cc.send('\n' + new Date().formattedTime() +
              ' Result from server test: \r\n             ' + e +
              '\r\n             ' + t[0] + ' took ' + (Date.now() - t[1]));
   });
   // cc.send('\n' + new Date().formattedTime() + ' Server test on ' + server + ' ended.');
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/api', function (req, res) {
   res.json({
      type: 'json',
      data: 'Hello World',
      time: new Date().toString()
   });
});

router.get('/api/:item_id/:new_value', function (req, res) {
   res.json({
      type: 'json',
      item: req.params.item_id,
      value: req.params.new_value,
      data: 'Hello World',
      time: new Date().toString()
   });
});

router.post('/api', function (req, res) {
   let input = req.body;
   let t = Date.now();
   if (!cc) {
      cc = req.app.get('cc');
   }

   switch (input.command) {
      case 'serverTest':
         testServers();
         t = Date.now() - t;
         res.json({msg: 'Api test ok at: ' + new Date() + ' Done in ' + t});
         break;
      case 'runServerTest':
         runStIntVal = setInterval(testServers, 10000);
         res.json({msg: 'Server test started at: ' + new Date()});
         break;
      case 'stopServerTest':
         clearInterval(runStIntVal);
         res.json({msg: 'Server test stopped at: ' + new Date()});
         break;
      case 'clusterTest':
         testCluster();
         t = Date.now() - t;
         res.json({msg: 'Api test ok at: ' + new Date() + ' Done in ' + t});
         break;
      case 'runClusterTest':
         runCtIntVal = setInterval(testCluster, 10000);
         res.json({msg: 'Server test started at: ' + new Date()});
         break;
      case 'stopClusterTest':
         clearInterval(runCtIntVal);
         res.json({msg: 'Server test stopped at: ' + new Date()});
         break;
      default:
         res.json({msg: 'Unknown command'});
   }
});

module.exports = router;