import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import img46 from "../../assets/img46.png";
import HeroSection from "./HeroSection.jsx";
import toast from "react-hot-toast";

const STOCKS = [
  { name: "Reliance Industries Ltd", nse: "RELIANCE.NS", bse: "RELIANCE.BO" },
  { name: "Tata Consultancy Services (TCS)", nse: "TCS.NS", bse: "TCS.BO" },
  { name: "HDFC Bank Ltd", nse: "HDFCBANK.NS", bse: "HDFCBANK.BO" },
  { name: "ICICI Bank Ltd", nse: "ICICIBANK.NS", bse: "ICICIBANK.BO" },
  { name: "Infosys Ltd", nse: "INFY.NS", bse: "INFY.BO" },
  { name: "State Bank of India", nse: "SBIN.NS", bse: "SBIN.BO" },
  { name: "Bharti Airtel Ltd", nse: "BHARTIARTL.NS", bse: "BHARTIARTL.BO" },
  { name: "ITC Ltd", nse: "ITC.NS", bse: "ITC.BO" },
  { name: "Larsen & Toubro Ltd", nse: "LT.NS", bse: "LT.BO" },
  { name: "Axis Bank Ltd", nse: "AXISBANK.NS", bse: "AXISBANK.BO" },
  { name: "Kotak Mahindra Bank Ltd", nse: "KOTAKBANK.NS", bse: "KOTAKBANK.BO" },
  {
    name: "Hindustan Unilever Ltd",
    nse: "HINDUNILVR.NS",
    bse: "HINDUNILVR.BO",
  },
  { name: "Bajaj Finance Ltd", nse: "BAJFINANCE.NS", bse: "BAJFINANCE.BO" },
  { name: "Bajaj Finserv Ltd", nse: "BAJAJFINSV.NS", bse: "BAJAJFINSV.BO" },
  { name: "HCL Technologies Ltd", nse: "HCLTECH.NS", bse: "HCLTECH.BO" },
  {
    name: "Sun Pharmaceutical Industries Ltd",
    nse: "SUNPHARMA.NS",
    bse: "SUNPHARMA.BO",
  },
  { name: "NTPC Ltd", nse: "NTPC.NS", bse: "NTPC.BO" },
  { name: "Mahindra & Mahindra Ltd", nse: "M&M.NS", bse: "M&M.BO" },
  { name: "Maruti Suzuki India Ltd", nse: "MARUTI.NS", bse: "MARUTI.BO" },
  { name: "Tata Motors Ltd", nse: "TATAMOTORS.NS", bse: "TATAMOTORS.BO" },
  {
    name: "Power Grid Corporation of India Ltd",
    nse: "POWERGRID.NS",
    bse: "POWERGRID.BO",
  },
  { name: "UltraTech Cement Ltd", nse: "ULTRACEMCO.NS", bse: "ULTRACEMCO.BO" },
  { name: "Asian Paints Ltd", nse: "ASIANPAINT.NS", bse: "ASIANPAINT.BO" },
  { name: "Nestlé India Ltd", nse: "NESTLEIND.NS", bse: "NESTLEIND.BO" },
  { name: "Adani Enterprises Ltd", nse: "ADANIENT.NS", bse: "ADANIENT.BO" },
  { name: "Adani Ports & SEZ Ltd", nse: "ADANIPORTS.NS", bse: "ADANIPORTS.BO" },
  { name: "Coal India Ltd", nse: "COALINDIA.NS", bse: "COALINDIA.BO" },
  { name: "ONGC Ltd", nse: "ONGC.NS", bse: "ONGC.BO" },
  { name: "JSW Steel Ltd", nse: "JSWSTEEL.NS", bse: "JSWSTEEL.BO" },
  { name: "Tata Steel Ltd", nse: "TATASTEEL.NS", bse: "TATASTEEL.BO" },
  { name: "Grasim Industries Ltd", nse: "GRASIM.NS", bse: "GRASIM.BO" },
  { name: "Titan Company Ltd", nse: "TITAN.NS", bse: "TITAN.BO" },
  { name: "Tech Mahindra Ltd", nse: "TECHM.NS", bse: "TECHM.BO" },
  { name: "Wipro Ltd", nse: "WIPRO.NS", bse: "WIPRO.BO" },
  { name: "IndusInd Bank Ltd", nse: "INDUSINDBK.NS", bse: "INDUSINDBK.BO" },
  {
    name: "SBI Life Insurance Company Ltd",
    nse: "SBILIFE.NS",
    bse: "SBILIFE.BO",
  },
  {
    name: "HDFC Life Insurance Company Ltd",
    nse: "HDFCLIFE.NS",
    bse: "HDFCLIFE.BO",
  },
  {
    name: "Apollo Hospitals Enterprise Ltd",
    nse: "APOLLOHOSP.NS",
    bse: "APOLLOHOSP.BO",
  },
  { name: "Divi’s Laboratories Ltd", nse: "DIVISLAB.NS", bse: "DIVISLAB.BO" },
  {
    name: "Dr. Reddy’s Laboratories Ltd",
    nse: "DRREDDY.NS",
    bse: "DRREDDY.BO",
  },
  { name: "Cipla Ltd", nse: "CIPLA.NS", bse: "CIPLA.BO" },
  {
    name: "Britannia Industries Ltd",
    nse: "BRITANNIA.NS",
    bse: "BRITANNIA.BO",
  },
  {
    name: "Tata Consumer Products Ltd",
    nse: "TATACONSUM.NS",
    bse: "TATACONSUM.BO",
  },
  { name: "Eicher Motors Ltd", nse: "EICHERMOT.NS", bse: "EICHERMOT.BO" },
  { name: "Bajaj Auto Ltd", nse: "BAJAJ-AUTO.NS", bse: "BAJAJ-AUTO.BO" },
  { name: "Hero MotoCorp Ltd", nse: "HEROMOTOCO.NS", bse: "HEROMOTOCO.BO" },
  { name: "UPL Ltd", nse: "UPL.NS", bse: "UPL.BO" },
  { name: "LTIMindtree Ltd", nse: "LTIM.NS", bse: "LTIM.BO" },
  { name: "Shriram Finance Ltd", nse: "SHRIRAMFIN.NS", bse: "SHRIRAMFIN.BO" },
  {
    name: "HDFC Asset Management Company Ltd",
    nse: "HDFCAMC.NS",
    bse: "HDFCAMC.BO",
  },
];

const PAGE_SIZE = 10;

const DashboardPage = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setPage] = useState(1);
  const [listType, setListType] = useState("NIFTY 50");
  const [userKey, setUserKey] = useState("guest");
  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quoteData, setQuoteData] = useState({
    nse: null,
    bse: null,
    loading: false,
    error: "",
  });
  const [tempResults, setTempResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const isWatchlist = listType === "WATCHLIST";

  const resolveUserKey = () => {
    const raw = localStorage.getItem("equityiq_user");
    if (!raw) return "guest";
    try {
      const parsed = JSON.parse(raw);
      const user = parsed?.user;
      return user?.id || user?.email || "guest";
    } catch {
      return "guest";
    }
  };

  useEffect(() => {
    const loadUserKey = () => setUserKey(resolveUserKey());
    loadUserKey();
    const handleUserUpdate = () => loadUserKey();
    window.addEventListener("equityiq_user_updated", handleUserUpdate);
    return () =>
      window.removeEventListener("equityiq_user_updated", handleUserUpdate);
  }, []);

  useEffect(() => {
    const storageKey = `equityiq_watchlist_${userKey}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setWatchlist([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setWatchlist(Array.isArray(parsed) ? parsed : []);
    } catch {
      setWatchlist([]);
    }
  }, [userKey]);

  useEffect(() => {
    const storageKey = `equityiq_watchlist_${userKey}`;
    localStorage.setItem(storageKey, JSON.stringify(watchlist));
  }, [watchlist, userKey]);

  const getStockKey = (stock) =>
    stock.nse || stock.bse || stock.symbol || stock.name;

  const isInWatchlist = (stock) => {
    const key = getStockKey(stock);
    return watchlist.some((item) => getStockKey(item) === key);
  };

  const handleAddToWatchlist = (event, stock) => {
    event.stopPropagation();
    event.preventDefault();
    if (isInWatchlist(stock)) return;
    setWatchlist((prev) => [...prev, stock]);
    toast.success("Stock added to watchlist");
  };

  const handleRemoveFromWatchlist = (event, stock) => {
    event.stopPropagation();
    event.preventDefault();
    const key = getStockKey(stock);
    setWatchlist((prev) => prev.filter((item) => getStockKey(item) !== key));
    toast.success("Stock removed successfully");
  };

  const filteredStocks = useMemo(() => {
    const baseList = isWatchlist ? watchlist : STOCKS;
    const term = query.trim().toLowerCase();
    if (!term) return baseList;
    return baseList.filter((stock) => {
      const haystack = `${stock.name} ${stock.nse} ${stock.bse}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [query, isWatchlist, watchlist]);

  const isUsingTempResult =
    !isWatchlist && query.trim().length > 0 && filteredStocks.length === 0;
  const displayStocks = isUsingTempResult ? tempResults : filteredStocks;
  const totalPages = Math.max(1, Math.ceil(displayStocks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedStocks = displayStocks.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage !== safePage) setPage(safePage);
  }, [currentPage, safePage]);

  useEffect(() => {
    const term = query.trim();
    if (isWatchlist) {
      setTempResults([]);
      setSearchError("");
      setSearchLoading(false);
      return undefined;
    }
    if (!term) {
      setTempResults([]);
      setSearchError("");
      setSearchLoading(false);
      return undefined;
    }
    if (filteredStocks.length > 0) {
      setTempResults([]);
      setSearchError("");
      setSearchLoading(false);
      return undefined;
    }

    let isActive = true;
    setSearchLoading(true);
    setSearchError("");

    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get("/api/market/search", {
          params: { query: term },
        });

        if (!isActive) return;

        const results = response.data?.results || [];
        if (!Array.isArray(results) || results.length === 0) {
          setTempResults([]);
          setSearchError("No matching stock found.");
          setSearchLoading(false);
          return;
        }

        const mappedResults = results.map((result) => {
          const nseSymbol = result.nseSymbol || null;
          const bseSymbol = result.bseSymbol || null;
          const fallbackSymbol = result.symbol || null;
          const fallbackUpper = String(fallbackSymbol || "").toUpperCase();
          let nse = nseSymbol;
          let bse = bseSymbol;
          if (!nse && fallbackUpper.endsWith(".NS")) nse = fallbackSymbol;
          if (!bse && fallbackUpper.endsWith(".BO")) bse = fallbackSymbol;
          if (!nse && !bse) nse = fallbackSymbol;

          return {
            name: result.name || fallbackSymbol,
            nse,
            bse,
            exchange: result.exchange || null,
            isTemp: true,
          };
        });

        const dedupedResults = [];
        const seenKeys = new Set();
        mappedResults.forEach((item) => {
          const key = String(item.nse || item.bse || item.name || "")
            .trim()
            .toUpperCase();
          if (!key || seenKeys.has(key)) return;
          seenKeys.add(key);
          dedupedResults.push(item);
        });

        setTempResults(dedupedResults);
        setSearchLoading(false);
      } catch (error) {
        if (!isActive) return;
        setTempResults([]);
        setSearchError("Unable to search right now.");
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [query, filteredStocks.length, isWatchlist]);

  useEffect(() => {
    let intervalId;

    const fetchQuotes = async () => {
      if (!selectedStock) return;
      const symbols = [selectedStock.nse, selectedStock.bse].filter(Boolean);
      if (symbols.length === 0) return;
      setQuoteData((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const response = await axios.get("/api/market/quotes", {
          params: {
            symbols: symbols.join(","),
          },
        });

        const data = response.data?.data || {};
        setQuoteData({
          nse: selectedStock.nse ? data[selectedStock.nse] || null : null,
          bse: selectedStock.bse ? data[selectedStock.bse] || null : null,
          loading: false,
          error: "",
        });
      } catch (error) {
        setQuoteData((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load quotes right now.",
        }));
      }
    };

    if (selectedStock) {
      fetchQuotes();
      intervalId = setInterval(fetchQuotes, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedStock]);

  const closeModal = () => {
    setSelectedStock(null);
    setQuoteData({ nse: null, bse: null, loading: false, error: "" });
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(value))
      return "--";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChangeTone = (change) => {
    if (change === null || change === undefined || Number.isNaN(change)) {
      return "text-gray-500";
    }
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  const listSelector = (
    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1">
      {listType === "NIFTY 50" ? (
        <img
          src={img46}
          alt="NSE"
          className="h-4 w-4"
          style={{ filter: "grayscale(1) brightness(0.55)" }}
        />
      ) : (
        <FaCartPlus className="h-4 w-4 text-gray-600" />
      )}
      <select
        aria-label="Select list"
        className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
        value={listType}
        onChange={(event) => {
          setListType(event.target.value);
          setPage(1);
        }}
      >
        <option value="NIFTY 50">NIFTY 50</option>
        <option value="WATCHLIST">WATCHLIST</option>
      </select>
    </div>
  );

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-85">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <HeroSection
                title=""
                subtitle="Live quotes • Refreshes every second"
                icon={null}
                selector={listSelector}
              />

              {!isWatchlist && (
                <div className="px-4 pb-4">
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search for stocks by name or symbol..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {isWatchlist && watchlist.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-500">
                    Add the stocks here to see
                  </div>
                ) : (
                  <>
                    {!isWatchlist && searchLoading && isUsingTempResult ? (
                      <div className="px-4 py-3 text-xs text-gray-500">
                        Searching...
                      </div>
                    ) : null}
                    {!isWatchlist && !searchLoading && searchError ? (
                      <div className="px-4 py-3 text-xs text-red-500">
                        {searchError}
                      </div>
                    ) : null}
                    {!isWatchlist &&
                    !searchLoading &&
                    !searchError &&
                    paginatedStocks.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-gray-500">
                        No matching stock found.
                      </div>
                    ) : null}
                    {paginatedStocks.map((stock, index) => (
                      <div
                        key={`${stock.name}-${stock.nse}-${stock.bse}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedStock(stock)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") setSelectedStock(stock);
                        }}
                        className="flex items-center justify-between px-4 py-3 text-xs text-gray-700 transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-gray-300">
                            {String(startIndex + index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {stock.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isWatchlist ? (
                            <button
                              type="button"
                              title="Remove from watchlist"
                              onClick={(event) =>
                                handleRemoveFromWatchlist(event, stock)
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <IoIosRemoveCircle className="h-4 w-4" />
                            </button>
                          ) : !isInWatchlist(stock) ? (
                            <button
                              type="button"
                              title="Add to watchlist"
                              onClick={(event) =>
                                handleAddToWatchlist(event, stock)
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <IoIosAddCircle className="h-4 w-4" />
                            </button>
                          ) : null}
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">
                            {stock.nse && stock.bse
                              ? "NSE/BSE"
                              : stock.nse
                              ? "NSE"
                              : stock.bse
                              ? "BSE"
                              : "Search result"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {!(isWatchlist && watchlist.length === 0) && (
                <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNumber = idx + 1;
                      const isActive = pageNumber === safePage;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={`h-7 w-7 rounded-md text-xs font-semibold transition ${
                            isActive
                              ? "bg-blue-500 text-white"
                              : "border border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={safePage === totalPages}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1" />
        </div>
      </section>

      {selectedStock ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStock.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Live quotes • Refreshes every second
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
              {[
                { label: "NSE", quote: quoteData.nse },
                { label: "BSE", quote: quoteData.bse },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-xs font-semibold text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formatCurrency(item.quote?.regularMarketPrice)}
                  </p>
                  <p
                    className={`mt-1 text-xs ${getChangeTone(
                      item.quote?.regularMarketChange,
                    )}`}
                  >
                    Change: {formatCurrency(item.quote?.regularMarketChange)} (
                    {item.quote?.regularMarketChangePercent
                      ? `${item.quote.regularMarketChangePercent.toFixed(2)}%`
                      : "--"}
                    )
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
              {quoteData.error ? quoteData.error : ""}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DashboardPage;
