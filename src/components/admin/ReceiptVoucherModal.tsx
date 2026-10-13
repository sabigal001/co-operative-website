import React, { useRef } from 'react';
import type { DeskPaymentRecord } from '../../types';
import { formatNaira } from '../../utils/currencyFormatter';
import { triggerHaptic } from '../../utils/haptics';
import { 
  Printer, 
  CheckCircle2, 
  X, 
  Copy, 
  Clock, 
  ShieldCheck, 
  Building2,
  FileCheck2,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReceiptVoucherModalProps {
  payment: DeskPaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordAnother?: () => void;
}

export const ReceiptVoucherModal: React.FC<ReceiptVoucherModalProps> = ({
  payment,
  isOpen,
  onClose,
  onRecordAnother
}) => {
  const { showToast } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    triggerHaptic('medium');
    window.print();
  };

  const handleCopyRef = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(payment.receiptNumber);
    showToast(`Receipt voucher ${payment.receiptNumber} copied to clipboard!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col my-auto print:shadow-none print:border-none print:max-w-full print:rounded-none">
        
        {/* Top Action Bar (Hidden on print) */}
        <div className="px-5 py-4 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Official Payment Voucher
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-100 py-1.5 px-3 text-xs flex items-center gap-1.5 font-bold rounded-xl transition-all shadow-sm"
              title="Print Receipt Voucher"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Voucher Body */}
        <div ref={receiptRef} className="p-6 sm:p-8 space-y-6 print:p-6 print:text-black">
          
          {/* Cooperative Header & Seal */}
          <div className="border-b-2 border-slate-900 dark:border-white/20 pb-5 text-center space-y-1.5 print:border-black">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-display font-black text-xl mb-1 shadow-sm">
              M
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase print:text-black">
              MOSUNMOLA COOPERATIVE
            </h2>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider print:text-gray-700">
              Multipurpose Society Limited • Lagos State Reg: <span className="font-mono text-emerald-600 dark:text-emerald-400 print:text-black">LSCS/2018/8941</span>
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-600">
              Head Secretariat: 14 Commercial Avenue, Ikeja Central, Lagos State | Tel: +234 (1) 489-0021
            </p>
          </div>

          {/* Voucher Title & Number Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 print:bg-gray-100 print:border-gray-300">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Voucher Reference</span>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-mono font-black text-emerald-600 dark:text-emerald-400 print:text-black">
                  {payment.receiptNumber}
                </span>
                <button
                  onClick={handleCopyRef}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded print:hidden text-slate-400"
                  title="Copy reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Date & Timestamp</span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black">
                {payment.recordedAt}
              </span>
            </div>
          </div>

          {/* Member & Payment Particulars Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 print:border-gray-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Member Name</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white print:text-black">
                  {payment.memberName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Canonical Member ID</span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 print:text-black">
                  {payment.memberId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 print:border-gray-200">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Contribution Category</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black">
                  {payment.categoryLabel}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Payment Method</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black">
                  {payment.method === 'CASH_AT_DESK' && '💵 Cash Received at Secretariat Desk'}
                  {payment.method === 'BANK_TRANSFER' && '🏦 Direct Bank Transfer'}
                  {payment.method === 'BANK_TELLER' && '📄 Bank Deposit Slip'}
                  {payment.method === 'POS_TERMINAL' && '💳 Secretariat POS Swipe'}
                </span>
              </div>
            </div>

            {payment.reference && (
              <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <span className="uppercase text-[9px] text-slate-400 block">Teller / Memo Reference:</span>
                {payment.reference}
              </div>
            )}
          </div>

          {/* Amount Box */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 text-center space-y-1 print:border-black print:bg-gray-100">
            <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider print:text-black">
              Total Amount Acknowledged
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight print:text-black">
              {formatNaira(payment.amount)}
            </div>
            <p className="text-xs font-serif italic text-slate-700 dark:text-slate-300 print:text-black font-medium pt-1">
              *** {payment.amountInWords} ***
            </p>
          </div>

          {/* Status & Balance Note */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-white/10 print:border-gray-300">
            <div className="flex items-center gap-1.5 font-medium">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                payment.status === 'CONFIRMED'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : payment.status === 'PENDING_VERIFICATION'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                  : 'bg-red-500/15 text-red-700 dark:text-red-400'
              }`}>
                {payment.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                {payment.status === 'PENDING_VERIFICATION' && <Clock className="w-3 h-3" />}
                {payment.status}
              </span>
            </div>

            {payment.balanceAfter !== undefined && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Ledger Savings Balance:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black">
                  {formatNaira(payment.balanceAfter)}
                </span>
              </div>
            )}
          </div>

          {/* Signatures & Official Stamp Watermark */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs border-t-2 border-slate-900/10 dark:border-white/10 print:border-black">
            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-slate-400 print:border-black flex items-end justify-center pb-1">
                <span className="font-serif italic text-xs text-slate-500 dark:text-slate-400">
                  {payment.recordedBy}
                </span>
              </div>
              <div>
                <span className="font-bold block text-slate-900 dark:text-white print:text-black">Receiving Officer</span>
                <span className="text-[10px] text-slate-500 print:text-gray-600 block">{payment.recordedByRole}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-slate-400 print:border-black flex items-end justify-center pb-1">
                <div className="px-3 py-0.5 border border-emerald-600/40 rounded text-[9px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 print:text-black">
                  OFFICIAL AUDIT STAMP
                </div>
              </div>
              <div>
                <span className="font-bold block text-slate-900 dark:text-white print:text-black">Deaconess Maryam Awolowo</span>
                <span className="text-[10px] text-slate-500 print:text-gray-600 block">Chief Treasurer / Controller</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-white/5 text-[9px] font-mono text-slate-400 print:text-gray-500 space-y-0.5">
            <p>Generated by Mosunmola Cooperative Internal Financial Ledger Engine.</p>
            <p>This voucher is a valid statutory acknowledgement of receipt under Lagos State Cooperative Societies Law.</p>
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-100 py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt Voucher (A4/Thermal)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onRecordAnother && (
              <button
                onClick={() => {
                  onClose();
                  onRecordAnother();
                }}
                className="w-full sm:w-auto liquid-btn liquid-btn-default py-2 px-4 text-xs font-semibold"
              >
                + Record Another Payment
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-2 px-4 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
