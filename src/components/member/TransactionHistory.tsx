import React, { useState, useEffect } from 'react';
import type { MemberProfile, Transaction } from '../../types';
import { memberService } from '../../services/api/memberService';
import { apiClient } from '../../services/api/apiClient';
import { useApp } from '../../context/AppContext';
import { ReceiptModal } from '../common/ReceiptModal';
import { triggerHaptic } from '../../utils/haptics';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Receipt,
  Info
} from 'lucide-react';

interface TransactionHistoryProps {
  member: MemberProfile;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ member }) => {
  const { dataVersion } = useApp();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const backendRes = await apiClient.get<any[]>('/member/transactions');
        if (backendRes.success && Array.isArray(backendRes.data) && backendRes.data.length > 0) {
          setTransactions(backendRes.data);
          return;
        }
      } catch (e) {
        console.warn('Backend transactions fetch error, using local fallback:', e);
      }

      const res = await memberService.getTransactions(member.id);
      if (res.success) setTransactions(res.data);
    };

    load();
  }, [member.id, dataVersion]);

  const filtered = transactions.filter((t) => {
    const ref = (t.reference || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = ref.includes(query) || desc.includes(query);
    const cat = t.category || t.type;
    const matchesType = filterType === 'all' || cat === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search / Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
            Passbook & Contribution Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of savings deposits, ₦50 Ajo deductions, loan repayments, and share capital records.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'savings', 'ajo', 'shares', 'loans'].map((type) => (
            <button
              key={type}
              onClick={() => {
                triggerHaptic('light');
                setFilterType(type);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {type === 'all' ? 'All Ledger' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transparent Ajo Notice */}
      <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs flex items-start gap-2 text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Audit Transparency:</strong> All Ajo contributions clearly display gross deposits, the statutory ₦50 cooperative administrative deduction, and the net amount credited to your passbook.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by transaction reference or keyword..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Transaction Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Gross</th>
                  <th className="py-3 px-4">Deduction</th>
                  <th className="py-3 px-4">Net Credited</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((t) => {
                  const gross = t.grossAmountNaira || t.amount || 0;
                  const deduction = t.deductionAmountNaira || 0;
                  const net = t.netAmountNaira || t.amount || 0;
                  const isCredit = !t.txnType || t.txnType === 'deposit' || t.txnType === 'share_purchase';

                  return (
                    <tr key={t.id || t.reference} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{t.description}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                              <span>{t.reference}</span>
                              <span>•</span>
                              <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : (t.date || '2026-10-12')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 capitalize font-medium text-slate-600 dark:text-slate-300">
                        {t.category || t.type}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ₦{gross.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs">
                        {deduction > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">-₦{deduction.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        +₦{net.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === 'confirmed' || t.status === 'successful' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' 
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {t.status || 'confirmed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            triggerHaptic('selection');
                            setSelectedReceiptTxn({
                              id: t.id || t.reference,
                              reference: t.reference,
                              memberName: t.memberName || member.fullName,
                              memberId: t.memberId || member.memberId,
                              type: t.category || t.type || 'deposit',
                              amount: net,
                              description: t.description,
                              date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : (t.date || '2026-10-12'),
                              status: t.status || 'successful',
                              paymentMethod: t.paymentMethod || 'Cash at Desk',
                              balanceAfter: 4200000
                            });
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold rounded-lg text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReceiptTxn && (
        <ReceiptModal
          transaction={selectedReceiptTxn}
          onClose={() => setSelectedReceiptTxn(null)}
        />
      )}

    </div>
  );
};
