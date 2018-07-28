const express = require('express');
const Campground = require('../models/campground');;
const Comment = require('../models/comment');
const User = require('../models/user');
const router = express.Router({
  mergeParams: true
});
const middleware = require('../middleware');

//comments new route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  let id = req.params.id;
  console.log(id);
  Campground.findById(id, function (err, foundId) {
    if (err) {
      console.log(err);
      req.flash("error", "Failed to find campground");
      res.redirect("/");
    } else {
      res.render('new-comment', {
        campground: foundId
      });
    }
  })
});

//comments index route
router.post('/', middleware.isLoggedIn, function (req, res) {
  let id = req.params.id;
  Campground.findById(id, function (err, foundId) {
    if (err) {
      console.log(err);
      req.flash("error", "Failed to find campground");
      res.redirect("/");
    } else {
      console.log(foundId);
      Comment.create({
        content: req.body.content,
        author: {
          id: req.user._id,
          username: req.user.username
        }
      }, function (err, newComment) {
        if (err) {
          console.log(err);
          req.flash("error", "Failed to add comment");
          res.redirect("/");
        } else {
          console.log(newComment);
          foundId.comments.push(newComment);
          foundId.save(function (err, success) {
            if (err) {
              console.log(err);
              req.flash("error", "Unable to add comment");
              res.redirect("/");
            } else {
              console.log("Comment added");
              console.log(foundId);
              req.flash("success", "Comment added successfully");
              res.redirect('/campgrounds/' + id);
            }
          });
          // console.log('**************************************');
          // User.findById(req.user._id, function (err, foundUser) {
          //   if (err) {
          //     console.log(err);
          //   } else {
          //     foundUser.comments.push(newComment);
          //     foundUser.save(function (err, success) {
          //       if (err) {
          //         console.log(err);
          //       } else {
          //         console.log('Comment added to user successfully');
          //       }
          //     });
          //   }
          // });
          // foundId.save(function (err, addedComment) {
          //   if (err) {
          //     console.log(err);
          //   } else {
          //     console.log(addedComment);
          //     console.log("Yes Im here");
          //     res.redirect('/campgrounds/' + id);
          //   }
          // });
        }
      })
    }
  });
});

module.exports = router;