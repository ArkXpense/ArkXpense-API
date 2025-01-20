import { Router } from 'express';
import { AppDataSource } from '../database'; 
import { Income } from '../entities/Income'; 
import { User } from '../entities/User';

const router = Router();

// CREATE: Add a new income
router.post('/', async (req, res) => {
  const { amount, description, receiverId } = req.body;

  if (!amount || !description || !receiverId) {
    res.status(400).json({ message: 'Amount, description, and receiverId are required' });
    return;
  }

  const incomeRepository = AppDataSource.getRepository(Income);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const receiver = await userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) {
      res.status(404).json({ message: 'Receiver not found' });
      return;
    }

    const newIncome = incomeRepository.create({ amount, description, receiver });
    await incomeRepository.save(newIncome);

    res.status(201).json({ message: 'Income added successfully', income: newIncome });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get all incomes
router.get('/', async (req, res) => {
  const incomeRepository = AppDataSource.getRepository(Income);

  try {
    const incomes = await incomeRepository.find({ relations: ['receiver'] });
    res.status(200).json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get a single income by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const incomeRepository = AppDataSource.getRepository(Income);

  try {
    const income = await incomeRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['receiver'],
    });

    if (!income) {
      res.status(404).json({ message: 'Income not found' });
      return;
    }

    res.status(200).json(income);
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE: Update an existing income
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, description, receiverId } = req.body;

  if (!amount || !description || !receiverId) {
    res.status(400).json({ message: 'Amount, description, and receiverId are required' });
    return;
  }

  const incomeRepository = AppDataSource.getRepository(Income);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const income = await incomeRepository.findOne({ where: { id: parseInt(id) } });
    if (!income) {
      res.status(404).json({ message: 'Income not found' });
      return;
    }

    const receiver = await userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) {
      res.status(404).json({ message: 'Receiver not found' });
      return;
    }

    income.amount = amount;
    income.description = description;
    income.receiver = receiver;

    await incomeRepository.save(income);

    res.status(200).json({ message: 'Income updated successfully', income });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Delete an income
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const incomeRepository = AppDataSource.getRepository(Income);

  try {
    const income = await incomeRepository.findOne({ where: { id: parseInt(id) } });
    if (!income) {
      res.status(404).json({ message: 'Income not found' });
      return;
    }

    await incomeRepository.remove(income);
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




export default router;