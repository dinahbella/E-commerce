import express from "express";
import {
  forgotPassword,
  login,
  logout,
  registerUseer,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(registerUseer);
router.route("/login").post(login); // Assuming you have a login function in userController.js
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword); // Assuming you have a forgotPassword function in userController.js
export default router;
