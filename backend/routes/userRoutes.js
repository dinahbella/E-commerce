import express from "express";
import { registerUseer } from "../controllers/userController.js";
import e from "express";

const router = express.Router();

router.route("/register").post(registerUseer);

export default router;
