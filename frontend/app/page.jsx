import React, { Suspense } from "react";
import HomeClient from "./components/HomeClient";


async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products", 
      {next: {revalidate: 10}}
);

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
