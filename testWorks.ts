import { fetchWorks } from './src/services/dataService.ts';
import { getImageForWork } from './src/services/imageMapping.ts';

async function run() {
    const works = await fetchWorks(() => {});
    for (const w of works) {
        const img = getImageForWork(w.name);
        console.log(`Work: ${w.name} -> Image: ${img ? 'YES (IMGUR)' : 'NO'}`);
    }
}
run();
