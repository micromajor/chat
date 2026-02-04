// Types principaux pour MenConnect

// ==========================================
// UTILISATEURS
// ==========================================

export interface User {
  id: string;
  email: string;
  pseudo: string;
  birthDate: Date;
  city?: string;
  region?: string;
  description?: string;
  avatar?: string;
  searchAgeMin: number;
  searchAgeMax: number;
  searchDistance?: number;
  isOnline: boolean;
  isInvisible: boolean;
  isVerified: boolean;
  lastSeenAt: Date;
  createdAt: Date;
}

export interface UserProfile extends Omit<User, "email"> {
  age: number;
  hasLikedMe?: boolean;
  iLiked?: boolean;
  isBlocked?: boolean;
}

export interface UserPreview {
  id: string;
  pseudo: string;
  avatar?: string;
  age: number;
  city?: string;
  isOnline: boolean;
  lastSeenAt: Date;
}

// ==========================================
// CONVERSATIONS & MESSAGES
// ==========================================

export interface Conversation {
  id: string;
  participants: UserPreview[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  conversationId: string;
}

export interface MessageWithSender extends Message {
  sender: UserPreview;
}

// ==========================================
// INTERACTIONS
// ==========================================

export interface Like {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  reason?: string;
  createdAt: Date;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export type NotificationType =
  | "NEW_MESSAGE"
  | "NEW_LIKE"
  | "PROFILE_VIEW"
  | "MATCH"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

// ==========================================
// API RESPONSES
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==========================================
// FORMULAIRES
// ==========================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  pseudo: string;
  birthDate: string;
  acceptCGU: boolean;
  acceptPrivacy: boolean;
}

export interface ProfileUpdateForm {
  pseudo?: string;
  city?: string;
  region?: string;
  description?: string;
  searchAgeMin?: number;
  searchAgeMax?: number;
  searchDistance?: number;
}

// ==========================================
// SOCKET EVENTS
// ==========================================

export interface SocketEvents {
  // Client -> Server
  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:message": (data: { conversationId: string; content: string }) => void;
  "chat:typing": (conversationId: string) => void;
  "chat:stopTyping": (conversationId: string) => void;
  "user:online": () => void;
  "user:offline": () => void;

  // Server -> Client
  "chat:newMessage": (message: Message) => void;
  "chat:userTyping": (data: { conversationId: string; userId: string }) => void;
  "chat:userStopTyping": (data: {
    conversationId: string;
    userId: string;
  }) => void;
  "chat:messageRead": (data: {
    conversationId: string;
    messageId: string;
  }) => void;
  "user:statusChange": (data: { userId: string; isOnline: boolean }) => void;
  notification: (notification: Notification) => void;
}

// ==========================================
// FILTRES DE RECHERCHE
// ==========================================

export interface UserSearchFilters {
  ageMin?: number;
  ageMax?: number;
  city?: string;
  isOnline?: boolean;
  hasPhoto?: boolean;
  sortBy?: "lastSeen" | "newest" | "nearest";
  page?: number;
  limit?: number;
}
