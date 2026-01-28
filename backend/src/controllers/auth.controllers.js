// Store UPI Transaction ID for user
export const submitUpiTransaction = async (req, res) => {
  try {
    const { email, txnId, amount } = req.body;
    if (!email || !txnId || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const normalizedTxnId = String(txnId).trim().toLowerCase();
    // Check if txnId exists for any user (case-insensitive, trimmed)
    const existing = await User.findOne({
      transactionHistory: {
        $elemMatch: {
          txnId: { $regex: `^${normalizedTxnId}$`, $options: "i" },
        },
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Payment can't be verified" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.transactionHistory = user.transactionHistory || [];
    user.transactionHistory.push({
      txnId: normalizedTxnId,
      amount,
      date: new Date(),
    });
    await user.save();
    return res
      .status(200)
      .json({ message: "Transaction recorded successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
// Update user password (after OTP verification)
export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Send password reset OTP
export const sendPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();
    try {
      await sendOtpEmail({ to: user.email, name: user.name, otp });
      return res
        .status(200)
        .json({ message: "OTP sent to email.", otpSent: true });
    } catch (mailError) {
      console.error("Password OTP email send failed:", mailError);
      const response = {
        message: "Failed to send OTP email. Please try again later.",
        otpSent: false,
      };
      if (process.env.NODE_ENV !== "production") {
        response.otpPreview = otp;
      }
      return res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verify password reset OTP
export const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otpHash || !user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }
    if (Date.now() > user.otpExpires.getTime()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }
    const isMatch = await bcrypt.compare(String(otp).trim(), user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otpHash = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({ verified: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
import User from "../models/User.model.js";
import PendingUser from "../models/PendingUser.model.js";
import bcrypt from "bcryptjs";
import { sendOtpEmail, sendAddMoneyEmail } from "../config/mailer.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const OTP_EXP_MINUTES = 10;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!name || !normalizedEmail || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const existingPendingByEmail = await PendingUser.findOne({
      email: normalizedEmail,
    });
    const existingPendingByPhone = await PendingUser.findOne({ phone });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    const pendingPayload = {
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      otpHash,
      otpExpires,
    };

    if (existingPendingByEmail) {
      await PendingUser.updateOne({ email: normalizedEmail }, pendingPayload);
    } else if (existingPendingByPhone) {
      await PendingUser.updateOne({ phone }, pendingPayload);
    } else {
      await PendingUser.create(pendingPayload);
    }

    try {
      await sendOtpEmail({ to: normalizedEmail, name, otp });
      return res.status(201).json({
        message: "Signup successful. OTP sent to email.",
        otpSent: true,
        user: {
          name,
          email: normalizedEmail,
          phone,
          isEmailVerified: false,
          avatarUrl: null,
        },
      });
    } catch (mailError) {
      console.error("OTP email send failed:", mailError);
      const response = {
        message:
          "Signup successful, but failed to send OTP email. Please try again later.",
        otpSent: false,
        user: {
          name,
          email: normalizedEmail,
          phone,
          isEmailVerified: false,
          avatarUrl: null,
        },
      };
      if (process.env.NODE_ENV !== "production") {
        response.otpPreview = otp;
      }
      return res.status(201).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const sendPaymentOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await sendOtpEmail({ to: user.email, name: user.name, otp });
      return res.status(200).json({
        message: "OTP sent to email.",
        otpSent: true,
      });
    } catch (mailError) {
      console.error("Payment OTP email send failed:", mailError);
      const response = {
        message: "Failed to send OTP email. Please try again later.",
        otpSent: false,
      };
      if (process.env.NODE_ENV !== "production") {
        response.otpPreview = otp;
      }
      return res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPaymentOtp = async (req, res) => {
  try {
    const { email, otp, amount } = req.body;
    const normalizedOtp = String(otp || "").trim();

    if (!email || !normalizedOtp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpHash || !user.otpExpires) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }

    if (Date.now() > user.otpExpires.getTime()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(normalizedOtp, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    // Parse amount and update user's account balance
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount > 0) {
      user.accountBalance = (user.accountBalance || 0) + parsedAmount;
      try {
        await user.save();
      } catch (saveError) {
        console.error("Failed to update account balance:", saveError);
      }
    }

    const dateTime = new Date().toLocaleString();
    try {
      await sendAddMoneyEmail({
        to: user.email,
        name: user.name,
        amount: parsedAmount,
        dateTime,
      });
    } catch (mailError) {
      console.error("Add money email send failed:", mailError);
    }

    return res
      .status(200)
      .json({ message: "OTP verified", accountBalance: user.accountBalance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedOtp = String(otp || "").trim();

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });
    if (!pendingUser) {
      return res.status(404).json({ message: "Pending signup not found" });
    }

    if (
      !pendingUser.otpHash ||
      !pendingUser.otpExpires ||
      Date.now() > pendingUser.otpExpires.getTime()
    ) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(normalizedOtp, pendingUser.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({
      $or: [{ email: pendingUser.email }, { phone: pendingUser.phone }],
    });

    if (user) {
      user.name = pendingUser.name;
      user.email = pendingUser.email;
      user.phone = pendingUser.phone;
      user.password = pendingUser.password;
      user.isEmailVerified = true;
      user.otpHash = null;
      user.otpExpires = null;
      await user.save();
    } else {
      user = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
        password: pendingUser.password,
        isEmailVerified: true,
      });
    }

    await PendingUser.deleteOne({ email: normalizedEmail });

    // Send welcome email after successful signup verification
    try {
      await sendWelcomeEmail({ to: user.email, name: user.name });
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
        accountBalance: user.accountBalance ?? 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "equityiq/avatars",
      resource_type: "image",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (deleteError) {
        console.error("Failed to remove old avatar:", deleteError);
      }
    }

    user.avatarUrl = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    await user.save();

    return res.status(200).json({
      message: "Profile image updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Profile image update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user and verify bank details by mobile only
export const verifyBankDetails = async (req, res) => {
  try {
    const { mobile, accountHolderName } = req.body;
    if (!mobile || !accountHolderName) {
      return res.status(400).json({ toast: "All fields are required." });
    }
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ toast: "User not found." });
    }
    if (
      mobile !== user.phone ||
      accountHolderName.trim().toLowerCase() !== user.name.trim().toLowerCase()
    ) {
      return res.status(400).json({
        toast:
          "The details you entered do not match your registered information.",
      });
    }
    // Generate OTP and send to user's email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();
    await sendOtpEmail({ to: user.email, name: user.name, otp });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ toast: "Server error" });
  }
};

// Verify OTP for bank details using mobile and otp
export const verifyBankOtp = async (req, res) => {
  try {
    const { mobile, otp, bankName, accountHolderName, accountNumber } =
      req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ toast: "Mobile and OTP are required." });
    }
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ toast: "User not found." });
    }
    if (!user.otpHash || !user.otpExpires) {
      return res
        .status(400)
        .json({ toast: "OTP not found. Please request a new one." });
    }
    if (Date.now() > user.otpExpires.getTime()) {
      return res
        .status(400)
        .json({ toast: "OTP expired. Please request a new one." });
    }
    const isMatch = await bcrypt.compare(String(otp).trim(), user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ toast: "Invalid OTP." });
    }
    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    // Send confirmation email to user
    const last4 = accountNumber ? String(accountNumber).slice(-4) : "XXXX";
    const message = `Hi ${user.name},\n\nYour bank account has been **successfully added** to your **EquityIQ** account ✅\n\n**Bank details:**\n\n* **Bank:** ${bankName || "-"}\n* **Account holder name:** ${accountHolderName || user.name}\n* **Account number:** XXXX${last4}\n\nYou can now use this bank account for withdrawals on EquityIQ.\n\nIf you didn’t make this change or notice anything unusual, please contact us immediately.\n\nThanks for choosing EquityIQ,\n**Team EquityIQ**`;
    await sendOtpEmail({ to: user.email, name: user.name, otp: message });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ toast: "Server error" });
  }
};
