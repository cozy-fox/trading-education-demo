'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const { t, isLoading: translationLoading } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      toast.success(t('auth.login.success'));
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  if (translationLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="shimmer w-32 h-32 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Back to Home - Top Left */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 glass-card hover:bg-dark-700/50 transition-all duration-300 group border border-primary-500/30 hover:border-primary-500/50"
        >
          <svg className="w-4 h-4 text-primary-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-white font-semibold text-sm hidden sm:inline">{t('nav.home')}</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10 animate-fade-in">
        <div className="glass-card p-8 sm:p-10 shadow-2xl border border-primary-500/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-glow">
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{t('auth.login.title')}</h1>
            <p className="text-gray-400 flex items-center justify-center space-x-2 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-warning-400" />
              <span>{t('auth.login.subtitle')}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-primary-500"
                  placeholder={t('auth.login.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-primary-500"
                  placeholder={t('auth.login.passwordPlaceholder')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group mt-6"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {t('auth.login.noAccount')}{' '}
              <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                {t('auth.login.registerLink')}
              </Link>
            </p>
          </div>

          {/* Demo Warning */}
          <div className="mt-6 p-4 glass rounded-xl border-2 border-warning-500/40 bg-warning-500/10">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-warning-400 text-sm font-bold text-center">
                {t('common.demo')} - No real money involved
              </p>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
            This is a safe learning environment. Practice trading without any financial risk.
          </p>
        </div>
      </div>
    </div>
  );
}

