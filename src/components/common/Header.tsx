import React, { useState } from 'react';
import { 
  Atom, 
  BookOpen, 
  FlaskConical, 
  GitFork, 
  PenTool, 
  GraduationCap, 
  AlertTriangle, 
  Trophy, 
  Flame, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Home
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import type { NavigationTab } from '../../types/chemistry';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, practiceStreak, mistakes } = useChemistry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chem_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chem_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'nomenclature', label: 'Nomenclature', icon: <FlaskConical className="w-4 h-4" /> },
    { tab: 'isomers', label: 'Isomers', icon: <GitFork className="w-4 h-4" /> },
    { tab: 'practice', label: 'Practice', icon: <PenTool className="w-4 h-4" /> },
    { tab: 'quiz', label: 'Quiz & Exams', icon: <GraduationCap className="w-4 h-4" /> },
    { tab: 'mistakes', label: 'My Mistakes', icon: <AlertTriangle className="w-4 h-4" />, badge: mistakes.length },
    { tab: 'progress', label: 'Progress', icon: <Trophy className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base md:text-lg text-slate-900 dark:text-white tracking-tight">
                  Chemistry Made Easy
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Coach
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Master IUPAC Rules Step-by-Step
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Streak & Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Pill */}
            <button
              onClick={() => handleNavClick('progress')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/50 hover:bg-amber-500/20 transition-all text-xs font-bold"
              title="Daily Practice Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>{practiceStreak} {practiceStreak === 1 ? 'day' : 'days'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-slide-down">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
