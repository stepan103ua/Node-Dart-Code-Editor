import { Socket } from 'socket.io';
import { createProject, getProjectsByUserId } from '../controllers/projects';
import { acceptInvite, getInvitesByUserId, rejectInvite, sendInvite } from '../controllers/invites';
import {
  addUserToTempProject,
  disconnectFromAllTempProjects,
  getTempProjectById,
} from '../temp/projects';
import { getUserById } from '../controllers/users';

export const onSocketConnection: (socket: Socket) => void = async (socket) => {
  const userId: string = socket.data.userId;

  await socket.join(userId);

  console.log(`USER ID:  ${userId}`);

  socket.on('disconnect', () => {
    disconnectFromAllTempProjects(userId, socket);
    socket.disconnect(true);
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

  socket.on('receive-invites', async () => {
    const invites = await getInvitesByUserId(userId);
    socket.emit('received-invites', invites);
  });

  socket.on('send-invite', async (toUserEmail: string, projectId: string) => {
    const newInvite = await sendInvite(toUserEmail, userId, projectId);
    if (newInvite === null) {
      return;
    }
    socket.to(newInvite.toUser.id).emit('new-invite', newInvite);
  });

  socket.on('invite-respond', async (isAccepted: boolean, inviteId: string) => {
    if (!isAccepted) {
      await rejectInvite(inviteId);
      const invites = await getInvitesByUserId(userId);
      socket.emit('received-invites', invites);
      return;
    }
    await acceptInvite(inviteId);
    const projects = await getProjectsByUserId(userId);
    const invites = await getInvitesByUserId(userId);
    socket.emit('invite-accepted', projects, invites);
  });

  socket.on('open-project', async (projectId: string) => {
    const user = await getUserById(userId);

    if (user === null) {
      return;
    }

    addUserToTempProject(projectId, user);

    const project = getTempProjectById(projectId);

    if (project === undefined) {
      return;
    }

    await socket.join(projectId);

    socket.to(projectId).emit('project-online-members-updated', project.usersOnline);

    socket.emit('project-online-members-updated', project.usersOnline);
  });
};
