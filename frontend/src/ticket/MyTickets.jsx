import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../auth/apiClient";
import { useAuth } from "../auth/AuthProvider";

const MyTickets = () => {
  const { accessToken, loading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!accessToken) {
      toast.error("Please Signup/Login first");
      setIsLoading(false);
      return;
    }

    let isActive = true;
    api
      .get("/auth/tickets")
      .then((res) => {
        if (!isActive) return;
        setTickets(Array.isArray(res.data?.tickets) ? res.data.tickets : []);
      })
      .catch(() => {
        if (!isActive) return;
        toast.error("Failed to load tickets");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, loading]);

  const toggleTicket = (ticketId) => {
    setExpandedId((prev) => (prev === ticketId ? null : ticketId));
  };

  return (
    <section className="bg-white py-30">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">Your Tickets</h1>
        <div className="border-t border-gray-200 mt-6" />

        {isLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">No tickets found.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Ticket ID: {ticket.ticketId}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {ticket.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTicket(ticket.ticketId)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50"
                    aria-label="Toggle ticket details"
                  >
                    <FaChevronDown
                      className={`text-sm transition-transform ${
                        expandedId === ticket.ticketId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {expandedId === ticket.ticketId && (
                  <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    {ticket.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTickets;
