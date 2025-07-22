export default (user, statusCode, res) => {
  const token = user.getJWTToken();

  // ✅ Parse JWT_EXPIRE as an integer (number of days)
  const days = parseInt(process.env.JWT_EXPIRE, 10) || 7; // fallback to 7 days

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax", // optional but helps CSRF
    secure: process.env.NODE_ENV === "PRODUCTION", // secure cookies in prod
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: "User logged in successfully",
    user,
    token,
  });
};
