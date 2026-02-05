import User from "../models/User.model.js";
import PendingUser from "../models/PendingUser.model.js";
import PendingTransaction from "../models/PendingTransaction.model.js";
import bcrypt from "bcryptjs";
import {
  sendOtpEmail,
  sendAddMoneyEmail,
  sendBankAccountAddedEmail,
  sendWithdrawalRequestEmail,
} from "../config/mailer.js";
import { sendWelcomeEmail } from "../config/mailer.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";

const ACCESS_EXP = process.env.ACCESS_EXP || "15m";
const REFRESH_EXP_SECONDS = process.env.REFRESH_EXP_SECONDS
  ? Number(process.env.REFRESH_EXP_SECONDS)
  : 7 * 24 * 60 * 60; // 7 days

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_SECRET || "access_secret", {
    expiresIn: ACCESS_EXP,
  });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_SECRET || "refresh_secret", {
    expiresIn: REFRESH_EXP_SECONDS,
  });
}

// Store UPI Transaction ID for user
export const submitUpiTransaction = async (req, res) => {
  try {
    const { email, txnId, amount } = req.body;
    if (!email || !txnId || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const normalizedTxnId = String(txnId).trim().toLowerCase();
    // Check if txnId exists for any user (case-insensitive, trimmed)
    // Ignore records that are still `OTPNotVerified` (user submitted txnId but hasn't verified)
    const existing = await User.findOne({
      transactionHistory: {
        $elemMatch: {
          txnId: { $regex: `^${normalizedTxnId}$`, $options: "i" },
          txnType: { $ne: "OTPNotVerified" },
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
    // Create a pending transaction document (auto-deletes after 10 minutes)
    try {
      await PendingTransaction.create({
        user: user._id,
        txnId: normalizedTxnId,
        amount: Number(amount),
        date: new Date(),
        txnType: "Add",
        status: "pending",
      });
    } catch (e) {
      console.error("Failed to create pending transaction:", e);
      return res.status(500).json({ message: "Failed to record transaction" });
    }
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
const OTP_EXP_MINUTES = 10;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTxnId = (prefix = "tx") => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
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
    const { email, amount, type, txnId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If txnId provided (add-money flow), enforce uniqueness against completed txns
    if (txnId) {
      const normalizedTxnId = String(txnId).trim().toLowerCase();
      const exists = await User.findOne({
        transactionHistory: {
          $elemMatch: {
            txnId: { $regex: `^${normalizedTxnId}$`, $options: "i" },
            txnType: { $ne: "OTPNotVerified" },
          },
        },
      });
      if (exists) {
        return res
          .status(400)
          .json({ message: "This transaction ID has already been processed." });
      }

      // Ensure a PendingTransaction exists for this txnId (idempotent)
      try {
        const existingPending = await PendingTransaction.findOne({
          user: user._id,
          txnId: normalizedTxnId,
        });
        if (!existingPending) {
          await PendingTransaction.create({
            user: user._id,
            txnId: normalizedTxnId,
            amount: Number(amount) || 0,
            date: new Date(),
            txnType: "Add",
            status: "pending",
          });
        }
      } catch (e) {
        console.error("Failed to ensure pending transaction for txnId:", e);
        return res
          .status(500)
          .json({ message: "Failed to create pending transaction" });
      }
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    user.otpHash = otpHash;
    user.otpExpires = otpExpires;
    await user.save();

    // If this OTP is for a withdrawal request, create a pending withdraw txn
    try {
      if (type === "withdraw" && Number(amount) > 0) {
        await PendingTransaction.create({
          user: user._id,
          txnId: generateTxnId("wd"),
          amount: Number(amount),
          date: new Date(),
          txnType: "Withdraw",
          status: "pending",
        });
      }
    } catch (txnErr) {
      console.error("Failed to create pending withdraw txn:", txnErr);
    }

    // Debug log for OTP
    console.log("[OTP DEBUG] Payment OTP generated:", {
      email: user.email,
      otp,
      otpHash,
      otpExpires,
      now: new Date(),
      amount,
      type,
    });

    try {
      const otpMailOptions = { to: user.email, name: user.name, otp };
      if (txnId || type === "add") {
        otpMailOptions.txnId = txnId || undefined;
        otpMailOptions.includeVerifyNote = true;
      }
      await sendOtpEmail(otpMailOptions);
      return res.status(200).json({
        message: "OTP sent to email.",
        otpSent: true,
        ...(process.env.NODE_ENV !== "production" ? { otpPreview: otp } : {}),
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
    const { email, otp, amount, type } = req.body;
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

    // Debug log for OTP verification
    console.log("[OTP DEBUG] Verifying OTP:", {
      email,
      enteredOtp: normalizedOtp,
      otpHash: user.otpHash,
      otpExpires: user.otpExpires,
      now: new Date(),
      amount,
      type,
    });

    const isMatch = await bcrypt.compare(normalizedOtp, user.otpHash);
    if (!isMatch) {
      console.log("[OTP DEBUG] OTP mismatch!");
      return res.status(400).json({ message: "Invalid OTP" });
    }
    console.log("[OTP DEBUG] OTP verified successfully!");

    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    // Parse amount and update user's account balance
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount > 0) {
      // Find matching pending transaction early so we can include txnId in emails
      let pendingTxn = null;
      try {
        const pendingQuery = {
          user: user._id,
          amount: parsedAmount,
          status: "pending",
        };
        if (type === "withdraw") {
          pendingQuery.txnType = "Withdraw";
        } else {
          pendingQuery.txnType = "Add";
        }
        pendingTxn = await PendingTransaction.findOne(pendingQuery).sort({
          createdAt: -1,
        });
      } catch (findErr) {
        console.error("Error finding pending transaction:", findErr);
      }

      const effectiveTxnId =
        (pendingTxn && pendingTxn.txnId) ||
        generateTxnId(type === "withdraw" ? "wd" : "add");

      if (type === "withdraw") {
        // Send withdrawal request email (include txnId)
        const dateTime = new Date().toLocaleString();
        let bankName = "-",
          last4 = "XXXX";
        if (user.bankAccount) {
          bankName = user.bankAccount.bankName || "-";
          last4 = user.bankAccount.accountNumber
            ? String(user.bankAccount.accountNumber).slice(-4)
            : "XXXX";
        }
        try {
          await sendWithdrawalRequestEmail({
            to: user.email,
            name: user.name,
            amount: parsedAmount,
            bankName,
            last4,
            dateTime,
            txnId: effectiveTxnId,
          });
        } catch (mailError) {
          console.error("Withdrawal request email send failed:", mailError);
        }
      } else {
        // Default to 'add' behavior: send processing email only
        const dateTime = new Date().toLocaleString();
        try {
          await sendAddMoneyEmail({
            to: user.email,
            name: user.name,
            amount: parsedAmount,
            dateTime,
            txnId: effectiveTxnId,
          });
        } catch (mailError) {
          console.error("Add money email send failed:", mailError);
        }
      }

      // Move matching pending transaction (from PendingTransaction collection) into user's transactionHistory
      user.transactionHistory = user.transactionHistory || [];

      if (pendingTxn) {
        user.transactionHistory.push({
          txnId:
            pendingTxn.txnId ||
            generateTxnId(type === "withdraw" ? "wd" : "add"),
          amount: parsedAmount,
          date: pendingTxn.date || new Date(),
          txnType: type === "withdraw" ? "Withdraw" : "Add",
          status: "hold",
          completedAt: new Date(),
        });
        try {
          await PendingTransaction.deleteOne({ _id: pendingTxn._id });
        } catch (delErr) {
          console.error("Failed to delete pending transaction:", delErr);
        }
      } else {
        // If no pending txn found, create a completed record so history is accurate
        user.transactionHistory.push({
          txnId: generateTxnId(type === "withdraw" ? "wd" : "add"),
          amount: parsedAmount,
          date: new Date(),
          txnType: type === "withdraw" ? "Withdraw" : "Add",
          status: "hold",
          completedAt: new Date(),
        });
      }

      try {
        await user.save();
      } catch (saveError) {
        console.error("Failed to save user after txn update:", saveError);
      }
    }

    return res.status(200).json({
      message: "OTP verified",
      accountBalance: user.accountBalance ?? 0,
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
    res.status(500).json({ message: error.message || "Server error" });
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

    // Create tokens and set refresh cookie (7 days)
    const accessToken = createAccessToken({ userId: user._id });
    const refreshToken = createRefreshToken({ userId: user._id });

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_EXP_SECONDS * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
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

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No token" });
    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_SECRET || "refresh_secret",
      );
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.refreshTokens || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    // Rotate refresh token: issue a new one and replace the old
    const accessToken = createAccessToken({ userId: user._id });
    const newRefreshToken = createRefreshToken({ userId: user._id });

    user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== token);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_EXP_SECONDS * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(
          token,
          process.env.REFRESH_SECRET || "refresh_secret",
        );
        const user = await User.findById(payload.userId);
        if (user) {
          user.refreshTokens = (user.refreshTokens || []).filter(
            (t) => t !== token,
          );
          await user.save();
        }
      } catch (e) {
        // ignore invalid token on logout
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
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
        accountBalance: user.accountBalance ?? 0,
      },
    });
  } catch (error) {
    console.error("Profile image update failed:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get user and verify bank details by mobile only
export const verifyBankDetails = async (req, res) => {
  try {
    const { mobile, accountHolderName, accountNumber } = req.body;
    if (!mobile || !accountHolderName || !accountNumber) {
      return res.status(400).json({ toast: "All fields are required." });
    }
    const normalizedAccountNumber = String(accountNumber).trim();
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ toast: "User not found." });
    }
    const existingAccount = await User.findOne({
      "bankAccount.accountNumber": normalizedAccountNumber,
    }).select("_id");
    if (existingAccount && String(existingAccount._id) !== String(user._id)) {
      return res
        .status(409)
        .json({ toast: "Account number already linked to another user." });
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
    const { mobile, otp, bankName, bankCode, accountNumber, ifscCode } =
      req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ toast: "Mobile and OTP are required." });
    }
    if (!bankName || !bankCode || !accountNumber || !ifscCode) {
      return res
        .status(400)
        .json({ toast: "All bank account fields are required." });
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
    // Save bank account details
    user.bankAccount = {
      bankName,
      bankCode,
      accountNumber,
      ifsc: ifscCode,
    };
    await user.save();

    // Send confirmation email to user
    await sendBankAccountAddedEmail({
      to: user.email,
      name: user.name,
      bankName,
      accountNumber,
      ifsc: ifscCode,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("verifyBankOtp error:", error);
    return res
      .status(500)
      .json({ toast: "Server error", error: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("stocks_watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ watchlist: user.stocks_watchlist || [] });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateWatchlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { watchlist } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!Array.isArray(watchlist)) {
      return res.status(400).json({ message: "Watchlist is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cleaned = watchlist
      .map((item) => {
        const name = item?.name ? String(item.name).trim() : "";
        const nse = item?.nse ? String(item.nse).trim() : "";
        const bse = item?.bse ? String(item.bse).trim() : "";
        const exchange = item?.exchange ? String(item.exchange).trim() : "";
        return {
          name,
          nse: nse || undefined,
          bse: bse || undefined,
          exchange: exchange || undefined,
        };
      })
      .filter((item) => item.name || item.nse || item.bse);

    const seenKeys = new Set();
    const deduped = [];
    cleaned.forEach((item) => {
      const key = String(item.nse || item.bse || item.name || "")
        .trim()
        .toUpperCase();
      if (!key || seenKeys.has(key)) return;
      seenKeys.add(key);
      deduped.push(item);
    });

    user.stocks_watchlist = deduped;
    await user.save();

    return res.status(200).json({ success: true, watchlist: deduped });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
