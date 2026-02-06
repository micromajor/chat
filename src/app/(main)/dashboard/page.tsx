"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  RefreshCw, 
  MessageCircle, 
  Heart, 
  Search,
  ChevronLeft,
  ChevronRight,
  Circle,
  Camera,
  Users
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationSelect } from "@/components/ui/location-select";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { FRENCH_DEPARTMENTS, getDepartmentLabel } from "@/lib/french-departments";
import { getLocationLabel } from "@/lib/countries";

interface User {
  id: string;
  pseudo: string;
  avatar?: string;
  age: number;
  country?: string;
  department?: string;
  description?: string;
  isOnline: boolean;
  isQuickAccess?: boolean;
  lastSeenAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading: authLoading, quickAccessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOnline, setTotalOnline] = useState(0);
  
  // Filtres de recherche
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 99,
    hasPhoto: false,
    country: "",
    department: "",
    pseudo: "",
    onlineOnly: true, // Par défaut ON
  });

  const fetchUsers = async (pageNum: number, silent = false) => {
    try {
      // Ne pas montrer le loader si c'est un refresh silencieux
      if (!silent) {
        setIsLoading(true);
      }
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "15",
      });
      
      // Ajouter les filtres actifs
      if (filters.onlineOnly) params.set("isOnline", "true");
      if (filters.hasPhoto) params.set("hasPhoto", "true");
      if (filters.country) params.set("country", filters.country);
      if (filters.pseudo) params.set("search", filters.pseudo);
      if (filters.department) params.set("department", filters.department);
      if (filters.ageMin > 18) params.set("ageMin", filters.ageMin.toString());
      if (filters.ageMax < 99) params.set("ageMax", filters.ageMax.toString());
      
      const headers: HeadersInit = {};
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }
      
      const response = await fetch(`/api/users?${params}`, { headers });
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(Math.ceil(data.data.total / 15) || 1);
        setTotalOnline(data.data.total);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Rediriger si non authentifié (après le chargement)
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }
    
    if (isAuthenticated) {
      fetchUsers(page);
      
      // Polling toutes les 15 secondes pour rafraîchir la liste (silencieux)
      const interval = setInterval(() => {
        fetchUsers(page, true); // Mode silencieux
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [page, authLoading, isAuthenticated, filters]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1);
  };

  const handleUserClick = async (userId: string) => {
    // Créer ou récupérer une conversation avec cet utilisateur
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }
      
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers,
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.conversationId) {
        router.push(`/messages/${data.data.conversationId}`);
      } else {
        console.error("Erreur création conversation:", data.error);
      }
    } catch (error) {
      console.error("Erreur création conversation:", error);
    }
  };

  const handleMessage = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    await handleUserClick(userId);
  };

  const handleLike = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }
      
      await fetch("/api/likes", {
        method: "POST",
        headers,
        body: JSON.stringify({ targetUserId: userId }),
      });
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:max-h-[calc(100dvh-220px)] gap-4">
      {/* Colonne gauche - Liste des connectés (masquée sur mobile) */}
      <div className="hidden md:flex w-72 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-col overflow-hidden">
        {/* Header liste */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-green-400 text-green-400" />
            <span className="font-semibold">{totalOnline} connecté(e)s</span>
          </div>
          <button 
            onClick={() => fetchUsers(page)} 
            className="p-1 hover:bg-white/20 rounded"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Liste scrollable */}
        <div className="overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors w-full text-left"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar
                  src={user.avatar}
                  alt={user.pseudo}
                  size="md"
                  className="ring-2 ring-gray-100 dark:ring-gray-700"
                />
                {user.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {user.pseudo}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user.age} ans • {getLocationLabel(user.country, user.department) || "Non précisé"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleMessage(e, user.id)}
                  className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                  title="Envoyer un message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
{/* Bouton Like - masqué pour les utilisateurs anonymes */}
                {!user.isQuickAccess && (
                  <button
                    type="button"
                    onClick={(e) => handleLike(e, user.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Envoyer un like"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                )}
              </div>
            </button>
          ))}

          {isLoading && users.length === 0 && (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex-shrink-0 px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Zone centrale - Recherche */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-20 md:mb-0">
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
            Ta recherche
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Âge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tranche d'âge
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={filters.ageMin}
                onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) || 18 })}
                min={18}
                max={99}
                className="w-20 text-center"
              />
              <span className="text-gray-400">à</span>
              <Input
                type="number"
                value={filters.ageMax}
                onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) || 99 })}
                min={18}
                max={99}
                className="w-20 text-center"
              />
              <span className="text-gray-500 text-sm">ans</span>
            </div>
          </div>

          {/* Options photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasPhoto}
                  onChange={(e) => setFilters({ ...filters, hasPhoto: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Photo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlineOnly}
                  onChange={(e) => setFilters({ ...filters, onlineOnly: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                />
                <Circle className="w-4 h-4 text-green-500 fill-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">En ligne</span>
              </label>
            </div>
          </div>

          {/* Localisation (pays + département) */}
          <div className="sm:col-span-2">
            <LocationSelect
              country={filters.country}
              department={filters.department}
              onCountryChange={(country) => {
                console.log("Dashboard - onCountryChange called with:", country);
                setFilters(prev => ({ ...prev, country }));
              }}
              onDepartmentChange={(department) => {
                console.log("Dashboard - onDepartmentChange called with:", department);
                setFilters(prev => ({ ...prev, department }));
              }}
              showLabels={true}
              countryLabel="Pays"
              departmentLabel="Département"
            />
          </div>

          {/* Pseudo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un pseudo
            </label>
            <Input
              type="text"
              value={filters.pseudo}
              onChange={(e) => setFilters({ ...filters, pseudo: e.target.value })}
              placeholder="Entrer un pseudo..."
            />
          </div>
        </div>

        {/* Bouton recherche */}
        <div className="mt-6">
          <Button 
            variant="accent" 
            onClick={handleSearch}
            className="px-8"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Colonne droite - (masquée sur mobile et tablette) */}
      <div className="hidden xl:block w-[300px] flex-shrink-0">
        {/* Suggestion premium (fun, pas vraiment premium) */}
        <div className="bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl p-5 text-white">
          <div className="text-3xl mb-2">🪨</div>
          <h3 className="font-bold text-lg mb-2">Tu kiffes Menhir ?</h3>
          <p className="text-sm text-white/80 mb-3">
            Partage le site avec tes potes pour agrandir la communauté !
          </p>
          <button className="w-full bg-white text-primary-600 font-bold py-2 rounded-lg hover:bg-accent-100 transition-colors">
            Partager 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
