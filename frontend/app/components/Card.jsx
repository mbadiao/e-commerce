"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAnimate, usePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const Card = ({ clotheprops }) => {
  const { _id, name, stock, imageUrl, price, category } = clotheprops;
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const handleMouseEnter = () => {
      animate(scope.current, { scale: 1.05 }, { duration: 0.3 });
    };

    const handleMouseLeave = () => {
      animate(scope.current, { scale: 1 }, { duration: 0.3 });
    };

    const cardElement = scope.current;
    cardElement.addEventListener("mouseenter", handleMouseEnter);
    cardElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardElement.removeEventListener("mouseenter", handleMouseEnter);
      cardElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animate, scope]);

  return (
    <Link href={`/clothes/${_id}`} passHref>
      <div className="bg-gray-100 hover:bg-white shadow-lg group w-[300px] rounded-xl h-72 p-4" ref={scope}>
      <div className="relative flex w-full mt-2">
          <div className="flex invisible group-hover:visible w-full justify-between text-gray">
            <div className="">
              <p className="text-sm">Stock: {stock}</p>
              <p className="text-sm">Category: {category}</p>
            </div>
          </div>
        </div>
        <div className="relative w-full h-40 my-3 object-contain">
          <Image
            src={imageUrl}
            fill
            priority
            className="object-contain"
            alt={name}
          />
        </div>
        <div className="w-full flex justify-evenly">
          <h2 className="font-bold">{name}</h2>
          <p className="">
            <span>{price}</span>
            <span className="text-sm">XOF</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
