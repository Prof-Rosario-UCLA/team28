// User.js: MongoDB's schema for the user collection

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profile: {
    // Basic Info
    age: { type: String },
    occupation: { type: String },
    location: { type: String },
    moveInDate: { type: String },
    
    // Living Preferences
    budget: { type: String },
    preferredLocation: { type: String },
    roomType: { 
      type: String,
      enum: ['private', 'shared', 'flexible']
    },
    leaseLength: { type: String },
    
    // Lifestyle
    smoking: { 
      type: String,
      enum: ['yes', 'no', 'sometimes']
    },
    pets: { 
      type: String,
      enum: ['yes', 'no', 'flexible']
    },
    cleanliness: { 
      type: String,
      enum: ['very clean', 'moderate', 'relaxed']
    },
    noiseLevel: { 
      type: String,
      enum: ['quiet', 'moderate', 'social']
    },
    
    // Schedule
    workSchedule: { 
      type: String,
      enum: ['9-5', 'night shift', 'flexible']
    },
    guests: { 
      type: String,
      enum: ['rarely', 'sometimes', 'often']
    },
    
    // Additional Info
    bio: { type: String },
    interests: [{
      type: String,
      enum: ['Reading', 'Gaming', 'Sports', 'Music', 'Cooking', 'Travel', 'Art', 'Fitness', 'Movies', 'Photography']
    }],
    contact: {
      email: { type: String },
      phone: { type: String },
      instagram: { type: String }
    },
    additionalNotes: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema); 