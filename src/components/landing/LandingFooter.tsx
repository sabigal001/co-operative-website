import React from 'react';
import { UserPlus, ArrowRight, ExternalLink, ShieldCheck, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface LandingFooterProps {
  onOpenApplyModal?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenApplyModal }) => {
  return (
    <footer className="bg-black text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CTA Banner in Footer */}
        <div className="bg-gradient-to-r from-brand-600 via-emerald-700 to-black rounded-3xl p-8 sm:p-10 mb-16 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-brand-500/30">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-black bg-white/90 px-3 py-1 rounded-full">
              Statutory Cooperative Membership
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Ready to take charge of your financial future?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Join 14,850+ forward-thinking Nigerians building sustainable wealth with 5% low-interest loans, high-yield thrift, and collective empowerment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenApplyModal}
              className="px-8 py-4 bg-black hover:bg-neutral-900 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-white/10"
            >
              <UserPlus className="w-4 h-4 text-brand-400" />
              <span>Register as a Member</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateToService('members')}
              className="px-5 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all border border-white/15"
            >
              <ExternalLink className="w-4 h-4 text-brand-400" />
              <span>Member Portal Login</span>
            </button>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10 text-xs">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 text-black font-black flex items-center justify-center text-lg font-display shadow-glow">
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
            <div className="text-[11px] text-brand-400 font-mono">
              Reg. No: LSCS/2018/8941 (Lagos State)
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
