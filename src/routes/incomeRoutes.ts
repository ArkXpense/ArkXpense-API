import { Router } from 'express';
import { AppDataSource } from '../database'; 
import { Income } from '../entities/Income'; 
import { User } from '../entities/User';

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

router.post('/generate', async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount || !description) {
    res.status(400).json({ message: 'userId, amount, and description are required' });
    return;
  }

  const incomeRepository = AppDataSource.getRepository(Income);
  const userRepository = AppDataSource.getRepository(User);

  try {

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }


    const newIncome = incomeRepository.create({
      amount,
      description,
      receiver: user, 
    });

    await incomeRepository.save(newIncome);

    res.status(201).json({ message: 'Income generated successfully', income: newIncome });
  } catch (error) {
    console.error('Error generating income:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;