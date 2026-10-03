import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Share2, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const { isInstallBannerVisible, dismissInstallBanner, triggerInstallPrompt, isIOS, isStandalone } = useApp();
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (!isInstallBannerVisible || isStandalone) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-40 max-w-md bg-[#0A2540] text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shrink-0 flex items-center justify-center shadow-glow">
            <div className="w-full h-full bg-[#0A2540] rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-brand-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                PWA Mobile App
              </span>
              <span className="flex items-center text-[10px] text-amber-300 font-semibold">
                <Sparkles className="w-3 h-3 mr-0.5" /> Instant Access
              </span>
            </div>
            <h4 className="text-sm font-bold text-white leading-tight">
              Install Mosunmola Cooperative
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Fast, offline-ready member dashboard with digital card wallet on your home screen.
            </p>

            <div className="mt-3 flex items-center gap-2">
              {isIOS ? (
                <button
                  onClick={() => setShowIosGuide(true)}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" /> How to Install on iPhone
                </button>
              ) : (
                <button
                  onClick={triggerInstallPrompt}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Install App (1-Click)
                </button>
              )}
              <button
                onClick={dismissInstallBanner}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={dismissInstallBanner}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Install Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0A2540] text-white w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-brand-400" /> Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-4 text-sm text-slate-300">
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
              className="mt-6 w-full py-3 bg-brand-500 text-slate-950 font-bold rounded-2xl hover:bg-brand-400 transition-colors"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
