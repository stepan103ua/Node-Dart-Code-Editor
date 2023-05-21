import { ProjectEntity } from './project';
import { UserEntity } from './user';

export interface InviteEntity {
  id: string;
  fromUser: UserEntity;
  toUser: UserEntity;
  project: ProjectEntity;
}
