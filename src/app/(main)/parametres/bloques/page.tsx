"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface BlockedUser {
  id: string;
  user: {
    id: string;
    pseudo: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function UtilisateursBloques() {
  const router = useRouter();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await fetch("/api/blocks");
        const data = await response.json();

        if (data.success) {
          setBlockedUsers(data.data);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblock = async (userId: string) => {
    if (!confirm("Débloquer cet utilisateur ?")) return;

    try {
      const response = await fetch(`/api/blocks?userId=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlockedUsers((prev) =>
          prev.filter((b) => b.user.id !== userId)
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Utilisateurs bloqués
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Vous n'avez bloqué aucun utilisateur
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {blockedUsers.map((blocked) => (
              <div
                key={blocked.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={blocked.user.avatar}
                    alt={blocked.user.pseudo}
                    size="md"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blocked.user.pseudo}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(blocked.user.id)}
                >
                  Débloquer
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
