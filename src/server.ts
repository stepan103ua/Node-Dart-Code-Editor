import app from './app';
import mongoose from 'mongoose';
import env from './util/validateEnv';

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_URL)
  .then(() => {
    console.log('Mongoose connected');
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch(console.error);
