import cors from "cors";
import express from "express";

const applyMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
};

export default applyMiddlewares;
