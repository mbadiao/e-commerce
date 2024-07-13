"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { USER_URL, CART_URL, ORDERS_URL } from "../config";
const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(USER_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCartData = async () => {
      try {
        const response = await fetch(CART_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch cart data");
        const data = await response.json();
        setCart(data);

        const total = data.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setSubtotal(total);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchUserData();
    fetchCartData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!address) newErrors.address = "Address is required";
    if (!cardNumber) newErrors.cardNumber = "Card number is required";
    if (!expiration) newErrors.expiration = "Expiration date is required";
    if (!cvv) newErrors.cvv = "CVV is required";
    if (cardNumber && !/^\d{16}$/.test(cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits";
    if (cvv && !/^\d{3}$/.test(cvv)) newErrors.cvv = "CVV must be 3 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(ORDERS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            products: cart.map((item) => ({
              product: item.product._id,
              quantity: item.quantity,
            })),
            totalAmount: subtotal + 5.0, // including shipping
            shippingAddress: address,
          }),
        });

        if (!response.ok) {
          toast({
            title: "Failed to place order",
          });
          throw new Error("Failed to place order");
        }

        const data = await response.json();
        toast({
          title: "successful order placement",
        });
        // Handle successful order placement, e.g., redirect to a confirmation page
      } catch (error) {
        toast({
          title: "Error placing order",
        });
        console.error("Error placing order:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  mt-20">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your purchase</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input id="name" value={user.firstName || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input id="name" value={user.lastName || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="123 Main St, Anytown USA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && (
                    <p className="text-red-500">{errors.address}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiration">Expiration</Label>
                    <Select
                      id="expiration"
                      value={expiration}
                      onValueChange={(value) => setExpiration(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="MM/YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={`${i + 1}/24`}>{`${
                            i + 1
                          }/24`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.expiration && (
                      <p className="text-red-500">{errors.expiration}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    {errors.cvv && <p className="text-red-500">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Separator />
              <div className="grid gap-4 py-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span>{item.product.price * item.quantity} XOF</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} XOF</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} XOF</span>
                </div>
              </div>
              <Separator />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Place Order</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Checkout;
