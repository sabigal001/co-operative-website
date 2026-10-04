import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  UserPlus, 
  Smartphone, 
  ArrowRight
} from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface LandingNavbarProps {
  onOpenApplyModal: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenApplyModal }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Liquid Glassmorphism Header */}
      <header className="sticky top-3 sm:top-5 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all">
        <div className="bg-black/75 backdrop-blur-2xl border border-white/15 rounded-3xl sm:rounded-full px-5 sm:px-7 py-3.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] flex items-center justify-between text-white transition-all">
          
          {/* Brand Logo & Name (No 'COOP' badge) */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 p-0.5 shadow-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-brand-400">M</span>
              </div>
            </div>
            <div>
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white block">
                MOSUNMOLA
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Cooperative Multipurpose Society • LSCS/2018/8941
              </p>
            </div>
          </a>

          {/* Action Buttons: Become a Member + Hamburger Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenApplyModal}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs sm:text-xs rounded-xl sm:rounded-full flex items-center gap-1.5 shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-black" />
              <span>Become a Member</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2.5 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-full border border-white/15 transition-all"
              aria-label="Open Site Menu"
            >
              <Menu className="w-5 h-5 text-brand-400" />
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile & Responsive Navigation Drawer / Sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Full Screen Overlay with Liquid Glass Backdrop */}
          <div className="fixed inset-0 w-full h-full bg-black/95 backdrop-blur-3xl text-white z-50 flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-slide-up">
            
            {/* Top Bar: Brand + Close Icon */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 text-black font-display font-black flex items-center justify-center text-lg shadow-glow">
                  M
                </div>
                <div>
                  <span className="font-display font-black text-lg text-white tracking-wide block">
                    MOSUNMOLA
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Statutory Cooperative Platform
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="p-3 rounded-2xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Centered Quick Links */}
            <nav className="my-auto py-8 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto w-full">
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
                  className="text-xl sm:text-2xl font-display font-bold text-slate-200 hover:text-brand-400 transition-colors py-1.5 block tracking-tight hover:scale-105 transform"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Bottom Actions: 1. Install App -> 2. WhatsApp -> 3. TikTok */}
            <div className="pt-6 border-t border-white/10 max-w-md mx-auto w-full space-y-3">
              
              {/* 1. Install Mosunmola Coop App (Wide Button) */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigateToService('members');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-brand-500 hover:text-black border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm group"
              >
                <Smartphone className="w-4 h-4 text-brand-400 group-hover:text-black transition-colors" />
                <span>1. Install Mosunmola Coop App</span>
              </button>

              {/* 2. Chat on WhatsApp (Wide Button) */}
              <a
                href="https://wa.me/2348034459901?text=Hello%20Mosunmola%20Cooperative%2C%20I%20would%20like%20to%20learn%20more%20about%20membership"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] hover:text-black border border-[#25D366]/30 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:text-black transition-colors" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>2. Chat on WhatsApp</span>
              </a>

              {/* 3. Follow on TikTok (Wide Button) */}
              <a
                href="https://www.tiktok.com/@mosunmolacoop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white hover:text-black border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current group-hover:text-black transition-colors" viewBox="0 0 24 24">
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
