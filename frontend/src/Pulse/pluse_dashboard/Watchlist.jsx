import React, { useEffect, useState } from "react";

export const useWatchlist = () => {
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

  const [userKey, setUserKey] = useState(() => resolveUserKey());
  const cachedKey = `equityiq_watchlist_${userKey}`;
  const getCached = () => {
    const raw = localStorage.getItem(cachedKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const [watchlist, setWatchlist] = useState(() => getCached());
  const [watchlistLoaded, setWatchlistLoaded] = useState(true);

  useEffect(() => {
    const loadUserKey = () => setUserKey(resolveUserKey());
    loadUserKey();
    const handleUserUpdate = () => loadUserKey();
    window.addEventListener("equityiq_user_updated", handleUserUpdate);
    return () => {
      window.removeEventListener("equityiq_user_updated", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadWatchlist = async () => {
      if (!isActive) return;
      setWatchlist(getCached());
      setWatchlistLoaded(true);
    };

    loadWatchlist();
    return () => {
      isActive = false;
    };
  }, [userKey]);

  useEffect(() => {
    if (!watchlistLoaded) return;
    localStorage.setItem(cachedKey, JSON.stringify(watchlist));
  }, [watchlist, userKey, watchlistLoaded, cachedKey]);

  return { watchlist, setWatchlist, watchlistLoaded, userKey };
};

const Watchlist = ({ children }) => {
  return <>{children}</>;
};

export default Watchlist;
