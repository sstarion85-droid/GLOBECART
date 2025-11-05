import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import { sendVerificationCode } from "../utils/mailer.js";

const router = express.Router();

// Temporary code store (for testing)
const codes = {};

// ===== SEND VERIFICATION CODE =====
router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ error: "Account already exists" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await sendVerificationCode(email, code);
    res.json({ message: "Verification code sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

// ===== VERIFY CODE =====
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const record = codes[email];

  if (!record) return res.status(400).json({ error: "No code sent to this email" });
  if (Date.now() > record.expires) return res.status(400).json({ error: "Code expired" });
  if (record.code !== code) return res.status(400).json({ error: "Invalid code" });

  // mark verified in memory
  codes[email].verified = true;
  res.json({ message: "Email verified successfully!" });
});

// ===== CREATE ACCOUNT =====
router.post("/create-account", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  // Check if verified before allowing creation
  const record = codes[email];
  if (!record || !record.verified)
    return res.status(400).json({ error: "Please verify your email first" });

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      verified: true,
    });

    await newUser.save();

    // remove used code
    delete codes[email];

    res.json({ message: "Account created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== GOOGLE LOGIN =====

// Start Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Redirect to frontend with JWT
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

export default router;
