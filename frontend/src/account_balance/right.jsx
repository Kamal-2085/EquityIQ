import React, { useState } from "react";
import img47 from "../assets/img47.png";
const Right = () => {
  const [activeTab, setActiveTab] = useState("add");

  const isAdd = activeTab === "add";

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 pt-4 border-b border-gray-200">
        <div className="flex items-center gap-8 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`pb-3 ${
              isAdd
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add money
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("withdraw")}
            className={`pb-3 ${
              !isAdd
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>

      {isAdd ? (
        <>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Enter Amount
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2">
                  <span className="text-emerald-600 font-semibold">₹</span>
                  <input
                    className="text-emerald-600 font-semibold text-right"
                    value="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <button
            type="button"
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                <img src={img47} alt="QR Code" />
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-700">
                  Scan QR to pay
                </div>
              </div>
            </div>
            <span className="text-gray-400 text-xl leading-none">›</span>
          </button>

          <div className="px-6 py-6">
            <button
              type="button"
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600"
            >
              Add money
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="px-6 py-12 flex flex-col items-center justify-center gap-6">
            <div className="h-16 w-16 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center text-3xl font-semibold">
              +
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 py-3.5 text-white text-sm font-semibold hover:bg-blue-700  cursor-pointer"
            >
              Add your account first
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Right;
