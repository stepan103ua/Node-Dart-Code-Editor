import { ProjectCodeEntity } from '../entities/projectCode';
import ProjectCode from '../models/projectCode';

export const saveProjectCode = async (projectId: string, code: string): Promise<boolean> => {
  try {
    await ProjectCode.updateOne(
      {
        projectId: {
          $eq: projectId,
        },
      },
      {
        lastSaved: Date.now(),
        code,
      },
    ).exec();

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
      lastSaved: projectCode.lastSaved,
    };

    return entity;
  } catch (_) {
    return null;
  }
};
