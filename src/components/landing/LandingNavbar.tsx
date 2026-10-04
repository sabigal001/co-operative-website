import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  UserPlus, 
  Smartphone, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { navigateToService } from '../../utils/subdomainRouter';

interface LandingNavbarProps {
  onOpenApplyModal: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenApplyModal }) => {
  const { theme, toggleTheme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Liquid Glassmorphism Header */}
      <header className="sticky top-3 sm:top-5 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all">
        <div className="liquid-glass rounded-3xl sm:rounded-full px-4 sm:px-6 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-between text-white transition-all">
          
          {/* Brand Logo & Name (No 'COOP' badge) */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-black p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="font-display font-black text-base text-black">M</span>
            </div>
            <div>
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white block leading-none">
                MOSUNMOLA
              </span>
              <p className="text-[9px] text-slate-400 font-medium tracking-wide hidden sm:block mt-0.5">
                Cooperative Society • LSCS/2018/8941
              </p>
            </div>
          </a>

          {/* Action Buttons: Theme Toggle + Become a Member + Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-full border border-white/15 transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-200" />
              )}
            </button>

            <button
              onClick={onOpenApplyModal}
              className="liquid-btn liquid-btn-white text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Become a Member</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 sm:p-2.5 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-full border border-white/15 transition-all active:scale-95"
              aria-label="Open Site Menu"
            >
              <Menu className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile & Responsive Navigation Drawer / Sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Full Screen Overlay with Liquid Glass Backdrop */}
          <div className="fixed inset-0 w-full h-full bg-black/95 backdrop-blur-3xl text-white z-50 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-slide-up">
            
            {/* Top Bar: Brand + Theme Toggle + Close Icon */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-black font-display font-black flex items-center justify-center text-base shadow-sm">
                  M
                </div>
                <div>
                  <span className="font-display font-black text-base text-white tracking-wide block leading-tight">
                    MOSUNMOLA
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Statutory Cooperative Platform
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-200" />}
                  <span className="hidden sm:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Centered Quick Links */}
            <nav className="my-auto py-6 text-center flex flex-col items-center justify-center space-y-3.5 max-w-lg mx-auto w-full">
              {[
                { label: 'About Mosunmola', href: '#about' },
                { label: 'Cooperative Solutions', href: '#products' },
                { label: 'Savings & Loan Calculator', href: '#calculator' },
                { label: 'How Membership Works', href: '#how-it-works' },
                { label: 'Board & Governance', href: '#trust' },
                { label: 'Secretariat Directory', href: '#contact' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="text-lg sm:text-xl font-display font-bold text-slate-200 hover:text-white transition-all py-1 block tracking-tight hover:scale-105 transform"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Bottom Actions: 1. Install App -> 2. WhatsApp -> 3. TikTok */}
            <div className="pt-5 border-t border-white/10 max-w-sm mx-auto w-full space-y-2.5">
              
              {/* 1. Install Mosunmola Coop App (Wide Button) */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigateToService('members');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5 text-brand-400 group-hover:text-white transition-colors" />
                <span>1. Install Mosunmola Coop App</span>
              </button>

              {/* 2. Chat on WhatsApp (Wide Button) */}
              <a
                href="https://wa.me/2348034459901?text=Hello%20Mosunmola%20Cooperative%2C%20I%20would%20like%20to%20learn%20more%20about%20membership"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current transition-colors" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>2. Chat on WhatsApp</span>
              </a>

              {/* 3. Follow on TikTok (Wide Button) */}
              <a
                href="https://www.tiktok.com/@mosunmolacoop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current transition-colors" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>3. Follow on TikTok</span>
              </a>

            </div>

            {/* Bottom Regulatory Tag */}
            <div className="pt-4 text-center text-[10px] text-slate-500 font-mono">
              Lagos State Certified Society LSCS/2018/8941
            </div>

          </div>
        </div>
      )}
    </>
  );
};
