import express from "express";
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
/* const mongoURI = process.env.MONGO_URI; */
app.use(express.json());
app.use(cors());
/* app.use("/login", authRouter); */
app.use("/health", healthRouter);
app.use("/chat", chatRouter);
app.use("/upload", uploadRouter);

/* mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to Atlas!"))
  .catch((err) => console.log("Connection Error", err)); */

app.listen(port, () => {
  console.log("Im workingggggggggg!");
});
