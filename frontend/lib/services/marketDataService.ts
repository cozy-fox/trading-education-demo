import axios from 'axios';
import Asset from '../db/models/Asset';

interface BinanceTickerResponse {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

class MarketDataService {
  private binanceBaseUrl = 'https://api.binance.com/api/v3';

  private getCryptoName(symbol: string): string {
    const names: { [key: string]: string } = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      BNB: 'Binance Coin',
      ADA: 'Cardano',
      SOL: 'Solana',
      XRP: 'Ripple',
      DOT: 'Polkadot',
      DOGE: 'Dogecoin',
    };
    return names[symbol] || symbol;
  }

  // Fetch crypto prices from Binance
  async fetchCryptoPrices(symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']): Promise<void> {
    try {
      const promises = symbols.map(symbol => this.fetchBinanceTicker(symbol));
      await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    }
  }

  private async fetchBinanceTicker(symbol: string): Promise<void> {
    try {
      const response = await axios.get<BinanceTickerResponse>(
        `${this.binanceBaseUrl}/ticker/24hr`,
        { params: { symbol } }
      );

      const data = response.data;
      const cleanSymbol = symbol.replace('USDT', '');

      await Asset.findOneAndUpdate(
        { symbol: cleanSymbol },
        {
          symbol: cleanSymbol,
          name: this.getCryptoName(cleanSymbol),
          type: 'CRYPTO',
          currentPrice: parseFloat(data.lastPrice),
          change24h: parseFloat(data.priceChange),
          changePercentage24h: parseFloat(data.priceChangePercent),
          high24h: parseFloat(data.highPrice),
          low24h: parseFloat(data.lowPrice),
          volume24h: parseFloat(data.volume),
          isActive: true,
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
    }
  }

  // Generate mock data for stocks and forex
  async generateMockData(): Promise<void> {
    const mockAssets = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', basePrice: 175.50 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'STOCK', basePrice: 140.25 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'STOCK', basePrice: 380.75 },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'STOCK', basePrice: 245.30 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'STOCK', basePrice: 155.80 },
      { symbol: 'EURUSD', name: 'EUR/USD', type: 'FOREX', basePrice: 1.0850 },
      { symbol: 'GBPUSD', name: 'GBP/USD', type: 'FOREX', basePrice: 1.2650 },
      { symbol: 'USDJPY', name: 'USD/JPY', type: 'FOREX', basePrice: 149.50 },
    ];

    for (const asset of mockAssets) {
      const randomChange = (Math.random() - 0.5) * 10; // -5% to +5%
      const currentPrice = asset.basePrice * (1 + randomChange / 100);
      const change24h = currentPrice - asset.basePrice;
      const changePercentage24h = (change24h / asset.basePrice) * 100;

      await Asset.findOneAndUpdate(
        { symbol: asset.symbol },
        {
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type as 'STOCK' | 'FOREX',
          currentPrice,
          change24h,
          changePercentage24h,
          high24h: currentPrice * 1.02,
          low24h: currentPrice * 0.98,
          volume24h: Math.random() * 1000000,
          isActive: true,
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );
    }
  }

  // Get all active assets
  async getAllAssets() {
    return await Asset.find({ isActive: true }).sort({ symbol: 1 });
  }

  // Get asset by symbol
  async getAssetBySymbol(symbol: string) {
    return await Asset.findOne({ symbol: symbol.toUpperCase(), isActive: true });
  }

  // Update prices periodically
  async updateAllPrices(): Promise<void> {
    await this.fetchCryptoPrices();
    await this.generateMockData();
    console.log('✅ Market data updated');
  }
}

const marketDataService = new MarketDataService();
export default marketDataService;

