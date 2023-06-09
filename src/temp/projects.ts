import { Socket } from 'socket.io';
import { UserEntity } from '../entities/user';
import { getProjectCodeByProjectId } from '../controllers/projectCode';

interface TempProject {
  projectId: string;
  usersOnline: UserEntity[];
  code: string;
}

const tempProjects: TempProject[] = [];

export const addUserToTempProject = async (projectId: string, user: UserEntity): Promise<void> => {
  const projectIndex = tempProjects.findIndex((value) => value.projectId === projectId);

  if (projectIndex === -1) {
    const projectCode = await getProjectCodeByProjectId(projectId);
    tempProjects.push({ projectId, usersOnline: [user], code: projectCode?.code ?? '' });
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

export const tempProjectCodeUpdate = (projectId: string, code: string): boolean => {
  const project = tempProjects.find((value) => value.projectId === projectId);

  if (project === undefined) {
    return false;
  }

  project.code = code;

  return true;
};

export const getTempProjectCode = (projectId: string): string | undefined =>
  tempProjects.find((value) => value.projectId === projectId)?.code;
