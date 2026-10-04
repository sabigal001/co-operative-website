import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalMemberCard } from './DigitalMemberCard';
import { SavingsWallet } from './SavingsWallet';
import { LoanHub } from './LoanHub';
import { AssetPortfolio } from './AssetPortfolio';
import { TransactionHistory } from './TransactionHistory';
import { ProfileSettings } from './ProfileSettings';
import { BottomNav } from './BottomNav';
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
  ExternalLink
} from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

export const MemberPortalView: React.FC = () => {
  const { currentMember, logoutMember, openRegisterModal } = useApp();

  const [activeTab, setActiveTab] = useState<'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile'>('card');

  const navItems = [
    { id: 'card', label: 'Digital ID Pass', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'savings', label: 'Savings & Goals', icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'loans', label: 'Loan Hub', icon: <Coins className="w-4 h-4" /> },
    { id: 'assets', label: 'Asset Portfolio', icon: <Building2 className="w-4 h-4" /> },
    { id: 'history', label: 'Transactions', icon: <Clock className="w-4 h-4" /> },
    { id: 'profile', label: 'Settings', icon: <User className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 md:pb-16">
      
      {/* Standalone Member Subdomain Navbar */}
      <div className="bg-black text-white border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 p-0.5 shadow-glow">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-base text-brand-400">M</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-white tracking-tight">MOSUNMOLA</span>
                <span className="bg-brand-500/20 text-brand-400 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border border-brand-500/30">
                  MEMBER WEB APP (PWA)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">members.mosunmolacoop.com</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => openRegisterModal()}
              className="px-3 py-1.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              title="Activate newly acquired physical RFID plastic card"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Activate Physical Card</span>
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

      {/* Top Welcome Strip */}
      <div className="bg-black text-white border-b border-white/10 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentMember.avatar}
              alt={currentMember.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md ring-4 ring-brand-500/20"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono text-brand-400 bg-brand-500/20 px-2 py-0.5 rounded-md border border-brand-500/30">
                  {currentMember.memberId}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/30">
                  <ShieldCheck className="w-3 h-3 text-brand-400" /> Verified Member
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                {currentMember.fullName}
              </h1>
              <p className="text-xs text-slate-300 font-medium">
                {currentMember.occupation} • {currentMember.bankDetails.bankName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Society Status</span>
              <span className="text-xs font-bold text-brand-400 flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3" /> Financial Member in Good Standing
              </span>
            </div>

            <button
              onClick={logoutMember}
              className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-2xl border border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Desktop Navigation Tabs (Pill Style) */}
        <div className="hidden md:flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-black text-brand-400 shadow-md scale-[1.02] border border-brand-500/30'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

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
