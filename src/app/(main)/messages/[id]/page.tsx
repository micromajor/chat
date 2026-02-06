"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/ads/ad-banner";
import { useAuth } from "@/contexts/auth-context";
import { useUnreadMessages } from "@/contexts/unread-messages-context";
import { useAuthenticatedFetch } from "@/hooks/use-authenticated-fetch";
import { useToast } from "@/components/ui/toast";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Ban, 
  Heart,
  Trash2,
  Circle,
  MessageCircle,
  AlertTriangle
} from "lucide-react";

// Interface pour un utilisateur
interface UserData {
  id: string;
  pseudo: string;
  avatar?: string;
  birthDate?: string;
  city?: string;
  description?: string;
  isOnline?: boolean;
  lastSeenAt?: string;
  isQuickAccess?: boolean;
}

// Interface pour un message
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
}

// Interface pour les données de conversation
interface ConversationData {
  id: string;
  otherUser: UserData;
  messages: Message[];
}

// Calcul de l'âge à partir de la date de naissance
function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Formater la date d'un message
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { refreshUnreadCount } = useUnreadMessages();
  const authenticatedFetch = useAuthenticatedFetch();
  const { addToast } = useToast();

  // États pour la liste des utilisateurs
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // États pour la conversation
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // États pour les actions utilisateur
  const [hasLiked, setHasLiked] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // État pour la modale d'avertissement utilisateur hors ligne
  const [offlineWarning, setOfflineWarning] = useState<{
    show: boolean;
    isAnonymous: boolean;
    pseudo: string;
    pendingMessage: string;
  }>({ show: false, isAnonymous: false, pseudo: "", pendingMessage: "" });

  // Charger les utilisateurs en ligne
  const fetchUsers = useCallback(async () => {
    try {
      // Ne pas filtrer par isOnline pour voir aussi l'interlocuteur
      const response = await authenticatedFetch("/api/users?page=1&limit=20");
      if (response.ok) {
        const json = await response.json();
        // L'API retourne { success: true, data: { users: [...] } }
        const allUsers = json.data?.users || json.users || [];
        // Garder seulement les utilisateurs en ligne
        const onlineUsers = allUsers.filter((u: UserData) => u.isOnline);
        setUsers(onlineUsers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setUsersLoading(false);
    }
  }, [authenticatedFetch]);

  // Charger la conversation
  const fetchConversation = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const json = await response.json();
        // L'API retourne { success: true, data: { messages, otherUser, ... } }
        const data = json.data || json;
        setConversation({
          id: conversationId,
          otherUser: data.otherUser,
          messages: data.messages || [],
        });

        // Rafraîchir le compteur de messages non lus
        refreshUnreadCount();

        // Vérifier si l'utilisateur a liké l'autre utilisateur
        if (data.otherUser) {
          const likeResponse = await authenticatedFetch(`/api/likes?targetId=${data.otherUser.id}`);
          if (likeResponse.ok) {
            const likeData = await likeResponse.json();
            setHasLiked(likeData.hasLiked || false);
          }
        }
      } else if (response.status === 404) {
        router.push("/messages");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation:", error);
    } finally {
      setConversationLoading(false);
    }
  }, [authenticatedFetch, conversationId, router, refreshUnreadCount]);

  // Envoyer un message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || sendingMessage) return;

    // Vérifier si l'interlocuteur est hors ligne
    const otherUser = conversation.otherUser;
    if (!otherUser.isOnline) {
      // Afficher la modale d'avertissement
      setOfflineWarning({
        show: true,
        isAnonymous: otherUser.isQuickAccess || false,
        pseudo: otherUser.pseudo,
        pendingMessage: newMessage,
      });
      return;
    }

    await doSendMessage(newMessage);
  };

  // Fonction interne pour envoyer le message (après confirmation si nécessaire)
  const doSendMessage = async (messageContent: string) => {
    if (!conversation) return;

    setSendingMessage(true);
    try {
      const response = await authenticatedFetch(`/api/conversations/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        const json = await response.json();
        const message = json.data || json;
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message],
        } : null);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Confirmer l'envoi malgré l'avertissement hors ligne (pour les inscrits)
  const handleConfirmSendOffline = async () => {
    const message = offlineWarning.pendingMessage;
    setOfflineWarning({ show: false, isAnonymous: false, pseudo: "", pendingMessage: "" });
    await doSendMessage(message);
  };

  // Supprimer la conversation (quand l'anonyme est parti)
  const handleDeleteOfflineConversation = async () => {
    setOfflineWarning({ show: false, isAnonymous: false, pseudo: "", pendingMessage: "" });
    await handleDeleteConversation();
  };

  // Toggle like
  const handleLike = async () => {
    if (!conversation?.otherUser || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await authenticatedFetch("/api/likes", {
        method: hasLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: conversation.otherUser.id }),
      });

      if (response.ok) {
        setHasLiked(!hasLiked);
        addToast("success", hasLiked ? "Like retiré" : "Profil liké ❤️");
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
      addToast("error", "Erreur lors du like");
    } finally {
      setActionLoading(false);
    }
  };



  // Bloquer l'utilisateur
  const handleBlock = async () => {
    if (!conversation?.otherUser || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await authenticatedFetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: conversation.otherUser.id }),
      });

      if (response.ok) {
        addToast("success", "Utilisateur bloqué");
        router.push("/messages");
      }
    } catch (error) {
      console.error("Erreur lors du blocage:", error);
      addToast("error", "Erreur lors du blocage");
    } finally {
      setActionLoading(false);
      setShowBlockModal(false);
    }
  };

  // Supprimer la conversation
  const handleDeleteConversation = async () => {
    if (!confirm("Supprimer cette conversation ?")) return;

    try {
      const response = await authenticatedFetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addToast("success", "Conversation supprimée");
        router.push("/messages");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      addToast("error", "Erreur lors de la suppression");
    }
  };

  // Scroll vers le bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Chargement initial
  useEffect(() => {
    fetchUsers();
    fetchConversation();

    // Rafraîchir périodiquement
    const interval = setInterval(() => {
      fetchConversation();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchUsers, fetchConversation]);

  // Démarrer une conversation avec un utilisateur
  const startConversation = async (targetUserId: string) => {
    try {
      const response = await authenticatedFetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/messages/${data.id}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      {/* Navigation mobile - Retour aux conversations */}
      <div className="md:hidden flex items-center gap-2 mb-3">
        <button
          onClick={() => router.push("/messages")}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux conversations
        </button>
      </div>

      <div className="flex h-full md:h-[calc(100vh-180px)] gap-4">
        {/* Colonne gauche - Utilisateurs connectés (desktop uniquement) */}
        <div className="hidden md:flex w-72 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex-col overflow-hidden flex-shrink-0">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-green-400 text-green-400" />
              <span className="font-semibold">{users.filter(u => u.isOnline).length} connecté(e)s</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {usersLoading ? (
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
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Circle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Personne en ligne</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => {
                  const age = calculateAge(u.birthDate);
                  return (
                    <div
                      key={u.id}
                      onClick={() => startConversation(u.id)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar
                          src={u.avatar}
                          alt={u.pseudo}
                          size="md"
                          className="ring-2 ring-gray-100 dark:ring-gray-700"
                        />
                        {u.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {u.pseudo}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {age ? `${age} ans` : ""}
                          {age && u.city ? " • " : ""}
                          {u.city || ""}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); startConversation(u.id); }}
                        className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Colonne centrale - Chat */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden pb-20 md:pb-0">
          {conversationLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : !conversation || !conversation.otherUser ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Conversation non trouvée
            </div>
          ) : (
            <>
              {/* Header du chat */}
              <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                {/* Bouton retour (desktop) */}
                <button
                  onClick={() => router.push("/messages")}
                  className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Avatar et infos */}
                <div
                  onClick={() => router.push(`/profil/${conversation.otherUser.id}`)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="relative">
                    <Avatar
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.pseudo}
                      size="md"
                    />
                    {conversation.otherUser.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {conversation.otherUser.pseudo}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {conversation.otherUser.isOnline
                        ? "En ligne"
                        : "Hors ligne"}
                    </p>
                  </div>
                </div>

                {/* Actions directes */}
                <div className="flex items-center gap-1">
                  {/* Profil - Uniquement pour les utilisateurs inscrits */}
                  {!conversation.otherUser.isQuickAccess && (
                    <button
                      onClick={() => router.push(`/profil/${conversation.otherUser.id}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      title="Voir le profil"
                    >
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  
                  {/* Like */}
                  <button
                    onClick={handleLike}
                    disabled={actionLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title={hasLiked ? "Retirer le like" : "Liker"}
                  >
                    <Heart 
                      className={`w-5 h-5 ${hasLiked ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"}`} 
                    />
                  </button>

                  {/* Bloquer */}
                  <button
                    onClick={() => setShowBlockModal(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Bloquer"
                  >
                    <Ban className="w-5 h-5 text-red-500" />
                  </button>

                  {/* Supprimer */}
                  <button
                    onClick={handleDeleteConversation}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Supprimer la conversation"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {conversation.messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Aucun message. Commencez la conversation !
                  </div>
                ) : (
                  conversation.messages.map((message) => {
                    const isMe = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMe
                              ? "bg-primary-600 text-white rounded-br-md"
                              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isMe ? "text-primary-200" : "text-gray-400"
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <form
                onSubmit={sendMessage}
                className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="rounded-full px-4"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Colonne droite - Publicité (desktop uniquement) */}
        <div className="hidden lg:flex w-80 flex-col gap-4 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <AdBanner slot="sidebar-top" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex-1">
            <AdBanner slot="sidebar-bottom" />
          </div>
        </div>
      </div>

      {/* Modal de blocage */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bloquer {conversation?.otherUser.pseudo} ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cette personne ne pourra plus te contacter et tu ne verras plus son profil.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBlockModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleBlock}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Bloquer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'avertissement utilisateur hors ligne */}
      {offlineWarning.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${offlineWarning.isAnonymous ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                <AlertTriangle className={`w-6 h-6 ${offlineWarning.isAnonymous ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {offlineWarning.pseudo} est hors ligne
              </h3>
            </div>
            
            {offlineWarning.isAnonymous ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Cet utilisateur utilisait un <strong>accès rapide</strong> et a quitté le site. 
                  Cette conversation va être <strong>supprimée</strong> car il ne reviendra probablement pas.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setOfflineWarning({ show: false, isAnonymous: false, pseudo: "", pendingMessage: "" })}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDeleteOfflineConversation}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Supprimer la conversation
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Cet utilisateur est actuellement <strong>hors ligne</strong>. 
                  Ton message sera conservé et il le verra à son retour (dans l'heure qui suit sa déconnexion).
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setOfflineWarning({ show: false, isAnonymous: false, pseudo: "", pendingMessage: "" })}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirmSendOffline}
                    className="flex-1"
                  >
                    Envoyer quand même
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
