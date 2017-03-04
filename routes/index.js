var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
   console.log({location: 'index.js::router.get (req.params): ', msg: req.params});
   res.render('index', {         // pass vars to the render template
      pageTitle: 'Home',
      pageID: 'home'
   });
});

module.exports = router;