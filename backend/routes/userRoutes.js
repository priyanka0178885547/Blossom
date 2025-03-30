const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error });
  }
});

module.exports = router;
