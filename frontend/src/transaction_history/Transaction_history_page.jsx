import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import axios from "axios";
import api from "../auth/apiClient";

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
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-4 py-2">Txn ID</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr key={`${t.txnId || idx}-${idx}`} className="border-t">
                    <td className="px-4 py-3">{t.txnId}</td>
                    <td className="px-4 py-3">{t.txnType}</td>
                    <td className="px-4 py-3">
                      ₹{(t.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{t.status}</td>
                    <td className="px-4 py-3">
                      {t.date ? new Date(t.date).toLocaleString() : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default Transaction_history_page;
