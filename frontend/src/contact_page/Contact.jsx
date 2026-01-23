import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import Issue_resolver from "./Footer";
const Contact = () => {
  return (
    <section className="bg-white py-30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-16">
          Contact us
        </h1>

        {/* Top contact blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {/* Support portal */}
          <div className="bg-gray-50 p-6 rounded-md">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Support portal
            </h2>
            <p className="text-gray-600 mb-4">Have a query?</p>
            <button className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 transition cursor-pointer">
              Create a ticket
            </button>
          </div>

          {/* New account opening */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              New account opening
            </h2>
            <p className="text-gray-600">Monday – Friday</p>
            <p className="text-gray-600 mb-3">8:30 AM – 5:00 PM</p>
            <div className="flex items-center gap-2 text-gray-700">
              <FaPhoneAlt className="text-sm" />
              <span>7004352857</span>
            </div>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Support
            </h2>
            <p className="text-gray-600">Monday – Friday</p>
            <p className="text-gray-600 mb-3">8:30 AM – 5:00 PM</p>
            <div className="flex items-center gap-2 text-gray-700">
              <FaPhoneAlt className="text-sm" />
              <span>7004352857</span>
            </div>
          </div>

          {/* Call & trade */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Call & trade
            </h2>
            <p className="text-gray-600">Monday – Friday</p>
            <p className="text-gray-600 mb-3">8:30 AM – 5:00 PM</p>
            <div className="flex items-center gap-2 text-gray-700">
              <FaPhoneAlt className="text-sm" />
              <span>7004352857</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-20"></div>

        {/* Address section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              We are based in Bengaluru
            </h2>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">HQ</h3>
            <p className="text-gray-600 leading-relaxed">
              EquityIQ, #153/154, 4th Cross, J.P Nagar 4th Phase,
              Opp. Clarence Public School,
              Bengaluru – 560078
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Support & mailing address
            </h3>
            <p className="text-gray-600 leading-relaxed">
              EquityIQ, #192A 4th Floor,
              Kalyani Vista, 3rd Main Road,
              JP Nagar 4th Phase,
              Bengaluru – 560076
            </p>
          </div>
        </div>
        <Issue_resolver />
      </div>
    </section>
  );
};

export default Contact;

