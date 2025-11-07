import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EmailSignupFlow from "./EmailSignupFlow";
import EmailLoginFlow from "./EmailLoginFlow";

export default function EmailLoginPopup({ onClose }) {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle switching mode with direction
  const switchMode = (newMode) => {
    setDirection(newMode === "signup" ? -1 : 1);
    setMode(newMode);
  };

  // Variants for sliding animation
  const variants = {
    initial: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-lg shadow-lg overflow-hidden w-[400px] max-w-[90%]"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={mode}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.05, ease: "easeInOut" }}
            >
              {mode === "signup" ? (
                <EmailSignupFlow switchMode={() => switchMode("login")} onClose={onClose} />
              ) : (
                <EmailLoginFlow switchMode={() => switchMode("signup")} onClose={onClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
