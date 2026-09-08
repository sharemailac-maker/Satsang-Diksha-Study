import vachData from './vachnamrutStore.json';

export interface VachnamrutQuote {
  quoteGu: string;
  quoteHi: string;
  quoteEn: string;
}

export interface VachnamrutEntry {
  code: string;
  vachNo: number;
  sectionGu: string;
  sectionHi: string;
  sectionEn: string;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  quotes: VachnamrutQuote[];
}

interface RawQuoteItem {
  g: string;
  h: string;
  e: string;
}

interface RawVachItem {
  c: string;
  n: number;
  sg: string;
  sh: string;
  se: string;
  tg: string;
  th: string;
  te: string;
  q: RawQuoteItem[];
}

const rawStore = vachData as Record<string, RawVachItem>;

const guDigits: Record<string, string> = {
  '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
  '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
};

const hiDigits: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

export function toAsciiDigits(s: string): string {
  return s
    .replace(/[૦-૯]/g, d => guDigits[d] || d)
    .replace(/[०-९]/g, d => hiDigits[d] || d);
}

/**
 * Normalizes any section string (Gujarati, Hindi, English, abbreviations)
 * into a canonical code like "GI-18", "Loya-12", "Sar-7", "Var-11", "GIII-39", etc.
 */
export function normalizeVachnamrutCode(sec: string): string {
  if (!sec) return '';
  let s = toAsciiDigits(sec).trim();

  // Section names
  s = s.replace(/ગઢડા પ્રથમ/g, 'GI-').replace(/ગઢડા મધ્ય/g, 'GII-').replace(/ગઢડા અંત્ય/g, 'GIII-');
  s = s.replace(/ગ\.પ્ર\./g, 'GI-').replace(/ગ\. પ્ર\./g, 'GI-');
  s = s.replace(/ગ\.મ\./g, 'GII-').replace(/ગ\. મ\./g, 'GII-');
  s = s.replace(/ગ\.અં\./g, 'GIII-').replace(/ગ\. અં\./g, 'GIII-');

  s = s.replace(/गढ़डा प्रथम/g, 'GI-').replace(/गढ़डा मध्य/g, 'GII-').replace(/गढ़डा अन्त्य/g, 'GIII-');
  s = s.replace(/ग\.प्र\./g, 'GI-').replace(/ग\.म\./g, 'GII-').replace(/ग\.अं\./g, 'GIII-');

  s = s.replace(/Gadhada I[- ]/gi, 'GI-').replace(/Gadhada 1[- ]/gi, 'GI-');
  s = s.replace(/Gadhada II[- ]/gi, 'GII-').replace(/Gadhada 2[- ]/gi, 'GII-');
  s = s.replace(/Gadhada III[- ]/gi, 'GIII-').replace(/Gadhada 3[- ]/gi, 'GIII-');

  s = s.replace(/સારંગપુર/g, 'Sar-').replace(/સારંગ\./g, 'Sar-').replace(/सारंगपुर/g, 'Sar-').replace(/Sarangpur/gi, 'Sar-');
  s = s.replace(/કારિયાણી/g, 'Kar-').replace(/કારિ\./g, 'Kar-').replace(/कारियाणी/g, 'Kar-').replace(/Kariyani/gi, 'Kar-');
  s = s.replace(/લોયા/g, 'Loya-').replace(/લો\./g, 'Loya-').replace(/लोया/g, 'Loya-').replace(/Loya/gi, 'Loya-');
  s = s.replace(/પંચાળા/g, 'Pan-').replace(/पंचाल/g, 'Pan-').replace(/Panchala/gi, 'Pan-');
  s = s.replace(/વરતાલ/g, 'Var-').replace(/વર\./g, 'Var-').replace(/वड़ताल/g, 'Var-').replace(/Vartal/gi, 'Var-');
  s = s.replace(/અમદાવાદ/g, 'Amd-').replace(/અમદા\./g, 'Amd-').replace(/અમ\./g, 'Amd-').replace(/अहमदाबाद/g, 'Amd-').replace(/Ahmedabad/gi, 'Amd-');
  s = s.replace(/જેતલપુર/g, 'Jetalpur-').replace(/જેત\./g, 'Jetalpur-').replace(/जेत्तलपुर/g, 'Jetalpur-').replace(/Jetalpur/gi, 'Jetalpur-');
  s = s.replace(/અશ્લાલી/g, 'Ashlali-1').replace(/असलाली/g, 'Ashlali-1').replace(/Aslali/gi, 'Ashlali-1');

  const match = s.match(/([A-Za-z]+)-?\s*(\d+)/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return '';
}

/**
 * Check if a Vachnamrut section has an available quotation in the store
 */
export function hasVachnamrutQuotation(codeOrSection: string): boolean {
  const code = normalizeVachnamrutCode(codeOrSection);
  if (!code) return false;
  const raw = rawStore[code];
  return Boolean(raw && raw.q && raw.q.length > 0);
}

/**
 * Get the full Vachnamrut entry including all quotations
 */
export function getVachnamrutEntry(codeOrSection: string): VachnamrutEntry | undefined {
  const code = normalizeVachnamrutCode(codeOrSection);
  if (!code) return undefined;
  const raw = rawStore[code];
  if (!raw) return undefined;

  return {
    code: raw.c,
    vachNo: raw.n,
    sectionGu: raw.sg,
    sectionHi: raw.sh,
    sectionEn: raw.se,
    titleGu: raw.tg,
    titleHi: raw.th,
    titleEn: raw.te,
    quotes: (raw.q || []).map(q => ({
      quoteGu: q.g,
      quoteHi: q.h,
      quoteEn: q.e
    }))
  };
}

/**
 * Helper to ensure a quotation is enclosed in quotes ("..."),
 * fulfilling: 'If multiple quotations found for same Vachnamrut give all by making "" mark to distinguish different quotations.'
 */
export function formatQuotationWithMarks(quoteText: string): string {
  const trimmed = quoteText.trim();
  if (!trimmed) return '';
  if ((trimmed.startsWith('“') && trimmed.endsWith('”')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed;
  }
  return `“${trimmed}”`;
}

/**
 * Get quotations in the user's active language
 */
export function getVachnamrutQuotationsInLang(entry: VachnamrutEntry, lang: string): string[] {
  if (!entry || !entry.quotes || entry.quotes.length === 0) return [];

  return entry.quotes.map(q => {
    if (lang === 'english') {
      return formatQuotationWithMarks(q.quoteEn || q.quoteGu);
    }
    if (lang === 'hindi') {
      return formatQuotationWithMarks(q.quoteHi || q.quoteGu);
    }
    return formatQuotationWithMarks(q.quoteGu || q.quoteEn);
  });
}
