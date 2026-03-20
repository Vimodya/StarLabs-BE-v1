import { db } from '../config/database.js';

class User {
  static findByPublicKey(publicKey) {
    const stmt = db.prepare('SELECT * FROM users WHERE public_key = ?');
    return stmt.get(publicKey);
  }

  static create(publicKey) {
    const stmt = db.prepare(`
      INSERT INTO users (public_key)
      VALUES (?)
      RETURNING *
    `);
    return stmt.get(publicKey);
  }

  static findOrCreate(publicKey) {
    let user = this.findByPublicKey(publicKey);
    if (!user) {
      user = this.create(publicKey);
    }
    return user;
  }

  static updateInvestmentTotals(userId, solAmount = 0, usdtAmount = 0, tokensAmount = 0) {
    const stmt = db.prepare(`
      UPDATE users
      SET total_sol_invested = total_sol_invested + ?,
          total_usdt_invested = total_usdt_invested + ?,
          total_tokens = total_tokens + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(solAmount, usdtAmount, tokensAmount, userId);
  }

  static getStats(userId) {
    const stmt = db.prepare(`
      SELECT
        u.public_key,
        u.total_tokens,
        u.total_sol_invested,
        u.total_usdt_invested,
        COUNT(t.id) as transaction_count,
        u.created_at as member_since
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `);
    return stmt.get(userId);
  }

  static getTopInvestors(limit = 10) {
    const stmt = db.prepare(`
      SELECT
        u.public_key,
        u.total_tokens,
        u.total_sol_invested,
        u.total_usdt_invested,
        (u.total_sol_invested + u.total_usdt_invested) as total_invested,
        COUNT(t.id) as transaction_count
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id
      ORDER BY total_invested DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }
}

export default User;
