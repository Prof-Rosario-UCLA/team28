// Match.js: MongoDB's schema for storing successful matches between users

const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure users array always has exactly 2 users (the ones who matched)
matchSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    next(new Error('Match must have exactly 2 users'));
  }
  next();
});

// Index for faster queries
matchSchema.index({ users: 1 });
matchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema); 