"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const onlineBadgeSizes = {
  sm: "w-2 h-2 border",
  md: "w-3 h-3 border-2",
  lg: "w-4 h-4 border-2",
  xl: "w-5 h-5 border-2",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function Avatar({
  src,
  alt,
  size = "md",
  isOnline,
  showOnlineStatus = false,
  className,
}: AvatarProps) {
  // Utiliser img native pour les data URLs base64, sinon next/image
  const isDataUrl = src?.startsWith("data:");
  
  return (
    <div className={cn("relative inline-block flex-shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "rounded-full object-cover bg-gray-200 dark:bg-gray-700",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
            sizeClasses[size]
          )}
          aria-label={alt}
        >
          <User className={cn("text-gray-400 dark:text-gray-500", iconSizes[size])} />
        </div>
      )}

      {showOnlineStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white dark:border-gray-800",
            onlineBadgeSizes[size],
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
          aria-label={isOnline ? "En ligne" : "Hors ligne"}
        />
      )}
    </div>
  );
}
