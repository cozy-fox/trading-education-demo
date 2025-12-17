# Trading Education Platform - Complete Function Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Functions](#frontend-functions)
4. [Backend Functions](#backend-functions)
5. [Key Features](#key-features)
6. [User Workflows](#user-workflows)

---

## 🎯 Project Overview

This is a **Trading Education Platform** designed to help users learn trading without financial risk. It provides:
- **Virtual Trading Environment**: Practice with $10,000 virtual balance
- **Real-time Market Data**: Live price updates for stocks and cryptocurrencies
- **Multi-language Support**: English, Spanish, Chinese, and French
- **Educational Focus**: Safe learning environment for beginners and experienced traders

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (via Mongoose)
- **Real-time Data**: Finnhub API for market data
- **State Management**: Zustand
- **Internationalization**: next-intl

### Project Structure
```
website/
├── frontend/          # Next.js application
│   ├── app/          # Pages and layouts
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities and helpers
│   └── messages/     # Translation files
└── backend/          # Express API server
    └── src/
        ├── controllers/  # Request handlers
        ├── models/       # Database schemas
        ├── routes/       # API endpoints
        └── middleware/   # Auth & validation
```

---

## 🎨 Frontend Functions

### 1. **Authentication System**

#### Login (`frontend/app/login/page.tsx`)
**Purpose**: Authenticate existing users
**Functions**:
- `handleSubmit()`: Validates credentials and logs user in
- Stores JWT token in local storage
- Redirects to dashboard on success
- Shows error messages for invalid credentials

**User Flow**:
1. User enters email and password
2. Form validates input
3. API call to `/api/auth/login`
4. Token stored, user redirected to dashboard

#### Register (`frontend/app/register/page.tsx`)
**Purpose**: Create new user accounts
**Functions**:
- `handleSubmit()`: Creates new user account
- Validates password match and length (min 6 characters)
- Automatically logs in after registration
- Provides $10,000 starting virtual balance

**User Flow**:
1. User fills in: First Name, Last Name, Email, Password
2. Password confirmation validation
3. API call to `/api/auth/register`
4. Auto-login and redirect to dashboard

### 2. **Dashboard System** (`frontend/app/dashboard/page.tsx`)

**Purpose**: Main trading interface
**Components**:
- **Navbar**: User info, balance, language switcher, logout
- **AssetList**: Browse available trading assets
- **TradingChart**: Real-time price charts
- **TradingPanel**: Execute buy/sell orders
- **Portfolio**: View current holdings
- **TradeHistory**: Past transactions

### 3. **Trading Components**

#### TradingPanel (`frontend/components/TradingPanel.tsx`)
**Purpose**: Execute trades
**Functions**:
- `handleBuy()`: Purchase assets
  - Validates sufficient balance
  - Calculates total cost (quantity × price)
  - Updates portfolio and balance
  - Records transaction
  
- `handleSell()`: Sell assets
  - Validates sufficient holdings
  - Calculates proceeds
  - Updates portfolio and balance
  - Records transaction

**Validation**:
- Minimum quantity: 0.01
- Balance check before buying
- Holdings check before selling

#### Portfolio (`frontend/components/Portfolio.tsx`)
**Purpose**: Display user's holdings
**Functions**:
- `fetchPortfolio()`: Loads user's assets
- Real-time P&L calculation
- Color-coded gains/losses (green/red)
- Total portfolio value display

#### TradeHistory (`frontend/components/TradeHistory.tsx`)
**Purpose**: Show transaction history
**Functions**:
- `fetchTrades()`: Loads past trades
- Displays: Type (BUY/SELL), Asset, Quantity, Price, Date
- Color-coded by transaction type
- Sorted by most recent first

### 4. **Market Data Components**

#### AssetList (`frontend/components/AssetList.tsx`)
**Purpose**: Browse available assets
**Functions**:
- `fetchAssets()`: Loads asset list from backend
- `handleAssetClick()`: Selects asset for trading
- Real-time price updates
- Search/filter functionality

#### TradingChart (`frontend/components/TradingChart.tsx`)
**Purpose**: Visualize price data
**Functions**:
- `fetchChartData()`: Loads historical prices
- Interactive chart with zoom/pan
- Multiple timeframes (1D, 1W, 1M, 1Y)
- Real-time price updates

### 5. **Internationalization**

#### LanguageSwitcher (`frontend/components/LanguageSwitcher.tsx`)
**Purpose**: Change application language
**Supported Languages**:
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇨🇳 Chinese (zh)
- 🇫🇷 French (fr)

**Functions**:
- `handleLanguageChange()`: Switches language
- Stores preference in localStorage
- Reloads page to apply changes

### 6. **State Management** (`frontend/lib/store.ts`)

**Purpose**: Global application state
**Zustand Store**:
```typescript
{
  user: User | null,           // Current user data
  token: string | null,        // JWT authentication token
  selectedAsset: Asset | null, // Currently selected trading asset
  setUser(),                   // Update user data
  setToken(),                  // Store auth token
  logout(),                    // Clear session
  setSelectedAsset()           // Select asset for trading
}
```

### 7. **Utility Functions** (`frontend/lib/utils.ts`)

**Purpose**: Helper functions for formatting
**Functions**:
- `formatCurrency(value)`: Formats numbers as USD ($1,234.56)
- `formatNumber(value)`: Formats with decimals (1,234.56)
- `formatPercentage(value)`: Formats as percentage (+12.34%)
- `formatDate(date)`: Formats timestamps
- `getPriceColor(change)`: Returns green/red based on price change
- `cn()`: Merges Tailwind CSS classes

---

## 🔧 Backend Functions

### 1. **Authentication** (`backend/src/controllers/authController.ts`)

#### Register
**Endpoint**: `POST /api/auth/register`
**Purpose**: Create new user account
**Process**:
1. Validates email uniqueness
2. Hashes password with bcrypt
3. Creates user with $10,000 demo balance
4. Generates JWT token
5. Returns user data and token

#### Login
**Endpoint**: `POST /api/auth/login`
**Purpose**: Authenticate user
**Process**:
1. Finds user by email
2. Compares password hash
3. Generates JWT token
4. Returns user data and token

#### Reset Balance
**Endpoint**: `POST /api/auth/reset-balance`
**Purpose**: Reset demo balance to $10,000
**Authentication**: Required (JWT)

### 2. **Trading** (`backend/src/controllers/tradeController.ts`)

#### Execute Trade
**Endpoint**: `POST /api/trades`
**Purpose**: Buy or sell assets
**Process**:
1. Validates user authentication
2. Checks balance (for buy) or holdings (for sell)
3. Updates user balance
4. Creates/updates portfolio entry
5. Records trade in history
6. Returns updated data

**Validation**:
- Sufficient balance for purchases
- Sufficient holdings for sales
- Positive quantity
- Valid asset symbol

#### Get Trade History
**Endpoint**: `GET /api/trades`
**Purpose**: Retrieve user's trade history
**Returns**: Array of trades sorted by date (newest first)

### 3. **Portfolio** (`backend/src/controllers/portfolioController.ts`)

#### Get Portfolio
**Endpoint**: `GET /api/portfolio`
**Purpose**: Retrieve user's holdings
**Returns**: Array of assets with:
- Symbol
- Quantity owned
- Average purchase price
- Current value
- Profit/Loss

### 4. **Market Data** (`backend/src/controllers/marketController.ts`)

#### Get Assets
**Endpoint**: `GET /api/market/assets`
**Purpose**: List available trading assets
**Returns**: Predefined list of stocks and cryptocurrencies

#### Get Quote
**Endpoint**: `GET /api/market/quote/:symbol`
**Purpose**: Get real-time price for asset
**Integration**: Finnhub API
**Returns**: Current price, change, change percentage

#### Get Chart Data
**Endpoint**: `GET /api/market/chart/:symbol`
**Purpose**: Historical price data for charts
**Parameters**: timeframe (1D, 1W, 1M, 1Y)
**Returns**: Array of price points with timestamps

### 5. **Middleware**

#### Authentication (`backend/src/middleware/auth.ts`)
**Purpose**: Protect routes requiring login
**Process**:
1. Extracts JWT from Authorization header
2. Verifies token signature
3. Decodes user ID
4. Attaches user to request object
5. Allows request to proceed or returns 401

---

## 🌟 Key Features

### 1. **Risk-Free Learning**
- No real money involved
- $10,000 virtual starting balance
- Unlimited resets
- Safe environment for experimentation

### 2. **Real Market Data**
- Live price updates via Finnhub API
- Real-time charts
- Actual market movements
- 100+ trading assets

### 3. **Complete Trading Experience**
- Buy and sell assets
- Portfolio management
- Trade history tracking
- Profit/Loss calculations

### 4. **Educational Focus**
- Beginner-friendly interface
- Clear visual feedback
- Transaction confirmations
- Error prevention

### 5. **Multi-language Support**
- 4 languages supported
- Easy language switching
- Persistent language preference
- Full UI translation

### 6. **Professional UI/UX**
- Dark mode optimized
- Responsive design (mobile, tablet, desktop)
- Glass morphism effects
- Smooth animations
- Accessible components

---

## 👤 User Workflows

### New User Journey
1. **Landing Page** → View features and benefits
2. **Register** → Create account (get $10,000)
3. **Dashboard** → See trading interface
4. **Browse Assets** → Select stock/crypto
5. **Execute Trade** → Buy asset
6. **View Portfolio** → See holdings
7. **Check History** → Review trades

### Trading Workflow
1. **Select Asset** → Click from asset list
2. **View Chart** → Analyze price movement
3. **Enter Quantity** → Specify amount
4. **Execute** → Click Buy/Sell
5. **Confirmation** → See success message
6. **Updated Balance** → View new balance
7. **Portfolio Update** → See new holdings

### Learning Workflow
1. **Start with $10,000** → No risk
2. **Practice Trading** → Buy/sell freely
3. **Track Performance** → Monitor P&L
4. **Learn from Mistakes** → Reset if needed
5. **Build Confidence** → Improve skills
6. **Test Strategies** → Experiment safely

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Protected Routes**: Middleware validation
4. **Input Validation**: Server-side checks
5. **Error Handling**: Graceful error messages

---

## 📊 Data Flow

### Trade Execution Flow
```
User Input → Frontend Validation → API Request → 
Backend Validation → Database Update → Response → 
UI Update → Success Message
```

### Real-time Price Updates
```
Component Mount → Fetch Initial Price → 
Set Interval (5s) → API Call → Update State → 
Re-render → Repeat
```

---

## 🎓 Educational Value

This platform teaches:
- **Trading Basics**: Buy low, sell high
- **Portfolio Management**: Diversification
- **Risk Assessment**: Position sizing
- **Market Analysis**: Chart reading
- **Emotional Control**: Practice without fear
- **Strategy Testing**: Try different approaches

---

**Last Updated**: December 2024
**Version**: 1.0.0

