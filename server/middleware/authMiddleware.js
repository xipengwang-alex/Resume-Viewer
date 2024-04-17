const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {

    const decoded = jwt.verify(token.split(' ')[1], global.secretKey);
    req.user = decoded;
    //console.log('authMiddleware decoded', decoded);
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;