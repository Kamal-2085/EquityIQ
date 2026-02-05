import { useEffect, useState } from "react";
import StockChart from "./StockChart.jsx";

// ✅ timeframe config (outside component is OK)
const TIMEFRAMES = {
  "1D": { range: "1d", interval: "1m" },
  "1W": { range: "5d", interval: "5m" },
  "1M": { range: "1mo", interval: "30m" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
  "5Y": { range: "5y", interval: "1wk" },
  "ALL": { range: "max", interval: "1mo" },
};

const StockDetailsModal = ({ selectedStock, closeModal }) => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");

  useEffect(() => {
    if (!selectedStock?.nseSymbol) return;

    const { range, interval } = TIMEFRAMES[timeframe];

    fetch(
      `/api/market/chart/${selectedStock.nseSymbol}?range=${range}&interval=${interval}`
    )
      .then((res) => res.json())
      .then((json) => setChartData(json.data || []))
      .catch(() => setChartData([]));
  }, [selectedStock, timeframe]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        {/* NSE/BSE cards */}
        {/* Buy / Sell / Analyze buttons */}

        {/* ⏱ Timeframe buttons */}
        <div className="flex flex-wrap gap-2 px-6 pt-4">
          {Object.keys(TIMEFRAMES).map((key) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                timeframe === key
                  ? "bg-gray-900 text-white"
                  : "border text-gray-600 hover:bg-gray-100"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* 📈 Chart */}
        <div className="px-6 py-4">
          <StockChart data={chartData} />
        </div>

        {/* Footer / disclaimer */}
      </div>
    </div>
  );
};

export default StockDetailsModal;
