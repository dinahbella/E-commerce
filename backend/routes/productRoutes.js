import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(createProduct);

export default router;
