const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Mongoose Cast Errors
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    status = 400;
    message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum limit of 5MB';
    }
  }

  logger.error(`${status} - ${message}`, err);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
