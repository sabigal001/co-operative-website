import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Coins, UserCheck, ExternalLink, CreditCard } from 'lucide-react';
import type { SystemMetrics } from '../../types';
import { navigateToService } from '../../utils/subdomainRouter';

interface AdminHeaderProps {
  metrics: SystemMetrics | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ metrics }) => {
  const { activeAdminRole, currentAdmin, setActiveAdminRole } = useApp();

  const roleInfo = {
    master_admin: {
      title: 'Master Administrator (Super Admin)',
      badge: 'Full Root Access',
      badgeColor: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
      icon: <ShieldCheck className="w-5 h-5 text-brand-400" />
    },
    treasurer: {
      title: 'Treasurer & Chief Financial Officer',
      badge: 'Financial Operations Only',
      badgeColor: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
      icon: <Coins className="w-5 h-5 text-brand-400" />
    },
    pa_officer: {
      title: 'PA & Principal Secretariat Officer',
      badge: 'Operations & KYC Focus',
      badgeColor: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
      icon: <UserCheck className="w-5 h-5 text-brand-400" />
    }
  }[activeAdminRole];

  return (
    <div className="bg-black text-white border-b border-white/10">
      
      {/* Standalone Admin Subdomain Top Strip */}
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 text-black flex items-center justify-center font-display font-black text-base shadow-glow">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-white tracking-tight">MOSUNMOLA</span>
                <span className="bg-brand-500/20 text-brand-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border border-brand-500/30">
                  SUPER ADMIN CONSOLE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">admin.mosunmolacoop.com</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigateToService('members')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3 h-3 text-brand-400" />
              <span className="hidden sm:inline">Member Portal</span>
            </button>
            <button
              onClick={() => navigateToService('landing')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-brand-400" />
              <span className="hidden sm:inline">Public Website</span>
            </button>
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
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-400 shadow-md ring-4 ring-brand-500/20"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${roleInfo.badgeColor}`}>
                  {roleInfo.icon}
                  {roleInfo.badge}
                </span>
                <span className="text-slate-400 text-xs font-mono">• {currentAdmin.lastActive}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                {currentAdmin.department}
              </p>
            </div>
          </div>

          {/* Quick RBAC Switcher Pills inside Admin */}
          <div className="bg-[#141414] p-2 rounded-2xl border border-white/10 shadow-inner flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase px-2">Role Switch:</span>
            <button
              onClick={() => setActiveAdminRole('master_admin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeAdminRole === 'master_admin' ? 'bg-brand-500 text-black shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Admin
            </button>
            <button
              onClick={() => setActiveAdminRole('treasurer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeAdminRole === 'treasurer' ? 'bg-brand-500 text-black shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Treasurer
            </button>
            <button
              onClick={() => setActiveAdminRole('pa_officer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeAdminRole === 'pa_officer' ? 'bg-brand-500 text-black shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              PA Officer
            </button>
          </div>
        </div>

        {/* Dynamic Metric Bar */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#061626]/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Total Cooperative Liquidity</span>
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                ₦{(metrics.totalLiquidity / 1000000).toFixed(1)}M
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Liquid Treasury</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061626]/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Pending Deposit Approvals</span>
              <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                {metrics.pendingDepositsCount} Submissions
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Treasurer Queue</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061626]/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Loans in Pipeline</span>
              <span className="text-lg sm:text-xl font-black text-blue-400 font-mono">
                {metrics.pendingLoanVettingsCount + metrics.pendingDisbursementsCount} Total
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {metrics.pendingLoanVettingsCount} Vetting • {metrics.pendingDisbursementsCount} Disbursement
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061626]/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Physical Cards Registered</span>
              <span className="text-lg sm:text-xl font-black text-brand-400 font-mono">
                {metrics.cardsInCirculation.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">In circulation</span>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
  );
};
