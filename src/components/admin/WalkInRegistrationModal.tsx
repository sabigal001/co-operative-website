import React, { useState } from 'react';
import type { WalkInMemberPayload, MemberProfile } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { formatNaira } from '../../utils/currencyFormatter';
import { 
  UserPlus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  CreditCard,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WalkInRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredSuccess: (newMember: MemberProfile) => void;
}

export const WalkInRegistrationModal: React.FC<WalkInRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisteredSuccess
}) => {
  const { currentAdmin, showToast, fireConfetti, refreshData } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [initialSavingsTarget, setInitialSavingsTarget] = useState<number>(50000);
  const [initialShareCapital, setInitialShareCapital] = useState<number>(100000);
  const [idType, setIdType] = useState('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [branch, setBranch] = useState('Ikeja Central Secretariat');

  // Next of Kin
  const [nokName, setNokName] = useState('');
  const [nokRelationship, setNokRelationship] = useState('Spouse');
  const [nokPhone, setNokPhone] = useState('+234 ');
  const [nokAddress, setNokAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !idNumber.trim()) {
      showToast('Please fill in Member Full Name, Phone, and ID Number.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: WalkInMemberPayload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim() || 'Lagos State, Nigeria',
        occupation: occupation.trim() || 'General Business / Civil Service',
        initialSavingsTarget,
        initialShareCapital,
        idType,
        idNumber: idNumber.trim(),
        nextOfKin: {
          name: nokName.trim() || 'Family Next of Kin',
          relationship: nokRelationship,
          phone: nokPhone.trim(),
          address: nokAddress.trim() || address.trim()
        },
        branch
      };

      const res = await adminService.registerWalkInMember(payload, currentAdmin.name);
      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        refreshData();
        onClose();
        onRegisteredSuccess(res.data);
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error registering member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                Desk Walk-In Member Registration
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Digitize Paper Records & Onboard Non-Digital Members
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Section 1: Member Demographics */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold uppercase text-[10px] text-slate-400 border-b border-slate-200 dark:border-white/10 pb-1">
              1. Member Particulars & Identity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Surname First) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chief Adeleke Balogun"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@example.com (or leave blank)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Occupation / Profession
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Trader, Civil Servant, Contractor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Permanent Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Commercial Avenue, Ikeja Central, Lagos"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Statutory Identification Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="NIN" className="text-black">National Identity Number (NIN)</option>
                  <option value="Voters Card" className="text-black">INEC Voter's Card</option>
                  <option value="Drivers License" className="text-black">FRSC Driver's License</option>
                  <option value="International Passport" className="text-black">International Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 29810482910"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financial Commitments & Secretariat Branch */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono font-bold uppercase text-[10px] text-slate-400 border-b border-slate-200 dark:border-white/10 pb-1">
              2. Savings Target & Secretariat Branch
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Thrift Target (₦)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={initialSavingsTarget}
                  onChange={(e) => setInitialSavingsTarget(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Allocated Branch Secretariat
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ikeja Central Secretariat" className="text-black">Ikeja Central Secretariat</option>
                  <option value="Victoria Island Liaison" className="text-black">Victoria Island Liaison</option>
                  <option value="Lekki Phase 1 Branch" className="text-black">Lekki Phase 1 Branch</option>
                  <option value="Surulere Secretariat" className="text-black">Surulere Secretariat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Next of Kin */}
          <div className="space-y-3 pt-2">
            <h4 className="font-mono font-bold uppercase text-[10px] text-slate-400 border-b border-slate-200 dark:border-white/10 pb-1">
              3. Next of Kin Designation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={nokName}
                  onChange={(e) => setNokName(e.target.value)}
                  placeholder="e.g. Mrs. Funke Balogun"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship
                </label>
                <select
                  value={nokRelationship}
                  onChange={(e) => setNokRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Spouse" className="text-black">Spouse</option>
                  <option value="Child" className="text-black">Child</option>
                  <option value="Sibling" className="text-black">Sibling</option>
                  <option value="Parent" className="text-black">Parent</option>
                  <option value="Relative" className="text-black">Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={nokPhone}
                  onChange={(e) => setNokPhone(e.target.value)}
                  placeholder="+234 802 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2.5 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto liquid-btn liquid-btn-white py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submitting ? 'Registering Member...' : 'Register & Assign Member ID'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
