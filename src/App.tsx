import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import React, { useState, useEffect } from 'react';
import { fetchWorks } from './services/dataService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

function NavigationLinks({ onClick }: { onClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isActive = (path: string) => location.pathname === path;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    if (location.pathname !== '/') {
      navigate('/#iletisim');
    } else {
      const el = document.getElementById('iletisim');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Link 
        to="/map" 
        onClick={onClick}
        className={`border-b-2 py-2 md:py-0 transition-colors ${isActive('/map') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        {t('nav.map')}
      </Link>
      <Link 
        to="/works" 
        onClick={onClick}
        className={`border-b-2 py-2 md:py-0 transition-colors ${isActive('/works') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        {t('nav.works')}
      </Link>
      <Link 
        to="/about" 
        onClick={onClick}
        className={`border-b-2 py-2 md:py-0 transition-colors ${isActive('/about') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        {t('nav.about')}
      </Link>
      <a 
        href="/#iletisim"
        onClick={handleContactClick}
        className={`border-b-2 py-2 md:py-0 transition-colors text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100 cursor-pointer`}
      >
        {t('nav.contact')}
      </a>
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Prefetch works data silently on app load to make map instantly available
    fetchWorks().catch(console.error);
  }, []);

  return (
    <LanguageProvider>
      <AppContent />
      <LanguageSwitcher />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="h-screen bg-[#F9F8F6] dark:bg-stone-900 font-sans text-[#1A1A1A] dark:text-stone-100 overflow-hidden flex flex-col transition-colors duration-200">
        {/* Header Navigation */}
        <nav className="h-20 border-b border-[#D1D5DB] dark:border-stone-700 shrink-0 flex items-center justify-between px-6 md:px-10 bg-white dark:bg-stone-950 z-30 transition-colors duration-200 relative">
          <Link to="/" className="flex items-center gap-4 group z-40">
            <div className="w-10 h-10 bg-white border border-[#991B1B] dark:border-red-700 rounded-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 p-0.5">
               <img src="https://i.imgur.com/ZVuvRqC.jpeg" alt="Mimar Sinan Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight uppercase text-[#991B1B] dark:text-red-500">Mimar Sinan'ın İzinde</span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest h-full items-center pt-2">
            <NavigationLinks />
          </div>
          
          <div className="flex items-center gap-4 z-40">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#991B1B] dark:hover:text-red-400 transition-colors rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{t('app.system_active')}</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-[#991B1B] dark:hover:text-red-400 transition-colors rounded-sm"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Drawer */}
        <div 
          className={`fixed top-20 right-0 bottom-0 w-64 bg-white dark:bg-stone-950 border-l border-[#D1D5DB] dark:border-stone-700 z-30 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 gap-6 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-6 text-sm font-medium uppercase tracking-widest mt-4">
            <NavigationLinks onClick={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-[#D1D5DB] dark:border-stone-700 pt-6">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{t('app.system_active')}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Main Application Area */}
        <main className="flex-1 flex overflow-hidden lg:flex-row flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/works" element={<WorksPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        {/* Footer Status Bar */}
        <footer className="h-10 shrink-0 bg-[#1A1A1A] dark:bg-black text-white text-[10px] hidden md:flex items-center justify-between px-10 tracking-widest uppercase transition-colors duration-200">
          <div className="flex gap-6">
            <span className="opacity-70 dark:opacity-50">{t('app.data_source')}</span>
            <span className="opacity-70 dark:opacity-50">{t('app.geocoding')}</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-70"></span> <span className="opacity-70 dark:opacity-50">{t('app.gps_stable')}</span></span>
            <span className="opacity-70 dark:opacity-50">Sinan Atlas v1.0.4</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
