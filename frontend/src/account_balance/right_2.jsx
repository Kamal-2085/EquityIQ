import React, { useState } from "react";
import img53 from "../assets/img53.jpeg";
import img47 from "../assets/img47.png";
import toast from "react-hot-toast";
import useEmailOtp from "../hooks/useEmailOtp.js";
import { useNavigate } from "react-router-dom";
const Right2 = ({ onBack, amount }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [txnIdRequested, setTxnIdRequested] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [txnIdError, setTxnIdError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const { isSubmitting, sendOtp, verifyOtp } = useEmailOtp();
  const navigate = useNavigate();

  const handleCancelYes = () => {
    setShowCancelConfirm(false);
    toast.success("Payment cancelled successfully");
    onBack?.();
  };

  const handleTxnIdRequest = () => {
    setTxnIdRequested(true);
  };

  const handleSubmitTxnId = async () => {
    const stored = JSON.parse(localStorage.getItem("equityiq_user") || "{}");
    const email = stored?.user?.email;
    if (!email) {
      toast.error("Please login to continue");
      return;
    }
    const normalizedTxnId = txnId.trim();
    // UPI Transaction IDs should be only numeric and at least 8 digits
    const validTxnId = /^\d{8,}$/;
    if (!validTxnId.test(normalizedTxnId)) {
      setTxnIdError("Enter a valid UPI Transaction ID (8+ digits)");
      return;
    }
    setTxnIdError("");
    try {
      // Store transaction in backend
      const response = await fetch(
        "http://localhost:5000/api/auth/submit-upi-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, txnId: normalizedTxnId, amount }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        // Now send OTP to email (include txnId so backend can create/verify pending txn)
        await sendOtp({
          endpoint: "http://localhost:5000/api/auth/send-payment-otp",
          payload: { email, amount, txnId: normalizedTxnId, type: "add" },
          onSuccess: () => setOtpSent(true),
          successMessage: "OTP sent to email",
        });
      } else {
        setTxnIdError(data.message || "Failed to submit transaction ID");
        toast.error(data.message || "Failed to submit transaction ID");
      }
    } catch (err) {
      setTxnIdError("Server error. Please try again later.");
      toast.error("Server error. Please try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    const stored = JSON.parse(localStorage.getItem("equityiq_user") || "{}");
    const email = stored?.user?.email;
    if (!email) {
      toast.error("Please login to continue");
      return;
    }
    const normalizedOtp = otp.trim();
    if (!normalizedOtp || normalizedOtp.length !== 6) {
      setOtpError("Enter a valid 6-digit OTP");
      return;
    }
    setOtpError("");
    await verifyOtp({
      endpoint: "http://localhost:5000/api/auth/verify-payment-otp",
      payload: { email, otp: normalizedOtp, amount, type: "add" },
      successMessage: "OTP verified. Payment will be confirmed shortly",
      onSuccess: (data) => {
        try {
          if (data?.user) {
            const stored = JSON.parse(
              localStorage.getItem("equityiq_user") || "{}",
            );
            stored.user = { ...(stored.user || {}), ...data.user };
            localStorage.setItem("equityiq_user", JSON.stringify(stored));
            window.dispatchEvent(new Event("equityiq_user_updated"));
          }
        } catch (e) {}
        setOtp("");
        navigate("/");
      },
      onError: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
          >
            ←
          </button>
          <h3 className="text-sm font-semibold text-gray-700">
            Scan QR with any UPI app
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-4 w-4 rounded-full bg-blue-500" />
          <span className="h-4 w-4 rounded-full bg-green-500" />
          <span className="h-4 w-4 rounded-full bg-yellow-400" />
        </div>
      </div>

      <div className="px-6 py-6 text-center">
        <p className="text-sm text-gray-600">Paying ₹{amount}</p>
        <div className="mt-4 flex items-center justify-center">
          <div className="rounded-xl border border-gray-200 p-4">
            <img src={img53} alt="UPI QR" className="h-48 w-48" />
          </div>
        </div>
        <p className="mt-4 text-xl text-gray-500">EquityIQ</p>
      </div>

      <div className="border-t border-gray-200" />

      <div className="px-6 py-4">
        {txnIdRequested ? (
          otpSent ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center tracking-widest outline-none focus:border-emerald-500"
                placeholder="••••••"
              />
              {otpError && (
                <p className="mt-2 text-sm text-red-500">{otpError}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Enter UPI Transaction ID
              </label>
              <input
                type="text"
                value={txnId}
                onChange={(event) =>
                  setTxnId(event.target.value.replace(/\D/g, ""))
                }
                maxLength={30}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center tracking-widest outline-none focus:border-emerald-500"
                placeholder="Transaction ID"
              />
              {txnIdError && (
                <p className="mt-2 text-sm text-red-500">{txnIdError}</p>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full text-white flex items-center justify-center">
              <img src={img47} alt="Info" className="text-xs font-semibold" />
            </div>
            <div className="text-sm font-semibold text-gray-700">
              UPI ID : 7004352857-1@superyes
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200" />

      <div className="px-6 py-3 text-center text-xs text-gray-500">
        {txnIdRequested ? (
          otpSent ? (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitTxnId}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Transaction ID"}
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={handleTxnIdRequest}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Processing..." : "I've Paid"}
          </button>
        )}
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-gray-800 text-center">
              Are You sure ,You want to cancel the payment
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCancelYes}
                className="rounded-lg bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white hover:bg-green-600 cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Right2;
