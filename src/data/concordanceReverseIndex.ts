import { CONCORDANCE_REFERENCES } from './concordanceData';
import { normalizeVachnamrutCode, getVachnamrutEntry, VachnamrutQuote } from './vachnamrutService';
import { getSwaminiVat } from './swaminiVatoService';

export interface VachnamrutConcordanceItem {
  code: string;
  prefix: string;
  vachNo: number;
  order: number;
  sectionGu: string;
  sectionHi: string;
  sectionEn: string;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  quotes: VachnamrutQuote[];
  relatedShlokaIds: number[];
}

export interface SwaminiVatoConcordanceItem {
  key: string;
  prakaran: number;
  vatoNo: number;
  order: number;
  sectionGu: string;
  sectionHi: string;
  sectionEn: string;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  topicGu: string;
  topicHi: string;
  topicEn: string;
  textGu: string;
  textHi: string;
  textEn: string;
  anirdeshUrl: string;
  relatedShlokaIds: number[];
}

export interface VachnamrutSectionMeta {
  prefix: string;
  nameGu: string;
  nameHi: string;
  nameEn: string;
  count: number;
}

const SECTION_ORDER: Record<string, { order: number; gu: string; hi: string; en: string }> = {
  GI: { order: 1, gu: 'ગઢડા પ્રથમ', hi: 'गढडा प्रथम', en: 'Gadhada I' },
  Sar: { order: 2, gu: 'સારંગપુર', hi: 'सारंगपुर', en: 'Sarangpur' },
  Kar: { order: 3, gu: 'કારિયાણી', hi: 'कारियाणी', en: 'Kariyani' },
  Loya: { order: 4, gu: 'લોયા', hi: 'लोया', en: 'Loya' },
  Pan: { order: 5, gu: 'પંચાળા', hi: 'पंचाल', en: 'Panchala' },
  GII: { order: 6, gu: 'ગઢડા મધ્ય', hi: 'गढडा मध्य', en: 'Gadhada II' },
  Var: { order: 7, gu: 'વરતાલ', hi: 'वरताल', en: 'Vartal' },
  Amd: { order: 8, gu: 'અમદાવાદ', hi: 'अहमदाबाद', en: 'Amdavad' },
  GIII: { order: 9, gu: 'ગઢડા અંત્ય', hi: 'गढडा अंत्य', en: 'Gadhada III' },
  Jetalpur: { order: 10, gu: 'જેતલપુર', hi: 'जेतलपुर', en: 'Jetalpur' },
  Ashlali: { order: 11, gu: 'અશ્લાલી', hi: 'अश्लाली', en: 'Ashlali' }
};

let cachedVachnamrutList: VachnamrutConcordanceItem[] | null = null;
let cachedSwaminiVatoList: SwaminiVatoConcordanceItem[] | null = null;

export function getVachnamrutConcordanceList(): VachnamrutConcordanceItem[] {
  if (cachedVachnamrutList) return cachedVachnamrutList;

  const vachMap = new Map<string, VachnamrutConcordanceItem>();

  for (const [shlokaStr, refs] of Object.entries(CONCORDANCE_REFERENCES)) {
    const shlokaId = parseInt(shlokaStr, 10);
    if (isNaN(shlokaId)) continue;

    for (const r of (refs as any[])) {
      if (r.type === 'vachnamrut') {
        const code = normalizeVachnamrutCode(r.section);
        if (code) {
          if (!vachMap.has(code)) {
            const entry = getVachnamrutEntry(code);
            const parts = code.split('-');
            const prefix = parts[0];
            const vachNo = parseInt(parts[1] || '0', 10);
            const meta = SECTION_ORDER[prefix] || { order: 99, gu: prefix, hi: prefix, en: prefix };
            const order = meta.order * 1000 + vachNo;

            vachMap.set(code, {
              code,
              prefix,
              vachNo,
              order,
              sectionGu: entry?.sectionGu || meta.gu + ` ${vachNo}`,
              sectionHi: entry?.sectionHi || meta.hi + ` ${vachNo}`,
              sectionEn: entry?.sectionEn || meta.en + ` ${vachNo}`,
              titleGu: entry?.titleGu || r.titleGu || '',
              titleHi: entry?.titleHi || r.titleHi || '',
              titleEn: entry?.titleEn || r.titleEn || '',
              quotes: entry?.quotes || [],
              relatedShlokaIds: []
            });
          }
          const item = vachMap.get(code)!;
          if (!item.relatedShlokaIds.includes(shlokaId)) {
            item.relatedShlokaIds.push(shlokaId);
          }
        }
      }
    }
  }

  // Sort shloka IDs ascending in each Vachnamrut
  for (const item of vachMap.values()) {
    item.relatedShlokaIds.sort((a, b) => a - b);
  }

  cachedVachnamrutList = Array.from(vachMap.values()).sort((a, b) => a.order - b.order);
  return cachedVachnamrutList;
}

export function getSwaminiVatoConcordanceList(): SwaminiVatoConcordanceItem[] {
  if (cachedSwaminiVatoList) return cachedSwaminiVatoList;

  const swamiMap = new Map<string, SwaminiVatoConcordanceItem>();

  for (const [shlokaStr, refs] of Object.entries(CONCORDANCE_REFERENCES)) {
    const shlokaId = parseInt(shlokaStr, 10);
    if (isNaN(shlokaId)) continue;

    for (const r of (refs as any[])) {
      if (r.type === 'swamini_vato') {
        const p = r.prakaran || 0;
        const n = r.vatoNo || 0;
        const key = `${p}/${n}`;

        if (!swamiMap.has(key)) {
          const vatEntry = getSwaminiVat(key);
          const order = p * 10000 + n;

          swamiMap.set(key, {
            key,
            prakaran: p,
            vatoNo: n,
            order,
            sectionGu: r.section || `પ્રકરણ ${p}/${n}`,
            sectionHi: r.sectionHi || `प्रकरण ${p}/${n}`,
            sectionEn: r.sectionEn || `Prakaran ${p}/${n}`,
            titleGu: r.titleGu || r.title || `સ્વામીની વાતો ${p}/${n}`,
            titleHi: r.titleHi || r.title || `स्वामीनी बातें ${p}/${n}`,
            titleEn: r.titleEn || r.title || `Swamini Vato ${p}/${n}`,
            topicGu: r.topicGu || r.topic || '',
            topicHi: r.topicHi || r.topic || '',
            topicEn: r.topicEn || r.topic || '',
            textGu: vatEntry?.textGu || r.textGu || '',
            textHi: r.textHi || '',
            textEn: vatEntry?.textEn || r.textEn || '',
            anirdeshUrl: r.anirdeshUrl || `https://anirdesh.com/vato/index.php?prakaran=${p}&no=${n}`,
            relatedShlokaIds: []
          });
        }
        const item = swamiMap.get(key)!;
        if (!item.relatedShlokaIds.includes(shlokaId)) {
          item.relatedShlokaIds.push(shlokaId);
        }
      }
    }
  }

  // Sort shloka IDs ascending in each Swamini Vato
  for (const item of swamiMap.values()) {
    item.relatedShlokaIds.sort((a, b) => a - b);
  }

  cachedSwaminiVatoList = Array.from(swamiMap.values()).sort((a, b) => a.order - b.order);
  return cachedSwaminiVatoList;
}

export function getVachnamrutSectionsMeta(): VachnamrutSectionMeta[] {
  const list = getVachnamrutConcordanceList();
  const metaMap = new Map<string, VachnamrutSectionMeta>();

  for (const item of list) {
    const info = SECTION_ORDER[item.prefix] || { order: 99, gu: item.prefix, hi: item.prefix, en: item.prefix };
    if (!metaMap.has(item.prefix)) {
      metaMap.set(item.prefix, {
        prefix: item.prefix,
        nameGu: info.gu,
        nameHi: info.hi,
        nameEn: info.en,
        count: 0
      });
    }
    metaMap.get(item.prefix)!.count++;
  }

  return Array.from(metaMap.values()).sort((a, b) => {
    const orderA = SECTION_ORDER[a.prefix]?.order || 99;
    const orderB = SECTION_ORDER[b.prefix]?.order || 99;
    return orderA - orderB;
  });
}
