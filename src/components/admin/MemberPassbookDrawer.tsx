import React, { useState, useEffect } from 'react';
import type { MemberProfile, DeskPaymentRecord } from '../../types';
import { financeService } from '../../services/api/financeService';
import { formatNaira } from '../../utils/currencyFormatter';
import { triggerHaptic } from '../../utils/haptics';
import { 
  X, 
  Printer, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface MemberPassbookDrawerProps {
  member: MemberProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordPaymentForMember: (member: MemberProfile) => void;
  onViewVoucher: (payment: DeskPaymentRecord) => void;
}

export const MemberPassbookDrawer: React.FC<MemberPassbookDrawerProps> = ({
  member,
  isOpen,
  onClose,
  onRecordPaymentForMember,
  onViewVoucher
}) => {
  const [loading, setLoading] = useState(false);
  const [passbookData, setPassbookData] = useState<{
    totalBalance: number;
    regularThrift: number;
    voluntarySavings: number;
    shareCapital: number;
    records: DeskPaymentRecord[];
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !member) return;

    setLoading(true);
    financeService.getMemberPassbook(member.memberId).then((res) => {
      if (res.success) {
        setPassbookData(res.data);
      }
      setLoading(false);
    });
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const totalSavings = passbookData?.totalBalance || 0;
  const maxBorrowingPower = totalSavings * 2; // 200% savings credit capacity under bye-laws

  const handlePrintStatement = () => {
    triggerHaptic('medium');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white h-full shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-slide-left print:max-w-full print:border-none print:shadow-none">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt={member.fullName}
              className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                  {member.fullName}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  {member.membershipStatus || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Member ID: {member.memberId} • Joined: {member.joinDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintStatement}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
              title="Print Passbook Statement"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Passbook Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 print:p-4">
          
          {/* Official Passbook Statement Header (Visible on print) */}
          <div className="hidden print:block text-center border-b-2 border-black pb-4 space-y-1">
            <h2 className="text-2xl font-black font-display uppercase">MOSUNMOLA COOPERATIVE MULTIPURPOSE SOCIETY</h2>
            <p className="text-xs font-bold">Lagos State Certified Society LSCS/2018/8941 • Official Member Passbook Statement</p>
            <p className="text-xs font-mono">Member: {member.fullName} ({member.memberId}) • Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Quick Balance Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                Total Savings
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {formatNaira(totalSavings)}
              </span>
              <span className="text-[9px] text-emerald-700 dark:text-emerald-300 block">Ledger Total</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                Regular Thrift
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block mt-0.5">
                {formatNaira(passbookData?.regularThrift || 0)}
              </span>
              <span className="text-[9px] text-slate-400 block">Monthly Ajo</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                Share Capital
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white block mt-0.5">
                {formatNaira(passbookData?.shareCapital || 250000)}
              </span>
              <span className="text-[9px] text-slate-400 block">Society Equity</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                5% Credit Limit
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {formatNaira(maxBorrowingPower)}
              </span>
              <span className="text-[9px] text-slate-400 block">200% multiplier</span>
            </div>
          </div>

          {/* Member Profile Particulars Accordion / Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <span className="font-bold font-mono uppercase text-[10px] text-slate-500 dark:text-slate-400">
                Official Secretariat Record Details
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Physical Card: {member.assignedCardId || member.memberId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block">Phone Number</span>
                <span className="font-semibold">{member.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Occupation</span>
                <span className="font-semibold">{member.occupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Permanent Address</span>
                <span className="font-semibold">{member.address}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Next of Kin</span>
                <span className="font-semibold">
                  {member.nextOfKin?.name} ({member.nextOfKin?.relationship}) • {member.nextOfKin?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Record Payment Action Button */}
          <div className="print:hidden">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onClose();
                onRecordPaymentForMember(member);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm tap-spring transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Record Walk-In Payment for {member.fullName}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Passbook Ledger Transactions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Passbook Financial History
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {passbookData?.records?.length || 0} Entries Recorded
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                Loading passbook ledger...
              </div>
            ) : passbookData?.records?.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-400">
                No payment vouchers recorded for this member yet.
              </div>
            ) : (
              <div className="space-y-2">
                {passbookData?.records.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {r.receiptNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          • {r.recordedAt}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : r.status === 'PENDING_VERIFICATION'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {r.categoryLabel}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Method: {r.method.replace(/_/g, ' ')} • Staff: {r.recordedBy}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white block">
                          +{formatNaira(r.amount)}
                        </span>
                        {r.balanceAfter !== undefined && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Bal: {formatNaira(r.balanceAfter)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onViewVoucher(r)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors text-xs print:hidden"
                        title="View Official Receipt Voucher"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
