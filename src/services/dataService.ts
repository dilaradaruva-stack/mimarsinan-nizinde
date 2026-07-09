import Papa from 'papaparse';
import { Work } from '../types';

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWf38Vkg27aMNgJE-fOFMzPLHD3eKgG1EYLrnDLcLE4MNuPHptx99XwLS-PZr8RaTSEaB2Q1f2eyi5/pub?output=csv";
const NEW_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQNJBh4bfWd-ruyCfaXrGKcNAPOnCEvQF5pllGlLoG7V1A8GgJUH3v49-IDYJG-cVV6o-CggCm0_uh9/pub?output=csv";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let globalWorksCache: Work[] | null = null;
let globalFetchPromise: Promise<Work[]> | null = null;

const fetchCsv = (url: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: reject
    });
  });
};

export async function fetchWorks(onProgress?: (current: number, total: number) => void): Promise<Work[]> {
  if (globalWorksCache) {
    return globalWorksCache;
  }
  
  if (!globalFetchPromise) {
    globalFetchPromise = (async () => {
      try {
        const [data1, data2] = await Promise.all([
          fetchCsv(DATA_URL),
          fetchCsv(NEW_DATA_URL)
        ]);
        
        const combinedData = [...data1, ...data2];
        
        let works = combinedData
          .filter((row: any) => row['Mekan Adı'] && row['İlçe / Şehir'])
          .map((row: any) => ({
            name: row['Mekan Adı'],
            type: row['Mekan Türü'],
            district: row['İlçe / Şehir'],
            year: row['Açılış Yılı'],
            address: row['Adres'],
            phone: row['Telefon'],
            hours: row['Çalışma Saatleri'],
            youtube: row['YouTube Videosu'],
            mapsUrl: row['Yol Tarifi (Harita)']
          }));
        
        works = works.filter((w: any) => !(w.name === 'Kılıç Ali Paşa Hamamı' && w.hours && w.hours.includes('23:30')));

        const geocodedWorks = await geocodeWorks(works, onProgress);
        return geocodedWorks;
      } catch (error) {
        throw error;
      }
    })();
  }

  try {
    const result = await globalFetchPromise;
    globalWorksCache = result;
    return result;
  } catch (err) {
    globalFetchPromise = null;
    throw err;
  }
}

async function geocodeWorks(works: Work[], onProgress?: (current: number, total: number) => void): Promise<Work[]> {
  const cacheKey = 'mimar_sinan_geocode_cache_v3';
  const cacheStr = localStorage.getItem(cacheKey);
  const cache: Record<string, {lat: number, lng: number}> = cacheStr ? JSON.parse(cacheStr) : {};
  let cacheUpdated = false;

  const result: Work[] = [];
  const total = works.length;

  const hardcodedCoords: Record<string, {lat: number, lng: number}> = {
    'Mesih Mehmed Paşa': { lat: 41.0202, lng: 28.9419 },
    'Sinan Paşa Camii': { lat: 41.0425, lng: 29.0044 },
    'Bali Paşa Camii': { lat: 41.0163, lng: 28.9392 },
    'Ivaz Efendi Camii': { lat: 41.0366, lng: 28.9402 },
    'Muradiye Külliyesi': { lat: 38.6144, lng: 27.4336 },
    'Lala Mustafa Paşa': { lat: 39.9079, lng: 41.2721 },
    'Tekirdağ Rüstem Paşa': { lat: 40.9785, lng: 27.5137 },
    'Büyükçekmece Köprüsü': { lat: 41.0232, lng: 28.5724 },
    'Drina Köprüsü': { lat: 43.7825, lng: 19.2882 },
    'Çoban Mustafa Paşa': { lat: 40.8034, lng: 29.4312 },
    'Hadım İbrahim Paşa': { lat: 41.0069, lng: 28.9247 }, // typically in Silivrikapi
    'Kara Ahmed Paşa': { lat: 41.0208, lng: 28.9284 }, // Topkapi
    'Rüstem Paşa Medresesi': { lat: 41.0125, lng: 28.9691 },
    'Cafer Ağa Medresesi': { lat: 41.0090, lng: 28.9796 },
    'Semiz Ali Paşa Medresesi': { lat: 41.0181, lng: 28.9376 },
    'Sultan Süleyman Türbesi': { lat: 41.0163, lng: 28.9644 },
    'Hürrem Sultan Türbesi': { lat: 41.0160, lng: 28.9645 },
    'Şehzade Mehmet Türbesi': { lat: 41.0139, lng: 28.9575 },
    'Banya Başı Camii': { lat: 42.6995, lng: 23.3225 },
    'Mustafa Paşa Köprüsü': { lat: 41.7694, lng: 26.1963 },
    'Alpullu (Sinanlı) Köprüsü': { lat: 41.3653, lng: 27.1517 },
    'Silivri (Mimar Sinan) Köprüsü': { lat: 41.0729, lng: 28.2435 },
    'Kanuni Sultan Süleyman Köprüsü': { lat: 41.0232, lng: 28.5724 },
    'Cedid Ali Paşa Camii': { lat: 41.4300, lng: 27.0933 },
    'Pertev Paşa Camii': { lat: 40.7634, lng: 29.9392 },
    'Defterdar Mahmut Çelebi Camii': { lat: 41.0425, lng: 28.9328 },
    'Gazi İskender Paşa Camii': { lat: 41.1158, lng: 29.0881 },
    'Kadırga Sokollu Medresesi': { lat: 41.0048, lng: 28.9721 },
    'Mihrimah Sultan Medresesi': { lat: 41.0269, lng: 29.0158 },
    'Hüsrev Paşa Medresesi': { lat: 38.4891, lng: 43.3400 },
    'Süleymaniye Darülhadis': { lat: 41.0161, lng: 28.9632 },
    'Süleymaniye Tıp': { lat: 41.0159, lng: 28.9620 },
    'Süleymaniye Darüşşifası': { lat: 41.0154, lng: 28.9616 },
    'Haseki Sultan Darüşşifası': { lat: 41.0094, lng: 28.9405 },
    'Atik Valide Darüşşifası': { lat: 41.0183, lng: 29.0227 },
    'Kurşunlu Han (Galata)': { lat: 41.0232, lng: 28.9744 },
    'Rüstem Paşa Kervansarayı (Ereğli)': { lat: 37.5147, lng: 34.0536 },
    'Ekmekçizade Ahmet Paşa Kervansarayı': { lat: 41.6744, lng: 26.5621 },
    'Siyavuş Paşa Türbesi': { lat: 41.0478, lng: 28.9344 },
    'Rüstem Paşa Türbesi': { lat: 41.0145, lng: 28.9610 },
    'Hüsrev Paşa Türbesi': { lat: 41.0203, lng: 28.9515 },
    'Şah Huban Hatun Türbesi': { lat: 41.0242, lng: 28.9328 },
    'Kılıç Ali Paşa Türbesi': { lat: 41.0267, lng: 28.9806 },
    'Pertev Paşa Türbesi': { lat: 41.0450, lng: 28.9333 },
    'Kılıç Ali Paşa Hamamı': { lat: 41.0264, lng: 28.9809 },
    'Çemberlitaş Hamamı': { lat: 41.0084, lng: 28.9715 },
    'Ortaköy Hamamı': { lat: 41.0478, lng: 29.0264 },
    'Bosnalı Mehmed Paşa Camii': { lat: 42.6995, lng: 23.3225 }, // Uses Banya Bashi or same coords broadly
    'Behram Paşa Camii': { lat: 37.9095, lng: 40.2375 },
    'Melek Ahmed Paşa Camii': { lat: 37.9130, lng: 40.2325 },
    'Kurt Çelebi Camii': { lat: 41.0339, lng: 28.9772 },
    'Dramman Yunus Bey Camii': { lat: 41.0264, lng: 28.9431 },
    'Tophane (Kurşunlu) Mahzeni': { lat: 41.0261, lng: 28.9818 },
    'Atik Valide İmareti': { lat: 41.0183, lng: 29.0227 },
    'Kapıağası (Haramidere) Köprüsü': { lat: 41.0125, lng: 28.6750 },
    'Arslanağa Köprüsü': { lat: 42.7142, lng: 18.3541 },
    'Süleymaniye Rabi Medresesi': { lat: 41.0161, lng: 28.9632 },
    'Nişancı Mehmed Bey Medresesi': { lat: 41.0180, lng: 28.9427 },
    'Yahya Efendi Medresesi': { lat: 41.0478, lng: 29.0116 },
    'Fatma Sultan Türbesi': { lat: 41.0159, lng: 28.9644 },
    'Zeyrek Çinili Hamam': { lat: 41.0205, lng: 28.9567 },
    'Süleymaniye Hamamı': { lat: 41.0163, lng: 28.9634 },
    'Rüstem Paşa Hamamı': { lat: 40.6908, lng: 30.2647 },
    'Yedikule Hacı Evliya Hamamı': { lat: 40.9996, lng: 28.9234 },
    'Nişancı Paşa Hamamı': { lat: 41.0200, lng: 28.9430 },
    'Atik Valide Hamamı': { lat: 41.0185, lng: 29.0220 },
    'Ferruh Kethüda Camii': { lat: 41.0349, lng: 28.9448 },
    'Şehzade Cihangir Cami': { lat: 41.0305, lng: 28.9863 },
    'Ahi Çelebi Cami': { lat: 41.0189, lng: 28.9620 },
    'Ebulfazl Camii': { lat: 41.0315, lng: 28.9814 },
    'Şah Sultan Camii': { lat: 41.0416, lng: 28.9348 },
    'Semiz Ali Paşa Med.': { lat: 41.0181, lng: 28.9376 },
    'Sultan Süleyman Türb.': { lat: 41.0163, lng: 28.9644 },
    'Hürrem Sultan Türb.': { lat: 41.0160, lng: 28.9645 },
    'II. Selim Türbesi': { lat: 41.0080, lng: 28.9800 },
    'Şehzade Mehmet Türb.': { lat: 41.0139, lng: 28.9575 },
    'Barbaros Türbesi': { lat: 41.0423, lng: 29.0062 },
    'Topkapı Mutfakları': { lat: 41.0115, lng: 28.9833 },
    'Eğri Kemer': { lat: 41.1444, lng: 28.8953 },
    'Uzun Kemer': { lat: 41.1643, lng: 28.9189 },
    'Kırık Kemer': { lat: 41.1711, lng: 28.9482 },
    'Mimar Sinan Türbesi': { lat: 41.0167, lng: 28.9631 },
    'Zal Mahmut Paşa': { lat: 41.0435, lng: 28.9348 },
    'Şemsi Paşa Camii': { lat: 41.0264, lng: 29.0116 },
    'Süleymaniye Camii': { lat: 41.0161, lng: 28.9639 },
    'Selimiye Camii': { lat: 41.6780, lng: 26.5594 },
    'Şehzade Camii': { lat: 41.0135, lng: 28.9573 },
    'Mihrimah Sultan Camii': { lat: 41.0268, lng: 29.0159 },
    'Rüstem Paşa Camii': { lat: 41.0177, lng: 28.9687 },
    'Kılıç Ali Paşa Camii': { lat: 41.0265, lng: 28.9811 },
    'Mağlova Kemeri': { lat: 41.1394, lng: 28.8967 },
    'Güzelce Kemer': { lat: 41.1517, lng: 28.8878 },
    'Sokollu Mehmed Paşa': { lat: 41.0047, lng: 28.9722 },
    'Atik Valide Camii': { lat: 41.0189, lng: 29.0232 },
    'Haseki Hamamı': { lat: 41.0083, lng: 28.9772 },
    'Piyale Paşa Camii': { lat: 41.0439, lng: 28.9633 },
    'Molla Çelebi Camii': { lat: 41.0315, lng: 28.9897 },
  };
  
  for (let i = 0; i < total; i++) {
    const work = works[i];
    
    const hardcodedKey = Object.keys(hardcodedCoords).find(k => work.name.includes(k) || k.includes(work.name));
    if (hardcodedKey) {
        if (onProgress) onProgress(i + 1, total);
        result.push({ ...work, ...hardcodedCoords[hardcodedKey] });
        continue;
    }

    let query = "";
    if (work.name.includes('Drina')) {
        query = 'Mehmed Paša Sokolović Bridge, Višegrad, Bosnia and Herzegovina';
    } else if (work.name.includes('Büyükçekmece Köprüsü')) {
        query = 'Kanuni Sultan Süleyman Köprüsü, Istanbul, Turkey';
    } else if (work.name.includes('Güzelce') && work.name.includes('Kemer')) {
        query = 'Güzelce Kemer, Istanbul, Turkey';
    } else if (work.name.includes('Kemeri') || work.name.includes('Kemer')) {
        const dist = work.district.split('/')[0].trim();
        query = `${work.name}, ${dist}, Istanbul, Turkey`;
    } else {
        const parts = work.district.split('/').map(p => p.trim());
        let cityOrCountry = parts[parts.length - 1];
        let sub = parts.length > 1 ? parts[0] : "";
        if (cityOrCountry === 'İst.') cityOrCountry = 'Istanbul';
        
        query = `${work.name}`;
        if (sub && sub !== 'Merkez') query += `, ${sub}`;
        query += `, ${cityOrCountry}`;
        if (cityOrCountry !== 'Bosna Hersek' && !cityOrCountry.includes('Bosna')) {
            query += `, Turkey`;
        }
    }

    if (onProgress) {
       onProgress(i + 1, total);
    }
    
    if (cache[query]) {
      result.push({ ...work, ...cache[query] });
      continue;
    }

    try {
      const q = encodeURIComponent(query);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`, {
        headers: {
          'User-Agent': 'MimarSinanMapApp/1.1 (mimarsinaninizindee@gmail.com)'
        }
      });
      
      const data = await res.json();
      
      if (data && data.length > 0) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        cache[query] = coords;
        result.push({ ...work, ...coords });
        cacheUpdated = true;
      } else {
        await sleep(1000); // Prevent throwing 429 Too Many Requests if first one fails
        // Fallback for missing exact match
        const retryQuery = `${work.name}, Turkey`;
        const retryRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(retryQuery)}&limit=1`, {
          headers: { 'User-Agent': 'MimarSinanMapApp/1.1 (mimarsinaninizindee@gmail.com)' }
        });
        const retryData = await retryRes.json();
        
        if (retryData && retryData.length > 0) {
           const coords = { lat: parseFloat(retryData[0].lat), lng: parseFloat(retryData[0].lon) };
           cache[query] = coords; 
           result.push({ ...work, ...coords });
           cacheUpdated = true;
        } else {
           result.push(work);
        }
      }
      
      // Nominatim requires 1 req/sec average
      await sleep(1000);
    } catch (e) {
      console.error('Geocoding failed for', query, e);
      result.push(work);
    }
  }

  if (cacheUpdated) {
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  }

  return result.filter(w => w.lat && w.lng);
}
