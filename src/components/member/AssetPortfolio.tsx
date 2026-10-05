import React, { useState } from 'react';
import type { MemberProfile, MemberInvestment, InvestmentAsset } from '../../types';
import { initialInvestmentAssets, initialMemberInvestments } from '../../mocks/investments';
import { 
  Building2, 
  Wheat, 
  Award, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AssetPortfolioProps {
  member: MemberProfile;
}

export const AssetPortfolio: React.FC<AssetPortfolioProps> = ({ member }) => {
  const { showToast, fireConfetti } = useApp();

  const [investments, setInvestments] = useState<MemberInvestment[]>(initialMemberInvestments);
  const [selectedCert, setSelectedCert] = useState<MemberInvestment | null>(null);

  const totalAssetValue = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalProjectedPayout = investments.reduce((sum, inv) => sum + inv.projectedPayout, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-black via-zinc-950 to-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Real Estate & Agro Equity Portfolio
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            ₦{totalAssetValue.toLocaleString()}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Projected Maturation Value: <strong className="text-emerald-400 font-mono">₦{totalProjectedPayout.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Allocations</span>
            <span className="text-lg font-black text-white">{investments.length} Projects</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Title Type</span>
            <span className="text-sm font-bold text-emerald-400">Gazette & C of O</span>
          </div>
        </div>
      </div>

      {/* Member Investments Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
          Active Co-Ownership Holdings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-white dark:bg-black rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    {inv.status === 'active' ? 'Active & Appreciating' : 'Matured'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    {inv.certificateNumber}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {inv.assetTitle}
                </h4>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Units Owned:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-sm">{inv.units} Unit(s) / Plots</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Capital Invested:</span>
                    <strong className="text-slate-900 dark:text-white font-mono text-sm">₦{inv.totalInvested.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Acquisition Date:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{inv.purchaseDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Maturity Target:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{inv.maturityDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Exit Yield:</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ₦{inv.projectedPayout.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCert(inv)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-white/10 hover:bg-brand-500 hover:text-slate-950 dark:hover:bg-brand-500 dark:hover:text-black text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Deed Slip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Projects to Co-Own */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Available Institutional Co-Ownership Opportunities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pre-vetted commercial assets open for cooperative subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialInvestmentAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-40 relative overflow-hidden bg-slate-900">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500 text-slate-950 shadow-md">
                  +{asset.annualYieldPercent}% Yield
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 block mb-1">
                    {asset.location}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    {asset.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {asset.description}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-white/10 text-xs mb-3">
                    <span className="text-slate-400">Unit Price:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ₦{asset.unitPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Subscribed for allocation inquiry in ${asset.title}. Secretariat will call you.`, 'success');
                      fireConfetti();
                    }}
                    className="w-full py-2.5 bg-slate-900 dark:bg-brand-500 hover:bg-brand-500 dark:hover:bg-brand-400 hover:text-slate-950 dark:text-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Subscribe to Units</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black text-slate-900 dark:text-white w-full max-w-lg rounded-3xl p-8 border border-slate-200 dark:border-white/15 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-slate-200 dark:border-white/10 pb-5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-black text-brand-400 font-display font-black text-base flex items-center justify-center mx-auto mb-2 border border-white/15">
                M
              </div>
              <h3 className="font-display font-black text-lg text-black dark:text-white">
                MOSUNMOLA COOPERATIVE MULTIPURPOSE SOCIETY
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Certificate of Cooperative Asset Allocation
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Certificate Reference:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCert.certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Registered Beneficiary:</span>
                  <strong className="text-slate-900 dark:text-white">{member.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Member ID Card:</span>
                  <span className="font-mono text-brand-700 dark:text-brand-400 font-bold">{member.memberId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Asset Title:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCert.assetTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Allocated Units:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCert.units} Unit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Capital Value:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">₦{selectedCert.totalInvested.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Sealed by Board of Trustees</span>
                </div>
                <span>Issued in Lagos State, Nigeria</span>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-zinc-800 dark:hover:bg-slate-200 transition-colors"
              >
                Print Official Deed Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
