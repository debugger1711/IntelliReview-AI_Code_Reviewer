// Custom error class for operational errors (expected errors we can handle)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // flag to distinguish from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
