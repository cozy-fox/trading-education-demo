import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  demoBalance: number;
  isAdmin: boolean;
}

interface Asset {
  _id: string;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'STOCK' | 'FOREX';
  currentPrice: number;
  change24h: number;
  changePercentage24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

interface Trade {
  _id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
  profitLoss?: number;
  profitLossPercentage?: number;
}

interface Portfolio {
  holdings: {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    totalValue: number;
    profitLoss: number;
    profitLossPercentage: number;
  }[];
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

interface AppState {
  user: User | null;
  token: string | null;
  assets: Asset[];
  selectedAsset: Asset | null;
  portfolio: Portfolio | null;
  openTrades: Trade[];
  tradeHistory: Trade[];
  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAssets: (assets: Asset[]) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setPortfolio: (portfolio: Portfolio | null) => void;
  setOpenTrades: (trades: Trade[]) => void;
  setTradeHistory: (trades: Trade[]) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  assets: [],
  selectedAsset: null,
  portfolio: null,
  openTrades: [],
  tradeHistory: [],

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    set({ token });
  },
  setAssets: (assets) => set({ assets }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setPortfolio: (portfolio) => set({ portfolio }),
  setOpenTrades: (trades) => set({ openTrades: trades }),
  setTradeHistory: (trades) => set({ tradeHistory: trades }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({
      user: null,
      token: null,
      assets: [],
      selectedAsset: null,
      portfolio: null,
      openTrades: [],
      tradeHistory: [],
    });
  },
}));

