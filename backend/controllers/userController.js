import catchAsyncError from "../middlewares/catchAsyncError.js";
import { User } from "../model/userModel.js";
import { getResetPasswordTemplate } from "../utills/emailTemplates.js";
import ErrorHandler from "../utills/errorHandler.js";
import sendToken from "../utills/sendToken.js";
import sendEmail from "../utills/sendEmails.js";
import crypto from "crypto";

export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate JWT token
  sendToken(user, 201, res);
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

  sendToken(user, 200, res);
});

// logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
// forgot password

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Generate reset token and set expiry
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // important!

  // Construct reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Dinah Mall Password Recovery",
      html: message, // ✅ use `html` for HTML content
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    // Rollback token fields if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// reset password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});
//  get current user profile
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update user Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // Check if old password is correct
  const isMatch = await user.comparePassword(req.body.oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Set new password
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//  update user profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// get all users => ADMIN
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// get user details by id => ADMIN
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update user details => ADMIN
export const updateUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  const { name, email, role } = req.body;
  user.name = name;
  user.email = email;
  user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    user,
  });
});
// Delete user => ADMIN
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
