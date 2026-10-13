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
import { apiClient } from '../../services/api/apiClient';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { formatNaira, numberToWordsNaira } from '../../utils/currencyFormatter';
import { 
  Search, 
  X, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payment: DeskPaymentRecord) => void;
  preselectedMember?: MemberProfile | null;
}

const PRESET_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 250000];

const DESCRIPTION_SUGGESTIONS = [
  'October weekly savings contribution',
  'Ajo contribution for 12 October cycle',
  'Loan repayment installment',
  'Share capital equity contribution',
  'Special asset investment contribution',
  'Correction to previously recorded entry'
];

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
  const [customCategory, setCustomCategory] = useState('');
  const [method, setMethod] = useState<PaymentReceiptMethod>('CASH_AT_DESK');
  const [amount, setAmount] = useState<number>(50000);
  const [amountInput, setAmountInput] = useState<string>('50000');
  const [reference, setReference] = useState('');
  
  // Explicitly editable transaction description (Prompt requirement)
  const [description, setDescription] = useState('October weekly savings contribution');
  const [txnDate, setTxnDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  // Sync preselected member if modal opens with one
  useEffect(() => {
    if (preselectedMember) {
      setSelectedMember(preselectedMember);
    }
  }, [preselectedMember]);

  // Adjust default description suggestion when category changes if user hasn't heavily customized it
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (category === 'MONTHLY_THRIFT') {
      setDescription(`Ajo contribution for ${todayStr} cycle`);
    } else if (category === 'VOLUNTARY_SAVINGS') {
      setDescription('Voluntary liquid savings contribution');
    } else if (category === 'SHARE_CAPITAL') {
      setDescription('Purchase of ordinary shares in society equity');
    } else if (category === 'LOAN_REPAYMENT') {
      setDescription('Installment loan repayment');
    } else if (category === 'TARGET_SAVINGS') {
      setDescription('Target thrift project savings allocation');
    } else if (category === 'CUSTOM') {
      setDescription(customCategory.trim() ? `${customCategory.trim()} payment` : 'Special contribution payment');
    }
  }, [category, customCategory]);

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

  // Ajo transparent ₦50 deduction calculation
  const isAjo = category === 'MONTHLY_THRIFT';
  const ajoDeduction = isAjo && amount >= 50 ? 50 : 0;
  const ajoNetCredited = isAjo ? Math.max(0, amount - ajoDeduction) : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) {
      showToast('Please select a cooperative member record first.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return;
    }
    if (category === 'CUSTOM' && !customCategory.trim()) {
      showToast('Please type your manual financial category name.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('A manually entered transaction description is required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Send to real backend API first
      const backendCategory = category === 'CUSTOM' 
        ? (customCategory.trim().toLowerCase().replace(/\s+/g, '_') || 'custom')
        : isAjo ? 'ajo' : (
          category === 'SHARE_CAPITAL' ? 'shares' :
          category === 'LOAN_REPAYMENT' ? 'loans' :
          category === 'TARGET_SAVINGS' ? 'investments' : 'savings'
        );
      const backendTxnType = category === 'LOAN_REPAYMENT' ? 'repayment' :
        category === 'SHARE_CAPITAL' ? 'share_purchase' : 'deposit';

      const backendMethod = method === 'CASH_AT_DESK' ? 'cash' : 'bank_transfer';

      const apiRes = await apiClient.post<any>('/admin/transactions', {
        memberId: selectedMember.memberId,
        amount,
        category: backendCategory,
        txnType: backendTxnType,
        paymentMethod: backendMethod,
        description: description.trim(),
        bankReference: reference.trim() || undefined,
        isVerified: backendMethod === 'cash'
      });

      // 2. Also register in local client state for instant UI responsiveness
      const payload: DeskPaymentPayload = {
        memberId: selectedMember.memberId,
        memberName: selectedMember.fullName,
        category,
        customCategoryLabel: category === 'CUSTOM' ? customCategory.trim() : undefined,
        amount,
        method,
        reference: reference.trim(),
        notes: description.trim()
      };

      const fallbackRes = await financeService.recordDeskPayment(
        payload,
        currentAdmin.name,
        currentAdmin.department || 'Principal Secretariat Officer'
      );

      triggerHaptic('success');
      showToast(apiRes.message || fallbackRes.message || 'Payment recorded in cooperative ledger!', 'success');
      fireConfetti();
      refreshData();
      onClose();
      if (fallbackRes.data) {
        onPaymentSuccess(fallbackRes.data);
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error recording payment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ₦
            </div>
            <div>
              <h3 className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
                Record Member Transaction
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Manual Cash & Transfer Ledger Entry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* STEP 1: MEMBER SEARCH / SELECTION */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
              1. Member Selection <span className="text-red-500">*</span>
            </label>

            {!selectedMember ? (
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Search by full name, Member ID (e.g. MCS-2026-8942), or phone..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
                    autoFocus
                  />
                </div>

                {matchingMembers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {matchingMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMember(m)}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-emerald-600">
                            {m.fullName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ID: {m.memberId} • Tel: {m.phone}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <p className="text-[10px] text-slate-400 pt-1 font-mono">Searching records...</p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {selectedMember.fullName}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    {selectedMember.memberId}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Tel: {selectedMember.phone}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClearSelectedMember}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: CATEGORY */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
              2. Financial Category <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'MONTHLY_THRIFT', label: 'Ajo (Monthly Thrift)', desc: '₦50 statutory deduction' },
                { id: 'VOLUNTARY_SAVINGS', label: 'Voluntary Savings', desc: 'Liquid regular thrift' },
                { id: 'SHARE_CAPITAL', label: 'Share Capital', desc: 'Cooperative shares' },
                { id: 'LOAN_REPAYMENT', label: 'Loan Repayment', desc: 'Principal & interest' },
                { id: 'TARGET_SAVINGS', label: 'Target / Project', desc: 'Locked thrift deposit' },
                { id: 'CUSTOM', label: 'Manual / Custom Cat.', desc: 'Write manual category' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setCategory(cat.id as PaymentContributionCategory);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${
                    category === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <span className="block leading-tight text-xs">{cat.label}</span>
                  <span className={`text-[10px] font-normal block mt-0.5 ${category === cat.id ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {cat.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Manual Category Input */}
            {category === 'CUSTOM' && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                  Write Manual Financial Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Land Acquisition Levy, AGM Dues, Passbook Replacement, Diesel Contribution"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  This custom title will be recorded in the official audit ledger and printed on the member's Receipt Voucher.
                </p>
              </div>
            )}
          </div>

          {/* STEP 3: PAYMENT METHOD & DATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
                3. Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('CASH_AT_DESK')}
                  className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                    method === 'CASH_AT_DESK'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Cash at Desk
                  <span className="text-[9px] font-mono block text-emerald-700 dark:text-emerald-400 font-normal">Immediate Credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('BANK_TRANSFER')}
                  className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                    method === 'BANK_TRANSFER'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Bank Transfer
                  <span className="text-[9px] font-mono block text-slate-500 font-normal">Pending Verification</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={txnDate}
                  onChange={(e) => setTxnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* STEP 4: AMOUNT INPUT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                4. Gross Amount <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatNaira(amount)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display font-black text-base text-slate-400 pointer-events-none">
                ₦
              </span>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="50,000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-lg font-mono font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_AMOUNTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    amount === p
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  +{formatNaira(p, false)}
                </button>
              ))}
            </div>

            {/* Transparent ₦50 Ajo Deduction Breakdown Callout */}
            {isAjo && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                  <Info className="w-3.5 h-3.5" />
                  <span>Transparent Ajo Statutory Deduction Applied</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Gross Deposit</span>
                    <strong className="text-slate-900 dark:text-slate-100">₦{amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-amber-700 dark:text-amber-400 block text-[10px]">Coop Admin Fee</span>
                    <strong className="text-amber-800 dark:text-amber-300">-₦50</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[10px]">Net Credited</span>
                    <strong className="text-emerald-800 dark:text-emerald-300">₦{ajoNetCredited.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: MANUALLY EDITABLE DESCRIPTION (CRITICAL PROMPT REQUIREMENT) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                5. Transaction Description <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Editable free text</span>
            </div>

            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. October weekly savings contribution, Ajo contribution for 12 October, etc."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />

            {/* Quick Description Suggestion Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              <span className="text-[10px] font-mono text-slate-400 mr-1 self-center">Suggestions:</span>
              {DESCRIPTION_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDescription(sug)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 6: REFERENCE / TELLER */}
          <div>
            <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
              Bank Reference / Receipt Number (Optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. NIP-ACC-982190, TRF-001"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* Audit Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Recorded under staff account <strong>{currentAdmin.name}</strong>. Transactions are immutable and written directly to the server ledger in exact kobo units.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !selectedMember || amount <= 0 || !description.trim()}
              className="w-full sm:w-auto py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              <span>{submitting ? 'Recording Transaction...' : 'Save & Record in Ledger'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
