/* server/middleware/authMiddleware.js */

const jwt = require('jsonwebtoken');
const userSchema = require('../models/User').schema;

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, global.secretKey);
    req.user = decoded;

    const User = req.dbConnection.model('User', userSchema);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
