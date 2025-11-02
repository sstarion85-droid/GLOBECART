import { FaShoppingCart } from "react-icons/fa";

export default function HomePageContent() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Globecart!</h2>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        Explore the latest products, deals, and global shopping offers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center hover:scale-105 transition">
          <FaShoppingCart className="text-blue-500 w-12 h-12 mb-3" />
          <h3 className="font-semibold text-lg">Shop Now</h3>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center hover:scale-105 transition">
          <FaShoppingCart className="text-green-500 w-12 h-12 mb-3" />
          <h3 className="font-semibold text-lg">Your Orders</h3>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center hover:scale-105 transition">
          <FaShoppingCart className="text-purple-500 w-12 h-12 mb-3" />
          <h3 className="font-semibold text-lg">Favorites</h3>
        </div>
      </div>
    </div>
  );
}
