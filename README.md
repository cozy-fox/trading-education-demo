# Trading Education & Demo Platform

A comprehensive web-based trading simulator that allows users to learn trading through demo (virtual) accounts using real-time market data without involving real money.

## Features

- 🔐 Secure user authentication with JWT
- 💰 Virtual demo accounts with $10,000 starting balance
- 📊 Real-time market data integration (Binance API)
- 📈 Interactive TradingView charts
- 💼 Portfolio management with PnL tracking
- 📱 Responsive design (mobile & desktop)
- 🌙 Dark mode support
- 🌐 Multi-language support (English, Spanish, Chinese, French)
- 🎓 Educational tutorials and walkthroughs
- 🏆 Leaderboard for top demo traders
- ⚙️ Admin panel for user and asset management

## Tech Stack

- **Next.js 14** (React with App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MongoDB with Mongoose** for database
- **JWT Authentication** for secure auth
- **bcryptjs** for password hashing
- **next-intl** for internationalization
- **Zustand** for state management
- **TradingView Widget** for charts

## Project Structure

```
trading-education-platform/
├── frontend/                    # Next.js application
│   ├── app/                     # App Router pages
│   │   ├── api/                 # API routes (backend)
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── trading/         # Trading endpoints
│   │   │   ├── market/          # Market data endpoints
│   │   │   └── admin/           # Admin endpoints
│   │   ├── dashboard/           # Dashboard page
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   └── admin/               # Admin panel
│   ├── components/              # React components
│   ├── lib/                     # Utilities and services
│   │   ├── db/                  # Database models and connection
│   │   │   ├── mongodb.ts       # MongoDB connection
│   │   │   └── models/          # Mongoose models
│   │   ├── services/            # Business logic services
│   │   ├── auth.ts              # JWT authentication
│   │   └── api.ts               # API client
│   └── messages/                # i18n translations
└── package.json                 # Root package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
cd frontend && npm install
```

3. Set up environment variables:
```bash
cp frontend/.env.local.example frontend/.env.local
# Edit .env.local with your settings
```

4. Run the development server:
```bash
npm run dev
```

Application: http://localhost:3000

## Environment Variables

### frontend/.env.local
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/trading-platform

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Demo Starting Balance
DEMO_STARTING_BALANCE=10000

# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/reset-balance` - Reset demo balance

### Trading
- `POST /api/trading/execute` - Execute a trade
- `GET /api/trading/open` - Get open trades
- `GET /api/trading/history` - Get trade history
- `POST /api/trading/close/[tradeId]` - Close a trade
- `GET /api/trading/portfolio` - Get portfolio

### Market
- `GET /api/market/assets` - Get all assets
- `GET /api/market/assets/[symbol]` - Get asset by symbol
- `POST /api/market/update-prices` - Update market prices

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/[userId]` - Get user by ID
- `DELETE /api/admin/users/[userId]` - Delete user
- `POST /api/admin/users/[userId]/reset-balance` - Reset user balance
- `GET /api/admin/trades` - Get all trades
- `POST /api/admin/assets` - Create/update asset
- `DELETE /api/admin/assets/[symbol]` - Deactivate asset
- `GET /api/admin/stats` - Get platform statistics

## License

MIT

