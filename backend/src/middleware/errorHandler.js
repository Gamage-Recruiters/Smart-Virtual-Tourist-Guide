import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const status = err.name === 'CastError' ? 400 : err.name === 'ValidationError' ? 400 : err.status || 500;
  const message = err.name === 'CastError'
    ? 'Invalid resource identifier'
    : err.name === 'ValidationError'
      ? Object.values(err.errors || {}).map((item) => item.message).join(', ') || 'Validation failed'
      : status >= 500 && process.env.NODE_ENV !== 'development'
        ? 'The server could not complete the request'
        : err.message || 'Internal Server Error';

  logger.error(`${status} - ${message}`);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
