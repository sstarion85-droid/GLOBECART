import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import CountrySelector from "../forms/CountrySelector";
import OTPInput from "../forms/OTPInput";
import countryPhoneRules from "../../utils/countryPhoneRules";

export default function PhoneLoginPopup({ onClose, onSendOTP, onVerifyOTP }) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+20");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  // ✅ Step 1: Handle Send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    setError("");

    const { min, max, name } = countryPhoneRules[countryCode] || { min: 8, max: 15, name: "your country" };
    if (phone.length < min || phone.length > max) {
      return setError(`Enter a valid ${name} phone number (${min}-${max} digits).`);
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setResent(false);
      if (onSendOTP) onSendOTP(`${countryCode}${phone}`);
    }, 1200);
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) return setError("Please enter the full OTP.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (onVerifyOTP) onVerifyOTP(code);
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  const handleResend = () => {
    setResent(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResent(false);
      if (onSendOTP) onSendOTP(`${countryCode}${phone}`);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="phone-login-backdrop"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
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
          className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-slate-100"
        >
          {/* 🔙 Back arrow for OTP step */}
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {step === 1 ? "Continue with Phone" : "Enter OTP Code"}
          </h2>

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
              // ✅ Step 1: Phone Input Form
              <motion.form
                key="form-step1"
                onSubmit={handleSendOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 mt-4"
              >
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <CountrySelector value={countryCode} onChange={setCountryCode} />
                  <div className="relative flex-1">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        const maxLength = countryPhoneRules[countryCode]?.max || 15;
                        if (digits.length <= maxLength) setPhone(digits);
                      }}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2.5 outline-none bg-white text-slate-700"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </motion.form>
            ) : (
              // ✅ Step 2: OTP Form
              <motion.form
                key="form-step2"
                onSubmit={handleVerifyOTP}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 mt-4"
              >
                <p className="text-center text-slate-500 text-sm">
                  We sent an OTP to <strong>{countryCode}{phone}</strong>
                </p>

                <OTPInput otp={otp} setOtp={setOtp} length={6} />
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 4}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
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
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-indigo-600 hover:underline"
                    }`}
                  >
                    {resent ? "Resent!" : "Resend OTP"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
