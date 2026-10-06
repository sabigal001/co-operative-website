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
  openInstallBanner: () => void;
  triggerInstallPrompt: () => void;
  markAppAsInstalled: () => void;
  isIOS: boolean;
  isStandalone: boolean;
  isAppInstalled: boolean;

  // Toast & Confetti
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  fireConfetti: () => void;

  // Theme Mode
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Refresh Signal
  dataVersion: number;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

import { resolveCurrentService, navigateToService } from '../utils/subdomainRouter';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation based on subdomain & query resolver
  const [currentPortal, setCurrentPortalState] = useState<'landing' | 'member' | 'admin'>(() => {
    const service = resolveCurrentService();
    if (service === 'members') return 'member';
    if (service === 'admin') return 'admin';
    return 'landing';
  });

  const setCurrentPortal = (portal: 'landing' | 'member' | 'admin') => {
    setCurrentPortalState(portal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    if (portal === 'landing') {
      url.searchParams.delete('portal');
      url.searchParams.delete('app');
    } else {
      url.searchParams.set('app', portal === 'member' ? 'members' : 'admin');
      url.searchParams.delete('portal');
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('current_member_id');
      if (saved === 'logged_out' || saved === 'false') return false;
      return !!saved;
    } catch {
      return false;
    }
  });

  const loginMember = (member: MemberProfile) => {
    try {
      localStorage.setItem('current_member_id', member.id);
    } catch {}
    setCurrentMember(member);
    setIsLoggedIn(true);
    setCurrentPortal('member');
    showToast(`Welcome, ${member.fullName}!`, 'success');
  };

  // Theme Mode: Dark (Obsidian) vs Light (Sleek Clean White/Gray)
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('mosunmola_theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('mosunmola_theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }
  };

  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-curtain-transition'));
    } else {
      const next = theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#F8FAFC';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#FAFAFA';
      document.body.style.color = '#0F172A';
    }
  }, [theme]);

  const logoutMember = async () => {
    // Instant UI state transition to login page
    setIsLoggedIn(false);
    setCurrentPortal('member');
    try {
      localStorage.setItem('current_member_id', 'logged_out');
    } catch {}
    try {
      await authService.logout();
    } catch {
      authService.logoutMember();
    }
    showToast('You have signed out. Please sign in or activate your card.', 'info');
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
  const [isInstallBannerVisible, setIsInstallBannerVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandaloneMode) return false;

    // Clean up any stale false flags from previous testing
    try {
      localStorage.removeItem('mosunmola_pwa_installed');
      localStorage.removeItem('mosunmola_pwa_dismissed');
    } catch {}

    // Only permanently suppress if confirmed installed via native browser prompt or standalone
    const isInstalled = localStorage.getItem('mosunmola_pwa_installed_confirmed') === 'true';
    return !isInstalled;
  });
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const isConfirmed = localStorage.getItem('mosunmola_pwa_installed_confirmed') === 'true';
    return isStandaloneMode || isConfirmed;
  });

  useEffect(() => {
    // Check if iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Check if standalone
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isInStandalone);
    if (isInStandalone) {
      localStorage.setItem('mosunmola_pwa_installed_confirmed', 'true');
      setIsAppInstalled(true);
      setIsInstallBannerVisible(false);
    }

    // Listen for native appinstalled event (fired when user completes installation)
    const handleAppInstalled = () => {
      localStorage.setItem('mosunmola_pwa_installed_confirmed', 'true');
      setIsAppInstalled(true);
      setIsInstallBannerVisible(false);
      showToast('Mosunmola Cooperative PWA installed successfully!', 'success');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isInstalled = localStorage.getItem('mosunmola_pwa_installed_confirmed') === 'true';
      if (!isInstalled && !isInStandalone) {
        setIsInstallBannerVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstallPrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          // Successfully accepted & installed by user
          localStorage.setItem('mosunmola_pwa_installed_confirmed', 'true');
          setIsAppInstalled(true);
          showToast('Thank you for installing Mosunmola Cooperative PWA!', 'success');
          setIsInstallBannerVisible(false);
        } else {
          // User cancelled prompt; close modal for now
          setIsInstallBannerVisible(false);
        }
        setDeferredPrompt(null);
      });
    } else if (isIOS) {
      const ua = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
      const isChromeOnIos = /crios/.test(ua);
      if (isChromeOnIos) {
        showToast('In Chrome: Tap the Share button in the top right corner and select "Add to Home Screen".', 'info');
      } else {
        showToast('In Safari: Tap the Share button at the bottom and select "Add to Home Screen".', 'info');
      }
      setIsInstallBannerVisible(true);
    } else {
      // In browser without prompt (e.g. desktop), guide user without falsely marking as installed
      showToast('To install, use the Install icon in your browser address bar or menu.', 'info');
      setIsInstallBannerVisible(false);
    }
  };

  const markAppAsInstalled = () => {
    localStorage.setItem('mosunmola_pwa_installed_confirmed', 'true');
    setIsAppInstalled(true);
    setIsInstallBannerVisible(false);
    showToast('Mosunmola Cooperative PWA added! You can now launch it from your home screen.', 'success');
  };

  const dismissInstallBanner = () => {
    setIsInstallBannerVisible(false);
  };

  const openInstallBanner = () => {
    setIsInstallBannerVisible(true);
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
        openInstallBanner,
        triggerInstallPrompt,
        markAppAsInstalled,
        isIOS,
        isStandalone,
        isAppInstalled,
        toasts,
        showToast,
        fireConfetti,
        theme,
        setTheme,
        toggleTheme,
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
