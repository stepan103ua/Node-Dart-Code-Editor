import express, { NextFunction, Response, Request } from 'express';
import authRouter from './routes/auth';
import { ApiError } from './error/apiError';

import cors from 'cors';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  next(new ApiError(404, 'Route is not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage: string = 'Unknown error';
  let code: number = 500;

  if (error instanceof ApiError) {
    errorMessage = error.message;
    code = error.code;
  }

  res.status(code).json({ error: errorMessage });
});

export default app;
