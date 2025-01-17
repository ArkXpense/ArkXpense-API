interface Balance {
  user: string;
  balance: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export const optimizeTransactionsService = (balances: Balance[]): { transactions: Transaction[]; savings: number } => {
  
  const initialDebts = balances.filter((b) => b.balance < 0).length;

  const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);

  const transactions: Transaction[] = [];

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    transactions.push({ from: debtor.user, to: creditor.user, amount });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) creditors.shift();
    if (debtor.balance === 0) debtors.shift();
  }  
  const finalTransactions = transactions.length;
  const savings = initialDebts - finalTransactions;
  return { transactions, savings };
};
