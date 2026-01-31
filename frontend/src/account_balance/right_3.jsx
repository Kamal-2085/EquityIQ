import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmailOtp from "../hooks/useEmailOtp";
import { banks } from "../components/AddAccount.jsx";
import toast from "react-hot-toast";
// Accept balance as a prop
const Right3 = ({ bankName, bankCode, accountNumber, balance }) => {
  const [amount, setAmount] = useState(0);
  const [accountChecked, setAccountChecked] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { isSubmitting, sendOtp, verifyOtp } = useEmailOtp();
  const navigate = useNavigate();

  // Use correct endpoint and include user email
  const handleSendOtp = async () => {
    if (!accountChecked) {
      toast.error("Please Select Your Account First");
      return;
    }
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 100) {
      toast.error("Amount should be more than 100");
      return;
    }
    if (numericAmount > balance) {
      toast.error("Amount exceeds your available balance");
      return;
    }
    // Get user email from localStorage (as in right_2.jsx)
    const stored = JSON.parse(localStorage.getItem("equityiq_user") || "{}");
    const email = stored?.user?.email;
    if (!email) {
      toast.error("Please login to continue");
      return;
    }
    await sendOtp({
      endpoint: "/auth/send-payment-otp",
      payload: { email, amount: Number(amount), type: "withdraw" },
      onSuccess: () => setShowOtpInput(true),
      successMessage: "OTP sent to email",
    });
  };

  const handleVerifyOtp = async () => {
    const stored = JSON.parse(localStorage.getItem("equityiq_user") || "{}");
    const email = stored?.user?.email;
    if (!email) {
      toast.error("Please login to continue");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }
    await verifyOtp({
      endpoint: "/auth/verify-payment-otp",
      payload: { email, otp, amount: Number(amount), type: "withdraw" },
      successMessage: "OTP verified. Withdrawal will be processed.",
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
        setShowOtpInput(false);
        navigate("/");
      },
    });
  };
  return (
    <>
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Enter Amount</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2">
              <span className="text-emerald-600 font-semibold">₹</span>
              <input
                className="text-emerald-600 font-semibold text-right outline-none"
                value={amount}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/[^0-9.]/g, "");
                  setAmount(nextValue);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200" />
      <div className="flex items-center gap-3 my-5 pl-5">
        <input
          type="checkbox"
          checked={accountChecked}
          onChange={(e) => setAccountChecked(e.target.checked)}
          className="h-3 w-3 accent-emerald-500 cursor-pointer"
          id="select-account-checkbox"
        />
        <label
          htmlFor="select-account-checkbox"
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-9 w-9 rounded-full text-white flex items-center justify-center">
            <img
              src={banks.find((b) => b.code === bankCode)?.logo}
              alt="Info"
              className="text-xs font-semibold"
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {bankName} •••• {accountNumber.slice(-4)}
          </span>
        </label>
      </div>
      {showOtpInput && (
        <div className="mb-3 mx-5">
          <label
            htmlFor="otp-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter OTP
          </label>
          <input
            id="otp-input"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-700 "
            placeholder="Enter OTP"
          />
        </div>
      )}
      <div className="border-t border-gray-200" />
      <div className="px-6 py-6">
        {showOtpInput ? (
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendOtp}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-white text-sm font-semibold hover:bg-emerald-600 cursor-pointer disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>
    </>
  );
};

export default Right3;
