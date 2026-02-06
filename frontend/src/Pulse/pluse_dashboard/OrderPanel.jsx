import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
const OrderPanel = () => {
  const [side, setSide] = useState("BUY");
  const [product, setProduct] = useState("DELIVERY");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("942.45");

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">LIC</h2>
          <p className="text-xs text-gray-500">NSE ₹901.85</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            className="rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50"
            type="button"
          >
            Create Alert
          </button>
          <button
            className="rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50"
            type="button"
          >
            Watchlist
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="mb-4 flex border-b">
          {["BUY", "SELL"].map((item) => (
            <button
              key={item}
              onClick={() => setSide(item)}
              className={`flex-1 py-2 font-medium ${
                side === item
                  ? item === "BUY"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          {["DELIVERY", "INTRADAY", "MTF"].map((item) => (
            <button
              key={item}
              onClick={() => setProduct(item)}
              className={`rounded-full border px-3 py-1 text-xs ${
                product === item
                  ? "border-gray-900 text-gray-900"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-500">4.33x</span>
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500">Qty (BSE)</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Enter quantity"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500">Price Limit</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="mb-4 rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
          Price should be between ₹756.45 and ₹924.45
        </div>

        <div className="mb-4 flex justify-between text-xs text-gray-500">
          <span>Balance: -₹23</span>
          {side === "BUY" && <span>Approx req: ₹0</span>}
        </div>

        <button
          className={`w-full rounded-md py-3 text-sm font-semibold text-white ${
            side === "BUY" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {side === "BUY" ? "Buy" : "Sell"}
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Analyze With EquityAI
          <FaArrowRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
};

export default OrderPanel;
