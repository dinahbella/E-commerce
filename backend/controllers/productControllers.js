import catchAsyncError from "../middlewares/catchAsyncError.js";
import { Product } from "../model/productModel.js";
import ErrorHandler from "../utills/errorHandler.js";

export const getProducts = catchAsyncError(async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      message: "All Products",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

//  create new product
export const createProduct = catchAsyncError(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

//  get product by id
export const getProductById = catchAsyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Ensure ErrorHandler is imported
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
  });
});

// update product
export const updateProduct = catchAsyncError(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404)); // Ensure ErrorHandler is imported
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// Delete product
export const deleteProduct = catchAsyncError(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404)); // Ensure ErrorHandler is imported
    }

    await product.deleteOne(); // or use Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});
