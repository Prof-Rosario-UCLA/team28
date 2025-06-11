const mongoose = require('mongoose');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { createClient } = require('redis');
require('dotenv').config();

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Qdrant Connection
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY
});

// Redis Connection
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: false
});

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Client Connected'));

const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
      console.log('Redis connected successfully');
    }
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
};

module.exports = {
  connectMongoDB,
  connectRedis,
  qdrant,
  redis
}; 