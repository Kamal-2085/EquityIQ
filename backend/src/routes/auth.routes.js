import express from "express";
import User from "../models/User.model.js";
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
  verifyBankOtp,
  submitUpiTransaction,
} from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Get current user info by email (for balance refresh)
router.get("/me", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

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

router.post("/submit-upi-transaction", submitUpiTransaction);
router.post("/verify-bank-otp", verifyBankOtp);

export default router;
