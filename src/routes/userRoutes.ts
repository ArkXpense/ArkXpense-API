import { Router } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entities/User';

const router = Router();

// CREATE: Add a new user
router.post('/', async (req, res) => {
  const { walletAddress, email, nickname } = req.body;

  if (!walletAddress || !email) {
    res.status(400).json({ message: 'walletAddress and email are required' });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
    const newUser = userRepository.create({ walletAddress, email, nickname });
    await userRepository.save(newUser);

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get all users
router.get('/', async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);

  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['groups', 'expenses', 'incomes', 'guaranteedExpenses'],
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// READ: Get a user by walletAddress
router.get('/wallet/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { walletAddress },
      relations: ['groups', 'expenses', 'incomes', 'guaranteedExpenses'],
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE: Update an existing user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { walletAddress, email, nickname } = req.body;

  if (!walletAddress || !email) {
    res.status(400).json({ message: 'walletAddress and email are required' });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.walletAddress = walletAddress;
    user.email = email;
    user.nickname = nickname;

    await userRepository.save(user);

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await userRepository.remove(user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
