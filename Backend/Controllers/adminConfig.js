import Product from '../Models/productModel.js';
import User from '../Models/userModel.js';
import Order from '../Models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { config } from 'dotenv';
config();

// USERS

// @desc Get all user count
// @route GET /api/users/count
// @access Private/Admin
const getAllUserCount = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  res.json({ count: userCount });
});

// PRODUCTS

// @desc Add a product
// @route POST /api/products
// @access Private/Admin
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, imageUrl } = req.body;
  const image = `${process.env.IMAGE_ENDPOINT}${process.env.IMAGE_BUCKET_ID}/files/${imageUrl}/view?project=${process.env.IMAGE_PROJECT_ID}`;
  
  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      imageUrl: image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;
  const { file } = req;

  let updatedFields = {
    name,
    price,
    description,
    category,
    stock,
  };

  if (file) {
    const fileName = `${file.originalname}`;
    updatedFields.imageUrl = `/images/${fileName}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(updatedProduct);
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// ORDERS

// @desc Get all orders (admin)
// @route GET /api/admin/orders
// @access Private/Admin
const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id firstName lastName');
  res.json(orders);
});

// @desc Mark order as delivered
// @route PUT /api/admin/orders/:id/deliver
// @access Private/Admin
const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = 'Delivered';
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save().populate('user', 'id firstName lastName');
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

  export {
    getAllUserCount,
    addProduct,
    updateProduct,
    deleteProduct,
    getAdminOrders,
    markOrderAsDelivered,
  };