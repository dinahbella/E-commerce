import express from "express";
import { login, registerUseer } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(registerUseer);
router.route("/login").post(login); // Assuming you have a login function in userController.js
export default router;
