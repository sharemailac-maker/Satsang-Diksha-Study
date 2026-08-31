import { Language, Shloka, WordMeaning } from '../types';

export const LANGUAGE_METADATA: Record<Language, {
  nameGu: string;
  nameHi: string;
  nameEn: string;
  nativeName: string;
  flagOrCode: string;
}> = {
  gujarati: {
    nameGu: 'ગુજરાતી (મૂળ ભાવાર્થ)',
    nameHi: 'गुजराती',
    nameEn: 'Gujarati (Default Authentic)',
    nativeName: 'ગુજરાતી',
    flagOrCode: 'GU'
  },
  hindi: {
    nameGu: 'હિન્દી ભાવાર્થ',
    nameHi: 'हिन्दी भावार्थ',
    nameEn: 'Hindi Commentary',
    nativeName: 'हिन्दी',
    flagOrCode: 'HI'
  },
  english: {
    nameGu: 'અંગ્રેજી અનુવાદ',
    nameHi: 'अंग्रेजी अनुवाद',
    nameEn: 'English Translation',
    nativeName: 'English',
    flagOrCode: 'EN'
  },
  all: {
    nameGu: 'સર્વ ભાષાઓ (All Languages)',
    nameHi: 'सभी भाषाएँ',
    nameEn: 'All Languages (Parallel)',
    nativeName: 'ત્રિભાષા',
    flagOrCode: 'ALL'
  },
  marathi: {
    nameGu: 'મરાઠી ભાષાંતર',
    nameHi: 'मराठी अनुवाद',
    nameEn: 'Marathi Translation',
    nativeName: 'मराठी',
    flagOrCode: 'MR'
  },
  bengali: {
    nameGu: 'બંગાળી ભાષાંતર',
    nameHi: 'बंगाली अनुवाद',
    nameEn: 'Bengali Translation',
    nativeName: 'বাংলা',
    flagOrCode: 'BN'
  },
  tamil: {
    nameGu: 'તમિલ ભાષાંતર',
    nameHi: 'तमिल अनुवाद',
    nameEn: 'Tamil Translation',
    nativeName: 'தமிழ்',
    flagOrCode: 'TA'
  },
  telugu: {
    nameGu: 'તેલુગુ ભાષાંતર',
    nameHi: 'तेलुगु अनुवाद',
    nameEn: 'Telugu Translation',
    nativeName: 'తెలుగు',
    flagOrCode: 'TE'
  },
  kannada: {
    nameGu: 'કન્નડ ભાષાંતર',
    nameHi: 'कन्नड़ अनुवाद',
    nameEn: 'Kannada Translation',
    nativeName: 'ಕನ್ನಡ',
    flagOrCode: 'KN'
  }
};

/**
 * Returns the best translation text for a given shloka and language.
 */
export function getShlokaMeaning(shloka: Shloka, lang: Language): string {
  switch (lang) {
    case 'gujarati':
      return shloka.meaningGu;
    case 'hindi':
      return shloka.meaningHi || shloka.meaningGu;
    case 'english':
      return shloka.meaningEn || shloka.meaningGu;
    case 'marathi':
      return shloka.meaningMr || `[मराठी] ${shloka.meaningHi || shloka.meaningGu}`;
    case 'tamil':
      return shloka.meaningTa || `[தமிழ்] ${shloka.meaningEn || shloka.meaningGu}`;
    case 'telugu':
      return shloka.meaningTe || `[తెలుగు] ${shloka.meaningEn || shloka.meaningGu}`;
    case 'kannada':
      return shloka.meaningKn || `[ಕನ್ನಡ] ${shloka.meaningEn || shloka.meaningGu}`;
    case 'bengali':
      return shloka.meaningBn || `[বাংলা] ${shloka.meaningHi || shloka.meaningGu}`;
    default:
      return shloka.meaningGu;
  }
}

/**
 * Returns word meaning in the specified language
 */
export function getWordMeaningInLang(word: WordMeaning, lang: Language): string {
  switch (lang) {
    case 'gujarati':
      return word.meaningGu;
    case 'hindi':
      return word.meaningHi || word.meaningGu;
    case 'english':
      return word.meaningEn || word.meaningGu;
    case 'marathi':
      return word.meaningMr || word.meaningHi || word.meaningGu;
    case 'tamil':
      return word.meaningTa || word.meaningEn || word.meaningGu;
    case 'telugu':
      return word.meaningTe || word.meaningEn || word.meaningGu;
    case 'kannada':
      return word.meaningKn || word.meaningEn || word.meaningGu;
    case 'bengali':
      return word.meaningBn || word.meaningHi || word.meaningGu;
    default:
      return word.meaningGu;
  }
}
