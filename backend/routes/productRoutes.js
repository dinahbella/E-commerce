import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(createProduct);
router.route("/products/:id").get(getProductById);
export default router;
