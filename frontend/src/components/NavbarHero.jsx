import React, { useState, useEffect } from "react";
import EmailLoginPopup from "./modals/EmailLoginPopup";
import PhoneLoginPopup from "./modals/PhoneLoginPopup";
import GoogleLoginPopup from "./modals/GoogleLoginPopup";
import GuestAccessPopup from "./modals/GuestAccessPopup";
import logo from "../assets/globecart-logo.png";

export default function Navbar() {
  const [activePopup, setActivePopup] = useState(null);

  // Handle custom open events
  useEffect(() => {
    const openLoginHandler = (e) => setActivePopup(e.detail?.type || null);
    window.addEventListener("openLogin", openLoginHandler);
    return () => window.removeEventListener("openLogin", openLoginHandler);
  }, []);

  // Disable body scroll when a popup is active
  useEffect(() => {
    document.body.style.overflow = activePopup ? "hidden" : "auto";
  }, [activePopup]);

  const closePopup = () => setActivePopup(null);

  // Reusable backdrop
  const Backdrop = () => (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      onClick={closePopup}
    ></div>
  );

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#01030a]/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
      {/* Logo + Brand Name */}
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Globecart Logo"
          className="w-10 h-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]"
        />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-wide">
          Globecart
        </h1>
      </div>

      {/* Auth Buttons */}
      <div className="space-x-3">
        <button
          onClick={() => setActivePopup("loginOptions")}
          className="px-5 py-2.5 border border-blue-500/50 text-blue-200 rounded-xl font-medium hover:bg-blue-600/20 hover:text-white transition duration-300"
        >
          Login
        </button>
        <button
          onClick={() => setActivePopup("signup")}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-blue-500/40 transition-transform duration-300"
        >
          Sign Up
        </button>
      </div>

      {/* Popup System */}
      {activePopup && <Backdrop />}

      {activePopup === "email" && <EmailLoginPopup onClose={closePopup} />}
      {activePopup === "phone" && <PhoneLoginPopup onClose={closePopup} />}
      {activePopup === "google" && <GoogleLoginPopup onClose={closePopup} />}
      {activePopup === "guest" && <GuestAccessPopup onClose={closePopup} />}

      {/* Login Method Selector */}
      {activePopup === "loginOptions" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-[#0b1120] border border-blue-700/40 rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">
              Choose Login Method
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setActivePopup("email")}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
              >
                Continue with Email
              </button>
              <button
                onClick={() => setActivePopup("phone")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
              >
                Continue with Phone
              </button>
              <button
                onClick={() => setActivePopup("google")}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition"
              >
                Continue with Google
              </button>
              <button
                onClick={() => setActivePopup("guest")}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Continue as Guest
              </button>
            </div>

            <button
              onClick={closePopup}
              className="mt-6 text-blue-400 hover:text-blue-200 text-sm underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
