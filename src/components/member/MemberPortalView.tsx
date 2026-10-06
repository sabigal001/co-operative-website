import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalMemberCard } from './DigitalMemberCard';
import { SavingsWallet } from './SavingsWallet';
import { LoanHub } from './LoanHub';
import { AssetPortfolio } from './AssetPortfolio';
import { TransactionHistory } from './TransactionHistory';
import { ProfileSettings } from './ProfileSettings';
import { BottomNav } from './BottomNav';
import { FluidPillBar } from '../common/FluidPillBar';
import {
  CreditCard,
  PiggyBank,
  Coins,
  Building2,
  Clock,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  ExternalLink,
  Download
} from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';
import { MemberLoginView } from './MemberLoginView';
import { CurtainPullCord } from '../common/CurtainThemeSwitch';
import { triggerHaptic } from '../../utils/haptics';

export const MemberPortalView: React.FC = () => {
  const { currentMember, logoutMember, openRegisterModal, theme, isLoggedIn, isAppInstalled, openInstallBanner } = useApp();

  const [activeTab, setActiveTab] = useState<'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile'>('card');

  // If unauthenticated, display Member Login View
  if (!isLoggedIn) {
    return <MemberLoginView />;
  }

  const navItems = [
    { id: 'card', label: 'Digital ID Pass', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'savings', label: 'Savings & Goals', icon: <PiggyBank className="w-3.5 h-3.5" /> },
    { id: 'loans', label: 'Loan Hub', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'assets', label: 'Asset Portfolio', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'Transactions', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'profile', label: 'Settings', icon: <User className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 pb-28 md:pb-16 transition-colors duration-300">

      {/* Standalone Member Subdomain Navbar */}
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl liquid-glass border border-white/15 p-0.5 shadow-sm shrink-0">
              <div className="w-full h-full bg-black/80 rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-sm sm:text-base text-white">M</span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight truncate block">
                MOSUNMOLA
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {!isAppInstalled && (
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  openInstallBanner();
                }}
                className="liquid-btn liquid-btn-primary py-1.5 px-2.5 sm:px-3 text-xs flex items-center gap-1.5"
                title="Install Mosunmola Member PWA"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Activate Physical Card - Laptop only (hidden on mobile) */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => openRegisterModal()}
                className="liquid-btn liquid-btn-white text-black font-bold py-1.5 px-3 text-xs flex items-center gap-1.5"
                title="Activate newly acquired physical RFID plastic card"
              >
                <CreditCard className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Activate Physical Card</span>
              </button>
            </div>

            <button
              onClick={() => navigateToService('landing')}
              className="liquid-btn liquid-btn-default py-1.5 px-2 sm:px-3 text-xs flex items-center gap-1.5"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <span className="hidden md:inline">Public Site</span>
            </button>

            {/* Curtain Pull Cord hanging at the right end */}
            <div className="pl-1 sm:pl-2 ml-0.5 border-l border-slate-200 dark:border-white/15 flex items-center">
              <CurtainPullCord />
            </div>
          </div>
        </div>
      </div>

      {/* Top Welcome Strip */}
      <div className="bg-slate-100 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pt-5 pb-10 sm:pt-6 sm:pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <img
              src={currentMember.avatar}
              alt={currentMember.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-300 dark:border-white/20 shadow-md ring-2 ring-slate-200 dark:ring-white/10 shrink-0 aspect-square"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                <span className="text-[11px] sm:text-xs font-bold font-mono text-slate-900 dark:text-white bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-md border border-slate-300 dark:border-white/15">
                  {currentMember.memberId}
                </span>
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Verified Member
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-slate-900 dark:text-white truncate">
                {currentMember.fullName}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                {currentMember.occupation} • {currentMember.bankDetails.bankName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/10">
            <div className="p-2 sm:p-3 liquid-glass rounded-2xl border border-slate-200 dark:border-white/10 text-left sm:text-right flex-1 sm:flex-initial min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Society Status</span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white flex items-center justify-start sm:justify-end gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Active Financial Member</span>
              </span>
            </div>

            <button
              onClick={logoutMember}
              className="liquid-btn liquid-btn-default py-2 sm:py-2.5 px-3 sm:px-3.5 text-xs flex items-center gap-1.5 hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-300 transition-colors shrink-0"
              title="Sign Out to Login Page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

        {/* Desktop Navigation Tabs (Sliding Fluid Pill Style) */}
        <FluidPillBar
          tabs={navItems}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          className="hidden md:flex mb-8"
        />

        {/* Tab View Render */}
        <div className="animate-slide-up">
          {activeTab === 'card' && <DigitalMemberCard member={currentMember} />}
          {activeTab === 'savings' && <SavingsWallet member={currentMember} />}
          {activeTab === 'loans' && <LoanHub member={currentMember} />}
          {activeTab === 'assets' && <AssetPortfolio member={currentMember} />}
          {activeTab === 'history' && <TransactionHistory member={currentMember} />}
          {activeTab === 'profile' && <ProfileSettings member={currentMember} />}
        </div>

      </div>

      {/* Mobile-Only Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
