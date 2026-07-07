import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[5000] flex flex-col gap-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-stone-700 border-r-0 rounded-l-xl p-1.5 transition-colors">
      <button
        onClick={() => setLanguage('tr')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
          language === 'tr' 
            ? 'bg-gray-100 dark:bg-stone-800 shadow-inner scale-95 opacity-100' 
            : 'hover:bg-gray-50 dark:hover:bg-stone-800/50 opacity-60 hover:opacity-100'
        }`}
        title="Türkçe"
      >
        🇹🇷
      </button>
      <div className="w-6 h-[1px] bg-gray-200 dark:bg-stone-700 mx-auto rounded-full"></div>
      <button
        onClick={() => setLanguage('en')}
        className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all duration-200 ${
          language === 'en' 
            ? 'bg-gray-100 dark:bg-stone-800 shadow-inner scale-95 opacity-100' 
            : 'hover:bg-gray-50 dark:hover:bg-stone-800/50 opacity-60 hover:opacity-100'
        }`}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
}
