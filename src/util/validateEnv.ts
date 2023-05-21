import { cleanEnv, port, str } from 'envalid';
import { config } from 'dotenv';

config();

export default cleanEnv(process.env, {
  MONGO_CONNECTION_URL: str(),
  PORT: port(),
  JWT_SECRET: str(),
});
