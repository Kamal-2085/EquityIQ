import React, { useEffect, useMemo, useState } from "react";
import api from "../auth/apiClient";

const STATUS_OPTIONS = ["hold", "completed", "rejected"];

const statusPillClass = (status) => {
  const normalized = String(status || "hold").toLowerCase();
  const base = "rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]";

  if (normalized === "completed") {
    return `${base} border border-emerald-500/30 bg-emerald-500/10 text-emerald-200`;
  }
  if (normalized === "rejected") {
    return `${base} border border-rose-500/30 bg-rose-500/10 text-rose-200`;
  }
  return `${base} border border-amber-500/30 bg-amber-500/10 text-amber-200`;
};

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [draftStatus, setDraftStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const makeKey = (txn) => `${txn.userId}::${txn.txnId}`;

  const fetchTransactions = async (statusValue) => {
    const params = {};
    if (statusValue && statusValue !== "all") {
      params.status = statusValue;
    }

    const res = await api.get("/admin/transactions", { params });
    const list = Array.isArray(res.data?.transactions)
      ? res.data.transactions
      : [];

    setTransactions(list);
    setDraftStatus((prev) => {
      const next = { ...prev };
      list.forEach((txn) => {
        next[makeKey(txn)] = txn.status || "hold";
      });
      return next;
    });
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setErrorMessage("");
        await fetchTransactions(statusFilter);
      } catch (error) {
        if (!active) return;
        setTransactions([]);
        setErrorMessage(
          error?.response?.data?.message || "Failed to load transactions.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [statusFilter]);

  const filteredTransactions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return transactions;

    return transactions.filter((txn) => {
      return [txn.txnId, txn.userName, txn.userEmail, txn.txnType].some(
        (field) =>
          String(field || "")
            .toLowerCase()
            .includes(term),
      );
    });
  }, [transactions, query]);

  const updateDraftStatus = (key, value) => {
    setDraftStatus((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveStatus = async (txn) => {
    const key = makeKey(txn);
    const nextStatus = draftStatus[key] || "hold";

    try {
      setSavingKey(key);
      setErrorMessage("");

      await api.patch(
        `/admin/transactions/${encodeURIComponent(
          txn.userId,
        )}/${encodeURIComponent(txn.txnId)}/status`,
        { status: nextStatus },
      );

      setTransactions((prev) =>
        prev.map((item) =>
          makeKey(item) === key
            ? {
                ...item,
                status: nextStatus,
              }
            : item,
        ),
      );

      await fetchTransactions(statusFilter);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to update payment status.",
      );
    } finally {
      setSavingKey("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Wallet transactions
          </p>
          <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
            Payment Status Control
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-[180px_minmax(220px,320px)]">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-200"
          >
            <option value="all">All status</option>
            <option value="hold">Hold</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by txn id, user, email"
            className="rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-xl shadow-slate-950/30 md:p-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading transactions...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => {
                  const key = makeKey(txn);
                  const selectedStatus =
                    draftStatus[key] || txn.status || "hold";
                  const dateLabel = txn.date
                    ? new Date(txn.date).toLocaleString()
                    : "-";

                  return (
                    <tr key={key} className="border-t border-slate-800/60">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">
                          {txn.txnType}
                        </p>
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          {txn.txnId}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {dateLabel}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">
                          {txn.userName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {txn.userEmail}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">
                          Rs. {Number(txn.amount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-slate-500">
                          Bal: Rs.{" "}
                          {Number(txn.accountBalance || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span className={statusPillClass(txn.status)}>
                          {txn.status || "hold"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={selectedStatus}
                            onChange={(event) =>
                              updateDraftStatus(key, event.target.value)
                            }
                            className="rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-200"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => saveStatus(txn)}
                            disabled={
                              savingKey === key ||
                              selectedStatus === (txn.status || "hold")
                            }
                            className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
                          >
                            {savingKey === key ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
