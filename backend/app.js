import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
/* import mongoose from "mongoose"; */
import connectDb from "./config/db.js";
connectDb();
/* import authRouter from "./routes/auth.js"; */
import chatRouter from "./routes/chat_engine.js";
import healthRouter from "./routes/health.js";
import uploadRouter from "./routes/upload.js";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use("/health", healthRouter);
app.use("/chat", chatRouter);
app.use("/upload", uploadRouter);

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(port, () => {
  console.log("Im workingggggggggg!");
});
