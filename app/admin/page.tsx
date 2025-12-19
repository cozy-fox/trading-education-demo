'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Users, TrendingUp, Activity, DollarSign, RefreshCw, Trash2, Shield, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/useTranslation';

export default function AdminPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (user && !user.isAdmin) {
      router.push('/dashboard');
      toast.error(t('admin.accessDenied'));
      return;
    }

    fetchAdminData();
  }, [token, user, router]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, tradesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getTrades(50),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTrades(tradesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetUserBalance = async (userId: string) => {
    try {
      await adminAPI.resetUserBalance(userId);
      toast.success(t('admin.balanceReset'));
      fetchAdminData();
    } catch (error) {
      toast.error(t('admin.balanceResetError'));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;

    try {
      await adminAPI.deleteUser(userId);
      toast.success(t('admin.userDeleted'));
      fetchAdminData();
    } catch (error) {
      toast.error(t('admin.deleteError'));
    }
  };

  if (loading || !user?.isAdmin) {
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

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black gradient-text">{t('admin.title')}</h1>
              <p className="text-dark-300 mt-1">{t('admin.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          {/* Total Users */}
          <div className="glass-card p-6 hover-lift animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mb-1">{stats?.totalUsers || 0}</p>
            <p className="text-sm text-dark-400 font-semibold">{t('admin.totalUsers')}</p>
          </div>

          {/* Total Trades */}
          <div className="glass-card p-6 hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mb-1">{stats?.totalTrades || 0}</p>
            <p className="text-sm text-dark-400 font-semibold">{t('admin.totalTrades')}</p>
          </div>

          {/* Open Trades */}
          <div className="glass-card p-6 hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mb-1">{stats?.openTrades || 0}</p>
            <p className="text-sm text-dark-400 font-semibold">{t('admin.openTrades')}</p>
          </div>

          {/* Closed Trades */}
          <div className="glass-card p-6 hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-dark-600 to-dark-800 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mb-1">{stats?.closedTrades || 0}</p>
            <p className="text-sm text-dark-400 font-semibold">{t('admin.closedTrades')}</p>
          </div>

          {/* Active Assets */}
          <div className="glass-card p-6 hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mb-1">{stats?.activeAssets || 0}</p>
            <p className="text-sm text-dark-400 font-semibold">{t('admin.activeAssets')}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 border-b border-dark-700/50 bg-gradient-to-r from-dark-800/50 to-dark-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{t('admin.users')}</h2>
                <p className="text-sm text-dark-400">{t('admin.manageUsers')}</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.email')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.balance')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.admin')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.joined')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-primary-400 uppercase tracking-wider">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    className="hover:bg-dark-700/50 transition-all duration-300"
                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-white font-semibold">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-white font-black font-mono">{formatCurrency(u.demoBalance)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isAdmin ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-primary-500/20 text-primary-400 flex items-center space-x-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          <span>{t('admin.yes')}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-dark-600/50 text-dark-400 flex items-center space-x-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          <span>{t('admin.no')}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-sm font-medium">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResetUserBalance(u._id)}
                          className="p-2.5 glass hover:bg-primary-500/20 text-primary-400 rounded-lg transition-all duration-300 group"
                          title={t('admin.resetBalance')}
                        >
                          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn-danger p-2.5 group"
                          title={t('admin.deleteUser')}
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

