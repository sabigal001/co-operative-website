import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api/authService';
import { navigateToService } from '../../utils/subdomainRouter';

export const MemberLoginView: React.FC = () => {
  const { loginMember, openRegisterModal, showToast } = useApp();
  const [identifier, setIdentifier] = useState('MCS-2026-8942');
  const [pin, setPin] = useState('8942');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your Membership Card ID or registered email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.loginMember(identifier, pin);
      if (res.success && res.data) {
        loginMember(res.data);
      } else {
        setErrorMessage(res.message || 'Invalid credentials. Please verify your Card ID.');
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      setErrorMessage('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const res = await authService.loginMember('MCS-2026-8942', '8942');
    if (res.data) {
      loginMember(res.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-display font-black flex items-center justify-center text-base shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm text-slate-900 dark:text-white tracking-tight">MOSUNMOLA</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  MEMBER PORTAL
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                members.mosunmolacoop.com
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateToService('landing')}
            className="liquid-btn liquid-btn-default text-xs py-1.5 px-3 rounded-full flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
            <span>Public Website</span>
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Top Accent Icon & Badging */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                Member Portal Sign In
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Access your savings passbook, apply for 5% loans, and review dividends with your physical RFID card.
              </p>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Card ID / Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Physical Member ID or Email
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. MCS-2026-8942"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Member PIN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Security PIN / Password
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Demo: 8942</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4-digit Security PIN"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full liquid-btn liquid-btn-white text-black py-2.5 text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 group active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-black">
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Member Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Login */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>1-Click Test Sign In (Chief Adeleke Balogun)</span>
              </button>
            </div>

            {/* Physical Card Activation CTA */}
            <div className="pt-2 text-center space-y-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Have a new unactivated physical plastic card?
              </span>
              <button
                type="button"
                onClick={() => openRegisterModal()}
                className="liquid-btn liquid-btn-default w-full py-2 text-xs rounded-xl"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Activate Newly Issued Physical Card</span>
              </button>
            </div>

          </div>

          {/* Statutory Footer Badge */}
          <div className="text-center pt-4 text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Lagos State Registered Society LSCS/2018/8941 • NDPR Encrypted</span>
          </div>

        </div>
      </main>

      {/* Bottom Subdomain Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
        Mosunmola Cooperative Multipurpose Society • Member PWA Service
      </footer>

    </div>
  );
};
