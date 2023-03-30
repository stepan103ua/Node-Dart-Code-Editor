import { config } from 'dotenv';
import express from 'express';

config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

export default app;
