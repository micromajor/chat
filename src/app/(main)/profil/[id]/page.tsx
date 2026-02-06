"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Flag,
  Ban,
  MapPin,
  Calendar,
  Shield,
  MoreHorizontal,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatRelativeTime } from "@/lib/utils";
import { getLocationLabel } from "@/lib/countries";

interface UserProfile {
  id: string;
  pseudo: string;
  avatar?: string;
  age: number;
  country?: string;
  department?: string;
  description?: string;
  isOnline: boolean;
  isVerified: boolean;
  lastSeenAt: string;
  createdAt: string;
  iLiked: boolean;
  hasLikedMe: boolean;
  isMatch: boolean;
}

export default function ProfilPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();

        if (data.success) {
          setUser(data.data);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      if (user.iLiked) {
        // Unlike
        await fetch(`/api/likes?userId=${user.id}`, { method: "DELETE" });
        setUser({ ...user, iLiked: false, isMatch: false });
        addToast("info", "Like retiré");
      } else {
        // Like
        const response = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        if (data.success) {
          setUser({ ...user, iLiked: true, isMatch: data.isMatch });
          addToast("success", data.isMatch ? "C'est un match ! 💕" : "Profil liké ❤️");
        }
      }
    } catch (error) {
      console.error("Erreur like:", error);
      addToast("error", "Erreur lors du like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleStartConversation = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();

      if (data.success) {
        router.push(`/messages/${data.data.conversationId}`);
      }
    } catch (error) {
      console.error("Erreur création conversation:", error);
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    if (!confirm(`Êtes-vous sûr de vouloir bloquer ${user.pseudo} ?`)) return;

    try {
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erreur blocage:", error);
    }
  };

  const handleReport = async () => {
    if (!user) return;

    const reason = prompt(
      "Raison du signalement :\n1. Harcèlement\n2. Spam\n3. Faux profil\n4. Contenu inapproprié\n5. Mineur\n6. Autre"
    );

    if (!reason) return;

    const reasons: Record<string, string> = {
      "1": "HARASSMENT",
      "2": "SPAM",
      "3": "FAKE_PROFILE",
      "4": "INAPPROPRIATE_CONTENT",
      "5": "UNDERAGE",
      "6": "OTHER",
    };

    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedId: user.id,
          reason: reasons[reason] || "OTHER",
        }),
      });
      alert("Signalement enregistré. Merci pour ta vigilance.");
    } catch (error) {
      console.error("Erreur signalement:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-pulse">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error || "Profil non trouvé"}
        </p>
        <Link href="/dashboard" className="text-primary-500 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={handleReport}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Flag className="w-4 h-4" />
                Signaler
              </button>
              <button
                onClick={handleBlock}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Ban className="w-4 h-4" />
                Bloquer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {/* Photo & infos principales */}
        <div className="p-8 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="relative inline-block mb-4">
            <Avatar
              src={user.avatar}
              alt={user.pseudo}
              size="xl"
              className="w-32 h-32"
              showOnlineStatus
              isOnline={user.isOnline}
            />
            {user.isMatch && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Match ! 🎉
              </div>
            )}
          </div>

          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            {user.pseudo}
            {user.isVerified && (
              <span title="Vérifié">
                <Shield className="w-5 h-5 text-green-500" />
              </span>
            )}
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            {user.age} ans
            {(user.country || user.department) && (
              <>
                {" "}
                • <MapPin className="w-4 h-4 inline" /> {getLocationLabel(user.country, user.department)}
              </>
            )}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {user.isOnline ? (
              <span className="text-green-500">En ligne</span>
            ) : (
              <>Vu {formatRelativeTime(user.lastSeenAt)}</>
            )}
          </p>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {user.hasLikedMe && !user.isMatch && (
              <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm px-3 py-1 rounded-full">
                ❤️ Vous a liké
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {user.description && (
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              À propos
            </h2>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {user.description}
            </p>
          </div>
        )}

        {/* Infos supplémentaires */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            Membre depuis{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-4">
          <Button
            variant={user.iLiked ? "outline" : "accent"}
            size="lg"
            className="flex-1"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${user.iLiked ? "fill-current" : ""}`}
            />
            {user.iLiked ? "Liké" : "Liker"}
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleStartConversation}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
