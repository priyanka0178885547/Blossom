const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Create MongoDB connection
const userDB = mongoose.createConnection(process.env.USER_DB_URI);

// Load User model using the connection
const User = require('../models/User')(userDB);

// ------------------- Signup API -------------------
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Signup successful!", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user.", error: error.message });
  }
});

// ------------------- Login API (POST) -------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
// Assuming you already fetched the user and created the JWT
res.status(200).json({
  message: "Login successful!",
  token,
  role: user.role, // ✅ send back the role
});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in.", error: error.message });
  }
});

module.exports = router;
