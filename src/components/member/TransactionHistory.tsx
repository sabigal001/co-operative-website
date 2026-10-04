import React, { useState, useEffect } from 'react';
import type { MemberProfile, Transaction } from '../../types';
import { memberService } from '../../services/api/memberService';
import { useApp } from '../../context/AppContext';
import { ReceiptModal } from '../common/ReceiptModal';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Receipt
} from 'lucide-react';

interface TransactionHistoryProps {
  member: MemberProfile;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ member }) => {
  const { dataVersion } = useApp();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    memberService.getTransactions(member.id).then((res) => {
      if (res.success) setTransactions(res.data);
    });
  }, [member.id, dataVersion]);

  const filtered = transactions.filter((t) => {
    const matchesSearch = 
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search / Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
            Transaction & Contribution Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of savings deposits, loan disbursements, repayments, and AGM dividends.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'deposit', 'loan_disbursement', 'loan_repayment', 'dividend'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300'
              }`}
            >
              {type === 'all' ? 'All Ledger' : type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference, keyword or channel..."
          className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
      </div>

      {/* Transactions Table / List */}
      <div className="liquid-glass-card rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Transaction Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Balance After</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((t) => {
                  const isCredit = t.type === 'deposit' || t.type === 'loan_disbursement' || t.type === 'dividend';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{t.description}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="font-mono">{t.reference}</span>
                              <span>•</span>
                              <span>{t.date}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 capitalize font-medium text-slate-600 dark:text-slate-300">
                        {t.type.replace('_', ' ')}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-sm">
                        <span className={isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                          {isCredit ? '+' : '-'}₦{t.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                        ₦{t.balanceAfter.toLocaleString()}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === 'successful' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                          t.status === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30' :
                          'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                        }`}>
                          {t.status === 'successful' && <CheckCircle2 className="w-3 h-3" />}
                          {t.status === 'pending' && <Clock className="w-3 h-3" />}
                          {t.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceiptTxn(t)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-500 hover:text-slate-950 text-slate-700 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white dark:hover:text-black font-bold rounded-xl text-[11px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
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

      {/* Printable / Downloadable Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
      />

    </div>
  );
};
