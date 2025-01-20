import express from 'express';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import expenseRoutes from './routes/expenseRoutes';
import incomes from './routes/incomeRoutes';
import { AppDataSource } from './database';
import authRoute from './routes/authRoute';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes', incomes);
app.use('/auth', authRoute);

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

export default app;
