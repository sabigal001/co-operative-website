import React from 'react';
import { useApp } from '../../context/AppContext';
import type { AdminRole } from '../../types';
import { ShieldCheck, Coins, UserCheck, Eye, Layers } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export const GlobalRoleBar: React.FC = () => {
  const { 
    currentPortal, 
    setCurrentPortal, 
    activeAdminRole, 
    setActiveAdminRole, 
    currentAdmin 
  } = useApp();

  const roles: { role: AdminRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      role: 'master_admin',
      label: 'Master Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
      color: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      desc: 'Full System, Liquidity & Batch Cards'
    },
    {
      role: 'treasurer',
      label: 'Treasurer Admin',
      icon: <Coins className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      desc: 'Deposit Approvals & Disbursements'
    },
    {
      role: 'pa_officer',
      label: 'PA / Admin Officer',
      icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />,
      color: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
      desc: 'Member KYC & Loan Vetting'
    }
  ];

  return (
    <div className="bg-black/90 border-b border-white/10 text-white py-1.5 px-3 sm:px-6 text-xs sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Role Switcher indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px] text-slate-400">
              Demo RBAC Toggle:
            </span>
          </div>

          <div className="flex items-center liquid-glass rounded-xl p-0.5 border border-white/10 shadow-inner">
            {roles.map((item) => {
              const isActive = activeAdminRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    triggerHaptic('medium');
                    setActiveAdminRole(item.role);
                    if (currentPortal !== 'admin') {
                      setCurrentPortal('admin');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all tap-spring ${
                    isActive
                      ? 'liquid-btn-white text-black shadow-sm font-bold scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={item.desc}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active user & Portal jump indicator */}
        <div className="flex items-center gap-3 text-slate-300">
          <div className="hidden md:flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Acting as:</span>
            <span className="font-semibold text-white liquid-glass px-2 py-0.5 rounded-md border border-white/10">
              {currentAdmin.name} ({currentAdmin.department.split('&')[0]})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPortal(currentPortal === 'admin' ? 'member' : 'admin')}
              className="text-[11px] font-bold text-white hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3 h-3" />
              {currentPortal === 'admin' ? 'View Member Portal (PWA)' : 'Open Admin Portal View'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
