/* import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.js";

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    await User.deleteMany({});

    const hashedAdminPass = await bcrypt.hash("Admin050226", 10);
    const hashedDomainPass = await bcrypt.hash("lastnameGC2024", 10);

    await User.create([
      {
        email: "admin@gc.com",
        password: hashedAdminPass,
        role: "admin",
      },
      {
        email: "202411367@gordoncollege.edu.ph",
        password: hashedDomainPass,
        role: "student",
      },
    ]);

    console.log("Created Successfully");
    process.exit();
  } catch (error) {
    console.log("Error: ", error.message);
    process.exit(1);
  }
};

createUser();
 */
