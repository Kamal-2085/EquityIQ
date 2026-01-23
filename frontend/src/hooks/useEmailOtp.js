import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useEmailOtp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendOtp = async ({ endpoint, payload, onSuccess, successMessage }) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(endpoint, payload);
      if (res.data?.otpSent || res.data?.otpPreview) {
        toast.success(successMessage || "OTP sent successfully");
        onSuccess?.(res.data);
      } else {
        toast.error(res.data?.message || "Unable to send OTP");
      }
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async ({
    endpoint,
    payload,
    onSuccess,
    successMessage,
  }) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(endpoint, payload);
      toast.success(successMessage || "OTP verified successfully");
      onSuccess?.(res.data);
      return res.data;
    } catch (error) {
      toast.error("OTP verification failed");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    sendOtp,
    verifyOtp,
  };
};

export default useEmailOtp;
