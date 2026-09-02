import jwt from 'jsonwebtoken';
import Admin from '../../models/Admin/Admin.js';

const protectAdmin = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    if (decoded.tokenType !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator session.',
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account no longer exists.',
      });
    }

    if (admin.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Your administrator account is suspended.',
      });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid session. Please log in again.';

    return res.status(401).json({ success: false, message });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action.',
    });
  }

  return next();
};

export { protectAdmin, authorizeRoles };