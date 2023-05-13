import { Socket } from 'socket.io';
import { createProject, getProjectById, getProjectsByUserId } from '../controllers/projects';
import { acceptInvite, getInvitesByUserId, rejectInvite, sendInvite } from '../controllers/invites';
import {
  addUserToTempProject,
  disconnectFromAllTempProjects,
  getTempProjectById,
  getTempProjectCode,
  tempProjectCodeUpdate,
} from '../temp/projects';
import { getUserById } from '../controllers/users';
import { saveProjectCode } from '../controllers/projectCode';

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

    await addUserToTempProject(projectId, user);

    const tempProject = getTempProjectById(projectId);

    if (tempProject === undefined) {
      return;
    }

    await socket.join(projectId);

    const project = await getProjectById(projectId);

    socket.to(projectId).emit('project-online-members-updated', tempProject.usersOnline);
    socket.emit('receive-project-code-updated', project?.name, getTempProjectCode(projectId) ?? '');

    socket.emit('project-online-members-updated', tempProject.usersOnline);
  });

  socket.on('project-code-update', (projectId: string, code: string) => {
    const result = tempProjectCodeUpdate(projectId, code);
    if (result) {
      socket.to(projectId).emit('receive-project-code-updated', code);
    }
  });

  socket.on('project-code-save', async (projectId: string, code: string) => {
    const result = await saveProjectCode(projectId, code);

    if (!result) {
      socket.emit('receive-project-code-saved', 'Failed to save the code!');
      return;
    }

    const user = await getUserById(userId);
    const message =
      user !== null
        ? `Code was successfully saved by ${user?.username}!`
        : 'Code was successfully saved!';
    socket.to(projectId).emit('receive-project-code-saved', message);
    socket.emit('receive-project-code-saved', message);
  });
};
