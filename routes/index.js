var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  request('http://henri-potier.xebia.fr/books', function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return res.sendStatus(500);
    }
    res.render('index', { title: 'Xebia-front', books: JSON.parse(body)});
  });
});

router.get('/panier', function(req, res, next) {
  var panier = JSON.parse(req.cookies.panier);
  res.render('panier', {books: panier.products});
});


module.exports = router;
