import vatoData from './swaminiVatoStore.json';

export interface SwaminiVatEntry {
  prakaran: number;
  no: number;
  categoryGu: string;
  categoryEn: string;
  textGu: string;
  textEn: string;
  code: string;
  anirdeshUrl: string;
}

interface RawVatItem {
  p: number;
  n: number;
  cg: string;
  ce: string;
  tg: string;
  te: string;
}

const rawStore = vatoData as Record<string, RawVatItem>;

const guDigits: Record<string, string> = {
  '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
  '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
};

export function normalizeVatoCode(sec: string): string {
  if (!sec) return '';
  const enDigits = sec.replace(/[૦-૯]/g, d => guDigits[d] || d);
  const match = enDigits.match(/(\d+)\s*[\/|\-]\s*(\d+)/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  return '';
}

/**
 * Fetch a Swamini Vato entry by prakaran/no code or section string
 * (e.g. '1/161', 'Prakaran 1/161', 'પ્રકરણ ૧/૧૬૧')
 */
export function getSwaminiVat(codeOrSection: string): SwaminiVatEntry | undefined {
  const code = normalizeVatoCode(codeOrSection);
  if (!code) return undefined;
  
  const raw = rawStore[code];
  if (!raw) return undefined;

  return {
    prakaran: raw.p,
    no: raw.n,
    categoryGu: raw.cg,
    categoryEn: raw.ce,
    textGu: raw.tg,
    textEn: raw.te,
    code,
    anirdeshUrl: `https://anirdesh.com/vato/index.php?prakaran=${raw.p}&no=${raw.n}`
  };
}

/**
 * Get Swamini Vato text formatted for the user's active language
 */
export function getSwaminiVatTextInLang(entry: SwaminiVatEntry, lang: string): {
  primaryText: string;
  secondaryText?: string;
  primaryLang: string;
  secondaryLang?: string;
  label: string;
} {
  if (lang === 'english') {
    return {
      primaryText: entry.textEn || entry.textGu,
      secondaryText: entry.textGu,
      primaryLang: 'english',
      secondaryLang: 'gujarati',
      label: 'English Translation'
    };
  }

  // Gujarati or other Indian languages: original Gunatitanand Swami words in Gujarati,
  // accompanied by the English translation for clarity
  return {
    primaryText: entry.textGu,
    secondaryText: entry.textEn,
    primaryLang: 'gujarati',
    secondaryLang: 'english',
    label: 'ગુજરાતી મૂળ ઉપદેશ'
  };
}
