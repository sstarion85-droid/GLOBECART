import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";

const REST_URL = "https://restcountries.com/v3.1/all";
const CACHE_KEY = "country_selector_v1_cache";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function codeToEmojiFlag(cca2 = "") {
  if (!cca2 || cca2.length !== 2) return "🏳️";
  const A = 0x1f1e6;
  return cca2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(A + c.charCodeAt(0) - 65))
    .join("");
}

function buildDialCodes(idd = {}) {
  const root = idd?.root || "";
  const suffixes = idd?.suffixes || [];
  if (!root) return [];
  if (!suffixes?.length) return [root];
  // Sort and return unique list
  return [...new Set(suffixes.map((suf) => `${root}${suf}`))];
}

const FALLBACK = [
  { name: "Egypt", code: "+20", flag: "🇪🇬", cca2: "EG" },
  { name: "United States", code: "+1", flag: "🇺🇸", cca2: "US" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", cca2: "GB" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", cca2: "NG" },
  { name: "India", code: "+91", flag: "🇮🇳", cca2: "IN" },
];

export default function CountrySelector({ value, onChange }) {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    let mounted = true;

    const loadCache = () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.ts || !parsed?.data) return null;
        if (Date.now() - parsed.ts > CACHE_TTL_MS) {
          localStorage.removeItem(CACHE_KEY);
          return null;
        }
        return parsed.data;
      } catch {
        return null;
      }
    };

    const saveCache = (data) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
      } catch {}
    };

    const normalize = (rawList) => {
      const result = [];
      const seen = new Set();

      rawList.forEach((country) => {
        const name = country?.name?.common || "Unknown";
        const cca2 = country?.cca2 || "";
        const flag = codeToEmojiFlag(cca2);
        const codes = buildDialCodes(country?.idd || {});
        const mainCode = codes[0]; // Only take first dial code

        if (!mainCode || seen.has(mainCode)) return; // Avoid duplicates
        seen.add(mainCode);
        result.push({ name, code: mainCode, flag, cca2 });
      });

      result.sort((a, b) => a.name.localeCompare(b.name));
      return result;
    };

    (async () => {
      setLoading(true);
      setError(null);
      const cached = loadCache();
      if (cached && mounted) {
        setCountries(cached);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(REST_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const normalized = normalize(data);
        if (!normalized.length) throw new Error("No dial codes found");
        if (mounted) {
          setCountries(normalized);
          saveCache(normalized);
          setLoading(false);
        }
      } catch (err) {
        console.warn("CountrySelector fetch failed:", err);
        if (mounted) {
          setCountries(FALLBACK);
          setError("Using fallback country list");
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      countries.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search)
      ),
    [countries, search]
  );

  const handleSelect = useCallback(
    (code) => {
      onChange?.(code);
    },
    [onChange]
  );

  return (
    <div className="text-gray-800" ref={containerRef}>
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search country or code"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Country List */}
      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <p className="text-center py-4 text-gray-400 text-sm">Loading countries...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-4 text-gray-500 text-sm">No matches found</p>
        ) : (
          filtered.map((c) => (
            <button
              key={`${c.cca2}-${c.code}`}
              onClick={() => handleSelect(c.code)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{c.flag}</span>
                <span className="text-sm">{c.name}</span>
              </div>
              <span className="text-sm text-gray-500">{c.code}</span>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-3">
        Showing {filtered.length} {filtered.length === 1 ? "country" : "countries"}
      </div>
    </div>
  );
}
