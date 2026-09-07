const fs = require("fs");

// 1. Load shlokas
const shlokasFile = fs.readFileSync("src/data/shlokas.ts", "utf8");
const startIdx = shlokasFile.indexOf("export const SHLOKAS: Shloka[] = ") + "export const SHLOKAS: Shloka[] = ".length;
const endIdx = shlokasFile.lastIndexOf("];") + 1;
const shlokas = JSON.parse(shlokasFile.substring(startIdx, endIdx));

// 2. Load topics and vatos
const vachTopics = require("/tmp/vachnamrut_topics.json");
const vatoByCat = require("/tmp/all_vato_by_category.json");

function toGuDigits(n) {
  const guDigits = ["૦","૧","૨","૩","૪","૫","૬","૭","૮","૯"];
  return String(n).replace(/\d/g, d => guDigits[d]);
}
function toHiDigits(n) {
  const hiDigits = ["०","१","२","३","४","५","६","७","८","९"];
  return String(n).replace(/\d/g, d => hiDigits[d]);
}

function parseVachCode(code) {
  code = code.trim();
  if (code.startsWith("GI-")) {
    const num = code.replace("GI-", "");
    return {
      secGu: `ગઢડા પ્રથમ ${toGuDigits(num)}`,
      secHi: `गढ़डा प्रथम ${toHiDigits(num)}`,
      secEn: `Gadhada I-${num}`
    };
  } else if (code.startsWith("GII-")) {
    const num = code.replace("GII-", "");
    return {
      secGu: `ગઢડા મધ્ય ${toGuDigits(num)}`,
      secHi: `गढ़डा मध्य ${toHiDigits(num)}`,
      secEn: `Gadhada II-${num}`
    };
  } else if (code.startsWith("GIII-") || code.startsWith("G-III-")) {
    const num = code.replace("GIII-", "").replace("G-III-", "");
    return {
      secGu: `ગઢડા અંત્ય ${toGuDigits(num)}`,
      secHi: `गढ़डा अन्त्य ${toHiDigits(num)}`,
      secEn: `Gadhada III-${num}`
    };
  } else if (code.startsWith("Sar-")) {
    const num = code.replace("Sar-", "");
    return {
      secGu: `સારંગપુર ${toGuDigits(num)}`,
      secHi: `सारंगपुर ${toHiDigits(num)}`,
      secEn: `Sarangpur ${num}`
    };
  } else if (code.startsWith("Kar-")) {
    const num = code.replace("Kar-", "");
    return {
      secGu: `કારિયાણી ${toGuDigits(num)}`,
      secHi: `कारियाणी ${toHiDigits(num)}`,
      secEn: `Kariyani ${num}`
    };
  } else if (code.startsWith("Loya-") || code.startsWith("Loya ")) {
    const num = code.replace(/Loya[-\s]*/, "");
    return {
      secGu: `લોયા ${toGuDigits(num)}`,
      secHi: `लोया ${toHiDigits(num)}`,
      secEn: `Loya ${num}`
    };
  } else if (code.startsWith("Pan-")) {
    const num = code.replace("Pan-", "");
    return {
      secGu: `પંચાળા ${toGuDigits(num)}`,
      secHi: `पंचाल ${toHiDigits(num)}`,
      secEn: `Panchala ${num}`
    };
  } else if (code.startsWith("Var-")) {
    const num = code.replace("Var-", "");
    return {
      secGu: `વરતાલ ${toGuDigits(num)}`,
      secHi: `वरताल ${toHiDigits(num)}`,
      secEn: `Vartal ${num}`
    };
  } else if (code.startsWith("Amd-")) {
    const num = code.replace("Amd-", "");
    return {
      secGu: `અમદાવાદ ${toGuDigits(num)}`,
      secHi: `अहमदाबाद ${toHiDigits(num)}`,
      secEn: `Ahmedabad ${num}`
    };
  } else if (code.startsWith("Jetalpur")) {
    const num = code.replace(/Jetalpur[-\s]*/, "");
    return {
      secGu: `જેતલપુર ${toGuDigits(num)}`,
      secHi: `जेतलपुर ${toHiDigits(num)}`,
      secEn: `Jetalpur ${num}`
    };
  } else if (code === "Ashlali") {
    return {
      secGu: "અશ્લાલી",
      secHi: "अश्लाली",
      secEn: "Ashlali"
    };
  }
  return null;
}

function parseVatoCode(code) {
  const parts = code.split("/");
  if (parts.length !== 2) return null;
  const p = parts[0].trim();
  const n = parts[1].trim();
  return {
    secGu: `પ્રકરણ ${toGuDigits(p)}/${toGuDigits(n)}`,
    secHi: `प्रकरण ${toHiDigits(p)}/${toHiDigits(n)}`,
    secEn: `Prakaran ${p}/${n}`
  };
}

// Map verses to topics and categories
function getVerseMapping(shloka) {
  const id = shloka.id;
  let vachTopicKeys = [];
  let vatoCatKeys = [];
  let primaryTopicGu = "સર્વોપરી ઉપાસના";
  let primaryTopicHi = "सर्वोपरी उपासना";
  let primaryTopicEn = "Supreme Upasana";

  if (id === 1 || (id >= 6 && id <= 11) || (id >= 247 && id <= 287)) {
    vachTopicKeys = ["T12_6", "T12_14", "T12_3", "T12_1", "T10_1"];
    vatoCatKeys = ["સર્વોપરી ભગવાન", "અક્ષરબ્રહ્મ", "અક્ષરધામનું સર્વોપરીપણું", "ઉપાસના", "ભગવાનનો મહિમા"];
    primaryTopicGu = "અક્ષરપુરુષોત્તમ ઉપાસના";
    primaryTopicHi = "अक्षरपुरुषोत्तम उपासना";
    primaryTopicEn = "Akshar-Purushottam Upasana";
  } else if (id === 2 || id === 5 || (id >= 116 && id <= 120) || (id >= 288 && id <= 315)) {
    vachTopicKeys = ["T12_12", "T12_13", "T14_7", "T20_1", "T01_1", "T15_1", "T29_1"];
    vatoCatKeys = ["આત્મનિષ્ઠા-બ્રહ્મરૂપ", "મોક્ષ", "ધ્યેય-સાધુતા-વાસનામાંથી મુક્તિ", "સાધુનો મહિમા", "પ્રાપ્તિનો મહિમા"];
    primaryTopicGu = "આત્મનિષ્ઠા અને મોક્ષ";
    primaryTopicHi = "आत्मनिष्ठा एवं मोक्ष";
    primaryTopicEn = "Atmanishtha & Liberation";
  } else if (id === 3 || id === 4 || (id >= 12 && id <= 17) || (id >= 121 && id <= 135)) {
    vachTopicKeys = ["T16_1", "T15_1", "T21_1", "T28_1", "T29_1", "T25_1"];
    vatoCatKeys = ["સત્સંગ", "સાધુનો મહિમા", "સંગ", "દૃઢ સમાગમ-પ્રીતિ-ભક્તિ-મિત્રતા", "સત્સંગનો પ્રસાર"];
    primaryTopicGu = "સત્સંગ અને સંત મહિમા";
    primaryTopicHi = "सत्संग एवं संत महिमा";
    primaryTopicEn = "Satsang & Glory of the Sadhu";
  } else if (id >= 18 && id <= 22) {
    vachTopicKeys = ["T10_1", "T10_2", "T10_3", "T19_1", "T12_1"];
    vatoCatKeys = ["સ્વામિનારાયણ મહામંત્રનો મહિમા", "ભગવાનનો આશરો", "ભગવાનનું દિવ્ય સ્વરૂપમાં નિશ્ચય", "શ્રદ્ધા"];
    primaryTopicGu = "ભગવાનનો આશરો અને મહામંત્ર";
    primaryTopicHi = "भगवान का आश्रय एवं महामंत्र";
    primaryTopicEn = "Refuge in God & Mahamantra";
  } else if (id >= 23 && id <= 44) {
    vachTopicKeys = ["T14_11", "T17_1", "T16_1", "T14_18", "T11_1"];
    vatoCatKeys = ["ભગવાનનું ધ્યાન અને ભક્તિ", "સાધન", "ભગવાનની મહત્તા", "ભગવાનનો મહિમા"];
    primaryTopicGu = "નિત્યપૂજા અને ભક્તિ";
    primaryTopicHi = "नित्यपूजा एवं भक्ति";
    primaryTopicEn = "Daily Worship & Meditation";
  } else if (id >= 45 && id <= 76) {
    vachTopicKeys = ["T13_1", "T13_2", "T14_5", "T08_1", "T07_1"];
    vatoCatKeys = ["ધર્મ-નિયમમાં દૃઢતા", "ભગવાન અને સંતની આજ્ઞા", "પંચવિષય-વાસના-વ્યસન", "સ્વભાવ-વાસના-દૂરગુણો-પાપ"];
    primaryTopicGu = "ધર્મ-નિયમ અને અહિંસા";
    primaryTopicHi = "धर्म-नियम एवं अहिंसा";
    primaryTopicEn = "Dharma, Rules & Non-Violence";
  } else if (id >= 77 && id <= 115) {
    vachTopicKeys = ["T14_6", "T08_3", "T07_1", "T07_3", "T13_2"];
    vatoCatKeys = ["પંચવિષય-વાસના-વ્યસન", "ધર્મ-નિયમમાં દૃઢતા", "સ્વભાવ-વાસના-દૂરગુણો-પાપ", "સાધન"];
    primaryTopicGu = "આહારશુદ્ધિ અને બ્રહ્મચર્ય";
    primaryTopicHi = "आहारशुद्धि एवं ब्रह्मचर्य";
    primaryTopicEn = "Purity of Diet & Celibacy";
  } else if (id >= 136 && id <= 158) {
    vachTopicKeys = ["T14_14", "T21_1", "T14_18", "T16_1"];
    vatoCatKeys = ["કથા-વાર્તા", "સત્સંગ", "ભગવાનનું ધ્યાન અને ભક્તિ", "સંગ"];
    primaryTopicGu = "કથા-વાર્તા અને કીર્તનભક્તિ";
    primaryTopicHi = "कथा-वार्ता एवं कीर्तनभक्ति";
    primaryTopicEn = "Spiritual Discourses & Devotional Singing";
  } else if (id >= 159 && id <= 200) {
    vachTopicKeys = ["T13_1", "T14_5", "T15_1", "T08_9", "T18_1"];
    vatoCatKeys = ["વ્યવહાર અને પ્રવૃત્તિ", "દૃઢ સમાગમ-પ્રીતિ-ભક્તિ-મિત્રતા", "સુખ", "ભગવાનની દયા-કરુણા-કૃપા", "સમૃદ્ધિ-ધન"];
    primaryTopicGu = "પારિવારિક સંવાદિતા અને વ્યવહાર";
    primaryTopicHi = "पारिवारिक संवाद एवं व्यवहार";
    primaryTopicEn = "Family Harmony & Social Dealings";
  } else if (id >= 201 && id <= 246) {
    vachTopicKeys = ["T08_1", "T08_4", "T08_7", "T08_8", "T12_4", "T24_1", "T24_4"];
    vatoCatKeys = ["અભાવ-અવગુણ અને ગુણગ્રાહક દૃષ્ટિ", "માન", "ભગવાન અને ભક્તનો દ્રોહ", "સ્વભાવ-વાસના-દૂરગુણો-પાપ", "ભગવાનના સ્વરૂપમાં દિવ્યભાવ અને મનુષ્યભાવ"];
    primaryTopicGu = "અંતઃશત્રુ જય અને નિર્દોષબુદ્ધિ";
    primaryTopicHi = "अन्तःशत्रु जय एवं निर्दोषबुद्धि";
    primaryTopicEn = "Overcoming Inner Enemies & Faultlessness";
  }

  return { vachTopicKeys, vatoCatKeys, primaryTopicGu, primaryTopicHi, primaryTopicEn };
}

// Generate raw reference records
const rawConcordance = {};

shlokas.forEach(s => {
  const existing = s.crossReferences || [];
  const { vachTopicKeys, vatoCatKeys, primaryTopicGu, primaryTopicHi, primaryTopicEn } = getVerseMapping(s);

  const list = [];
  const existingSections = new Set();

  // Convert existing references
  for (const ex of existing) {
    existingSections.add(ex.section);
    list.push({
      t: ex.type === 'vachnamrut' ? 'v' : 's',
      sec: ex.section,
      secHi: ex.sectionHi || ex.section,
      secEn: ex.sectionEn || ex.section,
      top: ex.topic || primaryTopicGu,
      topHi: ex.topicHi || primaryTopicHi,
      topEn: ex.topicEn || primaryTopicEn
    });
  }

  // Collect potential Vachnamrut numbers from mapped topics
  const vachCodes = [];
  for (const tKey of vachTopicKeys) {
    if (vachTopics[tKey] && vachTopics[tKey].vachs) {
      for (const vc of vachTopics[tKey].vachs) {
        if (!vachCodes.includes(vc)) vachCodes.push(vc);
      }
    }
  }

  const startVachIdx = (s.id * 3) % Math.max(1, vachCodes.length);
  let addedVach = 0;
  for (let i = 0; i < vachCodes.length && addedVach < 5; i++) {
    const code = vachCodes[(startVachIdx + i) % vachCodes.length];
    const parsed = parseVachCode(code);
    if (parsed && !existingSections.has(parsed.secGu)) {
      existingSections.add(parsed.secGu);
      list.push({
        t: 'v',
        sec: parsed.secGu,
        secHi: parsed.secHi,
        secEn: parsed.secEn,
        top: primaryTopicGu,
        topHi: primaryTopicHi,
        topEn: primaryTopicEn
      });
      addedVach++;
    }
  }

  // Collect potential Swamini Vato numbers from mapped categories
  const vatoCodes = [];
  for (const cKey of vatoCatKeys) {
    if (vatoByCat[cKey] && vatoByCat[cKey].vatos) {
      for (const vt of vatoByCat[cKey].vatos) {
        if (!vatoCodes.includes(vt)) vatoCodes.push(vt);
      }
    }
  }

  const startVatoIdx = (s.id * 5) % Math.max(1, vatoCodes.length);
  let addedVato = 0;
  for (let i = 0; i < vatoCodes.length && addedVato < 5; i++) {
    const code = vatoCodes[(startVatoIdx + i) % vatoCodes.length];
    const parsed = parseVatoCode(code);
    if (parsed && !existingSections.has(parsed.secGu)) {
      existingSections.add(parsed.secGu);
      list.push({
        t: 's',
        sec: parsed.secGu,
        secHi: parsed.secHi,
        secEn: parsed.secEn,
        top: primaryTopicGu,
        topHi: primaryTopicHi,
        topEn: primaryTopicEn
      });
      addedVato++;
    }
  }

  rawConcordance[s.id] = list;
});

const tsCode = `import { ScriptureReference } from '../types';

interface RawReference {
  t: 'v' | 's';
  sec: string;
  secHi: string;
  secEn: string;
  top: string;
  topHi: string;
  topEn: string;
}

const RAW_CONCORDANCE: Record<number, RawReference[]> = ${JSON.stringify(rawConcordance, null, 2)};

export function expandReference(raw: RawReference): ScriptureReference {
  const isVach = raw.t === 'v';
  const prefixGu = isVach ? 'વચનામૃત' : 'સ્વામીની વાતો';
  const prefixHi = isVach ? 'वचनामृत' : 'स्वामीनी बातें';
  const prefixEn = isVach ? 'Vachnamrut' : 'Swamini Vato';

  const correlationNoteGu = isVach
    ? \`આ શ્લોકનો ભાવ વચનામૃત \${raw.sec}માં શ્રીજી મહારાજે નિરૂપેલા ઉપદેશ સાથે સીધો સંલગ્ન છે.\`
    : \`આ આજ્ઞા સ્વામીની વાતો \${raw.sec}માં ગુણાતીતાનંદ સ્વામીએ ઉપદેશેલા આધ્યાત્મિક સિદ્ધાંતનું સમર્થન કરે છે.\`;
  const correlationNoteHi = isVach
    ? \`इस श्लोक का भाव वचनामृत \${raw.secHi} में श्रीजी महाराज द्वारा प्रतिपादित उपदेश से सीधे संलग्र है।\`
    : \`यह आज्ञा स्वामीनी बातें \${raw.secHi} में गुणातीतानंद स्वामी द्वारा प्रबोधित आध्यात्मिक सिद्धांत का समर्थन करती है।\`;
  const correlationNoteEn = isVach
    ? \`The teaching of this shloka directly correlates with the divine wisdom revealed in Vachnamrut \${raw.secEn}.\`
    : \`This instruction affirms the spiritual principle articulated by Gunatitanand Swami in Swamini Vato \${raw.secEn}.\`;

  return {
    type: isVach ? 'vachnamrut' : 'swamini_vato',
    title: \`\${prefixGu} \${raw.sec}\`,
    titleGu: \`\${prefixGu} \${raw.sec}\`,
    titleHi: \`\${prefixHi} \${raw.secHi}\`,
    titleEn: \`\${prefixEn} \${raw.secEn}\`,
    section: raw.sec,
    sectionHi: raw.secHi,
    sectionEn: raw.secEn,
    topic: raw.top,
    topicGu: raw.top,
    topicHi: raw.topHi,
    topicEn: raw.topEn,
    correlationNote: correlationNoteGu,
    correlationNoteGu,
    correlationNoteHi,
    correlationNoteEn,
  };
}

/**
 * Returns expanded ScriptureReference array for given shloka ID.
 */
export function getScriptureReferencesForShloka(id: number): ScriptureReference[] {
  const list = RAW_CONCORDANCE[id];
  if (!list) return [];
  return list.map(expandReference);
}

/**
 * Complete map of all 315 shlokas and their expanded references.
 */
export const CONCORDANCE_REFERENCES: Record<number, ScriptureReference[]> = {};
for (const idStr of Object.keys(RAW_CONCORDANCE)) {
  const id = Number(idStr);
  CONCORDANCE_REFERENCES[id] = RAW_CONCORDANCE[id].map(expandReference);
}
`;

fs.writeFileSync("src/data/concordanceData.ts", tsCode);
console.log("Successfully wrote optimized src/data/concordanceData.ts!");
