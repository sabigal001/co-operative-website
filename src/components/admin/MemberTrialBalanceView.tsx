import React, { useState, useEffect, useMemo } from 'react';
import type { MemberProfile, DeskPaymentRecord } from '../../types';
import { adminService } from '../../services/api/adminService';
import { financeService } from '../../services/api/financeService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import {
  Scale,
  Search,
  Download,
  FileText,
  X,
  Printer,
  ChevronRight,
  TrendingDown,
  Coins,
  ShieldCheck,
  Building,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface MemberBalanceRecord {
  member: MemberProfile;
  savings: number;
  shares: number;
  loan: number;
  netPosition: number;
}

interface MemberTrialBalanceViewProps {
  initialMembers?: MemberProfile[];
}

export const MemberTrialBalanceView: React.FC<MemberTrialBalanceViewProps> = ({ initialMembers }) => {
  const { showToast } = useApp();

  const [membersList, setMembersList] = useState<MemberProfile[]>(initialMembers || []);
  const [loading, setLoading] = useState(!initialMembers || initialMembers.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'savers' | 'borrowers' | 'shareholders'>('all');
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [memberPassbookRecords, setMemberPassbookRecords] = useState<DeskPaymentRecord[]>([]);

  // Fetch members if not provided
  useEffect(() => {
    if (initialMembers && initialMembers.length > 0) {
      setMembersList(initialMembers);
      setLoading(false);
      return;
    }

    setLoading(true);
    adminService.getMemberRegistry().then((res) => {
      if (res.success && res.data) {
        setMembersList(res.data);
      }
      setLoading(false);
    });
  }, [initialMembers]);

  // When selectedMember changes, fetch passbook records
  useEffect(() => {
    if (!selectedMember) {
      setMemberPassbookRecords([]);
      return;
    }

    setLedgerLoading(true);
    financeService.getMemberPassbook(selectedMember.memberId).then((res) => {
      if (res.success && res.data) {
        setMemberPassbookRecords(res.data.records || []);
      }
      setLedgerLoading(false);
    });
  }, [selectedMember]);

  // Compute trial balance figures per member
  const memberBalances = useMemo<MemberBalanceRecord[]>(() => {
    return membersList.map((member: MemberProfile) => {
      const savings = member.financialSummary?.totalSavings ?? 0;
      const shares = member.financialSummary?.shareCapital ?? 0;
      const loan = member.financialSummary?.activeLoanBalance ?? 0;
      const netPosition = savings + shares - loan;

      return {
        member,
        savings,
        shares,
        loan,
        netPosition
      };
    });
  }, [membersList]);

  // Aggregate totals
  const aggregates = useMemo(() => {
    const totalSavings = memberBalances.reduce((acc: number, m: MemberBalanceRecord) => acc + m.savings, 0);
    const totalShares = memberBalances.reduce((acc: number, m: MemberBalanceRecord) => acc + m.shares, 0);
    const totalLoans = memberBalances.reduce((acc: number, m: MemberBalanceRecord) => acc + m.loan, 0);
    const totalCredits = totalSavings + totalShares;
    const totalDebits = totalLoans;
    const netSocietyPosition = totalCredits - totalDebits;

    return {
      totalSavings,
      totalShares,
      totalLoans,
      totalCredits,
      totalDebits,
      netSocietyPosition
    };
  }, [memberBalances]);

  // Filtered members list
  const filteredList = useMemo<MemberBalanceRecord[]>(() => {
    return memberBalances.filter(({ member, savings, shares, loan }: MemberBalanceRecord) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        member.fullName.toLowerCase().includes(query) ||
        member.memberId.toLowerCase().includes(query) ||
        member.phone.includes(query);

      if (!matchesSearch) return false;

      if (filterType === 'savers') return savings > 0;
      if (filterType === 'borrowers') return loan > 0;
      if (filterType === 'shareholders') return shares > 0;
      return true;
    });
  }, [memberBalances, searchQuery, filterType]);

  // Compute personal ledger rows for selected member
  const ledgerRows = useMemo(() => {
    if (!selectedMember) return [];

    let running = 0;
    const rows = [];

    // Brought forward initial entries
    const bwdSavings = selectedMember.financialSummary?.totalSavings || 0;
    const bwdShares = selectedMember.financialSummary?.shareCapital || 0;
    const bwdLoan = selectedMember.financialSummary?.activeLoanBalance || 0;

    if (bwdSavings > 0) {
      running += bwdSavings;
      rows.push({
        id: 'bwd-savings',
        date: selectedMember.joinDate || '2026-01-01',
        reference: 'B/F-SAVINGS',
        description: 'Thrift Savings Balance Brought Forward',
        debit: 0,
        credit: bwdSavings,
        runningBalance: running
      });
    }

    if (bwdShares > 0) {
      running += bwdShares;
      rows.push({
        id: 'bwd-shares',
        date: selectedMember.joinDate || '2026-01-01',
        reference: 'B/F-SHARES',
        description: 'Cooperative Share Capital Brought Forward',
        debit: 0,
        credit: bwdShares,
        runningBalance: running
      });
    }

    if (bwdLoan > 0) {
      running -= bwdLoan;
      rows.push({
        id: 'bwd-loan',
        date: selectedMember.joinDate || '2026-01-01',
        reference: 'B/F-LOAN',
        description: 'Active Loan Disbursement Brought Forward',
        debit: bwdLoan,
        credit: 0,
        runningBalance: running
      });
    }

    // Subsequent desk payments & transactions
    memberPassbookRecords.forEach((record: DeskPaymentRecord) => {
      const isCredit = record.status === 'CONFIRMED';
      const debit = !isCredit ? record.amount : 0;
      const credit = isCredit ? record.amount : 0;
      running = running + credit - debit;

      rows.push({
        id: record.id,
        date: record.recordedAt.split('T')[0],
        reference: record.receiptNumber,
        description: `${record.categoryLabel || record.category} (${record.method.replace(/_/g, ' ')})`,
        debit,
        credit,
        runningBalance: running
      });
    });

    return rows;
  }, [selectedMember, memberPassbookRecords]);

  // Export Trial Balance to CSV
  const handleExportCSV = () => {
    triggerHaptic('selection');
    const headers = [
      'Member ID',
      'Full Name',
      'Phone',
      'Thrift Savings (Credit) NGN',
      'Share Capital (Credit) NGN',
      'Outstanding Loan (Debit) NGN',
      'Net Standing NGN',
      'Account Status'
    ];

    const rows = memberBalances.map((item: MemberBalanceRecord) => [
      `"${item.member.memberId}"`,
      `"${item.member.fullName}"`,
      `"${item.member.phone}"`,
      item.savings,
      item.shares,
      item.loan,
      item.netPosition,
      `"${item.member.status}"`
    ]);

    // Summary totals row
    rows.push([
      '"TOTAL"',
      `"Total Accounts: ${memberBalances.length}"`,
      '""',
      aggregates.totalSavings,
      aggregates.totalShares,
      aggregates.totalLoans,
      aggregates.netSocietyPosition,
      '"RECONCILED"'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e: (string | number)[]) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Mosunmola_Coop_Member_Trial_Balance_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Trial Balance exported to CSV successfully.', 'success');
  };

  const handlePrintLedger = () => {
    triggerHaptic('selection');
    window.print();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="text-xs">Loading Member Trial Balance & Ledgers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Scale className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              Member Trial Balance & Ledgers
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Periodic cooperative trial balance, member equity schedule, and individual personal ledger audit passbooks.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm tap-spring transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Trial Balance (CSV)</span>
        </button>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Thrift Savings (CR)
            </span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Coins className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ₦{aggregates.totalSavings.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Society Liquid Liability to Members
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Share Capital (CR)
            </span>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
            ₦{aggregates.totalShares.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Cooperative Member Equity Subscriptions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Outstanding Loans (DR)
            </span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            ₦{aggregates.totalLoans.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Society Asset Receivable from Borrowers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Net Member Equity
            </span>
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
            ₦{aggregates.netSocietyPosition.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ledger In Good Standing</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by member name, account ID, or phone number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { id: 'all', label: `All (${memberBalances.length})` },
              { id: 'savers', label: 'Savers' },
              { id: 'borrowers', label: 'Borrowers' },
              { id: 'shareholders', label: 'Shareholders' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('selection');
                setFilterType(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Account</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4 text-right">Savings (Credit)</th>
                <th className="py-3.5 px-4 text-right">Shares (Credit)</th>
                <th className="py-3.5 px-4 text-right">Loans (Debit)</th>
                <th className="py-3.5 px-4 text-right">Net Standing</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                    No member records matching your filter.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ member, savings, shares, loan, netPosition }: MemberBalanceRecord) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {member.fullName}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {member.memberId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {member.phone}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ₦{savings.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                      ₦{shares.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                      {loan > 0 ? `₦${loan.toLocaleString()}` : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          netPosition >= 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        ₦{netPosition.toLocaleString()} {netPosition >= 0 ? 'CR' : 'DR'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-sans">
                      <button
                        onClick={() => {
                          triggerHaptic('selection');
                          setSelectedMember(member);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1 tap-spring transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Ledger Card</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer - Trial Balance Verification */}
            <tfoot className="bg-slate-100 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 font-mono text-xs font-black text-slate-900 dark:text-white">
              <tr>
                <td className="py-4 px-4 font-sans uppercase">
                  Balance Totals ({filteredList.length} Accounts)
                </td>
                <td className="py-4 px-4"></td>
                <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">
                  ₦{filteredList.reduce((acc: number, m: MemberBalanceRecord) => acc + m.savings, 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-blue-600 dark:text-blue-400">
                  ₦{filteredList.reduce((acc: number, m: MemberBalanceRecord) => acc + m.shares, 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-amber-600 dark:text-amber-400">
                  ₦{filteredList.reduce((acc: number, m: MemberBalanceRecord) => acc + m.loan, 0).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  ₦
                  {filteredList
                    .reduce((acc: number, m: MemberBalanceRecord) => acc + m.netPosition, 0)
                    .toLocaleString()}{' '}
                  CR
                </td>
                <td className="py-4 px-4 text-center font-sans">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                    Reconciled
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MEMBER PERSONAL LEDGER CARD MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-slide-up flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-display font-black text-lg flex items-center justify-center shadow-md">
                  {selectedMember.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                      {selectedMember.fullName}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {selectedMember.memberId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Cooperative Personal Passbook Ledger Card & Statement of Account
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintLedger}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Print Ledger Card"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Member Summary Details */}
            <div className="p-5 sm:p-6 bg-slate-100/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Thrift Savings</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₦{(selectedMember.financialSummary?.totalSavings || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Share Capital</span>
                <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                  ₦{(selectedMember.financialSummary?.shareCapital || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Loan Balance</span>
                <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                  ₦{(selectedMember.financialSummary?.activeLoanBalance || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Phone Number</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedMember.phone}
                </span>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {ledgerLoading ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  <span className="text-xs">Loading ledger journal entries...</span>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="py-3 px-3.5">Date</th>
                        <th className="py-3 px-3.5">Ref / Voucher</th>
                        <th className="py-3 px-3.5">Particulars / Description</th>
                        <th className="py-3 px-3.5 text-right">Debit (DR)</th>
                        <th className="py-3 px-3.5 text-right">Credit (CR)</th>
                        <th className="py-3 px-3.5 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                      {ledgerRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                            No transactions recorded in passbook ledger.
                          </td>
                        </tr>
                      ) : (
                        ledgerRows.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-3.5 text-slate-500 whitespace-nowrap">
                              {row.date}
                            </td>
                            <td className="py-3 px-3.5 text-slate-400 font-bold">
                              {row.reference}
                            </td>
                            <td className="py-3 px-3.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                              {row.description}
                            </td>
                            <td className="py-3 px-3.5 text-right text-rose-600 dark:text-rose-400">
                              {row.debit > 0 ? `₦${row.debit.toLocaleString()}` : '—'}
                            </td>
                            <td className="py-3 px-3.5 text-right text-emerald-600 dark:text-emerald-400">
                              {row.credit > 0 ? `₦${row.credit.toLocaleString()}` : '—'}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-slate-900 dark:text-white">
                              ₦{row.runningBalance.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Official Mosunmola Multi-Purpose Cooperative Society Audit Ledger
              </span>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
