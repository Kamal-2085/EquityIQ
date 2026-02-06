import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
const OrderPanel = ({
  companyName,
  companyLogoUrl,
  exchangeLabel,
  marketPrice,
}) => {
  const [side, setSide] = useState("BUY");
  const [product, setProduct] = useState("DELIVERY");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("942.45");
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    const loadBalance = () => {
      const raw = localStorage.getItem("equityiq_user");
      if (!raw) {
        setAccountBalance(0);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const balance = parsed?.user?.accountBalance;
        setAccountBalance(typeof balance === "number" ? balance : 0);
      } catch {
        setAccountBalance(0);
      }
    };

    loadBalance();
    const handleUserUpdate = () => loadBalance();
    window.addEventListener("equityiq_user_updated", handleUserUpdate);
    return () =>
      window.removeEventListener("equityiq_user_updated", handleUserUpdate);
  }, []);

  const formatPrice = (value) => {
    if (typeof value !== "number") return "--";
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          {companyLogoUrl ? (
            <img
              src={companyLogoUrl}
              alt={companyName || "Company"}
              className="h-9 w-9 rounded-full border border-gray-200 object-contain"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              {String(companyName || "?")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap truncate max-w-[180px]">
              {companyName || "Company"}
            </h2>
            <p className="text-xs text-gray-500">
              {exchangeLabel || "NSE"} ₹{formatPrice(marketPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex-1">
        <div className="mb-4 flex border-b">
          {["BUY", "SELL"].map((item) => (
            <button
              key={item}
              onClick={() => setSide(item)}
              className={`flex-1 py-2 font-medium ${
                side === item
                  ? item === "BUY"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          {["DELIVERY", "INTRADAY"].map((item) => (
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
          <span>Balance: ₹{accountBalance.toLocaleString("en-IN")}</span>
          {side === "BUY" && <span>Approx req: ₹0</span>}
        </div>

        <button
          className={`w-full rounded-md py-3 text-sm font-semibold text-white ${
            side === "BUY"
              ? "bg-green-600 hover:bg-green-800"
              : "bg-blue-500 hover:bg-blue-800"
          }`}
        >
          {side === "BUY" ? "Buy" : "Sell"}
        </button>
      </div>

      <div className="flex items-center justify-center border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
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
