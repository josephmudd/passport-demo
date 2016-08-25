var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {user: req.user || {}});
});


router.get('/profile', function(req, res) {
  if(req.user) {
    res.render('profile',{user: req.user});
  } else {
    res.redirect("/auth/login/github");
  }
  
});

module.exports = router;