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
      <div className="glass-card p-8 text-center">
        <div className="shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
        <p className="text-dark-300">{t('common.loading')}</p>
      </div>
    );
  }

  const totalAccountValue = (user?.demoBalance || 0) + (portfolio?.totalValue || 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">{t('portfolio.title')}</h2>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Account Summary */}
        <div className="grid grid-cols-1 gap-3">
          {/* Total Value */}
          <div className="glass p-4 rounded-xl border-2 border-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-primary-400" />
                <p className="text-xs text-dark-400 font-semibold">{t('portfolio.totalValue')}</p>
              </div>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {formatCurrency(totalAccountValue)}
            </p>
          </div>

          {/* Holdings Value */}
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success-400" />
              <p className="text-xs text-dark-400 font-semibold">{t('portfolio.holdingsValue')}</p>
            </div>
            <p className="text-xl font-black text-white font-mono">
              {formatCurrency(portfolio?.totalValue || 0)}
            </p>
          </div>

          {/* Total P/L */}
          <div className={`glass p-4 rounded-xl border-2 ${
            (portfolio?.totalProfitLoss || 0) >= 0
              ? 'border-success-500/30 bg-success-500/5'
              : 'border-danger-500/30 bg-danger-500/5'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {(portfolio?.totalProfitLoss || 0) >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-success-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-danger-400" />
              )}
              <p className="text-xs text-dark-400 font-semibold">{t('portfolio.totalPL')}</p>
            </div>
            <p className={`text-xl font-black font-mono ${getPriceColor(portfolio?.totalProfitLoss || 0)}`}>
              {formatCurrency(portfolio?.totalProfitLoss || 0)}
            </p>
            <p className={`text-sm font-bold ${getPriceColor(portfolio?.totalProfitLossPercentage || 0)}`}>
              {formatPercentage(portfolio?.totalProfitLossPercentage || 0)}
            </p>
          </div>
        </div>

        {/* Holdings */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
            <span>{t('portfolio.holdings')}</span>
            {portfolio?.holdings && portfolio.holdings.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-lg text-xs">
                {portfolio.holdings.length}
              </span>
            )}
          </h3>
          {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
            <div className="glass p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-dark-400" />
              </div>
              <p className="text-dark-300 font-medium">{t('portfolio.noHoldings')}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {portfolio.holdings.map((holding, index) => (
                <div
                  key={index}
                  className="glass p-4 rounded-xl hover:bg-dark-700/50 transition-all duration-300 hover-lift"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-black text-white text-lg">{holding.symbol}</p>
                      <p className="text-xs text-dark-400 font-mono">
                        {holding.quantity} @ {formatCurrency(holding.averagePrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white font-mono">
                        {formatCurrency(holding.totalValue)}
                      </p>
                      <p className={`text-xs font-bold ${getPriceColor(holding.profitLoss)}`}>
                        {formatCurrency(holding.profitLoss)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
                    <span className="text-xs text-dark-400 font-medium">
                      {t('portfolio.current')}: <span className="text-white font-mono">{formatCurrency(holding.currentPrice)}</span>
                    </span>
                    <span className={`text-xs font-bold flex items-center space-x-1 ${getPriceColor(holding.profitLoss)}`}>
                      {holding.profitLoss >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
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

