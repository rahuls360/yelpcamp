const Campground = require('../models/campground');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "Please login first");
  res.redirect('/login');
}



function checkUserAuthorization(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundId) {
      if (req.user._id.equals(foundId.author.id)) {
        next();
        console.log("User authorized");
      } else {
        req.flash("error", "You are not authorized to do that");
        console.log("User not authorized");
        res.redirect('/campgrounds');
      }
    });
  }
}

module.exports = {
  isLoggedIn,
  checkUserAuthorization
};