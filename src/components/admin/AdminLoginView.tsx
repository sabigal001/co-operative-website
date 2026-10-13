import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  ExternalLink,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api/authService';
import { navigateToService } from '../../utils/subdomainRouter';
import { triggerHaptic } from '../../utils/haptics';
import { CurtainPullCord } from '../common/CurtainThemeSwitch';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'bootstrap'>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Bootstrap state (first-time setup)
  const [bsEmail, setBsEmail] = useState('');
  const [bsPassword, setBsPassword] = useState('');
  const [bsFullName, setBsFullName] = useState('');
  const [bsSecret, setBsSecret] = useState('');
  const [bsSuccess, setBsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      triggerHaptic('warning');
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login(email, password);
      if (res.success && res.data?.token) {
        triggerHaptic('success');
        const user = res.data.user;
        loginAdmin({
          id: user.id?.toString() || 'ADM-001',
          name: user.fullName || user.full_name || email,
          email: user.email || email,
          role: user.role || 'master_admin',
          lastActive: 'Just now',
          department: user.department || 'Operations',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
        });
        showToast(`Welcome, ${user.fullName || user.full_name || 'Admin'}!`, 'success');
      } else {
        triggerHaptic('error');
        setErrorMessage(res.message || 'Invalid credentials. Check your email and password.');
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      triggerHaptic('error');
      setErrorMessage('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bsEmail.trim() || !bsPassword.trim() || !bsFullName.trim() || !bsSecret.trim()) {
      setErrorMessage('All fields are required for initial setup.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.bootstrapMasterAdmin(bsEmail, bsPassword, bsFullName, bsSecret);
      if (res.success) {
        triggerHaptic('success');
        setBsSuccess(true);
        showToast('Master Admin account created! You can now sign in.', 'success');
        // Switch to login mode with pre-filled email
        setTimeout(() => {
          setEmail(bsEmail);
          setMode('login');
          setBsSuccess(false);
        }, 2000);
      } else {
        triggerHaptic('error');
        setErrorMessage(res.message || 'Bootstrap failed.');
      }
    } catch {
      triggerHaptic('error');
      setErrorMessage('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col transition-colors duration-300">
      {/* Top bar */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-950">
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
                Staff Portal
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

      {/* Main login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo / Hero */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center font-display font-black text-2xl shadow-lg mb-5">
              M
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              Staff Operations Console
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Secure sign-in for authorized cooperative staff only
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Lock className="w-3.5 h-3.5 inline mr-1.5" />
              Staff Sign In
            </button>
            <button
              onClick={() => { setMode('bootstrap'); setErrorMessage(''); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'bootstrap'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
              First-Time Setup
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mosunmolacoop.ng"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In to Operations Console
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                Access is restricted to authorized Mosunmola Cooperative staff.
                <br />
                Contact Master Admin for credentials.
              </p>
            </form>
          )}

          {/* BOOTSTRAP FORM (first-time setup) */}
          {mode === 'bootstrap' && (
            <form onSubmit={handleBootstrap} className="space-y-4">
              {bsSuccess ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Setup Complete!</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Redirecting to sign in...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 mb-2">
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                      <strong>First-time only.</strong> Use this to create the initial Master Admin account. 
                      You'll need the bootstrap secret from your PythonAnywhere environment.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={bsFullName}
                        onChange={(e) => setBsFullName(e.target.value)}
                        placeholder="Alhaji Moshood Sanusi"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={bsEmail}
                        onChange={(e) => setBsEmail(e.target.value)}
                        placeholder="admin@mosunmolacoop.ng"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Choose Password
                      </label>
                      <input
                        type="password"
                        value={bsPassword}
                        onChange={(e) => setBsPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Bootstrap Secret
                      </label>
                      <input
                        type="password"
                        value={bsSecret}
                        onChange={(e) => setBsSecret(e.target.value)}
                        placeholder="From BOOTSTRAP_SECRET env variable"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Setting Up...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Initialize Master Admin Account
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
