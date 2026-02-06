import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import PulseNavbar from "./PulseNavbar.jsx";
import Footer from "../landing_page/Footer.jsx";
import api from "../auth/apiClient";

const PulseLayout = () => {
  const toastShownRef = useRef(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("market-toast-shown");
    if (alreadyShown || toastShownRef.current) return;

    sessionStorage.setItem("market-toast-shown", "true");
    toastShownRef.current = true;

    api
      .get("/market/indices")
      .then((res) => {
        if (!res?.data?.isMarketOpen) {
          toast("Market is closed. Showing last available prices.", {
            icon: "⏰",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PulseNavbar />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PulseLayout;
