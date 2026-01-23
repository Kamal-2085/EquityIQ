import React from "react";
import img15 from "../../assets/img15.svg";
import img16 from "../../assets/img16.svg";
const Hero = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          EquityIQ Products
        </h1>
        <h3 className="text-lg md:text-xl text-gray-600 mb-6">
          Sleek, modern, and intuitive trading platforms
        </h3>
        <p className="text-blue-600 text-sm md:text-base cursor-pointer hover:underline transition mb-10">
          Check out our investment offerings →
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://play.google.com/"
            className="inline-block"
            aria-label="Get it on Google Play"
          >
            <img src={img15} alt="Get it on Google Play" className="h-12" />
          </a>
          <a
            href="https://apps.apple.com/"
            className="inline-block"
            aria-label="Download on the App Store"
          >
            <img src={img16} alt="Download on the App Store" className="h-12" />
          </a>
        </div>
        <div className="flex justify-center">
          <span className="block w-full max-w-3xl h-px bg-gray-200"></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
