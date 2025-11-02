import { FaGoogle } from "react-icons/fa";

export default function GoogleLoginButton({ onClick }) {
  return (
    <button
      onClick={onClick} // trigger Google login
      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      <FaGoogle className="w-5 h-5" />
      Continue with Google
    </button>
  );
}
