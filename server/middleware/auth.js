const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!verified.userId) {
        return res.status(401).json({ message: 'Invalid token: no user ID' });
      }

      req.user = {
        userId: verified.userId,
        email: verified.email
      };
      
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

module.exports = auth; 