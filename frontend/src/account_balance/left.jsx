import React from "react";

const Left = () => {
  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-5 text-center">
          <p className="text-sm font-medium text-gray-500">
            Stocks, F&amp;O balance
          </p>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            ₹0
          </div>
        </div>
        <div className="border-t border-dashed border-gray-200" />
        <div className="px-6 py-5">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Cash</span>
            <span className="font-medium text-gray-900">₹0</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-left flex items-center justify-between shadow-sm hover:border-gray-300"
      >
        <span className="text-sm font-semibold text-gray-700">
          All transactions
        </span>
        <span className="text-gray-400 text-xl leading-none">›</span>
      </button>
    </div>
  );
};

export default Left;
