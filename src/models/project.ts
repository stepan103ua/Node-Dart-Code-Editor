import { InferSchemaType, Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  lastSaved: { type: Date, default: Date.now },
});

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>('Project', projectSchema);
