import { useState, useEffect, useId } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  label = "Password",
  placeholder = "Enter your password",
  value = "",
  onChange,
  onValid,
  autoFocus = false,
}) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const autoId = useId();

  useEffect(() => {
    if (!value) {
      if (touched) setError("Password is required.");
      else setError("");
      return;
    }

    if (value.length >= 6) {
      setError("");
      if (onValid) onValid(value);
    } else if (touched) {
      setError("Password must be at least 6 characters.");
    }
  }, [value, touched, onValid]);

  function handleBlur() {
    setTouched(true);
    if (!value) setError("Password is required.");
    else if (value.length < 6) setError("Password must be at least 6 characters.");
    else {
      setError("");
      if (onValid) onValid(value);
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={autoId}
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}

      <div
        className={`relative rounded-md border px-3 py-2 flex items-center transition-shadow focus-within:shadow-sm ${
          error
            ? "border-rose-500"
            : "border-neutral-200 dark:border-neutral-700"
        }`}
      >
        <input
          id={autoId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 tracking-wide"
        />

        {/* Single clean toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="ml-2 text-gray-500 hover:text-gray-700 transition flex items-center justify-center"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="text-lg" />
          ) : (
            <FaEye className="text-lg" />
          )}
        </button>
      </div>

      {error && <p className="text-xs mt-1 text-rose-600">{error}</p>}
    </div>
  );
}
