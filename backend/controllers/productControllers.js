import { Product } from "../model/productModel.js";

export const getProducts = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All Products",
  });
};
//  create new product
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};
