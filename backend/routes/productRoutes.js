import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(createProduct);
router.route("/products/:id").get(getProductById);
router.route("/admin/products/:id").put(updateProduct);
export default router;
