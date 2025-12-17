# Quick Start Guide 🚀

Get the Trading Education Platform running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js v18 or higher installed
- ✅ MongoDB installed (local) OR MongoDB Atlas account (cloud)
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/PowerShell access

## Step 1: Install Dependencies (Already Done!)

The installation script has already been run. All dependencies are installed:
- ✅ Root dependencies
- ✅ Frontend dependencies (Next.js, React, Tailwind, etc.)
- ✅ Backend dependencies (Express, MongoDB, JWT, etc.)

## Step 2: Configure MongoDB

### Option A: Local MongoDB (Recommended for Development)

1. **Check if MongoDB is installed:**
   ```powershell
   mongod --version
   ```

2. **Start MongoDB service:**
   ```powershell
   # Windows
   net start MongoDB
   
   # Or if MongoDB is not installed as a service:
   mongod --dbpath C:\data\db
   ```

3. **Verify connection:**
   The backend `.env` file is already configured with:
   ```
   MONGODB_URI=mongodb://localhost:27017/trading-platform
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create account:** https://www.mongodb.com/cloud/atlas/register

2. **Create a free cluster** (M0 Sandbox - FREE)

3. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trading-platform?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your credentials.

5. **Whitelist your IP:**
   - In Atlas, go to Network Access
   - Add your current IP address (or 0.0.0.0/0 for development)

## Step 3: Start the Application

Open PowerShell in the project root directory and run:

```powershell
npm run dev
```

This will start both:
- 🎨 **Frontend** at http://localhost:3000
- 🔧 **Backend** at http://localhost:5000

You should see output like:
```
[frontend] ▲ Next.js 14.2.0
[frontend] - Local: http://localhost:3000
[backend] Server running on port 5000
[backend] MongoDB connected successfully
[backend] Market data initialized
```

## Step 4: Create Your First Account

1. **Open your browser:** http://localhost:3000

2. **Click "Register"** or go to http://localhost:3000/register

3. **Fill in the form:**
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123

4. **Click "Create Account"**

5. **You're in!** You'll be automatically logged in with $10,000 demo balance

## Step 5: Start Trading!

1. **Select an asset** from the left sidebar (e.g., BTC, ETH, AAPL)

2. **View the chart** - TradingView chart will load automatically

3. **Place a trade:**
   - Click "BUY" or "SELL"
   - Enter quantity (e.g., 0.1 for BTC)
   - Click "BUY [SYMBOL]"

4. **Watch your portfolio** update in real-time!

5. **View your trades** in the Trade History section

## Step 6: Explore Features

### Reset Your Balance
- Click the refresh icon (🔄) in the navbar
- Your balance resets to $10,000

### View Portfolio
- See all your holdings
- Real-time P/L calculations
- Total portfolio value

### Close Trades
- Go to Trade History
- Click "Open" tab
- Click the X button to close a trade

### Admin Panel (Optional)
To access admin features:

1. **Connect to MongoDB:**
   ```powershell
   # If using local MongoDB
   mongosh
   
   # Switch to database
   use trading-platform
   
   # Make your user an admin
   db.users.updateOne(
     { email: "john@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

2. **Access admin panel:** http://localhost:3000/admin

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running: `net start MongoDB`
- Check the connection string in `backend/.env`
- For Atlas, verify IP whitelist and credentials

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```powershell
# Find and kill the process using the port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend Not Loading

**Solution:**
1. Clear browser cache
2. Try incognito/private mode
3. Check browser console for errors (F12)

### Backend API Errors

**Solution:**
1. Check backend terminal for error messages
2. Verify `.env` file exists in backend folder
3. Ensure all environment variables are set

### Dependencies Issues

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules, frontend/node_modules, backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Testing the Platform

### Test Scenarios

1. **Registration & Login**
   - ✅ Create account
   - ✅ Logout
   - ✅ Login again

2. **Trading**
   - ✅ Buy an asset
   - ✅ Sell an asset
   - ✅ View portfolio updates
   - ✅ Close a trade

3. **Portfolio Management**
   - ✅ View holdings
   - ✅ Check P/L calculations
   - ✅ Monitor real-time price updates

4. **Balance Management**
   - ✅ Reset balance
   - ✅ Verify balance updates after trades

## Next Steps

- 📚 Read the full [SETUP.md](SETUP.md) for detailed configuration
- 📖 Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete feature list
- 🔧 Customize the platform (add more assets, change starting balance, etc.)
- 🚀 Deploy to production (see SETUP.md for deployment guide)

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in the terminal
3. Verify all prerequisites are met
4. Check MongoDB connection

## Demo Credentials (After Registration)

After you register, you can use these credentials to login:
- Email: (your registered email)
- Password: (your chosen password)

**Remember:** This is a DEMO platform. No real money is involved!

---

**Happy Trading! 📈💰**

*Learn, practice, and master trading without any risk!*

