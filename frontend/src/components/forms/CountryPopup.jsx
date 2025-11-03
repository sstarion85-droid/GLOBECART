import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CountrySelector from "./CountrySelector";
import { useEffect } from "react";

export default function CountryPopup({ open, onClose, value, onSelect }) {
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="country-popup"
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-lg p-6 relative border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-5 text-center text-gray-800 tracking-tight">
              Select Your Country
            </h3>

            {/* Country Selector */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <CountrySelector
                value={value}
                onChange={(code) => {
                  onSelect(code);
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
