import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import OTPInput from "../forms/OTPInput";
import CountryPopup from "../forms/CountryPopup";
import { parsePhoneNumberFromString, AsYouType, getExampleNumber } from "libphonenumber-js";
import countryPhoneRules from "../../utils/countryPhoneRules";

export default function PhoneLoginPopup({ onClose, onSendOTP, onVerifyOTP, onLogin }) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+20");
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [resent, setResent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    try {
      const example = getExampleNumber(countryCode.replace("+", ""));
      setPlaceholder(example ? example.formatNational() : "Enter phone number");
    } catch {
      setPlaceholder("Enter phone number");
    }
  }, [countryCode]);

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
    const formatted = new AsYouType(countryCode.replace("+", "")).input(trimmed);
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
      onSendOTP?.(countryCode + phone);
    }, 1200);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== otp.length) return setError("Please enter the full OTP.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onVerifyOTP?.(code);
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  const handleResend = () => {
    if (loading || resent) return;
    setResent(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSendOTP?.(countryCode + phone);
    }, 1200);
  };

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
          className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100"
        >
          {/* Back button */}
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {step === 1 ? "Create an Account" : "Enter OTP Code"}
            </h2>

            <button
              onClick={() => {
                onLogin?.();
                onClose?.();
              }}
              className="text-amber-600 hover:text-amber-500 text-sm font-medium transition"
            >
              Login Now
            </button>
          </div>

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
                <p className="text-lg font-semibold">Verified Successfully!</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.form
                key="form-step1"
                onSubmit={handleSendOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 mt-4"
              >
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
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-white text-gray-800"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !isPhoneValid()}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all ${
                    loading || !isPhoneValid()
                      ? "bg-amber-300 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 shadow-md"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending OTP...
                    </>
                  ) : (
                    "Sign Up Now"
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </motion.form>
            ) : (
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

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== otp.length}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all ${
                    loading
                      ? "bg-amber-300 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 shadow-md"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

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
