import { useState, useEffect } from "react";
import LogoIntro from "./components/intro/LogoIntro";
import HeroSection from "./components/homepage/HeroSection";
import HomePage from "./components/homepage/HomePage";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Show logo intro for 3 seconds, then show HeroSection
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen overflow-x-hidden bg-white">
      {showIntro ? (
        <div className="flex items-center justify-center bg-[#01030a] w-full h-screen">
          <LogoIntro />
        </div>
      ) : loggedIn ? (
        <HomePage onLogout={() => setLoggedIn(false)} />
      ) : (
        <HeroSection onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
