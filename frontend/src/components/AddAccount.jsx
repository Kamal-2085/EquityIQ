import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import img48 from "../assets/img48.webp";
import img49 from "../assets/img49.webp";
import img50 from "../assets/img50.webp";
import img51 from "../assets/img51.webp";
import img52 from "../assets/img52.webp";

export const banks = [
  { name: "State Bank of India", code: "SBI", logo: img48 },
  { name: "HDFC Bank", code: "HDFC", logo: img49 },
  { name: "ICICI Bank", code: "ICICI", logo: img50 },
  { name: "Axis Bank", code: "AXIS", logo: img51 },
  { name: "Kotak Mahindra Bank", code: "KOTAK", logo: img52 },
];

const AddAccount = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const navigate = useNavigate();
  // Email state removed, not needed for mobile-only verification
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!showOtp) {
      setSendingOtp(true);
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/verify-bank-details",
          {
            mobile: data.mobileNumber,
            accountHolderName: data.accountHolderName,
          },
        );
        if (res.data && res.data.success) {
          toast.success("OTP sent to email");
          setShowOtp(true);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.toast) {
          toast.error(err.response.data.toast);
        } else {
          toast.error("Error verifying user details. Please try again.");
        }
      }
      setSendingOtp(false);
      return;
    }
    // OTP is shown, so verify OTP
    setVerifyingOtp(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-bank-otp",
        {
          mobile: data.mobileNumber,
          otp: data.otp,
          bankName: banks.find((b) => b.code === data.bankCode)?.name || "",
          bankCode: data.bankCode,
          accountHolderName: data.accountHolderName, // Only for verification, not storage
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
        },
      );
      if (res.data && res.data.success) {
        toast.success("Bank Account Verified Successfully");
        navigate("/");
        return;
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.toast) {
        toast.error(err.response.data.toast);
      } else {
        toast.error("Error verifying OTP. Please try again.");
      }
    }
    setVerifyingOtp(false);
  };

  return (
    <section className="w-full flex justify-center pt-25 pb-25">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        {/* Account holder name is only used for verification, not storage */}
        <h2 className="text-xl font-semibold text-gray-900">
          Add Your Bank Account Details
        </h2>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Select Your Bank
          </label>
          <div className="mt-3 space-y-3">
            {banks.map((bank) => (
              <label
                key={bank.code}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:border-blue-400"
              >
                <input
                  type="radio"
                  value={bank.code}
                  {...register("bankCode", { required: true })}
                  className="h-4 w-4 text-blue-600"
                />
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm text-gray-700">{bank.name}</span>
              </label>
            ))}
            {errors.bank && (
              <p className="text-red-500 text-sm mt-1">
                Bank selection is required
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Enter Account Holder Name
          </label>
          <input
            {...register("accountHolderName", { required: true })}
            type="text"
            placeholder="Enter account holder name"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm mt-1">
              Account holder name is required
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Enter Account No
          </label>
          <input
            {...register("accountNumber", { required: true })}
            type="text"
            placeholder="Enter account number"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm mt-1">
              Account number is required
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Enter IFSC Code
          </label>
          <input
            {...register("ifscCode", { required: true })}
            type="text"
            placeholder="Enter IFSC code"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-sm mt-1">IFSC code is required</p>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Enter Mobile No
          </label>
          <input
            {...register("mobileNumber", { required: true })}
            type="tel"
            placeholder="Enter mobile number"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">
              Mobile number is required
            </p>
          )}
        </div>

        {showOtp && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              {...register("otp", { required: true })}
              type="text"
              placeholder="Enter OTP"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">OTP is required</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={(sendingOtp && !showOtp) || verifyingOtp}
        >
          {showOtp
            ? verifyingOtp
              ? "Verifying OTP..."
              : "Verify OTP"
            : sendingOtp
            ? "Sending OTP..."
            : "Send OTP"}
        </button>
      </form>
    </section>
  );
};
export default AddAccount;
