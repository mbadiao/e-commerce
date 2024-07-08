"use client";
import Image from "next/image";
import CostumButton from "./CostumButton";
import hero from "@/public/heroimg.jpg";

const Hero = () => {
  const handleScroll = () => {};
  return (
    <div className="flex xl:flex-row flex-col gap-5 relative z-0 max-w-full mx-auto mt-30">
      <div
        className="flex-1 pt-30 padding-x flex flex-col text-white justify-center items-start bg-cover relative overflow-hidden"
        style={{ backgroundImage: `url(${hero.src})`, height: `100vh` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <h1 className="hero__title relative z-20">
          Discover, Buy, or Style Your Wardrobe - Quickly and Easily
        </h1>
        <p className="hero__subtitle relative z-20">
          Streamline your shopping experience with our effortless purchasing process.
        </p>
        <CostumButton
          title="Explore clothes"
          containerStyle="text-white  p-2 font-semi-bold bg-black font-bold mt-10 relative z-20"
          handleClick={handleScroll}
        />
      </div>
    </div>
  );
};

export default Hero;
