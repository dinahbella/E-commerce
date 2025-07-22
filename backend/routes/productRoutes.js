import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProducts);
router.route("/admin/products").post(createProduct);
router.route("/products/:id").get(getProductById);
router.route("/admin/products/:id").put(updateProduct);
router.route("/admin/products/:id").delete(deleteProduct);
export default router;
