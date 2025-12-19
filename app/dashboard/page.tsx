'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import AssetList from '@/components/AssetList';
import TradingChart from '@/components/TradingChart';
import TradingPanel from '@/components/TradingPanel';
import Portfolio from '@/components/Portfolio';
import TradeHistory from '@/components/TradeHistory';
import { useTranslation } from '@/lib/useTranslation';

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, setUser } = useStore();
  const { t, isLoading: translationLoading } = useTranslation();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, [token, router]);

  if (!user || translationLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center">
          <div className="shimmer w-32 h-32 rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <Navbar />

      {/* Welcome Banner */}
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="glass-card p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 sm:mb-2">
                {t('dashboard.welcome')}, {user.firstName}! 👋
              </h1>
              <p className="text-dark-300 text-sm sm:text-base">
                Ready to practice your trading skills? Start by selecting an asset from the market list.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-8 pb-6">
        <div className="grid grid-cols-12 gap-3 lg:gap-6">
          {/* Left Sidebar - Asset List */}
          <div className="col-span-12 lg:col-span-3 xl:col-span-2 animate-slide-up order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-hidden">
              <AssetList />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 space-y-4 lg:space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.1s' }}>
            {/* Trading Chart */}
            <div className="h-[450px] sm:h-[500px] lg:h-[600px] xl:h-[650px]">
              <TradingChart />
            </div>

            {/* Trade History */}
            <div className="h-[350px] lg:h-[400px]">
              <TradeHistory />
            </div>
          </div>

          {/* Right Sidebar - Trading & Portfolio */}
          <div className="col-span-12 lg:col-span-3 space-y-4 lg:space-y-6 animate-slide-up order-3" style={{ animationDelay: '0.2s' }}>
            <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-6">
              {/* Trading Panel */}
              <TradingPanel />

              {/* Portfolio */}
              <Portfolio />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

