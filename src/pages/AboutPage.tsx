import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center py-12 px-4 bg-[#F9F8F6] dark:bg-stone-900 transition-colors duration-200">
      <div className="max-w-3xl w-full space-y-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-stone-800 border border-[#D1D5DB] dark:border-stone-700 text-[#991B1B] dark:text-red-400 text-xs font-bold uppercase tracking-widest shadow-sm mb-2 transition-colors">
          <span className="w-2 h-2 rounded-sm bg-[#991B1B] dark:bg-red-500"></span>
          Bir Dehanın Portresi
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-tight transition-colors">
          Mimar Sinan
        </h1>

        <div className="max-w-none space-y-6 block border-t border-[#D1D5DB] dark:border-stone-700 pt-8 transition-colors">
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            Mimar Sinan, 1490-1588 yılları arasında yaşamış, Osmanlı İmparatorluğu'nun en parlak dönemlerine mimarbaşılık yaparak damga vurmuş bir dehadır. Kayseri’de başlayan hayat yolculuğu, Yeniçeri Ocağı’nda aldığı eğitim ve seferlerdeki mühendislik başarılarıyla birleşerek onu dünya tarihinin en büyük yapı ustalarından biri haline getirmiştir.
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            Sinan, yaklaşık 100 yıl süren ömrüne 400’den fazla eser sığdırmıştır. Kendi gelişimini Şehzade Camii’ni "çıraklık", Süleymaniye Camii’ni "kalfalık" ve Selimiye Camii’ni "ustalık" eseri olarak tanımlayarak özetlemiştir. Ancak onun başarısı sadece görkemli camilerle sınırlı değildir; su kemerleri, köprüler, hamamlar ve medreseler inşa ederek imparatorluğun altyapısını da modernleştirmiştir.
          </p>
          <p className="text-lg text-gray-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
            Onun mimarisi; matematiğin estetikle, akustiğin dayanıklılıkla buluştuğu bir zirvedir. Yüzyıllar geçmesine rağmen eserlerinin hala dimdik ayakta olması ve İstanbul’un silüetini belirlemesi, Sinan’ın sadece bir mimar değil, aynı zamanda ileri görüşlü bir mühendis ve sanatçı olduğunun en büyük kanıtıdır. Bu proje, onun İstanbul’a bıraktığı bu eşsiz mirası dijital dünyada yeniden keşfetmeyi amaçlamaktadır.
          </p>
        </div>

      </div>
    </div>
  );
}
