import { Server } from 'socket.io';

export const initializeSocketServer = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinEvent', (eventId: string) => {
      socket.join(eventId);
      console.log(`Socket ${socket.id} joined event ${eventId}`);
    });

    socket.on('joinUser', (userId: string) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};