import { Loader2 } from "lucide-react";

/**
 * PrimaryButton Component
 * Reusable main action button with loading and disabled states.
 */
export default function PrimaryButton({
  onClick,
  disabled,
  loading,
  loadingText,
  children,
  type = "submit",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white transition-all ${
        disabled || loading
          ? "bg-amber-300 cursor-not-allowed"
          : "bg-amber-500 hover:bg-amber-600 shadow-md"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
