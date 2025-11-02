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
      <div className="flex flex-col items-center justify-center">
        <motion.img
          src={logo}
          alt="Globecart Logo"
          role="img"
          aria-label="Globecart Logo"
          className="w-28 h-28 object-contain mb-4"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-3xl font-bold text-white"
        >
          Globecart
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/80 text-sm mt-2"
        >
          Global shopping made simple
        </motion.p>
      </div>
    </section>
  );
}

export default LogoIntro;
