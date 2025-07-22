import ErrorHandler from "../utills/errorHandler.js";

export default (err, req, res, next) => {
  // Handle invalid MongoDB ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
    err = new ErrorHandler(message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log for debugging
  console.error(`Error: ${message}`, err);

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // Detailed error in development
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    // Minimal info in production
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Fallback (if NODE_ENV isn't set)
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
