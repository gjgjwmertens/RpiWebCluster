let express = require('express');
let st = require('../lib/server-test');
let bodyParser = require('body-parser');
let router = express.Router();
let runIntVal = null;
let serverList = [
   'AZ005.fmg.uva.nl',
   'AZ005.fmg.uva.nl'
];

async function rst(srv) {
   await st.runServerTest('AZ005.fmg.uva.nl');
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
   st.setWebSocketServer(req.app.get('wss'));

   switch (input.command) {
      case 'serverTest':
         let t = Date.now();
         serverList.forEach((el) => {
            rst(el).then((r) => {
               console.log(r);
            });
         });
         t = Date.now() - t;
         res.json({msg: 'Api test ok at: ' + new Date() + ' Done in ' + t});
         break;
      case 'runServerTest':
         runIntVal = setInterval(st.runServerTest, 10000);
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