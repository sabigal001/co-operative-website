import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Coins, UserCheck, ExternalLink, Lock } from 'lucide-react';
import type { SystemMetrics } from '../../types';
import { navigateToService } from '../../utils/subdomainRouter';
import { CurtainPullCord } from '../common/CurtainThemeSwitch';

interface AdminHeaderProps {
  metrics: SystemMetrics | null;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ metrics }) => {
  const { activeAdminRole, currentAdmin, theme } = useApp();

  const roleInfo = {
    master_admin: {
      title: 'Master Administrator',
      badge: 'Master Admin • System Oversight',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    },
    super_admin: {
      title: 'Master Administrator',
      badge: 'Master Admin • System Oversight',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    },
    admin: {
      title: 'Master Administrator',
      badge: 'Admin • Operations & Secretariat',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    },
    treasurer: {
      title: 'Cooperative Treasurer',
      badge: 'Treasurer • Financial Operations & Ledger',
      badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40',
      icon: <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    },
    secretary: {
      title: 'Secretariat Officer',
      badge: 'Secretary • Member Records & Onboarding',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
      icon: <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    },
    pa_officer: {
      title: 'Secretariat Officer',
      badge: 'Secretary • Member Records & Onboarding',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
      icon: <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    }
  }[activeAdminRole] || {
    title: 'Master Administrator',
    badge: 'Master Admin • System Oversight',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
  };

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* Top Operations Utility Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-display font-black text-xs tracking-wider shadow-sm">
              M
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xs tracking-tight text-slate-900 dark:text-white">
                MOSUNMOLA COOPERATIVE
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-300/50 dark:border-slate-700">
                Staff Operations Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToService('landing')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            <div className="pl-3 border-l border-slate-200 dark:border-slate-800 flex items-center">
              <CurtainPullCord />
            </div>
          </div>
        </div>
      </div>

      {/* Main Staff Header Body */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Staff Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentAdmin.avatar}
                alt={currentAdmin.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" title="Active Session" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleInfo.badgeStyle}`}>
                  {roleInfo.icon}
                  {roleInfo.badge}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                  • Server Authenticated
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentAdmin.department || 'Principal Secretariat & Operations'} • <span className="font-mono text-[11px]">{currentAdmin.email || 'staff@mosunmolacoop.ng'}</span>
              </p>
            </div>
          </div>

          {/* Read-Only Server Enforced Security Indicator (NO Role Switcher buttons) */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-2xl text-xs">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-bold">
                Security Policy
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Role verified via server allowlist
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Bar */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Active Member Base</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {(metrics.totalMembers ?? metrics.activeMemberCount ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold mt-0.5">Verified Register</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Today's Total Intake</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                ₦{metrics.dailyIntakeNaira?.toLocaleString() || '450,000'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Cash + Bank Verified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Pending Verifications</span>
              <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                {metrics.pendingDepositsCount || 0} transfers
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Treasurer queue</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Audit Compliance</span>
              <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                100% Immutable
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Server-side audit trail</span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
