import User from "../models/User.model.js";
import PendingUser from "../models/PendingUser.model.js";
import bcrypt from "bcryptjs";
import { sendAddMoneyEmail, sendOtpEmail } from "../config/mailer.js";
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

    const dateTime = new Date().toLocaleString();
    try {
      await sendAddMoneyEmail({
        to: user.email,
        name: user.name,
        amount: amount || 0,
        dateTime,
      });
    } catch (mailError) {
      console.error("Add money email send failed:", mailError);
    }

    return res.status(200).json({ message: "OTP verified" });
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
