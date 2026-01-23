import React from "react";
import img5 from "../../assets/img5.svg";
import img6 from "../../assets/img6.svg";
import { Link } from "react-router-dom";
const Pricing = () => {
  return (
    <section className="w-full flex justify-center py-24">
      <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Unbeatable pricing</h1>
          <p className="text-gray-600 leading-relaxed max-w-lg">
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <Link to="/pricing"
          className="inline-block text-blue-600 font-medium hover:text-blue-700 transition">
             See pricing →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div className="space-y-3">
            <img src={img5} alt="" className="mx-auto w-24"/>
            <p className="text-gray-600 text-sm"> Free account opening</p>
          </div>
          <div className="space-y-3">
            <img src={img5} alt="" className="mx-auto w-24"/>
            <p className="text-gray-600 text-sm">Free equity delivery and direct mutual funds</p>
          </div>
          <div className="space-y-3">
            <img src={img6} alt="" className="mx-auto w-24"/>
            <p className="text-gray-600 text-sm">Intraday and F&O</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
