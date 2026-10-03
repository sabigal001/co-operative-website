import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  UserPlus, 
  LogIn, 
  ExternalLink, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Building2, 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
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
      <header className="sticky top-0 z-40 bg-[#0A2540]/95 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-300 p-0.5 shadow-glow group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0A2540] rounded-[14px] flex items-center justify-center">
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
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Reg No. LSCS/2018/8941 • Multipurpose Society
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
              <a href="#about" className="hover:text-white transition-colors">
                About Mosunmola
              </a>
              <a href="#products" className="hover:text-white transition-colors">
                Cooperative Solutions
              </a>
              <a href="#calculator" className="hover:text-white transition-colors">
                ROI & Loan Calculator
              </a>
              <a href="#trust" className="hover:text-white transition-colors">
                Board & Governance
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Secretariats
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Member Portal Login (Redirects to members.mosunmolacoop.com) */}
              <button
                onClick={() => navigateToService('members')}
                className="px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-1.5 transition-all"
                title="Access Member Web App"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-400" />
                <span>Member Portal</span>
              </button>

              {/* Become a Member Button */}
              <button
                onClick={onOpenApplyModal}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>Become a Member</span>
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors ml-1"
                aria-label="Open Site Menu"
              >
                <Menu className="w-5 h-5 text-brand-400" />
              </button>
            </div>

            {/* Mobile Hamburger & Quick Apply */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenApplyModal}
                className="px-3 py-1.5 bg-brand-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Join
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-xl border border-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-Out Navigation Drawer / Sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-[#0A2540] border-l border-white/10 text-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-up z-10 p-6 sm:p-8">
            
            {/* Drawer Top */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500 text-slate-950 font-display font-black flex items-center justify-center text-base">
                    M
                  </div>
                  <div>
                    <span className="font-display font-black text-sm text-white tracking-wide block">
                      MOSUNMOLA COOP
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Site Directory & Portals
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Install Mosunmola Coop Member App Card */}
              <div className="bg-gradient-to-br from-[#0F2F4F] to-[#07192C] p-5 rounded-3xl border border-brand-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider block">
                      Installable PWA Web App
                    </span>
                    <h4 className="font-bold text-sm text-white">
                      Install Mosunmola Coop App
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Active members can install the dedicated member web app on their phone home screen for instant digital card pass access and offline wallet tracking.
                </p>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigateToService('members');
                  }}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Launch & Install Member App</span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                  Explore Mosunmola
                </span>
                
                {[
                  { label: 'About Our Society', href: '#about' },
                  { label: 'Target Thrift & Savings Plans', href: '#products' },
                  { label: 'Low-Interest Member Loans (5%)', href: '#products' },
                  { label: 'Real Estate & Agro Co-Ownership', href: '#products' },
                  { label: 'Savings Yield & Loan Simulator', href: '#calculator' },
                  { label: 'Board of Trustees & Compliance', href: '#trust' },
                  { label: 'Branch Secretariat Directory', href: '#contact' },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-sm font-medium text-slate-200 hover:text-brand-300 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </a>
                ))}
              </div>

              {/* Subdomain Portal Access */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                  Cooperative Portals
                </span>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigateToService('members');
                  }}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-brand-500 hover:text-slate-950 text-left text-xs font-bold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-brand-400 group-hover:text-slate-950" />
                    <span>Member Portal (members.mosunmolacoop.ng)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigateToService('admin');
                  }}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-purple-900/60 text-left text-xs font-bold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Admin Staff Portal (admin.mosunmolacoop.ng)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Drawer Bottom Secretariat Info */}
            <div className="pt-6 border-t border-white/10 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>14 Commercial Avenue, Ikeja, Lagos</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>+234 (1) 489-0021</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Lagos State Ministry of Commerce & Cooperatives Registration: LSCS/2018/8941
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
