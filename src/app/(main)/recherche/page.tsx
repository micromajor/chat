"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCard } from "@/components/profile/user-card";
import { AdBannerSidebar } from "@/components/ads/ad-banner";
import { LocationSelect } from "@/components/ui/location-select";

interface User {
  id: string;
  pseudo: string;
  avatar?: string;
  age: number;
  country?: string;
  department?: string;
  isOnline: boolean;
  lastSeenAt: string;
}

export default function RecherchePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 99,
    country: "",
    department: "",
    isOnline: false,
    hasPhoto: false,
  });

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (filters.ageMin > 18) params.set("ageMin", filters.ageMin.toString());
      if (filters.ageMax < 99) params.set("ageMax", filters.ageMax.toString());
      if (filters.country) params.set("country", filters.country);
      if (filters.department) params.set("department", filters.department);
      if (filters.isOnline) params.set("isOnline", "true");
      if (filters.hasPhoto) params.set("hasPhoto", "true");

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Recherche
        </h1>
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tranche d'âge
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={filters.ageMin}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      ageMin: parseInt(e.target.value) || 18,
                    })
                  }
                  min={18}
                  max={99}
                  className="w-20"
                />
                <span className="text-gray-500">à</span>
                <Input
                  type="number"
                  value={filters.ageMax}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      ageMax: parseInt(e.target.value) || 99,
                    })
                  }
                  min={18}
                  max={99}
                  className="w-20"
                />
                <span className="text-gray-500">ans</span>
              </div>
            </div>

            {/* Localisation */}
            <div className="md:col-span-2">
              <LocationSelect
                country={filters.country}
                department={filters.department}
                onCountryChange={(country) => setFilters({ ...filters, country })}
                onDepartmentChange={(department) => setFilters({ ...filters, department })}
                showLabels={true}
                countryLabel="Pays"
                departmentLabel="Département"
              />
            </div>

            {/* Options */}
            <div className="lg:col-span-2 flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOnline}
                  onChange={(e) =>
                    setFilters({ ...filters, isOnline: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  En ligne uniquement
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasPhoto}
                  onChange={(e) =>
                    setFilters({ ...filters, hasPhoto: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Avec photo
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="accent" onClick={handleSearch} isLoading={isLoading}>
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Résultats */}
        <div className="flex-1">
          {!hasSearched ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rechercher des profils
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Utilisez les filtres pour trouver des profils qui correspondent à
                tes critères.
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="w-5 h-5 mr-2" />
                Ouvrir les filtres
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse"
                >
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun profil ne correspond à tes critères.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setFilters({
                    ageMin: 18,
                    ageMax: 99,
                    country: "",
                    department: "",
                    isOnline: false,
                    hasPhoto: false,
                  });
                  handleSearch();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {users.length} résultat{users.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user, index) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    showAd={index > 0 && (index + 1) % 6 === 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar pub */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0">
          <div className="sticky top-32">
            <AdBannerSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
