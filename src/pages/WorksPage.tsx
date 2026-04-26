import { useEffect, useState } from 'react';
import { fetchWorks } from '../services/dataService';
import { Work } from '../types';
import { Loader2, Search, MapPin, Youtube, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredWorks = works.filter(work => 
    work.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    work.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto py-12 px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-tight mb-2">
              Tüm Eserler
            </h1>
            <p className="text-gray-500 dark:text-stone-400">
              Mimar Sinan'ın günümüze ulaşan ustalık eserlerini inceleyin.
            </p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Eser adı, türü veya bölge ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B] dark:text-stone-200 transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-[#991B1B] animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#991B1B]">Eserler Yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 rounded-sm shadow-sm hover:shadow-md transition-all p-6 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] bg-[#F9F8F6] dark:bg-stone-900 px-2 py-1 uppercase font-bold text-gray-600 dark:text-stone-400 rounded-sm">
                    {work.type}
                  </span>
                  <span className="textxs font-mono text-gray-400">
                    {work.year || 'Bilinmiyor'}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-bold mb-2 text-[#1A1A1A] dark:text-stone-100 group-hover:text-[#991B1B] dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {work.name}
                </h3>
                
                <div className="flex items-start gap-2 text-gray-500 dark:text-stone-400 mb-6 text-sm flex-1">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {(work.address && work.address.toLowerCase() !== 'bilgi yok' && work.address.toLowerCase() !== 'yok') 
                      ? `${work.address}, ${work.district}` 
                      : work.district}
                  </span>
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
                        Yol Tarifi
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
                        Video
                      </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
