import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Download, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPortal, 
    setCurrentPortal, 
    openRegisterModal, 
    triggerInstallPrompt, 
    currentMember, 
    isLoggedIn, 
    logoutMember,
    activeAdminRole
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-[33px] z-40 bg-[#0A2540]/90 backdrop-blur-xl border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => { setCurrentPortal('landing'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-300 p-0.5 shadow-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A2540] rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="font-display font-black text-xl text-brand-400">M</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  MOSUNMOLA
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  COOP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block tracking-wide">
                Multipurpose Society Ltd.
              </p>
            </div>
          </div>

          {/* Center: Main Portal Switcher (Chowdeck Pill Style) */}
          <nav className="hidden lg:flex items-center bg-[#07192C] p-1.5 rounded-full border border-white/10 shadow-inner">
            <button
              onClick={() => setCurrentPortal('landing')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                currentPortal === 'landing'
                  ? 'bg-brand-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Public Website
            </button>

            <button
              onClick={() => setCurrentPortal('member')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                currentPortal === 'member'
                  ? 'bg-brand-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Member Portal
              <span className="text-[9px] uppercase tracking-wider bg-slate-900/30 px-1.5 py-0.5 rounded-full font-black">
                PWA
              </span>
            </button>

            <button
              onClick={() => setCurrentPortal('admin')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                currentPortal === 'admin'
                  ? 'bg-brand-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold ${
                activeAdminRole === 'master_admin' ? 'bg-purple-900/80 text-purple-300' :
                activeAdminRole === 'treasurer' ? 'bg-emerald-900/80 text-emerald-300' :
                'bg-blue-900/80 text-blue-300'
              }`}>
                {activeAdminRole === 'master_admin' ? 'Super' : activeAdminRole === 'treasurer' ? 'Treasurer' : 'PA'}
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Install PWA Button */}
            <button
              onClick={triggerInstallPrompt}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-1.5 transition-all"
              title="Install App as PWA"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Install App</span>
            </button>

            {/* Activate Physical Card Button */}
            <button
              onClick={() => openRegisterModal()}
              className="px-4 py-2.5 bg-gradient-to-r from-brand-500 to-emerald-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2 hover:shadow-glow transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Activate Physical Card</span>
            </button>

            {/* Member Profile Avatar or Quick Switch */}
            {isLoggedIn && currentPortal === 'member' ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.fullName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-brand-500 ring-2 ring-brand-500/20"
                />
                <button
                  onClick={logoutMember}
                  className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openRegisterModal()}
              className="px-3 py-1.5 bg-brand-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Activate</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07192C] border-b border-white/10 px-4 py-6 space-y-4 animate-slide-up">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Select Interface
            </div>

            <button
              onClick={() => { setCurrentPortal('landing'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-2xl text-left text-sm font-bold flex items-center justify-between ${
                currentPortal === 'landing' ? 'bg-brand-500 text-slate-950' : 'text-slate-200 bg-white/5'
              }`}
            >
              <span>Public Landing Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setCurrentPortal('member'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-2xl text-left text-sm font-bold flex items-center justify-between ${
                currentPortal === 'member' ? 'bg-brand-500 text-slate-950' : 'text-slate-200 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Member Portal (PWA Web App)</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-brand-400 px-2 py-0.5 rounded-full">
                Dashboard
              </span>
            </button>

            <button
              onClick={() => { setCurrentPortal('admin'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-2xl text-left text-sm font-bold flex items-center justify-between ${
                currentPortal === 'admin' ? 'bg-brand-500 text-slate-950' : 'text-slate-200 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-brand-400 px-2 py-0.5 rounded-full">
                {activeAdminRole.replace('_', ' ')}
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => { openRegisterModal(); setMobileMenuOpen(false); }}
              className="w-full py-3 bg-brand-500 text-slate-950 font-bold rounded-2xl text-center flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Activate Physical Member ID</span>
            </button>

            <button
              onClick={() => { triggerInstallPrompt(); setMobileMenuOpen(false); }}
              className="w-full py-3 bg-white/5 text-slate-200 font-bold rounded-2xl text-center flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-brand-400" />
              <span>Install PWA to Home Screen</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
