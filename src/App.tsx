import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, User } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CommentProvider } from './context/CommentContext';
import AuthModal from './components/AuthModal';

function UserMenu() {
  const { user, setShowAuthModal, logout } = useAuth();
  
  if (user) {
    return (
      <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-stone-700">
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] dark:bg-stone-700 text-white flex items-center justify-center font-bold text-xs uppercase cursor-pointer" title={user.name}>
          {user.initials}
        </div>
        <button onClick={logout} className="text-xs uppercase font-bold text-gray-500 hover:text-[#991B1B] transition-colors">
          Çıkış
        </button>
      </div>
    );
  }

  return (
    <div className="ml-2 pl-4 border-l border-gray-200 dark:border-stone-700 flex items-center">
       <button 
         onClick={() => setShowAuthModal(true)}
         className="flex items-center gap-2 px-4 py-1.5 bg-[#1A1A1A] dark:bg-stone-800 text-white hover:bg-[#333] dark:hover:bg-stone-700 transition-colors rounded-sm text-xs font-bold uppercase tracking-widest shadow-sm"
       >
         <User className="w-3.5 h-3.5" />
         <span>Giriş Yap / Üye Ol</span>
       </button>
    </div>
  );
}

function NavigationLinks() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
        className={`border-b-2 transition-colors ${isActive('/map') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        Harita
      </Link>
      <Link 
        to="/works" 
        className={`border-b-2 transition-colors ${isActive('/works') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        Eserler
      </Link>
      <Link 
        to="/about" 
        className={`border-b-2 transition-colors ${isActive('/about') ? 'text-[#991B1B] dark:text-red-400 border-[#991B1B] dark:border-red-400' : 'text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100'}`}
      >
        Hakkında
      </Link>
      <a 
        href="/#iletisim"
        onClick={handleContactClick}
        className={`border-b-2 transition-colors text-[#1A1A1A] dark:text-stone-300 border-transparent hover:border-[#991B1B] dark:hover:border-red-400 opacity-70 hover:opacity-100 cursor-pointer`}
      >
        İletişim
      </a>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CommentProvider>
        <AppContent />
      </CommentProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

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
        <nav className="h-20 border-b border-[#D1D5DB] dark:border-stone-700 shrink-0 flex items-center justify-between px-10 bg-white dark:bg-stone-950 z-20 transition-colors duration-200">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white border border-[#991B1B] dark:border-red-700 rounded-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 p-0.5">
               <img src="https://i.imgur.com/ZVuvRqC.jpeg" alt="Mimar Sinan Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight uppercase text-[#991B1B] dark:text-red-500">Mimar Sinan'ın İzinde</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest h-full items-center pt-2">
            <NavigationLinks />
            <UserMenu />
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#991B1B] dark:hover:text-red-400 transition-colors rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono hidden sm:inline-block">SİSTEM AKTİF</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </nav>

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
            <span className="opacity-70 dark:opacity-50">Veri Kaynağı: Google Sheets</span>
            <span className="opacity-70 dark:opacity-50">Geocoding: OpenStreetMap Nominatim</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-70"></span> <span className="opacity-70 dark:opacity-50">GPS Stabil</span></span>
            <span className="opacity-70 dark:opacity-50">Sinan Atlas v1.0.4</span>
          </div>
        </footer>
        <AuthModal />
      </div>
    </BrowserRouter>
  );
}
