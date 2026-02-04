"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, MessageCircle, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { AdBannerSidebar } from "@/components/ads/ad-banner";
import { useAuth } from "@/contexts/auth-context";
import { getDepartmentLabel } from "@/lib/french-departments";
import { useToast } from "@/components/ui/toast";

interface Favorite {
  id: string;
  createdAt: string;
  user: {
    id: string;
    pseudo: string;
    avatar?: string;
    age: number;
    department?: string;
    isOnline: boolean;
  };
}

export default function LikesPage() {
  const router = useRouter();
  const { quickAccessToken } = useAuth();
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const headers: HeadersInit = {};
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }

      const response = await fetch("/api/likes", { headers });
      const data = await response.json();

      if (data.success) {
        setFavorites(data.data.likes);
      }
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [quickAccessToken]);

  const handleRemoveFavorite = async (e: React.MouseEvent, likeId: string, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const headers: HeadersInit = {};
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }

      const response = await fetch(`/api/likes?userId=${userId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== likeId));
      }
    } catch (error) {
      console.error("Erreur suppression favori:", error);
    }
  };

  const handleMessage = async (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers,
        body: JSON.stringify({ targetUserId: userId }),
      });

      const data = await response.json();
      if (data.success && data.data?.conversationId) {
        router.push(`/messages/${data.data.conversationId}`);
      }
    } catch (error) {
      console.error("Erreur création conversation:", error);
    }
  };

  const handleCardClick = async (e: React.MouseEvent, fav: Favorite) => {
    e.preventDefault();
    
    // Si l'utilisateur est en ligne, ouvrir le chat
    if (fav.user.isOnline) {
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (quickAccessToken) {
          headers["X-Quick-Access-Token"] = quickAccessToken;
        }

        const response = await fetch("/api/conversations", {
          method: "POST",
          headers,
          body: JSON.stringify({ targetUserId: fav.user.id }),
        });

        const data = await response.json();
        if (data.success && data.data?.conversationId) {
          router.push(`/messages/${data.data.conversationId}`);
        }
      } catch (error) {
        console.error("Erreur création conversation:", error);
      }
    } else {
      // Si hors ligne, afficher une popup
      addToast("info", "Cet utilisateur est actuellement hors ligne");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-7 h-7 text-pink-500" />
              Mes Favoris
            </h1>
            {favorites.length > 0 && (
              <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full text-sm font-medium">
                {favorites.length} profil{favorites.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Liste */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Tu n&apos;as pas encore de favoris
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Like des profils pour les retrouver ici ❤️
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Découvrir des profils
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={(e) => handleCardClick(e, fav)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar
                        src={fav.user.avatar}
                        alt={fav.user.pseudo}
                        size="lg"
                        showOnlineStatus
                        isOnline={fav.user.isOnline}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {fav.user.pseudo}
                        </h3>
                        {fav.user.age && (
                          <span className="text-sm text-gray-500">
                            {fav.user.age} ans
                          </span>
                        )}
                        {fav.user.isOnline && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            En ligne
                          </span>
                        )}
                      </div>
                      {fav.user.department && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getDepartmentLabel(fav.user.department)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Ajouté {formatRelativeTime(fav.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleMessage(e, fav.user.id)}
                        className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleRemoveFavorite(e, fav.id, fav.user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Retirer des favoris"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
