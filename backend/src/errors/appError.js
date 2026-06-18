/**
 * Custom Error Class for the application.
 * This class extends the built-in Node.js 'Error' class.
 * It helps to create formatted and predictable error objects to be sent to the Global Error Handler.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    // Pass the error message to the parent 'Error' class
    super(message);
    
    // Set the HTTP status code (e.g., 400 for Bad Request, 404 for Not Found)
    this.statusCode = statusCode;
    
    // Automatically set the status string based on the status code:
    // If the code starts with '4' (e.g., 400, 404), it's a client failure ('fail').
    // Otherwise (e.g., 500), it's a server error ('error').
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    
    // Mark this error as 'operational'.
    // Operational errors are predictable errors (like invalid inputs or missing data).
    // This helps the system distinguish between known errors and unknown programming bugs.
    this.isOperational = true;
    
    // Capture the stack trace (the exact file and line where the error happened).
    // 'this.constructor' prevents the AppError class itself from appearing in the stack trace, keeping the logs clean.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;