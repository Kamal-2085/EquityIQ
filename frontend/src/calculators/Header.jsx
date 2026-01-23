import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold text-gray-900">Calculators</h1>
          <p className="mt-3 text-base text-gray-600">
            Simplify your financial decisition with our calculators.
          </p>
        </div>

        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              New to EquityIQ?
            </p>
            <button className="bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
              <Link to='/signup'>Sign up for free</Link>
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            Already have an account?{" "}
            <span className="cursor-pointer text-blue-600 hover:text-blue-700">
              Invest now
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
