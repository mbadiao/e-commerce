"use client";
import Image from "next/image";
import CostumButton from "./CostumButton";
import hero from "@/public/heroimg.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const handleScroll = () => {};
  return (
    <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-w-full mx-auto mt-30">
      <div
        className="flex-1 pt-30 padding-x flex flex-col text-white justify-center items-start bg-cover relative overflow-hidden"
        style={{ backgroundImage: `url(${hero.src})`, height: `100vh` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="z-20 mx-10">
        <h1 className=" text-6xl">
          Discover, Buy, or Style Your Wardrobe - Quickly and Easily
        </h1>
        <p className=" text-3xl ">
          Streamline your shopping experience with our effortless purchasing
          process.
        </p>
        <Button>Explore clothes</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
