import jwt from "jsonwebtoken";
import User from "../model/userModel.js"; // ✅ Ensure correct path
import ErrorHandler from "../utills/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request object
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});
