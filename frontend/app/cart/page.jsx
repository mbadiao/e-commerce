"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        if (cartData) {
          setCart(cartData);
        } else {
          console.log("Cart data does not contain products:", cartData);
        }
      } catch (error) {
        console.error("Error in fetchCart:", error);
      }
    };
  
    fetchCart();
  }, []);



  return (
    <div className='flex flex-col  justify-center items-center pt-30  px-10 min-h-[70vh] overflow-scroll'>
    <h2 className='font-bold '>My Cart</h2>
    {cart.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.selectedSize}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <p>Your cart is empty.</p>
    )}
  </div>
  );
};

export default Cart;
