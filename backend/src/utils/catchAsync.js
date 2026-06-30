/**
 * Async Error Catching Wrapper (catchAsync)
 * 
 * Wraps asynchronous Express route handlers to automatically catch errors
 * and pass them to the Global Error Handling Middleware using 'next'.
 * Removes the need for repetitive try-catch blocks in controllers.
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); 
  };
};
