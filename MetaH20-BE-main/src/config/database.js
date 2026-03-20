import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/hydra-ico.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
const initializeDatabase = () => {
  // Users table (identified by Solana public key)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_key TEXT UNIQUE NOT NULL,
      total_tokens REAL DEFAULT 0,
      total_sol_invested REAL DEFAULT 0,
      total_usdt_invested REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      transaction_hash TEXT UNIQUE NOT NULL,
      payment_currency TEXT NOT NULL CHECK(payment_currency IN ('SOL', 'USDT')),
      amount_paid REAL NOT NULL,
      tokens_received REAL NOT NULL,
      exchange_rate REAL NOT NULL,
      status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_public_key ON users(public_key);
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
    CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
  `);

  console.log('Database initialized successfully');
};

export { db, initializeDatabase };
