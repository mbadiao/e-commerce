"use client";
import { Combobox, ComboboxInput, ComboboxButton } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useProductStore } from '../store/getUserFromCookie';
import { Search } from "lucide-react";

const SearchClothes = () => {
  const [query, setQuery] = useState("");
  const { searchProduct } = useProductStore((state) => ({
    searchProduct: state.searchProduct,
  }));
  useEffect(() => {
    searchProduct(query);
  }, [query, searchProduct]);

  return (
    <div>
      <Combobox value={query}>
        <div className="relative w-full">
          <ComboboxButton className="absolute top-[14px]">
            <Search className="text-gray-400 mx-4 "/>
          </ComboboxButton>
          <ComboboxInput
            className="w-2/3 px-12 rounded-lg h-[50px] bg-gray-100"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Combobox>
    </div>
  );
};

export default SearchClothes;
