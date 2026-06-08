import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, AlertCircle, Youtube, Navigation } from 'lucide-react';
import { Work } from '../types';
import { fetchWorks } from '../services/dataService';
import WorkOverlay from '../components/WorkOverlay';

// Custom Marker Colors
const getMarkerColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('cami')) return '#B7410E'; // Kiremit Kırmızısı
  if (t.includes('külliye')) return '#D4A017'; // Hardal
  if (t.includes('medrese')) return '#1E3A8A'; // Lacivert
  if (t.includes('hamam')) return '#14B8A6'; // Turkuaz
  if (t.includes('türbe')) return '#10B981'; // Zümrüt Yeşili
  return '#6B8E23'; // Haki Yeşili
};

interface LegendItem {
  type: string;
  color: string;
}

const legendItems: LegendItem[] = [
  { type: 'Cami', color: '#B7410E' },
  { type: 'Külliye', color: '#D4A017' },
  { type: 'Medrese', color: '#1E3A8A' },
  { type: 'Hamam', color: '#14B8A6' },
  { type: 'Türbe', color: '#10B981' },
  { type: 'Diğer', color: '#6B8E23' }
];

const getMarkerIcon = (type: string) => {
  const color = getMarkerColor(type);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">
    <path fill="${color}" d="M16 0C7.163 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24C32 7.164 24.837 0 16 0zm0 22a6 6 0 110-12 6 6 0 010 12z"/>
    <circle fill="#FFFFFF" cx="16" cy="16" r="6"/>
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
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('Veriler yükleniyor...');
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  
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

  const generalCenter: [number, number] = [40.0, 31.0];

  return (
    <div className="flex-1 flex overflow-hidden flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar: List of Works */}
      <aside className="w-full md:w-80 bg-white dark:bg-stone-900 border-r border-[#D1D5DB] dark:border-stone-700 flex flex-col shadow-xl z-20 order-2 md:order-1 h-[40vh] md:h-auto transition-colors duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-stone-700 bg-[#F9F8F6] dark:bg-stone-950 shrink-0 transition-colors">
          <h2 className="text-sm font-bold uppercase tracking-tighter mb-1 dark:text-stone-100">Mimar Sinan Eserleri</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Nominatim ile {works.length} eser doğrulandı</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {works.map((work, idx) => (
             <div 
               key={idx}
               onClick={() => setActiveMarkerId(idx)}
               className={`p-6 border-b border-gray-100 dark:border-stone-800 cursor-pointer group transition-colors ${activeMarkerId === idx ? 'bg-[#991B1B] dark:bg-red-800 text-white' : 'hover:bg-[#F9F8F6] dark:hover:bg-stone-800 text-[#1A1A1A] dark:text-stone-200'}`}
             >
               <p className={`text-[10px] uppercase font-bold mb-1 ${activeMarkerId === idx ? 'opacity-70 dark:opacity-90' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#991B1B] dark:group-hover:text-red-400'}`}>
                 {work.district} / {work.year || 'Bilinmiyor'}
               </p>
               <h3 className="font-serif text-lg leading-tight line-clamp-2">{work.name}</h3>
               <div className="flex justify-between items-center mt-2 px-0">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getMarkerColor(work.type) }}></div>
                   <p className={`text-xs ${activeMarkerId === idx ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>{work.type}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </aside>

      {/* Map Content */}
      <section className="flex-1 relative bg-[#DBEAFE] dark:bg-blue-950 order-1 md:order-2 h-[60vh] md:h-auto transition-colors duration-200">
        
        {/* HARİTA LEJANTI */}
        <div className="absolute top-4 right-4 z-[400] bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-gray-200 dark:border-stone-700 p-3 rounded-sm shadow-md hidden sm:block">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 dark:border-stone-700 pb-1">Yapı Türleri</h4>
          <div className="flex flex-col gap-1.5">
            {legendItems.map(item => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-gray-700 dark:text-stone-300 font-medium">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 z-[1000] bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-900 p-6 border border-[#D1D5DB] dark:border-stone-700 rounded-sm shadow-xl flex flex-col items-center space-y-4 max-w-sm w-full text-center transition-colors">
              <Loader2 className="w-10 h-10 text-[#991B1B] dark:text-red-500 animate-spin" />
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100">Harita Hazırlanıyor</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-[#991B1B] dark:text-red-400">{progressMsg}</p>
              <p className="text-[10px] text-gray-400 dark:text-stone-500 mt-2">Koordinatlar çözümleniyor. Lütfen bekleyin.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-[1000] bg-[#F9F8F6] dark:bg-stone-900 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-800 p-6 border border-[#991B1B] dark:border-red-500 shadow-xl flex flex-col items-center space-y-4 max-w-sm w-full text-center transition-colors">
              <AlertCircle className="w-10 h-10 text-[#991B1B] dark:text-red-500" />
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100">Yükleme Hatası</h3>
              <p className="text-xs text-gray-500 dark:text-stone-400">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#991B1B] dark:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#7f1616] dark:hover:bg-red-600 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}

        {activeMarkerId !== null && works[activeMarkerId] && (
          <WorkOverlay 
            work={works[activeMarkerId]}
            onClose={() => setActiveMarkerId(null)}
            userCoords={userCoords}
            routingLoading={routingLoading}
            onRouteRequest={handleRouteRequest}
          />
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
          
          {works.map((work, idx) => (
            work.lat && work.lng ? (
              <Marker 
                key={idx} 
                position={[work.lat, work.lng]}
                icon={getMarkerIcon(work.type)}
                eventHandlers={{
                  click: () => setActiveMarkerId(idx)
                }}
              >
                <Tooltip direction="top" offset={[0, -40]} opacity={1} className="geometric-tooltip">
                  <div className="bg-gray-900 text-white text-[10px] px-3 py-1.5 whitespace-nowrap shadow-xl border-none">
                    <span className="font-bold border-r border-white/30 pr-2 mr-2">{work.district.split('/')[0].trim()}</span>{work.name} 
                  </div>
                </Tooltip>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </section>
    </div>
  );
}
