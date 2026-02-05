import mongoose from "mongoose";

const pendingTxnSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    txnId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    txnType: {
      type: String,
      enum: ["Add", "Withdraw"],
      required: true,
    },
    status: { type: String, default: "pending" },
    meta: { type: Object },
  },
  { timestamps: true },
);

// TTL index to auto-delete pending transactions after 10 minutes
pendingTxnSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model("PendingTransaction", pendingTxnSchema);
