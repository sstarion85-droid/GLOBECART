import { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa";
import logo from "../../assets/globecart-logo.png";

import GoogleLoginPopup from "../modals/GoogleLoginPopup";
import PhoneLoginPopup from "../modals/PhoneLoginPopup";
import EmailLoginPopup from "../modals/EmailLoginPopup";
import GuestAccessPopup from "../modals/GuestAccessPopup";

export default function HeroSection({ onLoginSuccess }) {
  const [activePopup, setActivePopup] = useState(null);

  const closePopup = () => setActivePopup(null);

  // Handles login or guest access
  const handleLogin = () => {
    closePopup();
    if (onLoginSuccess) onLoginSuccess();
  };

  // Backdrop for popups
  const Backdrop = ({ onClick }) => (
    <div
      onClick={onClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    />
  );

  return (
    <section
      className="relative h-screen w-screen flex items-center justify-center text-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-sm w-full px-6 mx-auto flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-8"
        >
          <img src={logo} alt="Globecart Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Globecart
          </h1>
          <p className="text-white/80 text-sm mt-2 leading-relaxed">
            Shop anywhere <br /> protected & always at a great price
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/263/263142.png"
          alt="Global Shopping"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-32 h-32 mb-8 drop-shadow-lg"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 w-full"
        >
          <button
            onClick={() => setActivePopup("google")}
            className="flex items-center justify-center gap-3 w-full py-3 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:scale-105 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={() => setActivePopup("phone")}
            className="flex items-center justify-center gap-3 w-full py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
          >
            <FaPhoneAlt /> Continue with Phone Number
          </button>

          <div className="flex items-center justify-center gap-2 text-white/80 text-sm mt-1">
            <span className="flex-1 border-t border-white/40"></span>
            <span>OR</span>
            <span className="flex-1 border-t border-white/40"></span>
          </div>

          <button
            onClick={() => setActivePopup("email")}
            className="flex items-center justify-center gap-3 w-full py-3 bg-black text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
          >
            <FaEnvelope className="text-orange-400" /> Continue with Email
          </button>

          <button
            onClick={() => setActivePopup("guest")}
            className="mt-3 flex items-center justify-center gap-2 text-white/80 border border-white/40 px-4 py-2 rounded-full font-medium hover:bg-white/10 transition"
          >
            <FaUser /> Continue as Guest
          </button>
        </motion.div>
      </div>

      {/* Popups */}
      {activePopup && <Backdrop onClick={closePopup} />}
      {activePopup === "google" && (
        <GoogleLoginPopup onClose={handleLogin} />
      )}
      {activePopup === "phone" && (
        <PhoneLoginPopup onClose={closePopup} />
      )}
      {activePopup === "email" && (
        <EmailLoginPopup onClose={closePopup} />
      )}
      {activePopup === "guest" && (
        <GuestAccessPopup
          onConfirm={handleLogin}  // Proceed to homepage
          onCancel={closePopup}     // Just close popup
        />
      )}
    </section>
  );
}
