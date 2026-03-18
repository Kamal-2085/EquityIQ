import express from "express";
import User from "../models/User.model.js";
import requireAuth from "../middleware/auth.js";
import requireAdmin from "../middleware/admin.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

const VALID_TXN_STATUSES = ["hold", "completed", "rejected"];

const normalizeTxnStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getBalanceEffect = (txnType, status, amount) => {
  if (status !== "completed") return 0;
  const normalizedType = String(txnType || "")
    .trim()
    .toLowerCase();
  if (normalizedType === "add") return amount;
  if (normalizedType === "withdraw") return -amount;
  return 0;
};

router.get("/me", (req, res) => {
  const user = req.currentUser;
  return res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
  });
});

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const verifiedUsers = await User.countDocuments({
      isEmailVerified: true,
    });

    const ticketAgg = await User.aggregate([
      {
        $project: {
          tickets: { $ifNull: ["$tickets", []] },
        },
      },
      {
        $project: {
          ticketCount: { $size: "$tickets" },
          openTickets: {
            $size: {
              $filter: {
                input: "$tickets",
                as: "ticket",
                cond: {
                  $or: [
                    { $eq: ["$$ticket.status", "open"] },
                    { $eq: ["$$ticket.status", null] },
                    { $eq: ["$$ticket.status", ""] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$ticketCount" },
          openTickets: { $sum: "$openTickets" },
        },
      },
    ]);

    const ticketSummary = ticketAgg[0] || {
      totalTickets: 0,
      openTickets: 0,
    };

    return res.status(200).json({
      stats: {
        totalUsers,
        verifiedUsers,
        totalTickets: ticketSummary.totalTickets,
        openTickets: ticketSummary.openTickets,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email phone role isEmailVerified createdAt")
      .sort({ createdAt: -1 });

    const normalized = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "user",
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    }));

    return res.status(200).json({ users: normalized });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const status = normalizeTxnStatus(req.query.status);
    const limit = Number(req.query.limit || 0);

    const matchStatus = VALID_TXN_STATUSES.includes(status) ? status : null;

    const pipeline = [
      {
        $match: {
          transactionHistory: { $exists: true, $ne: [] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          accountBalance: 1,
          transactionHistory: { $ifNull: ["$transactionHistory", []] },
        },
      },
      { $unwind: "$transactionHistory" },
    ];

    if (matchStatus) {
      pipeline.push({
        $match: {
          "transactionHistory.status": matchStatus,
        },
      });
    }

    pipeline.push(
      {
        $project: {
          userId: "$_id",
          userName: "$name",
          userEmail: "$email",
          accountBalance: 1,
          txnId: "$transactionHistory.txnId",
          amount: "$transactionHistory.amount",
          date: "$transactionHistory.date",
          txnType: "$transactionHistory.txnType",
          status: {
            $ifNull: ["$transactionHistory.status", "hold"],
          },
        },
      },
      { $sort: { date: -1 } },
    );

    if (Number.isFinite(limit) && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const transactions = await User.aggregate(pipeline);

    return res.status(200).json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/transactions/:userId/:txnId/status", async (req, res) => {
  try {
    const userId = String(req.params.userId || "").trim();
    const txnId = String(req.params.txnId || "").trim();
    const nextStatus = normalizeTxnStatus(req.body?.status);

    if (!userId || !txnId) {
      return res
        .status(400)
        .json({ message: "User id and transaction id are required" });
    }

    if (!VALID_TXN_STATUSES.includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid transaction status" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = user.transactionHistory || [];
    const txnIndex = transactions.findIndex(
      (txn) =>
        String(txn?.txnId || "")
          .trim()
          .toLowerCase() === txnId.toLowerCase(),
    );

    if (txnIndex < 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const txn = transactions[txnIndex];
    const prevStatus = normalizeTxnStatus(txn.status) || "hold";
    const amount = Number(txn.amount) || 0;

    const previousEffect = getBalanceEffect(txn.txnType, prevStatus, amount);
    const nextEffect = getBalanceEffect(txn.txnType, nextStatus, amount);
    const balanceDelta = nextEffect - previousEffect;
    const nextBalance = (Number(user.accountBalance) || 0) + balanceDelta;

    if (nextBalance < 0) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to complete withdrawal" });
    }

    txn.status = nextStatus;
    user.accountBalance = Number(nextBalance.toFixed(2));
    await user.save();

    return res.status(200).json({
      message: "Transaction status updated",
      transaction: {
        txnId: txn.txnId,
        amount: txn.amount,
        date: txn.date,
        txnType: txn.txnType,
        status: txn.status,
      },
      user: {
        id: user._id,
        accountBalance: user.accountBalance,
      },
      balanceDelta,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const normalized = String(role || "")
      .trim()
      .toLowerCase();
    if (!normalized || !["user", "admin"].includes(normalized)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = normalized;
    await user.save();

    return res.status(200).json({
      message: "Role updated",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (String(req.userId) === String(req.params.id)) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/tickets", async (req, res) => {
  try {
    const status = String(req.query.status || "")
      .trim()
      .toLowerCase();
    const limit = Number(req.query.limit || 0);

    const matchStatus = ["open", "in_progress", "closed"].includes(status)
      ? status
      : null;

    const pipeline = [
      { $match: { tickets: { $exists: true, $ne: [] } } },
      { $unwind: "$tickets" },
    ];

    if (matchStatus) {
      const matchStage =
        matchStatus === "open"
          ? {
              $match: {
                $or: [
                  { "tickets.status": "open" },
                  { "tickets.status": { $exists: false } },
                  { "tickets.status": null },
                  { "tickets.status": "" },
                ],
              },
            }
          : { $match: { "tickets.status": matchStatus } };
      pipeline.push(matchStage);
    }

    pipeline.push(
      {
        $project: {
          ticketId: "$tickets.ticketId",
          title: "$tickets.title",
          desc: "$tickets.desc",
          status: { $ifNull: ["$tickets.status", "open"] },
          adminReply: { $ifNull: ["$tickets.adminReply", ""] },
          createdAt: "$tickets.createdAt",
          updatedAt: "$tickets.updatedAt",
          userId: "$_id",
          userName: "$name",
          userEmail: "$email",
        },
      },
      { $sort: { createdAt: -1 } },
    );

    if (Number.isFinite(limit) && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const tickets = await User.aggregate(pipeline);

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/tickets/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    const status = String(req.body?.status || "")
      .trim()
      .toLowerCase();
    const adminReply = String(req.body?.adminReply || "").trim();

    const update = { "tickets.$.updatedAt": new Date() };

    if (status) {
      if (!["open", "in_progress", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      update["tickets.$.status"] = status;
    }

    if (req.body?.adminReply !== undefined) {
      update["tickets.$.adminReply"] = adminReply;
    }

    const user = await User.findOneAndUpdate(
      { "tickets.ticketId": ticketId },
      { $set: update },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updatedTicket = (user.tickets || []).find(
      (ticket) => ticket.ticketId === ticketId,
    );

    return res.status(200).json({
      message: "Ticket updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
