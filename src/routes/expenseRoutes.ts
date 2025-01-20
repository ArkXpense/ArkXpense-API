import { Router } from 'express';
import { AppDataSource } from '../database';
import { Expense } from '../entities/Expense';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
const router = Router();

// CREATE: Add a new expense
router.post('/generate', async (req, res) => {
  const { description, amount, groupId, userId, guarantorId } = req.body;

  if (!description || !amount || !groupId || !userId || !guarantorId) {
    res.status(400).json({ message: 'Description, amount, groupId, userId, and guarantorId are required' });
    return;
  }

  const expenseRepository = AppDataSource.getRepository(Expense);
  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const group = await groupRepository.findOne({ where: { id: groupId } });
    const user = await userRepository.findOne({ where: { id: userId } });
    const guarantor = await userRepository.findOne({ where: { id: guarantorId } });

    if (!group || !user || !guarantor) {
      res.status(404).json({ message: 'Group, user, or guarantor not found' });
      return;
    }

    const newExpense = expenseRepository.create({ description, amount, group, user, guarantor });
    await expenseRepository.save(newExpense);

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    return;
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

// READ: Get all expenses
router.get('/', async (_req, res) => {
  const expenseRepository = AppDataSource.getRepository(Expense);

  try {
    const expenses = await expenseRepository.find({
      relations: ['group', 'user', 'guarantor'], // Load related entities
    });
    res.status(200).json(expenses);
    return;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

// READ: Get a single expense by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const expenseRepository = AppDataSource.getRepository(Expense);

  try {
    const expense = await expenseRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['group', 'user', 'guarantor'], // Load related entities
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return; 
    }

    res.status(200).json(expense);
    return; 
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

// UPDATE: Update an existing expense
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, groupId, userId, guarantorId } = req.body;

  if (!description || !amount || !groupId || !userId || !guarantorId) {
    res.status(400).json({ message: 'Description, amount, groupId, userId, and guarantorId are required' });
    return;
  }

  const expenseRepository = AppDataSource.getRepository(Expense);
  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const expense = await expenseRepository.findOne({ where: { id: parseInt(id) } });
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    const group = await groupRepository.findOne({ where: { id: groupId } });
    const user = await userRepository.findOne({ where: { id: userId } });
    const guarantor = await userRepository.findOne({ where: { id: guarantorId } });

    if (!group || !user || !guarantor) {
      res.status(404).json({ message: 'Group, user, or guarantor not found' });
      return;
    }

    expense.description = description;
    expense.amount = amount;
    expense.group = group;
    expense.user = user;
    expense.guarantor = guarantor;

    await expenseRepository.save(expense);

    res.status(200).json({ message: 'Expense updated successfully', expense });
    return;
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

// DELETE: Delete an expense
router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const expenseRepository = AppDataSource.getRepository(Expense);

  try {
    const expense = await expenseRepository.findOne({ where: { id: parseInt(id) } });
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    await expenseRepository.remove(expense);
    res.status(200).json({ message: 'Expense deleted successfully' });
    return;
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});


export default router;
