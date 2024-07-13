import Order from "../Models/orderModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    user: req.user._id,
    products,
    totalAmount,
    shippingAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});


export {
  addOrderItems,
  getOrders,
};
