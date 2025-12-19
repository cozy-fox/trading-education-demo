'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { LogOut, User, RefreshCw, TrendingUp, Sparkles, Wallet, Shield } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, setUser } = useStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success(t('nav.logout') + ' successful');
  };

  const handleResetBalance = async () => {
    try {
      const response = await authAPI.resetBalance();
      if (user) {
        setUser({ ...user, demoBalance: response.data.demoBalance });
      }
      toast.success('Demo balance reset to $10,000');
    } catch (error) {
      toast.error('Failed to reset balance');
    }
  };

  return (
    <nav className="glass border-b border-dark-700/50 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Section - Logo & Demo Badge */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-black gradient-text hidden md:inline">
                {t('common.appName')}
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-card animate-pulse-slow">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-warning-400" />
              <span className="text-warning-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                {t('common.demo')}
              </span>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
            {/* Balance Display */}
            <div className="glass-card px-2 py-1.5 sm:px-5 sm:py-2.5 hover-lift">
              <div className="flex items-center space-x-1.5 sm:space-x-3">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-success-400" />
                <div>
                  <p className="text-[10px] sm:text-xs text-dark-400 font-medium hidden sm:block">{t('dashboard.balance')}</p>
                  <p className="text-sm sm:text-lg font-black text-white">
                    {formatCurrency(user?.demoBalance || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Balance Button */}
            <button
              onClick={handleResetBalance}
              className="p-2 sm:p-3 glass-card hover:bg-dark-700 text-primary-400 hover:text-primary-300 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-glow group"
              title="Reset Balance to $10,000"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* Admin Panel Link */}
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="p-2 sm:p-3 glass-card hover:bg-primary-500/20 text-primary-400 hover:text-primary-300 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-glow group"
                title="Admin Panel"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Profile */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 glass-card">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-white text-xs sm:text-sm font-semibold hidden lg:inline">
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn-danger flex items-center space-x-1 sm:space-x-2 group px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:inline">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

