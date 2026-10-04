import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembershipApplicationModal: React.FC<MembershipApplicationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast, fireConfetti, refreshData } = useApp();

  const [loading, setLoading] = useState(false);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [address, setAddress] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(50000);
  const [idType, setIdType] = useState<'NIN' | 'Drivers License' | 'International Passport' | 'Voters Card'>('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [reason, setReason] = useState('Target thrift savings and eligibility for 5% low-interest business credit.');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await adminService.submitMembershipApplication({
        fullName,
        email,
        phone,
        occupation,
        state,
        lga,
        address: address || `${lga}, ${state}`,
        monthlyThriftTarget: Number(monthlyTarget),
        idType,
        idNumber,
        reasonForJoining: reason,
        nextOfKinName: nextOfKinName || undefined,
        nextOfKinPhone: nextOfKinPhone || undefined
      });

      if (res.success && res.data) {
        setSuccessAppId(res.data.id);
        fireConfetti();
        showToast('Membership application submitted to Super Admin!', 'success');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting application', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessAppId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0A0A0A] border border-white/15 text-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-slide-up relative">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-glow">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white leading-tight">
                Apply for Society Membership
              </h3>
              <p className="text-xs text-slate-400">
                Mosunmola Cooperative Multipurpose Society Limited
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successAppId ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-glow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                Application Received by Secretariat
              </span>
              <h4 className="font-display font-black text-2xl text-white">
                Application Reference: <span className="text-brand-400 font-mono">{successAppId}</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying to join Mosunmola Cooperative Multipurpose Society. Your application has been logged directly into the <strong>Master Admin (Super Admin)</strong> executive review queue.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-xs text-slate-400 max-w-md mx-auto space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Next Onboarding Steps:</span>
              </div>
              <p>1. The Board & Super Admin will review your applicant profile and statutory identification.</p>
              <p>2. Upon approval, your <strong>Official Physical Member ID Card</strong> will be allocated.</p>
              <p>3. You will receive an SMS and email notification with your Member ID to access the <strong>Member Portal PWA</strong>.</p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-2xl transition-all shadow-glow"
            >
              Done, Return to Website
            </button>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="p-3.5 rounded-2xl bg-[#141414] border border-brand-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>
                Membership is open to individuals of good repute residing or doing business in Nigeria. Regulated under Lagos State Directorate of Cooperatives.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Oladipo Adelekan"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Occupation / Enterprise</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Legal Practitioner / Civil Servant"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">State of Residence</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Oyo">Oyo State</option>
                  <option value="Abuja FCT">Abuja FCT</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Local Govt Area (LGA)</label>
                <input
                  type="text"
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  placeholder="e.g. Ikeja, Eti-Osa, Surulere"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Residential / Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street number, building, area"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Monthly Savings Target</label>
                <select
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                >
                  <option value={20000}>₦20,000 / month (Basic Thrift)</option>
                  <option value={50000}>₦50,000 / month (Standard)</option>
                  <option value={100000}>₦100,000 / month (Executive)</option>
                  <option value={250000}>₦250,000 / month (Premium)</option>
                  <option value={500000}>₦500,000 / month (Institutional)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Government ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="NIN">National Identity Number (NIN)</option>
                  <option value="Drivers License">FRSC Driver's License</option>
                  <option value="International Passport">International Passport</option>
                  <option value="Voters Card">INEC Voter's Card</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Identification Document Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter 11-digit NIN or Document number"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Next of Kin Name</label>
                <input
                  type="text"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  placeholder="e.g. Funke Adelekan"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Next of Kin Phone</label>
                <input
                  type="tel"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Primary Reason for Joining</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tell us what you hope to achieve with Mosunmola Cooperative..."
                  className="w-full bg-[#141414] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-2xl flex items-center gap-2 shadow-glow transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Submit Membership Application</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
