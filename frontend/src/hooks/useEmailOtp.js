import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useEmailOtp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendOtp = async ({ endpoint, payload, onSuccess, successMessage }) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(endpoint, payload);
      const toastId = "otp-send";
      // Ensure we don't stack previous toasts
      toast.dismiss(toastId);
      // Treat any successful HTTP response (2xx) as a send success for UX
      // purposes — backend may return otpSent: false but include otpPreview
      // in non-production environments. Prefer showing a single success
      // toast with the preview when available.
      if (res.status >= 200 && res.status < 300) {
        // Show backend message or default success message; never expose otpPreview in UI
        toast.success("OTP sent to email", { id: toastId });
        onSuccess?.(res.data);
      } else {
        toast.error(res.data?.message || "Unable to send OTP", { id: toastId });
      }
      return res.data;
    } catch (error) {
      const toastId = "otp-send";
      // If axios returned a response with 2xx inside the error, treat as success.
      if (
        error?.response &&
        error.response.status >= 200 &&
        error.response.status < 300
      ) {
        toast.dismiss(toastId);
        const data = error.response.data || {};
        // Don't show dev OTP in UI; show backend message or fallback success message
        toast.success("OTP sent to email", { id: toastId });
        onSuccess?.(error.response.data);
        return error.response.data;
      }

      // Fallback: try a raw fetch in case axios fails while the server did
      // respond successfully (some proxies / dev setups cause axios to throw).
      try {
        const fetchRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (fetchRes.ok) {
          let data = null;
          try {
            data = await fetchRes.json();
          } catch (e) {
            data = null;
          }
          toast.dismiss(toastId);
          // Never display otpPreview in UI; show backend message or generic success
          toast.success("OTP sent to email", { id: toastId });
          onSuccess?.(data);
          return data;
        }
      } catch (e) {
        // ignore fetch fallback errors
      }

      toast.error(error.response?.data?.message || "Unable to send OTP", {
        id: toastId,
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async ({
    endpoint,
    payload,
    onSuccess,
    onError,
    successMessage,
  }) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(endpoint, payload);
      // Only show a toast if successMessage is provided (handled in caller for custom message)
      if (successMessage) {
        toast.success(successMessage, { id: "otp-verify" });
      }
      onSuccess?.(res.data);
      return res.data;
    } catch (error) {
      toast.error("OTP verification failed", { id: "otp-verify" });
      onError?.(error);
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
