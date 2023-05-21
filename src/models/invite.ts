import { InferSchemaType, Schema, model } from 'mongoose';

const inviteSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
});

export type InviteType = InferSchemaType<typeof inviteSchema>;

export default model<InviteType>('Invite', inviteSchema);
