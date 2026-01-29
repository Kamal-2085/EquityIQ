import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

const Header = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const readBalance = () => {
      try {
        const raw = localStorage.getItem("equityiq_user");
        if (!raw) return setBalance(0);
        const parsed = JSON.parse(raw);
        const val = parsed?.user?.accountBalance ?? parsed?.accountBalance ?? 0;
        setBalance(Number(val) || 0);
      } catch (e) {
        setBalance(0);
      }
    };

    readBalance();
    const handler = () => readBalance();
    window.addEventListener("equityiq_user_updated", handler);
    return () => window.removeEventListener("equityiq_user_updated", handler);
  }, []);

  return (
    <section className="w-full border-b border-gray-200 bg-white py-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Transactions
          </h1>
          <h2 className="mt-1 text-sm text-gray-500">
            Balance:₹{balance.toLocaleString()}
          </h2>
        </div>

        <button className="flex items-center gap-2 rounded-md border bg-green-500 border-green-300 px-4 py-2 text-sm font-medium text-white hover:bg-green-50 hover:text-green-900 transition cursor-pointer">
          <FiDownload className="text-base" />
          Download Statement
        </button>
      </div>
    </section>
  );
};

export default Header;
