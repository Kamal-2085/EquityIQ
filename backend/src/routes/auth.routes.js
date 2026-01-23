import express from "express";
import {
  signup,
  verifyEmailOtp,
  login,
  updateProfileImage,
} from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/login", login);
router.put("/profile-image", upload.single("image"), updateProfileImage);

export default router;
