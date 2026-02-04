"use client";

import { X } from "lucide-react";
import { FRANCOPHONE_COUNTRIES, FRENCH_DEPARTMENTS } from "@/lib/countries";

interface LocationSelectProps {
  country: string;
  department: string;
  onCountryChange: (country: string) => void;
  onDepartmentChange: (department: string) => void;
  showLabels?: boolean;
  required?: boolean;
  countryLabel?: string;
  departmentLabel?: string;
  className?: string;
  allowAllCountries?: boolean; // Autoriser "Tous les pays" (pour les filtres)
}

export function LocationSelect({
  country,
  department,
  onCountryChange,
  onDepartmentChange,
  showLabels = true,
  required = false,
  countryLabel = "Pays",
  departmentLabel = "Département",
  className = "",
  allowAllCountries = true, // Par défaut, autoriser (compatibilité avec filtres)
}: LocationSelectProps) {
  const handleCountryChange = (newCountry: string) => {
    console.log("LocationSelect - handleCountryChange called with:", newCountry);
    onCountryChange(newCountry);
    // Reset department if country is not France
    if (newCountry !== "FR") {
      onDepartmentChange("");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Pays */}
      <div>
        {showLabels && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {countryLabel}
          </label>
        )}
        <div className="flex gap-2 items-start relative z-50">
          <select
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer relative z-50"
            required={required}
            style={{ pointerEvents: 'auto' }}
          >
            {allowAllCountries && <option value="">🌍 Tous les pays</option>}
            {!allowAllCountries && !country && <option value="">Sélectionne ton pays</option>}
            {FRANCOPHONE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {country && allowAllCountries && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("LocationSelect - X button clicked");
                handleCountryChange("");
              }}
              className="flex-shrink-0 px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Réinitialiser le filtre pays"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Département (uniquement si France) */}
      {country === "FR" && (
        <div className="relative z-50">
          {showLabels && (
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {departmentLabel}
            </label>
          )}
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer relative z-50"
            style={{ pointerEvents: 'auto' }}
          >
            <option value="">Tous les départements</option>
            {FRENCH_DEPARTMENTS.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.code} - {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
