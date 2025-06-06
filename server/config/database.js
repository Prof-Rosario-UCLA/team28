const mongoose = require('mongoose');
const Redis = require('ioredis');
const { QdrantClient } = require('@qdrant/js-client-rest');

// MongoDB Configuration
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomiematch');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// // Redis Configuration
// const redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD,
// });

// redis.on('connect', () => {
//   console.log('Redis connected successfully');
// });

// redis.on('error', (error) => {
//   console.error('Redis connection error:', error);
// });

// Qdrant Configuration
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY,
});

module.exports = {
  connectMongoDB,
  //redis,
  qdrant,
}; 