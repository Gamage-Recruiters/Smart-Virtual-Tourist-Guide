import jwt from 'jsonwebtoken';
import User from '../models/User.js';
//  NEW ADDITION: Import the Admin model so we can check for admins too
import Admin from '../models/Admin/Admin.js'; 

export const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header starting with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the actual token string by splitting the header
      token = req.headers.authorization.split(' ')[1];

      // Verify if the token is valid using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✨ NEW ADDITION START: Check both User and Admin collections ✨

      // 1. First, try to find a regular User using the ID from the token
      let currentUser = await User.findById(decoded.id).select('-password');

      // 2. If a regular User is not found, try to find an Admin using the same ID
      if (!currentUser) {
        currentUser = await Admin.findById(decoded.id).select('-password');
      }

      // 3. If neither a User nor an Admin is found, stop and send an error
      if (!currentUser) {
        return res.status(401).json({ 
          success: false, 
          message: 'User or Admin not found, unauthorized' 
        });
      }

      // 4. Save the found user/admin details to req.user for the next steps
      req.user = currentUser;

      //NEW ADDITION END 

      // Check if the account has a status field and if it is active
      if (req.user.status && req.user.status !== 'Active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active. Please contact support.',
        });
      }

      // Move to the next function (the controller)
      next();
    } catch (error) {
      // If the token is fake or expired, catch the error here
      console.error('JWT Verification Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If there is no token at all, stop and send an error
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Authorize roles
// This checks if the logged-in person has the correct role (e.g., 'Administrator', 'HotelOwner')
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // If nobody is logged in, send an error
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    // If the logged-in user's role is not in the allowed roles list, send a permission error
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    
    // Move to the next function if the role is allowed
    next();
  };
};