'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { tradingAPI, authAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { TrendingUp, TrendingDown, DollarSign, Hash, Zap } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function TradingPanel() {
  const { selectedAsset, user, setUser } = useStore();
  const { t } = useTranslation();
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!selectedAsset) {
      toast.error(t('trading.selectAsset'));
      return;
    }

    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error(t('trading.invalidQuantity'));
      return;
    }

    const totalValue = qty * selectedAsset.currentPrice;
    if (orderType === 'BUY' && totalValue > (user?.demoBalance || 0)) {
      toast.error(t('trading.insufficientBalance'));
      return;
    }

    setLoading(true);

    try {
      await tradingAPI.executeTrade({
        symbol: selectedAsset.symbol,
        type: orderType,
        quantity: qty,
        orderType: 'MARKET',
      });

      toast.success(t('trading.tradeSuccess'));
      setQuantity('');

      // Refresh user balance
      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('trading.tradeError'));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAsset) {
    return (
      <div className="glass-card p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-dark-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-dark-400" />
        </div>
        <p className="text-dark-300 font-medium text-sm sm:text-base">{t('trading.selectAsset')}</p>
      </div>
    );
  }

  const totalValue = parseFloat(quantity || '0') * selectedAsset.currentPrice;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
              <span className="truncate">{selectedAsset.symbol}</span>
              <span className="text-primary-400 flex-shrink-0">/</span>
              <span className="text-xs sm:text-sm text-dark-400 flex-shrink-0">USD</span>
            </h2>
            <p className="text-xs sm:text-sm text-dark-300 mt-0.5 sm:mt-1 truncate">{selectedAsset.name}</p>
          </div>
          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex-shrink-0 ${
            selectedAsset.change24h >= 0 ? 'bg-success-500/20' : 'bg-danger-500/20'
          }`}>
            <span className={`text-xs sm:text-sm font-bold ${
              selectedAsset.change24h >= 0 ? 'text-success-400' : 'text-danger-400'
            }`}>
              {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* Order Type Selector */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => setOrderType('BUY')}
            className={`py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm sm:text-base ${
              orderType === 'BUY'
                ? 'btn-success shadow-glow-success scale-105'
                : 'glass hover:bg-dark-700 text-dark-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('trading.buy')}</span>
          </button>
          <button
            onClick={() => setOrderType('SELL')}
            className={`py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm sm:text-base ${
              orderType === 'SELL'
                ? 'btn-danger shadow-glow-danger scale-105'
                : 'glass hover:bg-dark-700 text-dark-300'
            }`}
          >
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{t('trading.sell')}</span>
          </button>
        </div>

        {/* Current Price */}
        <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <p className="text-xs sm:text-sm text-dark-400 font-semibold flex items-center space-x-1.5 sm:space-x-2">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('trading.currentPrice')}</span>
            </p>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {formatCurrency(selectedAsset.currentPrice, selectedAsset.type === 'FOREX' ? 4 : 2)}
          </p>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-white mb-1.5 sm:mb-2 flex items-center space-x-1.5 sm:space-x-2">
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
            <span>{t('trading.quantity')}</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input font-mono text-base sm:text-lg"
            placeholder={t('trading.quantityPlaceholder')}
          />
        </div>

        {/* Total Value */}
        <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-primary-500/20">
          <p className="text-xs sm:text-sm text-dark-400 font-semibold mb-1 sm:mb-2">{t('trading.totalValue')}</p>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {formatCurrency(totalValue)}
          </p>
        </div>

        {/* Available Balance */}
        <div className="flex justify-between items-center text-xs sm:text-sm p-2.5 sm:p-3 glass rounded-lg sm:rounded-xl gap-2">
          <span className="text-dark-400 font-medium truncate">{t('trading.availableBalance')}:</span>
          <span className="text-white font-black font-mono flex-shrink-0">
            {formatCurrency(user?.demoBalance || 0)}
          </span>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleTrade}
          disabled={loading || !quantity}
          className={`w-full py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl font-black transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 group text-sm sm:text-base ${
            orderType === 'BUY'
              ? 'btn-success'
              : 'btn-danger'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('trading.processing')}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
              <span className="truncate">{t('trading.execute')} {orderType} {selectedAsset.symbol}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

