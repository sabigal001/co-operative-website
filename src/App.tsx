import React from 'react';
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
            <PwaInstallBanner />
          </>
        )}

        {/* 3. SUPER ADMIN CONSOLE SERVICE (admin.mosunmolacoop.com) */}
        {currentPortal === 'admin' && <AdminPortalView />}
      </div>

      {/* Global Notifications */}
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
