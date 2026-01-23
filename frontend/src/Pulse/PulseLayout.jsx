import React from "react";
import { Outlet } from "react-router-dom";
import PulseNavbar from "./PulseNavbar.jsx";
import Footer from "../landing_page/Footer.jsx";

const PulseLayout = () => {
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
