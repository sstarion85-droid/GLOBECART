import { motion } from "framer-motion";

export default function GuestAccessPopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-80 text-center text-gray-900 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4">Continue as Guest</h2>
        <p className="text-sm text-gray-500 mb-6">
          Access Globecart without an account. Full functionality may require registration.
        </p>

        <button
          onClick={onConfirm}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mb-2"
        >
          Okay
        </button>

        <button
          onClick={onCancel}
          className="w-full text-gray-500 py-2 text-sm rounded-lg hover:underline transition"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
