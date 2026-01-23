import React from "react";
import img14 from "../../assets/img14.jpeg";
import { Link } from "react-router-dom";
const Team = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-16">
          People
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-gray-700 leading-relaxed text-base">
            <p className="mb-6">
              Kamal founded EquityIQ with the vision of making market
              intelligence simple, transparent, and accessible to everyone. With
              a strong interest in data, technology, and financial markets, he
              focuses on building tools that help users understand markets
              beyond just price movements.
            </p>
            <p className="mb-6">
              EquityIQ is driven by the belief that informed decisions come from
              clarity and context. The platform emphasizes clean analytics,
              meaningful insights, and an educational approach to investing.
              Outside of work, Kamal enjoys exploring new technologies and
              continuously learning about market behavior.
            </p>
            <div className="flex gap-4 text-blue-600 font-medium">
              <Link to="/" className="hover:underline">
                Portfolio Website
              </Link>
              <a
                href="https://tradingqna.com/u/kamal_modi/summary"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                EquityIQ Circle
              </a>
              <a
                href="https://x.com/kamal_iiti2694"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {" "}
                Twitter
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src={img14}
              alt="Kamal Modi"
              className="w-56 h-56 rounded-full object-cover mb-6 grayscale"
            />
            <h2 className="text-xl font-semibold text-gray-900">Kamal Modi</h2>
            <p className="text-sm text-gray-600 mt-1">Founder, CEO</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
