import jwt, { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import env from '../util/validateEnv';

export const socketAuthMiddleware: (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => void = (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log(token);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    socket.data.userId = (decoded as JwtPayload)?.id;
    next();
  } catch (err) {
    next();
  }
};
