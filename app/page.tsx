'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { TrendingUp, Shield, BookOpen, Award, Sparkles, BarChart3, Zap } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';

export default function HomePage() {
  const router = useRouter();
  const { token } = useStore();
  const { t, isLoading } = useTranslation();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  if (isLoading) {
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
    <div className="min-h-screen animated-bg overflow-hidden">
      {/* Navigation */}
      <nav className="glass border-b border-dark-700/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold gradient-text hidden sm:inline">
                {t('common.appName')}
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="px-3 py-2 sm:px-6 sm:py-2.5 text-white hover:text-primary-400 font-medium transition-all duration-300 text-sm sm:text-base"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/register"
                className="btn-primary px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                {t('nav.register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center mb-16 animate-fade-in">
            {/* Demo Badge */}
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 glass-card mb-8 animate-bounce-slow border border-warning-500/30">
              <Sparkles className="w-5 h-5 text-warning-400" />
              <span className="text-warning-400 font-bold text-sm uppercase tracking-wider">
                100% Risk-Free Demo Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight px-4">
              {t('home.hero.title')}
              <br />
              <span className="gradient-text">{t('home.hero.titleHighlight')}</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              {t('home.hero.subtitle')}
            </p>

            {/* Educational Value Proposition */}
            <div className="max-w-3xl mx-auto mb-12 px-4">
              <div className="glass-card p-6 border border-primary-500/20">
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  <span className="font-bold text-primary-400">Learn by doing.</span> Practice trading strategies with real-time market data in a completely safe environment. Perfect for beginners and experienced traders looking to test new strategies.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 shadow-2xl hover:shadow-glow group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{t('home.hero.getStarted')}</span>
                  <Zap className="w-5 h-5 group-hover:animate-bounce" />
                </span>
              </Link>
              <Link
                href="/login"
                className="btn-outline text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4"
              >
                {t('home.hero.login')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center glass-card p-4 sm:p-6 hover-lift">
                <div className="text-2xl sm:text-4xl font-black gradient-text mb-2">$10K</div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Virtual Balance</div>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">Start trading immediately</p>
              </div>
              <div className="text-center glass-card p-4 sm:p-6 hover-lift">
                <div className="text-2xl sm:text-4xl font-black gradient-text mb-2">100+</div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Trading Assets</div>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">Stocks, Crypto & More</p>
              </div>
              <div className="text-center glass-card p-4 sm:p-6 hover-lift">
                <div className="text-2xl sm:text-4xl font-black gradient-text mb-2">24/7</div>
                <div className="text-gray-400 text-xs sm:text-sm font-medium">Market Data</div>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1">Real-time updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose Our <span className="gradient-text">Trading Platform</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to learn trading without risking real money
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 sm:p-8 hover-lift group border border-primary-500/20 hover:border-primary-500/40 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('home.features.realTimeData.title')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {t('home.features.realTimeData.description')}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                  <span>Live price updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                  <span>Interactive charts</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 sm:p-8 hover-lift group border border-success-500/20 hover:border-success-500/40 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center mb-6 shadow-glow-success group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('home.features.zeroRisk.title')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {t('home.features.zeroRisk.description')}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-success-400 rounded-full"></span>
                  <span>No real money required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-success-400 rounded-full"></span>
                  <span>Safe learning environment</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 sm:p-8 hover-lift group border border-warning-500/20 hover:border-warning-500/40 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-warning-500 to-warning-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('home.features.education.title')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {t('home.features.education.description')}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-warning-400 rounded-full"></span>
                  <span>Hands-on practice</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-warning-400 rounded-full"></span>
                  <span>Build confidence</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 sm:p-8 hover-lift group border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('home.features.leaderboard.title')}</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {t('home.features.leaderboard.description')}
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  <span>Track your progress</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  <span>Compare with others</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Benefits Section */}
      <div className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 md:p-16 border border-primary-500/20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Perfect for <span className="gradient-text">Learning & Practice</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Whether you're a complete beginner or an experienced trader testing new strategies
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-lg font-bold text-white mb-2">For Beginners</h3>
                <p className="text-sm text-gray-400">Learn the basics of trading without any financial risk</p>
              </div>
              <div className="text-center p-6 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-white mb-2">For Traders</h3>
                <p className="text-sm text-gray-400">Test and refine your trading strategies safely</p>
              </div>
              <div className="text-center p-6 bg-dark-800/50 rounded-xl border border-dark-700/50 sm:col-span-2 lg:col-span-1">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-white mb-2">For Students</h3>
                <p className="text-sm text-gray-400">Practical experience for finance and economics students</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="btn-primary text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5 shadow-2xl hover:shadow-glow inline-flex items-center space-x-3 group"
              >
                <span>{t('home.cta.button')}</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">No credit card required • Start in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="py-12 border-t border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm md:text-base">
              {t('home.disclaimer')}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm max-w-3xl mx-auto">
              This is an educational platform designed for learning purposes only. All trading is done with virtual money.
              No real financial transactions occur. Market data is provided for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

