import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, CheckCircle2 } from "lucide-react";
import CountryPopup from "../forms/CountryPopup";
import ForgetPassword from "../forms/ForgetPassword";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countryPhoneRules from "../../utils/countryPhoneRules";
import PrimaryButton from "../ui/PrimaryButton"; // shared button component

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close when clicking outside the card
      >
        <motion.div
          key="login-card"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-100"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Login to Your Account
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
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
                className="flex flex-col items-center text-green-600 space-y-3"
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
                className="space-y-5 mt-4"
              >
                {/* Phone Input */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 border-r border-gray-300 hover:bg-gray-200 transition"
                  >
                    {countryCode}
                  </button>
                  <div className="relative flex-1">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={formattedPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Phone number"
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-gray-50 text-gray-800 rounded-r-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-amber-500 transition">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2.5 outline-none bg-gray-50 text-gray-800 rounded-lg"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* Consistent Primary Button */}
                <PrimaryButton
                  type="submit"
                  loading={loading}
                  loadingText="Logging in..."
                  disabled={!phone || !password}
                >
                  Login
                </PrimaryButton>

                {/* Footer Links */}
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <button
                    type="button"
                    onClick={onSignup}
                    className="text-amber-600 hover:underline"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgetPassword(true)}
                    className="text-amber-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Country Selector */}
          <CountryPopup
            open={showCountryPopup}
            onClose={() => setShowCountryPopup(false)}
            value={countryCode}
            onSelect={(code) => setCountryCode(code)}
          />

          {/* Forgot Password Popup */}
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
