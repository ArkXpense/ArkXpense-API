import { Router } from 'express';
import { AppDataSource } from '../database';
import { Expense } from '../entities/Expense';

const router = Router();

router.get('/', async (_req, res) => {
  const expenseRepository = AppDataSource.getRepository(Expense);
  const expenses = await expenseRepository.find({ relations: ['group'] });
  res.json(expenses);
});

export default router;
