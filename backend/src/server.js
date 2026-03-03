import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startMarketSocket } from "./ws/marketSocket.js";

console.log("server.js loaded");

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

startMarketSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
