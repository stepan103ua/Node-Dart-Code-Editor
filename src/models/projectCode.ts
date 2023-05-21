import { InferSchemaType, Schema, model } from 'mongoose';

const projectCodeSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  code: { type: String, default: '', required: true },
});

type ProjectCode = InferSchemaType<typeof projectCodeSchema>;

export default model<ProjectCode>('ProjectCode', projectCodeSchema);
