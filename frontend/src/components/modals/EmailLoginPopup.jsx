import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EmailSignupFlow from "./EmailSignupFlow";
import EmailLoginFlow from "./EmailLoginFlow";

export default function EmailLoginPopup({ onClose }) {
  const [mode, setMode] = useState("signup"); // "signup" | "login"

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // Close when clicking the background
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {mode === "signup" ? (
              <EmailSignupFlow
                onClose={onClose}
                switchMode={() => setMode("login")}
              />
            ) : (
              <EmailLoginFlow
                onClose={onClose}
                switchMode={() => setMode("signup")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
