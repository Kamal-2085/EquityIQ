import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import api from "../auth/apiClient";
import Transaction from "./Transaction.jsx";
const Transaction_history_page = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const raw = localStorage.getItem("equityiq_user");
      if (!raw) {
        setTransactions([]);
        return;
      }
      const parsed = JSON.parse(raw);
      const email = parsed?.user?.email || parsed?.email;
      if (!email) {
        setTransactions([]);
        return;
      }
      const res = await api.get(`/auth/me?email=${encodeURIComponent(email)}`);
      const user = res.data?.user || {};
      setTransactions(user.transactionHistory || []);
    } catch (err) {
      console.error("Failed to load transactions", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    const handler = () => loadTransactions();
    window.addEventListener("equityiq_user_updated", handler);
    return () => window.removeEventListener("equityiq_user_updated", handler);
  }, []);

  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto py-8 px-4">
        {loading ? (
          <div>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
                {transactions.map((t, idx) => (
                  <Transaction key={`${t.txnId || idx}-${idx}`} transaction={t} />
                ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Transaction_history_page;
