import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const applyMiddlewares = (app) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  app.use(cors({ origin: clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
};

export default applyMiddlewares;
