import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { tradeLimiter } from '../middleware/rateLimiter';
import tradingService from '../services/tradingService';

const router = express.Router();

// Execute a trade
router.post('/execute', authenticate, tradeLimiter, async (req: AuthRequest, res) => {
  try {
    const { symbol, type, quantity, orderType, limitPrice } = req.body;
    const userId = req.user!._id.toString();

    // Validate input
    if (!symbol || !type || !quantity) {
      return res.status(400).json({ error: 'Symbol, type, and quantity are required' });
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({ error: 'Type must be BUY or SELL' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const trade = await tradingService.executeTrade({
      userId,
      symbol,
      type,
      quantity,
      orderType: orderType || 'MARKET',
      limitPrice,
    });

    res.status(201).json({
      message: 'Trade executed successfully',
      trade,
    });
  } catch (error: any) {
    console.error('Trade execution error:', error);
    res.status(400).json({ error: error.message || 'Trade execution failed' });
  }
});

// Get open trades
router.get('/open', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id.toString();
    const trades = await tradingService.getOpenTrades(userId);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch open trades' });
  }
});

// Get trade history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id.toString();
    const limit = parseInt(req.query.limit as string) || 50;
    const trades = await tradingService.getTradeHistory(userId, limit);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade history' });
  }
});

// Close a trade
router.post('/close/:tradeId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { tradeId } = req.params;
    const userId = req.user!._id.toString();
    
    const trade = await tradingService.closeTrade(tradeId, userId);
    
    res.json({
      message: 'Trade closed successfully',
      trade,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to close trade' });
  }
});

// Get portfolio
router.get('/portfolio', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id.toString();
    const portfolio = await tradingService.getPortfolio(userId);
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

export default router;

