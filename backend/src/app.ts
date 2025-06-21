import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import exampleRoute from './routes/example.route';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Mount your routes under /api
app.use('/api/example', exampleRoute);

export default app;
