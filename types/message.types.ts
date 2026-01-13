export interface Message {
  id: string;
  content: string;
  userId: string;
  UserName?: string; // Optional - will be enriched from sender or backend
  userAvatar?: string;
  communityId?: string;
  clanId?: string;
  createdAt: string;
  updatedAt: string;
  senderId?: string; // Support backend's senderId field as well
  sender?: {
    id: string;
    UserName: string;
    profilePicture: string | null;
    level: number;
  };
}

export interface PaginationData {
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: PaginationData;
}

export interface SocketAuthData {
  token?: string;
  userId?: string;
}
