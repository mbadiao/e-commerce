"use client";
import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WISHLIST_URL , DEL_WISHLIST_URL, ADD_CART_WISHLIST_URL} from "../config";
const getWishlist = async () => {
  try {
    const response = await fetch(WISHLIST_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch the wishlist: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error while fetching the wishlist", error);
    throw error;
  }
};

const deleteFromWishlist = async (productId, size) => {
  try {
    const response = await fetch(DEL_WISHLIST_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, size }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete from the wishlist: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error while deleting from the wishlist", error);
    throw error;
  }
};

const addToCartFromWishlist = async (productId, size) => {
  try {
    const response = await fetch(ADD_CART_WISHLIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, size }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add to cart: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error while adding to cart", error);
    throw error;
  }
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const wishlistData = await getWishlist();
      if (wishlistData) {
        setWishlist(wishlistData);
      } else {
        console.log("Wishlist data does not contain products:", wishlistData);
      }
    } catch (error) {
      console.error("Error in fetchWishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleDelete = async (productId, size) => {
    try {
      await deleteFromWishlist(productId, size);
      fetchWishlist(); // Refresh the wishlist after deletion
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const handleAddToCart = async (productId, size) => {
    try {
      await addToCartFromWishlist(productId, size);
      fetchWishlist(); // Refresh the wishlist after adding to cart
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-30 px-10 min-h-[400px] overflow-scroll">
      <h2 className="font-bold">My Wishlist</h2>
      {wishlist.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wishlist.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product.price}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(item.product._id, item.size)}>Delete</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleAddToCart(item.product._id, item.size)}>Add to Cart</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
