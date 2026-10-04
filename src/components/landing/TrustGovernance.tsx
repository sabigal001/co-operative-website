import React from 'react';
import { ShieldCheck, Award, FileCheck2, Scale, Building } from 'lucide-react';

export const TrustGovernance: React.FC = () => {
  const trustees = [
    {
      name: 'Alhaji Moshood Sanusi',
      role: 'President & Chairman of Trustees',
      desc: 'Former Director of Treasury & Cooperative Banking. Over 28 years in micro-finance stewardship.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Deaconess Maryam Awolowo',
      role: 'Chief Treasurer & Controller',
      desc: 'Chartered Accountant (FCA). Oversees strict liquidity ratios, audits, and disbursement approvals.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Chief (Dr.) Babatunde Alabi',
      role: 'General Secretary & Governance',
      desc: 'Senior Research Fellow & Compliance Specialist. Champions member rights and constitutional bye-laws.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Bolanle Davies',
      role: 'Principal Secretariat & KYC Officer',
      desc: 'Operations Lead managing card logistics, member vetting, and daily member dispute resolution.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section id="trust" className="py-20 lg:py-28 bg-black text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compliance Badges Row */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Institutional Integrity & Legal Backing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
            Trust Built on Statutory Governance.
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Mosunmola Cooperative Multipurpose Society is officially registered and audited in full compliance with the Cooperative Societies Laws of Lagos State.
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">Statutory Registration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certificate No: <strong>LSCS/2018/8941</strong> issued by Lagos State Ministry of Commerce, Industry & Cooperatives.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">Annual Audits</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every financial year is independently audited by licensed chartered accounting firms and presented at the AGM.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">NDPR Compliant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria Data Protection Regulation (NDPR) certified. Member personal details and financial records are fully encrypted.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">Dedicated Secretariats</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permanent physical branches in Ikeja, Victoria Island, Lekki, and Surulere for in-person support and ID pickup.
            </p>
          </div>
        </div>

        {/* Board of Trustees Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
              Leadership & Trustees
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Guided by Seasoned Fiduciaries
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustees.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#0E0E0E] rounded-3xl p-5 border border-white/10 hover:border-brand-500/40 transition-all text-center group"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover mb-4 border-2 border-brand-500/40 group-hover:scale-105 transition-transform"
                />
                <h4 className="font-bold text-sm text-white mb-0.5">{t.name}</h4>
                <div className="text-xs text-brand-400 font-medium mb-3">{t.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
