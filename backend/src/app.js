import express from "express";
import authRoutes from "./routes/auth.routes.js";
import marketRoutes from "./routes/marketRoutes.js";
import applyMiddlewares from "./middleware/index.js";

const app = express();

applyMiddlewares(app);

app.get("/", (req, res) => {
  res.send("EquityIQ Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);

export default app;
