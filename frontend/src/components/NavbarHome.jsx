import { FaHome, FaStore, FaList, FaShoppingCart, FaThLarge } from "react-icons/fa";

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t flex justify-around py-2 border-t border-gray-200 z-50">
      <button
        className={`flex flex-col items-center ${activePage === "home" ? "text-blue-500" : "text-gray-700"}`}
        onClick={() => setActivePage("home")}
      >
        <FaHome className="w-6 h-6 mb-1" />
        Home
      </button>

      <button
        className={`flex flex-col items-center ${activePage === "wheretoshop" ? "text-blue-500" : "text-gray-700"}`}
        onClick={() => setActivePage("wheretoshop")}
      >
        <FaStore className="w-6 h-6 mb-1" />
        Where to Shop
      </button>

      <button
        className={`flex flex-col items-center ${activePage === "categories" ? "text-blue-500" : "text-gray-700"}`}
        onClick={() => setActivePage("categories")}
      >
        <FaList className="w-6 h-6 mb-1" />
        Categories
      </button>

      <button
        className={`flex flex-col items-center ${activePage === "cart" ? "text-blue-500" : "text-gray-700"}`}
        onClick={() => setActivePage("cart")}
      >
        <FaShoppingCart className="w-6 h-6 mb-1" />
        Cart
      </button>

      <button
        className={`flex flex-col items-center ${activePage === "myapp" ? "text-blue-500" : "text-gray-700"}`}
        onClick={() => setActivePage("myapp")}
      >
        <FaThLarge className="w-6 h-6 mb-1" />
        My App
      </button>
    </nav>
  );
}
