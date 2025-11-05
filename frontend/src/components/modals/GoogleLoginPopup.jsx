import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Redirect user to backend Google OAuth route
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <FaGoogle className="w-5 h-5" />
      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
