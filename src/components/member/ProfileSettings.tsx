import React, { useState } from 'react';
import type { MemberProfile } from '../../types';
import { memberService } from '../../services/api/memberService';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Building, 
  KeyRound, 
  CheckCircle2, 
  Smartphone, 
  Download, 
  Save, 
  Loader2 
} from 'lucide-react';

interface ProfileSettingsProps {
  member: MemberProfile;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ member }) => {
  const { showToast, triggerInstallPrompt, isStandalone } = useApp();

  const [saving, setSaving] = useState(false);

  // Form State
  const [phone, setPhone] = useState(member.phone);
  const [address, setAddress] = useState(member.address);
  const [occupation, setOccupation] = useState(member.occupation);

  // Next of kin
  const [nokName, setNokName] = useState(member.nextOfKin.name);
  const [nokRel, setNokRel] = useState(member.nextOfKin.relationship);
  const [nokPhone, setNokPhone] = useState(member.nextOfKin.phone);
  const [nokAddress, setNokAddress] = useState(member.nextOfKin.address);

  // Bank details
  const [bankName, setBankName] = useState(member.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(member.bankDetails.accountNumber);
  const [accountName, setAccountName] = useState(member.bankDetails.accountName);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await memberService.updateProfile(member.id, {
        phone,
        address,
        occupation,
        nextOfKin: {
          name: nokName,
          relationship: nokRel,
          phone: nokPhone,
          address: nokAddress
        },
        bankDetails: {
          bankName,
          accountNumber,
          accountName
        }
      });

      if (res.success) {
        showToast('Member profile and beneficiary details saved successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
          Account & Security Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage statutory cooperative records, next of kin, and bank payout credentials.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Personal Details Card */}
        <div className="bg-white dark:bg-[#0c1015] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Identity & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Full Legal Name (Locked to ID)</label>
              <input
                type="text"
                value={member.fullName}
                disabled
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-600 dark:text-slate-300 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Physical Member ID</label>
              <input
                type="text"
                value={member.memberId}
                disabled
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-brand-700 dark:text-brand-400 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number (WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Occupation / Enterprise</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Payout Bank Account Details */}
        <div className="bg-white dark:bg-[#0c1015] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Settlement & Payout Bank Account</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All loan disbursements, savings maturities, and annual AGM dividends are sent to this account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">NUBAN Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Account Holder Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Next of Kin Beneficiary */}
        <div className="bg-white dark:bg-[#0c1015] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Next of Kin Beneficiary Record</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Beneficiary Name</label>
              <input
                type="text"
                value={nokName}
                onChange={(e) => setNokName(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Relationship</label>
              <input
                type="text"
                value={nokRel}
                onChange={(e) => setNokRel(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Beneficiary Phone</label>
              <input
                type="tel"
                value={nokPhone}
                onChange={(e) => setNokPhone(e.target.value)}
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* PWA & Device Status */}
        <div className="bg-black text-white rounded-3xl p-6 border border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-brand-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Progressive Web App (PWA)</h4>
              <p className="text-xs text-slate-300">
                {isStandalone
                  ? 'Application is currently running in Standalone PWA Mode.'
                  : 'Install to your device home screen for 1-tap offline wallet access.'}
              </p>
            </div>
          </div>

          {!isStandalone && (
            <button
              type="button"
              onClick={triggerInstallPrompt}
              className="px-4 py-2 bg-brand-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Install Now</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Updates</span>
          </button>
        </div>

      </form>
    </div>
  );
};
