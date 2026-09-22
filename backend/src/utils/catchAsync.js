/**
 * Async Error Catching Wrapper (catchAsync)
 * 
 * Description:
 * This is a utility function used to wrap asynchronous Express route handlers and controllers.
 * It automatically catches any errors (rejected promises) that occur inside an async function
 * and passes them to the Global Error Handling Middleware using 'next'.
 * This removes the need to write repetitive 'try-catch' blocks in every controller.
 */
const catchAsync = (fn) => {
  // Return a standard Express middleware function
  return (req, res, next) => {
    // Execute the original async function (fn).
    // If the function throws an error, the '.catch(next)' part immediately catches it
    // and sends it to the global error handler.
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;