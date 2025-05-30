// User.js: MongoDB's schema for the user collection

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    age: String,
    occupation: String,
    location: String,
    moveInDate: String,
    budget: String,
    preferredLocation: String,
    roomType: String,
    leaseLength: String,
    smoking: String,
    pets: String,
    cleanliness: String,
    noiseLevel: String,
    workSchedule: String,
    guests: String,
    bio: String,
    interests: [String],
    contact: {
      email: String,
      phone: String,
      instagram: String
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema); 