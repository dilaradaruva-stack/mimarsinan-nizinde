import React, { useState } from 'react';
import { Work } from '../types';
import { X, Navigation, Youtube, MapPin, Loader2, Phone, Clock, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  work: Work;
  onClose: () => void;
  userCoords: [number, number] | null;
  routingLoading: boolean;
  onRouteRequest: () => void;
}

export default function WorkOverlay({ work, onClose, userCoords, routingLoading, onRouteRequest }: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const { t, translateWorkField } = useLanguage();

  return (
    <>
      <div className="w-full h-full max-h-[90vh] md:max-h-[85vh] max-w-4xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button Floating Outside */}
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 md:-top-12 md:-right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-[2000]"
        >
          <X className="w-6 h-6" />
        </button>

        {/* SOL PANEL (Detaylar) */}
          <div className="bg-white dark:bg-stone-900 w-full md:w-3/4 flex flex-col overflow-hidden rounded-xl shadow-2xl border border-gray-200 dark:border-stone-700">
            <div className="sticky top-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-gray-200 dark:border-stone-700 p-6 flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B7410E] dark:text-[#D4A017]">{translateWorkField(work.type, 'type')}</span>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white leading-tight mt-1">{translateWorkField(work.name, 'name')}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-stone-800 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-500 transition-colors md:hidden">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-stone-300">
              <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#991B1B]" />
              <p className="leading-relaxed">{work.address !== 'Bilgi Yok' && work.address !== 'Yok' ? work.address : ''} {work.district}</p>
            </div>

            {work.phone && work.phone !== 'Bilgi Yok' && work.phone !== 'Yok' && (
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-stone-300">
                <Phone className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <p>{work.phone}</p>
              </div>
            )}

            {work.hours && work.hours !== 'Bilgi Yok' && work.hours !== 'Yok' && (
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-stone-300">
                <Clock className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <p>{work.hours}</p>
              </div>
            )}

            <div className="p-5 bg-[#F9F8F6] dark:bg-stone-950 rounded-lg border border-gray-200 dark:border-stone-800 text-sm leading-relaxed text-gray-700 dark:text-stone-300">
               {work.year && <p className="font-bold mb-2 text-xs uppercase tracking-widest text-gray-400">{t('overlay.year')}: {work.year}</p>}
               {t('overlay.history_text') ? t('overlay.history_text').replace('{district}', work.district).replace('{type}', translateWorkField(work.type, 'type').toLowerCase()) : `Bu eser Mimar Sinan'ın ${work.district} bölgesindeki önemli ${translateWorkField(work.type, 'type').toLowerCase()} yapılarından biridir.`}
            </div>

            {/* Youtube Video Embed (if available) or generic placeholder */}
            {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative shadow-sm">
                <iframe 
                  src={work.youtube.replace('watch?v=', 'embed/').split('&')[0]} 
                  title={`${work.name} Video`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
               <div className="aspect-video w-full rounded-lg bg-gray-50 dark:bg-stone-800/50 flex items-center justify-center border border-gray-200 dark:border-stone-700">
                 <div className="text-center text-gray-400">
                   <Youtube className="w-10 h-10 mx-auto mb-3 opacity-50" />
                   <p className="text-xs uppercase font-bold tracking-widest">Video Bulunmuyor</p>
                 </div>
               </div>
            )}

            <div className="flex gap-2 pt-6 border-t border-gray-200 dark:border-stone-700">
               <button 
                 onClick={onRouteRequest}
                 disabled={routingLoading}
                 className="flex-[2] flex items-center justify-center gap-2 bg-[#991B1B] hover:bg-[#7f1616] text-white py-4 px-4 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors shadow-sm disabled:opacity-70"
               >
                 {routingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                 Yol Tarifi Başlat
               </button>
               <button 
                 onClick={async () => {
                   if (isSharing) return;
                   
                   const shareData = {
                     title: work.name,
                     text: `${work.name} - Mimar Sinan Eseri`,
                     url: window.location.href,
                   };
                   
                   if (navigator.share && navigator.canShare(shareData)) {
                     try {
                       setIsSharing(true);
                       await navigator.share(shareData);
                     } catch (err: any) {
                       if (err.name !== 'AbortError') {
                         console.error('Error sharing:', err);
                       }
                     } finally {
                       setIsSharing(false);
                     }
                   } else {
                     navigator.clipboard.writeText(window.location.href);
                     alert('Bağlantı kopyalandı!');
                   }
                 }}
                 disabled={isSharing}
                 className="flex-[1] flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 py-4 px-4 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors shadow-sm disabled:opacity-70"
               >
                 {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                 Paylaş
               </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
