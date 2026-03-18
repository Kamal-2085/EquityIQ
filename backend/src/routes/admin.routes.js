import express from "express";
import User from "../models/User.model.js";
import requireAuth from "../middleware/auth.js";
import requireAdmin from "../middleware/admin.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

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
