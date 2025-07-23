import ErrorHandler from "../utills/errorHandler.js";

export default (err, req, res, next) => {
  // Clone original error to safely mutate
  let error = { ...err };
  error.message = err.message;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    error = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = new ErrorHandler(`Duplicate field value: ${field}`, 400);
  }

  // Handle JWT errors (optional)
  if (err.name === "JsonWebTokenError") {
    error = new ErrorHandler("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorHandler(
      "Your token has expired. Please log in again.",
      401
    );
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Logging
  console.error("Error:", message);

  // Response based on environment
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "DEVELOPMENT" && { stack: error.stack }),
  });
};
