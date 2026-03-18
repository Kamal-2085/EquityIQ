import React, { useEffect, useMemo, useState } from "react";
import api from "../auth/apiClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/tickets?limit=5"),
        ]);
        if (!active) return;
        setStats(statsRes.data?.stats || null);
        setTickets(
          Array.isArray(ticketsRes.data?.tickets)
            ? ticketsRes.data.tickets
            : [],
        );
      } catch (error) {
        if (!active) return;
        setStats(null);
        setTickets([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => {
    const safeStats = stats || {
      totalUsers: 0,
      verifiedUsers: 0,
      totalTickets: 0,
      openTickets: 0,
    };
    return [
      {
        label: "Total users",
        value: safeStats.totalUsers,
        accent: "from-cyan-500/30 to-slate-900",
      },
      {
        label: "Verified users",
        value: safeStats.verifiedUsers,
        accent: "from-emerald-500/30 to-slate-900",
      },
      {
        label: "Total tickets",
        value: safeStats.totalTickets,
        accent: "from-amber-400/30 to-slate-900",
      },
      {
        label: "Open tickets",
        value: safeStats.openTickets,
        accent: "from-rose-500/30 to-slate-900",
      },
    ];
  }, [stats]);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-3xl border border-slate-800/70 bg-gradient-to-br ${card.accent} p-6 shadow-xl shadow-slate-950/40`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-slate-950/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Recent tickets
            </p>
            <h2 className="admin-title mt-2 text-xl font-semibold text-white">
              Latest support activity
            </h2>
          </div>
          <span className="text-xs text-slate-400">Updated live</span>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No tickets yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="rounded-2xl border border-slate-800/60 bg-slate-950/70 px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {ticket.userName} - {ticket.userEmail}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                    {ticket.status || "open"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{ticket.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
