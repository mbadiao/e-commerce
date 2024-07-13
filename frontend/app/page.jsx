import React, { Suspense } from "react";
import HomeClient from "./components/HomeClient";
import { PRODUCTS_URL } from "./config";

async function fetchProducts() {
  try {
    const response = await fetch(PRODUCTS_URL, { next: { revalidate: 10 } });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const productsPromise = fetchProducts();
  const data = await productsPromise;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient products={data} />
    </Suspense>
  );
}
