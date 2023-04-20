import { UserEntity } from '../entities/user';
import User from '../models/user';

export const getUserById = async (userId: string): Promise<UserEntity | null> => {
  const user = await User.findById(userId).exec();

  if (user === null) {
    return null;
  }

  const entity: UserEntity = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };

  return entity;
};
