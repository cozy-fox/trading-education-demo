import axios from 'axios';

// Use relative path for API routes (Next.js API routes)
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  resetBalance: () => api.post('/api/auth/reset-balance'),
};

// Trading API
export const tradingAPI = {
  executeTrade: (data: {
    symbol: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    orderType?: 'MARKET' | 'LIMIT';
    limitPrice?: number;
  }) => api.post('/api/trading/execute', data),
  getOpenTrades: () => api.get('/api/trading/open'),
  getTradeHistory: (limit?: number) => api.get(`/api/trading/history?limit=${limit || 50}`),
  closeTrade: (tradeId: string) => api.post(`/api/trading/close/${tradeId}`),
  getPortfolio: () => api.get('/api/trading/portfolio'),
};

// Market API
export const marketAPI = {
  getAssets: () => api.get('/api/market/assets'),
  getAsset: (symbol: string) => api.get(`/api/market/assets/${symbol}`),
  updatePrices: () => api.post('/api/market/update-prices'),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/api/admin/users'),
  getUser: (userId: string) => api.get(`/api/admin/users/${userId}`),
  resetUserBalance: (userId: string) => api.post(`/api/admin/users/${userId}/reset-balance`),
  deleteUser: (userId: string) => api.delete(`/api/admin/users/${userId}`),
  getTrades: (limit?: number) => api.get(`/api/admin/trades?limit=${limit || 100}`),
  createAsset: (data: { symbol: string; name: string; type: string; currentPrice: number }) =>
    api.post('/api/admin/assets', data),
  deleteAsset: (symbol: string) => api.delete(`/api/admin/assets/${symbol}`),
  getStats: () => api.get('/api/admin/stats'),
};

export default api;

