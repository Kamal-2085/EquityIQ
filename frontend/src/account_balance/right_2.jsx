import React, { useState } from "react";
import img53 from "../assets/img53.jpeg";
import img47 from "../assets/img47.png";
import toast from "react-hot-toast";
import useEmailOtp from "../hooks/useEmailOtp.js";
import { useNavigate } from "react-router-dom";
const Right2 = ({ onBack, amount }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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

  const handleSendOtp = async () => {
    const stored = JSON.parse(localStorage.getItem("equityiq_user") || "{}");
    const email = stored?.user?.email;
    if (!email) {
      toast.error("Please login to continue");
      return;
    }
    await sendOtp({
      endpoint: "http://localhost:5000/api/auth/send-payment-otp",
      payload: { email },
      onSuccess: () => setOtpSent(true),
    });
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
      payload: { email, otp: normalizedOtp, amount },
      successMessage: "OTP verified Payment will be coinfrmed shortly",
      onSuccess: () => {
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
        {otpSent ? (
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
        <button
          type="button"
          onClick={otpSent ? handleVerifyOtp : handleSendOtp}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting
            ? otpSent
              ? "Verifying OTP..."
              : "Sending OTP..."
            : otpSent
            ? "Verify OTP"
            : "I've Paid"}
        </button>
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
