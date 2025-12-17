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
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                {t('dashboard.welcome')}, {user.firstName}! 👋
              </h1>
              <p className="text-dark-300">
                Ready to practice your trading skills? Start by selecting an asset from the market list.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Asset List */}
          <div className="col-span-12 lg:col-span-2 animate-slide-up">
            <div className="sticky top-24">
              <AssetList />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-7 space-y-4 lg:space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Trading Chart */}
            <div className="h-[400px] lg:h-[500px]">
              <TradingChart />
            </div>

            {/* Trade History */}
            <div className="h-[300px] lg:h-[350px]">
              <TradeHistory />
            </div>
          </div>

          {/* Right Sidebar - Trading & Portfolio */}
          <div className="col-span-12 lg:col-span-3 space-y-4 lg:space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-24 space-y-4 lg:space-y-6">
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

