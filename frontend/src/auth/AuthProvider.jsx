import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setAccessToken as setApiAccessToken,
  clearAccessToken as clearApiAccessToken,
} from "../auth/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function refresh() {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setApiAccessToken(data.accessToken);
        } else {
          setAccessToken(null);
          clearApiAccessToken();
        }
      } catch (err) {
        setAccessToken(null);
        clearApiAccessToken();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    refresh();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
