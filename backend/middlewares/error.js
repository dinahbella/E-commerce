export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error for debugging
  console.error(`Error: ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
