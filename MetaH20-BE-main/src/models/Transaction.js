import { db } from '../config/database.js';

class Transaction {
  static create(data) {
    const { userId, transactionHash, paymentCurrency, amountPaid, tokensReceived, exchangeRate, status = 'completed' } = data;

    const stmt = db.prepare(`
      INSERT INTO transactions (
        user_id, transaction_hash, payment_currency,
        amount_paid, tokens_received, exchange_rate, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `);

    return stmt.get(
      userId,
      transactionHash,
      paymentCurrency,
      amountPaid,
      tokensReceived,
      exchangeRate,
      status
    );
  }

  static findByHash(transactionHash) {
    const stmt = db.prepare('SELECT * FROM transactions WHERE transaction_hash = ?');
    return stmt.get(transactionHash);
  }

  static findByUserId(userId, limit = 50, offset = 0) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(userId, limit, offset);
  }

  static getAll(limit = 100, offset = 0) {
    const stmt = db.prepare(`
      SELECT
        t.*,
        u.public_key
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset);
  }

  static updateStatus(transactionHash, status) {
    const stmt = db.prepare(`
      UPDATE transactions
      SET status = ?
      WHERE transaction_hash = ?
    `);
    return stmt.run(status, transactionHash);
  }

  static getStatistics() {
    const stmt = db.prepare(`
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN payment_currency = 'SOL' THEN amount_paid ELSE 0 END) as total_sol_raised,
        SUM(CASE WHEN payment_currency = 'USDT' THEN amount_paid ELSE 0 END) as total_usdt_raised,
        SUM(tokens_received) as total_tokens_sold,
        COUNT(DISTINCT user_id) as unique_investors
      FROM transactions
      WHERE status = 'completed'
    `);
    return stmt.get();
  }
}

export default Transaction;
