import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);
