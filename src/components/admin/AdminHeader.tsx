import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Coins, UserCheck, ExternalLink, CreditCard } from 'lucide-react';
import type { SystemMetrics } from '../../types';
import { navigateToService } from '../../utils/subdomainRouter';
import { CurtainPullCord } from '../common/CurtainThemeSwitch';

interface AdminHeaderProps {
  metrics: SystemMetrics | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ metrics }) => {
  const { activeAdminRole, currentAdmin, setActiveAdminRole, theme } = useApp();

  const roleInfo = {
    master_admin: {
      title: 'Master Administrator (Super Admin)',
      badge: 'Full Root Access',
      badgeColor: 'liquid-glass text-white border-white/15',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    },
    treasurer: {
      title: 'Treasurer & Chief Financial Officer',
      badge: 'Financial Operations Only',
      badgeColor: 'liquid-glass text-white border-white/15',
      icon: <Coins className="w-4 h-4 text-emerald-400" />
    },
    pa_officer: {
      title: 'PA & Principal Secretariat Officer',
      badge: 'Operations & KYC Focus',
      badgeColor: 'liquid-glass text-white border-white/15',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />
    }
  }[activeAdminRole];

  return (
    <div className="bg-black text-white border-b border-white/10">
      
      {/* Standalone Admin Subdomain Top Strip */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl liquid-glass border border-white/15 text-white flex items-center justify-center font-display font-black text-base shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-white tracking-tight">MOSUNMOLA</span>
                <span className="liquid-glass border border-white/10 text-emerald-400 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  SUPER ADMIN CONSOLE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">admin.mosunmolacoop.com</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => navigateToService('members')}
              className="liquid-btn liquid-btn-white py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Member Portal</span>
            </button>
            <button
              onClick={() => navigateToService('landing')}
              className="liquid-btn liquid-btn-default py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            {/* Curtain Pull Cord hanging at the right end */}
            <div className="pl-1 sm:pl-2 ml-0.5 border-l border-slate-200 dark:border-white/15 flex items-center">
              <CurtainPullCord />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Info Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentAdmin.avatar}
              alt={currentAdmin.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-md ring-2 ring-white/10"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${roleInfo.badgeColor}`}>
                  {roleInfo.icon}
                  {roleInfo.badge}
                </span>
                <span className="text-slate-400 text-xs font-mono">• {currentAdmin.lastActive}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {currentAdmin.department}
              </p>
            </div>
          </div>

          {/* Quick RBAC Switcher Pills inside Admin */}
          <div className="liquid-glass p-1.5 rounded-2xl border border-white/10 shadow-inner flex flex-wrap items-center gap-1 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase px-2">Role Switch:</span>
            <button
              onClick={() => setActiveAdminRole('master_admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminRole === 'master_admin' ? 'liquid-btn-white text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Admin
            </button>
            <button
              onClick={() => setActiveAdminRole('treasurer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminRole === 'treasurer' ? 'liquid-btn-white text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Treasurer
            </button>
            <button
              onClick={() => setActiveAdminRole('pa_officer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminRole === 'pa_officer' ? 'liquid-btn-white text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              PA Officer
            </button>
          </div>
        </div>

        {/* Dynamic Metric Bar */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-4 rounded-2xl liquid-glass-card border border-white/10">
              <span className="text-slate-400 block text-[11px]">Total Cooperative Liquidity</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                ₦{(metrics.totalLiquidity / 1000000).toFixed(1)}M
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Liquid Treasury</span>
            </div>

            <div className="p-4 rounded-2xl liquid-glass-card border border-white/10">
              <span className="text-slate-400 block text-[11px]">Pending Deposit Approvals</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                {metrics.pendingDepositsCount} Submissions
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Treasurer Queue</span>
            </div>

            <div className="p-4 rounded-2xl liquid-glass-card border border-white/10">
              <span className="text-slate-400 block text-[11px]">Loans in Pipeline</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                {metrics.pendingLoanVettingsCount + metrics.pendingDisbursementsCount} Total
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {metrics.pendingLoanVettingsCount} Vetting • {metrics.pendingDisbursementsCount} Disbursement
              </span>
            </div>

            <div className="p-4 rounded-2xl liquid-glass-card border border-white/10">
              <span className="text-slate-400 block text-[11px]">Physical Cards Registered</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                {metrics.cardsInCirculation.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">In circulation</span>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
  );
};
