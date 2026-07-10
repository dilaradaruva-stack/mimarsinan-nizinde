import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateWorkField: (text: string | undefined, fieldType: 'name' | 'type') => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    'nav.map': 'Harita',
    'nav.works': 'Eserler',
    'nav.about': 'Hakkında',
    'nav.contact': 'İletişim',
    'app.title': 'Mimar Sinan Eserleri',
    'app.system_active': 'SİSTEM AKTİF',
    'app.data_source': 'Veri Kaynağı: Google Sheets',
    'app.geocoding': 'Geocoding: OpenStreetMap Nominatim',
    'app.gps_stable': 'GPS Stabil',
    'error.retry': 'Tekrar Dene',
    'map.loading': 'Veriler yükleniyor...',
    'map.works_found': 'Nominatim ile {count} eser gösteriliyor',
    'map.unknown_year': 'Bilinmiyor',
    'map.search_placeholder': 'Eser adı ile ara...',
    'map.legend_title': 'Yapı Türleri',
    'map.filter_all': 'Tümünü Göster',
    'map.all_short': 'TÜM',
    'map.other_structures': 'Diğer Yapılar',
    'map.location_failed': 'Konum alınamadı. Standart harita linki açılıyor.',
    'map.no_geolocation': 'Tarayıcınız konum özelliğini desteklemiyor.',
    'map.resolving_coords': 'Koordinatlar çözümleniyor... ({current}/{total})',
    'map.loading_error': 'Veriler yüklenirken bir hata oluştu.',
    'overlay.start_nav': 'Yol Tarifi Başlat',
    'overlay.share': 'Paylaş',
    'overlay.link_copied': 'Bağlantı kopyalandı!',
    'overlay.type': 'Yapı Türü',
    'overlay.year': 'Yapım Tarihi',
    'overlay.location': 'Konum',
    'overlay.history': 'Tarihçe',
    'overlay.history_text': "Bu eser Mimar Sinan'ın {district} bölgesindeki önemli {type} yapılarından biridir.",
    'overlay.no_video': 'Video Bulunmuyor',
    'overlay.no_image': 'Görsel Bulunamadı',
    'works.explore': 'Eserleri Keşfet',
    'works.video': 'Video',
    'works.subtitle': "Mimar Sinan'ın günümüze ulaşan ustalık eserlerini inceleyin.",
    'works.search_placeholder': 'Eser adı, türü veya bölge ara...',
    'works.inspect': 'İncele',
    
    'landing.badge': 'Osmanlı Mimarisinin İzleri',
    'landing.title_p1': "Mimar Sinan'ın",
    'landing.title_p2': "Ölümsüz Eserleri",
    'landing.subtitle': "Koca Sinan'ın yüzyıllara meydan okuyan, geniş bir coğrafyayı şekillendiren mimari mirasını harita üzerinde keşfedin.",
    'landing.cta': 'Eserleri Keşfetmeye Başla',
    
    'landing.f1.title': 'Camiler ve Külliyeler',
    'landing.f1.desc': 'Süleymaniye, Şehzade ve daha birçok görkemli yapının konumlarını inceleyin.',
    'landing.f2.title': 'Tarihi Su Kemerleri',
    'landing.f2.desc': 'Altyapı dehasının ürünleri Mağlova ve Güzelce Kemeri gibi yapıları haritada bulun.',
    'landing.f3.title': 'Detaylı Bilgiler',
    'landing.f3.desc': 'Adres, telefon ve çalışma saatleri gibi pratik bilgilere tek tıkla ulaşın.',
    
    'landing.c1.title': 'Geri Bildirim / Teşekkür',
    'landing.c1.desc': 'Projemiz hakkındaki düşüncelerinizi ve eklemek istediklerinizi bize bildirin. Teşekkür ve önerilerinizi ulaştırmak için bizimle iletişime geçin.',
    'landing.c2.title': 'Mekan Ekle / Öner',
    'landing.c2.desc': "Haritada görmek istediğiniz Mimar Sinan'ın eserlerini bize bildirin, bu mirası birlikte büyütelim.",
    'landing.send_msg': 'Mesaj Gönder',

    'about.title': 'Hakkımızda',
    'about.badge': 'Proje Hakkında',
    'about.p1': 'Mimar Sinan’ın İzinde, Mimar Sinan’ın günümüze ulaşan eserlerini tek bir harita üzerinde bir araya getirmeyi amaçlayan dijital bir kültür ve keşif projesidir.',
    'about.p2': 'Amacımız, Mimar Sinan’ın camilerinden köprülerine, medreselerinden hamamlarına kadar uzanan mimari mirasını herkes için daha erişilebilir hale getirmektir. Harita üzerinde yer alan her eser için konum bilgisi, varsa iletişim bilgileri, ziyaret saatleri ve eseri daha yakından tanıyabileceğiniz video içeriklerini bir araya getiriyoruz. Böylece ister bulunduğunuz şehirde ister seyahatleriniz sırasında Mimar Sinan’ın eserlerini kolayca keşfedebilir, yol tarifi alabilir ve yapılar hakkında güvenilir bilgilere ulaşabilirsiniz.',
    'about.p3': 'Bu proje yaşayan bir arşiv olmayı hedeflemektedir. Bu nedenle kullanıcılarımızın katkıları bizim için büyük önem taşımaktadır. Sitemizde yer almayan bir Mimar Sinan eseri biliyorsanız, eksik veya güncellenmesi gereken bilgiler fark ettiyseniz ya da projemiz hakkındaki görüşlerinizi bizimle paylaşmak istiyorsanız bize e-posta yoluyla ulaşabilirsiniz.',
    'about.p4': 'Gönderdiğiniz öneriler ve geri bildirimler sayesinde Mimar Sinan’ın İzinde her geçen gün daha kapsamlı ve daha faydalı bir kaynak olmaya devam edecektir.',
    'about.p5': 'Mimar Sinan’ın eşsiz mimari mirasını birlikte keşfetmek ve gelecek nesillere aktarmak için çıktığımız bu yolculukta yanımızda olduğunuz için teşekkür ederiz.',
  },
  en: {
    'nav.map': 'Map',
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'app.title': 'Works of Mimar Sinan',
    'app.system_active': 'SYSTEM ACTIVE',
    'app.data_source': 'Data Source: Google Sheets',
    'app.geocoding': 'Geocoding: OpenStreetMap Nominatim',
    'app.gps_stable': 'GPS Stable',
    'error.retry': 'Retry',
    'map.loading': 'Loading data...',
    'map.works_found': 'Showing {count} works verified by Nominatim',
    'map.unknown_year': 'Unknown',
    'map.search_placeholder': 'Search by monument name...',
    'map.legend_title': 'Structure Types',
    'map.filter_all': 'Show All',
    'map.all_short': 'ALL',
    'map.other_structures': 'Other Structures',
    'map.location_failed': 'Could not get location. Opening standard map link.',
    'map.no_geolocation': 'Your browser does not support geolocation.',
    'map.resolving_coords': 'Resolving coordinates... ({current}/{total})',
    'map.loading_error': 'An error occurred while loading data.',
    'overlay.start_nav': 'Start Navigation',
    'overlay.share': 'Share',
    'overlay.link_copied': 'Link copied!',
    'overlay.type': 'Structure Type',
    'overlay.year': 'Construction Date',
    'overlay.location': 'Location',
    'overlay.history': 'Historical Information',
    'overlay.history_text': "This work is one of Mimar Sinan's important {type} structures in the {district} region.",
    'overlay.no_video': 'No Video Available',
    'overlay.no_image': 'Image Not Found',
    'works.explore': 'Explore Works',
    'works.video': 'Video',
    'works.subtitle': "Examine Mimar Sinan's surviving masterpieces.",
    'works.search_placeholder': 'Search by name, type, or district...',
    'works.inspect': 'Inspect',
    
    'landing.badge': 'Traces of Ottoman Architecture',
    'landing.title_p1': 'Immortal Works of',
    'landing.title_p2': 'Mimar Sinan',
    'landing.subtitle': "Discover the architectural heritage of Great Sinan, defying centuries and shaping a vast geography on the map.",
    'landing.cta': 'Start Exploring Works',
    
    'landing.f1.title': 'Mosques and Complexes',
    'landing.f1.desc': 'Examine the locations of Süleymaniye, Şehzade, and many other magnificent structures.',
    'landing.f2.title': 'Historic Aqueducts',
    'landing.f2.desc': 'Find the products of infrastructure genius like Mağlova and Güzelce Aqueducts on the map.',
    'landing.f3.title': 'Detailed Information',
    'landing.f3.desc': 'Access practical information like address, phone, and working hours with a single click.',
    
    'landing.c1.title': 'Feedback / Thanks',
    'landing.c1.desc': 'Let us know your thoughts about our project and what you would like to add. Contact us to send your thanks and suggestions.',
    'landing.c2.title': 'Add / Suggest a Place',
    'landing.c2.desc': "Tell us the works of Mimar Sinan you want to see on the map, let's grow this heritage together.",
    'landing.send_msg': 'Send Message',

    'about.title': 'About Us',
    'about.badge': 'About the Project',
    'about.p1': 'In the Footsteps of Mimar Sinan is a digital culture and exploration project that aims to bring together the surviving works of Mimar Sinan on a single map.',
    'about.p2': 'Our goal is to make Mimar Sinan’s architectural heritage, ranging from mosques to bridges, madrasas to bathhouses, more accessible to everyone. For each work on the map, we bring together location information, contact details if available, visiting hours, and video content where you can get to know the work closer. Thus, whether in your city or during your travels, you can easily discover Mimar Sinan’s works, get directions, and access reliable information about the structures.',
    'about.p3': 'This project aims to be a living archive. Therefore, the contributions of our users are of great importance to us. If you know a work of Mimar Sinan that is not on our site, if you noticed missing or outdated information, or if you want to share your thoughts about our project, you can contact us via e-mail.',
    'about.p4': 'Thanks to your suggestions and feedback, In the Footsteps of Mimar Sinan will continue to be a more comprehensive and useful resource every day.',
    'about.p5': 'Thank you for being with us on this journey we embarked on to discover Mimar Sinan’s unique architectural heritage together and pass it on to future generations.',
  }
};

// Simple dictionary for translating dynamic content (like names and types)
const dynamicTranslationsEn: Record<string, string> = {
  'Camii': 'Mosque',
  'Cami': 'Mosque',
  'Külliyesi': 'Complex',
  'Külliye': 'Complex',
  'Medresesi': 'Madrasa',
  'Medrese': 'Madrasa',
  'Hamamı': 'Bathhouse',
  'Hamam': 'Bathhouse',
  'Türbesi': 'Tomb',
  'Türbe': 'Tomb',
  'Köprüsü': 'Bridge',
  'Köprü': 'Bridge',
  'Su Kemeri': 'Aqueduct',
  'Kemeri': 'Aqueduct',
  'Kemer': 'Aqueduct',
  'Kervansarayı': 'Caravanserai',
  'Kervansaray': 'Caravanserai',
  'Darüşşifası': 'Hospital',
  'Darüşşifa': 'Hospital',
  'İmareti': 'Soup Kitchen',
  'İmaret': 'Soup Kitchen',
  'Sarayı': 'Palace',
  'Saray': 'Palace',
  'Mescidi': 'Masjid',
  'Mescid': 'Masjid',
  'Mescit': 'Masjid',
  'Tarihi Hastane': 'Historic Hospital',
  'Mahzen/Depo': 'Cellar/Storage',
  'Mahzeni': 'Cellar',
  'Mahzen': 'Cellar',
  'Deposu': 'Storage',
  'Depo': 'Storage',
  'Palace Bölümü': 'Palace Section',
  'Saray Bölümü': 'Palace Section',
  'Kültür Merkezi': 'Cultural Center',
  'Hanı': 'Inn',
  'Han': 'Inn',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const translateWorkField = (text: string | undefined, fieldType: 'name' | 'type'): string => {
    if (!text) return '';
    if (language === 'tr') return text;

    let translated = text;
    // Replace Turkish terms with English terms in names/types
    for (const [trTerm, enTerm] of Object.entries(dynamicTranslationsEn)) {
      const regex = new RegExp(`(^|\\s)${trTerm}(?=\\s|$|[.,;!?])`, 'gi');
      translated = translated.replace(regex, `$1${enTerm}`);
    }
    
    // For specific structure types if they are just the word itself
    if (fieldType === 'type') {
      const typeMap: Record<string, string> = {
        'cami': 'Mosque',
        'külliye': 'Complex',
        'medrese': 'Madrasa',
        'hamam': 'Bathhouse',
        'türbe': 'Tomb',
        'köprü': 'Bridge',
        'su kemeri': 'Aqueduct',
        'kervansaray': 'Caravanserai',
        'tarihi hastane': 'Historic Hospital',
        'mahzen/depo': 'Cellar/Storage',
        'mahzen / depo': 'Cellar/Storage',
        'palace bölümü': 'Palace Section',
        'saray bölümü': 'Palace Section',
        'kültür merkezi': 'Cultural Center',
        'han': 'Inn',
        'imaret': 'Soup Kitchen'
      };
      const lower = text.toLocaleLowerCase('tr-TR').trim();
      if (typeMap[lower]) {
        return typeMap[lower];
      }
    }

    return translated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateWorkField }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
