import { useRef } from "react";

export default function OTPInput({ otp, setOtp, length = 6, onComplete }) {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Only digits
    if (/^\d+$/.test(value)) {
      let newOtp = [...otp];

      if (value.length === length) {
        // Paste full OTP
        newOtp = value.split("").slice(0, length);
        setOtp(newOtp);
        inputRefs.current[length - 1]?.focus();
        if (onComplete) onComplete(newOtp.join(""));
      } else {
        newOtp[index] = value[value.length - 1];
        setOtp(newOtp);
        // Move to next input
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }

      // Trigger onComplete if all filled
      if (newOtp.every((digit) => digit !== "") && onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Arrow navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, length);
    if (!pasteData) return;
    const newOtp = pasteData.split("").concat(Array(length).fill("")).slice(0, length);
    setOtp(newOtp);
    inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus();
    if (newOtp.every((d) => d !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={otp[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[i] = el)}
        />
      ))}
    </div>
  );
}
