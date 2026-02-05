import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import StockChart from "../../components/StockChart.jsx";

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

const CompanyDetails = () => {
  const { company_name } = useParams();
  const location = useLocation();
  const decodedName = company_name ? decodeURIComponent(company_name) : "";
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const initialSymbol = searchParams.get("symbol") || "";

  const [resolvedSymbol, setResolvedSymbol] = useState(initialSymbol);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setResolvedSymbol(initialSymbol);
  }, [initialSymbol]);

  useEffect(() => {
    if (resolvedSymbol || !decodedName) return;

    let isActive = true;
    setIsLoading(true);
    setError("");

    fetch(`/api/market/search?query=${encodeURIComponent(decodedName)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isActive) return;
        const results = Array.isArray(json?.results) ? json.results : [];
        const first = results[0] || null;
        const symbol =
          first?.nseSymbol || first?.bseSymbol || first?.symbol || "";
        if (!symbol) {
          setError("No symbol found for this company.");
        }
        setResolvedSymbol(symbol);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Unable to resolve company symbol.");
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [decodedName, resolvedSymbol]);

  useEffect(() => {
    if (!resolvedSymbol) return;

    const { range, interval } = TIMEFRAMES[timeframe];
    let isActive = true;
    setIsLoading(true);
    setError("");

    fetch(
      `/api/market/chart/${encodeURIComponent(
        resolvedSymbol,
      )}?range=${range}&interval=${interval}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (!isActive) return;
        setChartData(Array.isArray(json?.data) ? json.data : []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setChartData([]);
        setError("Unable to load chart data.");
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [resolvedSymbol, timeframe]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {decodedName || "Company"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Detailed overview and market insights.
          </p>
        </div>
        <Link
          to="/pulse"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to Pulse
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {Object.keys(TIMEFRAMES).map((key) => (
            <button
              key={key}
              type="button"
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

        <div className="mt-4">
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading chart...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : chartData.length === 0 ? (
            <div className="text-sm text-gray-500">No chart data.</div>
          ) : (
            <StockChart data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
