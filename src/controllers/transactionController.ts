import { Request, Response } from 'express';
import { optimizeTransactionsService } from '../services/transactionService';
import { validateBalances } from '../utils/validateBalances';

export const optimizeTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const balances = req.body;
    const validationError = validateBalances(balances);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }
    const transactions = optimizeTransactionsService(balances);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error optimizing transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
