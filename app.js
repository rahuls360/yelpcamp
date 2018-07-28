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
const methodOverride = require('method-override');
const flash = require('connect-flash');

//Require routes
const authRoute = require('./routes/auth');
const commentRoute = require('./routes/comment');
const indexRoute = require('./routes/index');

// seedDB();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));
app.use(flash());

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});



app.use(authRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/campgrounds", indexRoute);

//Connect to DB
mongoose.connect(process.env.DATABASENAME);

//Homepage route
app.get('/', (req, res) => {
  console.log(req.user);
  res.render('landing-page');
});

app.listen(process.env.PORT, function () {
  console.log('Listening');
});