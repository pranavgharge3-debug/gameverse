import { Server } from 'socket.io';
import { createServer } from 'http';

export function setupRealtime(httpServer: ReturnType<typeof createServer>) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true },
  });

  const onlineUsers = new Map<string, string>();

  io.on('connection', (socket) => {
    console.info(`User connected: ${socket.id}`);

    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    socket.on('message:send', (data) => {
      io.emit('message:receive', data);
    });

    socket.on('chat:clan', (data) => {
      io.emit('chat:clan:receive', data);
    });

    socket.on('disconnect', () => {
      Array.from(onlineUsers.entries()).forEach(([userId, sockId]) => {
        if (sockId === socket.id) onlineUsers.delete(userId);
      });
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });

  return io;
}
