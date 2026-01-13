import { Message } from "@/types/message.types";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

let socket: Socket | null = null;

// TODO: Replace with your actual backend socket URL
const SOCKET_URL = __DEV__
  ? "http://192.168.1.102:8001/" // Development
  : "https://your-production-api.com"; // Production

/**
 * Get or create socket instance (Singleton pattern)
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      extraHeaders: {},
    });

    // Connection event listeners
    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket?.id);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("❌ Socket Disconnected:", reason);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("❌ Connection error:", error.message);
    });

    socket.on("reconnect", (attemptNumber: number) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
    });
  }

  return socket;
};

/**
 * Connect socket with authentication
 * Sends session token in Authorization header as expected by backend
 */
export const connectSocket = (authToken?: string, userId?: string) => {
  const socket = getSocket();

  // Set Authorization header with Bearer token (matches backend expectations)
  if (authToken) {
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      authorization: `Bearer ${authToken}`,
    };
    console.log("🔑 Socket auth configured for user:", userId);
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

// ==================== COMMUNITY EVENTS ====================

export const joinCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit("join-community", { communityId });
  console.log("📥 Joined community:", communityId);
};

export const leaveCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit("leave-community", { communityId });
  console.log("📤 Left community:", communityId);
};

export const sendCommunityMessage = (communityId: string, content: string) => {
  const socket = getSocket();
  socket.emit("community:send-message", { communityId, content });
};

export const onCommunityMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on("community:new-message", callback);
};

export const offCommunityMessage = () => {
  const socket = getSocket();
  socket.off("community:new-message");
};

// ==================== CLAN EVENTS ====================

export const joinClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit("join-clan", { clanId });
  console.log("📥 Joined clan:", clanId);
};

export const leaveClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit("leave-clan", { clanId });
  console.log("📤 Left clan:", clanId);
};

export const sendClanMessage = (clanId: string, content: string) => {
  const socket = getSocket();
  socket.emit("clan:send-message", { clanId, content });
};

export const onClanMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on("clan:new-message", callback);
};

export const offClanMessage = () => {
  const socket = getSocket();
  socket.off("clan:new-message");
};

// ==================== TYPING INDICATORS ====================

export const sendTyping = (roomId: string, isTyping: boolean) => {
  const socket = getSocket();
  socket.emit("typing", { roomId, isTyping });
};

export const onTyping = (
  callback: (data: {
    userId: string;
    UserName: string;
    isTyping: boolean;
  }) => void
) => {
  const socket = getSocket();
  socket.on("user-typing", callback);
};

export const offTyping = () => {
  const socket = getSocket();
  socket.off("user-typing");
};
