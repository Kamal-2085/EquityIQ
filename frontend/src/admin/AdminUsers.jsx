import React, { useEffect, useMemo, useState } from "react";
import api from "../auth/apiClient";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await fetchUsers();
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.phone].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [users, query]);

  const updateRole = async (userId, role) => {
    try {
      setSavingId(userId);
      await api.patch(`/admin/users/${userId}/role`, { role });
      await fetchUsers();
    } finally {
      setSavingId(null);
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Delete this user? This cannot be undone.",
    );
    if (!confirmed) return;
    try {
      setSavingId(userId);
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            User management
          </p>
          <h2 className="admin-title mt-2 text-2xl font-semibold text-white">
            Users
          </h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, phone"
          className="w-full rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 md:w-80"
        />
      </div>

      <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-xl shadow-slate-950/30">
        {loading ? (
          <p className="p-4 text-sm text-slate-400">Loading users...</p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-sm text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-slate-800/60">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.phone}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role || "user"}
                        onChange={(event) =>
                          updateRole(user.id, event.target.value)
                        }
                        disabled={savingId === user.id}
                        className="rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-200"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        disabled={savingId === user.id}
                        className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-rose-200 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
