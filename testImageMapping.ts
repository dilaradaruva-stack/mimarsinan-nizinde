import { imageMapping, getImageForWork } from './src/services/imageMapping.ts';
import fs from 'fs';

const works = [
  "Ahi Çelebi Cami", "Alpullu (Sinanlı) Köprüsü", "Atik Valide Hamamı", "Atik Valide İmareti",
  "Banya Başı Camii", "Barbaros Türbesi", "Bosnalı Mehmed Paşa Camii", "Büyükçekmece Köprüsü",
  "Cafer Ağa Medresesi", "Cedid Ali Paşa Camii", "Defterdar Mahmut Çelebi Camii", "Eğri Kemer",
  "Ekmekçizade Ahmet Paşa Kervansarayı", "Fatma Sultan Türbesi", "Gazi İskender Paşa Camii",
  "Güzelce Kemer", "Haseki Sultan Darüşşifası", "Hüsrev Paşa Medresesi", "II. Selim Türbesi",
  "Ivaz Efendi Cami", "Kadırga Sokollu Medresesi", "Kadırga Sokollu Mehmet Paşa Camii",
  "Kapıağası (Haramidere) Köprüsü", "Kılıç Ali Paşa Türbesi", "Kırık Kemer", "Kurşunlu Han",
  "Lala Mustafa Paşa Camii", "Mimar Sinan Türbesi", "Mihrimah Sultan Medresesi", "Pertev Paşa Camii",
  "Rüstem Paşa Kervansarayı (Ereğli)", "Rüstem Paşa Medresesi", "Rüstem Paşa Türbesi",
  "Semiz Ali Paşa Medresesi", "Silivri Köprüsü", "Sinan Paşa Cami", "Siyavuş Paşa Türbesi",
  "Sokollu Mehmed Paşa Camii (Azapkapı)", "Sokollu Mehmed Paşa Camii (Fatih)",
  "Sokollu Mehmed Paşa Hamamı", "Sokollu Mehmed Paşa Kervansarayı", "Drina Köprüsü",
  "Sultan Süleyman Türbesi", "Süleymaniye Darüşşifası", "Süleymaniye Tıp Medresesi",
  "Şah Huban Hatun Türbesi", "Şehzade Cihangir Cami", "Şehzade Mehmet Türbesi",
  "Tekirdağ Rüstem Paşa Camii", "Topkapı Mutfakları", "Uzun Kemer", "Yahya Efendi Medresesi",
  "Zal Mahmut Paşa Külliyesi"
];

for (const w of works) {
    const img = getImageForWork(w);
    if (!img) {
        console.log("NOT FOUND:", w);
    }
}
