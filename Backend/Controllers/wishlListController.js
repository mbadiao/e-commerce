import asyncHandler from "express-async-handler";
import Wishlist from "../Models/wishList.js";
import Product from "../Models/productModel.js";
import Cart from "../Models/CartModels.js";

const addTowishlist = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body;
  const userId = req.user._id;
  
  // Validate request body
  if (!productId || !size || !quantity) {
    res.status(400);
    throw new Error("Product ID, size, and quantity are required");
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the wishlist exists for the user
  let wishlist = await Wishlist.findOne({ user: userId });

  if (wishlist) {
    // If the wishlist exists, check if the product is already in the wishlist
    const wishlistIndex = wishlist.products.findIndex((p) => p.product.toString() === productId && p.size === size);
    
    if (wishlistIndex > -1) {
      // If the product with the same size is already in the wishlist, do nothing or handle accordingly
      res.status(400);
      throw new Error("Product already in wishlist with the same size");
    } else {
      // Otherwise, add the product to the wishlist
      wishlist.products.push({ product: productId, size, quantity });
    }
  } else {
    // If the wishlist does not exist, create a new wishlist for the user
    wishlist = new Wishlist({
      user: userId,
      products: [{ product: productId, size, quantity }],
    });
  }

  // Save the wishlist
  const updatedWishlist = await wishlist.save();
  res.status(201).json(updatedWishlist);
});

const getwishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wishlist = await Wishlist.findOne({ user: userId }).populate("products.product");
  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }
  res.status(200).json(wishlist.products);
});

const deleteProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.user._id;

  // Find the user's wishlist
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  // Find the product in the wishlist and remove it
  wishlist.products = wishlist.products.filter(
    (item) => !(item.product.toString() === productId && item.size === size)
  );

  // Save the updated wishlist
  const updatedWishlist = await wishlist.save();
  res.status(200).json(updatedWishlist);
});

const addProductToCartFromWishlist = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.user._id;

  // Find the user's wishlist
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  // Find the product in the wishlist
  const productInWishlist = wishlist.products.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (!productInWishlist) {
    res.status(404);
    throw new Error("Product not found in wishlist");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, products: [] });
  }

  // Check if the product already exists in the cart
  const productInCart = cart.products.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (productInCart) {
    productInCart.quantity += productInWishlist.quantity;
  } else {
    cart.products.push({
      product: productInWishlist.product,
      size: productInWishlist.size,
      quantity: productInWishlist.quantity,
    });
  }

  // Remove the product from the wishlist
  wishlist.products = wishlist.products.filter(
    (item) => !(item.product.toString() === productId && item.size === size)
  );

  // Save the updated cart and wishlist
  await cart.save();
  await wishlist.save();

  res.status(200).json({ message: "Product added to cart and removed from wishlist" });
});

export { addTowishlist, getwishlist, deleteProductFromWishlist, addProductToCartFromWishlist };