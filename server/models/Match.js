// Match.js: MongoDB's schema for storing successful matches between users

const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdAt:  { type: Date, default: Date.now },
});

// Validate & sort the two IDs to enforce order
matchSchema.pre('validate', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('Match must have exactly 2 users'));
  }
  this.users = this.users
    .map(id => id.toString())
    .sort()
    .map(id => new mongoose.Types.ObjectId(id));
  next();
});

// Unique compound index so A–B and B–A can’t both exist
matchSchema.index(
  { 'users.0': 1, 'users.1': 1 },
  { unique: true }
);

// Index for faster queries
matchSchema.index({ users: 1 });
matchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema); 