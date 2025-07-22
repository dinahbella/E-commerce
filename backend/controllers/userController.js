import catchAsyncError from "../middlewares/catchAsyncError.js";
import { User } from "../model/userModel.js";

export const registerUseer = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});
