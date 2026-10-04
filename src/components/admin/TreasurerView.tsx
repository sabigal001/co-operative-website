import React, { useState, useEffect } from 'react';
import type { DepositSubmission, LoanApplication, PayoutRequest } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Eye, 
  Check, 
  X
} from 'lucide-react';

export const TreasurerView: React.FC = () => {
  const { currentAdmin, showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'deposits' | 'disbursements' | 'payouts' | 'ledger'>('deposits');
  const [deposits, setDeposits] = useState<DepositSubmission[]>([]);
  const [disbursementQueue, setDisbursementQueue] = useState<LoanApplication[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [depRes, disbRes, payRes] = await Promise.all([
        adminService.getPendingDeposits(),
        adminService.getDisbursementQueue(),
        adminService.getPayoutRequests()
      ]);

      if (depRes.success) setDeposits(depRes.data);
      if (disbRes.success) setDisbursementQueue(disbRes.data);
      if (payRes.success) setPayouts(payRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dataVersion]);

  // Approve Deposit
  const handleApproveDeposit = async (depositId: string) => {
    try {
      const res = await adminService.approveDeposit(depositId, currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'success');
        fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error approving deposit', 'error');
    }
  };

  // Reject Deposit
  const handleRejectDeposit = async (depositId: string) => {
    try {
      const res = await adminService.rejectDeposit(depositId, 'Invalid bank transaction reference or uncredited NIP transfer', currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'info');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error rejecting deposit', 'error');
    }
  };

  // Disburse Loan Funds
  const handleDisburseLoan = async (loanId: string) => {
    try {
      const res = await adminService.disburseLoan(loanId, currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'success');
        fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error releasing disbursement', 'error');
    }
  };

  // Authorize Payout
  const handleApprovePayout = async (payoutId: string) => {
    try {
      const res = await adminService.approvePayout(payoutId, currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'success');
        fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error approving payout', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* RBAC Scope Notice Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-200">
        <Coins className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="text-white block mb-0.5">Treasurer Financial Operations Authority Active</strong>
          <span>
            You have full authorization to verify member bank transfer deposits, release loan disbursements, and authorize payouts. Access to member profile editing, role assignment, and Secretariat onboarding logbook is restricted.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'deposits' ? 'bg-black text-brand-400 border border-brand-500/30 shadow-sm' : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit Approvals ({deposits.filter((d) => d.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disbursements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'disbursements' ? 'bg-black text-brand-400 border border-brand-500/30 shadow-sm' : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Loan Disbursements ({disbursementQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'payouts' ? 'bg-black text-brand-400 border border-brand-500/30 shadow-sm' : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Payout Manager ({payouts.filter((p) => p.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ledger' ? 'bg-black text-brand-400 border border-brand-500/30 shadow-sm' : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cashflow & Ledgers</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DEPOSIT APPROVALS ================= */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Pending Member Deposit Submissions
            </h3>
            <p className="text-xs text-slate-500">
              Verify payment receipts against cooperative bank statements and credit member wallets.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Submission Ref</th>
                    <th className="py-3 px-4">Member Name & ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Bank Reference</th>
                    <th className="py-3 px-4">Proof</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Treasurer Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{dep.reference}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-bold text-slate-900 block">{dep.memberName}</span>
                        <span className="text-brand-700 font-mono text-[10px]">{dep.memberId}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                        ₦{dep.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans capitalize text-slate-600">
                        {dep.depositType.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{dep.bankReference}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <button
                          onClick={() => setPreviewProofUrl(dep.paymentProofUrl)}
                          className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Slip
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          dep.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          dep.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {dep.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveDeposit(dep.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectDeposit(dep.id)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-sans">
                            Handled by {dep.reviewedBy || 'Treasurer'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: LOAN DISBURSEMENT ================= */}
      {activeTab === 'disbursements' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Loans Vetted & Ready for Fund Disbursement
            </h3>
            <p className="text-xs text-slate-500">
              Applications already vetted and cleared by the Secretariat PA Officer. Authorize treasury release to member bank accounts.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {disbursementQueue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No vetted loans currently awaiting disbursement.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Loan ID</th>
                      <th className="py-3 px-4">Beneficiary</th>
                      <th className="py-3 px-4">Disbursement Sum</th>
                      <th className="py-3 px-4">Tenure</th>
                      <th className="py-3 px-4">PA Vetting Notes</th>
                      <th className="py-3 px-4 text-right">Disburse Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {disbursementQueue.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{loan.id}</td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className="font-bold text-slate-900 block">{loan.memberName}</span>
                          <span className="text-brand-700 font-mono text-[10px]">{loan.memberId}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                          ₦{loan.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-sans">{loan.durationMonths} Months</td>
                        <td className="py-3.5 px-4 font-sans text-slate-600 max-w-xs text-[11px]">
                          {loan.vettingNotes}
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          <button
                            onClick={() => handleDisburseLoan(loan.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto shadow-sm"
                          >
                            <Coins className="w-3.5 h-3.5" /> Release Funds
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PAYOUT MANAGER ================= */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Withdrawal & Liquidation Authorizations
            </h3>
            <p className="text-xs text-slate-500">
              Process verified savings withdrawals and dividend payouts to member commercial bank accounts.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Payout ID</th>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination Bank Account</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Authorize Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-800">{p.memberName}</td>
                      <td className="py-3.5 px-4 font-bold text-rose-700 text-sm">
                        ₦{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-700 text-[11px]">
                        <div>{p.bankName}</div>
                        <div className="font-mono font-bold text-slate-900">{p.accountNumber} ({p.accountName})</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        {p.status === 'pending' ? (
                          <button
                            onClick={() => handleApprovePayout(p.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Authorize NIP
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Authorized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FINANCIAL REPORTS & LEDGERS ================= */}
      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 font-display">Treasury Cashflow Summary</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Gross Monthly Thrift Inflows:</span>
                <span className="font-mono font-bold text-emerald-700">₦48,250,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Loan Repayment Recoveries:</span>
                <span className="font-mono font-bold text-emerald-700">₦19,400,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Loan Disbursements Outflow:</span>
                <span className="font-mono font-bold text-rose-700">-₦24,500,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Statutory Reserve Fund (30%):</span>
                <span className="font-mono font-bold text-slate-900">₦112,000,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 font-display">Liquidity Ratio & Reserve</h4>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Current Liquidity Ratio:</span>
                <span className="font-mono text-base">42.8%</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Complies with Lagos State Cooperative Directorate guideline minimum of 30.0%. Treasury solvency index is rated AAA+.
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>Primary Reserve Bank: Access Bank (Acc: 0129482710)</p>
              <p>Secondary Treasury Vault: Zenith Bank (Acc: 2019283746)</p>
            </div>
          </div>
        </div>
      )}

      {/* Proof Preview Modal */}
      {previewProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm">Payment Proof Document</h4>
              <button onClick={() => setPreviewProofUrl(null)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={previewProofUrl} alt="Deposit Proof" className="w-full h-56 object-cover rounded-2xl" />
            <button
              onClick={() => setPreviewProofUrl(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
