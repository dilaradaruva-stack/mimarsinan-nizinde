import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center py-12 px-4 bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-200">
      <div className="max-w-4xl w-full space-y-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-widest shadow-sm mb-2 transition-colors">
          <span className="w-2 h-2 rounded-sm bg-[#991B1B] dark:bg-red-500"></span>
          {t('about.badge')}
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-tight transition-colors">
          {t('about.title')}
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-start border-t border-[#D1D5DB] dark:border-stone-700 pt-8 transition-colors">
          <div className="w-full md:w-1/3 shrink-0">
             <img 
               src="https://i.imgur.com/JW14UVC.jpeg" 
               alt="Mimar Sinan'ın İzinde" 
               className="w-full h-auto rounded-sm object-cover border border-[#D1D5DB] dark:border-stone-700 shadow-sm sepia-[.3] dark:sepia-[.2] transition-colors"
               referrerPolicy="no-referrer"
               loading="lazy"
             />
          </div>
          <div className="flex-1 space-y-6">
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            {t('about.p1')}
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            {t('about.p2')}
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            {t('about.p3')}
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            {t('about.p4')}
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            {t('about.p5')}
          </p>
          </div>
        </div>

      </div>
    </div>
  );
}
