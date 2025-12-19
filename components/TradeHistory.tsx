'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { tradingAPI } from '@/lib/api';
import { formatCurrency, formatDate, getPriceColor } from '@/lib/utils';
import { History, X, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/useTranslation';

export default function TradeHistory() {
  const { openTrades, tradeHistory, setOpenTrades, setTradeHistory } = useStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTrades = async () => {
    try {
      const [openResponse, historyResponse] = await Promise.all([
        tradingAPI.getOpenTrades(),
        tradingAPI.getTradeHistory(50),
      ]);
      setOpenTrades(openResponse.data);
      setTradeHistory(historyResponse.data);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    try {
      await tradingAPI.closeTrade(tradeId);
      toast.success(t('trading.tradeClosed'));
      fetchTrades();
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('trading.tradeError'));
    }
  };

  const trades = activeTab === 'open' ? openTrades : tradeHistory;

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{t('trading.trades')}</h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex space-x-1 sm:space-x-2 glass p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 ${
                activeTab === 'open'
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('trading.open')}</span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs ${
                activeTab === 'open' ? 'bg-white/20' : 'bg-dark-700'
              }`}>
                {openTrades.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 ${
                activeTab === 'history'
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('trading.history')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 overflow-hidden">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="shimmer w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4"></div>
            <p className="text-dark-300 text-sm sm:text-base">{t('common.loading')}</p>
          </div>
        ) : trades.length === 0 ? (
          <div className="glass p-6 sm:p-12 rounded-xl text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-dark-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <History className="w-7 h-7 sm:w-10 sm:h-10 text-dark-400" />
            </div>
            <p className="text-dark-300 font-medium text-sm sm:text-base">
              {activeTab === 'open' ? t('trading.noOpenTrades') : t('trading.noHistory')}
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 h-full overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            {trades.map((trade) => (
              <div
                key={trade._id}
                className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-dark-700/50 transition-all duration-300 hover-lift"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    {/* Trade Type & Symbol */}
                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-2">
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-black flex items-center gap-1 ${
                          trade.type === 'BUY'
                            ? 'bg-success-500/20 text-success-400'
                            : 'bg-danger-500/20 text-danger-400'
                        }`}
                      >
                        {trade.type === 'BUY' ? (
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        )}
                        <span>{trade.type}</span>
                      </span>
                      <span className="font-black text-white text-sm sm:text-lg">{trade.symbol}</span>
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold ${
                          trade.status === 'OPEN'
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'bg-dark-600/50 text-dark-400'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </div>

                    {/* Trade Details */}
                    <div className="text-[11px] sm:text-xs text-dark-400 space-y-0.5 sm:space-y-1 font-medium">
                      <p className="flex items-center justify-between gap-2">
                        <span className="truncate">{t('trading.quantity')}:</span>
                        <span className="text-white font-mono truncate">{trade.quantity} @ {formatCurrency(trade.price)}</span>
                      </p>
                      <p className="flex items-center justify-between gap-2">
                        <span>{t('trading.total')}:</span>
                        <span className="text-white font-mono font-bold">{formatCurrency(trade.totalValue)}</span>
                      </p>
                      <p className="flex items-center justify-between gap-2">
                        <span>{t('trading.opened')}:</span>
                        <span className="text-white truncate">{formatDate(trade.openedAt)}</span>
                      </p>
                      {trade.closedAt && (
                        <p className="flex items-center justify-between gap-2">
                          <span>{t('trading.closed')}:</span>
                          <span className="text-white truncate">{formatDate(trade.closedAt)}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* P/L or Close Button */}
                  <div className="text-right flex-shrink-0">
                    {trade.status === 'CLOSED' && trade.profitLoss !== undefined ? (
                      <div className={`glass p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                        trade.profitLoss >= 0
                          ? 'border-2 border-success-500/30 bg-success-500/5'
                          : 'border-2 border-danger-500/30 bg-danger-500/5'
                      }`}>
                        <p className={`font-black text-sm sm:text-lg font-mono ${getPriceColor(trade.profitLoss)}`}>
                          {formatCurrency(trade.profitLoss)}
                        </p>
                        <p className={`text-[10px] sm:text-xs font-bold ${getPriceColor(trade.profitLossPercentage || 0)}`}>
                          {trade.profitLossPercentage?.toFixed(2)}%
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCloseTrade(trade._id)}
                        className="btn-danger p-2 sm:p-3 group"
                        title={t('trading.closeTrade')}
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

