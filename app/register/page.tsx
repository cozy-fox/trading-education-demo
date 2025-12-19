'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, Lock, User, ArrowRight, Sparkles, DollarSign } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const { t, isLoading: translationLoading } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.register.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t('auth.register.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      toast.success(t('auth.register.success'));
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || t('auth.register.error'));
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
    <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden py-8 sm:py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Back to Home - Top Left */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 glass-card hover:bg-dark-700/50 transition-all duration-300 group border border-success-500/30 hover:border-success-500/50"
        >
          <svg className="w-4 h-4 text-success-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-white font-semibold text-sm hidden sm:inline">{t('nav.home')}</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10 animate-fade-in">
        <div className="glass-card p-8 sm:p-10 shadow-2xl border border-success-500/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl mb-4 shadow-glow-success">
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{t('auth.register.title')}</h1>
            <p className="text-gray-400 flex items-center justify-center space-x-2 text-sm sm:text-base">
              <DollarSign className="w-4 h-4 text-success-400" />
              <span>{t('auth.register.subtitle')}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-white">
                  {t('auth.register.firstName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-success-500"
                    placeholder={t('auth.register.firstNamePlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-white">
                  {t('auth.register.lastName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-success-500"
                    placeholder={t('auth.register.lastNamePlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white">
                {t('auth.register.email')}
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
                  className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-success-500"
                  placeholder={t('auth.register.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white">
                {t('auth.register.password')}
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
                  className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-success-500"
                  placeholder={t('auth.register.passwordPlaceholder')}
                />
              </div>
              <p className="text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white">
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input pl-12 bg-dark-900/50 border-dark-600 focus:border-success-500"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-success w-full group mt-6"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? t('auth.register.registering') : t('auth.register.registerButton')}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {t('auth.register.haveAccount')}{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 glass rounded-xl border-2 border-success-500/40 bg-success-500/10">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-success-400 text-sm font-bold mb-1">
                  Get $10,000 Virtual Balance
                </p>
                <p className="text-gray-400 text-xs">
                  Start trading immediately with no risk
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
            Join thousands of learners practicing trading in a safe, risk-free environment.
          </p>
        </div>
      </div>
    </div>
  );
}

