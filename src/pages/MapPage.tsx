import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, AlertCircle, Youtube, Navigation, Filter, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Work } from '../types';
import { fetchWorks } from '../services/dataService';
import WorkOverlay from '../components/WorkOverlay';
import { useLanguage } from '../contexts/LanguageContext';

// Custom Marker Colors
const getMarkerColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('cami')) return '#B7410E'; // Kiremit Kırmızısı
  if (t.includes('külliye')) return '#D4A017'; // Hardal
  if (t.includes('medrese')) return '#1E3A8A'; // Lacivert
  if (t.includes('hamam')) return '#14B8A6'; // Turkuaz
  if (t.includes('türbe')) return '#10B981'; // Zümrüt Yeşili
  if (t.includes('köprü')) return '#78716C'; // Taş/Gri
  return '#6B8E23'; // Haki Yeşili
};

// SVG Paths for 24x24 viewBox, colored white
const getIconPath = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('cami')) {
    // Landmark / Mosque (Dome and Pillars)
    return `<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (t.includes('külliye')) {
    // Building Complex
    return `<path d="M4 22v-8h16v8M8 14v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6M12 2v4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (t.includes('medrese')) {
    // Book Open
    return `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (t.includes('hamam')) {
    // Droplet
    return `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (t.includes('türbe')) {
    // Arch / Monument
    return `<path d="M12 2v20M8 22h8M12 2a4 4 0 0 0-4 4v16M12 2a4 4 0 0 1 4 4v16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (t.includes('köprü')) {
    // Bridge Arch
    return `<path d="M2 20h20M5 20v-6a7 7 0 0 1 14 0v6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  // Diğer
  return `<path d="M12 2L2 22h20L12 2z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
};

interface LegendItem {
  type: string;
  color: string;
  svg: string;
}

const legendItems: LegendItem[] = [
  { type: 'Cami', color: '#B7410E', svg: getIconPath('cami') },
  { type: 'Külliye', color: '#D4A017', svg: getIconPath('külliye') },
  { type: 'Medrese', color: '#1E3A8A', svg: getIconPath('medrese') },
  { type: 'Hamam', color: '#14B8A6', svg: getIconPath('hamam') },
  { type: 'Türbe', color: '#10B981', svg: getIconPath('türbe') },
  { type: 'Köprü', color: '#78716C', svg: getIconPath('köprü') },
  { type: 'Diğer Yapılar', color: '#6B8E23', svg: getIconPath('diğer') }
];

const getMarkerIcon = (type: string) => {
  const color = getMarkerColor(type);
  const iconPath = getIconPath(type);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">
    <path fill="${color}" d="M16 0C7.163 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.837 0 16 0zm0 22a6 6 0 110-12 6 6 0 010 12z"/>
    <g transform="translate(6, 4) scale(0.85)">
      ${iconPath}
    </g>
  </svg>`;
  
  return L.divIcon({
    html: svg,
    className: 'custom-map-icon',
    iconSize: [28, 35],
    iconAnchor: [14, 35],
    popupAnchor: [0, -35]
  });
};

function MapFlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { animate: true, duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function MapPage() {
  const location = useLocation();
  const { t, translateWorkField } = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('Veriler yükleniyor...');
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    return (location.state as any)?.filter || null;
  });
  const [showLegend, setShowLegend] = useState(false);
  
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [routingLoading, setRoutingLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWorks((current, total) => {
          if (isMounted) setProgressMsg(`Koordinatlar çözümleniyor... (${current}/${total})`);
        });
        if (isMounted) {
          setWorks(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Veriler yüklenirken bir hata oluştu.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleRouteRequest = () => {
    if (activeMarkerId === null) return;
    const work = works[activeMarkerId];
    if (!work || !work.lat || !work.lng) return;

    setRoutingLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
        setRoutingLoading(false);
        
        // Open Google Maps directions
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${work.lat},${work.lng}&travelmode=driving`;
        window.open(url, '_blank');
      }, () => {
        // Fallback if permission denied
        setRoutingLoading(false);
        alert('Konum alınamadı. Standart harita linki açılıyor.');
        if (work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok') {
          window.open(work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`, '_blank');
        }
      });
    } else {
      setRoutingLoading(false);
      alert('Tarayıcınız konum özelliğini desteklemiyor.');
    }
  };

  const filteredWorks = works.filter(work => {
    if (!activeFilter) return true;
    if (activeFilter === 'Diğer Yapılar') {
      const mainTypes = ['cami', 'külliye', 'medrese', 'hamam', 'türbe', 'köprü'];
      return !mainTypes.some(t => work.type.toLowerCase().includes(t));
    }
    if (activeFilter.includes(',')) {
      const filters = activeFilter.split(',').map(f => f.trim().toLowerCase());
      return filters.some(f => work.type.toLowerCase().includes(f));
    }
    return work.type.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const generalCenter: [number, number] = [40.0, 31.0];

  return (
    <div className="flex-1 flex overflow-hidden flex-col md:flex-row transition-colors duration-200 relative">
      {/* Sidebar: List of Works */}
      <aside className="w-full md:w-80 bg-white dark:bg-stone-900 border-r border-[#D1D5DB] dark:border-stone-700 flex flex-col shadow-xl z-20 order-2 md:order-1 h-[40vh] md:h-auto transition-colors duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-stone-700 bg-[#F9F8F6] dark:bg-stone-950 shrink-0 transition-colors">
          <h2 className="text-sm font-bold uppercase tracking-tighter mb-1 dark:text-stone-100">{t('app.title') || 'Mimar Sinan Eserleri'}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('map.works_found').replace('{count}', filteredWorks.length.toString())}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredWorks.map((work, idx) => {
             const originalIdx = works.indexOf(work);
             return (
             <div 
               key={originalIdx}
               onClick={() => setActiveMarkerId(originalIdx)}
               className={`p-6 border-b border-gray-100 dark:border-stone-800 cursor-pointer group transition-colors ${activeMarkerId === originalIdx ? 'bg-[#991B1B] dark:bg-red-800 text-white' : 'hover:bg-[#F9F8F6] dark:hover:bg-stone-800 text-[#1A1A1A] dark:text-stone-200'}`}
             >
               <p className={`text-[10px] uppercase font-bold mb-1 ${activeMarkerId === originalIdx ? 'opacity-70 dark:opacity-90' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#991B1B] dark:group-hover:text-red-400'}`}>
                 {work.district} / {work.year || t('map.unknown_year')}
               </p>
               <h3 className="font-serif text-lg leading-tight line-clamp-2">{translateWorkField(work.name, 'name')}</h3>
               <div className="flex justify-between items-center mt-2 px-0">
                 <div className="flex items-center gap-1.5">
                   <div 
                     className="w-4 h-4 rounded flex items-center justify-center p-0.5" 
                     style={{ backgroundColor: getMarkerColor(work.type) }}
                     dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24">${getIconPath(work.type)}</svg>` }}
                   ></div>
                   <p className={`text-xs ${activeMarkerId === originalIdx ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>{translateWorkField(work.type, 'type')}</p>
                 </div>
               </div>
             </div>
          )})}
        </div>
      </aside>

      {/* Map Content */}
      <section className="flex-1 relative bg-[#DBEAFE] dark:bg-blue-950 order-1 md:order-2 h-[60vh] md:h-auto transition-colors duration-200">
        
        {/* HARİTA LEJANTI / FİLTRE */}
        {/* Mobile Toggle Button */}
        <button
          className={`lg:hidden absolute top-4 right-4 z-[400] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200 dark:border-stone-700/50 flex items-center justify-center text-gray-800 dark:text-stone-200 transition-opacity duration-200 ${showLegend ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
          onClick={() => setShowLegend(true)}
        >
          <Filter className="w-5 h-5" />
        </button>

        {/* Legend Panel */}
        <div className={`absolute top-4 right-4 z-[400] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 dark:border-stone-700/50 p-3 sm:p-4 rounded-xl shadow-lg sm:w-56 w-48 transition-all duration-300 transform ${showLegend ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto'}`}>
          <div className="flex justify-between items-center mb-3 border-b border-gray-200/50 dark:border-stone-700/50 pb-2">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-stone-200">{t('map.legend_title')}</h4>
            <button className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => setShowLegend(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveFilter(null)}
              className={`flex items-center gap-2 w-full text-left p-1.5 rounded-md transition-colors ${activeFilter === null ? 'bg-gray-100 dark:bg-stone-800 ring-1 ring-gray-300 dark:ring-stone-600' : 'hover:bg-gray-50 dark:hover:bg-stone-800/50'}`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md shadow-sm flex items-center justify-center bg-gray-600 shrink-0">
                <span className="text-white text-[10px] font-bold">ALL</span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${activeFilter === null ? 'text-black dark:text-white font-bold' : 'text-gray-700 dark:text-stone-300'}`}>{t('map.filter_all')}</span>
            </button>
            {legendItems.map(item => {
              const isActive = activeFilter === item.type || (activeFilter && activeFilter.includes(',') && activeFilter.split(',').some(f => item.type.toLowerCase().includes(f.trim().toLowerCase()))) || (activeFilter === 'Su Kemeri' && item.type === 'Diğer Yapılar');
              return (
              <button 
                key={item.type} 
                onClick={() => setActiveFilter(item.type)}
                className={`flex items-center gap-2 w-full text-left p-1.5 rounded-md transition-colors ${isActive ? 'bg-gray-100 dark:bg-stone-800 ring-1 ring-gray-300 dark:ring-stone-600' : 'hover:bg-gray-50 dark:hover:bg-stone-800/50 opacity-80 hover:opacity-100'}`}
              >
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md shadow-sm flex items-center justify-center p-1 shrink-0" 
                  style={{ backgroundColor: item.color }}
                  dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" class="w-full h-full">${item.svg}</svg>` }}
                ></div>
                <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'text-black dark:text-white font-bold' : 'text-gray-700 dark:text-stone-300'}`}>
                  {item.type === 'Diğer Yapılar' ? t('map.other_structures') : translateWorkField(item.type, 'type')}
                </span>
              </button>
            )})}
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 z-[1000] bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-900 p-6 border border-[#D1D5DB] dark:border-stone-700 rounded-sm shadow-xl flex flex-col items-center space-y-4 max-w-sm w-full text-center transition-colors">
              <Loader2 className="w-10 h-10 text-[#991B1B] dark:text-red-500 animate-spin" />
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100">{t('map.loading')}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#991B1B] dark:text-red-400">{progressMsg}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-[1000] bg-[#F9F8F6] dark:bg-stone-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-800 p-6 border border-[#991B1B] dark:border-red-500 shadow-xl flex flex-col items-center space-y-4 max-w-sm w-full text-center transition-colors">
              <AlertCircle className="w-10 h-10 text-[#991B1B] dark:text-red-500" />
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100">{error}</h3>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#991B1B] dark:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#7f1616] dark:hover:bg-red-600 transition-colors"
              >
                {t('error.retry') || 'Tekrar Dene'}
              </button>
            </div>
          </div>
        )}

        {activeMarkerId !== null && works[activeMarkerId] && (
          <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 pointer-events-auto">
            <WorkOverlay 
              work={works[activeMarkerId]}
              onClose={() => setActiveMarkerId(null)}
              userCoords={userCoords}
              routingLoading={routingLoading}
              onRouteRequest={handleRouteRequest}
            />
          </div>
        )}

        <MapContainer 
          center={generalCenter} 
          zoom={6} 
          className="w-full h-full z-10"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapFlyTo coords={activeMarkerId !== null && works[activeMarkerId] && works[activeMarkerId].lat && works[activeMarkerId].lng ? [works[activeMarkerId].lat!, works[activeMarkerId].lng!] : null} />
          
          {filteredWorks.map((work) => {
            const originalIdx = works.indexOf(work);
            return work.lat && work.lng ? (
              <Marker 
                key={originalIdx} 
                position={[work.lat, work.lng]}
                icon={getMarkerIcon(work.type)}
                eventHandlers={{
                  click: () => setActiveMarkerId(originalIdx)
                }}
              >
                <Tooltip direction="top" offset={[0, -40]} opacity={1} className="geometric-tooltip">
                  <div className="bg-gray-900 text-white text-[10px] px-3 py-1.5 whitespace-nowrap shadow-xl border-none">
                    <span className="font-bold border-r border-white/30 pr-2 mr-2">{work.district.split('/')[0].trim()}</span>{translateWorkField(work.name, 'name')} 
                  </div>
                </Tooltip>
              </Marker>
            ) : null;
          })}
        </MapContainer>
      </section>
    </div>
  );
}
