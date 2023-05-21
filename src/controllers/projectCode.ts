import { ProjectCodeEntity } from '../entities/projectCode';
import Project from '../models/project';
import ProjectCode from '../models/projectCode';

export const saveProjectCode = async (projectId: string, code: string): Promise<boolean> => {
  try {
    const projectCode = await ProjectCode.findOne({
      projectId: {
        $eq: projectId,
      },
    }).exec();

    if (projectCode === null) {
      await ProjectCode.create({ code, projectId });
      return true;
    }
    await ProjectCode.updateOne(
      {
        projectId: {
          $eq: projectId,
        },
      },
      {
        code,
      },
    ).exec();

    Project.findByIdAndUpdate(projectId, {
      lastSaved: Date.now(),
    }).exec();

    return true;
  } catch (error) {
    return false;
  }
};

export const getProjectCodeByProjectId = async (
  projectId: string,
): Promise<ProjectCodeEntity | null> => {
  try {
    const projectCode = await ProjectCode.findOne({
      projectId: {
        $eq: projectId,
      },
    }).exec();

    if (projectCode === null) {
      return null;
    }

    const entity: ProjectCodeEntity = {
      id: projectCode._id.toString(),
      projectId: projectCode.projectId.toString(),
      code: projectCode.code,
    };

    return entity;
  } catch (_) {
    return null;
  }
};
