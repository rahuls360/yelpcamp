const mongoose = require('mongoose');
//Create Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

//Create Model
module.exports = mongoose.model('Campground', campgroundSchema);