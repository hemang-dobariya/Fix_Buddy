const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { getDB } = require("../config/db");

const hashPassword = (password) => {
  const salt = "fixbuddy_salt";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
};

router.post("/register", async (req, res) => {
  try {
    const { name, role, email, password } = req.body;
    if (!name || !role || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const db = getDB();
    const users = db.collection("userdata");

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const newUser = {
      name,
      role,
      email: email.toLowerCase(),
      password: hashPassword(password),
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const user = { _id: result.insertedId, name, role, email: newUser.email, createdAt: newUser.createdAt };

    return res.status(201).json({ success: true, message: "User registered successfully.", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const db = getDB();
    const users = db.collection("userdata");

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const safeUser = { _id: user._id, name: user.name, role: user.role, email: user.email, createdAt: user.createdAt };
    return res.status(200).json({ success: true, message: "Login successful.", user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});




module.exports = router;