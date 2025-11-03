import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, Loader2, CheckCircle2 } from "lucide-react";
import CountryPopup from "../forms/CountryPopup";
import ForgetPassword from "../forms/ForgetPassword"; // ✅ import added
import { AsYouType } from "libphonenumber-js";
import countryPhoneRules from "../../utils/countryPhoneRules";

export default function PhoneLoginForm({ onClose, onSignup }) {
  const [countryCode, setCountryCode] = useState("+20");
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false); // ✅ new state
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
    const formatted = new AsYouType(countryCode.replace("+", "")).input(trimmed);
    setPhone(trimmed);
    setFormattedPhone(formatted);
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Please enter both phone and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // simulate login success
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="phone-login-popup"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="login-card"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Login to Your Account</h2>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-500 text-sm font-medium transition"
            >
              Cancel
            </button>
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
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 border-r border-gray-300 hover:bg-gray-200 transition"
                  >
                    <span>{countryCode}</span>
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
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-white text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-amber-500">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 outline-none bg-white text-gray-800 rounded-lg"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all ${
                    loading
                      ? "bg-amber-300 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 shadow-md"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

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
                    onClick={() => setShowForgetPassword(true)} // ✅ show forgot password popup
                    className="hover:underline text-amber-600"
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Country Popup */}
          <CountryPopup
            open={showCountryPopup}
            onClose={() => setShowCountryPopup(false)}
            value={countryCode}
            onSelect={(code) => setCountryCode(code)}
          />

          {/* ✅ Forgot Password Popup */}
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
