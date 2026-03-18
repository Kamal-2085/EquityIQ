import React from "react";

const AdminStocks = () => {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/30">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        Stocks
      </p>
      <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
        Stock data controls
      </h2>
      <p className="mt-4 text-sm text-slate-300">
        Monitor queries, refresh cached market data, and review prediction logs
        here. Hook this page into your market services to enable live controls.
      </p>
    </div>
  );
};

export default AdminStocks;
