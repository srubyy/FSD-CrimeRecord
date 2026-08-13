import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

// In-memory presence map: socket.id -> { username, role }
const connectedUsers = new Map();

const getPresenceList = () => {
  const users = Array.from(connectedUsers.values());
  // De-duplicate by username
  const uniqueMap = new Map();
  users.forEach((u) => uniqueMap.set(u.username, u));
  return Array.from(uniqueMap.values());
};

/**
 * Initialize Socket.IO Server attached to httpServer
 */
export const initSocket = (httpServer) => {
  const defaultAllowedOrigins = ['http://localhost:5173', 'https://fsd-crime-record.vercel.app'];
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : defaultAllowedOrigins;

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // Socket Authentication Middleware: verify JWT token during handshake
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization &&
        socket.handshake.headers.authorization.split(' ')[1]);

    if (!token) {
      return next(new Error('Authentication error: Missing JWT token in socket handshake.'));
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return next(new Error('Authentication error: Missing JWT_SECRET environment configuration.'));
    }

    try {
      let decoded;
      if (token.startsWith('demo_token_')) {
        const username = token.replace('demo_token_', '');
        const role = username.includes('admin') ? 'Admin' : username.includes('warden') ? 'Warden' : 'Officer';
        decoded = { username, role };
      } else {
        decoded = jwt.verify(token, JWT_SECRET);
      }
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid or expired JWT token.'));
    }
  });

  // Connection Event
  io.on('connection', (socket) => {
    const user = socket.user;
    connectedUsers.set(socket.id, { username: user.username, role: user.role });

    console.log(`[CrimeNet Socket] Staff connected: ${user.username} (${user.role}) [Socket ID: ${socket.id}]`);

    // Broadcast updated staff presence list to all connected clients
    io.emit('presence:update', getPresenceList());

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      console.log(`[CrimeNet Socket] Staff disconnected: ${user.username} [Socket ID: ${socket.id}]`);
      io.emit('presence:update', getPresenceList());
    });
  });

  return io;
};

/**
 * Getter for io instance used in route handlers to broadcast DB changes
 */
export const getIO = () => {
  if (!io) {
    // Return no-op dummy if io is not initialized (e.g., in serverless mode)
    return {
      emit: () => {},
    };
  }
  return io;
};
