import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiCreditCard,
  FiGlobe,
  FiGrid,
  FiInbox,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import api from "../auth/apiClient";
import { useAuth } from "../auth/AuthProvider";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/transactions", label: "Transactions", icon: FiCreditCard },
  { to: "/admin/tickets", label: "Tickets", icon: FiInbox },
  { to: "/admin/stocks", label: "Stocks", icon: FiTrendingUp },
  { to: "/admin/news", label: "News", icon: FiGlobe },
  { to: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
];

const AdminLayout = () => {
  const { accessToken, loading } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!accessToken) {
      navigate("/login");
      return;
    }

    let active = true;
    const fetchAdmin = async () => {
      try {
        const res = await api.get("/admin/me");
        if (!active) return;
        setAdminUser(res.data?.user || null);
      } catch (error) {
        if (!active) return;
        navigate("/");
      } finally {
        if (active) setChecking(false);
      }
    };

    fetchAdmin();

    return () => {
      active = false;
    };
  }, [accessToken, loading, navigate]);

  if (loading || checking) {
    return (
      <div className="admin-root min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-sm tracking-wide text-slate-300">
          Loading admin console...
        </div>
      </div>
    );
  }

  const greeting = adminUser?.name
    ? `Welcome, ${adminUser.name}`
    : "Admin Console";

  return (
    <div className="admin-root min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-[adminFloat_18s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -left-28 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl animate-[adminFloat_22s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl animate-[adminFloat_26s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col md:flex-row animate-[adminFade_0.6s_ease-out]">
        <aside className="w-full border-b border-slate-800/70 bg-slate-950/80 backdrop-blur md:w-72 md:border-b-0 md:border-r">
          <div className="px-6 py-6">
            <p className="admin-title text-xl font-semibold text-white">
              EquityIQ Admin
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Control Center
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-6 md:flex-col md:gap-1 md:overflow-x-visible md:pb-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-white/10 text-white shadow-lg shadow-cyan-500/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="text-base" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden px-6 pb-6 text-xs text-slate-500 md:block">
            <p className="uppercase tracking-[0.24em]">Access</p>
            <p className="mt-2 text-slate-300">{adminUser?.email || "admin"}</p>
          </div>
        </aside>

        <main className="flex-1 px-6 py-8 md:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="admin-title text-3xl font-semibold text-white">
                {greeting}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Review platform health, respond to tickets, and manage users.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-xs text-slate-300 shadow-lg shadow-slate-900/40">
              <p className="uppercase tracking-[0.2em] text-slate-400">Role</p>
              <p className="mt-1 text-sm font-medium text-white">
                {adminUser?.role || "admin"}
              </p>
            </div>
          </div>

          <Outlet context={{ adminUser }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
