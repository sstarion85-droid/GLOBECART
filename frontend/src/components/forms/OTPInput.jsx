import { useRef } from "react";

export default function OTPInput({ otp, setOtp, length = 6, onComplete }) {
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input automatically
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Trigger onComplete when full
      if (newOtp.join("").length === length && onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
          className="w-10 h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={otp[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => (inputRefs.current[i] = el)}
        />
      ))}
    </div>
  );
}
