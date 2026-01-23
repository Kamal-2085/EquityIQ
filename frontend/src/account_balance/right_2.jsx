import React from "react";
import img53 from "../assets/img53.jpeg";
import img47 from "../assets/img47.png";
const Right2 = ({ onBack, amount }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ←
          </button>
          <h3 className="text-sm font-semibold text-gray-700">
            Scan QR with any UPI app
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-4 w-4 rounded-full bg-blue-500" />
          <span className="h-4 w-4 rounded-full bg-green-500" />
          <span className="h-4 w-4 rounded-full bg-yellow-400" />
        </div>
      </div>

      <div className="px-6 py-6 text-center">
        <p className="text-sm text-gray-600">Paying ₹{amount}</p>
        <div className="mt-4 flex items-center justify-center">
          <div className="rounded-xl border border-gray-200 p-4">
            <img src={img53} alt="UPI QR" className="h-48 w-48" />
          </div>
        </div>
        <p className="mt-4 text-xl text-gray-500">EquityIQ</p>
      </div>

      <div className="border-t border-gray-200" />

      <div className="px-6 py-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full  text-white flex items-center justify-center">
          <img src={img47} alt="Info" className="text-xs font-semibold" />
        </div>
        <div className="text-sm font-semibold text-gray-700">
          UPI ID : 7004352857-1@superyes
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div className="px-6 py-3 text-center text-xs text-gray-500">
        <button
          type="button"
          className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer"
        >
            I've Paid
        </button>
      </div>
    </div>
  );
};

export default Right2;
