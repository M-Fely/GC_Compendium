import admin from "../firebaseAdmin.js";

const adminEmails = ["gccompendiumadmin@gmail.com"];

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const allowed =
      decoded.email.endsWith("@gordoncollege.edu.ph") ||
      decoded.email === "gccompendiumadmin@gmail.com";

    if (!allowed) {
      return res.status(403).json({
        error: "Only Gordon College accounts are allowed",
      });
    }

    req.user = decoded;

    req.user.isAdmin = adminEmails.includes(decoded.email);

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: "Admin access only",
    });
  }

  next();
};
