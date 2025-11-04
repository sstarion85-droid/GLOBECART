import { motion } from "framer-motion";
import { useEffect } from "react";
import logo from "../../assets/globecart-logo.png";

function LogoIntro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <section className="h-screen w-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center text-center overflow-hidden">
      <motion.img
        src={logo}
        alt="Globecart Logo"
        role="img"
        aria-label="Globecart Logo"
        className="w-28 h-28 object-contain"
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </section>
  );
}

export default LogoIntro;
