import { Socket } from 'socket.io';
import { createProject, getProjectsByUserId } from '../controllers/projects';

export const onSocketConnection: (socket: Socket) => void = async (socket) => {
  const userId: string = socket.data.userId;

  await socket.join(userId);

  console.log(`USER ID:  ${userId}`);

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('create-project', async (name: string) => {
    await createProject(name, userId);
    const projects = await getProjectsByUserId(userId);
    socket.emit('received-projects', projects);
  });

  socket.on('receive-projects', async () => {
    const projects = await getProjectsByUserId(userId);
    socket.emit('received-projects', projects);
  });
};
