"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { AdBannerSidebar } from "@/components/ads/ad-banner";

interface Like {
  id: string;
  createdAt: string;
  sender: {
    id: string;
    pseudo: string;
    avatar?: string;
    age: number;
    city?: string;
    isOnline: boolean;
  };
}

export default function LikesPage() {
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Pour simplifier, on utilise les notifications pour afficher les likes
        // En production, il faudrait une API dédiée
        const response = await fetch("/api/notifications");
        const data = await response.json();

        if (data.success) {
          // Filtrer les notifications de type like
          const likeNotifs = data.data.notifications.filter(
            (n: { type: string }) =>
              n.type === "NEW_LIKE" || n.type === "MATCH"
          );
          // Transformer en format Like (simplifié)
          setReceivedLikes(
            likeNotifs.map((n: { id: string; createdAt: string; data?: { userId?: string }; content: string }) => ({
              id: n.id,
              createdAt: n.createdAt,
              sender: {
                id: n.data?.userId || "",
                pseudo: n.content.split(" ")[0],
                isOnline: false,
              },
            }))
          );
        }
      } catch (error) {
        console.error("Erreur chargement likes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, []);

  const currentLikes = activeTab === "received" ? receivedLikes : sentLikes;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Likes
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("received")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "received"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              Reçus
              {receivedLikes.length > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {receivedLikes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "sent"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              Envoyés
              {sentLikes.length > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {sentLikes.length}
                </span>
              )}
            </button>
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
            ) : currentLikes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeTab === "received"
                    ? "Personne ne vous a encore liké"
                    : "Vous n'avez encore liké personne"}
                </p>
                {activeTab === "received" && (
                  <Link
                    href="/dashboard"
                    className="text-primary-500 hover:underline text-sm mt-2 inline-block"
                  >
                    Complétez votre profil pour recevoir plus de likes
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentLikes.map((like) => (
                  <Link
                    key={like.id}
                    href={`/profil/${like.sender.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Avatar
                      src={like.sender.avatar}
                      alt={like.sender.pseudo}
                      size="lg"
                      showOnlineStatus
                      isOnline={like.sender.isOnline}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {like.sender.pseudo}
                        </h3>
                        {like.sender.age && (
                          <span className="text-sm text-gray-500">
                            {like.sender.age} ans
                          </span>
                        )}
                      </div>
                      {like.sender.city && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {like.sender.city}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatRelativeTime(like.createdAt)}
                      </p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
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
