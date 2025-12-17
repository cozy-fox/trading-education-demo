import express from 'express';
import { authenticate } from '../middleware/auth';
import marketDataService from '../services/marketDataService';

const router = express.Router();

// Get all assets
router.get('/assets', authenticate, async (req, res) => {
  try {
    const assets = await marketDataService.getAllAssets();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Get asset by symbol
router.get('/assets/:symbol', authenticate, async (req, res) => {
  try {
    const { symbol } = req.params;
    const asset = await marketDataService.getAssetBySymbol(symbol);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// Manually trigger price update (for testing)
router.post('/update-prices', authenticate, async (req, res) => {
  try {
    await marketDataService.updateAllPrices();
    res.json({ message: 'Prices updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prices' });
  }
});

export default router;

