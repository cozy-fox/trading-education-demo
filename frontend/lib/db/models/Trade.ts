import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  totalValue: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: Date;
  closedAt?: Date;
  closedPrice?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
}

const TradeSchema = new Schema<ITrade>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: true,
    },
    orderType: {
      type: String,
      enum: ['MARKET', 'LIMIT'],
      default: 'MARKET',
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
    closedPrice: {
      type: Number,
    },
    profitLoss: {
      type: Number,
    },
    profitLossPercentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TradeSchema.index({ userId: 1, status: 1 });
TradeSchema.index({ symbol: 1 });

const Trade = mongoose.models.Trade || mongoose.model<ITrade>('Trade', TradeSchema);

export default Trade;

