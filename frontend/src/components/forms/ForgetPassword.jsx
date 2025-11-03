import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, Loader2, ArrowLeft } from "lucide-react";
import OTPInput from "../forms/OTPInput.jsx"; // updated import
import CountryPopup from "../forms/CountryPopup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function ForgetPassword({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+20");
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPhoneValid = () => {
    try {
      const phoneObj = parsePhoneNumberFromString(countryCode + phone);
      return phoneObj && phoneObj.isValid();
    } catch {
      return false;
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!isPhoneValid()) {
      setError("Invalid phone number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) {
      setError("Enter full OTP.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password too short.");
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess?.();
      onClose?.();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="forget-password-backdrop"
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="forget-password-popup"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white dark:bg-[#121212] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800"
        >
          {/* Back Button */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            {step === 1
              ? "Reset Password"
              : step === 2
              ? "Enter OTP Code"
              : "Set New Password"}
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 text-center mb-3"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Enter phone */}
            {step === 1 && (
              <motion.form
                key="step1"
                onSubmit={handleSendOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 border-r border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-transparent text-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition ${
                      loading
                        ? "bg-amber-300 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  {/* Bottom Dark Cancel Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-900 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2: OTP verification */}
            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={handleVerifyOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  We sent a 6-digit OTP to your phone.
                </p>
                <OTPInput otp={otp} setOtp={setOtp} length={6} />

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition ${
                      loading
                        ? "bg-amber-300 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Reset password */}
            {step === 3 && (
              <motion.form
                key="step3"
                onSubmit={handleResetPassword}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg outline-none bg-transparent text-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg outline-none bg-transparent text-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition ${
                      loading
                        ? "bg-amber-300 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-900 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <CountryPopup
            open={showCountryPopup}
            onClose={() => setShowCountryPopup(false)}
            value={countryCode}
            onSelect={(code) => setCountryCode(code)}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
