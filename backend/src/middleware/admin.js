import User from "../models/User.model.js";

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select(
      "name email role isEmailVerified",
    );
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = user.role || "user";
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.currentUser = user;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default requireAdmin;
