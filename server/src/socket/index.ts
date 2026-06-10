import { Server } from 'socket.io';
import { createServer } from 'http';

interface TypingUser {
  userId: string;
  username: string;
  timestamp: number;
}

export function setupRealtime(httpServer: ReturnType<typeof createServer>) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true },
  });

  const onlineUsers = new Map<string, string>(); // userId -> socketId
  const socketToUser = new Map<string, string>(); // socketId -> userId
  const userRooms = new Map<string, Set<string>>(); // userId -> Set of room IDs
  const typingUsers = new Map<string, Map<string, TypingUser>>(); // roomId -> Map of typing users

  io.on('connection', (socket) => {
    console.info(`User connected: ${socket.id}`);

    // User comes online
    socket.on('user:online', (userId: string) => {
      onlineUsers.set(userId, socket.id);
      socketToUser.set(socket.id, userId);
      userRooms.set(userId, new Set());
      io.emit('users:online', Array.from(onlineUsers.keys()));
      console.info(`User ${userId} is now online`);
    });

    // Join a room (for direct messages or clan chat)
    socket.on('room:join', (roomId: string) => {
      const userId = socketToUser.get(socket.id);
      if (!userId) return;

      socket.join(roomId);
      const rooms = userRooms.get(userId) || new Set();
      rooms.add(roomId);
      userRooms.set(userId, rooms);

      // Notify others in the room
      socket.to(roomId).emit('user:joined', { userId, roomId });
      console.info(`User ${userId} joined room ${roomId}`);
    });

    // Leave a room
    socket.on('room:leave', (roomId: string) => {
      const userId = socketToUser.get(socket.id);
      if (!userId) return;

      socket.leave(roomId);
      const rooms = userRooms.get(userId);
      if (rooms) {
        rooms.delete(roomId);
        userRooms.set(userId, rooms);
      }

      // Remove from typing if in this room
      const roomTyping = typingUsers.get(roomId);
      if (roomTyping) {
        roomTyping.delete(userId);
        socket.to(roomId).emit('typing:stopped', { userId, roomId });
      }

      // Notify others in the room
      socket.to(roomId).emit('user:left', { userId, roomId });
      console.info(`User ${userId} left room ${roomId}`);
    });

    // Send message (real-time)
    socket.on('message:send', (data: { roomId: string; message: any }) => {
      const userId = socketToUser.get(socket.id);
      if (!userId) return;

      // Broadcast to everyone in the room except sender
      socket.to(data.roomId).emit('message:receive', data.message);
      console.info(`Message sent in room ${data.roomId} by user ${userId}`);
    });

    // Start typing indicator
    socket.on('typing:start', (data: { roomId: string; username: string }) => {
      const userId = socketToUser.get(socket.id);
      if (!userId) return;

      const roomTyping = typingUsers.get(data.roomId) || new Map();
      roomTyping.set(userId, {
        userId,
        username: data.username,
        timestamp: Date.now(),
      });
      typingUsers.set(data.roomId, roomTyping);

      // Broadcast typing status to others in room
      socket.to(data.roomId).emit('typing:started', {
        userId,
        username: data.username,
        roomId: data.roomId,
      });

      // Auto-clear typing after 3 seconds of inactivity
      setTimeout(() => {
        const currentTyping = typingUsers.get(data.roomId);
        const userEntry = currentTyping?.get(userId);
        if (userEntry && userEntry.timestamp === Date.now()) {
          currentTyping.delete(userId);
          socket.to(data.roomId).emit('typing:stopped', { userId, roomId: data.roomId });
        }
      }, 3000);
    });

    // Stop typing indicator
    socket.on('typing:stop', (data: { roomId: string }) => {
      const userId = socketToUser.get(socket.id);
      if (!userId) return;

      const roomTyping = typingUsers.get(data.roomId);
      if (roomTyping) {
        roomTyping.delete(userId);
        socket.to(data.roomId).emit('typing:stopped', { userId, roomId: data.roomId });
      }
    });

    // Clan chat (legacy support - can be removed later)
    socket.on('chat:clan', (data) => {
      socket.broadcast.emit('chat:clan:receive', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userId = socketToUser.get(socket.id);
      if (userId) {
        // Leave all rooms
        const rooms = userRooms.get(userId) || new Set();
        rooms.forEach((roomId) => {
          socket.to(roomId).emit('user:left', { userId, roomId });
          
          // Remove from typing
          const roomTyping = typingUsers.get(roomId);
          if (roomTyping) {
            roomTyping.delete(userId);
            socket.to(roomId).emit('typing:stopped', { userId, roomId });
          }
        });

        // Clean up
        onlineUsers.delete(userId);
        socketToUser.delete(socket.id);
        userRooms.delete(userId);
        io.emit('users:online', Array.from(onlineUsers.keys()));
        console.info(`User ${userId} disconnected`);
      }
    });
  });

  return io;
}
