import { Router } from "express";
const routes = Router();
import {
  AuthUser,
  RegisterUser,
  googleAuth,
  logout,
  callbackProvider,
} from "../Controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import admin from "../middlewares/adminMiddleware.js";

import { addOrderItems, getOrders } from "../Controllers/orderController.js";

import addReview from "../Controllers/reviewsCotroller.js";
import userProfile from "../Controllers/profileCOntroller.js";
import {
  getProducts,
  getProductById,
} from "../Controllers/productController.js";
import { getNotifications } from "../Controllers/notificationControllers.js";
import {
  addToCart,
  getCart,
  deleteProductFromCart,
} from "../Controllers/cartController.js";
import resetPassWord from "../Controllers/resetpasswordController.js";
import verifyResetToken from "../Controllers/verifyResetToken.js";
import {
  addTowishlist,
  getwishlist,
  deleteProductFromWishlist,
  addProductToCartFromWishlist,
} from "../Controllers/wishlListController.js";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  markOrderAsDelivered,
  getAllUserCount,
} from "../Controllers/adminConfig.js";
// Public routes
routes.post("/login", AuthUser);
AuthUser;
routes.get("/user", userProfile);
routes.post("/register", RegisterUser);
routes.post("/reset-password", resetPassWord);
routes.post("/verify-reset-token", verifyResetToken);
routes.get("/products", getProducts);
routes.get("/products/:id", getProductById);
// User routes
routes.post("/orders", protect, addOrderItems);
routes.post("/products/:id/reviews", protect, addReview);
routes.get("/orders", protect, getOrders);
routes.post("/addProductWhishlist", protect, addTowishlist);
routes.get("/getWhishlist", protect, getwishlist);
routes.post(
  "/addProductToCartFromWishlist",
  protect,
  addProductToCartFromWishlist
);
routes.delete("/deleteProductFromWishlist", protect, deleteProductFromWishlist);
routes.post("/addProductToCart", protect, addToCart);
routes.get("/getCarts", protect, getCart);
routes.delete("/deleteProductFromCart", protect, deleteProductFromCart);
routes.get("/notifications", protect, getNotifications);
routes.get("/auth/provider", googleAuth);
routes.get("/auth/provider/callback", callbackProvider);
routes.get("/logout", logout);
// Admin routes
routes.post('/products', protect, admin, addProduct);
routes.put('/products/:id', protect, admin, updateProduct);
routes.delete('/products/:id', protect, admin, deleteProduct);
routes.put('/admin/orders/:id/deliver', protect, admin, markOrderAsDelivered);
routes.get('/admin/orders', protect, admin, getAdminOrders);
routes.get('/users/count', protect, admin, getAllUserCount);
export default routes;
