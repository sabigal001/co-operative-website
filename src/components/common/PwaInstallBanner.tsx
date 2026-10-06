import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Share2, PlusSquare, X, Smartphone, Sparkles, CheckCircle2, ChevronLeft, Globe } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export const PwaInstallBanner: React.FC = () => {
  const {
    currentPortal,
    isInstallBannerVisible,
    dismissInstallBanner,
    triggerInstallPrompt,
    markAppAsInstalled,
    isIOS,
    isStandalone,
    isAppInstalled
  } = useApp();

  const [viewStep, setViewStep] = useState<'prompt' | 'guide'>('prompt');

  // Detect whether the user is running Google Chrome on iOS ('CriOS') or Safari
  const [browserMode, setBrowserMode] = useState<'chrome' | 'safari'>(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/crios/.test(ua)) return 'chrome';
    }
    return 'safari';
  });

  useEffect(() => {
    if (isInstallBannerVisible) {
      setViewStep('prompt');
      if (typeof window !== 'undefined') {
        const ua = window.navigator.userAgent.toLowerCase();
        if (/crios/.test(ua)) {
          setBrowserMode('chrome');
        }
      }
    }
  }, [isInstallBannerVisible]);

  // Strict check: ONLY show modal inside the Member Portal, never on landing page or admin portal, and never if already installed
  if (currentPortal !== 'member' || !isInstallBannerVisible || isStandalone || isAppInstalled) return null;

  const handleInstallClick = () => {
    triggerHaptic('medium');
    if (isIOS) {
      // iOS WebKit does not provide a native 1-click install prompt event; guide user directly
      setViewStep('guide');
    } else {
      triggerInstallPrompt();
    }
  };

  const handleDismiss = () => {
    triggerHaptic('light');
    setViewStep('prompt');
    dismissInstallBanner();
  };

  const handleConfirmInstalled = () => {
    triggerHaptic('success');
    markAppAsInstalled();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Authentic Full-Window Backdrop Blur */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl transition-opacity animate-fade-in"
        aria-hidden="true"
      />

      {/* Centered Modal Card with Adaptive Glass & Mobile Responsiveness */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border border-slate-200 dark:border-white/20 z-10 animate-slide-up">
        {/* Top-Right Dismiss Cross */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors tap-spring"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {viewStep === 'prompt' ? (
          <div className="flex flex-col items-center text-center">
            {/* Glowing App Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-0.5 shadow-[0_0_35px_rgba(0,200,83,0.3)] mb-5">
              <div className="w-full h-full bg-slate-50 dark:bg-black rounded-[22px] flex items-center justify-center">
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-brand-400" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                PWA Mobile App
              </span>
              <span className="flex items-center text-xs text-amber-600 dark:text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Instant Access
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mb-2">
              Install Mosunmola Cooperative
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mb-6">
              Fast, offline-ready member dashboard with digital card wallet on your home screen.
            </p>

            {/* Feature highlights bullet list */}
            <div className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 mb-6 text-left space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero app store downloads needed (Instant)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Offline RFID passbook & dynamic QR code</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>One-tap biometric & card login</span>
              </div>
            </div>

            {/* Clean, Uniform Install App Button */}
            <div className="w-full">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl text-sm sm:text-base font-black flex items-center justify-center gap-2.5 shadow-xl tap-spring bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100 transition-all"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Install App (1-Click)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Native Browser Guide View */
          <div className="animate-fade-in text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/10 pr-8">
              <button
                onClick={() => setViewStep('prompt')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Add to Home Screen</span>
              </h4>
            </div>

            {/* Browser Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/10 rounded-xl mb-4">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setBrowserMode('chrome');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  browserMode === 'chrome'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Chrome</span>
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setBrowserMode('safari');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  browserMode === 'safari'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Apple Safari</span>
              </button>
            </div>

            {/* Chrome on iPhone Specific Steps */}
            {browserMode === 'chrome' ? (
              <ol className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    Tap the <strong className="text-slate-900 dark:text-white">Share</strong> button in the <strong className="text-slate-900 dark:text-white">top right corner</strong> of Chrome (or tap the <strong className="text-slate-900 dark:text-white">•••</strong> Chrome menu).
                    <div className="mt-1 flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[11px] font-medium">
                      <Share2 className="w-3.5 h-3.5" /> Top right Share icon / ••• menu
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    Scroll down the sheet and tap <strong className="text-slate-900 dark:text-white">Add to Home Screen</strong>.
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    Tap <strong className="text-slate-900 dark:text-white">Add</strong> in the top right. The Mosunmola Cooperative app will appear directly on your home screen!
                  </div>
                </li>
              </ol>
            ) : (
              /* Safari on iPhone Specific Steps */
              <ol className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    Tap the <strong className="text-slate-900 dark:text-white">Share</strong> button in the <strong className="text-slate-900 dark:text-white">bottom toolbar</strong> of Safari.
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                      <Share2 className="w-3.5 h-3.5" /> Safari bottom toolbar Share icon
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    Scroll down the menu and tap <strong className="text-slate-900 dark:text-white">Add to Home Screen</strong>.
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    Tap <strong className="text-slate-900 dark:text-white">Add</strong> in the top right. The Mosunmola Cooperative app icon is now on your home screen!
                  </div>
                </li>
              </ol>
            )}

            {/* Confirmation Action Button */}
            <button
              onClick={handleConfirmInstalled}
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl tap-spring bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>I've Added It to Home Screen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
