import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body contains invalid JSON.';
    code = 'INVALID_JSON';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((item) => item.message).join(', ');
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format.';
    code = 'INVALID_ID';
  } else if (err.code === 11000) {
    status = 409;
    message = 'A conflicting record already exists.';
    code = 'DUPLICATE_RECORD';
  }

  logger.error(`${status} - ${message}`);

  res.status(status).json({
    success: false,
    status,
    message,
    code,
    ...(status < 500 && err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
