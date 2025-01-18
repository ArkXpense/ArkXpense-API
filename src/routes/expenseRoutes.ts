import { Router } from 'express';
import { AppDataSource } from '../database';
import { Expense } from '../entities/Expense';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
const router = Router();

router.get('/', async (_req, res) => {
  const expenseRepository = AppDataSource.getRepository(Expense);
  try {
    const expenses = await expenseRepository.find({ relations: ['group', 'payer'] });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/create', async (req, res) => {
  const { description, amount, groupId, payerId } = req.body;

  if (!description || !amount || !groupId || !payerId) {
    res.status(400).json({ message: 'Description, amount, groupId, and payerId are required' });
    return;
  }

  const expenseRepository = AppDataSource.getRepository(Expense);
  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const group = await groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const payer = await userRepository.findOne({ where: { id: payerId } });
    if (!payer) {
      res.status(404).json({ message: 'Payer not found' });
      return;
    }

    const newExpense = expenseRepository.create({ description, amount, group, payer });
    await expenseRepository.save(newExpense);

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
