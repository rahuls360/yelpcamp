const mongoose = require('mongoose');
const Campgrounds = require('./models/campground');
const Comment = require('./models/comment');

let data = [{
    name: 'John',
    image: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg',
    description: 'Molasses and Blue Tent next to the river'
  },
  {
    name: 'Harry',
    image: 'http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg',
    description: 'Yellow tent in the forest'
  },
  {
    name: 'Larry',
    image: 'https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
    description: 'This is just another campground'
  }
]

function seedDB() {
  //Delete all campgrounds
  Campgrounds.remove({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All existing campgrounds deleted");
      //add sample campgrounds
      data.forEach(function (individualData) {
        Campgrounds.create(individualData, function (err, sampleCampgrounds) {
          if (err) {
            console.log(err);
          } else {
            console.log("A Campground was Successfuly Created");
            console.log(sampleCampgrounds);
            //add sample comments
            Comment.create({
              content: "Hey that is an interesting blogpost! Thanks for sharing your experience, it is really helpful",
              author: "Mamulee"
            }, function (err, newComment) {
              if (err) {
                console.log(err);
              } else {
                // console.log(newComment);
                sampleCampgrounds.comments.push(newComment);
                sampleCampgrounds.save(function (err, success) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Comments added successfully");
                  }
                });
              }
            })
          }
        });
      });
    }
  });

}

module.exports = seedDB;