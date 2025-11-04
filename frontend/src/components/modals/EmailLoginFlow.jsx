import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import EmailInput from "../forms/EmailInput"; // Make sure the path is correct

export default function EmailLoginFlow({ onClose, switchMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    setError("");
    alert(`Logged in as ${email}`); // Replace with your login logic
    onClose();
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
      <h2 className="text-xl font-bold mb-4">Login with Email</h2>

      {/* Replaced input with EmailInput */}
      <EmailInput email={email} setEmail={setEmail} placeholder="Enter your email" autoFocus={true} />

      <div className="relative">
        <FaLock className="absolute left-3 top-3 text-gray-400" />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 border rounded-lg mb-3 text-center outline-none pl-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
      >
        Login
      </button>

      <button
        onClick={switchMode}
        className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Sign Up
      </button>

      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-500 hover:underline"
      >
        Cancel
      </button>
    </motion.div>
  );
}
