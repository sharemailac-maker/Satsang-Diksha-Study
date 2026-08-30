const fs = require('fs');
const path = require('path');
const { normalizeToDevanagari, devanagariToGujarati, devanagariToIast } = require('./helpers.cjs');

const { raw1_50 } = require('./data_1_50.cjs');
const { raw51_100 } = require('./data_51_100.cjs');
const { raw101_150 } = require('./data_101_150.cjs');
const { raw151_200 } = require('./data_151_200.cjs');
const { raw201_250 } = require('./data_201_250.cjs');
const { raw251_300 } = require('./data_251_300.cjs');
const { raw301_315 } = require('./data_301_315.cjs');

const allRaw = [
  ...raw1_50,
  ...raw51_100,
  ...raw101_150,
  ...raw151_200,
  ...raw201_250,
  ...raw251_300,
  ...raw301_315
];

console.log(`Total shlokas loaded: ${allRaw.length}`);

// Verify IDs are consecutive 1 to 315
for (let i = 0; i < allRaw.length; i++) {
  const expectedId = i + 1;
  if (allRaw[i].id !== expectedId) {
    console.error(`Mismatch at index ${i}: expected ID ${expectedId}, got ${allRaw[i].id}`);
  }
}

const chapterRanges = [
  { id: 1, range: [1, 4] },
  { id: 2, range: [5, 17] },
  { id: 3, range: [18, 44] },
  { id: 4, range: [45, 76] },
  { id: 5, range: [77, 115] },
  { id: 6, range: [116, 160] },
  { id: 7, range: [161, 200] },
  { id: 8, range: [201, 250] },
  { id: 9, range: [251, 290] },
  { id: 10, range: [291, 315] }
];

function getChapterIdForShloka(shlokaId) {
  for (const c of chapterRanges) {
    if (shlokaId >= c.range[0] && shlokaId <= c.range[1]) {
      return c.id;
    }
  }
  return 10;
}

const chapterMetadata = {
  1: { gu: "પ્રસ્તાવના અને મંગલાચરણ", hi: "प्रस्तावना एवं मंगलाचरण", en: "Introduction & Auspicious Invocation" },
  2: { gu: "શાસ્ત્ર નિર્માણ હેતુ અને સ્વરૂપ", hi: "शास्त्र निर्माण हेतु एवं स्वरूप", en: "Purpose and Nature of the Scripture" },
  3: { gu: "સ્વરૂપ નિશ્ચય અને ઉપાસના સિદ્ધાંત", hi: "स्वरूप निश्चय एवं उपासना सिद्धांत", en: "Definite Knowledge of God & Core Upasana" },
  4: { gu: "નિત્ય કર્મ અને પ્રાતઃપૂજા વિધિ", hi: "नित्य कर्म एवं प्रातःपूजा विधि", en: "Daily Routine & Morning Puja Ritual" },
  5: { gu: "ધર્મ અને આહારશુદ્ધિ નિયમો", hi: "धर्म एवं आहारशुद्धि नियम", en: "Moral Codes & Dietary Purity" },
  6: { gu: "સદાચાર, કર્તવ્ય અને વ્યવહાર શુદ્ધિ", hi: "सदाचार, कर्तव्य एवं व्यवहार शुद्धि", en: "Right Conduct, Duties & Pure Living" },
  7: { gu: "સત્સંગ સભા, ઘરસભા અને સત્સંગ પ્રવૃત્તિ", hi: "सत्संग सभा, घरसभा एवं सत्संग गतिविधि", en: "Satsang Assembly, Ghar Sabha & Spiritual Gatherings" },
  8: { gu: "અંતઃશત્રુ જય અને નિર્દોષબુદ્ધિ", hi: "अंतःशत्रु जय एवं निर्दोषबुद्धि", en: "Overcoming Inner Enemies & Pure Vision (Nirdoshbuddhi)" },
  9: { gu: "અક્ષર-પુરુષોત્તમ ઉપાસના અને ગુરુભક્તિ", hi: "अक्षर-पुरुषोत्तम उपासना एवं गुरुभक्ति", en: "Akshar-Purushottam Upasana & Guru Devotion" },
  10: { gu: "ઉપસંહાર, આશીર્વાદ અને ફલશ્રુતિ", hi: "उपसंहार, आशीर्वाद एवं फलश्रुति", en: "Conclusion, Blessings & Fruits of Study" }
};

const processedShlokas = allRaw.map(s => {
  const devanagariScript = normalizeToDevanagari(s.sk);
  const gujaratiScript = devanagariToGujarati(s.sk);
  const englishTranslit = devanagariToIast(s.sk);
  const chapterId = getChapterIdForShloka(s.id);
  const ch = chapterMetadata[chapterId];

  return {
    id: s.id,
    chapterId: chapterId,
    chapterGu: ch.gu,
    chapterHi: ch.hi,
    chapterEn: ch.en,
    titleGu: s.titleGu,
    titleHi: s.titleHi,
    titleEn: s.titleEn,
    sanskritDevanagari: devanagariScript,
    sanskritGujarati: gujaratiScript,
    sanskritIast: englishTranslit,
    meaningGu: s.gu,
    meaningHi: s.hi,
    meaningEn: s.en,
    tags: s.tags
  };
});

const tsFileContent = `import { Shloka } from '../types';

export const SHLOKAS: Shloka[] = ${JSON.stringify(processedShlokas, null, 2)};

export function getAllShlokas(): Shloka[] {
  return SHLOKAS;
}

export function getShlokaById(id: number): Shloka | undefined {
  return SHLOKAS.find(s => s.id === id);
}

export function getShlokasByChapter(chapterId: number): Shloka[] {
  return SHLOKAS.filter(s => s.chapterId === chapterId);
}
`;

const outputPath = path.join(__dirname, '../src/data/shlokas.ts');
fs.writeFileSync(outputPath, tsFileContent, 'utf-8');
console.log(`Successfully written 315 shlokas to ${outputPath}`);
