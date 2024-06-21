const jwt = require('jsonwebtoken');
const User = require('../Server/models/user');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Token received:', token); // Log the received token

  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded); // Log the decoded token
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err); // Log the error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
