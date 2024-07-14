"use client";
import { useEffect } from "react";
import { CustomFilter, Hero, SearchBar, Card } from ".";
import { useProductStore } from "../store/getUserFromCookie";
import { useRouter, useSearchParams } from "next/navigation";



const HomeClient = ({ products }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for token in URL and set it in local storage
    const token = searchParams.get('token');
    console.log(token)
    if (token) {
      localStorage.setItem('token', token);
      router.replace('/');
    }
    setProducts(products);
  }, [products, setProducts, searchParams, router]);

  const clothes = useProductStore((state) => state.products);
  
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 px-20 py-10 max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Clothes Catalogue</h1>
          <p>Explore the clothes you might like</p>
        </div>
        <div className="flex">
          <SearchBar className='w-full'/>
          <div className="flex gap-5">
            <CustomFilter title="category" />
            <CustomFilter title="date" />
          </div>
        </div>
        <section className="flex justify-center items-center my-20">
          <div className="container flex gap-5 h-max justify-center flex-wrap">
            {clothes?.length > 0 ? (
              clothes.map((clothe) => (
                <Card key={clothe._id} clotheprops={clothe} />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomeClient;
