import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaLock } from "react-icons/fa";
import EmailInput from "../forms/EmailInput";

export default function EmailSignupFlow({ onClose, switchMode }) {
  const [step, setStep] = useState("email"); // "email" | "verify" | "password"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (code.length !== 6) return setError("Enter 6-digit code");
    setError("");
    setStep("password");
  };

  const handleCreateAccount = () => {
    if (!password || !confirmPassword) return setError("Both fields are required");
    if (password !== confirmPassword) return setError("Passwords do not match");
    setError("");
    alert(`Account created for ${email}!`);
    onClose();
  };

  const isEmailEmpty = email.trim() === "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 w-80 text-center text-gray-900 shadow-lg"
    >
      {step === "email" && (
        <>
          <FaEnvelope className="text-3xl text-orange-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-4">Continue with Email</h2>

          <EmailInput email={email} setEmail={setEmail} placeholder="Enter your email address" />

          <button
            onClick={() => setStep("verify")}
            disabled={isEmailEmpty}
            className={`w-full py-2 rounded-lg font-semibold mt-3 transition ${
              isEmailEmpty
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            Sign Up
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

      {step === "verify" && (
        <>
          <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to {email}.</p>
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full p-2 border rounded-lg mb-3 text-center outline-none tracking-widest"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/, ""))}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleVerify}
            disabled={code.length !== 6}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              code.length === 6
                ? "bg-black text-white hover:bg-gray-900"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
          <button onClick={() => setStep("email")} className="mt-4 text-sm text-gray-500 hover:underline">
            Back
          </button>
        </>
      )}

      {step === "password" && (
        <>
          <FaLock className="text-3xl text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Create Password</h2>
          <p className="text-sm text-gray-600 mb-4">Set a secure password for your account.</p>
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
          <button
            onClick={handleCreateAccount}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Create Account
          </button>
          {/* Removed back button here */}
        </>
      )}
    </motion.div>
  );
}
