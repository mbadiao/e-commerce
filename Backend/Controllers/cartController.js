import asyncHandler from "express-async-handler";
import Cart from "../Models/CartModels.js";
import Product from "../Models/productModel.js";
// Ajouter un produit au panier de l'utilisateur
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.body.user; 


  // Vérifiez si le produit existe
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Vérifiez si le panier existe pour l'utilisateur
  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    // Si le panier existe, vérifiez si le produit est déjà dans le panier
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
    
    if (productIndex > -1) {
      // Si le produit est déjà dans le panier, mettez à jour la quantité
      cart.products[productIndex].quantity += quantity;
    } else {
      // Sinon, ajoutez le produit au panier
      cart.products.push({ product: productId, quantity });
    }
  } else {
    // Si le panier n'existe pas, créez un nouveau panier pour l'utilisateur
    cart = new Cart({
      user: userId,
      products: [{ product: productId, quantity }],
    });
  }

  // Enregistrez le panier
  const updatedCart = await cart.save();
  res.status(201).json(updatedCart);
});

// Récupérer le panier d'un utilisateur
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("products.product");
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }
  res.status(200).json(cart.products);
});

export { addToCart, getCart };
