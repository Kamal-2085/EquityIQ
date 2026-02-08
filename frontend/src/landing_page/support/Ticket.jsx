import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const Ticket = () => {
  const { accessToken, loading } = useAuth();
  const handleMyTickets = () => {
    if (loading) return;
    if (!accessToken) {
      toast.error("Please Signup/Login first");
      return;
    }
  };

  return (
    <section className="w-full bg-white border-b mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Support Portal
          </h1>
          <Link
            to="/my-tickets"
            onClick={handleMyTickets}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            My tickets
          </Link>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Eg: How do I open my account, How do i activate F&O..."
            className="w-full pl-12 pr-4 py-4 border rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Ticket;
