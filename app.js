const express = require("express");
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');
const Comment = require('./models/comment');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const User = require('./models/user');

seedDB();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//PASSPORT CONFIGURATION
app.use(expressSession({
  secret: "This is used for encrpt and decrypt",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.newUser = req.user;
  next();
});

//Connect to DB
mongoose.connect('mongodb://localhost:27017/yelp_camp');



// Campground.create({
//   name: "Larry",
//   image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1"
// }, function (err, obj) {
//   if (err) {
//     console.log("Error");
//     console.log(err);
//   } else {
//     console.log('Success');
//     console.log(obj);
//   }
// });


app.get('/', (req, res) => {
  console.log(req.user);
  res.render('landing-page');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({}, function (err, obj) {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      console.log("Find success");
      console.log(obj);
      res.render('index', {
        campgroundsList: obj
      });
    }
  });

});

app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('new');
});

app.post('/campgrounds', isLoggedIn, (req, res) => {
  let body = req.body;
  Campground.create({
    name: req.body.name,
    image: req.body.img,
    description: req.body.description
  }, function (err, newlyAddedCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log("Added successfully");
    }
  });
  res.redirect('/campgrounds')
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec(function (err, successfullyFoundId) {
    if (err) {
      console.log(err);
    } else {
      console.log(successfullyFoundId);
      res.render('show', {
        campground: successfullyFoundId
      });
    }
  });
});

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  let id = req.params.id;
  console.log(id);
  Campground.findById(id, function (err, foundId) {
    if (err) {
      console.log(err);
    } else {
      res.render('new-comment', {
        campground: foundId
      });
    }
  })
});

app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
  let id = req.params.id;
  Campground.findById(id, function (err, foundId) {
    if (err) {
      console.log(err);
    } else {
      Comment.create({
        author: req.body.author,
        content: req.body.content
      }, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          foundId.comments.push(newComment);
          foundId.save(function (err, addedComment) {
            if (err) {
              console.log(err);
            } else {
              console.log(addedComment);
              console.log("Yes Im here");
              res.redirect('/campgrounds/' + id);
            }
          });
        }
      })
    }
  });
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', isLoggedIn, (req, res) => {
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

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login'
}), (req, res) => {

});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Listening');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}