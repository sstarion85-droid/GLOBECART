import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Lock, Loader2, ArrowLeft } from "lucide-react";
import OTPInput from "../forms/OTPInput.jsx";
import CountryPopup from "../forms/CountryPopup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PrimaryButton from "../ui/PrimaryButton";

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
  const [resendTimer, setResendTimer] = useState(0);

  const isPhoneValid = useCallback(() => {
    try {
      const phoneObj = parsePhoneNumberFromString(countryCode + phone);
      return phoneObj && phoneObj.isValid();
    } catch {
      return false;
    }
  }, [countryCode, phone]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!isPhoneValid()) return setError("Please enter a valid phone number.");
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setResendTimer(30);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return setError("Please enter the full OTP.");
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

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtp(Array(6).fill(""));
      setResendTimer(30);
    }, 1000);
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="forget-password-backdrop"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="forget-password-popup"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="relative bg-white dark:bg-[#121212] rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800"
        >
          {/* Back button (Hidden on Step 3) */}
          {step !== 3 && (
            <button
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              aria-label="Go Back"
            >
              <ArrowLeft size={22} />
            </button>
          )}

          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            {step === 1
              ? "Reset Password"
              : step === 2
              ? "Verify OTP Code"
              : "Set New Password"}
          </h2>

          {/* Error Message */}
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
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5 mt-2"
              >
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 border-r border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-gray-50 dark:bg-transparent text-gray-800 dark:text-gray-100"
                      aria-label="Phone Number"
                    />
                  </div>
                </div>

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={!isPhoneValid()}
                  className="w-full py-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </PrimaryButton>
              </motion.form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={handleVerifyOTP}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6 mt-2"
              >
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  We sent an OTP to your phone number.
                </p>

                <OTPInput otp={otp} setOtp={setOtp} length={6} />

                {/* Resend OTP */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {resendTimer > 0 ? (
                    <p>
                      Resend available in{" "}
                      <span className="font-semibold text-amber-500">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-amber-500 font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={otp.join("").length !== otp.length}
                  className="w-full py-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </PrimaryButton>
              </motion.form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <motion.form
                key="step3"
                onSubmit={handleResetPassword}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5 mt-2"
              >
                {[
                  {
                    label: "New password",
                    value: password,
                    onChange: setPassword,
                  },
                  {
                    label: "Confirm password",
                    value: confirm,
                    onChange: setConfirm,
                  },
                ].map(({ label, value, onChange }, i) => (
                  <div key={i} className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      placeholder={label}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg outline-none bg-gray-50 dark:bg-transparent text-gray-800 dark:text-gray-100"
                      aria-label={label}
                    />
                  </div>
                ))}

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={!password || !confirm}
                  className="w-full py-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </PrimaryButton>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
