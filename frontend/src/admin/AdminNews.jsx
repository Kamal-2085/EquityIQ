import React from "react";

const AdminNews = () => {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/30">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        News monitoring
      </p>
      <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
        News API status
      </h2>
      <p className="mt-4 text-sm text-slate-300">
        Review the latest SerpAPI fetches, refresh breaking news, and audit
        coverage gaps. Connect this view to your news service to enable manual
        refresh actions.
      </p>
    </div>
  );
};

export default AdminNews;
