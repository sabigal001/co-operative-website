import React from 'react';
import type { Transaction } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print(); // Browser allows saving directly to PDF
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-slide-up relative">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-black text-white px-6 py-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white liquid-glass px-2.5 py-0.5 rounded-full border border-white/15">
              OFFICIAL RECEIPT
            </span>
            <span className="text-xs text-slate-300 font-mono">{transaction.reference}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="liquid-btn liquid-btn-default py-1.5 px-2.5 text-xs flex items-center gap-1.5"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="liquid-btn liquid-btn-white py-1.5 px-2.5 text-xs flex items-center gap-1.5"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="liquid-btn liquid-btn-default p-1.5 text-xs"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 printable-area space-y-6 bg-white">
          {/* Cooperative Header */}
          <div className="text-center border-b border-slate-200 pb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-black text-brand-400 font-black flex items-center justify-center text-sm">
                M
              </div>
              <h2 className="font-display font-extrabold text-lg text-black tracking-tight">
                MOSUNMOLA COOPERATIVE
              </h2>
            </div>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Multipurpose Society Limited
            </p>
            <p className="text-[10px] text-slate-500">
              Lagos State Ministry of Commerce & Cooperatives Registration No: <strong>LSCS/2018/8941</strong>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Secretariat: Plot 14, Commercial Avenue, Ikeja, Lagos • Phone: +234 (1) 489-0021
            </p>
          </div>

          {/* Receipt Status Badge & Amount */}
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>PAYMENT CONFIRMED & AUDITED</span>
            </div>
            <div className="text-3xl font-extrabold text-black font-display">
              ₦{transaction.amount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-medium capitalize mt-1">
              {transaction.description}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Transaction Reference:</span>
              <span className="font-mono font-bold text-slate-800">{transaction.reference}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Member Name:</span>
              <span className="font-bold text-slate-900">{transaction.memberName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Member ID Card:</span>
              <span className="font-mono font-bold text-brand-700">{transaction.memberId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Payment Category:</span>
              <span className="font-semibold text-slate-800 capitalize">
                {transaction.type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-medium text-slate-700">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Timestamp:</span>
              <span className="text-slate-700">{transaction.date}</span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-slate-900">
              <span>Cumulative Wallet Balance:</span>
              <span className="text-emerald-700">₦{transaction.balanceAfter.toLocaleString()}</span>
            </div>
          </div>

          {/* Cooperative Stamp & Digital Verification Seal */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-xl p-1 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500">
                <p className="font-bold text-slate-700">Cryptographic Seal</p>
                <p className="font-mono">{transaction.reference.slice(-10)}</p>
                <p className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Validated by Treasury
                </p>
              </div>
            </div>

            {/* Simulated Rubber Stamp */}
            <div className="border-2 border-dashed border-brand-600 rounded-xl p-2 text-center text-brand-700 rotate-[-6deg] opacity-90">
              <span className="text-[9px] uppercase font-black tracking-widest block">MOSUNMOLA COOP</span>
              <span className="text-[11px] font-black block">TREASURY AUDITED</span>
              <span className="text-[8px] font-mono block">DATE: {transaction.date.split(' ')[0]}</span>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100">
            This is a computer-generated formal receipt issued under the Bye-Laws of Mosunmola Cooperative Multipurpose Society. No signature required.
          </div>
        </div>
      </div>
    </div>
  );
};
