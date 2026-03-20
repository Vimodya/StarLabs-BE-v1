import express from 'express';
import {
  createTransaction,
  getUserTransactions,
  getUserStats,
  getAllTransactions,
  getStatistics,
  getTopInvestors
} from '../controllers/transactionController.js';

const router = express.Router();

// Create a new transaction
router.post('/transactions', createTransaction);

// Get all transactions (admin/public view)
router.get('/transactions', getAllTransactions);

// Get overall statistics
router.get('/statistics', getStatistics);

// Get top investors
router.get('/top-investors', getTopInvestors);

// Get transactions for a specific user by public key
router.get('/users/:publicKey/transactions', getUserTransactions);

// Get user stats (total invested, tokens, etc.)
router.get('/users/:publicKey/stats', getUserStats);

export default router;
