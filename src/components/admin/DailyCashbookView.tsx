import React, { useState, useEffect } from 'react';
import type { DeskPaymentRecord, DailyCashbookSummary } from '../../types';
import { financeService } from '../../services/api/financeService';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/currencyFormatter';
import { triggerHaptic } from '../../utils/haptics';
import { 
  Printer, 
  Download, 
  Search, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCw,
  XCircle,
  Eye
} from 'lucide-react';

interface DailyCashbookViewProps {
  onViewVoucher: (payment: DeskPaymentRecord) => void;
  onOpenRecordModal: () => void;
}

export const DailyCashbookView: React.FC<DailyCashbookViewProps> = ({
  onViewVoucher,
  onOpenRecordModal
}) => {
  const { currentAdmin, activeAdminRole, showToast, dataVersion, refreshData } = useApp();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [summary, setSummary] = useState<DailyCashbookSummary | null>(null);
  const [records, setRecords] = useState<DeskPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING_VERIFICATION' | 'REVERSED'>('ALL');

  // Reversal Prompt Modal
  const [reversalPayment, setReversalPayment] = useState<DeskPaymentRecord | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [reversing, setReversing] = useState(false);

  const loadCashbook = async () => {
    setLoading(true);
    try {
      const res = await financeService.getDailyCashbook(selectedDate);
      if (res.success) {
        setSummary(res.data.summary);
        setRecords(res.data.records);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashbook();
  }, [selectedDate, dataVersion]);

  // Treasurer Transfer Verification
  const handleVerifyTransfer = async (paymentId: string, approved: boolean) => {
    try {
      triggerHaptic('medium');
      const res = await financeService.verifyTransferPayment(paymentId, approved, currentAdmin.name);
      if (res.success) {
        showToast(res.message, approved ? 'success' : 'info');
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error updating transfer', 'error');
    }
  };

  // Reversal Action
  const handleConfirmReversal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalPayment || !reversalReason.trim()) {
      showToast('Please provide a valid audit reason for this reversal.', 'error');
      return;
    }
    setReversing(true);
    try {
      triggerHaptic('warning');
      const res = await financeService.reversePayment(reversalPayment.id, reversalReason.trim(), currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'success');
        setReversalPayment(null);
        setReversalReason('');
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error reversing payment', 'error');
    } finally {
      setReversing(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    triggerHaptic('light');
    if (records.length === 0) {
      showToast('No records available to export for this date.', 'info');
      return;
    }

    const headers = ['Receipt No', 'Date', 'Member ID', 'Member Name', 'Category', 'Method', 'Amount (NGN)', 'Status', 'Recorded By', 'Reference'];
    const rows = records.map((r) => [
      r.receiptNumber,
      r.recordedAt,
      r.memberId,
      `"${r.memberName}"`,
      `"${r.categoryLabel}"`,
      r.method,
      r.amount,
      r.status,
      `"${r.recordedBy}"`,
      `"${r.reference || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mosunmola_Cashbook_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Daily cashbook exported to CSV!', 'success');
  };

  // Filtered Records
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.memberName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.memberId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base text-slate-900 dark:text-white leading-tight">
              Secretariat Daily Cashbook & Reconciliation
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Cash In Hand Tracking & Bank Deposit Handover Sheet
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors text-xs flex items-center gap-1 font-bold"
            title="Print Daily Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors text-xs flex items-center gap-1 font-bold"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenRecordModal}
            className="liquid-btn liquid-btn-white py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <span>+ Record Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">
              Physical Cash in Hand
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
              {formatNaira(summary.totalCashReceived)}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block mt-0.5">
              Cashier Drawer for Bank Deposit
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">
              Verified Bank Transfers
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white block mt-1">
              {formatNaira(summary.totalTransfersReceived)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Credited to Bank Account
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">
              Pending Statement Verification
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400 block mt-1">
              {formatNaira(summary.totalPendingTransfers)}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 block mt-0.5">
              Awaiting Treasurer Reconciliation
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">
              Total Day Collections
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white block mt-1">
              {formatNaira(summary.totalCashReceived + summary.totalTransfersReceived)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {summary.totalTransactionsCount} Transactions Logged
            </span>
          </div>
        </div>
      )}

      {/* Search & Filters Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search today's entries by member name, ID, or voucher..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'CONFIRMED', 'PENDING_VERIFICATION', 'REVERSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                triggerHaptic('light');
                setStatusFilter(st);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400">
            Loading cashbook records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Coins className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p>No payments recorded for {selectedDate}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Voucher No</th>
                  <th className="py-3.5 px-4 font-bold">Time</th>
                  <th className="py-3.5 px-4 font-bold">Member</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Method</th>
                  <th className="py-3.5 px-4 font-bold text-right">Amount (₦)</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {r.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      {r.recordedAt.substring(11, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {r.memberName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {r.memberId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {r.categoryLabel}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {r.method === 'CASH_AT_DESK' && '💵 Cash'}
                      {r.method === 'BANK_TRANSFER' && '🏦 Transfer'}
                      {r.method === 'POS_TERMINAL' && '💳 POS'}
                      {r.method === 'BANK_TELLER' && '📄 Teller'}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-right text-slate-900 dark:text-white">
                      {formatNaira(r.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        r.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : r.status === 'PENDING_VERIFICATION'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {r.status === 'CONFIRMED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {r.status === 'PENDING_VERIFICATION' && <Clock className="w-2.5 h-2.5" />}
                        {r.status === 'REVERSED' && <XCircle className="w-2.5 h-2.5" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewVoucher(r)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                          title="View Official Voucher"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Treasurer Action: Confirm Transfer */}
                        {r.status === 'PENDING_VERIFICATION' && (activeAdminRole === 'treasurer' || activeAdminRole === 'master_admin') && (
                          <button
                            onClick={() => handleVerifyTransfer(r.id, true)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 font-bold text-[10px]"
                            title="Verify against bank statement"
                          >
                            Verify
                          </button>
                        )}

                        {/* Super Admin Action: Traceable Reversal */}
                        {r.status === 'CONFIRMED' && activeAdminRole === 'master_admin' && (
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              setReversalPayment(r);
                            }}
                            className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500"
                            title="Reverse with Audit Trail"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reversal Confirmation Modal */}
      {reversalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <AlertCircle className="w-5 h-5" />
              <span>Traceable Financial Reversal</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You are reversing voucher <strong>{reversalPayment.receiptNumber}</strong> of <strong>{formatNaira(reversalPayment.amount)}</strong> recorded for <strong>{reversalPayment.memberName}</strong>.
              <br /><br />
              Under cooperative accounting bye-laws, this transaction will <strong>NOT</strong> be deleted. A contra-entry will be posted to the immutable ledger and attributed to your staff account in the audit log.
            </p>

            <form onSubmit={handleConfirmReversal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase font-mono text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Audit Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="e.g. Cashier error: Entered ₦50,000 instead of ₦5,000; corrected on voucher #..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReversalPayment(null)}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reversing}
                  className="py-2 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {reversing ? 'Recording Reversal...' : 'Authorize Reversal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
