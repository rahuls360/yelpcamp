const express = require('express');
const Campground = require('../models/campground');
const router = express.Router({
  mergeParams: true
});

//Index route
router.get('/', (req, res) => {
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

//new route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('new');
});

//create route
router.post('/', isLoggedIn, (req, res) => {
  let body = req.body;
  Campground.create({
    name: req.user.username,
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

//show route
router.get('/:id', (req, res) => {
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

router.get('/:id/edit', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function (err, foundId) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit', {
        campground: foundId
      });
    }
  })
});

router.put('/:id', (req, res) => {
  let data = {
    name: req.body.name,
    image: req.body.img,
    description: req.body.description
  };
  Campground.findByIdAndUpdate(req.params.id, data, function (err, updatedId) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

router.delete('/:id', isLoggedIn, (req, res) => {
  Campground.findOneAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  })
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// function checkUserAuthorization(req, res, next){
//   Campground.findById(req.params.id, function(err, foundId){
//     console.log(req.user._id);
//     console.log();
//   });
// }

module.exports = router;