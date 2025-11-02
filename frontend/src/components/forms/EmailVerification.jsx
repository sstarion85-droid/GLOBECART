import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MailCheck } from "lucide-react";
import API from "../../config/axios";

export default function EmailVerificationPopup({ email, onClose }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Enter the verification code.");

    setLoading(true);
    setMessage("");

    try {
      const res = await API.verifyEmail({ email, otp });
      console.log("Verification Response:", res);
      setMessage("✅ Email verified successfully!");
      setTimeout(() => {
        onClose(); // Close the popup after success
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid or expired code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResend = async () => {
    setResending(true);
    setMessage("");

    try {
      await API.signupStart({ email, type: "email" });
      setMessage("📩 New verification code sent to your email!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white text-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 transition"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <MailCheck size={50} className="text-indigo-600 mb-3" />
            <h2 className="text-2xl font-bold">Verify your email</h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              We’ve sent a 6-digit verification code to:
              <br />
              <span className="text-indigo-600 font-medium">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-center tracking-widest text-lg font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium text-white transition-all ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
              }`}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-indigo-600 hover:underline disabled:text-gray-400"
              >
                {resending ? "Resending..." : "Resend Code"}
              </button>
            </div>

            {message && (
              <p
                className={`text-center text-sm mt-2 ${
                  message.includes("✅")
                    ? "text-green-600"
                    : message.includes("❌")
                    ? "text-red-500"
                    : "text-indigo-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
