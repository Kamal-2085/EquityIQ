import React, { useEffect, useState } from "react";
import api from "../../auth/apiClient";

export const useWatchlist = () => {
  const [userKey, setUserKey] = useState("guest");
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);

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
    let isActive = true;
    const loadWatchlist = async () => {
      setWatchlistLoaded(false);
      if (userKey === "guest") {
        const storageKey = `equityiq_watchlist_${userKey}`;
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
          if (isActive) {
            setWatchlist([]);
            setWatchlistLoaded(true);
          }
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          if (isActive) {
            setWatchlist(Array.isArray(parsed) ? parsed : []);
            setWatchlistLoaded(true);
          }
        } catch {
          if (isActive) {
            setWatchlist([]);
            setWatchlistLoaded(true);
          }
        }
        return;
      }

      try {
        const res = await api.get("/auth/watchlist");
        if (!isActive) return;
        const list = Array.isArray(res.data?.watchlist)
          ? res.data.watchlist
          : [];
        setWatchlist(list);
        setWatchlistLoaded(true);
      } catch {
        if (isActive) {
          setWatchlist([]);
          setWatchlistLoaded(true);
        }
      }
    };

    loadWatchlist();
    return () => {
      isActive = false;
    };
  }, [userKey]);

  useEffect(() => {
    if (!watchlistLoaded) return;
    if (userKey === "guest") {
      const storageKey = `equityiq_watchlist_${userKey}`;
      localStorage.setItem(storageKey, JSON.stringify(watchlist));
      return;
    }

    api.post("/auth/watchlist", { watchlist }).catch(() => {});
  }, [watchlist, userKey, watchlistLoaded]);

  return { watchlist, setWatchlist, watchlistLoaded, userKey };
};

const Watchlist = ({ children }) => {
  return <>{children}</>;
};

export default Watchlist;
