import { InviteEntity } from '../entities/invite';
import Invite from '../models/invite';
import Project from '../models/project';
import User from '../models/user';
import { getProjectById } from './projects';
import { getUserById } from './users';

export const getInvitesByUserId = async (userId: string): Promise<InviteEntity[]> => {
  const invites = await Invite.find({
    toUser: {
      $eq: userId,
    },
  }).exec();

  const invitesEntities = await Promise.all(
    invites.map(async (invite) => {
      const fromUserEntity = await getUserById(invite.fromUser.toString());
      if (fromUserEntity === null) {
        return null;
      }
      const toUserEntity = await getUserById(invite.toUser.toString());
      if (toUserEntity === null) {
        return null;
      }
      const projectEntity = await getProjectById(invite.projectId.toString());
      if (projectEntity === null) {
        return null;
      }
      const entity: InviteEntity = {
        id: invite._id.toString(),
        fromUser: fromUserEntity,
        toUser: toUserEntity,
        project: projectEntity,
      };

      return entity;
    }),
  );

  const filteredInvites = invitesEntities.filter((invite) => invite !== null) as InviteEntity[];

  return filteredInvites;
};

export const sendInvite = async (
  toUserEmail: string,
  senderUserId: string,
  projectId: string,
): Promise<InviteEntity | null> => {
  const toUser = await User.findOne({
    email: {
      $eq: toUserEmail,
    },
  }).exec();

  if (toUser === null) {
    return null;
  }

  const invite = new Invite({ fromUser: senderUserId, toUser: toUser._id.toString(), projectId });

  const createdInvite = await invite.save();

  const fromUserEntity = await getUserById(createdInvite.fromUser.toString());
  if (fromUserEntity === null) {
    return null;
  }
  const toUserEntity = await getUserById(createdInvite.toUser.toString());
  if (toUserEntity === null) {
    return null;
  }
  const projectEntity = await getProjectById(createdInvite.projectId.toString());
  if (projectEntity === null) {
    return null;
  }
  const createdInviteEntity: InviteEntity = {
    id: invite._id.toString(),
    fromUser: fromUserEntity,
    toUser: toUserEntity,
    project: projectEntity,
  };

  return createdInviteEntity;
};

export const acceptInvite = async (inviteId: string): Promise<void> => {
  const invite = await Invite.findById(inviteId);

  if (invite === null) {
    return;
  }

  await Project.findByIdAndUpdate(invite.projectId, {
    $push: {
      members: invite.toUser.toString(),
    },
  });

  await Invite.findById(inviteId).deleteOne();
};

export const rejectInvite = async (inviteId: string): Promise<void> => {
  await Invite.findById(inviteId).deleteOne();
};
