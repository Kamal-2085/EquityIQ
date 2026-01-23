import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Send_otp = () => {
  const [step, setStep] = useState("signup");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data,
      );
      if (res.data?.otpSent) {
        setPendingEmail(data.email);
        setStep("verify");
        toast.success("OTP sent to your email 📩");
      } else if (res.data?.otpPreview) {
        //have to remove this in production
        setPendingEmail(data.email);
        setStep("verify");
        toast.success("OTP sent successfully");
      } else {
        toast.error(res.data?.message || "Unable to send OTP email");
      }
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyOtp = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        email: pendingEmail,
        otp: data.otpCode,
      };
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-email-otp",
        payload,
      );
      toast.success("Email verified successfully ✅");
      if (res.data?.user) {
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = { user: res.data.user, expiresAt };
        localStorage.setItem("equityiq_user", JSON.stringify(payload));
        window.dispatchEvent(new Event("equityiq_user_updated"));
      }
      resetOtpForm();
      setStep("signup");
      setPendingEmail("");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === "verify") {
      resetOtpForm({ otpCode: "" });
    }
  }, [step, resetOtpForm]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      {step === "signup" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-96 p-8 rounded-xl shadow-md"
        >
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create your EquityIQ account
          </h1>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              {...register("phone", {
                required: true,
                pattern: /^\+?[0-9]{7,15}$/,
              })}
              type="tel"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phone?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Phone is required</p>
            )}
            {errors.phone?.type === "pattern" && (
              <p className="text-red-500 text-sm mt-1">
                Enter a valid phone number
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>
          <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
            <input
              id="termsAgreement"
              type="checkbox"
              {...register("termsAgreement", { required: true })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 accent-green-600 focus:ring-green-500 cursor-pointer"
            />
            <label htmlFor="termsAgreement" className="leading-5">
              By proceeding, you agree to the EquityIQ{" "}
              <Link
                to="/TermsAndConditions"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                terms
              </Link>{" "}
              &{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                privacy policy
              </Link>
            </label>
          </div>
          {errors.termsAgreement && (
            <p className="mt-1 text-xs text-red-500">
              You must accept the terms & privacy policy
            </p>
          )}
          <p className="mt-2 text-sm text-gray-600 ">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Click here
            </Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitOtp(onVerifyOtp)}
          autoComplete="off"
          className="bg-white w-96 p-8 rounded-xl shadow-md"
        >
          <input
            type="text"
            name="email"
            autoComplete="email"
            tabIndex={-1}
            className="hidden"
            value={pendingEmail}
            readOnly
          />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            tabIndex={-1}
            className="hidden"
            value=""
            readOnly
          />
          <h1 className="text-2xl font-semibold mb-2 text-center">
            Verify your email
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{pendingEmail}</span>
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">OTP</label>
            <input
              {...registerOtp("otpCode", {
                required: true,
                minLength: 6,
                maxLength: 6,
                onChange: (event) => {
                  event.target.value = event.target.value.replace(/\D/g, "");
                },
              })}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-form-type="other"
              className="w-full border rounded-lg px-3 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
            {otpErrors.otpCode && (
              <p className="text-red-500 text-sm mt-1">
                Enter a valid 6-digit OTP
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP & Signup"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("signup");
              setPendingEmail("");
            }}
            className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800"
          >
            Use a different email
          </button>
        </form>
      )}
    </section>
  );
};

export default Send_otp;
