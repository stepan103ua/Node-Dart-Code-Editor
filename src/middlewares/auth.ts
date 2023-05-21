import { RequestHandler, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../util/validateEnv';
import { ApiError } from '../error/apiError';

export interface AuthorizedRequest extends Request {
  payload: JwtPayload;
}

export interface AuthorizedPayload extends JwtPayload {
  id: string;
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      next(new ApiError(401, 'Unauthorized'));
      return;
    }

    const payload = jwt.verify(accessToken, env.JWT_SECRET) as AuthorizedPayload;

    (req as AuthorizedRequest).payload = payload;
    next();
  } catch (_) {
    next(new ApiError(403, 'Forbidden'));
  }
};
