import { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, Loader2, ArrowLeft, X, Eye, EyeOff, Lock } from "lucide-react";
import OTPInput from "../forms/OTPInput";
import CountryPopup from "../forms/CountryPopup";
import PhoneLoginForm from "./PhoneLoginForm";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import countryPhoneRules from "../../utils/countryPhoneRules";
import PrimaryButton from "../ui/PrimaryButton";

export default function PhoneLoginPopup({ onClose }) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+20");
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Resend OTP timer
  useEffect(() => {
    let timer;
    if (resent && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setResent(false);
      setResendTimer(30);
    }
    return () => clearInterval(timer);
  }, [resent, resendTimer]);

  const isPhoneValid = () => {
    try {
      const phoneObj = parsePhoneNumberFromString(countryCode + phone);
      return phoneObj && phoneObj.isValid();
    } catch {
      return false;
    }
  };

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, "");
    const maxLength = countryPhoneRules[countryCode]?.max || 15;
    const trimmed = digits.slice(0, maxLength);
    const formatted = new AsYouType().input(trimmed);
    setPhone(trimmed);
    setFormattedPhone(formatted);
    setError("");
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setError("");
    if (!isPhoneValid()) return setError("Please enter a valid phone number.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setResent(false);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== otp.length)
      return setError("Please enter the full OTP.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3); // move to password creation step
    }, 1200);
  };

  const handleResend = () => {
    if (loading || resent) return;
    setResent(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleCreatePassword = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6)
      return setError("Password must be at least 6 characters long.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  if (showLoginForm) {
    return (
      <PhoneLoginForm
        onClose={() => {
          setShowLoginForm(false);
          onClose?.();
        }}
        onSignup={() => setShowLoginForm(false)}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="phone-login-backdrop"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="phone-login-popup"
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-gray-100"
        >
          {/* Close Button */}
          {step === 1 && !success && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition active:scale-90"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* Hide back button for step 3 */}
            {step > 1 && step !== 3 && !success ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition duration-150 active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
            ) : (
              <div className="w-[60px]" />
            )}

            <motion.h2
              key={step}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold text-gray-800 text-center flex-1"
            >
              {step === 1
                ? "Create an Account"
                : step === 2
                ? "Verify OTP Code"
                : "Create a Password"}
            </motion.h2>

            <div className="w-[60px]" />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-green-600 space-y-3"
              >
                <CheckCircle2 size={60} />
                <p className="text-lg font-semibold">
                  Account Created Successfully!
                </p>
              </motion.div>
            ) : step === 1 ? (
              // Step 1: Phone number
              <motion.form
                key="form-step1"
                onSubmit={handleSendOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 mt-4"
              >
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
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-gray-50 text-gray-800 rounded-r-lg"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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
                    "Sign Up Now"
                  )}
                </PrimaryButton>

                <button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="w-full py-2.5 rounded-lg border border-amber-500 text-amber-600 font-medium hover:bg-amber-50 transition"
                >
                  Login Instead
                </button>
              </motion.form>
            ) : step === 2 ? (
              // Step 2: OTP Verification
              <motion.form
                key="form-step2"
                onSubmit={handleVerifyOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 mt-4"
              >
                <p className="text-center text-gray-500 text-sm">
                  We sent an OTP to <strong>{formattedPhone}</strong>
                </p>

                <OTPInput otp={otp} setOtp={setOtp} length={6} />

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resent || loading}
                    className={`text-sm font-medium ${
                      resent
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-amber-600 hover:underline"
                    }`}
                  >
                    {resent ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                  </button>
                </div>
              </motion.form>
            ) : (
              // Step 3: Create Password (no back button)
              <motion.form
                key="form-step3"
                onSubmit={handleCreatePassword}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 mt-4"
              >
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <PrimaryButton type="submit" loading={loading} className="w-full py-2.5">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </PrimaryButton>
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
