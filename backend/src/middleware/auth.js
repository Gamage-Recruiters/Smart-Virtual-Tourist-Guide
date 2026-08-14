import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

const readToken = (req) => {
  const authorization = req.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : null;
};

const resolveUser = async (req, required) => {
  const token = readToken(req);
  if (!token) {
    if (required) throw new AppError('Not authorized, no token provided.', 401, 'UNAUTHENTICATED');
    return null;
  }
  if (!process.env.JWT_SECRET) throw new AppError('Authentication is not configured.', 500, 'AUTH_NOT_CONFIGURED');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Not authorized, token expired.' : 'Not authorized, token failed.';
    throw new AppError(message, 401, error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN');
  }

  // Stable_Version_V4 signs { id: user._id }.
  if (!decoded.id) throw new AppError('Not authorized, token payload is invalid.', 401, 'INVALID_TOKEN');
  const user = await User.findById(decoded.id).select('-password');
  if (!user || user.active === false) throw new AppError('User not found, unauthorized.', 401, 'ACCOUNT_UNAVAILABLE');
  req.user = user;
  return user;
};

const protect = async (req, res, next) => {
  try {
    await resolveUser(req, true);
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    await resolveUser(req, false);
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError('Not authorized.', 401, 'UNAUTHENTICATED'));
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Role (${req.user.role}) is not allowed to access this resource.`, 403, 'FORBIDDEN'));
  }
  return next();
};

export {
  protect,
  protect as authenticate,
  optionalAuthenticate,
  authorizeRoles,
  authorizeRoles as requireRole,
};
