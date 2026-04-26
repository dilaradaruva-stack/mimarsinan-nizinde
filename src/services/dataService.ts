import Papa from 'papaparse';
import { Work } from '../types';

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvQE_iCLn_t17_pPsZRbQBUFkos0t5uo6c3hdR3I7Mol7dkO-ISnKLeR0pm8lRDTVZQbUDYJCuB3s8/pub?gid=0&single=true&output=csv";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWorks(onProgress?: (current: number, total: number) => void): Promise<Work[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(DATA_URL, {
      download: true,
      header: true,
      complete: async (results) => {
        const works = results.data
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
        
        try {
          const geocodedWorks = await geocodeWorks(works, onProgress);
          resolve(geocodedWorks);
        } catch (error) {
          reject(error);
        }
      },
      error: reject
    });
  });
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
    
    if (hardcodedCoords[work.name]) {
        if (onProgress) onProgress(i + 1, total);
        result.push({ ...work, ...hardcodedCoords[work.name] });
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
          'User-Agent': 'MimarSinanMapApp/1.1 (dilaradaruva@gmail.com)'
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
          headers: { 'User-Agent': 'MimarSinanMapApp/1.1 (dilaradaruva@gmail.com)' }
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
