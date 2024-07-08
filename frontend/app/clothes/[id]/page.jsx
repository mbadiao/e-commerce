"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useProductStore } from "@/app/store/getUserFromCookie";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const fetchProduct = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

const ProductPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [token, setToken] = useState(null);
  const addToCartState = useProductStore((state) => state.addToCart);
  const user = useProductStore((state) => state.user);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data: product, error } = useSWR(
    id ? `http://localhost:8080/api/products/${id}` : null,
    fetchProduct
  );

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Missing: size",
        description: "Please select a size",
      });
      return;
    }
    setIsLoading(true);
    const cartItem = {
      productId: product._id,
      quantity: parseInt(quantity),
      size: selectedSize,
      user: user._id,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/addProductToCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const updatedCart = await response.json();
      addToCartState(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  if (error) {
    console.error("Error fetching product:", error);
    return <div>Error fetching product. Please try again later.</div>;
  }

  return (
    <div className="flex px-10 flex-col lg:flex-row md:flex-row container mx-auto h-screen justify-evenly lg:px-[10vw]">
      <div className="relative w-full lg:w-1/2 md:w-1/2 h-1/2 lg:h-full md:h-full object-contain mb-5 lg:mb-0 md:mb-0">
        <Image
          src={product.imageUrl}
          layout="fill"
          priority
          className="object-contain"
          alt={product.name}
        />
      </div>
      <div className="w-full lg:w-1/2 md:w-1/2 flex flex-col justify-center px-4 lg:px-0">
        <h1 className="font-bold text-3xl mb-5">{product.name}</h1>
        <p className="text-2xl mb-5">
          <span>{product.price}</span>
          <span className="text-sm">XOF</span>
        </p>
        <p className="mb-5">{product.description}</p>
        <div className="flex space-x-4 mt-3">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <label
              key={size}
              className={`flex items-center border p-2 cursor-pointer ${
                selectedSize === size ? "border-black" : "border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="size"
                value={size}
                className="hidden"
                checked={selectedSize === size}
                onChange={handleSizeChange}
              />
              {size}
            </label>
          ))}
        </div>
        <div className="mt-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={handleQuantityChange}
            className="w-20 border p-2 text-center"
          />
        </div>
        <div className="flex gap-3 mt-5 z-20">
          {token ? (
            <>
            <Button onClick={handleAddToCart} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add to cart"}
            </Button>
            <Button variant={'outline'}>Add to wishlist</Button></>

          ) : (
            <>
              <Link href="/login">
                <Button>{isLoading ? "Adding..." : "Add to cart"}</Button>
                </Link>
                <Link href="/login">
                <Button variant={'outline'}>Add to wishlist</Button>
                </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
