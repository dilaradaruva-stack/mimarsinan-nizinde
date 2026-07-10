const mapping = {
  'Ahi Çelebi Cami': 'https://i.imgur.com/75fMSoO.jpg',
  'Alpullu (Sinanlı) Köprüsü': 'https://i.imgur.com/GKtW62z.jpg',
  'Atik Valide Hamamı': 'https://i.imgur.com/tbljFQK.jpg',
  'Atik Valide İmareti': 'https://i.imgur.com/Gcj93hB.jpg',
  'Banya Başı Camii': 'https://i.imgur.com/4t1bvvU.jpg',
  'Barbaros Türbesi': 'https://i.imgur.com/Ytq3DsJ.jpg',
  'Bosnalı Mehmed Paşa Camii': 'https://i.imgur.com/WooqjNS.jpg',
  'Büyükçekmece Köprüsü': 'https://i.imgur.com/4XcqmBH.jpg',
  'Cafer Ağa Medresesi': 'https://i.imgur.com/dGzbRfI.jpg',
  'Cedid Ali Paşa Camii': 'https://i.imgur.com/lC8VUI0.jpg',
  'Defterdar Mahmut Çelebi Camii': 'https://i.imgur.com/XJbQkbA.jpg',
  'Eğri Kemer': 'https://i.imgur.com/YtrTiFg.jpg',
  'Ekmekçizade Ahmet Paşa Kervansarayı': 'https://i.imgur.com/DtMoGuP.jpg',
  'Fatma Sultan Türbesi': 'https://i.imgur.com/o3qE4pZ.jpg',
  'Gazi İskender Paşa Camii': 'https://i.imgur.com/0mHyswb.jpg',
  'Güzelce Kemer': 'https://i.imgur.com/6sQu2HJ.jpg',
  'Haseki Sultan Darüşşifası': 'https://i.imgur.com/m00ER3Z.jpg',
  'Hüsrev Paşa Medresesi': 'https://i.imgur.com/lO0OurG.jpg',
  'II. Selim Türbesi': 'https://i.imgur.com/yhlWLLc.jpg',
  '2. Selim Türbesi': 'https://i.imgur.com/yhlWLLc.jpg',
  'Ivaz Efendi Cami': 'https://i.imgur.com/MQ0PkZG.jpg',
  'Ivaz Efendi Camii': 'https://i.imgur.com/MQ0PkZG.jpg',
  'Kadırga Sokollu Medresesi': 'https://i.imgur.com/gu0KkRG.jpg',
  'Kadırga Sokollu Mehmet Paşa Camii': 'https://i.imgur.com/d4uZ96U.jpg',
  'Kadırga Sokollu Mehmed Paşa Camii': 'https://i.imgur.com/d4uZ96U.jpg',
  'Sokollu Mehmed Paşa Camii (Kadırga)': 'https://i.imgur.com/d4uZ96U.jpg',
  'Kapıağası (Haramidere) Köprüsü': 'https://i.imgur.com/DiBAJGc.jpg',
  'Kılıç Ali Paşa Türbesi': 'https://i.imgur.com/KLHrd9t.jpg',
  'Kırık Kemer': 'https://i.imgur.com/3WPzGEV.jpg',
  'Kurşunlu Han': 'https://i.imgur.com/zS8AG2K.jpg',
  'Kurşunlu Han (Galata)': 'https://i.imgur.com/zS8AG2K.jpg',
  'Lala Mustafa Paşa Camii': 'https://i.imgur.com/S0fhwBU.jpg',
  'Mimar Sinan Türbesi': 'https://i.imgur.com/juetBVw.jpg',
  'Mihrimah Sultan Medresesi': 'https://i.imgur.com/zKgXTwR.jpg',
  'Pertev Paşa Camii': 'https://i.imgur.com/YnYfpT0.jpg',
  'Pertev Paşa Camii (Yeni Cuma)': 'https://i.imgur.com/YnYfpT0.jpg',
  'Rüstem Paşa Kervansarayı (Ereğli)': 'https://i.imgur.com/f02osYW.jpg',
  'Rüstem Paşa Medresesi': 'https://i.imgur.com/LaMIZZg.jpg',
  'Rüstem Paşa Türbesi': 'https://i.imgur.com/OSqhI4J.jpg',
  'Semiz Ali Paşa Medresesi': 'https://i.imgur.com/cXlrtCZ.jpg',
  'Silivri (Mimar Sinan) Köprüsü': 'https://i.imgur.com/iKi4emx.jpg',
  'Silivri Köprüsü': 'https://i.imgur.com/iKi4emx.jpg',
  'Sinan Paşa Cami': 'https://i.imgur.com/jyStFx9.jpg',
  'Sinan Paşa Camii': 'https://i.imgur.com/jyStFx9.jpg',
  'Siyavuş Paşa Türbesi': 'https://i.imgur.com/CnQxxZG.jpg',
  'Sokollu Mehmed Paşa Camii (Azapkapı)': 'https://i.imgur.com/q6TY5pj.jpg',
  'Sokollu Mehmed Paşa Camii (Fatih)': 'https://i.imgur.com/xbBzRCk.jpg',
  'Sokollu Mehmed Paşa Hamamı': 'https://i.imgur.com/kehCo3Q.jpg',
  'Sokollu Mehmed Paşa Hamamı (Edirne)': 'https://i.imgur.com/kehCo3Q.jpg',
  'Sokollu Mehmed Paşa Kervansarayı': 'https://i.imgur.com/BtCmXNT.jpg',
  'Drina Köprüsü': 'https://i.imgur.com/rhQYN6N.jpg',
  'Sokollu Mehmed Paşa Köprüsü (Drina Köprüsü)': 'https://i.imgur.com/rhQYN6N.jpg',
  'Sultan Süleyman Türbesi': 'https://i.imgur.com/ehHVzSh.jpg',
  'Süleymaniye Darüşşifası': 'https://i.imgur.com/YOFMPIM.jpg',
  'Süleymaniye Tıp Medresesi': 'https://i.imgur.com/nlwpgXw.jpg',
  'Şah Huban Hatun Türbesi': 'https://i.imgur.com/75mZtaq.jpg',
  'Şehzade Cihangir Cami': 'https://i.imgur.com/C2YN1Dw.jpg',
  'Şehzade Mehmet Türbesi': 'https://i.imgur.com/fByRevk.jpg',
  'Tekirdağ Rüstem Paşa Camii': 'https://i.imgur.com/4KWRmID.jpg',
  'Rüstem Paşa Camii (Tekirdağ)': 'https://i.imgur.com/4KWRmID.jpg',
  'Topkapı Mutfakları': 'https://i.imgur.com/5nlyexW.jpg',
  'Uzun Kemer': 'https://i.imgur.com/HC6DpM4.jpg',
  'Yahya Efendi Medresesi': 'https://i.imgur.com/L78zxek.jpg',
  'Zal Mahmut Paşa Külliyesi': 'https://i.imgur.com/O1E6iUs.jpg',
  'Şehzade Cihangir Cami  ': 'https://i.imgur.com/C2YN1Dw.jpg'
};

const code = `export const imageMapping: Record<string, string> = ${JSON.stringify(mapping, null, 2)};

export function getImageForWork(name: string): string | undefined {
  if (!name) return undefined;

  const normalizedName = name.toLocaleLowerCase('tr-TR').trim();

  if (imageMapping[name]) return imageMapping[name];
  
  // Try case insensitive exact match
  const match = Object.keys(imageMapping).find(k => k.toLocaleLowerCase('tr-TR').trim() === normalizedName);
  if (match) return imageMapping[match];
  
  return undefined;
}
`;

require('fs').writeFileSync('src/services/imageMapping.ts', code);
