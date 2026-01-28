import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Right2 from "./right_2.jsx";
import Right3 from "./right_3.jsx";

const Right = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [showQr, setShowQr] = useState(false);
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("equityiq_user");
    if (!raw) return setUser(null);
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed.user || null);
    } catch {
      setUser(null);
    }
    const handler = () => {
      const raw = localStorage.getItem("equityiq_user");
      if (!raw) return setUser(null);
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("equityiq_user_updated", handler);
    return () => window.removeEventListener("equityiq_user_updated", handler);
  }, []);

  const isAdd = activeTab === "add";

  if (showQr) {
    return <Right2 amount={Number(amount)} onBack={() => setShowQr(false)} />;
  }

  const handleAddMoney = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 100) {
      toast.error("Amount should be more than 100");
      return;
    }
    setShowQr(true);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 pt-4 border-b border-gray-200">
        <div className="flex items-center gap-8 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`pb-3 ${
              isAdd
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            Add money
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("withdraw")}
            className={`pb-3 ${
              !isAdd
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 hover:text-gray-700 cursor-pointer"
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>

      {user?.bankAccount && user.bankAccount.accountNumber ? (
        isAdd ? (
          <>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  Enter Amount
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2">
                    <span className="text-emerald-600 font-semibold">₹</span>
                    <input
                      className="text-emerald-600 font-semibold text-right outline-none"
                      value={amount}
                      onChange={(event) => {
                        const nextValue = event.target.value.replace(
                          /[^0-9.]/g,
                          "",
                        );
                        setAmount(nextValue);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200" />
            <div className="px-6 py-6">
              <button
                type="button"
                onClick={handleAddMoney}
                className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer"
              >
                Add money
              </button>
            </div>
          </>
        ) : (
          <Right3
            bankName={user.bankAccount.bankName}
            bankCode={user.bankAccount.bankCode}
            accountNumber={user.bankAccount.accountNumber}
            balance={user.accountBalance || 0}
          />
        )
      ) : (
        // No bank account UI
        <>
          <div className="px-6 py-12 flex flex-col items-center justify-center gap-6">
            <div className="h-16 w-16 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center text-3xl font-semibold">
              +
            </div>
            <Link
              to="/add-account"
              className="w-full rounded-xl bg-blue-600 py-3.5 text-white text-sm font-semibold hover:bg-blue-700 text-center"
            >
              Add your account first
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Right;
