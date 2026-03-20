# HydraICO Backend API

Backend API for the HydraICO token sale platform. Tracks user transactions, investments, and provides statistics for the ICO.

## Features

- User identification via Solana wallet public keys
- Transaction recording and tracking
- Support for SOL and USDT payments
- User investment statistics
- Global ICO statistics
- SQLite database for easy deployment
- Rate limiting and security middleware
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **Joi** - Request validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev

# Or start production server
npm start
```

## Database Schema

### Users Table
```sql
- id: INTEGER PRIMARY KEY
- public_key: TEXT UNIQUE (Solana wallet public key)
- total_tokens: REAL
- total_sol_invested: REAL
- total_usdt_invested: REAL
- created_at: DATETIME
- updated_at: DATETIME
```

### Transactions Table
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK to users)
- transaction_hash: TEXT UNIQUE
- payment_currency: TEXT (SOL or USDT)
- amount_paid: REAL
- tokens_received: REAL
- exchange_rate: REAL
- status: TEXT (pending, completed, failed)
- created_at: DATETIME
```

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status and uptime.

### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "transactionHash": "5KJp8F3vK2h9N4mPqL7...",
  "paymentCurrency": "USDT",
  "amountPaid": 100,
  "tokensReceived": 2000,
  "exchangeRate": 20
}
```
Records a new transaction for a user.

### Get User Transactions
```http
GET /api/users/:publicKey/transactions?limit=50&offset=0
```
Retrieves all transactions for a specific user.

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 50)
- `offset` (optional): Number of transactions to skip (default: 0)

### Get User Statistics
```http
GET /api/users/:publicKey/stats
```
Returns investment statistics for a specific user.

**Response:**
```json
{
  "success": true,
  "data": {
    "public_key": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "total_tokens": 15000,
    "total_sol_invested": 0,
    "total_usdt_invested": 750,
    "transaction_count": 2,
    "member_since": "2024-11-15 14:32:15"
  }
}
```

### Get All Transactions
```http
GET /api/transactions?limit=100&offset=0
```
Retrieves all transactions (with user public keys).

### Get ICO Statistics
```http
GET /api/statistics
```
Returns overall ICO statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_transactions": 150,
    "total_sol_raised": 0,
    "total_usdt_raised": 3250000,
    "total_tokens_sold": 65000000,
    "unique_investors": 87
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate transaction)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Security

- **Helmet**: Sets security-related HTTP headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured allowed origins
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Prepared statements

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests (when implemented)
npm test
```

## Environment Variables

See `.env.example` for all available configuration options.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:8080,localhost:80 |

## Project Structure

```
hydra-ico-backend/
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── validation.js     # Request validation
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   └── transactionRoutes.js
│   └── index.js              # Main server file
├── data/
│   └── hydra-ico.db          # SQLite database
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
