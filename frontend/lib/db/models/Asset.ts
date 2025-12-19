import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  _id: mongoose.Types.ObjectId;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'STOCK' | 'FOREX';
  currentPrice: number;
  change24h: number;
  changePercentage24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  isActive: boolean;
  lastUpdated: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['CRYPTO', 'STOCK', 'FOREX'],
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    change24h: {
      type: Number,
      default: 0,
    },
    changePercentage24h: {
      type: Number,
      default: 0,
    },
    high24h: {
      type: Number,
      default: 0,
    },
    low24h: {
      type: Number,
      default: 0,
    },
    volume24h: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (symbol already has unique: true which creates an index)
AssetSchema.index({ type: 1, isActive: 1 });

const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset;

