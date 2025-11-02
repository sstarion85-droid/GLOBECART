import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({ name, value, onChange, placeholder = "Enter your password" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  // Password strength check
  const getStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.match(/^(?=.*[A-Z])(?=.*\d).{8,}$/)) return "Strong";
    return "Medium";
  };

  const strength = getStrength(value);

  return (
    <div className="relative">
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        Password
      </label>

      {/* Input Field */}
      <div
        className={`flex items-center border rounded-lg px-3 py-2.5 transition-all ${
          focused ? "border-indigo-500 shadow-sm" : "border-slate-300"
        }`}
      >
        <Lock size={18} className="text-slate-400 mr-2" />
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none text-slate-800"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2 text-slate-500 hover:text-indigo-600 transition"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Strength Indicator */}
      {value && (
        <div className="mt-1 text-sm">
          <span
            className={`${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {strength} password
          </span>
        </div>
      )}

      {/* Hint */}
      <p className="text-xs text-slate-400 mt-1">
        Use at least 8 characters, one uppercase letter, and one number.
      </p>
    </div>
  );
}
