import catchAsyncError from "../middlewares/catchAsyncError";
import Order from "../model/orderModel.js";

//  create new order
export const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id, // Attach the user ID to the order
  });
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});
