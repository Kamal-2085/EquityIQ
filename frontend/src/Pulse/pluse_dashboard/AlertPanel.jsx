import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const AlertPanel = ({ onClose }) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [notifyMode, setNotifyMode] = useState("ONCE");

  const isValid = String(targetPrice).trim().length > 0;

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col flex-1">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          aria-label="Back to order panel"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Set alert</h2>
      </div>

      <div className="px-6 py-6 flex-1">
        <div className="mb-6">
          <label className="text-xs text-gray-500">Target price</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Enter target price"
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <span className="text-sm text-gray-600">Notify me</span>
          <div className="flex items-center gap-2">
            {[
              { label: "Every time", value: "EVERY" },
              { label: "Once", value: "ONCE" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setNotifyMode(option.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  notifyMode === option.value
                    ? "border-green-600 text-green-600"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={!isValid}
          className={`w-full rounded-md py-3 text-sm font-semibold ${
            isValid
              ? "bg-blue-500 text-white hover:bg-blue-800 cursor-pointer"
              : "bg-blue-400 text-white"
          } mt-40`}
        >
          Set alert
        </button>
      </div>
    </aside>
  );
};

export default AlertPanel;
