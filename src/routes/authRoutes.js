import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { username, contact, address, password } = req.body;

  if (!username || !contact || !address || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user = new User({ username, contact, address, password });
    await user.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user)
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  res.json({
    success: true,
    token: "dummy-token-" + user._id,
    user,
  });
});

export default router;
