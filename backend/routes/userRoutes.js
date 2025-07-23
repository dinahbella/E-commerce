import express from "express";
import {
  forgotPassword,
  getUserProfile,
  login,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
} from "../controllers/userController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
export default router;
