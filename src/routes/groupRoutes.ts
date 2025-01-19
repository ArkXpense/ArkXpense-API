import { Router } from 'express';
import { AppDataSource } from '../database';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { In } from 'typeorm';

const router = Router();

router.get('/', async (_req, res) => {
  const groupRepository = AppDataSource.getRepository(Group);
  try {
    const groups = await groupRepository.find({ relations: ['users', 'expenses'] });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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

router.post('/:groupId/add-user', async (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const { userId } = req.body;

  if (isNaN(groupId)) {
    res.status(400).json({ message: 'Invalid groupId' });
    return;
  }

  if (!userId) {
    res.status(400).json({ message: 'UserId is required' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (group.users.some((existingUser) => existingUser.id === user.id)) {
      res.status(400).json({ message: 'User is already in the group' });
      return;
    }

    group.users.push(user);
    await groupRepository.save(group);

    res.status(200).json({ message: 'User added to the group successfully', group });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
