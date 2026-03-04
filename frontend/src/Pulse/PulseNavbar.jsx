import React, { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileMenu from "../components/ProfileMenu.jsx";
import StockChart from "../components/StockChart.jsx";
import img8 from "../assets/img8.png";
import api from "../auth/apiClient";
import {
  addMarketListener,
  removeMarketListener,
  setIndicesSubscription,
} from "../services/marketSocket";
import { useAuth } from "../auth/AuthProvider";

const INDEX_TIMEFRAMES = {
  "1D": { range: "1d", interval: "1m" },
  "1W": { range: "5d", interval: "5m" },
  "1M": { range: "1mo", interval: "30m" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
  "5Y": { range: "5y", interval: "1wk" },
  ALL: { range: "max", interval: "1mo" },
};
const PulseNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [marketData, setMarketData] = useState({
    nifty: null,
    sensex: null,
    disclaimer: null,
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [indexCharts, setIndexCharts] = useState({});
  const [indexChartLoading, setIndexChartLoading] = useState({});
  const [indexTimeframe, setIndexTimeframe] = useState({
    nifty: "1D",
    sensex: "1D",
  });
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const niftyRef = useRef(null);
  const sensexRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem("equityiq_user");
      if (!raw) {
        setUser(null);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const expiresAt = parsed?.expiresAt;
        const storedUser = parsed?.user;
        if (!expiresAt || !storedUser || Date.now() > expiresAt) {
          localStorage.removeItem("equityiq_user");
          setUser(null);
          return;
        }
        setUser(storedUser);
      } catch {
        localStorage.removeItem("equityiq_user");
        setUser(null);
      }
    };

    loadUser();
    const handleUserUpdate = () => loadUser();
    window.addEventListener("equityiq_user_updated", handleUserUpdate);
    return () =>
      window.removeEventListener("equityiq_user_updated", handleUserUpdate);
  }, [indexTimeframe.nifty, indexTimeframe.sensex]);

  useEffect(() => {
    const handleIndices = (message) => {
      const payload = message?.data;
      setMarketData({
        nifty: payload?.nifty || null,
        sensex: payload?.sensex || null,
        disclaimer: payload?.disclaimer || null,
      });

      const niftyPrice = payload?.nifty?.price;
      const sensexPrice = payload?.sensex?.price;
      const niftyTime = toUnixSeconds(payload?.nifty?.time);
      const sensexTime = toUnixSeconds(payload?.sensex?.time);

      if (indexTimeframe.nifty === "1D" && typeof niftyPrice === "number") {
        const bucketTime = Math.floor(niftyTime / 60) * 60;
        setIndexCharts((prev) => {
          const key = getIndexKey("nifty", "1D");
          const current = prev[key] || [];
          const sameDay =
            current.length === 0 ||
            toDateKey(current[current.length - 1]?.time) ===
              toDateKey(bucketTime);
          if (!sameDay) return { ...prev, [key]: [] };
          const next = upsertIntradayPoint(current, {
            time: bucketTime,
            value: niftyPrice,
          });
          return { ...prev, [key]: next };
        });
      }

      if (indexTimeframe.sensex === "1D" && typeof sensexPrice === "number") {
        const bucketTime = Math.floor(sensexTime / 60) * 60;
        setIndexCharts((prev) => {
          const key = getIndexKey("sensex", "1D");
          const current = prev[key] || [];
          const sameDay =
            current.length === 0 ||
            toDateKey(current[current.length - 1]?.time) ===
              toDateKey(bucketTime);
          if (!sameDay) return { ...prev, [key]: [] };
          const next = upsertIntradayPoint(current, {
            time: bucketTime,
            value: sensexPrice,
          });
          return { ...prev, [key]: next };
        });
      }
    };

    addMarketListener("indices", handleIndices);
    setIndicesSubscription(true);

    return () => {
      removeMarketListener("indices", handleIndices);
      setIndicesSubscription(false);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileOpen) return;
      if (profileMenuRef.current?.contains(event.target)) return;
      if (profileButtonRef.current?.contains(event.target)) return;
      setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    const handleIndexOutside = (event) => {
      if (!hoveredIndex) return;
      if (niftyRef.current?.contains(event.target)) return;
      if (sensexRef.current?.contains(event.target)) return;
      setHoveredIndex(null);
    };
    document.addEventListener("mousedown", handleIndexOutside);
    return () => document.removeEventListener("mousedown", handleIndexOutside);
  }, [hoveredIndex]);

  const getInitial = (name) => {
    if (!name) return "?";
    const firstChar = name.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "?";
  };

  const displayName = user?.name || user?.email || "DEMOUSER";

  const formatNumber = (value) => {
    if (value === null || Number.isNaN(value)) return "--";
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatChangePercent = (value) => {
    if (value === null || Number.isNaN(value)) return "--";
    return `${value.toFixed(2)}%`;
  };

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

  const formatDateLabel = (unixSeconds) => {
    const date = unixSeconds ? new Date(unixSeconds * 1000) : new Date();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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

  const nifty = marketData.nifty;
  const sensex = marketData.sensex;
  const niftyChange = nifty?.change ?? null;
  const sensexChange = sensex?.change ?? null;
  const changeClass = (value) =>
    value !== null && value >= 0 ? "text-green-600" : "text-red-500";
  const niftyTrend = indexTimeframe.nifty === "1D" ? niftyChange : null;
  const sensexTrend = indexTimeframe.sensex === "1D" ? sensexChange : null;

  const getIndexKey = (key, timeframe) => `${key}_${timeframe}`;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const openSeconds = getMarketOpenSeconds(nowSeconds);
  const intradayRange = { from: openSeconds, to: nowSeconds };

  const niftyKey = getIndexKey("nifty", indexTimeframe.nifty);
  const sensexKey = getIndexKey("sensex", indexTimeframe.sensex);
  const niftyIsLive = indexTimeframe.nifty === "1D";
  const sensexIsLive = indexTimeframe.sensex === "1D";
  const niftyChartData = indexCharts[niftyKey] || [];
  const sensexChartData = indexCharts[sensexKey] || [];
  const niftyLoading =
    indexChartLoading[niftyKey] && niftyChartData.length === 0;
  const sensexLoading =
    indexChartLoading[sensexKey] && sensexChartData.length === 0;
  const niftyLiveEmpty = niftyIsLive && niftyChartData.length === 0;
  const sensexLiveEmpty = sensexIsLive && sensexChartData.length === 0;
  const niftyHeaderLabel = niftyIsLive
    ? formatDateLabel(nowSeconds)
    : indexTimeframe.nifty;
  const sensexHeaderLabel = sensexIsLive
    ? formatDateLabel(nowSeconds)
    : indexTimeframe.sensex;
  useEffect(() => {
    if (!hoveredIndex) return;

    const timeframe = indexTimeframe[hoveredIndex];
    const frame = INDEX_TIMEFRAMES[timeframe] || INDEX_TIMEFRAMES["1D"];
    const symbol = hoveredIndex === "nifty" ? "^NSEI" : "^BSESN";
    const cacheKey = getIndexKey(hoveredIndex, timeframe);
    let isActive = true;

    setIndexChartLoading((prev) => ({ ...prev, [cacheKey]: true }));

    fetch(
      `/api/market/chart/${encodeURIComponent(symbol)}?range=${
        frame.range
      }&interval=${frame.interval}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (!isActive) return;
        const data = Array.isArray(json?.data) ? json.data : [];
        setIndexCharts((prev) => ({ ...prev, [cacheKey]: data }));
      })
      .catch(() => {
        if (!isActive) return;
        setIndexCharts((prev) => ({ ...prev, [cacheKey]: [] }));
      })
      .finally(() => {
        if (!isActive) return;
        setIndexChartLoading((prev) => ({ ...prev, [cacheKey]: false }));
      });

    return () => {
      isActive = false;
    };
  }, [hoveredIndex, indexTimeframe.nifty, indexTimeframe.sensex]);

  const { setAccessToken } = useAuth();
  const handleLogout = async () => {
    const rawUser = localStorage.getItem("equityiq_user");
    let userKey = "guest";
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        const storedUser = parsed?.user;
        userKey = storedUser?.id || storedUser?.email || "guest";
      } catch {}
    }
    const watchlistKey = `equityiq_watchlist_${userKey}`;
    const logoCacheKey = `equityiq_logo_cache_${userKey}`;
    const cachedWatchlist = (() => {
      const raw = localStorage.getItem(watchlistKey);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    if (cachedWatchlist.length > 0) {
      const token = localStorage.getItem("equityiq_access_token");
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      try {
        await api.post("/auth/watchlist", { watchlist: cachedWatchlist });
      } catch {}
    }

    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("equityiq_user");
    localStorage.removeItem("equityiq_access_token");
    localStorage.removeItem(watchlistKey);
    localStorage.removeItem(logoCacheKey);
    sessionStorage.removeItem("market-toast-shown");
    window.dispatchEvent(new Event("equityiq_user_updated"));
    setAccessToken(null);
    try {
      const { clearAccessToken } = await import("../auth/apiClient");
      clearAccessToken();
    } catch {}
    setProfileOpen(false);
    toast.success("User logged out successfully");
    navigate("/");
  };

  const handleProfileImageClick = () => {
    if (!user) return;
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user?.id) {
      toast.error("Please log in again to update your profile");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", user.id);

    try {
      setIsUploading(true);
      const res = await api.put("/auth/profile-image", formData);

      if (res.status === 200 && res.data?.user) {
        const raw = localStorage.getItem("equityiq_user");
        const parsed = raw ? JSON.parse(raw) : null;
        const expiresAt =
          parsed?.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = { user: res.data.user, expiresAt };
        localStorage.setItem("equityiq_user", JSON.stringify(payload));
        window.dispatchEvent(new Event("equityiq_user_updated"));
        toast.success("Profile image updated");
        setProfileOpen(false);
      } else {
        console.error("Upload failed response:", res);
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (error) {
      if (error.response) {
        console.error("Image upload error (response):", error.response);
      } else if (error.request) {
        console.error("Image upload error (request):", error.request);
      } else {
        console.error("Image upload error (message):", error.message);
      }
      const errMsg =
        error.response?.data?.message || error.message || "Upload failed";
      console.error("Image upload error (final message):", errMsg);
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-360 mx-auto px-4">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-6 text-[11px] text-gray-500 whitespace-nowrap">
            <div
              ref={niftyRef}
              className="relative flex items-center gap-1 cursor-pointer"
              onClick={() => {
                const next = hoveredIndex === "nifty" ? null : "nifty";
                setHoveredIndex(next);
              }}
            >
              <span className="font-medium text-gray-600">NIFTY 50</span>
              <span className={`font-semibold ${changeClass(niftyChange)}`}>
                {formatNumber(nifty?.price)}
              </span>
              <span className="text-gray-400">
                {niftyChange !== null && !Number.isNaN(niftyChange)
                  ? `${niftyChange >= 0 ? "+" : ""}${formatNumber(
                      niftyChange,
                    )} (${formatChangePercent(nifty?.changePercent)})`
                  : "--"}
              </span>
              {hoveredIndex === "nifty" && (
                <div
                  className="absolute left-0 top-full z-30 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mb-2 text-[11px] text-gray-500">
                    NIFTY 50 · {niftyHeaderLabel}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {Object.keys(INDEX_TIMEFRAMES).map((frame) => (
                      <button
                        key={frame}
                        type="button"
                        onClick={() => {
                          setIndexTimeframe((prev) => ({
                            ...prev,
                            nifty: frame,
                          }));
                        }}
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          indexTimeframe.nifty === frame
                            ? "bg-gray-900 text-white"
                            : "border border-gray-200 text-gray-500"
                        }`}
                      >
                        {frame}
                      </button>
                    ))}
                  </div>
                  {niftyLoading || niftyLiveEmpty ? (
                    <div className="text-xs text-gray-400">
                      {niftyLoading ? "Loading chart..." : "No chart data."}
                    </div>
                  ) : (
                    <StockChart
                      data={niftyChartData}
                      trend={niftyTrend}
                      timeMode={niftyIsLive ? "intraday-hourly" : undefined}
                      timeRange={niftyIsLive ? intradayRange : undefined}
                      height={140}
                      minHeight={140}
                    />
                  )}
                </div>
              )}
            </div>
            <div
              ref={sensexRef}
              className="relative flex items-center gap-1 cursor-pointer"
              onClick={() => {
                const next = hoveredIndex === "sensex" ? null : "sensex";
                setHoveredIndex(next);
              }}
            >
              <span className="font-medium text-gray-600">SENSEX</span>
              <span className={`font-semibold ${changeClass(sensexChange)}`}>
                {formatNumber(sensex?.price)}
              </span>
              <span className="text-gray-400">
                {sensexChange !== null && !Number.isNaN(sensexChange)
                  ? `${sensexChange >= 0 ? "+" : ""}${formatNumber(
                      sensexChange,
                    )} (${formatChangePercent(sensex?.changePercent)})`
                  : "--"}
              </span>
              {hoveredIndex === "sensex" && (
                <div
                  className="absolute left-0 top-full z-30 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mb-2 text-[11px] text-gray-500">
                    SENSEX · {sensexHeaderLabel}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {Object.keys(INDEX_TIMEFRAMES).map((frame) => (
                      <button
                        key={frame}
                        type="button"
                        onClick={() => {
                          setIndexTimeframe((prev) => ({
                            ...prev,
                            sensex: frame,
                          }));
                        }}
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          indexTimeframe.sensex === frame
                            ? "bg-gray-900 text-white"
                            : "border border-gray-200 text-gray-500"
                        }`}
                      >
                        {frame}
                      </button>
                    ))}
                  </div>
                  {sensexLoading || sensexLiveEmpty ? (
                    <div className="text-xs text-gray-400">
                      {sensexLoading ? "Loading chart..." : "No chart data."}
                    </div>
                  ) : (
                    <StockChart
                      data={sensexChartData}
                      trend={sensexTrend}
                      timeMode={sensexIsLive ? "intraday-hourly" : undefined}
                      timeRange={sensexIsLive ? intradayRange : undefined}
                      height={140}
                      minHeight={140}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/pulse" className="flex items-center">
              <img src={img8} alt="Pulse" className="h-5" />
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-xs">
              <Link to="/pulse" className="font-medium text-blue-500">
                Dashboard
              </Link>
              <button className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Orders
              </button>
              <button className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Holdings
              </button>
              <button className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Positions
              </button>
              <button className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Bids
              </button>
              <button className="text-gray-600 hover:text-blue-500 cursor-pointer">
                Funds
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700" type="button">
              <FaRegBell className="h-5 w-5" />
            </button>
            <button
              ref={profileButtonRef}
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2"
              aria-label="Open profile menu"
            >
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center overflow-hidden cursor-pointer">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial(displayName)
                )}
              </div>
              <span className="text-xs text-gray-700 font-medium cursor-pointer">
                {displayName}
              </span>
            </button>
          </div>
        </div>
      </div>
      {profileOpen && user && (
        <ProfileMenu
          user={user}
          profileMenuRef={profileMenuRef}
          onLogout={handleLogout}
          onProfileImageClick={handleProfileImageClick}
          isUploading={isUploading}
          displayName={displayName}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileImageChange}
      />
    </header>
  );
};

export default PulseNavbar;
