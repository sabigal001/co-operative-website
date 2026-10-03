import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminRole, AdminUser, MemberProfile } from '../types';
import { authService } from '../services/api/authService';
import { mockAdminUsers } from '../mocks/admins';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentPortal: 'landing' | 'member' | 'admin';
  setCurrentPortal: (portal: 'landing' | 'member' | 'admin') => void;
  activeAdminRole: AdminRole;
  setActiveAdminRole: (role: AdminRole) => void;
  currentAdmin: AdminUser;
  currentMember: MemberProfile;
  setCurrentMember: (member: MemberProfile) => void;
  isLoggedIn: boolean;
  loginMember: (member: MemberProfile) => void;
  logoutMember: () => void;
  
  // Registration & Card Verification Modal
  isRegisterModalOpen: boolean;
  openRegisterModal: (prefillCardId?: string) => void;
  closeRegisterModal: () => void;
  prefillCardId: string;
  
  // PWA State & Installation
  isInstallBannerVisible: boolean;
  dismissInstallBanner: () => void;
  triggerInstallPrompt: () => void;
  isIOS: boolean;
  isStandalone: boolean;
  
  // Toast & Confetti
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  fireConfetti: () => void;
  
  // Refresh Signal
  dataVersion: number;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPortal, setCurrentPortalState] = useState<'landing' | 'member' | 'admin'>(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('portal');
    if (p === 'member' || p === 'admin' || p === 'landing') return p;
    return 'landing';
  });

  const setCurrentPortal = (portal: 'landing' | 'member' | 'admin') => {
    setCurrentPortalState(portal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    if (portal === 'landing') {
      url.searchParams.delete('portal');
    } else {
      url.searchParams.set('portal', portal);
    }
    window.history.pushState({}, '', url.toString());
  };

  // Admin Role Toggle (Master Admin / Treasurer / PA Officer)
  const [activeAdminRole, setActiveAdminRoleState] = useState<AdminRole>(() => {
    return authService.getCurrentAdminRole();
  });

  const setActiveAdminRole = (role: AdminRole) => {
    setActiveAdminRoleState(role);
    authService.switchAdminRole(role);
    showToast(`Switched active Admin Role to: ${role.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const currentAdmin = mockAdminUsers.find((a) => a.role === activeAdminRole) || mockAdminUsers[0];

  // Member Authentication
  const [currentMember, setCurrentMember] = useState<MemberProfile>(() => {
    return authService.getCurrentMember();
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const loginMember = (member: MemberProfile) => {
    setCurrentMember(member);
    setIsLoggedIn(true);
    showToast(`Welcome, ${member.fullName}!`, 'success');
  };

  const logoutMember = () => {
    authService.logoutMember();
    setIsLoggedIn(false);
    setCurrentPortal('landing');
    showToast('You have signed out of your member account.', 'info');
  };

  // Registration Modal with Physical Card verification
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [prefillCardId, setPrefillCardId] = useState<string>('');

  const openRegisterModal = (cardId?: string) => {
    if (cardId) setPrefillCardId(cardId);
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // PWA State & Installation
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallBannerVisible, setIsInstallBannerVisible] = useState<boolean>(true);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Check if iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Check if standalone
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isInStandalone);
    if (isInStandalone) {
      setIsInstallBannerVisible(false);
    }

    // Capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallBannerVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstallPrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('Thank you for installing Mosunmola Cooperative PWA!', 'success');
          setIsInstallBannerVisible(false);
        }
        setDeferredPrompt(null);
      });
    } else if (isIOS) {
      showToast('Tap the Safari Share button below and select "Add to Home Screen".', 'info');
    } else {
      showToast('To install, open browser menu (⋮) and click "Install App" or "Add to Home Screen".', 'info');
    }
  };

  const dismissInstallBanner = () => {
    setIsInstallBannerVisible(false);
  };

  // Toast System
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C853', '#FFB800', '#0A2540', '#32CD7A']
    });
  };

  // Data version signal for cross-component re-renders
  const [dataVersion, setDataVersion] = useState<number>(1);
  const refreshData = () => setDataVersion((v) => v + 1);

  return (
    <AppContext.Provider
      value={{
        currentPortal,
        setCurrentPortal,
        activeAdminRole,
        setActiveAdminRole,
        currentAdmin,
        currentMember,
        setCurrentMember,
        isLoggedIn,
        loginMember,
        logoutMember,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
        prefillCardId,
        isInstallBannerVisible,
        dismissInstallBanner,
        triggerInstallPrompt,
        isIOS,
        isStandalone,
        toasts,
        showToast,
        fireConfetti,
        dataVersion,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
