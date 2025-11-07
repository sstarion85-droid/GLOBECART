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
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
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
          className="relative bg-white/20 dark:bg-gray-900/30 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md border border-white/30 dark:border-gray-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {/* Back button */}
          {step !== 3 && (
            <button
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              className="absolute top-4 left-4 text-gray-300 hover:text-white transition"
              aria-label="Go Back"
            >
              <ArrowLeft size={22} />
            </button>
          )}

          {/* Header */}
          <h2 className="text-2xl font-semibold text-center text-white mb-2">
            {step === 1
              ? "Reset Password"
              : step === 2
              ? "Verify OTP Code"
              : "Set New Password"}
          </h2>
          <p className="text-center text-gray-300 text-sm mb-6">
            {step === 1
              ? "Enter your phone number to receive an OTP."
              : step === 2
              ? "We’ve sent a code to verify your phone number."
              : "Create your new password below."}
          </p>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 text-center mb-3"
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
                className="space-y-5"
              >
                <div className="flex items-center border border-white/30 rounded-xl overflow-hidden bg-white/10 focus-within:ring-2 focus-within:ring-green-500 transition">
                  <button
                    type="button"
                    onClick={() => setShowCountryPopup(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 border-r border-white/20 text-gray-100 hover:bg-white/30 transition"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="Phone number"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-gray-300 outline-none"
                    />
                  </div>
                </div>

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={!isPhoneValid()}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
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
                className="space-y-6"
              >
                <OTPInput otp={otp} setOtp={setOtp} length={6} />

                <div className="text-center text-sm text-gray-300">
                  {resendTimer > 0 ? (
                    <p>
                      Resend in{" "}
                      <span className="font-semibold text-green-400">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-green-400 font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={otp.join("").length !== otp.length}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
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
                className="space-y-5"
              >
                {[password, confirm].map((value, i) => (
                  <div key={i} className="relative border border-white/30 rounded-xl bg-white/10 focus-within:ring-2 focus-within:ring-green-500 transition">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="password"
                      value={value}
                      onChange={(e) =>
                        i === 0 ? setPassword(e.target.value) : setConfirm(e.target.value)
                      }
                      placeholder={i === 0 ? "New password" : "Confirm password"}
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-gray-300 outline-none"
                    />
                  </div>
                ))}

                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={!password || !confirm}
                >
                  {loading ? "Resetting..." : "Reset Password"}
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
