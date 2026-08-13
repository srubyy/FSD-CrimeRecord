import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api.js';

export const useSocket = () => {
  const token = useSelector((state) => state.auth?.token);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Sockets connect only when user is authenticated with a JWT token
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Use centralized API_BASE_URL (Render backend in prod, localhost in dev)
    const serverUrl = API_BASE_URL;

    // Create Socket instance with JWT handshake auth
    const socket = io(serverUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`[CrimeNet WebSocket Client] Connected to real-time server: ${socket.id}`);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[CrimeNet WebSocket Client] Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn(`[CrimeNet WebSocket Client Notice] Sockets unavailable (${err.message}). App fallback to HTTP REST active.`);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
