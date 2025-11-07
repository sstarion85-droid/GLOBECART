import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet"; // Add Helmet for security
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import "./config/passport.js"; // Passport Google Strategy

// ===== INITIAL SETUP =====
dotenv.config();
connectDB();
const app = express();

// For resolving paths (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== SECURITY & MIDDLEWARE =====
app.use(helmet({ contentSecurityPolicy: false })); // Allow local connections
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow your frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== SESSION =====
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// ===== PASSPORT =====
app.use(passport.initialize());
app.use(passport.session());

// ===== ROUTES =====
app.use("/api/auth", authRoutes);

// ===== SERVE FRONTEND BUILD =====
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// ✅ CATCH-ALL ROUTE FOR REACT ROUTER
// This replaces your app.get("(.*)", ...) to prevent PathError
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Server error" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("🌍 Accessible in your network using your local IP");
});
