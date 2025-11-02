// components/forms/CountrySelector.jsx
import { useState, useEffect, useRef } from "react";

/**
 * CountrySelector (Dynamic)
 *
 * - Fetches country list from https://restcountries.com/v3.1/all
 * - Builds items with { name, code (e.g. "+20"), flag (emoji), cca2 }
 * - Caches the result in localStorage for faster reloads
 * - Auto-detects user's country from browser locale (Intl) and selects it
 * - Searchable dropdown
 *
 * Props:
 * - value: string (e.g. "+20") - current selected dial code
 * - onChange: function(newCode: string) - called with dial code like "+20"
 *
 * Notes:
 * - If restcountries is unavailable, shows friendly error and fallback to a small built-in list.
 */

const REST_URL = "https://restcountries.com/v3.1/all";
const CACHE_KEY = "country_selector_v1_cache";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Convert ISO country code (e.g. "EG") to emoji flag
function codeToEmojiFlag(cca2 = "") {
  if (!cca2 || cca2.length !== 2) return "🏳️";
  // Regional Indicator Symbols trick
  const A = 0x1f1e6;
  return cca2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(A + c.charCodeAt(0) - 65))
    .join("");
}

// Build dialing code from restcountries idd.root and idd.suffixes
function buildDialCodes(idd = {}) {
  // idd.root is like "+1" or "+20", idd.suffixes is list like ["234"]
  const root = idd?.root || "";
  const suffixes = idd?.suffixes || [];
  if (!root) return [];
  if (!suffixes || suffixes.length === 0) return [root];
  // combine root and each suffix (avoid duplication)
  const codes = suffixes.map((suf) => `${root}${suf}`);
  // Normalize: replace multiple plus signs or spaces
  return [...new Set(codes.map((c) => c.replace(/\s+/g, "")))];
}

// Small fallback dataset (used if REST fetch fails)
const FALLBACK = [
  { name: "Egypt", code: "+20", flag: "🇪🇬", cca2: "EG" },
  { name: "United States", code: "+1", flag: "🇺🇸", cca2: "US" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", cca2: "GB" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", cca2: "NG" },
  { name: "India", code: "+91", flag: "🇮🇳", cca2: "IN" },
];

export default function CountrySelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();

  // Load from cache or fetch remote
  useEffect(() => {
    let mounted = true;

    const loadFromCache = () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.ts || !parsed?.data) return null;
        if (Date.now() - parsed.ts > CACHE_TTL_MS) {
          // stale
          localStorage.removeItem(CACHE_KEY);
          return null;
        }
        return parsed.data;
      } catch (err) {
        return null;
      }
    };

    const saveToCache = (data) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            data,
          })
        );
      } catch (err) {
        // ignore
      }
    };

    const normalize = (rawList) => {
      // Map restcountries data into { name, code, flag, cca2 }
      const mapped = rawList
        .map((country) => {
          const name =
            (country && (country.name?.common || country.name?.official)) ||
            country?.cca2 ||
            "Unknown";
          const cca2 = country?.cca2 || "";
          const flag = codeToEmojiFlag(cca2);
          const dialCodes = buildDialCodes(country?.idd || {});
          if (dialCodes.length === 0) return null; // skip countries with no dial code
          // For countries with multiple dial codes, create separate items for each code (makes searching by code exact)
          return dialCodes.map((dc) => ({
            name,
            code: dc, // e.g. "+20"
            flag,
            cca2,
          }));
        })
        .filter(Boolean)
        .flat();

      // Deduplicate by code (keep the first)
      const seen = new Set();
      const result = [];
      for (const it of mapped) {
        const key = `${it.code}:${it.cca2}`;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(it);
      }

      // Sort alphabetically by name, then by code
      result.sort((a, b) => {
        if (a.name === b.name) return a.code.localeCompare(b.code);
        return a.name.localeCompare(b.name);
      });

      return result;
    };

    (async () => {
      setLoading(true);
      setError(null);

      // Try cache
      const cached = loadFromCache();
      if (cached && mounted) {
        setCountries(cached);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(REST_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        const normalized = normalize(json);
        if (normalized.length === 0) throw new Error("No dial codes found");
        if (mounted) {
          setCountries(normalized);
          saveToCache(normalized);
          setLoading(false);
        }
      } catch (err) {
        console.warn("CountrySelector fetch failed:", err);
        // Fallback to small built-in list
        if (mounted) {
          setCountries(FALLBACK);
          setError(
            "Could not load full country list — using a small fallback list."
          );
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-detect user's country and set initial value
  useEffect(() => {
    if (!countries || countries.length === 0) return;
    // If value already provided, don't override
    if (value) return;

    // 1) Use Intl locale (e.g., "en-GB" -> "GB")
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || "";
      const region = locale.split("-")[1] || locale.split("_")[1];
      if (region) {
        // Find first country whose cca2 matches region
        const match = countries.find(
          (c) => c.cca2 && c.cca2.toUpperCase() === region.toUpperCase()
        );
        if (match) {
          onChange?.(match.code);
          return;
        }
      }
    } catch (err) {
      // ignore
    }

    // 2) Try navigator.language as fallback
    try {
      const nav = (navigator && navigator.language) || "";
      const region = nav.split("-")[1] || nav.split("_")[1];
      if (region) {
        const match = countries.find(
          (c) => c.cca2 && c.cca2.toUpperCase() === region.toUpperCase()
        );
        if (match) {
          onChange?.(match.code);
          return;
        }
      }
    } catch (err) {
      // ignore
    }

    // 3) As a last resort, try to pick a default (Egypt if present, else first)
    const prefer = countries.find((c) => c.cca2 === "EG") || countries[0];
    if (prefer) onChange?.(prefer.code);
  }, [countries, onChange, value]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const filtered = (countries || []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.code && c.code.toLowerCase().includes(q)) ||
      (c.cca2 && c.cca2.toLowerCase().includes(q))
    );
  });

  // Find selected item from value prop
  const selectedItem =
    (countries || []).find((c) => c.code === value) || countries?.[0] || null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Selected button */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 border-r border-slate-300 rounded-l-lg hover:bg-slate-200 transition"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-lg leading-none">{selectedItem?.flag || "🏳️"}</span>
        <span className="text-sm">{selectedItem?.code || "+?"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-72 max-h-72 overflow-hidden">
          {/* Header: search + close */}
          <div className="flex items-center gap-2 p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
              aria-label="Search country"
            />
            <button
              type="button"
              onClick={() => {
                setSearch("");
              }}
              className="text-xs text-slate-400 px-2 py-1 hover:text-slate-600"
            >
              Clear
            </button>
          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading countries…</div>
          ) : error ? (
            <div className="p-3 text-sm text-amber-700 bg-amber-50">{error}</div>
          ) : null}

          {/* List */}
          <div className="overflow-y-auto max-h-56">
            {filtered.length === 0 && !loading && (
              <div className="p-3 text-center text-sm text-slate-400">No matches found</div>
            )}

            {filtered.map((c) => {
              const isSelected = value === c.code;
              return (
                <button
                  key={`${c.cca2}-${c.code}`}
                  type="button"
                  onClick={() => {
                    onChange?.(c.code);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-3 ${
                    isSelected ? "bg-slate-100" : ""
                  }`}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <span className="text-sm text-slate-500">{c.code}</span>
                </button>
              );
            })}
          </div>

          {/* Footer: small hint */}
          <div className="px-3 py-2 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} country{filtered.length !== 1 ? "ies" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
