const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the admin in the database and attach to the request object
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token was found at all
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// --- අලුතින් එකතු කළ Role-based Authorization කොටස ---
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the current admin's role is in the allowed roles array
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Your role (${req.admin?.role || 'Unknown'}) is not authorized to perform this action.`
      });
    }
    next();
  };
};

module.exports = { protectAdmin, authorizeRoles };