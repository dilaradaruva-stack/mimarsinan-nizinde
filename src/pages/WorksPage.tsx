import { useEffect, useState } from 'react';
import { fetchWorks } from '../services/dataService';
import { Work } from '../types';
import { Loader2, Search, MapPin, Youtube, Navigation, Phone, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkOverlay from '../components/WorkOverlay';
import { useLanguage } from '../contexts/LanguageContext';

const getCategoryColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('cami')) return '#B7410E'; // Kiremit Kırmızısı
  if (t.includes('külliye')) return '#D4A017'; // Hardal
  if (t.includes('medrese')) return '#1E3A8A'; // Lacivert
  if (t.includes('hamam')) return '#14B8A6'; // Turkuaz
  if (t.includes('türbe')) return '#10B981'; // Zümrüt Yeşili
  if (t.includes('köprü')) return '#78716C'; // Taş/Gri
  return '#6B8E23'; // Haki Yeşili
};

const getIconPath = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('cami')) return `<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (t.includes('külliye')) return `<path d="M4 22v-8h16v8M8 14v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6M12 2v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (t.includes('medrese')) return `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (t.includes('hamam')) return `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (t.includes('türbe')) return `<path d="M12 2v20M8 22h8M12 2a4 4 0 0 0-4 4v16M12 2a4 4 0 0 1 4 4v16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (t.includes('köprü')) return `<path d="M2 20h20M5 20v-6a7 7 0 0 1 14 0v6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<path d="M12 2L2 22h20L12 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
};

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const { t, translateWorkField } = useLanguage();

  useEffect(() => {
    fetchWorks()
      .then(data => {
        setWorks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching works:', error);
        setLoading(false);
      });
  }, []);

  const handleRouteRequest = (work: Work) => {
    if (!work.lat || !work.lng) {
      if (work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok') {
        const fallbackUrl = work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`;
        window.open(fallbackUrl, '_blank') || window.location.assign(fallbackUrl);
      }
      return;
    }

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    const openIntent = (url: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        const url = isIOS 
          ? `https://maps.apple.com/?saddr=${latitude},${longitude}&daddr=${work.lat},${work.lng}&dirflg=d`
          : `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${work.lat},${work.lng}&travelmode=driving`;
        
        openIntent(url);
      }, (error) => {
        console.warn('Geolocation error:', error);
        if (work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok') {
          const fallbackUrl = work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`;
          openIntent(fallbackUrl);
        }
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    } else {
      if (work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok') {
        const fallbackUrl = work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`;
        openIntent(fallbackUrl);
      }
    }
  };

  const filteredWorks = works.filter(work => 
    translateWorkField(work.name, 'name').toLowerCase().includes(searchTerm.toLowerCase()) || 
    work.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translateWorkField(work.type, 'type').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-200 relative">
      {selectedWork && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <WorkOverlay 
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
            userCoords={null}
            routingLoading={false}
            onRouteRequest={() => handleRouteRequest(selectedWork)}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto py-12 px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-tight mb-2">
              {t('works.explore') || 'Tüm Eserler'}
            </h1>
            <p className="text-gray-500 dark:text-stone-400">
              {t('works.subtitle') || "Mimar Sinan'ın günümüze ulaşan ustalık eserlerini inceleyin."}
            </p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={t('works.search_placeholder') || "Eser adı, türü veya bölge ara..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:text-stone-200 transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-[#991B1B] animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#991B1B]">{t('map.loading') || 'Eserler Yükleniyor...'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 rounded-sm shadow-sm hover:shadow-md transition-all p-6 flex flex-col group relative">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="flex items-center gap-1.5 text-[10px] px-2 py-1 uppercase font-bold text-white rounded-sm shadow-sm"
                    style={{ backgroundColor: getCategoryColor(work.type) }}
                  >
                    <div 
                      className="w-3 h-3 text-white" 
                      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24">${getIconPath(work.type)}</svg>` }}
                    ></div>
                    {translateWorkField(work.type, 'type')}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {work.year || t('map.unknown_year') || 'Bilinmiyor'}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-bold mb-2 text-[#1A1A1A] dark:text-stone-100 group-hover:text-[#991B1B] dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {translateWorkField(work.name, 'name')}
                </h3>
                
                <div className="flex flex-col gap-2 mb-6 flex-1">
                  <div className="flex items-start gap-2 text-gray-500 dark:text-stone-400 text-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {(work.address && work.address.toLowerCase() !== 'bilgi yok' && work.address.toLowerCase() !== 'yok') 
                        ? `${work.address}, ${work.district}` 
                        : work.district}
                    </span>
                  </div>
                  {work.phone && work.phone.toLowerCase() !== 'bilgi yok' && work.phone.toLowerCase() !== 'yok' && (
                    <div className="flex items-start gap-2 text-gray-500 dark:text-stone-400 text-sm">
                      <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{work.phone}</span>
                    </div>
                  )}
                  {work.hours && work.hours.toLowerCase() !== 'bilgi yok' && work.hours.toLowerCase() !== 'yok' && (
                    <div className="flex items-start gap-2 text-gray-500 dark:text-stone-400 text-sm">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{work.hours}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-stone-700 mt-auto">
                    {work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok' && (
                      <a 
                        href={work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex justify-center items-center gap-1.5 bg-[#F9F8F6] dark:bg-stone-900 hover:bg-gray-100 dark:hover:bg-stone-700 border border-gray-200 dark:border-stone-600 text-[#1A1A1A] dark:text-stone-300 text-[10px] uppercase font-bold py-2 rounded-sm transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-[#991B1B] dark:text-red-400" />
                        {t('overlay.start_nav')}
                      </a>
                    )}
                    {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' && (
                      <a 
                        href={work.youtube.startsWith('http') ? work.youtube : `https://${work.youtube}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex justify-center items-center gap-1.5 bg-[#F9F8F6] dark:bg-stone-900 hover:bg-gray-100 dark:hover:bg-stone-700 border border-gray-200 dark:border-stone-600 text-[#1A1A1A] dark:text-stone-300 text-[10px] uppercase font-bold py-2 rounded-sm transition-colors"
                      >
                        <Youtube className="w-3 h-3 text-red-600 dark:text-red-500" />
                        {t('works.video')}
                      </a>
                    )}
                    <button 
                      onClick={() => setSelectedWork(work)}
                      className="flex-[1.5] flex justify-center items-center gap-1.5 bg-[#F9F8F6] dark:bg-stone-900 hover:bg-gray-100 dark:hover:bg-stone-700 border border-gray-200 dark:border-stone-600 text-[#1A1A1A] dark:text-stone-300 text-[10px] uppercase font-bold py-2 rounded-sm transition-colors"
                    >
                      <Search className="w-3 h-3 text-blue-600 dark:text-blue-500" />
                      {t('works.inspect')}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
