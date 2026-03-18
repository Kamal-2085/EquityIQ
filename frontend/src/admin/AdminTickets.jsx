import React, { useEffect, useMemo, useState } from "react";
import api from "../auth/apiClient";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const fetchTickets = async () => {
    const res = await api.get("/admin/tickets");
    const list = Array.isArray(res.data?.tickets) ? res.data.tickets : [];
    setTickets(list);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await fetchTickets();
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const updateDraft = (ticketId, key, value) => {
    setDrafts((prev) => ({
      ...prev,
      [ticketId]: {
        ...prev[ticketId],
        [key]: value,
      },
    }));
  };

  const getDraft = (ticket) => {
    return (
      drafts[ticket.ticketId] || {
        status: ticket.status || "open",
        adminReply: ticket.adminReply || "",
      }
    );
  };

  const saveTicket = async (ticketId) => {
    const draft = drafts[ticketId];
    if (!draft) return;
    try {
      setSavingId(ticketId);
      await api.patch(`/admin/tickets/${ticketId}`, {
        status: draft.status,
        adminReply: draft.adminReply,
      });
      await fetchTickets();
    } finally {
      setSavingId(null);
    }
  };

  const statusPill = (status) => {
    const normalized = status || "open";
    const base = "rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]";
    if (normalized === "closed") {
      return `${base} border border-emerald-500/30 bg-emerald-500/10 text-emerald-200`;
    }
    if (normalized === "in_progress") {
      return `${base} border border-amber-500/30 bg-amber-500/10 text-amber-200`;
    }
    return `${base} border border-cyan-500/30 bg-cyan-500/10 text-cyan-200`;
  };

  const ticketsByStatus = useMemo(() => {
    return tickets;
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Support tickets
        </p>
        <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
          Tickets
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
        {loading ? (
          <p className="text-sm text-slate-400">Loading tickets...</p>
        ) : ticketsByStatus.length === 0 ? (
          <p className="text-sm text-slate-400">No tickets found.</p>
        ) : (
          <div className="space-y-4">
            {ticketsByStatus.map((ticket) => {
              const draft = getDraft(ticket);
              return (
                <div
                  key={ticket.ticketId}
                  className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {ticket.userName} - {ticket.userEmail}
                      </p>
                    </div>
                    <span className={statusPill(ticket.status)}>
                      {ticket.status || "open"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-300">{ticket.desc}</p>

                  <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr_auto]">
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        updateDraft(
                          ticket.ticketId,
                          "status",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-200"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In progress</option>
                      <option value="closed">Closed</option>
                    </select>

                    <input
                      type="text"
                      value={draft.adminReply}
                      onChange={(event) =>
                        updateDraft(
                          ticket.ticketId,
                          "adminReply",
                          event.target.value,
                        )
                      }
                      placeholder="Write a reply for the user"
                      className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() => saveTicket(ticket.ticketId)}
                      disabled={savingId === ticket.ticketId}
                      className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {savingId === ticket.ticketId ? "Saving..." : "Save"}
                    </button>
                  </div>

                  {ticket.adminReply ? (
                    <p className="mt-3 text-xs text-slate-400">
                      Last reply:{" "}
                      <span className="text-slate-200">
                        {ticket.adminReply}
                      </span>
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
