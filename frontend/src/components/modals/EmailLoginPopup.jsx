import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

export default function EmailLoginPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-80 text-center text-gray-900 shadow-lg"
      >
        <FaEnvelope className="text-3xl text-orange-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-4">Continue with Email</h2>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full p-2 border rounded-lg mb-3 text-center outline-none"
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 border rounded-lg mb-3 text-center outline-none"
        />
        <button className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition">
          Login
        </button>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
