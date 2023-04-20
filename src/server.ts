import mongoose from 'mongoose';
import env from './util/validateEnv';
import io, { server } from './socket';
import { onSocketConnection } from './socketHandlers/connectionHandler';

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_URL)
  .then(() => {
    console.log('Mongoose connected');
    server.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });

    io.on('connection', onSocketConnection);
  })
  .catch(console.error);
