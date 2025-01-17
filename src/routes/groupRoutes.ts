import { Router } from 'express';
import { AppDataSource } from '../database';
import { Group } from '../entities/Group';

const router = Router();

router.get('/', async (_req, res) => {
  const groupRepository = AppDataSource.getRepository(Group);
  const groups = await groupRepository.find({ relations: ['users', 'expenses'] });
  res.json(groups);
});

export default router;
