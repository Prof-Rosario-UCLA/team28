// Like.js: track one‐sided “likes” between users

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  liker: {// the user who did the liking
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  liked: {// the user being liked
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

//Prevent duplicate “A likes B” docs
likeSchema.index({ liker: 1, liked: 1 }, { unique: true });
//index for seeing who liked me
likeSchema.index({ liked: 1 });
module.exports = mongoose.model('Like', likeSchema);
