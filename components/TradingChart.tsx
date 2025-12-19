'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

export default function TradingChart() {
  const { selectedAsset } = useStore();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedAsset || !containerRef.current) return;

    setError(false);

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onerror = () => {
      setError(true);
    };
    script.onload = () => {
      try {
        if (typeof (window as any).TradingView !== 'undefined') {
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: getSymbolForTradingView(selectedAsset.symbol, selectedAsset.type),
            interval: '15',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0f172a',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            container_id: 'tradingview_widget',
            studies: [],
            disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
            enabled_features: [],
            loading_screen: { backgroundColor: '#0f172a', foregroundColor: '#4f46e5' },
            overrides: {
              'mainSeriesProperties.candleStyle.upColor': '#10b981',
              'mainSeriesProperties.candleStyle.downColor': '#ef4444',
              'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
              'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
              'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
              'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
            },
          });
        }
      } catch (err) {
        console.error('TradingView widget error:', err);
        setError(true);
      }
    };

    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'tradingview_widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer);
    }

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedAsset]);

  const getSymbolForTradingView = (symbol: string, type: string): string => {
    if (type === 'CRYPTO') {
      return `BINANCE:${symbol}USDT`;
    } else if (type === 'STOCK') {
      return `NASDAQ:${symbol}`;
    } else if (type === 'FOREX') {
      return `FX:${symbol}`;
    }
    return symbol;
  };

  if (!selectedAsset) {
    return (
      <div className="glass-card h-full flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-dark-400" />
          </div>
          <p className="text-dark-300 font-medium text-sm sm:text-base">{t('trading.selectAssetChart')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-black text-white truncate">{selectedAsset.symbol}</h2>
                <p className="text-xs text-dark-400 font-medium truncate">{selectedAsset.name}</p>
              </div>
            </div>

            {/* Price Badge */}
            <div className={`glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 ${
              selectedAsset.change24h >= 0
                ? 'border-success-500/30 bg-success-500/5'
                : 'border-danger-500/30 bg-danger-500/5'
            }`}>
              <p className={`text-xs sm:text-sm font-bold ${
                selectedAsset.change24h >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="flex-1 bg-dark-900 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-danger-500/20 to-danger-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-danger-400" />
            </div>
            <p className="text-dark-400 text-base sm:text-lg font-semibold mb-2">Chart Unavailable</p>
            <p className="text-dark-500 text-xs sm:text-sm">Unable to load TradingView chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-black text-white truncate">{selectedAsset.symbol}</h2>
              <p className="text-xs text-dark-400 font-medium truncate">{selectedAsset.name}</p>
            </div>
          </div>

          {/* Price Badge */}
          <div className={`glass px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 ${
            selectedAsset.change24h >= 0
              ? 'border-success-500/30 bg-success-500/5'
              : 'border-danger-500/30 bg-danger-500/5'
          }`}>
            <p className={`text-xs sm:text-sm font-bold ${
              selectedAsset.change24h >= 0 ? 'text-success-400' : 'text-danger-400'
            }`}>
              {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={containerRef} className="flex-1 min-h-[300px] sm:min-h-[400px]" />
    </div>
  );
}

