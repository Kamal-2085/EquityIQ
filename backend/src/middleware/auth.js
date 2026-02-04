import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const header = req.headers?.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_SECRET || "access_secret",
    );
    req.userId = payload.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAuth;
