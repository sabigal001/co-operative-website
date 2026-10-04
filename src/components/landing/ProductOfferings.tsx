import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PiggyBank, 
  Coins, 
  Building2, 
  Wheat, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Percent
} from 'lucide-react';

export const ProductOfferings: React.FC = () => {
  const { openRegisterModal, setCurrentPortal } = useApp();

  const products = [
    {
      id: 'savings',
      title: 'Target Savings & Daily Thrift (Ajo)',
      subtitle: 'Discipline Meets Guaranteed Returns',
      badge: 'Up to 18.5% p.a.',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Digitized traditional thrift. Lock automated daily, weekly, or monthly savings towards land downpayments, festive holidays, or business ventures with annual dividend profit shares.',
      features: [
        'Automated bank standing order or voluntary top-up',
        'Strict lock protection with emergency liquidation',
        'Compound annual profit allocation at AGM',
        'Track daily balances on your mobile PWA'
      ],
      icon: <PiggyBank className="w-6 h-6 text-brand-400" />,
      cta: 'Start A Savings Plan',
      accentColor: 'hover:border-brand-500/50',
      highlight: true
    },
    {
      id: 'loans',
      title: 'Low-Interest Member Loans',
      subtitle: 'Zero Collateral • Flat 5% Rate',
      badge: '5% Flat Rate',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Access non-predatory credit directly from your cooperative pool. Enjoy up to 200% of your voluntary savings balance backed simply by 2 verified co-members as guarantors.',
      features: [
        'Zero physical land or car collateral required',
        'Repayment duration from 1 to 12 months',
        'Fast PA officer vetting & Treasurer disbursement',
        'No hidden management fees or penalties'
      ],
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      cta: 'Apply For Member Loan',
      accentColor: 'hover:border-amber-500/50',
      highlight: false
    },
    {
      id: 'real-estate',
      title: 'Prime Land & Real Estate Co-Ownership',
      subtitle: 'Ibeju-Lekki & Coastal Expressway',
      badge: '24.5% Capital Gain',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'Institutional land banking made accessible to individual members. Co-own surveyed and gazetted estate layouts in high-growth corridors with flexible installment thrift deduction.',
      features: [
        'Registered cooperative master survey & Gazette',
        'Direct site allocation upon completion of thrift',
        'Instant digital Deed of Assignment',
        'Inspected and verified by cooperative legal counsel'
      ],
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      cta: 'Explore Real Estate Plots',
      accentColor: 'hover:border-blue-500/50',
      highlight: false
    },
    {
      id: 'agro',
      title: 'Agro-Processing & Dividend Sharing',
      subtitle: 'Cassava & Palm Oil Value Addition',
      badge: '21.0% Yield',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: 'Cooperative equity participation in commercial garri and palm oil milling factories in Ogun and Oyo state. Members receive quarterly harvests and manufacturing dividends.',
      features: [
        'Underwritten and insured by Leadway Assurance',
        'Guaranteed off-take supply contracts with FMCG brands',
        'Transparent dividend distribution directly to wallet',
        'Quarterly site visitations and member inspections'
      ],
      icon: <Wheat className="w-6 h-6 text-rose-400" />,
      cta: 'View Agro Opportunities',
      accentColor: 'hover:border-rose-500/50',
      highlight: false
    }
  ];

  return (
    <section id="products" className="py-20 lg:py-28 bg-black text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Cooperative Products
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
            Designed for Wealth, Dignity & High Returns.
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Inspired by Nigeria’s most trusted cooperative institutions (IMSSM & FLAP Coop), 
            engineered into a seamless digital experience.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-8 bg-[#0E0E0E] border border-white/10 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between relative overflow-hidden group ${p.accentColor}`}
            >
              {p.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-500 to-emerald-400 text-black font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {p.subtitle}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {p.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (p.id === 'savings' || p.id === 'loans') {
                      setCurrentPortal('member');
                    } else {
                      openRegisterModal();
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-brand-500 text-white hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-brand-400 transition-all active:scale-95 group/btn"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
