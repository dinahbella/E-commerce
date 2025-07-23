import express from "express";
import { createOrder } from "../controllers/orderControllers";

const router = express.Router();

router.route("/create").post(createOrder);

export default router;
