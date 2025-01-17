import { Router } from 'express';
import { optimizeTransactions } from '../controllers/transactionController';

const router = Router();

// Endpoint  for the transactions algorithm
router.post('/optimize', optimizeTransactions);

export default router;

/*

curl -X POST http://localhost:3000/transactions/optimize \
-H "Content-Type: application/json" \
-d '[
  { "user": "Alice", "balance": -40 },
  { "user": "Bob", "balance": 30 },
  { "user": "Charlie", "balance": 50 },
  { "user": "Diana", "balance": -10 },
  { "user": "Eve", "balance": -30 }
]'

*/