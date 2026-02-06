"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MessageCircle, 
  Trash2, 
  Circle, 
  RefreshCw,
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  ArrowLeft
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { useAuthenticatedFetch } from "@/hooks/use-authenticated-fetch";
import { useUnreadMessages } from "@/contexts/unread-messages-context";
import { getLocationLabel } from "@/lib/countries";

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

interface Conversation {
  id: string;
  user: {
    id: string;
    pseudo: string;
    avatar?: string;
    isOnline: boolean;
    lastSeenAt: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
    isMine: boolean;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const authFetch = useAuthenticatedFetch();
  const { refreshUnreadCount } = useUnreadMessages();
  
  // État pour le responsive mobile (vue active)
  const [mobileView, setMobileView] = useState<"users" | "conversations">("users");
  
  // État utilisateurs connectés
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [totalOnline, setTotalOnline] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // État conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  // Charger les utilisateurs connectés
  const fetchUsers = useCallback(async (pageNum: number) => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "15",
        isOnline: "true",
      });
      
      const response = await authFetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setTotalPages(Math.ceil(data.data.total / 15) || 1);
        setTotalOnline(data.data.total);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setUsersLoading(false);
    }
  }, [authFetch]);

  // Charger les conversations
  const fetchConversations = useCallback(async () => {
    try {
      setConversationsLoading(true);
      const response = await authFetch("/api/conversations");
      const data = await response.json();

      if (data.success) {
        const sorted = [...data.data].sort((a: Conversation, b: Conversation) => {
          const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.updatedAt).getTime();
          const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.updatedAt).getTime();
          return dateB - dateA;
        });
        setConversations(sorted);
      }
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    } finally {
      setConversationsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchUsers(page);
    fetchConversations();
    // Rafraîchir le compteur quand on ouvre la page
    refreshUnreadCount();
  }, [page, fetchUsers, fetchConversations, refreshUnreadCount]);

  const handleUserClick = async (userId: string) => {
    try {
      const response = await authFetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.conversationId) {
        router.push(`/messages/${data.data.conversationId}`);
      }
    } catch (error) {
      console.error("Erreur création conversation:", error);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Supprimer cette conversation ?")) return;
    
    try {
      const response = await authFetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
      }
    } catch (error) {
      console.error("Erreur suppression conversation:", error);
    }
  };

  const handleLike = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    try {
      await authFetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      {/* Navigation mobile */}
      <div className="md:hidden flex items-center gap-2 mb-3">
        <button
          onClick={() => setMobileView("users")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            mobileView === "users"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Users className="w-4 h-4" />
          Membres en ligne
        </button>
        <button
          onClick={() => setMobileView("conversations")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            mobileView === "conversations"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Tes Conversations
        </button>
      </div>

      <div className="flex h-full md:h-[calc(100vh-180px)] gap-4">
        {/* Colonne gauche - Utilisateurs connectés */}
        <div className={`${mobileView === "users" ? "flex" : "hidden"} md:flex w-full md:w-72 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-col overflow-hidden flex-shrink-0`}>
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-green-400 text-green-400" />
              <span className="font-semibold">{totalOnline} connecté(e)s</span>
            </div>
            <button 
              onClick={() => fetchUsers(page)} 
              className="p-1 hover:bg-white/20 rounded"
              disabled={usersLoading}
            >
              <RefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {usersLoading && users.length === 0 ? (
              <div className="p-4 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Circle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Personne en ligne</p>
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors w-full text-left"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar src={user.avatar} alt={user.pseudo} size="md" className="ring-2 ring-gray-100 dark:ring-gray-700" />
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900 dark:text-white truncate block">{user.pseudo}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.age} ans • {getLocationLabel(user.country, user.department) || "Non précisé"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      onClick={(e) => { e.stopPropagation(); handleUserClick(user.id); }}
                      className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                      title="Envoyer un message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </span>
                    <span
                      onClick={(e) => handleLike(e, user.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Envoyer un like"
                    >
                      <Heart className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Colonne centrale - Conversations */}
        <div className={`${mobileView === "conversations" ? "flex" : "hidden"} md:flex flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-col overflow-hidden`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary-500" />
              Tes conversations
            </h1>
            <button onClick={fetchConversations} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" disabled={conversationsLoading}>
              <RefreshCw className={`w-4 h-4 text-gray-500 ${conversationsLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Pas encore de messages</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Cliquez sur un utilisateur pour démarrer
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {conversations.map((conv) => (
                  <Link key={conv.id} href={`/messages/${conv.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <Avatar src={conv.user.avatar} alt={conv.user.pseudo} size="md" showOnlineStatus isOnline={conv.user.isOnline} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium truncate ${conv.unreadCount > 0 ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {conv.user.pseudo}
                        </h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                            {formatRelativeTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      {conv.lastMessage && (
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-gray-900 dark:text-gray-200 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                          {conv.lastMessage.isMine && "Vous: "}
                          {truncateText(conv.lastMessage.content, 40)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {conv.unreadCount > 0 && (
                        <span className="w-6 h-6 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                      <button onClick={(e) => handleDeleteConversation(e, conv.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
