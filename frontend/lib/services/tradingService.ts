import Trade from '../db/models/Trade';
import User from '../db/models/User';
import Portfolio, { IPortfolioHolding } from '../db/models/Portfolio';
import Asset from '../db/models/Asset';
import mongoose from 'mongoose';

interface ExecuteTradeParams {
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  orderType?: 'MARKET' | 'LIMIT';
  limitPrice?: number;
}

class TradingService {
  // Execute a trade
  async executeTrade(params: ExecuteTradeParams) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId, symbol, type, quantity, orderType = 'MARKET', limitPrice } = params;

      // Get current asset price
      const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
      if (!asset) {
        throw new Error('Asset not found');
      }

      const price = orderType === 'LIMIT' && limitPrice ? limitPrice : asset.currentPrice;
      const totalValue = price * quantity;

      // Get user
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has sufficient balance for BUY orders
      if (type === 'BUY') {
        if (user.demoBalance < totalValue) {
          throw new Error('Insufficient balance');
        }
        user.demoBalance -= totalValue;
      } else {
        // For SELL orders, check if user has the asset in portfolio
        const portfolio = await Portfolio.findOne({ userId }).session(session);
        const holding = portfolio?.holdings.find((h: IPortfolioHolding) => h.symbol === symbol.toUpperCase());

        if (!holding || holding.quantity < quantity) {
          throw new Error('Insufficient holdings to sell');
        }
      }

      // Create trade
      const trade = new Trade({
        userId,
        symbol: symbol.toUpperCase(),
        type,
        orderType,
        quantity,
        price,
        totalValue,
        status: 'OPEN',
        openedAt: new Date(),
      });

      await trade.save({ session });
      await user.save({ session });

      // Update portfolio
      await this.updatePortfolio(userId, symbol.toUpperCase(), type, quantity, price, session);

      await session.commitTransaction();
      return trade;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Update portfolio after trade
  private async updatePortfolio(
    userId: string,
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    session: mongoose.ClientSession
  ) {
    let portfolio = await Portfolio.findOne({ userId }).session(session);

    if (!portfolio) {
      portfolio = new Portfolio({ userId, holdings: [] });
    }

    const holdingIndex = portfolio.holdings.findIndex((h: IPortfolioHolding) => h.symbol === symbol);

    if (type === 'BUY') {
      if (holdingIndex >= 0) {
        const holding = portfolio.holdings[holdingIndex];
        const totalQuantity = holding.quantity + quantity;
        const totalCost = (holding.averagePrice * holding.quantity) + (price * quantity);
        holding.averagePrice = totalCost / totalQuantity;
        holding.quantity = totalQuantity;
        holding.currentPrice = price;
        holding.totalValue = holding.quantity * holding.currentPrice;
        holding.profitLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity;
        holding.profitLossPercentage = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
      } else {
        portfolio.holdings.push({
          symbol,
          quantity,
          averagePrice: price,
          currentPrice: price,
          totalValue: quantity * price,
          profitLoss: 0,
          profitLossPercentage: 0,
        });
      }
    } else {
      // SELL
      if (holdingIndex >= 0) {
        const holding = portfolio.holdings[holdingIndex];
        holding.quantity -= quantity;
        
        if (holding.quantity <= 0) {
          portfolio.holdings.splice(holdingIndex, 1);
        } else {
          holding.currentPrice = price;
          holding.totalValue = holding.quantity * holding.currentPrice;
          holding.profitLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity;
          holding.profitLossPercentage = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
        }

        // Add profit to user balance
        const user = await User.findById(userId).session(session);
        if (user) {
          user.demoBalance += quantity * price;
          await user.save({ session });
        }
      }
    }

    // Calculate total portfolio value and P/L
    portfolio.totalValue = portfolio.holdings.reduce((sum: number, h: IPortfolioHolding) => sum + h.totalValue, 0);
    portfolio.totalProfitLoss = portfolio.holdings.reduce((sum: number, h: IPortfolioHolding) => sum + h.profitLoss, 0);
    portfolio.totalProfitLossPercentage = portfolio.totalValue > 0
      ? (portfolio.totalProfitLoss / (portfolio.totalValue - portfolio.totalProfitLoss)) * 100
      : 0;
    portfolio.lastUpdated = new Date();

    await portfolio.save({ session });
  }

  // Get user's open trades
  async getOpenTrades(userId: string) {
    return await Trade.find({ userId, status: 'OPEN' }).sort({ openedAt: -1 });
  }

  // Get user's trade history
  async getTradeHistory(userId: string, limit: number = 50) {
    return await Trade.find({ userId }).sort({ openedAt: -1 }).limit(limit);
  }

  // Close a trade
  async closeTrade(tradeId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trade = await Trade.findOne({ _id: tradeId, userId }).session(session);
      if (!trade) {
        throw new Error('Trade not found');
      }

      if (trade.status === 'CLOSED') {
        throw new Error('Trade already closed');
      }

      const asset = await Asset.findOne({ symbol: trade.symbol });
      if (!asset) {
        throw new Error('Asset not found');
      }

      const closedPrice = asset.currentPrice;
      const profitLoss = trade.type === 'BUY'
        ? (closedPrice - trade.price) * trade.quantity
        : (trade.price - closedPrice) * trade.quantity;
      const profitLossPercentage = (profitLoss / trade.totalValue) * 100;

      trade.status = 'CLOSED';
      trade.closedAt = new Date();
      trade.closedPrice = closedPrice;
      trade.profitLoss = profitLoss;
      trade.profitLossPercentage = profitLossPercentage;

      await trade.save({ session });

      // Update user balance
      const user = await User.findById(userId).session(session);
      if (user) {
        if (trade.type === 'BUY') {
          user.demoBalance += closedPrice * trade.quantity;
        }
        await user.save({ session });
      }

      // Update portfolio
      const portfolio = await Portfolio.findOne({ userId }).session(session);
      if (portfolio) {
        const holdingIndex = portfolio.holdings.findIndex((h: IPortfolioHolding) => h.symbol === trade.symbol);
        if (holdingIndex >= 0) {
          const holding = portfolio.holdings[holdingIndex];
          holding.quantity -= trade.quantity;

          if (holding.quantity <= 0) {
            portfolio.holdings.splice(holdingIndex, 1);
          }

          await portfolio.save({ session });
        }
      }

      await session.commitTransaction();
      return trade;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get portfolio for user
  async getPortfolio(userId: string) {
    let portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      portfolio = new Portfolio({ userId, holdings: [] });
      await portfolio.save();
    }

    // Update current prices
    for (const holding of portfolio.holdings) {
      const asset = await Asset.findOne({ symbol: holding.symbol });
      if (asset) {
        holding.currentPrice = asset.currentPrice;
        holding.totalValue = holding.quantity * holding.currentPrice;
        holding.profitLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity;
        holding.profitLossPercentage = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
      }
    }

    portfolio.totalValue = portfolio.holdings.reduce((sum: number, h: IPortfolioHolding) => sum + h.totalValue, 0);
    portfolio.totalProfitLoss = portfolio.holdings.reduce((sum: number, h: IPortfolioHolding) => sum + h.profitLoss, 0);
    portfolio.lastUpdated = new Date();

    await portfolio.save();
    return portfolio;
  }
}

const tradingService = new TradingService();
export default tradingService;

