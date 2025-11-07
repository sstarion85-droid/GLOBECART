import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function GuestAccessPopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
            <User className="text-green-600 dark:text-green-400 w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-3">
          Continue as Guest
        </h2>

        {/* Description */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          Access <span className="font-medium text-green-600">Globecart</span> without an account.
          Some features may require registration later.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md"
          >
            Continue as Guest
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-600 dark:text-gray-300 py-2 text-sm rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
