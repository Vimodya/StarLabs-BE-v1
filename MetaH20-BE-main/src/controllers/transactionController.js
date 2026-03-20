import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const createTransaction = async (req, res) => {
  try {
    const { publicKey, transactionHash, paymentCurrency, amountPaid, tokensReceived, exchangeRate } = req.body;

    // Validate required fields
    if (!publicKey || !transactionHash || !paymentCurrency || !amountPaid || !tokensReceived || !exchangeRate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if transaction already exists
    const existingTx = Transaction.findByHash(transactionHash);
    if (existingTx) {
      return res.status(409).json({
        success: false,
        error: 'Transaction already recorded'
      });
    }

    // Find or create user
    const user = User.findOrCreate(publicKey);

    // Create transaction
    const transaction = Transaction.create({
      userId: user.id,
      transactionHash,
      paymentCurrency,
      amountPaid,
      tokensReceived,
      exchangeRate,
      status: 'completed'
    });

    // Update user investment totals
    const solAmount = paymentCurrency === 'SOL' ? amountPaid : 0;
    const usdtAmount = paymentCurrency === 'USDT' ? amountPaid : 0;
    User.updateInvestmentTotals(user.id, solAmount, usdtAmount, tokensReceived);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { publicKey } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const user = User.findByPublicKey(publicKey);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const transactions = Transaction.findByUserId(user.id, limit, offset);

    res.json({
      success: true,
      data: {
        publicKey: user.public_key,
        transactions,
        count: transactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { publicKey } = req.params;

    const user = User.findByPublicKey(publicKey);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const stats = User.getStats(user.id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats'
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = Transaction.getAll(limit, offset);

    res.json({
      success: true,
      data: {
        transactions,
        count: transactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const stats = Transaction.getStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

export const getTopInvestors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topInvestors = User.getTopInvestors(limit);

    res.json({
      success: true,
      data: topInvestors
    });
  } catch (error) {
    console.error('Error fetching top investors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top investors'
    });
  }
};
