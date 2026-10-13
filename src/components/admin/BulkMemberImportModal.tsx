import React, { useState, useId } from 'react';
import type { BulkMemberImportRow, BulkImportResult } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { formatNaira } from '../../utils/currencyFormatter';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  X,
  UserPlus,
  Coins,
  ArrowRight,
  Database,
  Building,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

interface BulkMemberImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (result: BulkImportResult) => void;
}

export const BulkMemberImportModal: React.FC<BulkMemberImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const { currentAdmin, showToast, fireConfetti, refreshData } = useApp();
  const fileInputId = useId();

  // Top Mode: 'single' (Add Single Member with B/F) vs 'batch' (Spreadsheet / CSV Batch Entry)
  const [activeMode, setActiveMode] = useState<'single' | 'batch'>('single');

  // ──────────────── Single Member Form State ────────────────
  const [fullName, setFullName] = useState('');
  const [memberId, setMemberId] = useState(() => `MCS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [phone, setPhone] = useState('');

  // 5 Balances Brought Forward
  const [savingsBf, setSavingsBf] = useState<number>(0);
  const [sharesBf, setSharesBf] = useState<number>(0);
  const [loansBf, setLoansBf] = useState<number>(0);
  const [loanInterestBf, setLoanInterestBf] = useState<number>(0);
  const [coopDeductionBf, setCoopDeductionBf] = useState<number>(0);

  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);

  // ──────────────── Batch / Spreadsheet State ────────────────
  const [activeBatchTab, setActiveBatchTab] = useState<'upload' | 'paste'>('paste');
  const [pasteData, setPasteData] = useState('');
  const [parsedRows, setParsedRows] = useState<BulkMemberImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewFilter, setPreviewFilter] = useState('');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);

  if (!isOpen) return null;

  // ── Download Official CSV Migration Template ──
  const handleDownloadTemplate = () => {
    triggerHaptic('light');
    const headers = 'Member_ID,Full_Name,Phone,Savings_BF,Shares_BF,Loan_Principal_BF,Loan_Interest_BF,Coop_Deduction_BF\n';
    const sampleRows = [
      'MCS-2026-1001,Alhaja Folashade Adeleke,08031234567,650000,50000,200000,10000,2500',
      'MCS-2026-1002,Chief Babatunde Balogun,08029876543,1200000,100000,0,0,5000',
      'MCS-2026-1003,Deaconess Maryam Awolowo,08145556677,450000,50000,150000,7500,2500',
      'MCS-2026-1004,Mr. Chinedu Okafor,08051112233,850000,50000,300000,15000,2500'
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mosunmola_member_opening_balances_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Official CSV template with 5 B/F columns downloaded', 'info');
  };

  // ── Parse CSV text ──
  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('No member data rows found in input', 'error');
      return;
    }

    const rows: BulkMemberImportRow[] = [];
    const firstLineCols = (lines[0].includes('\t') ? lines[0].split('\t') : lines[0].split(','))
      .map(c => c.trim().toLowerCase().replace(/^["']|["']$/g, ''));

    // Check if first line is a header
    const hasHeader = firstLineCols.some(c =>
      c.includes('member') || c.includes('name') || c.includes('saving') || c.includes('share') || c.includes('loan') || c.includes('bf')
    );

    // Build column index mapping if header present
    let idIdx = -1;
    let nameIdx = -1;
    let phoneIdx = -1;
    let savIdx = -1;
    let shrIdx = -1;
    let lnIdx = -1;
    let intIdx = -1;
    let dedIdx = -1;

    if (hasHeader) {
      firstLineCols.forEach((col, idx) => {
        if (idIdx === -1 && (col.includes('id') || col.includes('member_id') || col.includes('card'))) idIdx = idx;
        else if (nameIdx === -1 && (col.includes('name') || col.includes('member'))) nameIdx = idx;
        else if (phoneIdx === -1 && (col.includes('phone') || col.includes('mobile') || col.includes('tel'))) phoneIdx = idx;
        else if (savIdx === -1 && (col.includes('saving') || col.includes('sav_bf'))) savIdx = idx;
        else if (shrIdx === -1 && (col.includes('share') || col.includes('shr_bf'))) shrIdx = idx;
        else if (intIdx === -1 && (col.includes('interest') || col.includes('int_bf'))) intIdx = idx;
        else if (lnIdx === -1 && (col.includes('loan') || col.includes('principal'))) lnIdx = idx;
        else if (dedIdx === -1 && (col.includes('deduct') || col.includes('coop') || col.includes('levy'))) dedIdx = idx;
      });
    }

    const dataLines = hasHeader ? lines.slice(1) : lines;

    const parseNum = (val: string | undefined) => {
      if (!val) return 0;
      const clean = val.replace(/[^0-9.]/g, '');
      return parseFloat(clean) || 0;
    };

    dataLines.forEach((line, index) => {
      const parts = (line.includes('\t') ? line.split('\t') : line.split(','))
        .map(p => p.trim().replace(/^["']|["']$/g, ''));

      if (parts.length >= 2) {
        let rawId = '';
        let rawName = '';
        let rawPhone = '';
        let savBf = 0;
        let shrBf = 0;
        let lnBf = 0;
        let intBf = 0;
        let dedBf = 0;

        if (hasHeader && idIdx !== -1 && nameIdx !== -1) {
          rawId = parts[idIdx] || '';
          rawName = parts[nameIdx] || '';
          rawPhone = phoneIdx !== -1 ? (parts[phoneIdx] || '') : '';
          savBf = savIdx !== -1 ? parseNum(parts[savIdx]) : 0;
          shrBf = shrIdx !== -1 ? parseNum(parts[shrIdx]) : 0;
          lnBf = lnIdx !== -1 ? parseNum(parts[lnIdx]) : 0;
          intBf = intIdx !== -1 ? parseNum(parts[intIdx]) : 0;
          dedBf = dedIdx !== -1 ? parseNum(parts[dedIdx]) : 0;
        } else if (parts.length === 8) {
          // Standard 8 columns: Member_ID, Full_Name, Phone, Savings_BF, Shares_BF, Loan_Principal_BF, Loan_Interest_BF, Coop_Deduction_BF
          rawId = parts[0];
          rawName = parts[1];
          rawPhone = parts[2];
          savBf = parseNum(parts[3]);
          shrBf = parseNum(parts[4]);
          lnBf = parseNum(parts[5]);
          intBf = parseNum(parts[6]);
          dedBf = parseNum(parts[7]);
        } else if (parts.length === 7) {
          // 7 columns (no phone): Member_ID, Full_Name, Savings_BF, Shares_BF, Loan_Principal_BF, Loan_Interest_BF, Coop_Deduction_BF
          rawId = parts[0];
          rawName = parts[1];
          savBf = parseNum(parts[2]);
          shrBf = parseNum(parts[3]);
          lnBf = parseNum(parts[4]);
          intBf = parseNum(parts[5]);
          dedBf = parseNum(parts[6]);
        } else if (parts.length >= 11) {
          // Legacy format: ID, Name, Phone, Email, Occ, Addr, Savings, Shares, Loan, Int, Ded
          rawId = parts[0];
          rawName = parts[1];
          rawPhone = parts[2];
          savBf = parseNum(parts[6]);
          shrBf = parseNum(parts[7]);
          lnBf = parseNum(parts[8]);
          intBf = parseNum(parts[9]);
          dedBf = parseNum(parts[10]);
        } else {
          // Fallback positional
          rawId = parts[0];
          rawName = parts[1];
          rawPhone = parts[2] || '';
          savBf = parseNum(parts[3]);
          shrBf = parseNum(parts[4]);
          lnBf = parseNum(parts[5]);
          intBf = parseNum(parts[6]);
          dedBf = parseNum(parts[7]);
        }

        if (rawName) {
          rows.push({
            memberId: rawId || `MCS-2026-${String(index + 1001).padStart(4, '0')}`,
            fullName: rawName,
            phone: rawPhone || '+234 800 000 0000',
            savingsBf: savBf,
            totalSavings: savBf,
            sharesBf: shrBf,
            shareCapital: shrBf,
            loansBf: lnBf,
            loanPrincipalBf: lnBf,
            loanInterestBf: intBf,
            coopDeductionBf: dedBf,
            cooperativeDeductionBf: dedBf
          });
        }
      }
    });

    if (rows.length === 0) {
      showToast('Could not parse valid member records. Check CSV format.', 'error');
      return;
    }

    setParsedRows(rows);
    showToast(`Successfully parsed ${rows.length} member records!`, 'success');
  };

  // ── Handle File Upload ──
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseCsvContent(text);
    };
    reader.readAsText(file);
  };

  // ── Submit Single Member ──
  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Full legal name is required.', 'error');
      return;
    }
    if (!memberId.trim()) {
      showToast('Member ID is required.', 'error');
      return;
    }

    setIsSubmittingSingle(true);
    try {
      const res = await adminService.createMember({
        fullName: fullName.trim(),
        memberId: memberId.trim().toUpperCase(),
        phone: phone.trim() || undefined,
        savingsBf,
        sharesBf,
        loansBf,
        loanInterestBf,
        coopDeductionBf
      });

      if (res.success) {
        triggerHaptic('success');
        showToast(res.message || `Member ${fullName} registered with verified B/F balances!`, 'success');
        fireConfetti();
        refreshData();
        onClose();
      } else {
        triggerHaptic('error');
        showToast(res.message || 'Error onboarding member.', 'error');
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Failed to onboard member.', 'error');
    } finally {
      setIsSubmittingSingle(false);
    }
  };

  // ── Submit Batch Import ──
  const handleExecuteBatchImport = async () => {
    if (parsedRows.length === 0) {
      showToast('No parsed rows to import.', 'error');
      return;
    }

    setIsProcessingBatch(true);
    try {
      const res = await adminService.bulkImportMembers(parsedRows, currentAdmin?.name || 'Secretariat Admin');
      if (res.success && res.data) {
        setImportResult(res.data);
        triggerHaptic('success');
        fireConfetti();
        showToast(`Successfully imported ${res.data.totalImported} members into live ledger!`, 'success');
        refreshData();
        if (onImportComplete) onImportComplete(res.data);
      } else {
        triggerHaptic('error');
        showToast(res.message || 'Bulk import failed.', 'error');
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error executing batch import.', 'error');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  // Batch Summary Calculations
  const filteredRows = previewFilter.trim()
    ? parsedRows.filter(
        (r) =>
          r.fullName.toLowerCase().includes(previewFilter.toLowerCase()) ||
          r.memberId.toLowerCase().includes(previewFilter.toLowerCase()) ||
          r.phone.includes(previewFilter)
      )
    : parsedRows;

  const totalSavingsBf = parsedRows.reduce((sum, r) => sum + (r.savingsBf || r.totalSavings || 0), 0);
  const totalSharesBf = parsedRows.reduce((sum, r) => sum + (r.sharesBf || r.shareCapital || 0), 0);
  const totalLoansBf = parsedRows.reduce((sum, r) => sum + (r.loansBf || r.loanPrincipalBf || 0), 0);
  const totalLoanInterestBf = parsedRows.reduce((sum, r) => sum + (r.loanInterestBf || 0), 0);
  const totalCoopDeductionBf = parsedRows.reduce((sum, r) => sum + (r.coopDeductionBf || r.cooperativeDeductionBf || 0), 0);

  // Single Net Equity
  const singleTotalAssets = savingsBf + sharesBf;
  const singleTotalLiabilities = loansBf + loanInterestBf + coopDeductionBf;
  const singleNetEquity = singleTotalAssets - singleTotalLiabilities;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Header Strip */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Member Onboarding & Balance Brought Forward (B/F)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Register members with verified legacy balances for savings, shares, loans, loan interest & statutory deductions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Mode Tabs (Single Member vs Batch Spreadsheet) */}
        <div className="px-5 sm:px-6 pt-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveMode('single');
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeMode === 'single'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Single Member Entry (With B/F)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveMode('batch');
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeMode === 'batch'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Spreadsheet / CSV Batch Import</span>
            {parsedRows.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
                {parsedRows.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-950">
          
          {/* ═══════════════════════════════════════════════════════════════
              MODE 1: SINGLE MEMBER ONBOARDING WITH B/F BALANCES
             ═══════════════════════════════════════════════════════════════ */}
          {activeMode === 'single' && (
            <form onSubmit={handleSubmitSingle} className="space-y-6">
              
              {/* Member Identification Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  1. Member Identification Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Adeleke Babatunde"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Member ID / Card ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MCS-2026-0042"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5 Historical Balances Brought Forward */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    2. Verified Historical Balances Brought Forward (B/F)
                  </h3>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Posts directly into ledger
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* 1. Savings B/F */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      1. Savings B/F (₦)
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Opening thrift / voluntary savings
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={savingsBf || ''}
                      placeholder="0"
                      onChange={(e) => setSavingsBf(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="mt-1 text-right text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatNaira(savingsBf)}
                    </div>
                  </div>

                  {/* 2. Shares B/F */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      2. Shares B/F (₦)
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Statutory share capital credit
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={sharesBf || ''}
                      placeholder="0"
                      onChange={(e) => setSharesBf(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="mt-1 text-right text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatNaira(sharesBf)}
                    </div>
                  </div>

                  {/* 3. Loans Principal B/F */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      3. Loans Principal B/F (₦)
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Outstanding loan principal owed
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={loansBf || ''}
                      placeholder="0"
                      onChange={(e) => setLoansBf(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono font-bold text-amber-700 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="mt-1 text-right text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {formatNaira(loansBf)}
                    </div>
                  </div>

                  {/* 4. Loan Interest B/F */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      4. Loan Interest B/F (₦)
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Unpaid interest accrued
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={loanInterestBf || ''}
                      placeholder="0"
                      onChange={(e) => setLoanInterestBf(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono font-bold text-amber-700 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="mt-1 text-right text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {formatNaira(loanInterestBf)}
                    </div>
                  </div>

                  {/* 5. Cooperative Deduction B/F */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2 lg:col-span-2">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      5. Cooperative Statutory Deduction / Levy B/F (₦)
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5">
                      Administrative statutory deductions or passbook dues
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={coopDeductionBf || ''}
                      placeholder="0"
                      onChange={(e) => setCoopDeductionBf(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="mt-1 text-right text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {formatNaira(coopDeductionBf)}
                    </div>
                  </div>
                </div>

                {/* Live Member Position Summary */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Total Assets (Savings + Shares)</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatNaira(singleTotalAssets)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Total Liabilities (Loans + Int + Ded)</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{formatNaira(singleTotalLiabilities)}</strong>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:pl-4 border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Net Opening Equity</span>
                    <strong className={`font-mono text-sm ${singleNetEquity >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600'}`}>
                      {formatNaira(singleNetEquity)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingSingle}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                >
                  {isSubmittingSingle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Recording Ledger...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Onboard Member & Post Opening Ledger Balances</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              MODE 2: BATCH SPREADSHEET / CSV ENTRY
             ═══════════════════════════════════════════════════════════════ */}
          {activeMode === 'batch' && (
            <div className="space-y-6">
              
              {/* Top Action Ribbon: Template & Paste/Upload Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBatchTab('paste')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeBatchTab === 'paste'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Copy-Paste CSV Text
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBatchTab('upload')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeBatchTab === 'upload'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Upload CSV File
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Template with 5 B/F Columns</span>
                </button>
              </div>

              {/* Paste or Upload Panel */}
              {activeBatchTab === 'paste' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase font-mono text-slate-700 dark:text-slate-300">
                    Paste CSV or Tab-Delimited Rows (Member_ID, Full_Name, Phone, Savings_BF, Shares_BF, Loan_Principal_BF, Loan_Interest_BF, Coop_Deduction_BF)
                  </label>
                  <textarea
                    rows={5}
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    placeholder="MCS-2026-1001,Alhaja Folashade Adeleke,08031234567,650000,50000,200000,10000,2500"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => parseCsvContent(pasteData)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Parse & Validate Rows</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                  <UploadCloud className="w-10 h-10 mx-auto text-slate-400" />
                  <div>
                    <label
                      htmlFor={fileInputId}
                      className="cursor-pointer text-xs font-bold text-emerald-600 hover:text-emerald-500 underline"
                    >
                      Click to choose CSV file
                    </label>
                    <input
                      id={fileInputId}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {fileName ? `Selected file: ${fileName}` : 'Supports UTF-8 CSV with legacy passbook columns'}
                    </p>
                  </div>
                </div>
              )}

              {/* Parsed Preview Table & Aggregate Summary */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 pt-2">
                  {/* Aggregate Summary Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Total Records</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-sm">{parsedRows.length}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold">Savings B/F</span>
                      <strong className="font-mono text-emerald-700 dark:text-emerald-300 text-xs">{formatNaira(totalSavingsBf)}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-semibold">Shares B/F</span>
                      <strong className="font-mono text-emerald-700 dark:text-emerald-300 text-xs">{formatNaira(totalSharesBf)}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-semibold">Loans B/F</span>
                      <strong className="font-mono text-amber-700 dark:text-amber-300 text-xs">{formatNaira(totalLoansBf)}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-semibold">Loan Int. B/F</span>
                      <strong className="font-mono text-amber-700 dark:text-amber-300 text-xs">{formatNaira(totalLoanInterestBf)}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Deductions B/F</span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200 text-xs">{formatNaira(totalCoopDeductionBf)}</strong>
                    </div>
                  </div>

                  {/* Filter Search */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Filter parsed records..."
                        value={previewFilter}
                        onChange={(e) => setPreviewFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setParsedRows([])}
                      className="text-xs text-red-600 hover:underline font-mono"
                    >
                      Clear Parsed List
                    </button>
                  </div>

                  {/* Table with horizontal scroll */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-72">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 sticky top-0 font-mono text-[11px]">
                        <tr>
                          <th className="p-2.5">Member ID</th>
                          <th className="p-2.5">Full Name</th>
                          <th className="p-2.5">Phone</th>
                          <th className="p-2.5 text-right">Savings B/F</th>
                          <th className="p-2.5 text-right">Shares B/F</th>
                          <th className="p-2.5 text-right">Loans B/F</th>
                          <th className="p-2.5 text-right">Interest B/F</th>
                          <th className="p-2.5 text-right">Coop Ded B/F</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
                        {filteredRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white">{r.memberId}</td>
                            <td className="p-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{r.fullName}</td>
                            <td className="p-2.5 text-slate-500">{r.phone}</td>
                            <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                              {formatNaira(r.savingsBf || r.totalSavings || 0)}
                            </td>
                            <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400">
                              {formatNaira(r.sharesBf || r.shareCapital || 0)}
                            </td>
                            <td className="p-2.5 text-right text-amber-600 dark:text-amber-400">
                              {formatNaira(r.loansBf || r.loanPrincipalBf || 0)}
                            </td>
                            <td className="p-2.5 text-right text-amber-600 dark:text-amber-400">
                              {formatNaira(r.loanInterestBf || 0)}
                            </td>
                            <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">
                              {formatNaira(r.coopDeductionBf || r.cooperativeDeductionBf || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Batch Commit Button */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={isProcessingBatch}
                      onClick={handleExecuteBatchImport}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                    >
                      {isProcessingBatch ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Posting {parsedRows.length} Ledger Records...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Commit {parsedRows.length} Members to Live Ledger</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
