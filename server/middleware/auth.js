const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    const error = new Error('No token provided');
    error.statusCode = 401;
    return next(error);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error('Invalid token');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = auth;
