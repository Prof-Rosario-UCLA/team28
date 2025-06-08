const express = require('express');
const cors = require('cors');
const { connectMongoDB, testQdrantConnection } = require('./config/database');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const matchesRouter = require('./routes/matches');
const potentialRouter = require('./routes/potential');

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/potential', potentialRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Test Qdrant connection
    await testQdrantConnection();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 