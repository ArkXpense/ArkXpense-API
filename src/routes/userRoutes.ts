import { Router } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entities/User';

const router = Router();

router.get('/', async (_req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find({ relations: ['groups'] });
  res.json(users);
});

router.get('/by-wallet/:walletAddress', async (req, res) => {
  const walletAddress = req.params.walletAddress;

  if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
    res.status(400).json({ message: 'Invalid wallet address' });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { walletAddress },
      relations: ['groups'],
    });

    if (!user) {
     res.status(404).json({ message: 'User not found' });
     return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
