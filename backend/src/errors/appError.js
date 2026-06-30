/**
 * Custom Error Class for the application.
 * 
 * Extends the built-in Node.js 'Error' class to create formatted 
 * and predictable error objects for the Global Error Handler.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
