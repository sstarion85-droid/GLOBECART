import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaEnvelope, FaCheckCircle, FaLock } from "react-icons/fa";
import EmailInput from "../forms/EmailInput";

export default function EmailSignupFlow({ onClose, switchMode, onLoginSuccess }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // ===== Send verification code =====
  const handleSendCode = async () => {
    if (!isValidEmail) return setError("Enter a valid email address");
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/send-code`, { email: email.trim() });
      setMessage(res.data.message || "Verification code sent successfully!");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // ===== Verify code =====
  const handleVerify = async () => {
    if (code.length !== 6) return setError("Please enter a valid 6-digit code");
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/verify-code`, {
        email: email.trim(),
        code: code.trim(),
      });
      setMessage(res.data.message || "Email verified successfully!");
      setStep("password");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== Create account and go to HomePage =====
  const handleCreateAccount = async () => {
    if (!password || !confirmPassword)
      return setError("Both password fields are required");
    if (password !== confirmPassword)
      return setError("Passwords do not match");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/create-account`, {
        email: email.trim(),
        password,
      });

      setMessage(res.data.message || "Account created successfully!");
      alert(`✅ ${res.data.message || "Account created successfully!"}`);

      // ✅ Go directly to HomePage
      if (onLoginSuccess) onLoginSuccess();

    } catch (err) {
      setError(err.response?.data?.error || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 w-80 text-center text-gray-900 shadow-xl"
    >
      {/* ===== EMAIL STEP ===== */}
      {step === "email" && (
        <>
          <FaEnvelope className="text-3xl text-orange-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-3">Continue with Email</h2>

          <EmailInput
            email={email}
            setEmail={setEmail}
            placeholder="Enter your email address"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}

          <button
            onClick={handleSendCode}
            disabled={!isValidEmail || loading}
            className={`w-full py-2 rounded-lg font-semibold mt-3 transition ${
              !isValidEmail || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {loading ? "Sending..." : "Sign Up"}
          </button>

          <button
            onClick={switchMode}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold mt-2 hover:bg-gray-900 transition"
          >
            Login
          </button>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </>
      )}

      {/* ===== VERIFY STEP ===== */}
      {step === "verify" && (
        <>
          <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold">{email}</span>.
          </p>

          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full p-2 border rounded-lg mb-3 text-center outline-none tracking-widest"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <button
            onClick={handleVerify}
            disabled={code.length !== 6 || loading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              code.length === 6 && !loading
                ? "bg-black text-white hover:bg-gray-900"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            onClick={handleSendCode}
            disabled={loading}
            className="mt-3 text-sm text-orange-600 hover:underline"
          >
            Resend Code
          </button>

          <button
            onClick={() => setStep("email")}
            disabled={loading}
            className="mt-2 text-sm text-gray-500 hover:underline"
          >
            Back
          </button>
        </>
      )}

      {/* ===== PASSWORD STEP ===== */}
      {step === "password" && (
        <>
          <FaLock className="text-3xl text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Create Password</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set a secure password for your account.
          </p>

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border rounded-lg mb-3 text-center outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            className="w-full p-2 border rounded-lg mb-3 text-center outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </>
      )}
    </motion.div>
  );
}
