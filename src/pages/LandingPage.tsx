import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MapPin, Building, Calendar, Info, Mail, MessageSquareHeart, MapPinPlus } from 'lucide-react';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#iletisim') {
      setTimeout(() => {
        const el = document.getElementById('iletisim');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center py-12 px-4 bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-200">
      <div className="max-w-4xl w-full space-y-16 mt-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-widest shadow-sm mb-4 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#991B1B] dark:bg-red-500 animate-pulse"></span>
            Osmanlı Mimarisinin İzleri
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-tight transition-colors">
            Mimar Sinan'ın <br className="hidden md:block" />
            <span className="text-[#991B1B] dark:text-red-500">
              Ölümsüz Eserleri
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-stone-400 leading-relaxed font-medium transition-colors">
            Koca Sinan'ın yüzyıllara meydan okuyan, geniş bir coğrafyayı şekillendiren mimari mirasını harita üzerinde keşfedin.
          </p>
          
          <div className="pt-4 flex justify-center">
             <Link to="/map" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#991B1B] dark:bg-red-700 hover:bg-[#7f1616] dark:hover:bg-red-600 text-white text-sm font-bold uppercase tracking-widest transition-all rounded shadow-md ring-4 ring-[#991B1B]/20 dark:ring-red-700/20">
               <MapPin className="w-4 h-4" />
               Eserleri Keşfetmeye Başla
             </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-[#D1D5DB] dark:border-stone-800 transition-colors">
          <div className="bg-white dark:bg-stone-800 p-6 rounded-sm border border-[#D1D5DB] dark:border-stone-700 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-[#991B1B] dark:bg-red-700 text-white rounded-sm flex items-center justify-center mb-6">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100 mb-2 leading-tight">Camiler ve Külliyeler</h3>
            <p className="text-gray-500 dark:text-stone-400 text-sm">Süleymaniye, Şehzade ve daha birçok görkemli yapının konumlarını inceleyin.</p>
          </div>

          <div className="bg-white dark:bg-stone-800 p-6 rounded-sm border border-[#D1D5DB] dark:border-stone-700 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-[#991B1B] dark:bg-red-700 text-white rounded-sm flex items-center justify-center mb-6">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100 mb-2 leading-tight">Tarihi Su Kemerleri</h3>
            <p className="text-gray-500 dark:text-stone-400 text-sm">Altyapı dehasının ürünleri Mağlova ve Güzelce Kemeri gibi yapıları haritada bulun.</p>
          </div>

          <div className="bg-white dark:bg-stone-800 p-6 rounded-sm border border-[#D1D5DB] dark:border-stone-700 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-[#991B1B] dark:bg-red-700 text-white rounded-sm flex items-center justify-center mb-6">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-stone-100 mb-2 leading-tight">Detaylı Bilgiler</h3>
            <p className="text-gray-500 dark:text-stone-400 text-sm">Adres, telefon ve çalışma saatleri gibi pratik bilgilere tek tıkla ulaşın.</p>
          </div>
        </div>

        <div id="iletisim" className="grid md:grid-cols-2 gap-6 pt-12 border-t border-[#D1D5DB] dark:border-stone-700 transition-colors">
          {/* Geri Bildirim Kutucuğu */}
          <div className="bg-white dark:bg-stone-800 p-8 rounded-sm border border-[#D1D5DB] dark:border-stone-700 shadow-sm flex flex-col transition-colors">
            <div className="w-12 h-12 bg-[#F9F8F6] dark:bg-stone-900 border border-[#D1D5DB] dark:border-stone-700 text-[#991B1B] dark:text-red-500 rounded-sm flex items-center justify-center mb-6 transition-colors">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white mb-4 transition-colors">
              Geri Bildirim / Teşekkür
            </h3>
            <p className="text-gray-600 dark:text-stone-400 mb-8 flex-1 leading-relaxed transition-colors">
              Projemiz hakkındaki düşüncelerinizi ve eklemek istediklerinizi bize bildirin. Teşekkür ve önerilerinizi ulaştırmak için bizimle iletişime geçin.
            </p>
            <a 
              href="mailto:ikibeyzabirdilara@outlook.com?subject=Mimar%20Sinan'ın%20İzinde%20-%20Geri%20Bildirim%20ve%20Teşekkür"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#1A1A1A] hover:bg-[#333333] dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              Mesaj Gönder
            </a>
          </div>

          {/* Mekan Ekle Kutucuğu */}
          <div className="bg-white dark:bg-stone-800 p-8 rounded-sm border border-[#D1D5DB] dark:border-stone-700 shadow-sm flex flex-col transition-colors">
            <div className="w-12 h-12 bg-[#F9F8F6] dark:bg-stone-900 border border-[#D1D5DB] dark:border-stone-700 text-[#991B1B] dark:text-red-500 rounded-sm flex items-center justify-center mb-6 transition-colors">
              <MapPinPlus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white mb-4 transition-colors">
              Mekan Ekle / Öner
            </h3>
            <p className="text-gray-600 dark:text-stone-400 mb-8 flex-1 leading-relaxed transition-colors">
              Haritada görmek istediğiniz Mimar Sinan'ın eserlerini bize bildirin, bu mirası birlikte büyütelim.
            </p>
            <a 
              href="mailto:ikibeyzabirdilara@outlook.com?subject=Mimar%20Sinan'ın%20İzinde%20-%20Mekan%20Önerisi"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#991B1B] hover:bg-[#7f1616] dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              Mesaj Gönder
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
