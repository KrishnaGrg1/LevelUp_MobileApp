import { checkClanMembership } from '@/api/endPoints/message.service';
import {
  getSocket,
  joinClan,
  joinCommunity,
  leaveClan,
  leaveCommunity,
} from '@/api/endPoints/socket';
import useAuthStore from '@/stores/auth.store';
import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';

interface UseRoomProps {
  roomId?: string;
  type: 'community' | 'clan';
}

interface RoomState {
  isJoined: boolean;
  isMember: boolean;
  accessDenied: boolean;
  accessDeniedCode?: string;
}

/**
 * Hook for managing room join/leave and membership
 */
export const useRoom = ({ roomId, type }: UseRoomProps) => {
  const { isConnected } = useSocket();
  const user = useAuthStore(state => state.user);
  const [roomState, setRoomState] = useState<RoomState>({
    isJoined: false,
    isMember: true,
    accessDenied: false,
  });
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!roomId || !isConnected || hasJoinedRef.current) return;

    const socket = getSocket();
    hasJoinedRef.current = true;

    const handleAccessDenied = (data: { code: string; message: string }) => {
      console.error('❌ Room access denied:', data);
      setRoomState({
        isJoined: false,
        isMember: false,
        accessDenied: true,
        accessDeniedCode: data.code,
      });
    };

    // Subscribe to access denied events (for clans)
    if (type === 'clan') {
      socket.on('clan-access-denied', handleAccessDenied);
    }

    // Join room
    const joinRoom = async () => {
      if (type === 'community') {
        // Communities are open - join directly
        joinCommunity(roomId);
        setRoomState(prev => ({ ...prev, isJoined: true }));
      } else {
        // Clans require membership check
        if (!user?.id) {
          setRoomState({
            isJoined: false,
            isMember: false,
            accessDenied: true,
            accessDeniedCode: 'NOT_AUTHENTICATED',
          });
          return;
        }

        try {
          const { isMember } = await checkClanMembership(user.id, roomId);

          if (!isMember) {
            setRoomState({
              isJoined: false,
              isMember: false,
              accessDenied: true,
              accessDeniedCode: 'NOT_MEMBER',
            });
            return;
          }

          // User is member - join clan
          joinClan(roomId);
          setRoomState(prev => ({
            ...prev,
            isJoined: true,
            isMember: true,
          }));
        } catch (error) {
          console.error('Failed to check clan membership:', error);
          setRoomState({
            isJoined: false,
            isMember: false,
            accessDenied: true,
            accessDeniedCode: 'MEMBERSHIP_CHECK_FAILED',
          });
        }
      }
    };

    joinRoom();

    // Cleanup on unmount
    return () => {
      if (type === 'clan') {
        socket.off('clan-access-denied', handleAccessDenied);
        leaveClan(roomId);
      } else {
        leaveCommunity(roomId);
      }

      hasJoinedRef.current = false;
      setRoomState({
        isJoined: false,
        isMember: true,
        accessDenied: false,
      });
    };
  }, [roomId, type, isConnected, user]);

  return roomState;
};
