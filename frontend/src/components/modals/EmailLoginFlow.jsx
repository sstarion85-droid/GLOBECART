import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function EmailLoginFlow({ onClose, switchMode, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handleLogin = async () => {
    if (!email || !password) return setError("Both fields are required");
    if (!isValidEmail) return setError("Please enter a valid email");

    resetMessages();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      setMessage("Login successful!");
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!isValidEmail) return setError("Enter a valid email to reset password.");

    resetMessages();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset email");

      setResetSent(true);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputWithLabel = ({
    label,
    type = "text",
    value,
    onChange,
    showToggle,
    showValue,
    setShowValue,
    autoFocus,
  }) => (
    <div className="relative w-full mb-3">
      <input
        type={showToggle && showValue ? "text" : type}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder=" "
        className="peer w-full p-3 border border-gray-300/40 rounded-xl text-gray-900 bg-white/70 dark:bg-gray-800/70 placeholder-transparent focus:ring-2 focus:ring-orange-400 backdrop-blur-sm transition"
      />
      <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all 
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 
                        peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] 
                        peer-focus:text-orange-500 peer-focus:text-sm bg-white/70 dark:bg-gray-900/70 px-1">
        {label}
      </label>
      {showToggle && (
        <span
          className="absolute right-3 top-3 text-gray-500 cursor-pointer"
          onClick={() => setShowValue(!showValue)}
        >
          {showValue ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-3xl p-8 w-[90%] max-w-md shadow-2xl text-center"
      >
        <AnimatePresence mode="wait">
          {!showReset ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FaEnvelope className="text-4xl text-orange-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Login
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Login to your account to continue
              </p>

              <InputWithLabel
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />

              <InputWithLabel
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showToggle
                showValue={showPassword}
                setShowValue={setShowPassword}
              />

              <button
                onClick={() => setShowReset(true)}
                className="text-sm text-orange-600 hover:underline mb-3"
              >
                Forgot Password?
              </button>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

              <button
                onClick={handleLogin}
                disabled={!isValidEmail || !password || loading}
                className={`w-full py-2.5 rounded-xl font-semibold mt-2 transition-all shadow-md ${
                  isValidEmail && password && !loading
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Login"}
              </button>

              <button
                onClick={switchMode}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold mt-3 hover:bg-orange-600 transition-all shadow-md disabled:opacity-70"
              >
                Sign Up
              </button>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-1.5 rounded-xl text-sm bg-gray-100/80 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FaLock className="text-4xl text-blue-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter your email and we’ll send you a reset link.
              </p>

              <InputWithLabel
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
              {resetSent && (
                <p className="text-green-600 text-sm mb-2">✅ Reset link sent successfully!</p>
              )}

              <button
                onClick={handlePasswordReset}
                disabled={!isValidEmail || loading}
                className={`w-full py-2.5 rounded-xl font-semibold mt-2 transition-all shadow-md ${
                  isValidEmail && !loading
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Send Reset Link"}
              </button>

              <button
                onClick={() => {
                  setShowReset(false);
                  setResetSent(false);
                  resetMessages();
                }}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold mt-3 hover:bg-orange-600 transition-all shadow-md disabled:opacity-70"
              >
                Back to Login
              </button>

              {/* Cancel button removed here */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
