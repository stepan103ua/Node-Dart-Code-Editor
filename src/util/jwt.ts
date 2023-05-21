import jwt from 'jsonwebtoken';
import env from '../util/validateEnv';

export const generateJwt = (userId: string): string => {
  const payload = {
    id: userId,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
};
