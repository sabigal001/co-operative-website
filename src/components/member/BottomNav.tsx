import React from 'react';
import { CreditCard, PiggyBank, Coins, Building2, User, Clock } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile';
  setActiveTab: (tab: 'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'card', label: 'ID Pass', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'savings', label: 'Savings', icon: <PiggyBank className="w-5 h-5" /> },
    { id: 'loans', label: 'Loans', icon: <Coins className="w-5 h-5" /> },
    { id: 'assets', label: 'Assets', icon: <Building2 className="w-5 h-5" /> },
    { id: 'history', label: 'Ledger', icon: <Clock className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A2540]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-brand-500/20 shadow-glow' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
