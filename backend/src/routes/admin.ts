import express from 'express';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Trade from '../models/Trade';
import Asset from '../models/Asset';
import Portfolio from '../models/Portfolio';

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authenticate);
router.use(isAdmin);

// Get all users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:userId', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Reset user balance
router.post('/users/:userId/reset-balance', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.demoBalance = parseFloat(process.env.DEMO_STARTING_BALANCE || '10000');
    await user.save();

    res.json({
      message: 'User balance reset successfully',
      user: {
        id: user._id,
        email: user.email,
        demoBalance: user.demoBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset user balance' });
  }
});

// Delete user
router.delete('/users/:userId', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's trades and portfolio
    await Trade.deleteMany({ userId: user._id });
    await Portfolio.deleteOne({ userId: user._id });
    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all trades
router.get('/trades', async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const trades = await Trade.find()
      .populate('userId', 'email firstName lastName')
      .sort({ openedAt: -1 })
      .limit(limit);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Create or update asset
router.post('/assets', async (req: AuthRequest, res) => {
  try {
    const { symbol, name, type, currentPrice } = req.body;

    if (!symbol || !name || !type || !currentPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const asset = await Asset.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      {
        symbol: symbol.toUpperCase(),
        name,
        type,
        currentPrice,
        isActive: true,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Asset created/updated successfully',
      asset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create/update asset' });
  }
});

// Delete asset
router.delete('/assets/:symbol', async (req: AuthRequest, res) => {
  try {
    const asset = await Asset.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    asset.isActive = false;
    await asset.save();

    res.json({ message: 'Asset deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

// Get platform statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const openTrades = await Trade.countDocuments({ status: 'OPEN' });
    const closedTrades = await Trade.countDocuments({ status: 'CLOSED' });
    const activeAssets = await Asset.countDocuments({ isActive: true });

    res.json({
      totalUsers,
      totalTrades,
      openTrades,
      closedTrades,
      activeAssets,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;

