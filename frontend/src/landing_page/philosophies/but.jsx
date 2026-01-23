import React from "react";

const ButSection = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-6 py-24">

        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl font-medium text-gray-900 mb-16">
          But …
        </h2>

        {/* Quote */}
        <p className="text-lg italic text-gray-800 mb-6">
          “If it is free, then you are the product.”
        </p>

        {/* Main explanation */}
        <p className="text-gray-700 leading-relaxed mb-12">
          Not at EquityIQ. We offer equity delivery and a wide range of investing
          and trading tools with transparent pricing, charging only what is
          necessary to sustainably run and improve our platform. More
          importantly, the very existence of this page—openly explaining our
          practices and principles—is itself a commitment to long-term trust and
          accountability with our users.
        </p>

        {/* Sub-heading */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Tracking, profiling, and user “engagement” are standard practices globally
        </h3>

        {/* Closing statement */}
        <p className="text-gray-800 font-medium">
          We don’t care.
        </p>

      </div>
    </section>
  );
};

export default ButSection;
