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

export default router;
