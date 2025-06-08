const mongoose = require('mongoose');
const { QdrantClient } = require('@qdrant/js-client-rest');
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

// Test Qdrant connection
const testQdrantConnection = async () => {
  try {
    await qdrant.getCollections();
    console.log('Qdrant connected successfully');
  } catch (error) {
    console.error('Qdrant connection error:', error);
    throw error;
  }
};

module.exports = {
  connectMongoDB,
  //redis,
  qdrant,
  testQdrantConnection
}; 