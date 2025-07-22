export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error for debugging
  console.error(`Error: ${message}`, err);

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // In development, send detailed error information
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    // In production, send a generic error message
    return res.status(statusCode).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
