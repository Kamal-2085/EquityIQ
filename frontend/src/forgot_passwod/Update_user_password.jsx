import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../auth/apiClient";
import toast from "react-hot-toast";

const Update_user_password = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!email) {
      toast.error("Email not found. Please restart the reset process.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/update-password", {
        email,
        password: data.newPassword,
      });
      if (res.data?.success) {
        toast.success("Password updated successfully! Please login.");
        reset();
        navigate("/login");
      } else {
        toast.error(res.data?.message || "Failed to update password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Update User Password
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("newPassword", { required: true })}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500">New password is required</p>
          )}
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="confirm-new-password"
            type="password"
            placeholder="Confirm your new password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("confirmNewPassword", { required: true })}
          />
          {errors.confirmNewPassword && (
            <p className="text-xs text-red-500">
              Confirm new password is required
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Update_user_password;
