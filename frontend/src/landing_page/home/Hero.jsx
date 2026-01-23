import React from "react";
import img1 from "../../assets/img1.webp";
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <section className="w-full flex justify-center">
      <div className="max-w-6xl w-full px-4 py-16 flex flex-col items-center text-center">
        <img
          src={img1}
          alt="EquityIQ Dashboard"
          className="w-full max-w-4xl mb-12"
        />
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Invest in everything
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Online platform to invest in stocks, derivatives, mutual funds,
            ETFs, bonds, and more.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-md transition cursor-pointer"><Link to="/signup">Sign up for free</Link></button>
      </div>
    </section>
  );
};

export default Hero;
