import { InferSchemaType, Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>('Project', projectSchema);
