import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/api/authService';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Upload, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  KeyRound, 
  X, 
  Sparkles,
  Camera,
  Loader2
} from 'lucide-react';

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

  // Wizard state: 1: Lookup, 2: Verification Review, 3: Account Details & Photo, 4: OTP Activation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [cardId, setCardId] = useState('');
  const [verifiedInfo, setVerifiedInfo] = useState<{
    fullName: string;
    branch: string;
    phone?: string;
    email?: string;
  } | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password@123');
  const [nin, setNin] = useState('29810482910');
  const [address, setAddress] = useState('Plot 8, Admiralty Way, Lekki Phase 1, Lagos');
  const [occupation, setOccupation] = useState('Business Executive / Consultant');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80');

  // Next of kin
  const [nokName, setNokName] = useState('Mrs. Mariam Balogun');
  const [nokRel, setNokRel] = useState('Spouse');
  const [nokPhone, setNokPhone] = useState('+234 802 889 0011');

  // Step 4 OTP
  const [otpCode, setOtpCode] = useState('894201');

  useEffect(() => {
    if (prefillCardId) {
      setCardId(prefillCardId);
    } else {
      setCardId('MCS-2026-1033'); // Great demo default
    }
    setStep(1);
    setErrorMessage('');
  }, [prefillCardId, isRegisterModalOpen]);

  if (!isRegisterModalOpen) return null;

  // Step 1 -> Step 2: Verify ID Card
  const handleVerifyCard = async (overrideId?: string) => {
    const idToVerify = (overrideId || cardId).trim().toUpperCase();
    if (!idToVerify) {
      setErrorMessage('Please enter your Physical Member ID Card number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.verifyPhysicalCardId(idToVerify);
      if (res.success && res.data.valid) {
        setVerifiedInfo(res.data.prefill || null);
        if (res.data.prefill) {
          setFullName(res.data.prefill.fullName || '');
          if (res.data.prefill.phone) setPhone(res.data.prefill.phone);
          if (res.data.prefill.email) setEmail(res.data.prefill.email);
        }
        setStep(2);
      } else {
        setErrorMessage(res.message || 'Verification failed. Please check the ID.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network error verifying card.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> Step 3: Proceed to Registration form
  const handleProceedToAccount = () => {
    setStep(3);
  };

  // Step 3 -> Step 4: Submit Account & Trigger OTP
  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !password) {
      setErrorMessage('Please fill in email, phone, and secure password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      // Simulate submission and move to OTP
      await new Promise((r) => setTimeout(r, 600));
      setStep(4);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Verify OTP and Activate
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage('Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const otpRes = await authService.verifyOtp(otpCode);
      if (!otpRes.success) {
        setErrorMessage(otpRes.message);
        setLoading(false);
        return;
      }

      // Register in backend mock store
      const regRes = await authService.registerMember({
        cardId: cardId.toUpperCase(),
        fullName,
        email,
        phone,
        password,
        avatarUrl,
        nin,
        address,
        occupation,
        nextOfKin: {
          name: nokName,
          relationship: nokRel,
          phone: nokPhone,
          address: 'Same as member'
        }
      });

      if (regRes.success && regRes.data) {
        loginMember(regRes.data);
        fireConfetti();
        showToast('Physical Card Activated! Welcome to Mosunmola Cooperative.', 'success');
        closeRegisterModal();
        setCurrentPortal('member');
      } else {
        // If already existing, just log in
        const loginRes = await authService.loginMember(cardId);
        if (loginRes.success) {
          loginMember(loginRes.data);
          fireConfetti();
          closeRegisterModal();
          setCurrentPortal('member');
        } else {
          setErrorMessage(regRes.message || 'Failed to complete activation.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  const sampleDemoCards = [
    { id: 'MCS-2026-1033', name: 'Hajiya Fatima Garba', branch: 'Victoria Island' },
    { id: 'MCS-2026-5571', name: 'Engr. Emeka Okafor', branch: 'Lekki Phase 1' },
    { id: 'MCS-2026-7890', name: 'Mrs. Folashade Adeyemi', branch: 'Surulere Main' },
    { id: 'MCS-2026-8942', name: 'Chief Adeleke Balogun (Active)', branch: 'Ikeja Central' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="liquid-glass-card border border-white/15 text-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-slide-up relative">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl liquid-glass border border-white/15 flex items-center justify-center shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white leading-tight">
                Physical Card Activation
              </h3>
              <p className="text-xs text-slate-400">
                Link your issued plastic ID card to your digital member wallet
              </p>
            </div>
          </div>
          <button
            onClick={closeRegisterModal}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="px-6 py-3 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs">
          {[
            { num: 1, title: 'Card Lookup' },
            { num: 2, title: 'Verification' },
            { num: 3, title: 'Account Data' },
            { num: 4, title: 'OTP Activation' }
          ].map((item) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <div key={item.num} className="flex items-center gap-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCompleted
                      ? 'liquid-btn-white text-black font-black'
                      : isCurrent
                      ? 'liquid-glass text-emerald-400 border border-emerald-400/40 font-black'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : item.num}
                </span>
                <span className={`hidden sm:inline text-[11px] font-medium ${isCurrent ? 'text-white font-bold' : 'text-slate-400'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-slide-up">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: CARD LOOKUP */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Physical Member ID Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value.toUpperCase())}
                  placeholder="e.g. MCS-2026-1033"
                  className="w-full bg-black border border-white/15 rounded-2xl px-4 py-3.5 text-base font-mono font-bold text-white tracking-widest focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 uppercase"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                This 12-character ID is embossed on the front and magnetic strip of your Mosunmola physical membership card.
              </p>
            </div>

            {/* Quick Demo Pickers */}
            <div>
              <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Demo Card IDs (Click to test):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleDemoCards.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setCardId(sample.id);
                      handleVerifyCard(sample.id);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-brand-400">
                        {sample.id}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{sample.name}</div>
                    <div className="text-[10px] text-slate-400">{sample.branch}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => handleVerifyCard()}
                disabled={loading}
                className="w-full sm:w-auto liquid-btn liquid-btn-white py-2 px-5 text-xs flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-black" />}
                <span>Verify Card Details</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VERIFICATION PREVIEW */}
        {step === 2 && verifiedInfo && (
          <div className="p-6 space-y-6">
            <div className="liquid-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Physical Member ID Validated in Registry</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Member ID:</span>
                  <span className="font-mono font-bold text-white text-sm">{cardId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assigned Holder:</span>
                  <span className="font-bold text-white text-sm">{verifiedInfo.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Issuing Branch:</span>
                  <span className="text-slate-200 font-semibold">{verifiedInfo.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Security Chip Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Ready for Linking
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              We found your pre-allocation record. In the next step, create your login password, confirm contact phone & email, and attach your facial photo for the digital card.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="liquid-btn liquid-btn-default py-1.5 px-3.5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToAccount}
                className="liquid-btn liquid-btn-white py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <span>Continue to Profile Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ACCOUNT CREATION FORM */}
        {step === 3 && (
          <form onSubmit={handleSubmitAccount} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Photo Upload / Avatar Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black border border-white/10">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Member Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 ring-2 ring-brand-500/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-500 text-slate-950 p-1 rounded-full shadow">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white block">Digital Card Photo</span>
                <p className="text-[11px] text-slate-400">
                  Select a facial portrait for your digital ID card and verification pass.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')}
                    className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-slate-300"
                  >
                    Preset Photo A
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80')}
                    className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-slate-300"
                  >
                    Preset Photo B
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">National ID (NIN)</label>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  placeholder="11 digits NIN"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Occupation / Business</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Next of Kin */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block mb-2">
                Next of Kin Beneficiary Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <input
                    type="text"
                    value={nokName}
                    onChange={(e) => setNokName(e.target.value)}
                    placeholder="Beneficiary Full Name"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={nokRel}
                    onChange={(e) => setNokRel(e.target.value)}
                    placeholder="Relationship (e.g. Spouse)"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={nokPhone}
                    onChange={(e) => setNokPhone(e.target.value)}
                    placeholder="Beneficiary Phone"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="liquid-btn liquid-btn-default py-1.5 px-3.5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="liquid-btn liquid-btn-white py-2 px-4 text-xs flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5 text-black" />}
                <span>Send Verification OTP</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: OTP ACTIVATION MODAL */}
        {step === 4 && (
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl liquid-glass border border-white/15 flex items-center justify-center text-emerald-400 shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-display font-bold text-lg text-white">Enter 6-Digit OTP Code</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                A simulated verification code has been dispatched to <strong className="text-white">{phone}</strong> and <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold bg-black border border-white/20 rounded-2xl py-3 text-white focus:outline-none focus:border-white/40 shadow-inner"
              />
              <span className="text-[11px] text-slate-400 block mt-2">
                Demo helper: Pre-filled with code <strong>894201</strong> (or enter any 6 digits).
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="liquid-btn liquid-btn-default py-1.5 px-3.5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="liquid-btn liquid-btn-white py-2 px-5 text-xs flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-black" />}
                <span>Activate Account & Digital Card</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
