# Trading Education Platform - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## Installation Steps

### 1. Install Dependencies

Open PowerShell or Command Prompt and navigate to the project directory:

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 2. Setup Environment Variables

#### Backend Environment (.env)

Create a `.env` file in the `backend` folder:

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trading-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Optional API Keys for Market Data
BINANCE_API_KEY=
BINANCE_API_SECRET=
ALPHA_VANTAGE_API_KEY=

# Demo Settings
DEMO_STARTING_BALANCE=10000
```

#### Frontend Environment (.env.local)

Create a `.env.local` file in the `frontend` folder:

```bash
cd ../frontend
copy .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEMO_MODE=true
```

### 3. Setup MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```powershell
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env` with your Atlas connection string

### 4. Run the Application

#### Development Mode (Both Frontend & Backend)

From the root directory:

```powershell
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Run Separately

**Backend only:**
```powershell
cd backend
npm run dev
```

**Frontend only:**
```powershell
cd frontend
npm run dev
```

### 5. Create Admin User (Optional)

To create an admin user, you can:

1. Register a normal user through the UI
2. Connect to MongoDB and update the user:

```javascript
// Using MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Testing the Application

1. Open your browser and navigate to http://localhost:3000
2. Click "Register" to create a new account
3. You'll receive $10,000 demo balance automatically
4. Start trading!

## Features to Test

- ✅ User registration and login
- ✅ View real-time market data
- ✅ Execute BUY/SELL trades
- ✅ View portfolio with P/L tracking
- ✅ View trade history
- ✅ Close open trades
- ✅ Reset demo balance
- ✅ Admin panel (if admin user)

## Troubleshooting

### PowerShell Script Execution Error

If you get a script execution error, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MongoDB Connection Error

- Ensure MongoDB is running
- Check the connection string in `backend/.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use

If port 3000 or 5000 is already in use:

1. Change the port in the respective config files
2. Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Dependencies Installation Issues

Try clearing npm cache:

```powershell
npm cache clean --force
```

Then reinstall dependencies.

## Production Deployment

### Backend

1. Build the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. Set `NODE_ENV=production` in `.env`

### Frontend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. Update `NEXT_PUBLIC_API_URL` to your production API URL

### Recommended Hosting

- **Frontend**: Vercel, Netlify
- **Backend**: AWS EC2, DigitalOcean, Heroku
- **Database**: MongoDB Atlas

## Support

For issues or questions, please check:
- MongoDB connection is active
- All environment variables are set correctly
- Node.js version is 18 or higher
- All dependencies are installed

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random string
2. Enable HTTPS
3. Set up proper CORS origins
4. Use environment variables for all sensitive data
5. Enable MongoDB authentication
6. Set up rate limiting (already configured)
7. Regular security updates

## Next Steps

- Customize the starting balance
- Add more assets to trade
- Implement additional features from the SRS
- Set up automated tests
- Configure CI/CD pipeline

Happy Trading! 🚀

