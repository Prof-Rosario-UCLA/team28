/**
 * Main server entry point for the backend
 *   - initializes Express server
 *   - sets up middleware
 *   - establishes database connections (MongoDB and Redis)
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// DB 
const { connectMongoDB, redis} = require('./config/database');

// Route imports
const matchRoutes = require('./routes/matches');
const userRoutes = require('./routes/profile');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route mounting
app.use('/api/matches', matchRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/auth', require('./routes/auth'));


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
