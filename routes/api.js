var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var runIntVal = null;
var wss = null;

function runServerTest() {
   var t = new Date();
   var tString = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + ':' + t.getMilliseconds();
   console.log(tString + ' Running Server test');
   wss.clients.forEach(function each(client) {
      client.send('\n' + tString + ' Running Server test');
   });
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
   var input = req.body;
   if(!wss) {
      wss = req.app.get('wss');
   }

   switch (input.command) {
      case 'serverTest':
         res.json({msg: 'Api test ok at: ' + new Date()});
         break;
      case 'runServerTest':
         runIntVal = setInterval(runServerTest, 10000);
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