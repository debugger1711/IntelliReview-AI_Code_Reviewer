// Wraps async functions so we don't need try/catch in every controller
// Any thrown error is automatically passed to Express error middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
