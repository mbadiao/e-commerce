const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';

export const LOGIN_URL = `${API_BASE_URL}/login`;
export const REGISTER_URL = `${API_BASE_URL}/register`;
export const ORDERS_URL = `${API_BASE_URL}/orders`;
export const PRODUCTS_URL = `${API_BASE_URL}/products`;
export const USER_URL = `${API_BASE_URL}/user`;
export const CART_URL = `${API_BASE_URL}/getCarts`;
export const WISHLIST_URL = `${API_BASE_URL}/getWhishlist`;
export const DEL_WISHLIST_URL = `${API_BASE_URL}/deleteProductFromWishlist`;
export const ADD_CART_WISHLIST_URL = `${API_BASE_URL}/addProductToCartFromWishlist`;
export const DEL_CART_URL = `${API_BASE_URL}/deleteProductFromCart`;
export const RESET_PSW = `${API_BASE_URL}/reset-password`;
export const COUNT_USERS = `${API_BASE_URL}/users/count`;
export const ADMIN_ORDERS = `${API_BASE_URL}/admin/orders`;
export const RESET_TOKEN = `${API_BASE_URL}/verify-reset-token`;
export const ADD_TO_CART = `${API_BASE_URL}/addProductToCart`;
export const ADD_TO_WISHLIST = `${API_BASE_URL}/addProductWhishlist`;
