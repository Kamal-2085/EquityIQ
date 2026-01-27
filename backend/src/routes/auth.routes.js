import express from "express";
import {
  signup,
  verifyEmailOtp,
  login,
  updateProfileImage,
  sendPaymentOtp,
  verifyPaymentOtp,
  sendPasswordOtp,
  verifyPasswordOtp,
  updatePassword,
  verifyBankDetails,
} from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/send-payment-otp", sendPaymentOtp);
router.post("/verify-payment-otp", verifyPaymentOtp);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/login", login);
router.put("/profile-image", upload.single("image"), updateProfileImage);
router.post("/send-password-otp", sendPasswordOtp);
router.post("/verify-password-otp", verifyPasswordOtp);
router.post("/update-password", updatePassword);
router.post("/verify-bank-details", verifyBankDetails);

export default router;
