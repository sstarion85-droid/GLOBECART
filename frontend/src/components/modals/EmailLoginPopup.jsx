import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EmailSignupFlow from "./EmailSignupFlow";
import EmailLoginFlow from "./EmailLoginFlow";

export default function EmailLoginPopup({ onClose }) {
  const [mode, setMode] = useState("signup"); // "signup" | "login"

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {mode === "signup" && (
          <EmailSignupFlow key="signup" onClose={onClose} switchMode={() => setMode("login")} />
        )}

        {mode === "login" && (
          <EmailLoginFlow key="login" onClose={onClose} switchMode={() => setMode("signup")} />
        )}
      </AnimatePresence>
    </div>
  );
}
