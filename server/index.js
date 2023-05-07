import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import Router from "./routes.js";

// app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(Router);

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Not connected to DB"));

// listen
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
