import { Request, Response } from 'express';
import { optimizeTransactionsService } from '../services/transactionService';
import {expensesTranslator} from '../utils/expensesTranslator';
import { validateBalances } from '../utils/validateBalances';

export const optimizeGroupTransactions = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;

  if (!groupId) {
    res.status(400).json({ error: 'groupId is required' });
    return;
  }
  try {
    const balances = await expensesTranslator(Number(groupId));

    const validationError = validateBalances(balances);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }
    const transactions = optimizeTransactionsService(balances);

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error optimizing group transactions:', error);
    res.status(500).json({ error: 'Internal Server Error: probably group no exist' });
  }
};
