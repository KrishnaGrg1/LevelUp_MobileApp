import { getSocket } from '@/lib/socket';
import { useSocketStore } from '@/stores/socket.store';
import { useEffect } from 'react';

/**
 * Hook to track socket connection state
 */
export const useSocket = () => {
  const { isConnected, setIsConnected } = useSocketStore();

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial state
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [setIsConnected]);

  return {
    isConnected,
    socket: getSocket(),
  };
};
