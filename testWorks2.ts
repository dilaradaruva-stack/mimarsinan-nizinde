import Papa from 'papaparse';
import { getImageForWork } from './src/services/imageMapping.ts';
import fs from 'fs';

async function fetchCsv(url: string) {
    const res = await fetch(url);
    const text = await res.text();
    return new Promise<any[]>((resolve) => {
        Papa.parse(text, { header: true, complete: (res) => resolve(res.data) });
    });
}

async function run() {
    const data1 = await fetchCsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRWf38Vkg27aMNgJE-fOFMzPLHD3eKgG1EYLrnDLcLE4MNuPHptx99XwLS-PZr8RaTSEaB2Q1f2eyi5/pub?output=csv");
    const data2 = await fetchCsv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQNJBh4bfWd-ruyCfaXrGKcNAPOnCEvQF5pllGlLoG7V1A8GgJUH3v49-IDYJG-cVV6o-CggCm0_uh9/pub?output=csv");
    const combined = [...data1, ...data2];
    
    for (const row of combined) {
        if (!row['Mekan Adı']) continue;
        const name = row['Mekan Adı'];
        const img = getImageForWork(name);
        if (img) {
            console.log(`[IMGUR] ${name} -> ${img}`);
        } else {
            console.log(`[WIKI OR MISSING] ${name}`);
        }
    }
}
run();
