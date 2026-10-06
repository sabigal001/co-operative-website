import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { RegisterCardModal } from './components/common/RegisterCardModal';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { LandingPageView } from './components/landing/LandingPageView';
import { MemberPortalView } from './components/member/MemberPortalView';
import { AdminPortalView } from './components/admin/AdminPortalView';

import { CurtainThemeSwitch } from './components/common/CurtainThemeSwitch';

const AppContent: React.FC = () => {
  const { currentPortal } = useApp();

  // Dynamic Specular Glow Tracking on Liquid Glass Cards
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('.liquid-glass-card') as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      target.style.setProperty('--card-sheen-angle', `${angle.toFixed(1)}deg`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white font-sans flex flex-col selection:bg-brand-500 selection:text-white transition-colors duration-300">
      {/* Interactive Top Curtain Theme Switch (Drag or Click) */}
      <CurtainThemeSwitch />

      {/* Dynamic Portal Body based on isolated service / subdomain */}
      <div className="flex-1">
        {/* 1. PUBLIC LANDING SERVICE (mosunmolacoop.com) */}
        {currentPortal === 'landing' && <LandingPageView />}

        {/* 2. MEMBER PORTAL PWA SERVICE (members.mosunmolacoop.com) */}
        {currentPortal === 'member' && (
          <>
            <MemberPortalView />
            <RegisterCardModal />
          </>
        )}

        {/* 3. SUPER ADMIN CONSOLE SERVICE (admin.mosunmolacoop.com) */}
        {currentPortal === 'admin' && <AdminPortalView />}
      </div>

      {/* Global Modals & Notifications */}
      <PwaInstallBanner />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
