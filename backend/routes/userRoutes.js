import express from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login); // Assuming you have a login function in userController.js
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword); // Assuming you have a forgotPassword function in userController.js
router.route("/password/reset/:token").put(resetPassword); // Assuming you have a resetPassword function in userController.js
export default router;
