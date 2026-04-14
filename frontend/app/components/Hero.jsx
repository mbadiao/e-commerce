"use client";

import Image from "next/image";
import hero from "@/public/heroimg-optimized.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative z-0 mx-auto mt-16 flex min-h-[calc(100vh-4rem)] max-w-full overflow-hidden">
      <Image
        src={hero}
        alt="Fashion hero banner"
        fill
        priority
        placeholder="blur"
        quality={70}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex w-full items-center px-6 py-16 md:px-10 lg:px-16">
        <div className="max-w-4xl text-white">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Discover, Buy, or Style Your Wardrobe Quickly and Easily
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 md:text-2xl">
            Streamline your shopping experience with our effortless purchasing
            process.
          </p>
          <Button className="mt-8">Explore clothes</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
