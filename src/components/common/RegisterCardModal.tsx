import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { cardService } from '../../services/api/cardService';
import { authService } from '../../services/api/authService';
import { triggerHaptic } from '../../utils/haptics';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  KeyRound, 
  X, 
  Sparkles,
  Camera,
  Loader2,
  Building2,
  UserCheck,
  Check
} from 'lucide-react';
import type { CardLookupResponse } from '../../types';

export const RegisterCardModal: React.FC = () => {
  const { 
    isRegisterModalOpen, 
    closeRegisterModal, 
    prefillCardId, 
    loginMember, 
    setCurrentPortal, 
    showToast,
    fireConfetti 
  } = useApp();

  // 4 Core Steps:
  // 1: Card Lookup
  // 2: Member Verification
  // 3: Account Details Setup
  // 4: OTP Activation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Lookup Input & Lookup Result
  const [cardInput, setCardInput] = useState('');
  const [lookupResult, setLookupResult] = useState<CardLookupResponse | null>(null);

  // Step 2 & 3: Cooperative-Owned (Read-Only) vs Member-Managed (Editable)
  // Cooperative-owned
  const [canonicalMemberId, setCanonicalMemberId] = useState('');
  const [officialLegalName, setOfficialLegalName] = useState('');
  const [cardId, setCardId] = useState('');
  const [issuingBranch, setIssuingBranch] = useState('');
  const [membershipDate, setMembershipDate] = useState('');

  // Member-managed editable
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('SecurePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass@2026');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80');

  // Next of kin
  const [nokName, setNokName] = useState('');
  const [nokRel, setNokRel] = useState('Spouse');
  const [nokPhone, setNokPhone] = useState('');

  // Identity Confirmation Checkbox
  const [confirmedIdentity, setConfirmedIdentity] = useState(false);

  // Step 4: OTP Activation
  const [otpCode, setOtpCode] = useState('894201');

  useEffect(() => {
    if (prefillCardId) {
      setCardInput(prefillCardId);
    } else {
      setCardInput('MCS-2026-1033'); // Default unactivated demo card
    }
    setStep(1);
    setErrorMessage('');
    setLookupResult(null);
    setConfirmedIdentity(false);
  }, [prefillCardId, isRegisterModalOpen]);

  if (!isRegisterModalOpen) return null;

  // Step 01: Card Lookup
  const handleLookupCard = async (overrideId?: string) => {
    const idToLookup = (overrideId || cardInput).trim().toUpperCase();
    if (!idToLookup) {
      triggerHaptic('warning');
      setErrorMessage('Please enter your Physical Card ID or Member ID.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setLookupResult(null);

    try {
      const res = await cardService.lookupCard(idToLookup);
      setLookupResult(res.data);

      if (res.success && res.data.status === 'FOUND_ELIGIBLE') {
        triggerHaptic('success');
        const prefill = res.data.prefill;
        if (prefill) {
          setCanonicalMemberId(prefill.memberId);
          setOfficialLegalName(prefill.fullName);
          setCardId(prefill.cardId);
          setIssuingBranch(prefill.branch);
          setMembershipDate(prefill.joinDate);

          setEmail(prefill.email);
          setPhone(prefill.phone);
          setAddress(prefill.address || 'Plot 8, Admiralty Way, Lekki, Lagos');
          setOccupation(prefill.occupation || 'Business Executive');
          setNokName('Family Next of Kin');
          setNokPhone(prefill.phone);
        }
      } else {
        triggerHaptic('warning');
        setErrorMessage(res.message || res.data.message);
      }
    } catch (e: any) {
      triggerHaptic('error');
      setErrorMessage(e.message || 'Network error looking up card.');
    } finally {
      setLoading(false);
    }
  };

  // Step 01 -> Step 02: Proceed to Verification
  const handleProceedToVerification = () => {
    triggerHaptic('selection');
    setStep(2);
  };

  // Step 02 -> Step 03: Confirm Verification and Proceed to Credentials
  const handleProceedToAccountSetup = () => {
    if (!confirmedIdentity) {
      triggerHaptic('warning');
      setErrorMessage('Please check the box confirming you are the authorized cardholder.');
      return;
    }
    triggerHaptic('selection');
    setErrorMessage('');
    setStep(3);
  };

  // Step 03 -> Step 04: Submit Account Details & Trigger OTP
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !password.trim()) {
      triggerHaptic('warning');
      setErrorMessage('Please provide valid email, phone, and password.');
      return;
    }
    if (password !== confirmPassword) {
      triggerHaptic('warning');
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    triggerHaptic('selection');
    setErrorMessage('');
    setStep(4);
  };

  // Step 04: Verify OTP & Activate Account
  const handleVerifyOtpAndActivate = async () => {
    if (!otpCode || otpCode.length < 6) {
      triggerHaptic('warning');
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const otpRes = await authService.verifyOtp(otpCode);
      if (!otpRes.success) {
        triggerHaptic('error');
        setErrorMessage(otpRes.message);
        setLoading(false);
        return;
      }

      // Activate via cardService
      const activateRes = await cardService.activateCard({
        cardId,
        memberId: canonicalMemberId,
        email,
        phone,
        avatarUrl,
        address,
        occupation,
        nextOfKin: {
          name: nokName,
          phone: nokPhone || phone,
          relationship: nokRel,
          address
        }
      });

      if (activateRes.success && activateRes.data) {
        triggerHaptic('success');
        loginMember(activateRes.data);
        fireConfetti();
        showToast('Digital account activated! Welcome to Mosunmola Cooperative.', 'success');
        closeRegisterModal();
        setCurrentPortal('member');
      } else {
        triggerHaptic('error');
        setErrorMessage(activateRes.message || 'Activation failed.');
      }
    } catch (err: any) {
      triggerHaptic('error');
      setErrorMessage(err.message || 'Activation verification error.');
    } finally {
      setLoading(false);
    }
  };

  const sampleEligibleDemoCards = [
    { id: 'MCS-2026-1033', name: 'Hajiya Fatima Garba (Issued)', branch: 'Victoria Island' },
    { id: 'MCS-2026-5571', name: 'Engr. Emeka Okafor (Issued)', branch: 'Lekki Phase 1' },
    { id: 'MCS-2026-7890', name: 'Mrs. Folashade Adeyemi (Issued)', branch: 'Surulere Sub-Station' },
    { id: 'MCS-2026-8942', name: 'Chief Adeleke Balogun (Active)', branch: 'Ikeja Central' },
    { id: 'MCS-2026-3312', name: 'Oluwaseun Bakare (Blocked)', branch: 'Abeokuta Liaison' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 animate-slide-up relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Activate Your Physical Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Link your issued cooperative card to your secure digital member account.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              closeRegisterModal();
            }}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
          <div className="grid grid-cols-4 gap-2 text-[11px]">
            <div className={`p-2 rounded-xl text-center font-bold border transition-all ${
              step === 1 ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm' :
              step > 1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
              'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
            }`}>
              01 Lookup
            </div>
            <div className={`p-2 rounded-xl text-center font-bold border transition-all ${
              step === 2 ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm' :
              step > 2 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
              'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
            }`}>
              02 Verify
            </div>
            <div className={`p-2 rounded-xl text-center font-bold border transition-all ${
              step === 3 ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm' :
              step > 3 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
              'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
            }`}>
              03 Details
            </div>
            <div className={`p-2 rounded-xl text-center font-bold border transition-all ${
              step === 4 ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm' :
              'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'
            }`}>
              04 OTP
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">

          {/* ========================================================================= */}
          {/* STEP 01 — CARD LOOKUP                                                     */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Find Your Approved Physical Membership
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter the canonical Member ID or Physical Card Number embossed on your plastic card.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Physical Card ID / Member ID *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cardInput}
                      onChange={(e) => setCardInput(e.target.value)}
                      placeholder="e.g. MCS-2026-1033"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLookupCard()}
                    disabled={loading}
                    className="liquid-btn liquid-btn-white text-black font-bold px-4 py-2.5 text-xs rounded-xl tap-spring disabled:opacity-50 shrink-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Find Membership'}
                  </button>
                </div>
              </div>

              {/* Lookup Card Result Display */}
              {lookupResult && lookupResult.status === 'FOUND_ELIGIBLE' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-3 animate-slide-up">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Card Found & Eligible for Digital Activation</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Member Name</span>
                      <strong className="text-slate-900 dark:text-white">{lookupResult.prefill?.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Member ID</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{lookupResult.prefill?.memberId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Membership Status</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Digital Account</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">NOT ACTIVATED</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToVerification}
                    className="w-full liquid-btn liquid-btn-white text-black font-bold py-2.5 text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md tap-spring"
                  >
                    <span>Proceed to Identity Verification</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              )}

              {/* Already Activated Case */}
              {lookupResult && lookupResult.status === 'ALREADY_ACTIVATED' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3 animate-slide-up">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>This membership is already activated!</span>
                  </div>
                  <p className="text-xs">
                    Your digital account is fully active. You do not need to register again. Please sign in directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      closeRegisterModal();
                      setCurrentPortal('member');
                    }}
                    className="liquid-btn liquid-btn-white text-black font-bold py-2 text-xs rounded-xl w-full"
                  >
                    Sign In to Member Portal
                  </button>
                </div>
              )}

              {/* Sample demo cards to click for testing */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Quick Demo Lookup Cards:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {sampleEligibleDemoCards.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCardInput(c.id);
                        handleLookupCard(c.id);
                      }}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-left text-xs flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">{c.id}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{c.name}</div>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Select</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 02 — MEMBER VERIFICATION                                             */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Confirm Member Identity
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please verify that the official membership records match your identity before establishing credentials.
                </p>
              </div>

              {/* Verification Information Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Official Legal Name</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{officialLegalName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Canonical Member ID</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{canonicalMemberId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Phone (Masked)</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {lookupResult?.prefill?.maskedPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Email (Masked)</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {lookupResult?.prefill?.maskedEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Allocating Branch</span>
                    <span className="text-slate-700 dark:text-slate-300">{issuingBranch}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Membership Join Date</span>
                    <span className="text-slate-700 dark:text-slate-300">{membershipDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={confirmedIdentity}
                      onChange={(e) => setConfirmedIdentity(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I solemnly confirm that I am <strong>{officialLegalName}</strong>, the lawful recipient of Member ID <strong>{canonicalMemberId}</strong>, and am activating my personal digital portal.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="liquid-btn liquid-btn-default text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToAccountSetup}
                  className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow-md tap-spring"
                >
                  <span>Continue to Account Setup</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 03 — ACCOUNT DETAILS & SECURITY SETUP                                */}
          {/* ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleProceedToOtp} className="space-y-4 animate-slide-up">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Establish Digital Access Credentials
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cooperative-owned data is statutory and read-only. Configure your member login email, phone, and password.
                </p>
              </div>

              {/* Read-Only Statutory Badge */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Legal Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{officialLegalName}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Canonical Member ID</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{canonicalMemberId}</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>Member Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Primary Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Portal Password *</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Confirm Password *</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Residential / Business Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="liquid-btn liquid-btn-default text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow-md tap-spring"
                >
                  <span>Proceed to Final OTP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 04 — OTP ACTIVATION                                                  */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-4 animate-slide-up text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <KeyRound className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Enter 6-Digit Verification OTP
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  A transient authorization code has been dispatched to your mobile <strong className="font-mono text-slate-800 dark:text-slate-200">{phone}</strong>.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="894201"
                  maxLength={6}
                  className="w-full text-center py-3 text-2xl font-mono font-black tracking-widest rounded-2xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block">
                  Demo Code: 894201
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Finalizing Activation:</span>
                </div>
                <p>• Membership: <strong>ACTIVE</strong></p>
                <p>• Physical Plastic Card: <strong>ACTIVATED</strong></p>
                <p>• Secure Digital Account: <strong>ACTIVE</strong></p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="liquid-btn liquid-btn-default text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtpAndActivate}
                  disabled={loading}
                  className="liquid-btn liquid-btn-white text-black font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg tap-spring disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Activating Digital Member Account...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Activate Digital Member Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
