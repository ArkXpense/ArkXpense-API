import { Router } from 'express';
import { AppDataSource } from '../database'; 
import { Income } from '../entities/Income'; 

const router = Router();


router.get('/', async (_req, res) => {
  const incomeRepository = AppDataSource.getRepository(Income);

  try {

    const incomes = await incomeRepository.find({ relations: ['receiver'] });


    res.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;