interface Balance {
    user: string;
    balance: number;
  }
  
  export const validateBalances = (balances: Balance[]): string | null => {
    if (!Array.isArray(balances)) {
      return 'Balances must be an array.';
    }
  
    for (const balance of balances) {
      if (typeof balance.user !== 'string' || typeof balance.balance !== 'number') {
        return 'Each balance must have a "user" (string) and "balance" (number).';
      }
    }
  
    const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);
    if (Math.abs(totalBalance) > 1e-10) {     //floating point tolerance
      return 'The total balance must be zero.';
    }
  
    return null;
  };
  