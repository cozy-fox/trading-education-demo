'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Zap,
  DollarSign,
  BarChart2
} from 'lucide-react';

const timeIntervals = [
  { label: '1m', value: '1', tooltip: '1 Minute - Best for scalping' },
  { label: '5m', value: '5', tooltip: '5 Minutes - Short-term trading' },
  { label: '15m', value: '15', tooltip: '15 Minutes - Day trading' },
  { label: '1H', value: '60', tooltip: '1 Hour - Swing trading' },
  { label: '4H', value: '240', tooltip: '4 Hours - Position trading' },
  { label: '1D', value: 'D', tooltip: '1 Day - Long-term analysis' },
];

export default function TradingChart() {
  const { selectedAsset } = useStore();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState('15');
  const [showTip, setShowTip] = useState(true);

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
    if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
    return volume.toFixed(2);
  };

  useEffect(() => {
    if (!selectedAsset || !containerRef.current) return;

    setError(false);
    setLoading(true);
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };
    script.onload = () => {
      try {
        if (typeof (window as any).TradingView !== 'undefined') {
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: getSymbolForTradingView(selectedAsset.symbol, selectedAsset.type),
            interval: selectedInterval,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0f1a',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            container_id: 'tradingview_widget',
            studies: [],
            disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
            enabled_features: ['hide_left_toolbar_by_default'],
            loading_screen: { backgroundColor: '#0a0f1a', foregroundColor: '#6366f1' },
            overrides: {
              'paneProperties.background': '#0a0f1a',
              'paneProperties.backgroundType': 'solid',
              'mainSeriesProperties.candleStyle.upColor': '#22c55e',
              'mainSeriesProperties.candleStyle.downColor': '#ef4444',
              'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
              'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
              'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
              'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
            },
          });
          setTimeout(() => setLoading(false), 1500);
        }
      } catch (err) {
        console.error('TradingView widget error:', err);
        setError(true);
        setLoading(false);
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
  }, [selectedAsset, selectedInterval]);

  const getSymbolForTradingView = (symbol: string, type: string): string => {
    if (type === 'CRYPTO') return `BINANCE:${symbol}USDT`;
    if (type === 'STOCK') return `NASDAQ:${symbol}`;
    if (type === 'FOREX') return `FX:${symbol}`;
    return symbol;
  };

  // Empty state
  if (!selectedAsset) {
    return (
      <div className="h-full rounded-2xl bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 border border-dark-700/50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-500/20">
            <BarChart3 className="w-10 h-10 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t('trading.selectAssetChart')}</h3>
          <p className="text-dark-400 text-sm leading-relaxed">
            Choose an asset from the market list to view its live chart and start analyzing price movements.
          </p>
        </div>
      </div>
    );
  }

  const isPositive = selectedAsset.change24h >= 0;

  return (
    <div className="h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 border border-dark-700/50 overflow-hidden flex flex-col">
      {/* Professional Header */}
      <div className="p-3 sm:p-4 lg:p-5 border-b border-dark-700/50 bg-dark-900/80">
        {/* Top Row - Asset Info & Price */}
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          {/* Asset Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
              isPositive
                ? 'bg-gradient-to-br from-success-500/20 to-success-600/10 border border-success-500/30'
                : 'bg-gradient-to-br from-danger-500/20 to-danger-600/10 border border-danger-500/30'
            }`}>
              {isPositive
                ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success-400" />
                : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-danger-400" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{selectedAsset.symbol}</h2>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                  {selectedAsset.type}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-dark-400 truncate">{selectedAsset.name}</p>
            </div>
          </div>

          {/* Current Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-mono">
              ${formatPrice(selectedAsset.currentPrice)}
            </p>
            <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="text-xs sm:text-sm font-semibold">
                {isPositive ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
              </span>
              <span className="text-dark-500 text-[10px] sm:text-xs ml-0.5 sm:ml-1">24h</span>
            </div>
          </div>
        </div>

        {/* Market Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <div className="bg-dark-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-dark-700/50">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-dark-400 font-medium uppercase tracking-wide truncate">24h High</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white font-mono truncate">${formatPrice(selectedAsset.high24h)}</p>
          </div>
          <div className="bg-dark-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-dark-700/50">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-danger-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-dark-400 font-medium uppercase tracking-wide truncate">24h Low</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white font-mono truncate">${formatPrice(selectedAsset.low24h)}</p>
          </div>
          <div className="bg-dark-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-dark-700/50">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
              <BarChart2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-dark-400 font-medium uppercase tracking-wide truncate">Volume</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white font-mono truncate">${formatVolume(selectedAsset.volume24h)}</p>
          </div>
          <div className="bg-dark-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-dark-700/50">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
              <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-warning-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-dark-400 font-medium uppercase tracking-wide truncate">Volatility</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white font-mono">
              {(((selectedAsset.high24h - selectedAsset.low24h) / selectedAsset.low24h) * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Time Interval Selector */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-dark-400" />
            <span className="text-[11px] sm:text-xs text-dark-400 font-medium hidden sm:inline">Timeframe:</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 bg-dark-800/50 rounded-lg sm:rounded-xl p-0.5 sm:p-1 border border-dark-700/50 overflow-x-auto">
            {timeIntervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => setSelectedInterval(interval.value)}
                title={interval.tooltip}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md sm:rounded-lg transition-all duration-200 flex-shrink-0 ${
                  selectedInterval === interval.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Tip Banner */}
      {showTip && (
        <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-b border-primary-500/20 flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-400" />
            </div>
            <p className="text-[11px] sm:text-xs text-dark-300 leading-relaxed">
              <span className="text-primary-400 font-semibold">Pro Tip:</span>{' '}
              <span className="hidden xs:inline">Green candles indicate price increase, red candles show decrease. The wicks show high/low prices.</span>
              <span className="xs:hidden">Green = price up, Red = price down.</span>
            </p>
          </div>
          <button
            onClick={() => setShowTip(false)}
            className="text-dark-500 hover:text-dark-300 transition-colors text-sm p-1 flex-shrink-0"
            aria-label="Close tip"
          >
            ✕
          </button>
        </div>
      )}

      {/* Chart Container */}
      <div className="flex-1 relative bg-[#0a0f1a]">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-dark-900/90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-dark-400 text-sm font-medium">Loading chart...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-danger-500/20 to-danger-700/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-danger-500/30">
                <AlertCircle className="w-8 h-8 text-danger-400" />
              </div>
              <p className="text-white font-semibold mb-2">Chart Unavailable</p>
              <p className="text-dark-400 text-sm mb-4">Unable to load the trading chart</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={containerRef} className="h-full w-full" />
      </div>

      {/* Footer - Live Indicator */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-900/80 border-t border-dark-700/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-success-500"></span>
          </span>
          <span className="text-[10px] sm:text-xs text-dark-400 font-medium">Live Data</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-dark-500">
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[10px] sm:text-[11px]">Powered by TradingView</span>
        </div>
      </div>
    </div>
  );
}

