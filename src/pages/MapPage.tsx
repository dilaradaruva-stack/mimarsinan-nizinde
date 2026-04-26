import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Loader2, AlertCircle, Phone, MapPin, Clock, Calendar, Youtube, Navigation } from 'lucide-react';
import { Work } from '../types';
import { fetchWorks } from '../services/dataService';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchWorks((current, total) => {
          if (isMounted) {
            setProgressMsg(`Koordinatlar çözümleniyor... (${current}/${total})`);
          }
        });
        
        if (isMounted) {
          setWorks(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError('Veriler yüklenirken bir hata oluştu.');
          setLoading(false);
        }
      }
    }

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Center towards Turkey/Balkans
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
               <h3 className="font-serif text-lg leading-tight">{work.name}</h3>
               <div className="flex justify-between items-center mt-2 px-0">
                 <p className={`text-xs ${activeMarkerId === idx ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>{work.type}</p>
                 
                 <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' && (
                       <a href={work.youtube.startsWith('http') ? work.youtube : `https://${work.youtube}`} target="_blank" rel="noopener noreferrer" className={`p-1 rounded-sm ${activeMarkerId === idx ? 'hover:bg-black/20 text-white' : 'hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'}`}>
                         <Youtube className="w-4 h-4" />
                       </a>
                    )}
                    {work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok' && (
                       <a href={work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`} target="_blank" rel="noopener noreferrer" className={`p-1 rounded-sm ${activeMarkerId === idx ? 'hover:bg-black/20 text-white' : 'hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-500 dark:text-gray-400 hover:text-[#991B1B] dark:hover:text-red-400'}`}>
                         <Navigation className="w-4 h-4" />
                       </a>
                    )}
                 </div>
               </div>
             </div>
          ))}
        </div>
      </aside>

      {/* Map Content */}
      <section className="flex-1 relative bg-[#DBEAFE] dark:bg-blue-950 order-1 md:order-2 h-[60vh] md:h-auto transition-colors duration-200">
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
                eventHandlers={{
                  click: () => setActiveMarkerId(idx)
                }}
              >
                <Tooltip direction="top" offset={[0, -40]} opacity={1} className="geometric-tooltip">
                  <div className="bg-gray-900 text-white text-[10px] px-3 py-1.5 whitespace-nowrap shadow-xl border-none">
                    {work.name} | {work.district.split('/')[0].trim()}
                  </div>
                </Tooltip>
                
                <Popup className="geometric-popup">
                  <div className="bg-white dark:bg-stone-900 p-4 w-64 border-t-0 font-sans rounded-lg transition-colors">
                    <h4 className="font-serif font-bold text-[#1A1A1A] dark:text-stone-100 border-b border-[#D1D5DB] dark:border-stone-700 pb-2 mb-2 text-base transition-colors">
                      {work.name}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 dark:text-stone-500 uppercase font-bold">Adres</p>
                      <p className="text-xs text-gray-700 dark:text-stone-300">{(work.address && work.address.toLowerCase() !== 'bilgi yok' && work.address.toLowerCase() !== 'yok') ? work.address : ''} {work.district}</p>
                      
                      {(work.phone && work.phone.toLowerCase() !== 'bilgi yok' && work.phone.toLowerCase() !== 'yok') && (
                        <>
                          <p className="text-[10px] text-gray-400 dark:text-stone-500 uppercase font-bold mt-2">İletişim</p>
                          <p className="text-xs text-gray-700 dark:text-stone-300">{work.phone}</p>
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D1D5DB] dark:border-stone-700 flex gap-2">
                       {work.mapsUrl && work.mapsUrl !== 'Git' && work.mapsUrl !== 'Yok' && (
                         <a 
                           href={work.mapsUrl.startsWith('http') ? work.mapsUrl : `https://${work.mapsUrl}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="flex-1 flex justify-center items-center gap-1.5 bg-[#F9F8F6] dark:bg-stone-800 hover:bg-[#E5E7EB] dark:hover:bg-stone-700 border border-[#D1D5DB] dark:border-stone-600 text-[#1A1A1A] dark:text-stone-200 text-[10px] uppercase font-bold py-1.5 rounded-sm transition-colors"
                         >
                           <Navigation className="w-3 h-3 text-[#991B1B] dark:text-red-400" />
                           Yol Tarifi
                         </a>
                       )}
                       {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' && (
                         <a 
                           href={work.youtube.startsWith('http') ? work.youtube : `https://${work.youtube}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="flex-1 flex justify-center items-center gap-1.5 bg-[#F9F8F6] dark:bg-stone-800 hover:bg-[#E5E7EB] dark:hover:bg-stone-700 border border-[#D1D5DB] dark:border-stone-600 text-[#1A1A1A] dark:text-stone-200 text-[10px] uppercase font-bold py-1.5 rounded-sm transition-colors"
                         >
                           <Youtube className="w-3 h-3 text-red-600 dark:text-red-500" />
                           Video
                         </a>
                       )}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <span className="text-[10px] text-gray-400 dark:text-stone-500 font-mono tracking-tighter">
                        {work.lat.toFixed(4)}° N, {work.lng.toFixed(4)}° E
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      </section>
    </div>
  );
}
