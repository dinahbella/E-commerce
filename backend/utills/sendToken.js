export default (user, statuscode, res) => {
  const token = user.getJWTToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    message: "User logged in successfully",
    user,
    token,
  });
};
