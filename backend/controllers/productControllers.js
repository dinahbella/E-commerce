import catchAsyncError from "../middlewares/catchAsyncError.js";
import { Product } from "../model/productModel.js";
import APIFilters from "../utills/apiFilters.js";
import ErrorHandler from "../utills/errorHandler.js";

const resPerPage = 10; // ✅ define or import it if dynamic

export const getProducts = catchAsyncError(async (req, res) => {
  const apiFilters = new APIFilters(Product, req.query);

  apiFilters.search();
  apiFilters.filters();
  apiFilters.pagination(resPerPage);

  const products = await apiFilters.query;
  const filteredProductsCount = products.length;

  const totalProducts = await Product.countDocuments(); // for all products, without filters

  res.status(200).json({
    success: true,
    message: "All Products",
    totalProducts,
    filteredProductsCount,
    resPerPage,
    products,
  });
});

//  create new product
export const createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id; // Attach the user ID to the product
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
