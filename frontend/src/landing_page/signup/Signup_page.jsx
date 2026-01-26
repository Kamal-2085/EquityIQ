import React, { useState, useEffect } from "react";
import useEmailOtp from "../../hooks/useEmailOtp";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signup_page = () => {
  const { isSubmitting, sendOtp, verifyOtp } = useEmailOtp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: form,
  });
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("form"); // form | verify | done
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      toast.error("You are already Logged in. Please Logout first");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValue(e.target.name, e.target.value, { shouldValidate: true });
  };

  const handleSend = async (data) => {
    if (isLoggedIn) {
      toast("You are already Logged in. Please Logout first");
      return;
    }
    if (!agreed) {
      toast.error("You must agree to the Terms & Privacy to proceed");
      return;
    }
    const res = await sendOtp({
      endpoint: "http://localhost:5000/api/auth/signup",
      payload: data,
      onSuccess: (data) => {
        setStage("verify");
        if (data.user) setUser(data.user);
      },
      successMessage: "OTP sent successfully",
    });
    return res;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await verifyOtp({
      endpoint: "http://localhost:5000/api/auth/verify-email-otp",
      payload: { email: form.email, otp },
      onSuccess: (data) => {
        setStage("done");
        if (data.user) setUser(data.user);
        // Only show one toast
        toast.dismiss();
        toast.success("User registered successfully", {
          id: "otp-verify",
        });
        setTimeout(() => navigate("/"), 1500);
      },
      successMessage: undefined, // Prevent default toast
    });
    return res;
  };

  return (
    <div className="max-w-md mx-auto  p-6 bg-white rounded-lg shadow my-20">
      {isLoggedIn && (
        <div className="mb-4 text-center text-red-600 text-base font-semibold">
          You are already Logged in. Please Logout first.
        </div>
      )}
      {stage === "form" && (
        <>
          <form onSubmit={handleSubmit(handleSend)} className="space-y-4">
            <h2 className="text-2xl font-semibold">Create an account</h2>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                value={form.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
                disabled={isLoggedIn}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Invalid email address",
                  },
                })}
                value={form.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
                disabled={isLoggedIn}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone</label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone must be exactly 10 digits",
                  },
                })}
                value={form.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
                maxLength={10}
                inputMode="numeric"
                disabled={isLoggedIn}
              />
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                value={form.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
                disabled={isLoggedIn}
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-2">
              <input
                id="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                disabled={isLoggedIn}
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                By proceeding, you agree to the EquityIQ{" "}
                <a
                  href="/TermsAndConditions"
                  className="text-blue-600 underline"
                >
                  terms
                </a>{" "}
                &{" "}
                <a href="/privacy" className="text-blue-600 underline">
                  privacy policy
                </a>
              </label>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                disabled={isSubmitting || !agreed || isLoggedIn}
                className={`px-4 py-2 rounded-md text-white ${
                  isSubmitting || !agreed || isLoggedIn
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoggedIn
                  ? "Already logged in"
                  : isSubmitting
                  ? "Sending..."
                  : "Send OTP"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-700">
            Already have an EquityIQ account?{" "}
            <a href="/login" className="text-blue-600 underline">
              Click here
            </a>
          </div>
        </>
      )}

      {stage === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <h2 className="text-2xl font-semibold">Verify your email</h2>
          <p className="text-sm text-gray-700">
            We sent an OTP to <strong>{form.email}</strong>. Enter it below.
          </p>

          <div>
            <label className="block text-sm text-gray-700 mb-1">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting
                  ? "bg-blue-300 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={() => setStage("form")}
              className="px-4 py-2 rounded-md border"
            >
              Edit details
            </button>
          </div>
        </form>
      )}

      {stage === "done" && (
        <div>
          <h2 className="text-2xl font-semibold">Signup complete</h2>
          <p className="mt-2">
            Welcome, {user?.name || form.name} — your email is verified.
          </p>
        </div>
      )}
    </div>
  );
};

export default Signup_page;
