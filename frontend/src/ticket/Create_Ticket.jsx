import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../auth/apiClient";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Create_Ticket = () => {
  const { accessToken, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!accessToken) {
      toast.error("Please Signup/Login first");
      return;
    }
    const trimmedIssue = issue.trim();
    const trimmedMessage = message.trim();
    if (!trimmedIssue || !trimmedMessage) {
      toast.error("Issue and message are required");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/auth/tickets", {
        issue: trimmedIssue,
        message: trimmedMessage,
      });
      toast.success("Ticket Raised Successfully");
      setIssue("");
      setMessage("");
      setEmail("");
      navigate("/");
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to raise ticket";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Contact Us</h1>
            <p className="mt-3 text-gray-600">
              Please fill out the form below to contact us
            </p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Send Your Message
            </h2>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Issue</span>
                <input
                  type="text"
                  value={issue}
                  onChange={(event) => setIssue(event.target.value)}
                  placeholder="Enter your issue"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Message
                </span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Describe your issue in detail"
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900 transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create_Ticket;
