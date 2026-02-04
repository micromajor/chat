"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

interface UserCardProps {
  user: {
    id: string;
    pseudo: string;
    avatar?: string;
    age: number;
    city?: string;
    isOnline: boolean;
    lastSeenAt: string;
  };
  showAd?: boolean;
}

export function UserCard({ user, showAd }: UserCardProps) {
  return (
    <>
      <Link
        href={`/messages/${user.id}`}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden card-hover group"
      >
        {/* Avatar */}
        <div className="relative aspect-square">
          <Avatar
            src={user.avatar}
            alt={user.pseudo}
            size="xl"
            className="w-full h-full rounded-none"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badge en ligne */}
          {user.isOnline && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              En ligne
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-3">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.pseudo}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.age} ans
            </span>
          </div>

          {user.city && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {user.city}
            </p>
          )}

          {!user.isOnline && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formatRelativeTime(user.lastSeenAt)}
            </p>
          )}
        </div>
      </Link>

      {/* Publicité native */}
      {showAd && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-square">
          <span className="text-xs text-gray-400">Publicité</span>
        </div>
      )}
    </>
  );
}
