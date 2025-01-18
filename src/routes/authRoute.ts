import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entities/User';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    res.status(400).json({ message: 'Wallet address is required.' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { walletAddress } });

    if (!user) {
      res.status(400).json({ message: 'User not found' });
    }else{
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          walletAddress: user.walletAddress
        }
      });;
   }
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/register', async (req, res) => {
  const { walletAddress, email } = req.body;

  if (!walletAddress || !email) {
    res.status(400).json({ message: 'Wallet address and email are required' });
  }

  const userRepository = AppDataSource.getRepository(User);

  try {
   
    const existingUser = await userRepository.findOne({ where: { walletAddress } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
    }


    const newUser = userRepository.create({ walletAddress, email });
    await userRepository.save(newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
