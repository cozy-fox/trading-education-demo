# Trading Education & Demo Platform

A comprehensive web-based trading simulator that allows users to learn trading through demo (virtual) accounts using real-time market data without involving real money.

## Features

- 🔐 Secure user authentication with JWT
- 💰 Virtual demo accounts with $10,000 starting balance
- 📊 Real-time market data integration (Binance, AlphaVantage)
- 📈 Interactive TradingView charts
- 💼 Portfolio management with PnL tracking
- 📱 Responsive design (mobile & desktop)
- 🌙 Dark mode support
- 🎓 Educational tutorials and walkthroughs
- 🏆 Leaderboard for top demo traders
- ⚙️ Admin panel for user and asset management

## Tech Stack

### Frontend
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- TradingView Widget
- Chart.js

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
trading-education-platform/
├── frontend/          # Next.js frontend application
├── backend/           # Express backend API
└── package.json       # Root package.json for running both
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
npm run install:all
```

3. Set up environment variables (see .env.example in frontend and backend folders)

4. Run the development servers:
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEMO_MODE=true
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trading-platform
JWT_SECRET=your-secret-key
NODE_ENV=development
BINANCE_API_KEY=your-binance-key (optional)
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key (optional)
```

## License

MIT

