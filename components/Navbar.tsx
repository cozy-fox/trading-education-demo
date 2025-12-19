'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  LogOut,
  User,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Wallet,
  Shield,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, setUser } = useStore();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
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
      setMobileMenuOpen(false);
    } catch (error) {
      toast.error('Failed to reset balance');
    }
  };

  return (
    <>
      <nav className="glass border-b border-dark-700/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
              <Link href="/dashboard" className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 group flex-shrink-0">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-sm xs:text-base sm:text-xl font-black gradient-text hidden xs:inline truncate">
                  TradePro
                </span>
              </Link>

              {/* Demo Badge - Hidden on very small screens */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-card animate-pulse-slow flex-shrink-0">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-warning-400" />
                <span className="text-warning-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  {t('common.demo')}
                </span>
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              {/* Balance Display */}
              <div className="glass-card px-3 py-2 sm:px-5 sm:py-2.5 hover-lift">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-success-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-dark-400 font-medium">{t('dashboard.balance')}</p>
                    <p className="text-sm sm:text-lg font-black text-white truncate">
                      {formatCurrency(user?.demoBalance || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset Balance Button */}
              <button
                onClick={handleResetBalance}
                className="p-2 sm:p-3 glass-card hover:bg-dark-700 text-primary-400 hover:text-primary-300 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-glow group flex-shrink-0"
                title="Reset Balance to $10,000"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* Admin Panel Link */}
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="p-2 sm:p-3 glass-card hover:bg-primary-500/20 text-primary-400 hover:text-primary-300 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-glow group flex-shrink-0"
                  title="Admin Panel"
                >
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </Link>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* User Profile */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 glass-card">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-white text-xs sm:text-sm font-semibold hidden lg:inline truncate max-w-[120px]">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn-danger flex items-center gap-2 group px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base flex-shrink-0"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:inline">{t('nav.logout')}</span>
              </button>
            </div>

            {/* Mobile Right Section */}
            <div className="flex sm:hidden items-center gap-1.5 xs:gap-2">
              {/* Compact Balance - Always visible on mobile */}
              <div className="glass-card px-2 py-1.5 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-success-400 flex-shrink-0" />
                <span className="text-xs font-bold text-white">
                  {formatCurrency(user?.demoBalance || 0)}
                </span>
              </div>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 glass-card hover:bg-dark-700 text-white rounded-lg transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            ref={menuRef}
            className="absolute right-0 top-14 xs:top-16 w-full max-w-[280px] bg-dark-900/98 backdrop-blur-xl border-l border-b border-dark-700/50 shadow-2xl animate-slide-in-right"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-dark-700/50 bg-gradient-to-r from-primary-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-warning-400" />
                    <span className="text-warning-400 text-xs font-medium">Demo Account</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Reset Balance */}
              <button
                onClick={handleResetBalance}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-dark-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-primary-400 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Reset Balance</p>
                    <p className="text-dark-400 text-xs">Restore to $10,000</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-500" />
              </button>

              {/* Admin Panel */}
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-dark-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-warning-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-warning-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">Admin Panel</p>
                      <p className="text-dark-400 text-xs">Manage platform</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500" />
                </Link>
              )}

              {/* Language Switcher */}
              <div className="p-3">
                <p className="text-dark-400 text-xs font-medium mb-2 px-1">Language</p>
                <LanguageSwitcher />
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-dark-700/50" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger-500/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-danger-500/20 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-danger-400 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-danger-400 text-sm font-medium">{t('nav.logout')}</p>
                    <p className="text-dark-400 text-xs">Sign out of your account</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

