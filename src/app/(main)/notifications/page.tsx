"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Eye, Bell, Check } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface Notification {
  id: string;
  type: "NEW_MESSAGE" | "NEW_LIKE" | "PROFILE_VIEW" | "MATCH" | "SYSTEM";
  title: string;
  content: string;
  isRead: boolean;
  data?: {
    userId?: string;
    conversationId?: string;
  };
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();

        if (data.success) {
          setNotifications(data.data.notifications);
        }
      } catch (error) {
        console.error("Erreur chargement notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "NEW_MESSAGE":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "NEW_LIKE":
        return <Heart className="w-5 h-5 text-pink-500" />;
      case "PROFILE_VIEW":
        return <Eye className="w-5 h-5 text-purple-500" />;
      case "MATCH":
        return <Heart className="w-5 h-5 text-accent-500 fill-current" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLink = (notification: Notification) => {
    if (notification.data?.conversationId) {
      return `/messages/${notification.data.conversationId}`;
    }
    if (notification.data?.userId) {
      return `/profil/${notification.data.userId}`;
    }
    return "#";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Aucune notification
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={getLink(notification)}
                className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead
                    ? "bg-primary-50/50 dark:bg-primary-900/10"
                    : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      !notification.isRead
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>

                {!notification.isRead && (
                  <span className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0 mt-2"></span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
