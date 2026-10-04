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
    <section id="products" className="py-20 lg:py-28 dark:bg-black bg-white dark:text-white text-slate-900 border-b dark:border-white/10 border-slate-200 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border dark:border-white/10 border-slate-200 dark:text-white text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Institutional Cooperative Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight dark:text-white text-slate-900">
            Designed for Wealth, Dignity & High Returns.
          </h2>
          <p className="text-sm sm:text-base dark:text-slate-300 text-slate-600 leading-relaxed">
            Statutory multipurpose cooperative solutions engineered to provide structured savings growth, 
            low-interest microcredit, and tangible asset co-ownership.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="liquid-glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group shadow-xl hover:border-emerald-500/30 transition-all"
            >
              {p.highlight && (
                <div className="absolute top-0 right-0 dark:bg-white bg-slate-900 dark:text-black text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md border-b border-l dark:border-white/20 border-slate-700">
                  Featured Program
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-emerald-50 border dark:border-white/15 border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform dark:text-white text-emerald-600">
                    {p.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider dark:bg-white/10 bg-emerald-50 dark:text-emerald-300 text-emerald-700 border dark:border-white/15 border-emerald-200">
                    {p.badge}
                  </span>
                </div>

                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  {p.subtitle}
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display dark:text-white text-slate-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mb-5">
                  {p.description}
                </p>

                <div className="space-y-2 mb-6">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs dark:text-slate-300 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
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
                  className="liquid-btn liquid-btn-white w-full py-2.5"
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
