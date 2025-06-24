import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  // let token = req.headers.authorization?.split(" ")[1];
  // if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = await User.findById(decoded.id).select('-password');
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ message: 'Token failed' });
  // }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin ) next();
  else res.status(403).json({ message: 'Access denied: Admins only' });
};
