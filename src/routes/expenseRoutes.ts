import { Router } from 'express';
import { AppDataSource } from '../database';
import { Expense } from '../entities/Expense';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
const router = Router();

router.get('/', async (_req, res) => {
  const expenseRepository = AppDataSource.getRepository(Expense);
  try {
    const expenses = await expenseRepository.find({ relations: ['group', 'user'] });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/generate', async (req, res) => {
  const { description, amount, groupId, userId } = req.body;

  if (!description || !amount || !groupId || !userId) {
    res.status(400).json({ message: 'Description, amount, groupId, and userId are required' });
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

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newExpense = expenseRepository.create({ description, amount, group, user });
    await expenseRepository.save(newExpense);

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
