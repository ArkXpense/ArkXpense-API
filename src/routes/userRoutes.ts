import { Router } from 'express';
import { AppDataSource } from '../database';
import { User } from '../entities/User';

const router = Router();

router.get('/', async (_req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find({ relations: ['groups'] });
  res.json(users);
});

export default router;
