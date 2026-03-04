import { useEffect, useState } from "react";
import StockChart from "./StockChart.jsx";
import {
  addMarketListener,
  removeMarketListener,
  setQuoteSymbols,
} from "../services/marketSocket";

// ✅ timeframe config (outside component is OK)
const TIMEFRAMES = {
  "1D": { range: "1d", interval: "1m" },
  "1W": { range: "5d", interval: "5m" },
  "1M": { range: "1mo", interval: "30m" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
  "5Y": { range: "5y", interval: "1wk" },
  ALL: { range: "max", interval: "1mo" },
};

const StockDetailsModal = ({ selectedStock, closeModal }) => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [liveSymbol, setLiveSymbol] = useState("");

  const toUnixSeconds = (timeValue) => {
    if (typeof timeValue === "number" && !Number.isNaN(timeValue)) {
      return timeValue > 1e12
        ? Math.floor(timeValue / 1000)
        : Math.floor(timeValue);
    }
    if (typeof timeValue === "string") {
      const parsed = Date.parse(timeValue);
      if (!Number.isNaN(parsed)) return Math.floor(parsed / 1000);
    }
    return Math.floor(Date.now() / 1000);
  };

  const toDateKey = (unixSeconds) => {
    const date = new Date(unixSeconds * 1000);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getMarketOpenSeconds = (unixSeconds) => {
    const date = new Date(unixSeconds * 1000);
    const open = new Date(date);
    open.setHours(9, 15, 0, 0);
    return Math.floor(open.getTime() / 1000);
  };

  const upsertIntradayPoint = (series, point) => {
    if (!point || typeof point.time !== "number") return series;
    const next = Array.isArray(series) ? [...series] : [];
    const index = next.findIndex((item) => item.time === point.time);
    if (index >= 0) next[index] = point;
    else next.push(point);
    next.sort((a, b) => a.time - b.time);
    return next;
  };

  useEffect(() => {
    const symbol = selectedStock?.nseSymbol || selectedStock?.bseSymbol || "";
    setLiveSymbol(symbol);
    if (!symbol) return;

    const { range, interval } = TIMEFRAMES[timeframe];

    fetch(`/api/market/chart/${symbol}?range=${range}&interval=${interval}`)
      .then((res) => res.json())
      .then((json) => {
        const data = Array.isArray(json?.data) ? json.data : [];
        let nextData = data;

        if (range === "1d" && interval === "1m" && data.length > 0) {
          const lastPoint = data[data.length - 1];
          const lastValue = lastPoint?.value;
          if (
            typeof lastPoint?.time === "number" &&
            lastValue !== null &&
            lastValue !== undefined
          ) {
            const marketTime = toUnixSeconds(json?.meta?.regularMarketTime);
            const bucketTime = Math.floor(marketTime / 60) * 60;
            if (toDateKey(lastPoint.time) === toDateKey(bucketTime)) {
              nextData = upsertIntradayPoint(data, {
                time: bucketTime,
                value: lastValue,
              });
            }
          }
        }

        setChartData(nextData);
      })
      .catch(() => setChartData([]));
  }, [selectedStock, timeframe]);

  useEffect(() => {
    if (!liveSymbol || timeframe !== "1D") return;

    setQuoteSymbols([liveSymbol]);

    const handleQuotes = (message) => {
      const data = message?.data?.data || {};
      const quote = data?.[liveSymbol];
      if (!quote) return;
      const price = quote?.regularMarketPrice ?? quote?.price;
      if (typeof price !== "number") return;
      const time = toUnixSeconds(
        quote?.regularMarketTime ?? quote?.regularMarketTimeMs ?? Date.now(),
      );
      const bucketTime = Math.floor(time / 60) * 60;

      setChartData((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        const sameDay =
          current.length === 0 ||
          toDateKey(current[current.length - 1]?.time) ===
            toDateKey(bucketTime);
        if (!sameDay) return [];
        return upsertIntradayPoint(current, { time: bucketTime, value: price });
      });
    };

    addMarketListener("quotes", handleQuotes);
    return () => {
      removeMarketListener("quotes", handleQuotes);
      setQuoteSymbols([]);
    };
  }, [liveSymbol, timeframe]);

  const nowSeconds = Math.floor(Date.now() / 1000);
  const openSeconds = getMarketOpenSeconds(nowSeconds);
  const intradayRange = { from: openSeconds, to: nowSeconds };
  const isLiveIntraday = timeframe === "1D";

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
          <StockChart
            data={chartData}
            timeMode={isLiveIntraday ? "intraday-hourly" : undefined}
            timeRange={isLiveIntraday ? intradayRange : undefined}
          />
        </div>

        {/* Footer / disclaimer */}
      </div>
    </div>
  );
};

export default StockDetailsModal;
