import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; 
  let statusText = err.status || 'error'; 
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum limit of 5MB';
    }
  }

  logger.error(`${statusCode} - ${message}`, err);

  res.status(statusCode).json({
    success: false,
    status: statusText, 
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;