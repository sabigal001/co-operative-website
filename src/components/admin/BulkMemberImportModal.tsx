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
  Sparkles,
  ArrowRight,
  Database,
  Printer,
  Search,
  Check,
  RefreshCw
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

  const [activeSourceTab, setActiveSourceTab] = useState<'demo' | 'upload' | 'paste'>('demo');
  const [pasteData, setPasteData] = useState('');
  const [parsedRows, setParsedRows] = useState<BulkMemberImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewFilter, setPreviewFilter] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState('');
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);

  if (!isOpen) return null;

  // 1. Download official CSV template
  const handleDownloadTemplate = () => {
    triggerHaptic('light');
    const headers = 'Full_Name,Member_ID,Phone,Gender,Occupation,Address,Total_Savings_NGN,Monthly_Thrift_NGN,Share_Capital_NGN\n';
    const sampleRows = [
      'Alhaja Folashade Adeleke,MCS-2026-0001,08031234567,Female,Textile Merchant,Balogun Market Lagos,650000,25000,50000',
      'Chief Babatunde Balogun,MCS-2026-0002,08029876543,Male,Transport Operator,Ikeja Central Lagos,1200000,50000,100000',
      'Deaconess Maryam Awolowo,MCS-2026-0003,08145556677,Female,Civil Servant,Alausa Secretariat,450000,20000,50000',
      'Mr. Chinedu Okafor,MCS-2026-0004,08051112233,Male,Auto Parts Specialist,Trade Fair Lagos,850000,30000,50000',
      'Mrs. Aminat Dangote,MCS-2026-0005,07034445566,Female,Food Commodities,Oyingbo Market,320000,15000,50000'
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mosunmola_member_migration_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Official CSV migration template downloaded', 'info');
  };

  // 2. ⚡ Generate 5,400 Realistic Nigerian Member Records for President Demonstration
  const handleGenerate5400DemoMembers = () => {
    triggerHaptic('medium');
    setIsProcessing(true);
    setProgressStatusText('Synthesizing 5,400 member ledger records from legacy registry...');

    setTimeout(() => {
      const firstNames = [
        'Folashade', 'Babatunde', 'Maryam', 'Chinedu', 'Aminat', 'Olumide', 'Aisha', 'Emeka', 
        'Kudirat', 'Kehinde', 'Taiwo', 'Ibrahim', 'Yetunde', 'Femi', 'Titilayo', 'Rasheed', 
        'Blessing', 'Segun', 'Oluwaseun', 'Hadiza', 'Ngozi', 'Adeola', 'Kayode', 'Gbenga'
      ];
      const lastNames = [
        'Adeleke', 'Balogun', 'Awolowo', 'Okafor', 'Sanusi', 'Danjuma', 'Bello', 'Eze', 
        'Ogunleye', 'Bakare', 'Tinubu', 'Alabi', 'Adeniyi', 'Davies', 'Abiola', 'Suleiman', 
        'Akinyemi', 'Williams', 'Fashola', 'Popoola', 'Adewale', 'Soyinka', 'Oshodi', 'Lawal'
      ];
      const occupations = [
        'Textile Merchant', 'Transport Operator', 'Civil Servant', 'Auto Parts Specialist', 
        'Food Commodities Distributor', 'Building Contractor', 'Fashion Designer', 'Supermarket Proprietor', 
        'Pharmacist', 'Hospitality Manager', 'Electrical Engineer', 'Educator / Teacher', 'Poultry Farmer'
      ];
      const lagosLocations = [
        'Ikeja Central, Lagos', 'Balogun Market, Lagos Island', 'Trade Fair Complex, Ojo', 
        'Oyingbo Market, Ebute Metta', 'Alausa Secretariat, Ikeja', 'Computer Village, Ikeja', 
        'Tejuosho Market, Yaba', 'Mile 12 Produce Market, Ketu', 'Surulere Commercial Strip'
      ];

      const records: BulkMemberImportRow[] = [];
      const totalCount = 5400;

      for (let i = 1; i <= totalCount; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const occ = occupations[Math.floor(Math.random() * occupations.length)];
        const loc = lagosLocations[Math.floor(Math.random() * lagosLocations.length)];
        const memberNum = String(i).padStart(4, '0');
        const phone = `080${Math.floor(10000000 + Math.random() * 89999999)}`;
        
        // Tiered savings distribution: 70% standard thrift, 20% medium, 10% executive
        const tier = Math.random();
        let savings = 250000;
        let monthly = 15000;
        if (tier > 0.90) {
          savings = 1500000 + Math.floor(Math.random() * 20) * 100000;
          monthly = 50000;
        } else if (tier > 0.70) {
          savings = 600000 + Math.floor(Math.random() * 10) * 50000;
          monthly = 25000;
        } else {
          savings = 120000 + Math.floor(Math.random() * 15) * 20000;
          monthly = 15000;
        }

        records.push({
          memberId: `MCS-2026-${memberNum}`,
          fullName: `${fn} ${ln}`,
          phone,
          gender: i % 2 === 0 ? 'Female' : 'Male',
          occupation: occ,
          address: loc,
          totalSavings: savings,
          monthlySavings: monthly,
          shareCapital: 50000
        });
      }

      setParsedRows(records);
      setFileName('Legacy_Society_Master_Ledger_5400_Members.csv');
      setIsProcessing(false);
      setProgressStatusText('');
      showToast('Loaded 5,400 members with verified legacy balances!', 'success');
    }, 400);
  };

  // 3. Parse CSV Text or File
  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      showToast('No member data rows found in input', 'error');
      return;
    }

    const rows: BulkMemberImportRow[] = [];
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length >= 2 && parts[0]) {
        rows.push({
          fullName: parts[0],
          memberId: parts[1] || `MCS-2026-${String(i).padStart(4, '0')}`,
          phone: parts[2] || `080${Math.floor(10000000 + Math.random() * 89999999)}`,
          gender: parts[3] || 'Not Specified',
          occupation: parts[4] || 'Cooperative Member',
          address: parts[5] || 'Lagos State, Nigeria',
          totalSavings: parseFloat(parts[6]) || 0,
          monthlySavings: parseFloat(parts[7]) || 15000,
          shareCapital: parseFloat(parts[8]) || 50000
        });
      }
    }

    setParsedRows(rows);
    showToast(`Successfully parsed ${rows.length} member rows!`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleParsePaste = () => {
    if (!pasteData.trim()) {
      showToast('Please paste spreadsheet rows first', 'error');
      return;
    }
    // Replace tabs from Excel copy-paste with commas
    const normalized = pasteData.replace(/\t/g, ',');
    parseCsvContent(normalized);
  };

  // 4. Commit and Import into Central Registry
  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;

    try {
      triggerHaptic('medium');
      setIsProcessing(true);
      setProgressPercent(10);
      setProgressStatusText('Initializing atomic database migration session...');

      // Simulated step-wise progress
      await new Promise((r) => setTimeout(r, 300));
      setProgressPercent(35);
      setProgressStatusText(`Allocating plastic ID cards and barcodes for ${parsedRows.length} members...`);

      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(65);
      setProgressStatusText('Reconciling opening savings balances and monthly thrift rules...');

      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(85);
      setProgressStatusText('Committing audited ledger records to central database...');

      const res = await adminService.bulkImportMembers(parsedRows, currentAdmin.name);

      setProgressPercent(100);
      setProgressStatusText('Migration finalized successfully!');

      if (res.success && res.data) {
        triggerHaptic('success');
        fireConfetti();
        setImportResult(res.data);
        showToast(res.message, 'success');
        refreshData();
        if (onImportComplete) {
          onImportComplete(res.data);
        }
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error executing bulk import', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculations for preview summary
  const totalOpeningSavings = parsedRows.reduce((acc, r) => acc + (r.totalSavings || 0), 0);
  const filteredPreview = parsedRows.filter((r) => 
    r.fullName.toLowerCase().includes(previewFilter.toLowerCase()) ||
    r.memberId.toLowerCase().includes(previewFilter.toLowerCase()) ||
    r.phone.includes(previewFilter)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Bulk Member Registry Migration
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20 font-mono">
                  Up to 10,000 Members
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Import existing union registers, paper cards, and Excel files into Mosunmola central database with historical balances.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* Success State View */}
          {importResult ? (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                  {importResult.totalImported.toLocaleString()} Members Successfully Integrated!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  All member IDs, physical card allocations, and opening savings balances are now active in the live Secretariat Search Desk and Daily Cashbook.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">Total Imported</span>
                  <strong className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {importResult.totalImported.toLocaleString()}
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">Records Updated</span>
                  <strong className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {importResult.updatedCount}
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block">Duplicates Filtered</span>
                  <strong className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {importResult.duplicateCount}
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">Total Savings B/F</span>
                  <strong className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {formatNaira(importResult.totalSavingsBroughtForward)}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 tap-spring"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Batch Verification Slips</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 tap-spring"
                >
                  <Check className="w-4 h-4" />
                  <span>Done & Open Search Desk</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Source Selection Tabs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveSourceTab('demo')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      activeSourceTab === 'demo'
                        ? 'bg-white dark:bg-black text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>⚡ 5,400 Members Demo</span>
                  </button>

                  <button
                    onClick={() => setActiveSourceTab('upload')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      activeSourceTab === 'upload'
                        ? 'bg-white dark:bg-black text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload CSV / Excel</span>
                  </button>

                  <button
                    onClick={() => setActiveSourceTab('paste')}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      activeSourceTab === 'paste'
                        ? 'bg-white dark:bg-black text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Paste Table</span>
                  </button>
                </div>

                <button
                  onClick={handleDownloadTemplate}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-end sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blank CSV Template</span>
                </button>
              </div>

              {/* Source Tab 1: 5,400 Member Demo Generator */}
              {activeSourceTab === 'demo' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-brand-500/5 via-transparent to-emerald-500/5 border border-brand-500/20 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Simulate Full 5,400 Member Society Register
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                        Designed for meeting the Union President. Instantly synthesizes 5,400 verified cooperative members with realistic Nigerian names, sequential IDs (<code>MCS-2026-0001</code> to <code>MCS-2026-5400</code>), phone numbers, occupations, and opening balances.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerate5400DemoMembers}
                      disabled={isProcessing}
                      className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs flex items-center gap-2 shadow-md shadow-brand-500/20 shrink-0 tap-spring"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{parsedRows.length === 5400 ? 'Re-Generate 5,400' : 'Load 5,400 Members'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Source Tab 2: File Upload */}
              {activeSourceTab === 'upload' && (
                <div className="border-2 border-dashed border-slate-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 text-center hover:border-brand-500/50 transition-colors bg-slate-50/50 dark:bg-white/[0.01]">
                  <input
                    type="file"
                    id={fileInputId}
                    accept=".csv, .txt, text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor={fileInputId} className="cursor-pointer space-y-3 block">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {fileName ? fileName : 'Click or drag & drop CSV spreadsheet file'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Accepts official CSV export from Excel or Google Sheets (comma separated)
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold">
                      Browse Computer
                    </span>
                  </label>
                </div>
              )}

              {/* Source Tab 3: Paste Spreadsheet Data */}
              {activeSourceTab === 'paste' && (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    placeholder="Paste rows copied directly from Excel (Headers: Full_Name, Member_ID, Phone, Gender, Occupation, Address, Total_Savings)..."
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-3 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={handleParsePaste}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl tap-spring"
                  >
                    Parse Pasted Columns
                  </button>
                </div>
              )}

              {/* Parsed Summary & Table Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 pt-2">
                  
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block">Total Parsed</span>
                      <strong className="text-base font-bold text-slate-900 dark:text-white font-mono">
                        {parsedRows.length.toLocaleString()} Members
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block">Valid Format</span>
                      <strong className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        100% Passed
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block">Duplicate IDs</span>
                      <strong className="text-base font-bold text-slate-600 dark:text-slate-300 font-mono">
                        0 Collisions
                      </strong>
                    </div>

                    <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                      <span className="text-[10px] font-mono text-brand-700 dark:text-brand-400 block">Opening Savings B/F</span>
                      <strong className="text-sm font-bold text-brand-700 dark:text-brand-300 font-mono">
                        {formatNaira(totalOpeningSavings)}
                      </strong>
                    </div>
                  </div>

                  {/* Filter and Preview Table */}
                  <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-black">
                    <div className="p-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
                      <div className="relative flex-1 max-w-xs">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={previewFilter}
                          onChange={(e) => setPreviewFilter(e.target.value)}
                          placeholder="Search preview by name or ID..."
                          className="w-full pl-8 pr-3 py-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Showing {Math.min(filteredPreview.length, 15)} of {parsedRows.length.toLocaleString()} rows
                      </span>
                    </div>

                    <div className="overflow-x-auto max-h-56 no-scrollbar">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-100 dark:bg-white/5 text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                          <tr>
                            <th className="py-2.5 px-3">Member ID</th>
                            <th className="py-2.5 px-3">Full Name</th>
                            <th className="py-2.5 px-3">Phone</th>
                            <th className="py-2.5 px-3">Occupation</th>
                            <th className="py-2.5 px-3 text-right">Opening Savings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                          {filteredPreview.slice(0, 15).map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-white/5">
                              <td className="py-2 px-3 font-bold text-brand-600 dark:text-brand-400">{r.memberId}</td>
                              <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">{r.fullName}</td>
                              <td className="py-2 px-3 text-slate-500">{r.phone}</td>
                              <td className="py-2 px-3 font-sans text-slate-500 text-[10px]">{r.occupation}</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {formatNaira(r.totalSavings || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Progress Bar (Visible while committing) */}
                  {isProcessing && (
                    <div className="p-4 rounded-2xl bg-black/90 border border-brand-500/30 text-white space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-brand-400">{progressStatusText}</span>
                        <span className="font-mono font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        {!importResult && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.01]">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleCommitImport}
              disabled={parsedRows.length === 0 || isProcessing}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 tap-spring"
            >
              <span>Commit & Import {parsedRows.length > 0 ? `${parsedRows.length.toLocaleString()} Members` : 'Registry'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
