import express from 'express';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import expenseRoutes from './routes/expenseRoutes';
import { AppDataSource } from './database';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/expenses', expenseRoutes);

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

export default app;
