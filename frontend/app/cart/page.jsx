"use client";
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const getCart = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/getCarts', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch the carts: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error while fetching the cart', error);
    throw error;
  }
};

const deleteFromCart = async (productId, size) => {
  const itemTodele= JSON.stringify({ productId, size })
  try {
    const response = await fetch('http://localhost:8080/api/deleteProductFromCart', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: itemTodele
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete from the cart: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error while deleting from the cart', error);
    throw error;
  }
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const cartData = await getCart();
      if (cartData) {
        setCart(cartData);
        const total = cartData.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(total);
      } else {
        console.log("Cart data does not contain products:", cartData);
      }
    } catch (error) {
      console.error("Error in fetchCart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (productId, size) => {
    try {
      await deleteFromCart(productId, size);
      fetchCart(); // Refresh the cart after deletion
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center pt-30 px-10 min-h-[70vh] overflow-scroll'>
      <h2 className='font-bold'>My Cart</h2>
      {cart.length > 0 ? (
        <>
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
              {cart.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.product.price}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(item.product._id, item.size)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="w-full flex justify-between items-center mt-4">
            <span className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</span>
            <Link href='/checkout'>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Proceed to Payment
            </button>
            </Link>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
