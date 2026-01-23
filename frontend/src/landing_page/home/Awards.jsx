import React from "react";
import img3 from "../../assets/img3.webp";
import {Link} from "react-router-dom";

const Awards = () => {
  return (
    <section className="w-full flex justify-center py-24">
      <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h1 className="text-4xl font-semibold text-gray-900">Trust with confidence</h1>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Customer-first always</h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              EquityIQ is designed for the next generation of investors —
              combining powerful analytics, seamless trading tools, and a clean
              interface to make smarter investing accessible to everyone.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">No spam or gimmicks</h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              No gimmicks, spam, "gamification", or annoying push notifications.
              High quality apps that you use at your pace, the way you like. <Link to="/philosophies" className="text-blue-600 font-medium hover:text-blue-700 transition cursor-pointer">Our
              philosophies.</Link>
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">The EquityIQ ecosystem</h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              A thoughtfully designed platform that integrates market data,
              smart insights, and portfolio tracking — helping investors make
              better, more informed decisions.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Invest smarter</h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              EquityIQ is designed to help you make informed decisions — with
              clear insights, portfolio analytics, and a distraction-free
              experience that keeps the focus on long-term investing.
            </p>
          </div>
        </div>
        <div>
          <img 
          src={img3} 
          alt="EquityIQ ecosystem"
          className="w-full max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Awards;
