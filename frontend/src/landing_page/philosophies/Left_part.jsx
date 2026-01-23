import React from "react";

const Left_part = ({ image, title, description }) => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center md:justify-end">
            <img
              src={image}
              alt={title}
              className="w-full max-w-xl object-contain"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Left_part;
