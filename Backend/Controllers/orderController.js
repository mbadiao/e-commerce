import Order from "../Models/orderModel.js";
import asyncHandler from "express-async-handler";
import {addNotification } from "../Controllers/notificationControllers.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;
  // on vérifie si la commande contient des produits
  if (products && products.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
    });
    // on sauvegarde la commande
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = "Done";
    order.paidAt = Date.now();
    // on envoie une notification au client
    addNotification({
      user: order.user,
      message: `Your order has been paid`,
    });
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.status === "Pending") {
      res.status(400);
      throw new Error("Order not paid yet");
    }
    order.status = "Delivered";
    order.deliveredAt = Date.now();
    // on envoie une notification au client
    addNotification({
      user: order.user,
      message: `Your order has been delivered`,
    });
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (order) {
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrders,
  getAdminOrders,
  markOrderAsPaid,
  markOrderAsDelivered,
  deleteOrder,
};
