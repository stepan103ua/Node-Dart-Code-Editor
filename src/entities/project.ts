import { UserEntity } from './user';

export interface ProjectEntity {
  id: string;
  name: string;
  members: UserEntity[];
  lastSaved: Date;
}
