"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdBannerSidebar } from "@/components/ads/ad-banner";

// Données de démonstration
const demoUsers = [
  { id: "demo1", pseudo: "Menhir_28451", age: 28, city: "Paris", isOnline: true },
  { id: "demo2", pseudo: "Menhir_34102", age: 34, city: "Lyon", isOnline: true },
  { id: "demo3", pseudo: "Menhir_26833", age: 26, city: "Bordeaux", isOnline: false },
  { id: "demo4", pseudo: "Menhir_31007", age: 31, city: "Marseille", isOnline: true },
  { id: "demo5", pseudo: "Menhir_29445", age: 29, city: "Nantes", isOnline: false },
  { id: "demo6", pseudo: "Menhir_25118", age: 25, city: "Lille", isOnline: true },
  { id: "demo7", pseudo: "Menhir_32956", age: 32, city: "Toulouse", isOnline: false },
  { id: "demo8", pseudo: "Menhir_27089", age: 27, city: "Nice", isOnline: true },
  { id: "demo9", pseudo: "Menhir_30412", age: 30, city: "Strasbourg", isOnline: false },
  { id: "demo10", pseudo: "Menhir_24673", age: 24, city: "Rennes", isOnline: true },
];

export default function ExplorerRecherchePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 99,
    city: "",
    isOnline: false,
  });

  const filteredUsers = demoUsers.filter((user) => {
    if (filters.isOnline && !user.isOnline) return false;
    if (user.age < filters.ageMin || user.age > filters.ageMax) return false;
    if (filters.city && !user.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Recherche
          </h1>
        </div>

        {/* Filtres */}
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
                    setFilters({ ...filters, ageMin: parseInt(e.target.value) || 18 })
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
                    setFilters({ ...filters, ageMax: parseInt(e.target.value) || 99 })
                  }
                  min={18}
                  max={99}
                  className="w-20"
                />
                <span className="text-gray-500">ans</span>
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  placeholder="Paris, Lyon..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* En ligne */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOnline}
                  onChange={(e) => setFilters({ ...filters, isOnline: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  En ligne uniquement
                </span>
              </label>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {filteredUsers.length} profil{filteredUsers.length > 1 ? "s" : ""} trouvé{filteredUsers.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setShowAuthModal(true)}
            >
              <div className="aspect-square bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                <span className="text-4xl font-bold text-white/80">
                  {user.pseudo.charAt(0).toUpperCase()}
                </span>
                {user.isOnline && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    En ligne
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {user.pseudo}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.age} ans • {user.city}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message inscription */}
        <div className="mt-8 bg-accent-50 dark:bg-accent-900/20 rounded-2xl p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Pour voir plus de profils et interagir avec les membres, créez votre compte gratuit !
          </p>
          <Link href="/inscription">
            <Button variant="accent">
              <UserPlus className="w-5 h-5 mr-2" />
              Créer mon compte
            </Button>
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="sticky top-32">
          <AdBannerSidebar />
        </div>
      </aside>

      {/* Modal auth */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-500" />
              </div>

              <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                Voir ce profil
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez un compte gratuit pour voir les profils complets et envoyer des messages.
              </p>

              <div className="space-y-3">
                <Link href="/inscription" className="block">
                  <Button variant="accent" className="w-full">
                    Créer un compte gratuit
                  </Button>
                </Link>
                <Link href="/connexion" className="block">
                  <Button variant="outline" className="w-full">
                    J'ai déjà un compte
                  </Button>
                </Link>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Continuer à explorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
