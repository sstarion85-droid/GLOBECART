import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, CheckCircle2, X } from "lucide-react";
import CountryPopup from "../forms/CountryPopup";
import ForgetPassword from "../forms/ForgetPassword";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countryPhoneRules from "../../utils/countryPhoneRules";
import PrimaryButton from "../ui/PrimaryButton";

export default function PhoneLoginForm({ onClose, onSignup }) {
  const [countryCode, setCountryCode] = useState("+20");
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, "");
    const maxLength = countryPhoneRules[countryCode]?.max || 15;
    const trimmed = digits.slice(0, maxLength);
    const iso = countryPhoneRules[countryCode]?.iso || "EG";

    const parsed = parsePhoneNumberFromString(trimmed, iso);
    setPhone(trimmed);
    setFormattedPhone(parsed ? parsed.formatInternational() : trimmed);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      setError("Please enter both phone and password.");
      return;
    }

    const iso = countryPhoneRules[countryCode]?.iso || "EG";
    const parsed = parsePhoneNumberFromString(phone, iso);
    if (!parsed || !parsed.isValid()) {
      setError("Invalid phone number.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate login
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="phone-login-popup"
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="login-card"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white/20 dark:bg-gray-900/30 backdrop-blur-2xl 
                     rounded-3xl p-8 border border-white/30 dark:border-gray-700/50 
                     shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {/* Glow Border Layer */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-amber-400/20 pointer-events-none"></div>

          {/* Close Button */}
          {!success && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition active:scale-90"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          )}

          {/* Header */}
          <div className="mb-6 text-center relative z-10">
            <h2 className="text-2xl font-semibold text-gray-50">
              Login to Your Account
            </h2>
            <p className="text-gray-300 mt-1 text-sm">
              Enter your phone and password to continue
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="login-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-green-400 space-y-3"
              >
                <CheckCircle2 size={60} />
                <p className="text-lg font-semibold">Login Successful!</p>
              </motion.div>
            ) : (
              <motion.form
                key="login-form"
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 mt-4 relative z-10"
              >
                {/* Phone Input */}
                <div className="flex items-center border border-white/30 dark:border-gray-700 rounded-xl 
                                overflow-hidden bg-white/10 dark:bg-gray-800/30 
                                focus-within:ring-2 focus-within:ring-green-500 transition">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 dark:bg-gray-800/40 
                               border-r border-white/20 dark:border-gray-700 text-gray-100 hover:bg-white/30 transition"
                  >
                    {countryCode}
                  </button>
                  <div className="relative flex-1">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="tel"
                      value={formattedPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Phone number"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-gray-300 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative border border-white/30 dark:border-gray-700 rounded-xl 
                                bg-white/10 dark:bg-gray-800/30 focus-within:ring-2 
                                focus-within:ring-green-500 transition">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-gray-300 outline-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                {/* Primary Button */}
                <PrimaryButton
                  type="submit"
                  loading={loading}
                  loadingText="Logging in..."
                  disabled={!phone || !password}
                  className="w-full py-2.5"
                >
                  Login
                </PrimaryButton>

                {/* Footer Links */}
                <div className="flex justify-between text-sm text-gray-300 mt-3">
                  <button
                    type="button"
                    onClick={onSignup}
                    className="text-green-400 hover:underline"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgetPassword(true)}
                    className="text-green-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Popups */}
          <CountryPopup
            open={showCountryPopup}
            onClose={() => setShowCountryPopup(false)}
            value={countryCode}
            onSelect={(code) => setCountryCode(code)}
          />

          {showForgetPassword && (
            <ForgetPassword
              onClose={() => setShowForgetPassword(false)}
              onSuccess={() => alert("Password reset successful!")}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
