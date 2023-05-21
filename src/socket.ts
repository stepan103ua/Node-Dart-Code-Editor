import app from './app';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketAuthMiddleware } from './middlewares/sockerAuth';

export const server = createServer(app);

const io = new Server(server);

io.use(socketAuthMiddleware);

export default io;
