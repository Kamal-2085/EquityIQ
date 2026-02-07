import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StockChart from "../../components/StockChart.jsx";
import nseLogo from "../../assets/img46.png";
import bseLogo from "../../assets/img54.jpg";
import OrderPanel from "./OrderPanel.jsx";
import AlertPanel from "./AlertPanel.jsx";
import { IoMdAlarm } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
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
  const navigate = useNavigate();
  const decodedName = company_name ? decodeURIComponent(company_name) : "";
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const initialSymbol = searchParams.get("symbol") || "";

  const [resolvedSymbol, setResolvedSymbol] = useState(initialSymbol);
  const [symbolOptions, setSymbolOptions] = useState([]);
  const [activeExchange, setActiveExchange] = useState("NSE");
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [stockMeta, setStockMeta] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const exchangeMenuRef = useRef(null);
  const exchangeButtonRef = useRef(null);

  useEffect(() => {
    setResolvedSymbol(initialSymbol);
  }, [initialSymbol]);

  useEffect(() => {
    if (!decodedName) return;

    let isActive = true;
    setIsLoading(true);
    setError("");

    fetch(`/api/market/search?query=${encodeURIComponent(decodedName)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isActive) return;
        const results = Array.isArray(json?.results) ? json.results : [];
        const first = results[0] || null;
        const nse = first?.nseSymbol || null;
        const bse = first?.bseSymbol || null;
        const fallback = first?.symbol || "";
        const options = [
          ...(nse ? [{ label: "NSE", value: nse }] : []),
          ...(bse ? [{ label: "BSE", value: bse }] : []),
        ];
        if (options.length === 0 && fallback) {
          options.push({ label: "Symbol", value: fallback });
        }
        setSymbolOptions(options);
        const currentSymbol = resolvedSymbol || initialSymbol;
        let symbol = currentSymbol;
        if (options.length > 0) {
          const exists = options.some((option) => option.value === symbol);
          if (!exists) {
            symbol = options[0].value;
          }
        } else if (!symbol && fallback) {
          symbol = fallback;
        }
        if (!symbol) {
          setError("No symbol found for this company.");
        }
        setResolvedSymbol(symbol);
        const active = options.find((option) => option.value === symbol)?.label;
        setActiveExchange(active || options[0]?.label || "NSE");
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
  }, [decodedName, initialSymbol, resolvedSymbol]);

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

  useEffect(() => {
    if (!resolvedSymbol) return;

    const baseSymbol = String(resolvedSymbol)
      .replace(/\.NS$|\.BO$/i, "")
      .toUpperCase();

    let isActive = true;
    setLogoFailed(false);
    setStockMeta(null);

    fetch(`/api/market/stocks/${encodeURIComponent(baseSymbol)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isActive) return;
        setStockMeta(json || null);
      })
      .catch(() => {
        if (!isActive) return;
        setStockMeta(null);
      });

    return () => {
      isActive = false;
    };
  }, [resolvedSymbol]);

  useEffect(() => {
    if (!resolvedSymbol) return;

    let isActive = true;
    setStockPrice(null);

    fetch(`/api/market/quotes?symbols=${encodeURIComponent(resolvedSymbol)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isActive) return;
        const quote = json?.data?.[resolvedSymbol];
        const price = quote?.regularMarketPrice;
        setStockPrice(typeof price === "number" ? price : null);
      })
      .catch(() => {
        if (!isActive) return;
        setStockPrice(null);
      });

    return () => {
      isActive = false;
    };
  }, [resolvedSymbol]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!exchangeOpen) return;
      if (exchangeMenuRef.current?.contains(event.target)) return;
      if (exchangeButtonRef.current?.contains(event.target)) return;
      setExchangeOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [exchangeOpen]);

  const isIntradayTimeframe = timeframe === "1D" || timeframe === "1W";
  const getExchangeLogo = (label) => {
    const key = String(label || "").toUpperCase();
    if (key === "NSE") return nseLogo;
    if (key === "BSE") return bseLogo;
    return null;
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex gap-6 items-stretch">
        <div className="flex-1 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stockMeta?.domain && !logoFailed ? (
                <img
                  src={`https://img.logo.dev/${stockMeta.domain}?token=pk_eiiL7jOpTwKcZmwob22skQ&size=80&retina=true`}
                  alt={decodedName || "Company"}
                  className="h-10 w-10 rounded-md border border-gray-200 bg-white object-contain"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 text-sm font-semibold text-gray-700">
                  {String(decodedName || "?")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {decodedName || "Company"}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <button
                    className="rounded-full border border-gray-200 px-3 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-1"
                    type="button"
                    onClick={() => setShowAlertPanel(true)}
                  >
                    <IoMdAlarm className="h-4 w-4 text-gray-600" />
                    Create Alert
                  </button>
                  <button
                    className="rounded-full border border-gray-200 px-3 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-1"
                    type="button"
                  >
                    <FaCartPlus className="h-4 w-4 text-gray-600" />
                    Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
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

              <div className="relative flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Exchange
                </span>
                <button
                  ref={exchangeButtonRef}
                  type="button"
                  onClick={() => setExchangeOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  {getExchangeLogo(activeExchange) ? (
                    <img
                      src={getExchangeLogo(activeExchange)}
                      alt={activeExchange}
                      className="h-4 w-4"
                    />
                  ) : null}
                  <span>{activeExchange}</span>
                  <span className="text-gray-400">▾</span>
                </button>
                {exchangeOpen ? (
                  <div
                    ref={exchangeMenuRef}
                    className="absolute right-0 top-8 z-20 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {(symbolOptions.length === 0
                      ? [{ label: activeExchange, value: resolvedSymbol || "" }]
                      : symbolOptions
                    ).map((option) => (
                      <button
                        key={option.value || option.label}
                        type="button"
                        onClick={() => {
                          const next = option.value;
                          const label = option.label || "NSE";
                          setActiveExchange(label);
                          setResolvedSymbol(next);
                          setExchangeOpen(false);
                          const params = new URLSearchParams(location.search);
                          params.set("symbol", next);
                          navigate(
                            `${location.pathname}?${params.toString()}`,
                            {
                              replace: true,
                            },
                          );
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                      >
                        {getExchangeLogo(option.label) ? (
                          <img
                            src={getExchangeLogo(option.label)}
                            alt={option.label}
                            className="h-4 w-4"
                          />
                        ) : null}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex-1">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading chart...</div>
              ) : error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : chartData.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {isIntradayTimeframe ? "No intraday data." : "No chart data."}
                </div>
              ) : (
                <StockChart data={chartData} />
              )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-sm flex flex-col">
          <div className="mb-3 flex justify-end">
            <Link
              to="/pulse"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Back to Pulse
            </Link>
          </div>
          {showAlertPanel ? (
            <AlertPanel onClose={() => setShowAlertPanel(false)} />
          ) : (
            <OrderPanel
              companyName={decodedName || "Company"}
              companyLogoUrl={
                stockMeta?.domain && !logoFailed
                  ? `https://img.logo.dev/${stockMeta.domain}?token=pk_eiiL7jOpTwKcZmwob22skQ&size=80&retina=true`
                  : ""
              }
              exchangeLabel={activeExchange}
              marketPrice={stockPrice}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
