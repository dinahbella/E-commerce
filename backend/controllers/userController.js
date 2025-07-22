import catchAsyncError from "../middlewares/catchAsyncError.js";
import { User } from "../model/userModel.js";
import { getResetPasswordTemplate } from "../utills/emailTemplates.js";
import ErrorHandler from "../utills/errorHandler.js";
import sendToken from "../utills/sendToken.js";
import sendEmail from "../utills/sendEmails.js";

export const registerUseer = catchAsyncError(async (req, res, next) => {
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
