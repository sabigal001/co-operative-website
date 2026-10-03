import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalRoleBar } from './components/common/GlobalRoleBar';
import { Navbar } from './components/common/Navbar';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { RegisterCardModal } from './components/common/RegisterCardModal';
import { LandingPageView } from './components/landing/LandingPageView';
import { MemberPortalView } from './components/member/MemberPortalView';
import { AdminPortalView } from './components/admin/AdminPortalView';

const AppContent: React.FC = () => {
  const { currentPortal } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Global RBAC Role Bar for Testing / Demo */}
      <GlobalRoleBar />

      {/* Main Top Navigation */}
      <Navbar />

      {/* Dynamic Portal Body */}
      <div className="flex-1">
        {currentPortal === 'landing' && <LandingPageView />}
        {currentPortal === 'member' && <MemberPortalView />}
        {currentPortal === 'admin' && <AdminPortalView />}
      </div>

      {/* Global Modals & Notifications */}
      <RegisterCardModal />
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
