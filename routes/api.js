let express = require('express');
let bodyParser = require('body-parser');
let st = require('../lib/server-test');
require('../lib/helpers');
let router = express.Router();
let runStIntVal = null;
let serverList = [
   'AZ005.fmg.uva.nl',
   'webserver13.fmg.uva.nl'
];

async function rst(srv) {
   let result = await st.runServerTest(srv);
   return 'Server tested: ' + srv + ' with result: ' +  result;
};

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
   let cc = req.app.get('cc');

   switch (input.command) {
      case 'serverTest':
         let t = Date.now();
         serverList.forEach((server) => {
            cc.send('\n' + new Date().formatedTime() + ' Starting Server test on ' + server);
            rst(server).then((r) => {
               console.log(r);
               cc.send('\n' + new Date().formatedTime() + ' Result from server test: ' + r);
            });
            cc.send('\n' + new Date().formatedTime() + ' Server test on ' + server + ' ended.');
         });
         t = Date.now() - t;
         res.json({msg: 'Api test ok at: ' + new Date() + ' Done in ' + t});
         break;
      case 'runServerTest':
         runStIntVal = setInterval(st.runServerTest, 10000);
         res.json({msg: 'Server test started at: ' + new Date()});
         break;
      case 'stopServerTest':
         clearInterval(runIntVal);
         res.json({msg: 'Server test stopped at: ' + new Date()});
         break;
      default:
         res.json({msg: 'Unknown command'});
   }
});

module.exports = router;