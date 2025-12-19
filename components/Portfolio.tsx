'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { tradingAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getPriceColor } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function Portfolio() {
  const { portfolio, setPortfolio, user } = useStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await tradingAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 sm:p-8 text-center">
        <div className="shimmer w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4"></div>
        <p className="text-dark-300 text-sm sm:text-base">{t('common.loading')}</p>
      </div>
    );
  }

  const totalAccountValue = (user?.demoBalance || 0) + (portfolio?.totalValue || 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">{t('portfolio.title')}</h2>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* Account Summary */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          {/* Total Value */}
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-primary-500/20">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                <p className="text-[11px] sm:text-xs text-dark-400 font-semibold">{t('portfolio.totalValue')}</p>
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatCurrency(totalAccountValue)}
            </p>
          </div>

          {/* Holdings Value */}
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-400" />
              <p className="text-[11px] sm:text-xs text-dark-400 font-semibold">{t('portfolio.holdingsValue')}</p>
            </div>
            <p className="text-lg sm:text-xl font-black text-white font-mono">
              {formatCurrency(portfolio?.totalValue || 0)}
            </p>
          </div>

          {/* Total P/L */}
          <div className={`glass p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
            (portfolio?.totalProfitLoss || 0) >= 0
              ? 'border-success-500/30 bg-success-500/5'
              : 'border-danger-500/30 bg-danger-500/5'
          }`}>
            <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-2">
              {(portfolio?.totalProfitLoss || 0) >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-danger-400" />
              )}
              <p className="text-[11px] sm:text-xs text-dark-400 font-semibold">{t('portfolio.totalPL')}</p>
            </div>
            <p className={`text-lg sm:text-xl font-black font-mono ${getPriceColor(portfolio?.totalProfitLoss || 0)}`}>
              {formatCurrency(portfolio?.totalProfitLoss || 0)}
            </p>
            <p className={`text-xs sm:text-sm font-bold ${getPriceColor(portfolio?.totalProfitLossPercentage || 0)}`}>
              {formatPercentage(portfolio?.totalProfitLossPercentage || 0)}
            </p>
          </div>
        </div>

        {/* Holdings */}
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 flex items-center space-x-2">
            <span>{t('portfolio.holdings')}</span>
            {portfolio?.holdings && portfolio.holdings.length > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-md sm:rounded-lg text-[10px] sm:text-xs">
                {portfolio.holdings.length}
              </span>
            )}
          </h3>
          {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
            <div className="glass p-6 sm:p-8 rounded-lg sm:rounded-xl text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-dark-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-dark-400" />
              </div>
              <p className="text-dark-300 font-medium text-sm sm:text-base">{t('portfolio.noHoldings')}</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {portfolio.holdings.map((holding, index) => (
                <div
                  key={index}
                  className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-dark-700/50 transition-all duration-300 hover-lift"
                >
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <div className="min-w-0">
                      <p className="font-black text-white text-sm sm:text-lg">{holding.symbol}</p>
                      <p className="text-[10px] sm:text-xs text-dark-400 font-mono truncate">
                        {holding.quantity} @ {formatCurrency(holding.averagePrice)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-white font-mono text-sm sm:text-base">
                        {formatCurrency(holding.totalValue)}
                      </p>
                      <p className={`text-[10px] sm:text-xs font-bold ${getPriceColor(holding.profitLoss)}`}>
                        {formatCurrency(holding.profitLoss)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-dark-700/50 gap-2">
                    <span className="text-[10px] sm:text-xs text-dark-400 font-medium truncate">
                      {t('portfolio.current')}: <span className="text-white font-mono">{formatCurrency(holding.currentPrice)}</span>
                    </span>
                    <span className={`text-[10px] sm:text-xs font-bold flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0 ${getPriceColor(holding.profitLoss)}`}>
                      {holding.profitLoss >= 0 ? (
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      ) : (
                        <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      )}
                      <span>{formatPercentage(holding.profitLossPercentage)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

