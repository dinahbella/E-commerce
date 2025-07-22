import catchAsyncError from "../middlewares/catchAsyncError.js";
import { Product } from "../model/productModel.js"; // ✅ Use default import
import APIFilters from "../utills/apiFilters.js";
import ErrorHandler from "../utills/errorHandler.js";

const resPerPage = 10;

// 📦 GET All Products (with search, filter, pagination)
export const getProducts = catchAsyncError(async (req, res) => {
  const apiFilters = new APIFilters(Product, req.query);
  apiFilters.search().filters().pagination(resPerPage);

  const products = await apiFilters.query;
  const filteredProductsCount = products.length;
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    success: true,
    message: "All Products",
    totalProducts,
    filteredProductsCount,
    resPerPage,
    products,
  });
});

// ➕ CREATE New Product
export const createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// 🔍 GET Product by ID
export const getProductById = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
  });
});

// ✏️ UPDATE Product
export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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
});

// ❌ DELETE Product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
