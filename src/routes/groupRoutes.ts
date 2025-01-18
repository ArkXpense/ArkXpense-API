import { Router } from 'express';
import { AppDataSource } from '../database';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { Expense } from '../entities/Expense';
import { In } from 'typeorm';

const router = Router();

router.get('/', async (_req, res) => {
  const groupRepository = AppDataSource.getRepository(Group);
  const groups = await groupRepository.find({ relations: ['users', 'expenses'] });
  res.json(groups);
});

router.post('/create', async (req, res) => {
  const { name, userIds } = req.body;

  if (!name || !userIds || !Array.isArray(userIds)) {
    res.status(400).json({ message: 'Name and userIds are required, and userIds must be an array' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const users = await userRepository.findBy({ id: In(userIds) });

    if (users.length !== userIds.length) {
      res.status(400).json({ message: 'One or more users not found' });
      return;
    }

    const newGroup = groupRepository.create({ name, users });
    await groupRepository.save(newGroup);

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
