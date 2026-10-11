import React, { useState, useEffect } from 'react';
import type { 
  MemberProfile, 
  PaymentContributionCategory, 
  PaymentReceiptMethod,
  DeskPaymentRecord,
  DeskPaymentPayload
} from '../../types';
import { adminService } from '../../services/api/adminService';
import { financeService } from '../../services/api/financeService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { formatNaira, numberToWordsNaira, CATEGORY_LABELS } from '../../utils/currencyFormatter';
import { 
  CreditCard, 
  Search, 
  X, 
  Check, 
  User, 
  Coins, 
  Building2, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payment: DeskPaymentRecord) => void;
  preselectedMember?: MemberProfile | null;
}

const PRESET_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 250000];

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  preselectedMember
}) => {
  const { currentAdmin, showToast, fireConfetti, refreshData } = useApp();

  // Search Member State
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [matchingMembers, setMatchingMembers] = useState<MemberProfile[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(preselectedMember || null);
  const [isSearching, setIsSearching] = useState(false);

  // Form Fields
  const [category, setCategory] = useState<PaymentContributionCategory>('MONTHLY_THRIFT');
  const [method, setMethod] = useState<PaymentReceiptMethod>('CASH_AT_DESK');
  const [amount, setAmount] = useState<number>(50000);
  const [amountInput, setAmountInput] = useState<string>('50000');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync preselected member if modal opens with one
  useEffect(() => {
    if (preselectedMember) {
      setSelectedMember(preselectedMember);
    }
  }, [preselectedMember]);

  // Live member search
  useEffect(() => {
    if (!memberSearchQuery.trim() || selectedMember) {
      setMatchingMembers([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await adminService.getMemberRegistry(memberSearchQuery);
        if (res.success) {
          setMatchingMembers(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [memberSearchQuery, selectedMember]);

  if (!isOpen) return null;

  const handleSelectMember = (mem: MemberProfile) => {
    triggerHaptic('light');
    setSelectedMember(mem);
    setMemberSearchQuery('');
    setMatchingMembers([]);
  };

  const handleClearSelectedMember = () => {
    triggerHaptic('light');
    setSelectedMember(null);
    setMemberSearchQuery('');
  };

  const handleAmountChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    setAmountInput(clean);
    const num = parseInt(clean, 10) || 0;
    setAmount(num);
  };

  const handleSelectPreset = (preset: number) => {
    triggerHaptic('light');
    setAmount(preset);
    setAmountInput(preset.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) {
      showToast('Please search and select a cooperative member first.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: DeskPaymentPayload = {
        memberId: selectedMember.memberId,
        memberName: selectedMember.fullName,
        category,
        amount,
        method,
        reference: reference.trim(),
        notes: notes.trim()
      };

      const res = await financeService.recordDeskPayment(
        payload,
        currentAdmin.name,
        currentAdmin.department || 'Principal Secretariat Officer'
      );

      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        refreshData();
        onClose();
        onPaymentSuccess(res.data);
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error recording payment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-5 sm:px-6 py-4 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold">
              ₦
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                Record Member Payment (Desk Cashier)
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Secretariat Walk-In & Transfer Ledger Entry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* STEP 1: MEMBER SEARCH / SELECTION */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
              1. Select Member <span className="text-red-500">*</span>
            </label>

            {!selectedMember ? (
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Search by full name, Member ID (MCS-2026-...), or phone..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                {/* Autocomplete Search Dropdown */}
                {matchingMembers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
                    {matchingMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMember(m)}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-emerald-500/10 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.fullName}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {m.fullName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              ID: {m.memberId} • Tel: {m.phone}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Select
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <p className="text-[10px] text-slate-400 pt-1 font-mono">Searching cooperative records...</p>
                )}
              </div>
            ) : (
              /* Selected Member Card */
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      {selectedMember.fullName}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                      {selectedMember.memberId}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Tel: {selectedMember.phone} • {selectedMember.occupation}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearSelectedMember}
                  className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-red-500 transition-colors text-xs flex items-center gap-1 font-mono"
                  title="Change Member"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Change</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: CONTRIBUTION CATEGORY SELECTOR */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
              2. Contribution Category <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'MONTHLY_THRIFT', label: 'Monthly Thrift (Ajo)', icon: '🔄' },
                { id: 'VOLUNTARY_SAVINGS', label: 'Voluntary Savings', icon: '💰' },
                { id: 'TARGET_SAVINGS', label: 'Target Savings', icon: '🎯' },
                { id: 'SHARE_CAPITAL', label: 'Share Capital', icon: '📈' },
                { id: 'LOAN_REPAYMENT', label: 'Loan Repayment', icon: '🤝' },
                { id: 'REGISTRATION_FEE', label: 'Registration / Passbook', icon: '📘' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setCategory(cat.id as PaymentContributionCategory);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all flex items-center gap-2 ${
                    category === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-sm'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-400'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
              3. Payment Channel / Receipt Mode <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'CASH_AT_DESK',
                  title: 'Cash at Desk',
                  subtitle: 'Physical cash received (Instant Credit)',
                  badge: 'Immediate Voucher'
                },
                {
                  id: 'BANK_TRANSFER',
                  title: 'Bank Transfer',
                  subtitle: 'Direct credit (Pending Verification)',
                  badge: 'Statement Match'
                },
                {
                  id: 'POS_TERMINAL',
                  title: 'POS Terminal',
                  subtitle: 'Secretariat card swipe',
                  badge: 'Immediate Voucher'
                }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setMethod(m.id as PaymentReceiptMethod);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    method === m.id
                      ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {m.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/50 dark:bg-black/40 text-slate-600 dark:text-slate-300">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {m.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: AMOUNT INPUT & PRESETS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                4. Amount in Naira (₦) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                {formatNaira(amount)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-lg text-slate-400 pointer-events-none">
                ₦
              </span>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="50,000"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xl font-mono font-black text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Amount Preset Pills */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_AMOUNTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors ${
                    amount === p
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  +{formatNaira(p, false)}
                </button>
              ))}
            </div>

            {/* Live Amount in Words */}
            {amount > 0 && (
              <p className="text-[11px] font-serif italic text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Amount in Words: <strong>{numberToWordsNaira(amount)}</strong>
              </p>
            )}
          </div>

          {/* STEP 5: REFERENCE & TELLER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
                Bank Teller / POS Ref (Optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. NIP-ACC-982190 or CSH-001"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
                Narration / Memo
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. October monthly savings contribution"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Bottom Compliance Notice */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200/50 dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Recording this transaction will generate an official audit-stamped <strong>Receipt Voucher</strong> and immediately log the entry into the cooperative’s immutable financial cashbook.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !selectedMember || amount <= 0}
              className="w-full sm:w-auto liquid-btn liquid-btn-white py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{submitting ? 'Recording & Generating Voucher...' : 'Confirm & Generate Receipt Voucher'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
