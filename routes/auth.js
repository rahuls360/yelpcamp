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

router.post('/register', (req, res) => {
  console.log("Working");
  User.register(new User({
    username: req.body.username
  }), req.body.password, (err, newUser) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "User created successfully");
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
  req.flash('success', "Successfully signed out");
  res.redirect('/');
});

module.exports = router;