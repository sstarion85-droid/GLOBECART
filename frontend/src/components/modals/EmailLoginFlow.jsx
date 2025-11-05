import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import EmailInput from "../forms/EmailInput";

export default function EmailLoginFlow({ onClose, switchMode, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ===== LOGIN FUNCTION =====
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    if (!isValidEmail) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);

      // ✅ Redirect user directly to HomePage (via app-level handler)
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onClose) {
        onClose();
      }

      // ❌ Removed alert and double close call
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLE ENTER KEY =====
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValidEmail && password && !loading) {
      handleLogin();
    }
  };

  // ===== PASSWORD RESET FUNCTION =====
  const handlePasswordReset = async () => {
    if (!isValidEmail) {
      setError("Enter a valid email to reset password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset email");

      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 w-80 text-center text-gray-900 shadow-lg"
    >
      <FaEnvelope className="text-3xl text-orange-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold mb-4">
        {showReset ? "Reset Password" : "Login with Email"}
      </h2>

      <AnimatePresence mode="wait">
        {!showReset ? (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <EmailInput
              email={email}
              setEmail={setEmail}
              placeholder="Enter your email"
              autoFocus
            />

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2 border rounded-lg mb-1 text-center outline-none pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              onClick={() => setShowReset(true)}
              className="text-sm text-orange-500 hover:underline mb-3"
            >
              Forgot Password?
            </button>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={!isValidEmail || !password || loading}
              className={`w-full py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
                isValidEmail && password && !loading
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-80"
              }`}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              onClick={switchMode}
              disabled={loading}
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-70"
            >
              Sign Up
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="reset-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <EmailInput
              email={email}
              setEmail={setEmail}
              placeholder="Enter your email"
              autoFocus
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {resetSent && (
              <p className="text-green-600 text-sm mb-3">
                ✅ Password reset link sent to your email.
              </p>
            )}

            <button
              onClick={handlePasswordReset}
              disabled={!isValidEmail || loading}
              className={`w-full py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
                isValidEmail && !loading
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-80"
              }`}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              onClick={() => {
                setShowReset(false);
                setResetSent(false);
                setError("");
              }}
              disabled={loading}
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-70"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
