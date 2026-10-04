import React from 'react';
import { UserPlus, ArrowRight, ExternalLink, ShieldCheck, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface LandingFooterProps {
  onOpenApplyModal?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenApplyModal }) => {
  return (
    <footer className="bg-slate-950 dark:bg-black text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-white/10 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner in Footer */}
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-10 mb-16 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-slate-800 dark:border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900/90 to-slate-950/90 dark:from-black/80 dark:to-slate-950/80">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/10 text-white text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Statutory Cooperative Membership</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Ready to take charge of your financial future?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Join 14,850+ forward-thinking Nigerians building sustainable wealth with 5% low-interest loans, high-yield thrift, and collective empowerment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={onOpenApplyModal}
              className="liquid-btn liquid-btn-white py-2.5 px-5 text-xs flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register as a Member</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateToService('members')}
              className="liquid-btn liquid-btn-default py-2.5 px-5 text-xs flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              <span>Member Portal Login</span>
            </button>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 dark:border-white/10 text-xs">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl liquid-glass border border-white/15 text-white font-black flex items-center justify-center text-lg font-display shadow-sm">
                M
              </div>
              <div>
                <span className="font-display font-black text-base text-white tracking-wide block">
                  MOSUNMOLA
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Cooperative Multipurpose Society
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Pioneering modern cooperative banking, target thrift digitization, zero-collateral micro-credit, and real estate co-ownership in West Africa.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              Reg. No: <span className="text-emerald-400">LSCS/2018/8941</span> (Lagos State)
            </div>
          </div>

          {/* Col 2: Cooperative Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#products" className="hover:text-brand-400 transition-colors">
                  Target Savings & Thrift (Ajo)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-brand-400 transition-colors">
                  5% Low-Interest Member Loans
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-brand-400 transition-colors">
                  Savings ROI Calculator
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-brand-400 transition-colors">
                  Agro & Real Estate Co-Ownership
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-400 transition-colors">
                  Membership Onboarding Process
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Access Subdomains</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => navigateToService('members')} 
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <CreditCard className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <div>
                    <span className="block font-medium">Member Portal</span>
                    <span className="text-[10px] text-slate-500 font-mono">members.mosunmolacoop.com</span>
                  </div>
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => navigateToService('admin')} 
                  className="hover:text-brand-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div>
                    <span className="block font-medium">Super Admin Console</span>
                    <span className="text-[10px] text-slate-500 font-mono">admin.mosunmolacoop.com</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Secretariat Contacts */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Head Secretariat</h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Secretariat House, 14 Commercial Avenue, Ikeja Central, Lagos State, Nigeria.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+234 (1) 489-0021 / +234 803 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>secretariat@mosunmolacoop.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Mosunmola Cooperative Multipurpose Society Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Constitution & Bye-Laws</span>
            <span>•</span>
            <span className="hover:text-slate-400">NDPR Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400">Audit Reports</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
