'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { marketAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getPriceColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function AssetList() {
  const { assets, setAssets, selectedAsset, setSelectedAsset } = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await marketAPI.getAssets();
      setAssets(response.data);
      if (!selectedAsset && response.data.length > 0) {
        setSelectedAsset(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const groupedAssets = {
    CRYPTO: assets.filter(a => a.type === 'CRYPTO'),
    STOCK: assets.filter(a => a.type === 'STOCK'),
    FOREX: assets.filter(a => a.type === 'FOREX'),
  };

  return (
    <div className="glass-card h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">{t('markets.title')}</h2>
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(groupedAssets).map(([type, typeAssets]) => (
          typeAssets.length > 0 && (
            <div key={type} className="mb-2">
              {/* Category Header */}
              <div className="px-4 py-3 bg-dark-800/50 sticky top-0 z-10 backdrop-blur-sm">
                <h3 className="text-xs font-black text-primary-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                  <span>{t(`markets.${type.toLowerCase()}`)}</span>
                  <span className="text-dark-500">({typeAssets.length})</span>
                </h3>
              </div>

              {/* Assets */}
              {typeAssets.map((asset) => (
                <button
                  key={asset._id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-300 ${
                    selectedAsset?._id === asset._id
                      ? 'bg-primary-500/20 border-l-4 border-primary-500'
                      : 'hover:bg-dark-700/50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-black text-white text-sm">{asset.symbol}</span>
                      {asset.changePercentage24h > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-success-400" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-danger-400" />
                      )}
                    </div>
                    <p className="text-xs text-dark-400 font-medium truncate">{asset.name}</p>
                  </div>

                  <div className="text-right ml-2">
                    <p className="font-black text-white text-sm font-mono">
                      {formatCurrency(asset.currentPrice, asset.type === 'FOREX' ? 4 : 2)}
                    </p>
                    <p className={`text-xs font-bold ${getPriceColor(asset.changePercentage24h)}`}>
                      {formatPercentage(asset.changePercentage24h)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

