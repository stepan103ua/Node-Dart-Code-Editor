import { Socket } from 'socket.io';

export const onSocketConnection: (socket: Socket) => void = (socket) => {
  const userId = socket.data.userId;

  socket.join(userId);

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('receive-projects', () => {
    socket.to(userId).emit('received-projects', 'test');
  });
};
