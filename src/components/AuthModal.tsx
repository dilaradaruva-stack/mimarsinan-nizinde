import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail } from 'lucide-react';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-stone-900 border border-[#D1D5DB] dark:border-stone-700 w-full max-w-sm rounded-sm shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#991B1B] dark:hover:text-red-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white mb-2">
            Topluluğumuza Katılın
          </h2>
          <p className="text-sm text-gray-500 dark:text-stone-400 mb-8">
            Eserler hakkında yorum yapmak ve deneyimlerinizi paylaşmak için üye olun.
          </p>

          <button 
            onClick={() => login('demo@google.com', 'Mimar Sinan Hayranı')}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-600 px-4 py-3 rounded-sm mb-4 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors font-bold text-sm text-[#1A1A1A] dark:text-stone-200 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile Giriş Yap
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200 dark:border-stone-700"></div>
            <span className="flex-shrink-0 px-4 text-xs text-gray-400 uppercase tracking-widest font-bold">veya</span>
            <div className="flex-grow border-t border-gray-200 dark:border-stone-700"></div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (email && name) login(email, name);
          }} className="space-y-4 pt-2">
            <div>
              <input 
                type="text" 
                required
                placeholder="Adınız Soyadınız" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F8F6] dark:bg-stone-950 border border-gray-200 dark:border-stone-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] text-sm text-[#1A1A1A] dark:text-stone-200 placeholder:text-gray-400 transition-colors"
               />
            </div>
            <div>
              <input 
                type="email" 
                required
                placeholder="E-posta Adresi" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F9F8F6] dark:bg-stone-950 border border-gray-200 dark:border-stone-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] text-sm text-[#1A1A1A] dark:text-stone-200 placeholder:text-gray-400 transition-colors"
               />
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] dark:bg-stone-700 hover:bg-[#333] dark:hover:bg-stone-600 text-white font-bold text-sm tracking-widest uppercase py-3 rounded-sm transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              E-posta ile Devam Et
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-[10px] text-gray-400 dark:text-stone-500 uppercase tracking-wide">Üye olarak aydınlatma metnini kabul etmiş sayılırsınız.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
