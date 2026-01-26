import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const Forgot_password_page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const handleSendOtp = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-password-otp",
        {
          email: data.identifier,
        },
      );
      if (res.data?.otpSent || res.data?.otpPreview) {
        toast.success(
          res.data?.otpSent
            ? "OTP sent to your email"
            : `Dev OTP: ${res.data.otpPreview}`,
        );
        setEmail(data.identifier);
        setOtpStage(true);
        // Do not reset email field
      } else {
        toast.error(res.data?.message || "Unable to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-password-otp",
        {
          email,
          otp: data.otp,
        },
      );
      if (res.data?.verified) {
        toast.success("OTP verified. You can now update your password.");
        navigate("/forgot-password/update", { state: { email } });
      } else {
        toast.error(res.data?.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Forgot password?
        </h1>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(otpStage ? handleVerifyOtp : handleSendOtp)}
        >
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="identifier"
            type="text"
            placeholder="Enter your email address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("identifier", { required: true })}
            disabled={otpStage}
          />
          {errors.identifier && (
            <p className="text-xs text-red-500">Email is required</p>
          )}

          {otpStage && (
            <>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter Your otp"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("otp", { required: true })}
              />
              {errors.otp && (
                <p className="text-xs text-red-500">OTP is required</p>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
          >
            {otpStage
              ? isSubmitting
                ? "Verifying..."
                : "Verify OTP"
              : isSubmitting
              ? "Sending OTP..."
              : "Send OTP"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Forgot_password_page;
