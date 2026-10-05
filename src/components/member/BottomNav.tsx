import React from 'react';
import { CreditCard, PiggyBank, Coins, Building2, User, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface BottomNavProps {
  activeTab: 'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile';
  setActiveTab: (tab: 'card' | 'savings' | 'loans' | 'assets' | 'history' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { showToast } = useApp();

  const tabs = [
    { 
      id: 'card', 
      label: 'ID Pass', 
      icon: <CreditCard className="w-5 h-5" />,
      toast: 'Digital Member ID & Dynamic QR'
    },
    { 
      id: 'savings', 
      label: 'Savings', 
      icon: <PiggyBank className="w-5 h-5" />,
      toast: 'Savings Wallets & Target Thrift'
    },
    { 
      id: 'loans', 
      label: 'Loans', 
      icon: <Coins className="w-5 h-5" />,
      toast: '5% Low-Interest Loan Hub'
    },
    { 
      id: 'assets', 
      label: 'Assets', 
      icon: <Building2 className="w-5 h-5" />,
      toast: 'Real Estate & Agro Co-Ownership'
    },
    { 
      id: 'history', 
      label: 'Ledger', 
      icon: <Clock className="w-5 h-5" />,
      toast: 'Ledger & Transaction Receipts'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <User className="w-5 h-5" />,
      toast: 'Member Profile & Security Settings'
    },
  ] as const;

  const handleTabClick = (tab: typeof tabs[number]) => {
    triggerHaptic('light');
    if (activeTab !== tab.id) {
      setActiveTab(tab.id);
      showToast(`Navigated to: ${tab.toast}`, 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-2xl border-t border-white/10 px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all active:scale-90 ${
                isActive
                  ? 'text-white font-bold scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'liquid-glass text-white shadow-sm border border-white/20' 
                  : 'text-slate-400'
              }`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-white font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
