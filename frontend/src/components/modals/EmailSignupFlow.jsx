import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaEnvelope, FaCheckCircle, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import EmailInput from "../forms/EmailInput";
import PasswordInput from "../forms/PasswordInput"; // <- Import advanced PasswordInput

export default function EmailSignupFlow({ onClose, switchMode, onLoginSuccess }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handleSendCode = async () => {
    if (!isValidEmail) return setError("Enter a valid email address");
    resetMessages();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/send-code`, { email: email.trim() });
      setMessage(data.message || "Verification code sent!");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return setError("Please enter a valid 6-digit code");
    resetMessages();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/verify-code`, { email: email.trim(), code: code.trim() });
      setMessage(data.message || "Email verified successfully!");
      setStep("password");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!password) return setError("Password is required");
    resetMessages();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/create-account`, { email: email.trim(), password });
      setMessage(data.message || "Account created successfully!");
      onLoginSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

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
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FaEnvelope className="text-4xl text-orange-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Sign Up</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">Continue with your email</p>

              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                onValid={(val) => setEmail(val)}
                className="mb-3"
              />

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

              <button
                onClick={handleSendCode}
                disabled={!isValidEmail || loading}
                className={`w-full py-2.5 rounded-xl font-semibold mt-2 transition-all shadow-md ${
                  !isValidEmail || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Send Code"}
              </button>

              <button
                onClick={switchMode}
                className="w-full bg-black text-white py-2.5 rounded-xl font-semibold mt-3 hover:bg-gray-900 transition-all shadow-md"
              >
                Login
              </button>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-1.5 rounded-xl text-sm bg-gray-100/80 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Verify Your Email</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter the 6-digit code sent to <span className="font-semibold">{email}</span>.
              </p>

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="6-digit code"
                  className="w-full p-2.5 border rounded-xl text-center text-gray-900 bg-white/70 dark:bg-gray-800/70 outline-none placeholder-gray-400 focus:ring-2 focus:ring-green-400"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  autoFocus
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

              <button
                onClick={handleVerify}
                disabled={code.length !== 6 || loading}
                className={`w-full py-2.5 rounded-xl font-semibold mt-2 transition-all shadow-md ${
                  code.length === 6 && !loading ? "bg-black text-white hover:bg-gray-900" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Verify"}
              </button>

              <button
                onClick={handleSendCode}
                disabled={loading}
                className="mt-3 text-sm text-orange-600 hover:underline block mx-auto"
              >
                Resend Code
              </button>

              <button
                onClick={() => setStep("email")}
                disabled={loading}
                className="mt-2 text-sm text-gray-500 hover:underline block mx-auto"
              >
                Back
              </button>
            </motion.div>
          )}

          {step === "password" && (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FaLock className="text-4xl text-blue-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Create Password</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Set a secure password for your account.</p>

              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
              />

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl font-semibold mt-2 transition-all shadow-md ${
                  loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Create Account"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
