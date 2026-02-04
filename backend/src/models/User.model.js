import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    transactionHistory: [
      {
        txnId: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        txnType: { type: String, enum: ["Add", "Withdraw", "OTPNotVerified"] },
        status: { type: String, default: "pending" },
      },
    ],
    bankAccount: {
      // accountHolderName removed
      accountNumber: { type: String },
      ifsc: { type: String },
      bankName: { type: String },
      bankCode: { type: String }, // e.g. HDFC, SBI, ICICI
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.index(
  { "bankAccount.accountNumber": 1 },
  { unique: true, sparse: true },
);

export default mongoose.model("User", userSchema);
