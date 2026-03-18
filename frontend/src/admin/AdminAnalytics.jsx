import React from "react";

const AdminAnalytics = () => {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/30">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        Analytics
      </p>
      <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
        Platform analytics
      </h2>
      <p className="mt-4 text-sm text-slate-300">
        Analytics dashboards are ready for prediction accuracy, revenue
        tracking, and user activity. Connect your data sources to populate this
        view.
      </p>
    </div>
  );
};

export default AdminAnalytics;
