import { Socket } from 'socket.io';
import { UserEntity } from '../entities/user';

interface TempProject {
  projectId: string;
  usersOnline: UserEntity[];
}

const tempProjects: TempProject[] = [];

export const addUserToTempProject = (projectId: string, user: UserEntity): void => {
  const projectIndex = tempProjects.findIndex((value) => value.projectId === projectId);

  if (projectIndex === -1) {
    tempProjects.push({ projectId, usersOnline: [user] });
    return;
  }

  const foundUser = tempProjects[projectIndex].usersOnline.find((value) => value.id === user.id);

  if (foundUser) {
    return;
  }

  tempProjects[projectIndex].usersOnline.push(user);
};

export const getTempProjects = (): TempProject[] => tempProjects;

export const getTempProjectById = (projectId: string): TempProject | undefined =>
  tempProjects.find((e) => e.projectId === projectId);

export const disconnectUserFromTempProject = (projectId: string, userId: string): void => {
  const projectIndex = tempProjects.findIndex((value) => value.projectId === projectId);

  if (projectIndex === -1) {
    return;
  }

  const userIndex = tempProjects[projectIndex].usersOnline.findIndex((e) => e.id === userId);

  if (userIndex === -1) {
    return;
  }

  tempProjects[projectIndex].usersOnline.splice(userIndex, 1);
};

export const disconnectFromAllTempProjects = (userId: string, socket: Socket): void => {
  const projectsWithUser = tempProjects.filter(
    (project) => project.usersOnline.find((user) => user.id === userId) !== undefined,
  );

  projectsWithUser.forEach((project) => {
    disconnectUserFromTempProject(project.projectId, userId);
    socket
      .to(project.projectId)
      .emit('project-online-members-updated', getTempProjectById(project.projectId)?.usersOnline);
  });
};
