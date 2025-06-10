/**
 * Main server entry point for the backend
 *   - initializes Express server
 *   - sets up middleware
 *   - establishes database connections (MongoDB and Redis)
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

// DB 
const { connectMongoDB, redis} = require('./config/database');

// Route imports
const matchRoutes = require('./routes/matches');
const userRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const potentialRoutes = require('./routes/potential');
const likeRoutes = require('./routes/like'); 

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Route mounting
app.use('/api/matches', matchRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/potential', potentialRoutes);
app.use('/api/like', likeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connectMongoDB();
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
})();
