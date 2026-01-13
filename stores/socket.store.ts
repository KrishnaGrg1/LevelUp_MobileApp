import { create } from "zustand";

interface SocketState {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
}));
