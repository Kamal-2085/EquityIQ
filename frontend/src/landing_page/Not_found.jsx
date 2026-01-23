import React from "react";
import { Link } from "react-router-dom";
const Not_found = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-2xl text-center">
        <h3 ame="text-sm font-semibold text-gray-500 tracking-widest">
          404 Not Found
        </h3>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
          The page you are looking for does not exist.
        </h1>
        <h3 className="mt-6 text-lg text-gray-600">
          We couldn’t find the page you were looking for.
        </h3>
        <div className="mt-8">
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Visit EquityIQ’s home page
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Not_found;
