/* import express from "express";
import { User } from "../models/documents.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.status(200).json({
        success: true,
        message: "Login successful!",
        role: user.role,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log("Something went wrong: ", error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
 */
