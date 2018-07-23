const express = require('express');
const Campground = require('../models/campground');;
const Comment = require('../models/comment');
const User = require('../models/user');
const router = express.Router({
  mergeParams: true
});
//comments new route
router.get('/new', isLoggedIn, (req, res) => {
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

//comments index route
router.post('/', isLoggedIn, function (req, res) {
  let id = req.params.id;
  Campground.findById(id, function (err, foundId) {
    if (err) {
      console.log(err);
    } else {
      Comment.create({
        author: req.user.username,
        content: req.body.content
      }, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          foundId.comments.push(newComment);
          console.log('**************************************');
          User.findById(req.user._id, function (err, foundUser) {
            if (err) {
              console.log(err);
            } else {
              foundUser.comments.push(newComment);
              foundUser.save(function (err, success) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Comment added to user successfully');
                }
              });
            }
          });
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;