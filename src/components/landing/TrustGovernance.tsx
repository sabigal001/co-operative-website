import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Scale,
  Building,
  ChevronDown,
  HelpCircle,
  Sparkles,
  ArrowRight,
  PiggyBank,
  Coins,
  CreditCard,
  Building2,
  PhoneCall
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface TrustGovernanceProps {
  onOpenApplyModal?: () => void;
}

type FaqCategory = 'all' | 'loans' | 'savings' | 'cards' | 'safety';

interface FaqItem {
  id: number;
  category: FaqCategory;
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  question: string;
  answer: string;
}

export const TrustGovernance: React.FC<TrustGovernanceProps> = ({ onOpenApplyModal }) => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openFaqId, setOpenFaqId] = useState<number | null>(1); // First question open by default

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'loans',
      categoryLabel: '5% Member Loans',
      categoryIcon: <Coins className="w-3.5 h-3.5 text-amber-500" />,
      question: 'How do the 5% flat interest member loans work without collateral?',
      answer: 'Mosunmola Cooperative operates under statutory thrift and credit society bye-laws. Instead of commercial banking collateral (like land titles or car logbooks), active members qualify for low-interest credit up to 200% of their voluntary savings balance. The facility is secured purely by 2 verified co-members vouching as guarantors, with fixed 5.0% flat interest and flexible tenors from 1 to 12 months.'
    },
    {
      id: 2,
      category: 'savings',
      categoryLabel: 'Savings & Dividends',
      categoryIcon: <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />,
      question: 'When and how are member dividends & annual surpluses distributed?',
      answer: 'Surplus revenue generated from cooperative operations—including certified agro-processing in Ogun/Oyo state, surveyed land banking co-ownership, and microcredit repayments—is independently audited at the close of each financial year. Declared surpluses are approved at the Annual General Meeting (AGM) and credited directly to each member’s savings wallet proportional to their voluntary contributions and share capital.'
    },
    {
      id: 3,
      category: 'cards',
      categoryLabel: 'Smart RFID Card',
      categoryIcon: <CreditCard className="w-3.5 h-3.5 text-blue-500" />,
      question: 'How do I obtain and activate my physical smart RFID member card?',
      answer: 'Members can collect their physical smart NFC/RFID card from any of our 4 permanent branch secretariats (Ikeja, Victoria Island, Lekki, or Surulere) or request secure door-to-door courier dispatch. Once you hold your card, click “Activate Physical Card” on this website or in the Member Web App, enter your 8-digit Card ID (MOS-2026-XXXX), and set your card PIN in under 30 seconds.'
    },
    {
      id: 4,
      category: 'safety',
      categoryLabel: 'Legal Protection',
      categoryIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
      question: 'How are member funds safeguarded under Lagos State Cooperative laws?',
      answer: 'Mosunmola Cooperative Multipurpose Society is officially chartered under Certificate No: LSCS/2018/8941 by the Lagos State Ministry of Commerce, Industry & Cooperatives. The society maintains an audited 35% statutory liquidity reserve ratio in licensed custodian institutions, enforces strict dual-signatory approvals (PA KYC Officer + Chief Treasurer), and undergoes external statutory audits presented annually.'
    },
    {
      id: 5,
      category: 'safety',
      categoryLabel: 'Eligibility',
      categoryIcon: <Building2 className="w-3.5 h-3.5 text-purple-500" />,
      question: 'Can private entrepreneurs and non-civil servants join Mosunmola?',
      answer: 'Yes. While founded alongside disciplined civil service groups, our amended constitution enables forward-thinking business owners, tech professionals, civil servants, and corporate employees across Nigeria to join. Prospective members only require a valid government-issued ID (NIN, Driver’s License, or International Passport) and proof of active income to complete vetting.'
    },
    {
      id: 6,
      category: 'savings',
      categoryLabel: 'Savings Withdrawals',
      categoryIcon: <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />,
      question: 'Can I withdraw my voluntary savings balance at any time?',
      answer: 'Yes. Regular voluntary savings can be withdrawn directly to your linked commercial bank account on-demand via the Member Portal PWA, provided the requested funds are not currently pledged as direct loan backing or held as an active guarantor bond for another borrower’s outstanding facility.'
    }
  ];

  const categories: { id: FaqCategory; label: string }[] = [
    { id: 'all', label: 'All Questions' },
    { id: 'loans', label: '5% Loans' },
    { id: 'savings', label: 'Savings & Dividends' },
    { id: 'cards', label: 'Smart RFID Card' },
    { id: 'safety', label: 'Legal & Safety' }
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id: number) => {
    triggerHaptic('selection');
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="trust" className="py-20 lg:py-28 bg-white dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <Scale className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Institutional Integrity & Legal Backing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            Trust Built on Statutory Governance.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Mosunmola Cooperative Multipurpose Society is officially registered and audited in full compliance with the Cooperative Societies Laws of Lagos State.
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-3xl liquid-glass-card border border-slate-200 dark:border-white/10 space-y-3 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-white/20">
            <div className="w-11 h-11 rounded-2xl liquid-glass border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Statutory Registration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Certificate No: <strong className="text-slate-900 dark:text-white">LSCS/2018/8941</strong> issued by Lagos State Ministry of Commerce, Industry & Cooperatives.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-slate-200 dark:border-white/10 space-y-3 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-white/20">
            <div className="w-11 h-11 rounded-2xl liquid-glass border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Annual Audits</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every financial year is independently audited by licensed chartered accounting firms and presented at the AGM.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-slate-200 dark:border-white/10 space-y-3 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-white/20">
            <div className="w-11 h-11 rounded-2xl liquid-glass border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">NDPR Compliant</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nigeria Data Protection Regulation (NDPR) certified. Member personal details and financial records are fully encrypted.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-slate-200 dark:border-white/10 space-y-3 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-white/20">
            <div className="w-11 h-11 rounded-2xl liquid-glass border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Dedicated Secretariats</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Permanent physical branches in Ikeja, Victoria Island, Lekki, and Surulere for in-person support and ID pickup.
            </p>
          </div>
        </div>

        {/* Interactive FAQ & Knowledge Accordion Section (Replaces Trustees) */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Know.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              Transparent answers regarding our 5% loan criteria, dividend payouts, RFID card logistics, and member rights.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveCategory(cat.id);
                }}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all tap-spring border ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`liquid-glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-emerald-500/50 dark:border-emerald-400/50 shadow-lg'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 shrink-0">
                        {faq.categoryIcon}
                      </span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {faq.question}
                      </h4>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Answer Drawer */}
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-slate-100 dark:border-white/5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Secretariat Support / Apply CTA Banner */}
          <div className="max-w-3xl mx-auto mt-12 p-6 sm:p-8 rounded-3xl liquid-glass border border-slate-200 dark:border-white/15 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Build Wealth Together?</span>
              </div>
              <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">
                Have an inquiry or ready to register?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speak directly with Secretariat officers at our Ikeja or VI branch, or begin online onboarding.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  if (onOpenApplyModal) onOpenApplyModal();
                }}
                className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2.5 px-5 rounded-xl shadow-md tap-spring"
              >
                <span>Apply for Membership</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
