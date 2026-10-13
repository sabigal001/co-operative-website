import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api/authService';
import { navigateToService } from '../../utils/subdomainRouter';
import { triggerHaptic } from '../../utils/haptics';

export const MemberLoginView: React.FC = () => {
  const { loginMember, showToast } = useApp();

  // Sign In Form State
  const [identifier, setIdentifier] = useState('MCS-2026-8942');
  const [password, setPassword] = useState('+234 803 456 7890');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      triggerHaptic('warning');
      setErrorMessage('Please enter your Membership ID, phone, or email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.loginMember(identifier, password);
      if (res.success && res.data) {
        triggerHaptic('success');
        loginMember(res.data);
      } else {
        triggerHaptic('error');
        setErrorMessage(res.message || 'Invalid credentials. Please verify your membership ID.');
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      triggerHaptic('error');
      setErrorMessage('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-display font-black flex items-center justify-center text-sm shadow-sm">
              M
            </div>
            <div>
              <span className="font-display font-black text-sm text-slate-900 dark:text-white tracking-tight">
                MOSUNMOLA COOPERATIVE
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateToService('landing')}
            className="text-xs py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-4">
          
          <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden space-y-5">
            
            {/* Header Description */}
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center mx-auto shadow-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                Member Portal Sign In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                View your verified savings, transparent Ajo deductions, and loan repayments.
              </p>
            </div>

            {/* Prominent Info Banner explaining that Phone Number is Password */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 shadow-sm">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold">Password Notice:</span> Your account password is your <strong>registered phone number</strong> (e.g. <code>08012345678</code>) as recorded in the secretariat database.
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Membership ID, Registered Phone, or Email
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. MCS-2026-8942 or 08034567890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>Password</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>Your registered phone number</span>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your phone number (e.g. 08034567890)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sign In to Member Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Read-Only Information Note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Financial records in the member portal are strictly read-only. Transactions and Ajo deposits are credited directly by authorized secretariat cashiers.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-white/10">
        Mosunmola Cooperative Multipurpose Society • Registered Under Cooperative Societies Law
      </footer>

    </div>
  );
};
