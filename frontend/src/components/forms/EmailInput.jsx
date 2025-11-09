import React, { useState, useId, useEffect } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * EmailInput.jsx
 * Reusable accessible email input with validation and Tailwind-friendly classes.
 * Props:
 *  - id
 *  - name
 *  - label
 *  - value
 *  - onChange (fn: (e) => void)
 *  - placeholder
 *  - required (bool)
 *  - autoFocus (bool)
 *  - className (string) additional wrapper classes
 *  - inputClassName (string) additional input classes
 *  - showIcon (bool) show the mail icon
 *  - validateOnBlur (bool) validate when input blurs (default true)
 *  - onValid (fn) called with email string when value becomes valid
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailInput({
  id,
  name = "email",
  label = "Email",
  value = "",
  onChange = () => {},
  placeholder = "you@example.com",
  required = true,
  autoFocus = false,
  className = "",
  inputClassName = "",
  showIcon = true,
  validateOnBlur = true,
  onValid = () => {},
}) {
  const autoId = useId();
  const inputId = id || `${name}-${autoId}`;
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // keep error state in sync when value externally changes
    if (!value) {
      if (required && touched) setError("Email is required.");
      else setError("");
      return;
    }
    if (EMAIL_REGEX.test(value)) {
      setError("");
      onValid(value);
    } else if (touched) {
      setError("Please enter a valid email address.");
    }
  }, [value, required, touched, onValid]);

  function handleBlur() {
    setTouched(true);
    if (validateOnBlur) {
      if (!value) {
        if (required) setError("Email is required.");
        else setError("");
      } else if (!EMAIL_REGEX.test(value)) {
        setError("Please enter a valid email address.");
      } else {
        setError("");
        onValid(value);
      }
    }
  }

  function handleChange(e) {
    const v = e.target.value;
    // clear error as user types (optimistic)
    if (error) setError("");
    onChange(e);
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label} {required ? <span aria-hidden>•</span> : null}
      </label>

      <div
        className={`relative rounded-md border px-3 py-2 flex items-center transition-shadow focus-within:shadow-sm ${
          error
            ? "border-rose-500"
            : "border-neutral-200 dark:border-neutral-700"
        }`}
      >
        {showIcon && (
          <div className="mr-2 pointer-events-none">
            <Mail size={18} />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full bg-transparent outline-none text-sm ${inputClassName}`}
        />

        {error ? (
          <AlertCircle size={18} className="ml-2" aria-hidden />
        ) : value && EMAIL_REGEX.test(value) ? (
          <CheckCircle2 size={18} className="ml-2" aria-hidden />
        ) : null}
      </div>

      <div className="min-h-[20px]">
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-rose-600 mt-1">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
