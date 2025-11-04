import React from "react";

export default function EmailInput({ email, setEmail, placeholder = "Enter your email", autoFocus = false }) {

  const handleChange = (e) => {
    let value = e.target.value.toLowerCase(); // Convert to lowercase

    // Remove invalid characters
    value = value.replace(/[^a-z0-9@._%+-]/g, "");

    // Allow only one @
    const atIndex = value.indexOf("@");
    if (atIndex !== -1) {
      value = value.slice(0, atIndex + 1) + value.slice(atIndex + 1).replace(/@/g, "");
    }

    // Remove spaces at the start or end
    value = value.trimStart(); // prevent leading spaces
    setEmail(value);
  };

  const handleBlur = () => {
    // Remove trailing spaces on blur
    setEmail(email.trimEnd());
  };

  return (
    <input
      type="email"
      placeholder={placeholder}
      className="w-full p-2 border rounded-lg mb-3 text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={email}
      onChange={handleChange}
      onBlur={handleBlur}
      required
      autoFocus={autoFocus}
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      title="Please enter a valid email address"
    />
  );
}
