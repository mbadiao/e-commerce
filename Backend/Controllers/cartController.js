import asyncHandler from "express-async-handler";
import Cart from "../Models/CartModels.js";
import Product from "../Models/productModel.js";

// Add a product to the user's cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size } = req.body;
  const userId = req.user._id;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the cart exists for the user
  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    // If the cart exists, check if the product with the same size is already in the cart
    const productIndex = cart.products.findIndex((p) => 
      p.product.toString() === productId && p.size === size
    );
    
    if (productIndex > -1) {
      // If the product is already in the cart, update the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // Otherwise, add the product to the cart
      cart.products.push({ product: productId, quantity, size });
    }
  } else {
    // If the cart does not exist, create a new cart for the user
    cart = new Cart({
      user: userId,
      products: [{ product: productId, quantity, size }],
    });
  }

  // Save the cart
  const updatedCart = await cart.save();
  res.status(201).json(updatedCart);
});

// Get the cart of a user
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("products.product");
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  res.status(200).json(cart.products);
});

const deleteProductFromCart = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.user._id;

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the product in the cart and remove it
  cart.products = cart.products.filter(
    (item) => !(item.product.toString() === productId && item.size === size)
  );

  // Save the updated cart
  const updatedCart = await cart.save();
  res.status(200).json(updatedCart);
});

export { addToCart, getCart, deleteProductFromCart };
