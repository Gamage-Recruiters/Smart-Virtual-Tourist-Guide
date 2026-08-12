const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const SESSION_COOKIE_NAME = 'adminSession';

const getCookie = (req, name) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [rawKey, ...rawValue] =
      cookie.trim().split('=');

    if (rawKey === name) {
      return decodeURIComponent(
        rawValue.join('=')
      );
    }
  }

  return null;
};

const protectAdmin =
  async (req, res, next) => {
    try {
      const token = getCookie(
        req,
        SESSION_COOKIE_NAME
      );

      if (!token) {
        return res.status(401).json({
          success: false,
          message:
            'Not authorized. Please log in.',
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const admin =
        await Admin.findById(
          decoded.id
        ).select('-password');

      if (!admin) {
        return res.status(401).json({
          success: false,
          message:
            'Administrator account no longer exists.',
        });
      }

      /*
       * IMPORTANT:
       * We deliberately require Active,
       * rather than testing a nonexistent
       * `isActive` property.
       */
      if (admin.status !== 'Active') {
        return res.status(403).json({
          success: false,
          message:
            'Your administrator account is suspended.',
        });
      }

      req.admin = admin;

      return next();
    } catch (error) {
      if (
        error.name ===
        'TokenExpiredError'
      ) {
        return res.status(401).json({
          success: false,
          message:
            'Session expired. Please log in again.',
        });
      }

      return res.status(401).json({
        success: false,
        message:
          'Invalid session. Please log in again.',
      });
    }
  };

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (
      !req.admin ||
      !roles.includes(req.admin.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You do not have permission to perform this action.',
      });
    }

    return next();
  };
};

module.exports = {
  protectAdmin,
  authorizeRoles,
  SESSION_COOKIE_NAME,
};