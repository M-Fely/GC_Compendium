import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import chatRouter from "./routes/chat_engine.js";
import healthRouter from "./routes/health.js";
import uploadRouter from "./routes/upload.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/health", healthRouter);
app.use("/chat", chatRouter);
app.use("/upload", uploadRouter);

app.listen(port, () => {
  console.log("Im workingggggggggg!");
});
