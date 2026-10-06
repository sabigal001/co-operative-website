import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Edit2,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Coins,
  FileText,
  Users2,
  Search,
  Clock,
  CreditCard,
  AlertCircle,
  ExternalLink,
  UploadCloud
} from 'lucide-react';
import { applicationService } from '../../services/api/applicationService';
import { COOPERATIVE_SAVINGS_PLANS } from '../../config/cooperativePlans';
import { ALL_NIGERIAN_STATES, getLgasForState } from '../../utils/nigeriaLocations';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import type { MembershipApplication, MembershipApplicationStatus } from '../../types';

interface MembershipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'apply' | 'track';
}

export const MembershipApplicationModal: React.FC<MembershipApplicationModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'apply'
}) => {
  const { showToast, fireConfetti, refreshData, openRegisterModal } = useApp();

  // Mode: Apply vs Track
  const [modalMode, setModalMode] = useState<'apply' | 'track'>(initialMode);

  // Wizard Step: 1 (Personal) -> 2 (Contact) -> 3 (Residence) -> 4 (Financial) -> 5 (Identity) -> 6 (Next of Kin) -> 7 (Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<MembershipApplication | null>(null);

  // Form Fields
  // Step 1: Personal
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1988-06-15');
  const [occupation, setOccupation] = useState('');

  // Step 2: Contact
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3: Residence
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [address, setAddress] = useState('');

  // Step 4: Financial Intent
  const [selectedPlanId, setSelectedPlanId] = useState<string>('standard');
  const [intendedMonthlySavings, setIntendedMonthlySavings] = useState<number>(50000);

  // Step 5: Identity
  const [idType, setIdType] = useState<'NIN' | 'FRSC Driver\'s License' | 'International Passport' | 'INEC Voter\'s Card'>('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState<boolean>(true);

  // Step 6: Next of Kin
  const [nokName, setNokName] = useState('');
  const [nokPhone, setNokPhone] = useState('');
  const [nokRelationship, setNokRelationship] = useState('Spouse');

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<MembershipApplication | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  if (!isOpen) return null;

  // Handle State change updates LGA list
  const handleStateChange = (newState: string) => {
    setState(newState);
    const availableLgas = getLgasForState(newState);
    setLga(availableLgas[0] || 'Central');
  };

  // Step validations
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!fullName.trim()) {
        showToast('Please enter your full legal name.', 'error');
        return false;
      }
      if (!occupation.trim()) {
        showToast('Please enter your occupation or enterprise.', 'error');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!email.trim() || !email.includes('@')) {
        showToast('Please provide a valid email address.', 'error');
        return false;
      }
      if (!phone.trim() || phone.length < 10) {
        showToast('Please provide a valid Nigerian phone number.', 'error');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!address.trim()) {
        showToast('Please provide your residential or office street address.', 'error');
        return false;
      }
      return true;
    }
    if (step === 5) {
      if (!idNumber.trim()) {
        showToast('Please enter your official identification document number.', 'error');
        return false;
      }
      return true;
    }
    if (step === 6) {
      if (!nokName.trim()) {
        showToast('Please enter the name of your Next of Kin.', 'error');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      triggerHaptic('selection');
      setCurrentStep((prev) => Math.min(prev + 1, 7) as any);
    } else {
      triggerHaptic('warning');
    }
  };

  const handlePrev = () => {
    triggerHaptic('selection');
    setCurrentStep((prev) => Math.max(prev - 1, 1) as any);
  };

  const handlePlanSelect = (planId: string, amount: number) => {
    triggerHaptic('light');
    setSelectedPlanId(planId);
    setIntendedMonthlySavings(amount);
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await applicationService.submitApplication({
        fullName,
        dateOfBirth,
        occupation,
        email,
        phone,
        state,
        lga,
        address,
        intendedMonthlySavings,
        monthlyThriftTarget: intendedMonthlySavings,
        savingsPlanId: selectedPlanId,
        idType,
        idNumber,
        idDocumentStatus: 'PROVIDED',
        reasonForJoining: 'Disciplined monthly thrift contributions and prime asset co-ownership.',
        nextOfKin: {
          name: nokName,
          phone: nokPhone || phone,
          relationship: nokRelationship,
          address
        },
        nextOfKinName: nokName,
        nextOfKinPhone: nokPhone || phone,
        nextOfKinRelationship: nokRelationship
      });

      if (res.success && res.data) {
        triggerHaptic('success');
        setSubmissionSuccess(res.data);
        fireConfetti();
        showToast('Application logged! Secretarial review in progress.', 'success');
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error submitting application', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Track Application Query
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await applicationService.trackApplication(trackQuery);
      if (res.success && res.data) {
        triggerHaptic('success');
        setTrackResult(res.data);
      } else {
        triggerHaptic('error');
        setTrackError(res.message);
      }
    } catch (err: any) {
      triggerHaptic('error');
      setTrackError(err.message || 'Network error during lookup');
    } finally {
      setTrackLoading(false);
    }
  };

  const resetModal = () => {
    triggerHaptic('light');
    setSubmissionSuccess(null);
    setCurrentStep(1);
    setTrackResult(null);
    setTrackError('');
    onClose();
  };

  const stepsList = [
    { num: 1, label: 'Personal', icon: <UserPlus className="w-3.5 h-3.5" /> },
    { num: 2, label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> },
    { num: 3, label: 'Residence', icon: <MapPin className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Financial', icon: <Coins className="w-3.5 h-3.5" /> },
    { num: 5, label: 'Identity', icon: <FileText className="w-3.5 h-3.5" /> },
    { num: 6, label: 'Kin', icon: <Users2 className="w-3.5 h-3.5" /> },
    { num: 7, label: 'Review', icon: <Sparkles className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 animate-slide-up relative flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                {modalMode === 'apply' ? 'Society Membership Application' : 'Track Application Status'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mosunmola Cooperative Multipurpose Society Ltd. • LSCS/2018/8941
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="bg-slate-200/80 dark:bg-white/10 p-0.5 rounded-full flex text-xs">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setModalMode('apply');
                }}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  modalMode === 'apply'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setModalMode('track');
                }}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  modalMode === 'track'
                    ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Track Status
              </button>
            </div>

            <button
              onClick={resetModal}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: TRACK APPLICATION STATUS                                         */}
        {/* ========================================================================= */}
        {modalMode === 'track' && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Applicant Status Command</p>
              <p>
                Have you already submitted an application to Mosunmola Cooperative? Enter your Application Reference ID (e.g. <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">APP-2026-00482</span>) or your registered email to view real-time Secretarial review progress.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. APP-2026-00482 or email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={trackLoading}
                className="liquid-btn liquid-btn-white text-black font-bold px-5 py-2.5 text-xs rounded-xl tap-spring disabled:opacity-50"
              >
                {trackLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Find Application'}
              </button>
            </form>

            {/* Error */}
            {trackError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Result Found */}
            {trackResult && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-5 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Application Reference
                    </span>
                    <h4 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {trackResult.id}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Applicant: {trackResult.fullName} • {trackResult.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trackResult.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                    trackResult.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {trackResult.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress Pipeline */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Application Review Pipeline:
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      <div className="text-xs mb-0.5">✓</div>
                      <span>Submitted</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border font-bold ${
                      trackResult.status === 'UNDER_REVIEW' || trackResult.status === 'APPROVED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-400'
                    }`}>
                      <div className="text-xs mb-0.5">
                        {trackResult.status === 'APPROVED' ? '✓' : '●'}
                      </div>
                      <span>Under Review</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border font-bold ${
                      trackResult.status === 'APPROVED'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-400'
                    }`}>
                      <div className="text-xs mb-0.5">{trackResult.status === 'APPROVED' ? '✓' : '○'}</div>
                      <span>Approved</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border font-bold ${
                      trackResult.approvedMemberId
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-400'
                    }`}>
                      <div className="text-xs mb-0.5">{trackResult.approvedMemberId ? '✓' : '○'}</div>
                      <span>Card Issued</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-400 font-bold">
                      <div className="text-xs mb-0.5">○</div>
                      <span>Digital Active</span>
                    </div>
                  </div>
                </div>

                {/* If Approved, direct to Physical Card Activation */}
                {trackResult.status === 'APPROVED' ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Congratulations! Your Society Membership is Approved</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      Canonical Member ID: <strong className="font-mono text-emerald-700 dark:text-emerald-300">{trackResult.approvedMemberId || 'MCS-2026-8942'}</strong>
                      <br />
                      Allocated Physical Card ID: <strong className="font-mono text-emerald-700 dark:text-emerald-300">{trackResult.assignedCardId || trackResult.approvedMemberId}</strong>
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('medium');
                          onClose();
                          openRegisterModal(trackResult.assignedCardId || trackResult.approvedMemberId);
                        }}
                        className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Proceed to Activate Physical Card</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">What happens next?</p>
                    <p>
                      The Super Admin & Secretariat Board verify your statutory identity documents against Lagos State cooperative bye-laws. Once approved, your plastic physical card will be embossed and dispatched to your chosen branch for collection.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: APPLY FOR MEMBERSHIP WIZARD                                       */}
        {/* ========================================================================= */}
        {modalMode === 'apply' && (
          <>
            {/* Success Submission View */}
            {submissionSuccess ? (
              <div className="p-8 text-center space-y-6 overflow-y-auto flex-1">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center text-emerald-500 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-white/10">
                    Application Submitted to Secretariat
                  </span>
                  <h4 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                    Application ID: <span className="font-mono text-slate-900 dark:text-white">{submissionSuccess.id}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your membership application has been received and is now <strong>Under Review</strong> by Mosunmola Cooperative Multipurpose Society.
                  </p>
                </div>

                {/* Statutory Lifecycle Diagram */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto space-y-3 text-left">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Next Institutional Stages:</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">1.</span>
                      <span><strong>Executive Review:</strong> Board verifies statutory identification and membership qualification.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">2.</span>
                      <span><strong>Membership Creation:</strong> Canonical Member ID (e.g. <span className="font-mono">MCS-2026-XXXX</span>) is generated.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">3.</span>
                      <span><strong>Physical Card Issuance:</strong> Physical RFID plastic card is prepared for branch pickup.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">4.</span>
                      <span><strong>Digital Activation:</strong> You link your issued card to the digital portal via OTP.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setModalMode('track');
                      setTrackQuery(submissionSuccess.id);
                      setSubmissionSuccess(null);
                    }}
                    className="liquid-btn liquid-btn-default text-xs py-2.5 px-5 rounded-xl w-full sm:w-auto"
                  >
                    Track Application Progress
                  </button>
                  <button
                    onClick={resetModal}
                    className="liquid-btn liquid-btn-white text-black font-bold py-2.5 px-6 text-xs rounded-xl w-full sm:w-auto"
                  >
                    Done, Return to Website
                  </button>
                </div>
              </div>
            ) : (
              /* Multi-Step Wizard */
              <div className="flex flex-col flex-1 overflow-hidden">
                
                {/* Progress Bar & Breadcrumbs */}
                <div className="px-6 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
                  <div className="flex items-center justify-between overflow-x-auto pb-1 gap-1 text-[11px]">
                    {stepsList.map((s) => (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => {
                          if (s.num < currentStep) setCurrentStep(s.num as any);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                          currentStep === s.num
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-bold shadow-sm'
                            : s.num < currentStep
                            ? 'text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-slate-200/50 dark:hover:bg-white/5'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <span>0{s.num}</span>
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Horizontal visual progress line */}
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(currentStep / 7) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Wizard Step Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">

                  {/* STEP 01: PERSONAL */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-emerald-500" />
                          <span>Tell us about yourself</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Provide your legal name as it appears on official government identity credentials.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Chief Adeleke Babatunde Balogun"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Date of Birth *</span>
                          </label>
                          <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span>Occupation / Enterprise *</span>
                          </label>
                          <input
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="e.g. Managing Director / Agro-Tech Consultant"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 02: CONTACT */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <Mail className="w-4 h-4 text-emerald-500" />
                          <span>How can we reach you?</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          We will dispatch your application updates and physical card dispatch notifications to these contacts.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. adeleke.balogun@company.ng"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Phone Number / WhatsApp *</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +234 803 456 7890"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                          required
                        />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Nigerian mobile format with SMS & WhatsApp capability.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 03: RESIDENCE */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span>Where are you based?</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          State of residence drives branch allocation and card pickup liaison center.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            State of Residence *
                          </label>
                          <select
                            value={state}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {ALL_NIGERIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Local Government Area (LGA) *
                          </label>
                          <select
                            value={lga}
                            onChange={(e) => setLga(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {getLgasForState(state).map((lg) => (
                              <option key={lg} value={lg}>{lg}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Residential / Office Street Address *
                        </label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={2}
                          placeholder="e.g. Plot 14, Admiralty Way, Lekki Phase 1"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 04: FINANCIAL INTENT */}
                  {currentStep === 4 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <Coins className="w-4 h-4 text-emerald-500" />
                          <span>Intended Monthly Savings Target</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Select your initial voluntary contribution target. This determines your initial loan eligibility bracket and dividend tier.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {COOPERATIVE_SAVINGS_PLANS.map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan.id, plan.monthlyAmount)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              selectedPlanId === plan.id
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white shadow-sm'
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">{plan.name}</span>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                                  {plan.tier}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm">
                                {plan.description}
                              </p>
                            </div>

                            <div className="text-right pl-3 shrink-0">
                              <div className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-mono">
                                ₦{plan.monthlyAmount.toLocaleString()}
                              </div>
                              <span className="text-[10px] text-slate-400 block">/ month</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                        <strong>Note:</strong> This is recorded as your intended contribution target. Actual debits or bank transfers occur only through your explicit instruction once approved.
                      </div>
                    </div>
                  )}

                  {/* STEP 05: IDENTITY */}
                  {currentStep === 5 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          <span>Verify your identity</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Mandatory cooperative vetting under the Nigerian Directorate of Cooperatives & NDPR guidelines.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Government ID Type *
                          </label>
                          <select
                            value={idType}
                            onChange={(e) => setIdType(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="NIN">National Identity Number (NIN)</option>
                            <option value="FRSC Driver's License">FRSC Driver's License</option>
                            <option value="International Passport">International Passport</option>
                            <option value="INEC Voter's Card">INEC Voter's Card</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Document Number *
                          </label>
                          <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="e.g. 29810482910"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Document Upload Simulation */}
                      <div className="border border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-4 text-center space-y-2 bg-slate-50/50 dark:bg-white/[0.02]">
                        <UploadCloud className="w-8 h-8 mx-auto text-emerald-500/80" />
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {idFileUploaded ? 'Document Ready for Verification' : 'Upload ID Document Slip (Optional)'}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                          JPG, PNG, or PDF file of your NIMC slip or ID card (maximum 5MB).
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Status: PROVIDED • PENDING SECRETARIAT REVIEW
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 06: NEXT OF KIN */}
                  {currentStep === 6 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <Users2 className="w-4 h-4 text-emerald-500" />
                          <span>Next of Kin & Beneficiary</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Designate your primary statutory beneficiary for cooperative share capital, savings, and dividends.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Next of Kin Full Name *
                        </label>
                        <input
                          type="text"
                          value={nokName}
                          onChange={(e) => setNokName(e.target.value)}
                          placeholder="e.g. Mrs. Olufunke Balogun"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Relationship *
                          </label>
                          <select
                            value={nokRelationship}
                            onChange={(e) => setNokRelationship(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child / Dependent</option>
                            <option value="Sibling">Brother / Sister</option>
                            <option value="Parent">Parent</option>
                            <option value="Business Partner">Business Partner</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Next of Kin Phone Number
                          </label>
                          <input
                            type="tel"
                            value={nokPhone}
                            onChange={(e) => setNokPhone(e.target.value)}
                            placeholder="e.g. +234 802 889 0011"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 07: REVIEW APPLICATION */}
                  {currentStep === 7 && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <span>Review your application</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Confirm all submitted details prior to formal transmission to the Super Admin review queue.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* Section 1: Personal */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PERSONAL</span>
                            <div className="font-bold text-slate-900 dark:text-white">{fullName}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{occupation} • DOB: {dateOfBirth}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>

                        {/* Section 2: Contact */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CONTACT</span>
                            <div className="font-bold text-slate-900 dark:text-white">{phone}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{email}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>

                        {/* Section 3: Residence */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RESIDENCE</span>
                            <div className="font-bold text-slate-900 dark:text-white">{address}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{lga}, {state} State</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>

                        {/* Section 4: Savings Plan */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SAVINGS INTENT</span>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              ₦{intendedMonthlySavings.toLocaleString()} / month
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px] capitalize">{selectedPlanId.replace('_', ' ')} Plan</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>

                        {/* Section 5: Identity */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IDENTIFICATION</span>
                            <div className="font-bold text-slate-900 dark:text-white">{idType}</div>
                            <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{idNumber} (PROVIDED)</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(5)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>

                        {/* Section 6: Next of Kin */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NEXT OF KIN</span>
                            <div className="font-bold text-slate-900 dark:text-white">{nokName}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{nokRelationship} • {nokPhone || phone}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(6)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Wizard Bottom Navigation Buttons */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 flex items-center justify-between shrink-0">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="liquid-btn liquid-btn-default text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {currentStep < 7 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 shadow-md tap-spring"
                    >
                      <span>Continue to 0{currentStep + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg tap-spring disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Submit Membership Application</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
