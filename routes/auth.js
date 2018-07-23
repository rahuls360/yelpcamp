const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router({
  mergeParams: true
});

//Authentication Routes
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', isLoggedIn, (req, res) => {
  User.register(new User({
    username: req.body.username
  }), req.body.password, (err, newUser) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/campgrounds');
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login'
}), (req, res) => {

});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;