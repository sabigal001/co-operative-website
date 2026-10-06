import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Share2, PlusSquare, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export const PwaInstallBanner: React.FC = () => {
  const { currentPortal, isInstallBannerVisible, dismissInstallBanner, triggerInstallPrompt, isIOS, isStandalone } = useApp();
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Strict check: ONLY show modal inside the Member Portal, never on landing page or admin portal
  if (currentPortal !== 'member' || !isInstallBannerVisible || isStandalone) return null;

  const handleInstallClick = () => {
    triggerHaptic('medium');
    if (isIOS) {
      setShowIosGuide(true);
    } else {
      triggerInstallPrompt();
    }
  };

  const handleDismiss = () => {
    triggerHaptic('light');
    dismissInstallBanner();
  };

  return (
    <>
      {/* Real Fullscreen Backdrop Blur Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Authentic Full-Window Backdrop Blur */}
        <div 
          onClick={handleDismiss}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl transition-opacity animate-fade-in" 
          aria-hidden="true"
        />

        {/* Centered Modal Card with Deep Obsidian Glass & Mobile Responsiveness */}
        <div className="relative w-full max-w-md bg-black text-white p-6 sm:p-8 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border border-white/20 liquid-glass-card z-10 animate-slide-up">
          {/* Top-Right Dismiss Cross */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors tap-spring"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Glowing App Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 p-0.5 shadow-[0_0_35px_rgba(0,200,83,0.4)] mb-5">
              <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-brand-400" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                PWA Mobile App
              </span>
              <span className="flex items-center text-xs text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Instant Access
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight mb-2">
              Install Mosunmola Cooperative
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mb-6">
              Fast, offline-ready member dashboard with digital card wallet on your home screen.
            </p>

            {/* Feature highlights bullet list */}
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero app store downloads needed (Instant)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Offline RFID passbook & dynamic QR code</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-tap biometric & card login</span>
              </div>
            </div>

            {/* Only Show the Install App Button (No 'Later' button as requested) */}
            <div className="w-full">
              {isIOS ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full liquid-btn liquid-btn-white text-black font-black py-3.5 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl tap-spring"
                >
                  <Share2 className="w-4 h-4 text-black" />
                  <span>How to Install on iPhone</span>
                </button>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full liquid-btn liquid-btn-white text-black font-black py-3.5 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl tap-spring"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Install App (1-Click)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* iOS Install Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-black text-white w-full max-w-sm rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl animate-slide-up relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2 font-display">
                <Smartphone className="w-5 h-5 text-brand-400" /> Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  Tap the <strong className="text-white">Share</strong> button at the bottom of Safari browser toolbar.
                  <div className="mt-1 flex items-center gap-1.5 text-brand-400 text-xs font-mono">
                    <Share2 className="w-4 h-4" /> Safari Share Icon
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  Scroll down the menu and tap <strong className="text-white">Add to Home Screen</strong>.
                  <div className="mt-1 flex items-center gap-1.5 text-brand-400 text-xs font-mono">
                    <PlusSquare className="w-4 h-4" /> Add to Home Screen
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  Tap <strong className="text-white">Add</strong> in the top right corner. The Mosunmola Cooperative app icon will now appear on your iPhone screen!
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="mt-6 w-full liquid-btn liquid-btn-white text-black font-bold py-3 rounded-xl text-xs flex items-center justify-center tap-spring"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
