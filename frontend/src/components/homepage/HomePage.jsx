import { useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Navbar from "../NavbarHome";

// Import pages
import HomePageContent from "../../pages/HomePageContent";
import Categories from "../../pages/Categories";
import Cart from "../../pages/Cart";
import MyApp from "../../pages/MyApp";
import WhereToShop from "../../pages/WhereToShop";

export default function HomePage({ onLogout }) {
  const [activePage, setActivePage] = useState("home");

  const renderPageContent = () => {
    switch (activePage) {
      case "home": return <HomePageContent />;
      case "wheretoshop": return <WhereToShop />;
      case "categories": return <Categories />;
      case "cart": return <Cart />;
      case "myapp": return <MyApp />;
      default: return <h2 className="text-2xl font-bold">Page Not Found</h2>;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Globecart</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
          <FaUserCircle className="text-gray-700 w-7 h-7" />
        </div>
      </header>

      {/* Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
        {renderPageContent()}
      </main>
    </div>
  );
}