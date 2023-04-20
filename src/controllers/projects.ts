import { ProjectEntity } from '../entities/project';
import { UserEntity } from '../entities/user';
import Project from '../models/project';
import { getUserById } from './users';

export const createProject = async (name: string, userId: string): Promise<void> => {
  const project = new Project({ name, members: [userId] });
  await project.save();
};

export const getProjectsByUserId = async (userId: string): Promise<ProjectEntity[]> => {
  const projects = Project.find({
    members: {
      $in: userId,
    },
  });

  const result = await projects.exec();

  return await Promise.all(
    result.map(async (e) => {
      const members = await Promise.all(
        e.members.map(async (member): Promise<UserEntity | null> => {
          return await getUserById(member._id.toString());
        }),
      );

      const filteredMembers = members.filter((e) => e !== null) as UserEntity[];

      const result: ProjectEntity = {
        id: e._id.toString(),
        members: filteredMembers,
        name: e.name,
        lastSaved: e.lastSaved,
      };

      return result;
    }),
  );
};
