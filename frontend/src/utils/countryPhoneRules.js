/**
 * 🌍 Country-specific phone number rules
 * Defines min and max length for phone numbers per dial code.
 * Used to validate and limit phone number input (Bybit-style).
 */

import { parsePhoneNumberFromString } from "libphonenumber-js";

const countryPhoneRules = {
  "+1": { name: "United States / Canada", min: 10, max: 10 },
  "+44": { name: "United Kingdom", min: 10, max: 10 },
  "+20": { name: "Egypt", min: 10, max: 11 },
  "+234": { name: "Nigeria", min: 10, max: 11 },
  "+91": { name: "India", min: 10, max: 10 },
  "+971": { name: "United Arab Emirates", min: 9, max: 9 },
  "+81": { name: "Japan", min: 10, max: 10 },
  "+49": { name: "Germany", min: 10, max: 11 },
  "+33": { name: "France", min: 9, max: 10 },
  "+61": { name: "Australia", min: 9, max: 9 },
  "+39": { name: "Italy", min: 9, max: 10 },
  "+34": { name: "Spain", min: 9, max: 9 },
  "+7": { name: "Russia", min: 10, max: 10 },
  "+86": { name: "China", min: 11, max: 11 },
  "+82": { name: "South Korea", min: 9, max: 10 },
  "+62": { name: "Indonesia", min: 9, max: 11 },
  "+90": { name: "Turkey", min: 10, max: 10 },
  "+55": { name: "Brazil", min: 10, max: 11 },
  "+27": { name: "South Africa", min: 9, max: 10 },
  "+966": { name: "Saudi Arabia", min: 9, max: 9 },
  "+974": { name: "Qatar", min: 8, max: 8 },
  "+968": { name: "Oman", min: 8, max: 8 },
  "+965": { name: "Kuwait", min: 8, max: 8 },
  "+212": { name: "Morocco", min: 9, max: 9 },
  "+254": { name: "Kenya", min: 9, max: 9 },
  "+256": { name: "Uganda", min: 9, max: 9 },
  "+255": { name: "Tanzania", min: 9, max: 9 },
  "+60": { name: "Malaysia", min: 9, max: 10 },
  "+63": { name: "Philippines", min: 9, max: 10 },
  "+66": { name: "Thailand", min: 9, max: 9 },
  "+84": { name: "Vietnam", min: 9, max: 10 },
  "+94": { name: "Sri Lanka", min: 9, max: 9 },
};

/**
 * ✅ Validate phone number based on country rules + libphonenumber-js
 * @param {string} countryCode - e.g. "+20"
 * @param {string} phoneNumber - digits only
 * @returns {boolean} - true if valid, false otherwise
 */
export function validatePhoneNumber(countryCode, phoneNumber) {
  // Check against min/max rules first (quick input check)
  const rule = countryPhoneRules[countryCode];
  if (rule) {
    if (phoneNumber.length < rule.min || phoneNumber.length > rule.max) return false;
  } else {
    // fallback for unknown countries
    if (phoneNumber.length < 4 || phoneNumber.length > 15) return false;
  }

  // Use libphonenumber-js for real validation
  try {
    const fullNumber = countryCode + phoneNumber;
    const phone = parsePhoneNumberFromString(fullNumber);
    return phone?.isValid() ?? false;
  } catch {
    return false;
  }
}

/**
 * ✨ Optional: format number nicely for display (E.164 -> national format)
 * @param {string} countryCode
 * @param {string} phoneNumber
 * @returns {string} formatted phone number or raw if failed
 */
export function formatPhoneNumber(countryCode, phoneNumber) {
  try {
    const phone = parsePhoneNumberFromString(countryCode + phoneNumber);
    return phone?.formatInternational() ?? countryCode + phoneNumber;
  } catch {
    return countryCode + phoneNumber;
  }
}

export default countryPhoneRules;
