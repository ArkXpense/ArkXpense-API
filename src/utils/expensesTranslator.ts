import { AppDataSource } from '../database';
import { Expense } from '../entities/Expense';
import { User } from '../entities/User';

export async function expensesTranslator(groupId: number) {
  const expenseRepository = AppDataSource.getRepository(Expense);
  const userRepository = AppDataSource.getRepository(User);

  try {
  
    const expenses = await expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['user', 'guarantor'], 
    });

    if (!expenses || expenses.length === 0) {
      throw new Error('No expenses found for the group');
    }


    const balances: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      const debtor = expense.user; 
      const creditor = expense.guarantor; 


      if (!balances[debtor.id]) balances[debtor.id] = 0;
      if (!balances[creditor.id]) balances[creditor.id] = 0;


      balances[debtor.id] -= expense.amount; 
      balances[creditor.id] += expense.amount; 
    });

    const result = await Promise.all(
      Object.keys(balances).map(async (userId) => {
        const user = await userRepository.findOne({ where: { id: parseInt(userId) } });
        return {
            walletAddress: user?.walletAddress || `User ${userId}`,
          balance: balances[userId],
        };
      })
    );

    return result;
  } catch (error) {
    console.error('Error calculating group balances:', error);
    throw error;
  }
}