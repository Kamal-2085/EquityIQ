import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login_page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: data.identifier,
        password: data.password,
      });

      if (res.data?.user) {
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = { user: res.data.user, expiresAt };
        localStorage.setItem("equityiq_user", JSON.stringify(payload));
        window.dispatchEvent(new Event("equityiq_user_updated"));
      }

      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      const normalized = String(message).toLowerCase();
      const displayMessage = normalized.includes("invalid")
        ? "Incorrect Password"
        : message;
      toast.error(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Sign in to EquityIQ
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Email or phone number
          </label>
          <input
            id="identifier"
            type="text"
            placeholder="Enter your email address or phone no"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("identifier", { required: true })}
          />
          {errors.identifier && (
            <p className="text-xs text-red-500">Email or phone is required</p>
          )}

          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-xs text-red-500">Password is required</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login_page;
