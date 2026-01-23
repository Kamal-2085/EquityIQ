import React from "react";

const Header = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
          Investor charter
        </h1>
        <div className="mt-8 h-px w-full bg-gray-200" />

        <div className="mt-12 sm:mt-14">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Vision
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            To follow highest standards of ethics and compliances while
            facilitating the trading by clients in securities in a fair and
            transparent manner, so as to contribute in creation of wealth for
            investors.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
