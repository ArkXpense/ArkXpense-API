import { Router } from 'express';
import { AppDataSource } from '../database';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { Expense } from '../entities/Expense';
import { In } from 'typeorm';

const router = Router();

// CREATE: Add a new group
router.post('/', async (req, res) => {
  const { name, userIds } = req.body;

  if (!name || !userIds || !Array.isArray(userIds)) {
    res.status(400).json({ message: 'Name and userIds (array) are required' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Find users by their IDs
    const users = await userRepository.findBy({id: In(userIds)});
    if (users.length !== userIds.length) {
      res.status(404).json({ message: 'One or more users not found' });
      return;
    }

    // Create and save the group
    const newGroup = groupRepository.create({ name, users });
    await groupRepository.save(newGroup);

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get all groups
router.get('/', async (req, res) => {
  const groupRepository = AppDataSource.getRepository(Group);

  try {
    const groups = await groupRepository.find({ relations: ['users', 'expenses'] });
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get a single group by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const groupRepository = AppDataSource.getRepository(Group);

  try {
    const group = await groupRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['users', 'expenses'],
    });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE: Update an existing group
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, userIds } = req.body;

  if (!name || !userIds || !Array.isArray(userIds)) {
    res.status(400).json({ message: 'Name and userIds (array) are required' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);

  try {
    const group = await groupRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['users'],
    });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Find users by their IDs
    const users = await userRepository.findByIds(userIds);
    if (users.length !== userIds.length) {
      res.status(404).json({ message: 'One or more users not found' });
      return;
    }

    // Update group properties
    group.name = name;
    group.users = users;

    await groupRepository.save(group);

    res.status(200).json({ message: 'Group updated successfully', group });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Delete a group
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const groupRepository = AppDataSource.getRepository(Group);

  try {
    const group = await groupRepository.findOne({ where: { id: parseInt(id) } });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    await groupRepository.remove(group);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//ADD: Add users to a group (ARRAY)
router.post('/:groupId/add-users', async (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const { userIds } = req.body;

  if (isNaN(groupId)) {
    res.status(400).json({ message: 'Invalid groupId' });
    return;
  }

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ message: 'userIds (array) is required and must not be empty' });
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

    const users = await userRepository.findBy({ id: In(userIds) });
    if (users.length !== userIds.length) {
      res.status(404).json({ message: 'One or more users not found' });
      return;
    }

    const newUsers = users.filter((user) => 
      !group.users.some((existingUser) => existingUser.id === user.id)
    );

    if (newUsers.length === 0) {
      res.status(400).json({ message: 'All users are already in the group' });
      return;
    }

    group.users.push(...newUsers);
    await groupRepository.save(group);

    res.status(200).json({
      message: 'Users added to the group successfully',
      addedUsers: newUsers.map((user) => user.id),
      groupId: group.id,
    });
  } catch (error) {
    console.error('Error adding users to group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//DELETE: Remove user from a group
router.delete('/groups/:groupId/removeUser/:userId', async (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(groupId) || isNaN(userId)) {
    res.status(400).json({ message: 'Invalid groupId or userId' });
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

    const userIndex = group.users.findIndex((existingUser) => existingUser.id === user.id);
    if (userIndex === -1) {
      res.status(400).json({ message: 'User is not in the group' });
      return;
    }

    group.users.splice(userIndex, 1);
    await groupRepository.save(group);

    res.status(200).json({
      message: 'User removed from the group successfully',
      userId: user.id,
      groupId: group.id,
    });
  } catch (error) {
    console.error('Error removing user from group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//ADD: Add an expense to a group
router.post('/groups/:groupId/add-expense', async (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const { description, amount, userId } = req.body;

  if (isNaN(groupId)) {
    res.status(400).json({ message: 'Invalid groupId' });
    return;
  }

  if (!description || !amount || !userId) {
    res.status(400).json({ message: 'Description, amount, and userId are required' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const userRepository = AppDataSource.getRepository(User);
  const expenseRepository = AppDataSource.getRepository(Expense);

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

    res.status(201).json({
      message: 'Expense added to the group successfully',
      expense: newExpense,
    });
  } catch (error) {
    console.error('Error adding expense to group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//DELETE: Remove an expense from a group
router.delete('/groups/:groupId/removeGroup/:expenseId', async (req, res) => {
  const groupId = parseInt(req.params.groupId, 10);
  const expenseId = parseInt(req.params.expenseId, 10);

  if (isNaN(groupId) || isNaN(expenseId)) {
    res.status(400).json({ message: 'Invalid groupId or expenseId' });
    return;
  }

  const groupRepository = AppDataSource.getRepository(Group);
  const expenseRepository = AppDataSource.getRepository(Expense);

  try {
    const group = await groupRepository.findOne({ where: { id: groupId } });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const expense = await expenseRepository.findOne({
      where: { id: expenseId, group: { id: groupId } },
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found in the group' });
      return;
    }

    await expenseRepository.remove(expense);

    res.status(200).json({
      message: 'Expense removed from the group successfully',
      expenseId: expense.id,
      groupId: group.id,
    });
  } catch (error) {
    console.error('Error removing expense from group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
