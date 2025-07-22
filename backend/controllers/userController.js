import catchAsyncError from "../middlewares/catchAsyncError.js";
import { User } from "../model/userModel.js";

export const registerUseer = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT token
  const token = user.getJWTToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    token,
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Generate JWT token
  const token = user.getJWTToken();

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user,
    token,
  });
});
