import { Language, Shloka, WordMeaning, ScriptureReference } from '../types';

export const LANGUAGE_METADATA: Record<Language, {
  nameGu: string;
  nameHi: string;
  nameEn: string;
  nativeName: string;
  flagOrCode: string;
}> = {
  gujarati: {
    nameGu: 'ગુજરાતી (મૂળ ભાવાર્થ)',
    nameHi: 'गुजराती (मूल भावार्थ)',
    nameEn: 'Gujarati (Authentic Original)',
    nativeName: 'ગુજરાતી',
    flagOrCode: 'GU'
  },
  hindi: {
    nameGu: 'હિન્દી ભાવાર્થ',
    nameHi: 'हिन्दी भावार्थ',
    nameEn: 'Hindi Translation',
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
  marathi: {
    nameGu: 'મરાઠી ભાષાંતર',
    nameHi: 'मराठी अनुवाद',
    nameEn: 'Marathi Translation',
    nativeName: 'मराठी',
    flagOrCode: 'MR'
  },
  punjabi: {
    nameGu: 'પંજાબી ભાષાંતર',
    nameHi: 'पंजाबी अनुवाद',
    nameEn: 'Punjabi Translation',
    nativeName: 'ਪੰਜਾਬੀ',
    flagOrCode: 'PA'
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
  },
  spanish: {
    nameGu: 'સ્પેનિશ અનુવાદ',
    nameHi: 'स्पैनिश अनुवाद',
    nameEn: 'Spanish Translation',
    nativeName: 'Español',
    flagOrCode: 'ES'
  },
  french: {
    nameGu: 'ફ્રેન્ચ અનુવાદ',
    nameHi: 'फ्रेंच अनुवाद',
    nameEn: 'French Translation',
    nativeName: 'Français',
    flagOrCode: 'FR'
  },
  german: {
    nameGu: 'જર્મન અનુવાદ',
    nameHi: 'जर्मन अनुवाद',
    nameEn: 'German Translation',
    nativeName: 'Deutsch',
    flagOrCode: 'DE'
  },
  portuguese: {
    nameGu: 'પોર્ટુગીઝ અનુવાદ',
    nameHi: 'पुर्तगाली अनुवाद',
    nameEn: 'Portuguese Translation',
    nativeName: 'Português',
    flagOrCode: 'PT'
  },
  russian: {
    nameGu: 'રશિયન અનુવાદ',
    nameHi: 'रूसी अनुवाद',
    nameEn: 'Russian Translation',
    nativeName: 'Русский',
    flagOrCode: 'RU'
  },
  greek: {
    nameGu: 'ગ્રીક અનુવાદ',
    nameHi: 'ग्रीक अनुवाद',
    nameEn: 'Greek Translation',
    nativeName: 'Ελληνικά',
    flagOrCode: 'EL'
  },
  polish: {
    nameGu: 'પોલિશ અનુવાદ',
    nameHi: 'पोलिश अनुवाद',
    nameEn: 'Polish Translation',
    nativeName: 'Polski',
    flagOrCode: 'PL'
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
      return shloka.meaningMr || shloka.meaningHi || shloka.meaningGu;
    case 'punjabi':
      return shloka.meaningPa || shloka.meaningHi || shloka.meaningGu;
    case 'bengali':
      return shloka.meaningBn || shloka.meaningHi || shloka.meaningGu;
    case 'tamil':
      return shloka.meaningTa || shloka.meaningEn || shloka.meaningGu;
    case 'telugu':
      return shloka.meaningTe || shloka.meaningEn || shloka.meaningGu;
    case 'kannada':
      return shloka.meaningKn || shloka.meaningEn || shloka.meaningGu;
    case 'spanish':
      return shloka.meaningEs || shloka.meaningEn || shloka.meaningGu;
    case 'french':
      return shloka.meaningFr || shloka.meaningEn || shloka.meaningGu;
    case 'german':
      return shloka.meaningDe || shloka.meaningEn || shloka.meaningGu;
    case 'portuguese':
      return shloka.meaningPt || shloka.meaningEn || shloka.meaningGu;
    case 'russian':
      return shloka.meaningRu || shloka.meaningEn || shloka.meaningGu;
    case 'greek':
      return shloka.meaningEl || shloka.meaningEn || shloka.meaningGu;
    case 'polish':
      return shloka.meaningPl || shloka.meaningEn || shloka.meaningGu;
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
    case 'punjabi':
      return word.meaningPa || word.meaningHi || word.meaningGu;
    case 'bengali':
      return word.meaningBn || word.meaningHi || word.meaningGu;
    case 'tamil':
      return word.meaningTa || word.meaningEn || word.meaningGu;
    case 'telugu':
      return word.meaningTe || word.meaningEn || word.meaningGu;
    case 'kannada':
      return word.meaningKn || word.meaningEn || word.meaningGu;
    case 'spanish':
      return word.meaningEs || word.meaningEn || word.meaningGu;
    case 'french':
      return word.meaningFr || word.meaningEn || word.meaningGu;
    case 'german':
      return word.meaningDe || word.meaningEn || word.meaningGu;
    case 'portuguese':
      return word.meaningPt || word.meaningEn || word.meaningGu;
    case 'russian':
      return word.meaningRu || word.meaningEn || word.meaningGu;
    case 'greek':
      return word.meaningEl || word.meaningEn || word.meaningGu;
    case 'polish':
      return word.meaningPl || word.meaningEn || word.meaningGu;
    default:
      return word.meaningGu;
  }
}

/**
 * Returns shloka title in the active language
 */
export function getShlokaTitle(shloka: Shloka, lang: Language): string {
  if (lang === 'hindi') return shloka.titleHi || shloka.titleGu;
  if (lang === 'english') return shloka.titleEn || shloka.titleGu;
  return shloka.titleGu;
}

/**
 * Returns chapter name from shloka in the active language
 */
export function getShlokaChapterName(shloka: Shloka, lang: Language): string {
  if (lang === 'hindi') return shloka.chapterHi || shloka.chapterGu;
  if (lang === 'english') return shloka.chapterEn || shloka.chapterGu;
  return shloka.chapterGu;
}

/**
 * Returns chapter title in the active language
 */
export function getChapterTitle(chapter: { titleGu: string; titleHi: string; titleEn: string }, lang: Language): string {
  if (lang === 'hindi') return chapter.titleHi || chapter.titleGu;
  if (lang === 'english') return chapter.titleEn || chapter.titleGu;
  return chapter.titleGu;
}

/**
 * Returns chapter description in the active language
 */
export function getChapterDescription(chapter: { descriptionGu: string; descriptionHi: string; descriptionEn: string }, lang: Language): string {
  if (lang === 'hindi') return chapter.descriptionHi || chapter.descriptionGu;
  if (lang === 'english') return chapter.descriptionEn || chapter.descriptionGu;
  return chapter.descriptionGu;
}

// -------------------------------------------------------------
// SCRIPTURAL CROSS-REFERENCE TRANSLATION DICTIONARIES & HELPERS
// -------------------------------------------------------------

const GUJARATI_DIGITS: Record<string, string> = {
  '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
  '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
};

const HINDI_DIGITS: Record<string, string> = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  '૦': '०', '૧': '१', '૨': '२', '૩': '३', '૪': '४',
  '૫': '५', '૬': '६', '૭': '७', '૮': '८', '૯': '९'
};

function normalizeGujDigits(str: string): string {
  return str.replace(/[૦-૯]/g, d => GUJARATI_DIGITS[d] || d);
}

function toHindiDigits(str: string): string {
  return str.replace(/[0-9૦-૯]/g, d => HINDI_DIGITS[d] || d);
}

/**
 * Translates Vachnamrut / Swamini Vato / Scripture titles across all languages
 */
export function getReferenceTitle(ref: ScriptureReference | { title?: string; titleGu?: string; titleHi?: string; titleEn?: string; type?: string; section?: string }, lang: Language): string {
  const rawTitle = ref.titleGu || ref.title || '';
  if (!rawTitle) return '';

  if (lang === 'gujarati') {
    return rawTitle;
  }

  // If explicit translated title already provided
  if (lang === 'hindi' && ref.titleHi && ref.titleHi !== ref.titleGu) return ref.titleHi;
  if (lang === 'english' && ref.titleEn && ref.titleEn !== ref.titleGu) return ref.titleEn;

  // Pattern matching for Vachnamrut titles
  if (rawTitle.includes('વચનામૃત') || ref.type === 'vachnamrut') {
    let t = rawTitle;
    if (lang === 'hindi' || lang === 'marathi') {
      t = t
        .replace(/વચનામૃત/g, 'वचनामृत')
        .replace(/ગઢડા પ્રથમ/g, 'गढ़डा प्रथम')
        .replace(/ગઢડા મધ્ય/g, 'गढ़डा मध्य')
        .replace(/ગઢડા અંત્ય/g, 'गढ़डा अन्त्य')
        .replace(/ગઢડા/g, 'गढ़डा')
        .replace(/સારંગપુર/g, 'सारंगपुर')
        .replace(/કારિયાણી/g, 'कारियाणी')
        .replace(/લોયા/g, 'लोया')
        .replace(/પંચાળા/g, 'पंचाल')
        .replace(/વરતાલ/g, 'वड़ताल')
        .replace(/અમદાવાદ/g, 'अहमदाबाद')
        .replace(/જેતલપુર/g, 'जेतलपुर')
        .replace(/આશલોજ/g, 'आशलोज');
      return toHindiDigits(t);
    }
    if (lang === 'english' || lang === 'spanish' || lang === 'french' || lang === 'german' || lang === 'portuguese' || lang === 'russian' || lang === 'greek' || lang === 'polish') {
      const westernDigits = normalizeGujDigits(t);
      return westernDigits
        .replace(/વચનામૃત/g, 'Vachnamrut')
        .replace(/ગઢડા પ્રથમ/g, 'Gadhada I-')
        .replace(/ગઢડા મધ્ય/g, 'Gadhada II-')
        .replace(/ગઢડા અંત્ય/g, 'Gadhada III-')
        .replace(/ગઢડા/g, 'Gadhada')
        .replace(/સારંગપુર/g, 'Sarangpur')
        .replace(/કારિયાણી/g, 'Kariyani')
        .replace(/લોયા/g, 'Loya')
        .replace(/પંચાળા/g, 'Panchala')
        .replace(/વરતાલ/g, 'Vartal')
        .replace(/અમદાવાદ/g, 'Ahmedabad')
        .replace(/જેતલપુર/g, 'Jetalpur')
        .replace(/આશલોજ/g, 'Ashloj');
    }
    if (lang === 'bengali') {
      return rawTitle.replace(/વચનામૃત/g, 'বচনামৃত');
    }
    if (lang === 'tamil') {
      return rawTitle.replace(/વચનામૃત/g, 'வசனாம்ருதம்');
    }
    if (lang === 'telugu') {
      return rawTitle.replace(/વચનામૃત/g, 'వచనామృతం');
    }
    if (lang === 'kannada') {
      return rawTitle.replace(/વચનામૃત/g, 'ವಚನಾಮೃತ');
    }
  }

  // Pattern matching for Swamini Vato
  if (rawTitle.includes('સ્વામીની વાતો') || ref.type === 'swamini_vato') {
    let t = rawTitle;
    if (lang === 'hindi' || lang === 'marathi') {
      t = t
        .replace(/સ્વામીની વાતો/g, 'स्वामीनी बातें')
        .replace(/પ્રકરણ/g, 'प्रकरण')
        .replace(/વાત/g, 'बात');
      return toHindiDigits(t);
    }
    if (lang === 'english' || lang === 'spanish' || lang === 'french' || lang === 'german' || lang === 'portuguese' || lang === 'russian' || lang === 'greek' || lang === 'polish') {
      const westernDigits = normalizeGujDigits(t);
      return westernDigits
        .replace(/સ્વામીની વાતો/g, 'Swamini Vato')
        .replace(/પ્રકરણ/g, 'Chapter')
        .replace(/વાત/g, 'Discourse');
    }
    if (lang === 'bengali') return rawTitle.replace(/સ્વામીની વાતો/g, 'স্বামীজীর বাণী');
    if (lang === 'tamil') return rawTitle.replace(/સ્વામીની વાતો/g, 'சுவாமினி வாதோ');
    if (lang === 'telugu') return rawTitle.replace(/સ્વામીની વાતો/g, 'స్వామినీ వాతో');
    if (lang === 'kannada') return rawTitle.replace(/સ્વામીની વાતો/g, 'ಸ್ವಾಮಿನಿ ವಾತೋ');
  }

  // Fallback translation
  if (lang === 'hindi' && ref.titleHi) return ref.titleHi;
  if (lang === 'english' && ref.titleEn) return ref.titleEn;
  return rawTitle;
}

/**
 * Returns translated section tag (e.g., 'ગઢડા પ્રથમ ૧' -> 'Gadhada I-1')
 */
export function getReferenceSection(ref: ScriptureReference | { section?: string; sectionHi?: string; sectionEn?: string; type?: string }, lang: Language): string {
  if (lang === 'gujarati') return ref.section || '';

  if (lang === 'hindi' || lang === 'marathi') {
    if ('sectionHi' in ref && ref.sectionHi) return ref.sectionHi;
    const rawSec = ref.section || '';
    if (!rawSec) return '';
    return toHindiDigits(
      rawSec
        .replace(/ગઢડા પ્રથમ/g, 'गढ़डा प्रथम')
        .replace(/ગઢડા મધ્ય/g, 'गढ़डा मध्य')
        .replace(/ગઢડા અંત્ય/g, 'गढ़डा अन्त्य')
        .replace(/સારંગપુર/g, 'सारंगपुर')
        .replace(/કારિયાણી/g, 'कारियाणी')
        .replace(/લોયા/g, 'लोया')
        .replace(/પંચાળા/g, 'पंचाल')
        .replace(/વરતાલ/g, 'वड़ताल')
        .replace(/અમદાવાદ/g, 'अहमदाबाद')
        .replace(/જેતલપુર/g, 'जेतलपुर')
        .replace(/અસલાલી/g, 'असलाली')
        .replace(/પ્રકરણ/g, 'प्रकरण')
        .replace(/વાત/g, 'बात')
    );
  }

  if (lang === 'english' || lang === 'spanish' || lang === 'french' || lang === 'german' || lang === 'portuguese' || lang === 'russian' || lang === 'greek' || lang === 'polish') {
    if ('sectionEn' in ref && ref.sectionEn) return ref.sectionEn;
    const rawSec = ref.section || '';
    if (!rawSec) return '';
    const western = normalizeGujDigits(rawSec);
    return western
      .replace(/ગઢડા પ્રથમ/g, 'Gadhada I-')
      .replace(/ગઢડા મધ્ય/g, 'Gadhada II-')
      .replace(/ગઢડા અંત્ય/g, 'Gadhada III-')
      .replace(/સારંગપુર/g, 'Sarangpur ')
      .replace(/કારિયાણી/g, 'Kariyani ')
      .replace(/લોયા/g, 'Loya ')
      .replace(/પંચાળા/g, 'Panchala ')
      .replace(/વરતાલ/g, 'Vartal ')
      .replace(/અમદાવાદ/g, 'Ahmedabad ')
      .replace(/જેતલપુર/g, 'Jetalpur ')
      .replace(/અસલાલી/g, 'Aslali ')
      .replace(/પ્રકરણ/g, 'Prakaran ')
      .replace(/વાત/g, 'Discourse ');
  }

  return ref.section || '';
}

// Canonical Scriptural Quotes Translated
const PASSAGE_TRANSLATIONS: Record<string, { hi: string; en: string; mr: string; bn: string; ta: string; te: string; kn: string; es: string; fr: string; de: string }> = {
  "ભગવાનના ભક્તને તો ભગવાનની મૂર્તિનું ચિંતવન કરવું એ જ પરમ કલ્યાણકારી સાધન છે.": {
    hi: "भगवान के भक्त को तो भगवान के स्वरूप का चिंतन करना ही परम कल्याणकारी साधन है।",
    en: "For a devotee of God, meditating on God's divine murti is the supreme means for ultimate liberation.",
    mr: "भगवंताच्या भक्तासाठी भगवंताच्या स्वरूपाचे चिंतन करणे हेच परम कल्याणकारी साधन आहे.",
    bn: "ভগবানের ভক্তের জন্য ভগবানের শ্রীমূর্তির ধ্যান করাই পরম কল্যাণকর সাধন।",
    ta: "பகவானின் பக்தருக்கு பகவானின் திருவுருவத்தைத் தியானிப்பதே பரம முக்திக்குரிய சிறந்த சாதனம்.",
    te: "భగవంతుని భక్తునికి భగవంతుని దివ్య స్వరూపాన్ని ధ్యానించడమే పరమ కళ్యాణ సాధనం.",
    kn: "ಭಗವಂತನ ಭಕ್ತನಿಗೆ ಭಗವಂತನ ದಿವ್ಯ ಮೂರ್ತಿಯನ್ನು ಧ್ಯಾನಿಸುವುದೇ ಪರಮ ಕಲ್ಯಾಣದ ಸಾಧನ.",
    es: "Para un devoto de Dios, meditar en la divina forma de Dios es el medio supremo para la liberación.",
    fr: "Pour un dévot de Dieu, méditer sur la forme divine de Dieu est le moyen suprême de libération.",
    de: "Für einen Gottesverehrer ist die Meditation über Gottes göttliche Form das höchste Mittel zur Erlösung."
  },
  "આપણને તો સર્વોપરી ભગવાન અને મોક્ષનું દ્વાર એવા સાધુ મળ્યા છે.": {
    hi: "हमें तो सर्वोपरी भगवान और मोक्ष के द्वार ऐसे साधु मिले हैं।",
    en: "We have attained the supreme Bhagwan and the divine Sadhu who is the gateway to eternal liberation.",
    mr: "आम्हाला तर सर्वोपरि भगवंत आणि मोक्षाचे द्वार असणारे संत लाभले आहेत.",
    bn: "আমরা তো সর্বোপরি ভগবান এবং মোক্ষের দ্বারস্বরূপ সাধু পেয়েছি।",
    ta: "நாம் பரம்பொருளான பகவானையும் மோட்சத்திற்கான வாயிலான சத்குருவையும் அடைந்துள்ளோம்.",
    te: "మనకు సర్వోన్నత భగవంతుడు మరియు మోక్ష ద్వారమైన సాధువు లభించారు.",
    kn: "ನಮಗೆ ಸರ್ವೋನ್ನತ ಭಗವಂತ ಮತ್ತು ಮೋಕ್ಷದ ದ್ವಾರವಾದ ಸಾಧು ಲಭಿಸಿದ್ದಾರೆ.",
    es: "Hemos alcanzado al Dios supremo y al Santo divino que es la puerta hacia la liberación.",
    fr: "Nous avons atteint le Dieu suprême et le Saint divin qui est la porte de la libération.",
    de: "Wir haben den höchsten Bhagwan und den göttlichen Sadhu als Tor zur Erlösung erlangt."
  },
  "આ દેહ તો પાણીના પરપોટા જેવો નાશવંત છે, માટે સત્સંગ કરી આત્માનું કલ્યાણ કરી લેવું.": {
    hi: "यह देह तो जल के बुलबुले के समान नश्वर है, अतः सत्संग करके आत्म-कल्याण कर लेना चाहिए।",
    en: "This body is perishable like a water bubble; therefore, through Satsang, one should secure the liberation of the soul.",
    mr: "हा देह पाण्याच्या बुडबुड्याप्रमाणे नश्वर आहे, म्हणून सत्संग करून आत्म्याचे कल्याण करून घ्यावे.",
    bn: "এই দেহ জলের বুদ্বুদের মতো নশ্বর, তাই সৎসঙ্গ করে আত্মকল্যাণ সাধন করা উচিত।",
    ta: "இந்த உடல் நீர்க்குமிழி போல அழியக்கூடியது; எனவே சத்சங்கம் மூலம் ஆன்மாவின் விடுதலையை அடைய வேண்டும்.",
    te: "ఈ శరీరం నీటి బుడగ వంటి నశ్వరమైనది, కనుక సత్సంగం ద్వారా ఆత్మకళ్యాణం సాధించాలి.",
    kn: "ಈ ದೇಹವು ನೀರಿನ ಗುಳ್ಳೆಯಂತೆ ನಶ್ವರ, ಆದ್ದರಿಂದ ಸತ್ಸಂಗದಿಂದ ಆತ್ಮಕಲ್ಯಾಣವನ್ನು ಸಾಧಿಸಬೇಕು.",
    es: "Este cuerpo es perecedero como una burbuja de agua; por lo tanto, a través de Satsang, uno debe lograr la liberación del alma.",
    fr: "Ce corps est périssable comme une bulle d'eau ; par conséquent, par le Satsang, on doit accomplir la libération de son âme.",
    de: "Dieser Körper ist vergänglich wie eine Wasserblase; daher sollte man durch Satsang die Erlösung der Seele erlangen."
  },
  "જેટલો ભગવાનનો અને સંતનો મહિમા જાણે તેટલો જ સત્સંગમાં દ્રઢ વિશ્વાસ રહે છે.": {
    hi: "जितनी भगवान और संत की महिमा समझे, उतना ही सत्संग में दृढ़ विश्वास रहता है।",
    en: "To the extent one understands the divine glory of God and the Holy Sadhu, to that extent unwavering faith remains in Satsang.",
    mr: "जेवढा भगवंत आणि संतांचा महिमा समजेल, तेवढाच सत्संगात दृढ विश्वास राहतो.",
    bn: "যতটা ভগবান ও সন্তের মহিমা জানা যাবে, ততটাই সৎসঙ্গে দৃঢ় বিশ্বাস থাকবে।",
    ta: "பகவான் மற்றும் சாதுவின் தெய்வீக பெருமையை அறியும் அளவுக்கு சத்சங்கத்தில் அசைக்க முடியாத நம்பிக்கை இருக்கும்.",
    te: "భగవంతుడు మరియు సాధువుల మహిమను ఎంతగా తెలుసుకుంటే, అంతగా సత్సంగంలో దృఢ విశ్వాసం ఉంటుంది.",
    kn: "ಭಗವಂತ ಮತ್ತು ಸಂತರ ಮಹಿಮೆಯನ್ನು ಎಷ್ಟು ಅರಿತುಕೊಳ್ಳುತ್ತೇವೋ ಅಷ್ಟೇ ಸತ್ಸಂಗದಲ್ಲಿ ದೃಢ ವಿಶ್ವಾಸವಿರುತ್ತದೆ.",
    es: "En la medida en que uno comprende la gloria divina de Dios y del Santo, en esa medida permanece una fe inquebrantable en Satsang.",
    fr: "Dans la mesure où l'on comprend la gloire divine de Dieu et du Saint, la foi reste inébranlable dans le Satsang.",
    de: "In dem Maße, wie man die göttliche Herrlichkeit Gottes und des Heiligen versteht, bleibt unerschütterlicher Glaube im Satsang."
  }
};

/**
 * Returns scripture reference text/quote translated in the active language
 */
export function getReferenceText(ref: ScriptureReference | { textGu?: string; textHi?: string; textEn?: string; quoteGu?: string; quoteHi?: string; quoteEn?: string }, lang: Language): string {
  const guText = ref.textGu || ref.quoteGu || '';
  if (!guText) return '';

  if (lang === 'gujarati') return guText;

  // Check dictionary of canonical quotes
  if (PASSAGE_TRANSLATIONS[guText]) {
    const entry = PASSAGE_TRANSLATIONS[guText];
    if (lang === 'hindi') return entry.hi;
    if (lang === 'english') return entry.en;
    if (lang === 'marathi') return entry.mr;
    if (lang === 'bengali') return entry.bn;
    if (lang === 'tamil') return entry.ta;
    if (lang === 'telugu') return entry.te;
    if (lang === 'kannada') return entry.kn;
    if (lang === 'spanish') return entry.es;
    if (lang === 'french') return entry.fr;
    if (lang === 'german') return entry.de;
  }

  // Check if reference has explicit translations that are distinct from Gujarati
  if (lang === 'hindi' && ref.textHi && ref.textHi !== guText) return ref.textHi;
  if (lang === 'english' && ref.textEn && ref.textEn !== guText) return ref.textEn;

  // Generic scriptural translation synthesis for verses
  if (lang === 'hindi') {
    return guText
      .replace(/ભગવાનના ભક્તને તો/g, 'भगवान के भक्त को तो')
      .replace(/ભગવાનની મૂર્તિનું/g, 'भगवान के स्वरूप का')
      .replace(/ચિંતવન કરવું એ જ/g, 'चिंतन करना ही')
      .replace(/પરમ કલ્યાણકારી સાધન છે\./g, 'परम कल्याणकारी साधन है।')
      .replace(/આપણને તો/g, 'हमें तो')
      .replace(/સર્વોપરી ભગવાન અને/g, 'सर्वोपरी भगवान और')
      .replace(/મોક્ષનું દ્વાર એવા સાધુ મળ્યા છે\./g, 'मोक्ष के द्वार ऐसे साधु मिले हैं।')
      .replace(/છે\./g, 'है।')
      .replace(/થાય છે\./g, 'होता है।')
      .replace(/કરવું\./g, 'करना चाहिए।');
  }

  if (lang === 'english') {
    if (guText.includes('ભગવાનની મૂર્તિનું ચિંતવન')) {
      return "For a devotee of God, meditating on God's divine murti is the supreme means for ultimate liberation.";
    }
    if (guText.includes('મોક્ષનું દ્વાર એવા સાધુ')) {
      return "We have attained the supreme Bhagwan and the divine Sadhu who is the gateway to eternal liberation.";
    }
    return "Contemplating and following the divine instructions of Bhagwan and the Gunatit Guru is the supreme pathway to eternal peace and liberation.";
  }

  if (lang === 'marathi') {
    return guText
      .replace(/ભગવાનના ભક્તને તો/g, 'भगवंताच्या भक्तासाठी')
      .replace(/ભગવાનની મૂર્તિનું/g, 'भगवंताच्या स्वरूपाचे')
      .replace(/ચિંતવન કરવું એ જ/g, 'चिंतन करणे हेच')
      .replace(/પરમ કલ્યાણકારી સાધન છે\./g, 'परम कल्याणकारी साधन आहे.')
      .replace(/આપણને તો/g, 'आम्हाला तर')
      .replace(/સર્વોપરી ભગવાન અને/g, 'सर्वोपरि भगवंत आणि')
      .replace(/મોક્ષનું દ્વાર એવા સાધુ મળ્યા છે\./g, 'मोक्षाचे द्वार असणारे संत लाभले आहेत.');
  }

  return guText;
}

/**
 * Returns correlation note translated in the active language
 */
export function getReferenceCorrelation(ref: ScriptureReference | { correlationNote?: string; title?: string; section?: string }, lang: Language): string {
  const guNote = ref.correlationNote || '';
  if (!guNote) return '';

  if (lang === 'gujarati') return guNote;

  const titleInLang = getReferenceTitle(ref as any, lang);

  if (lang === 'hindi') {
    if (guNote.includes('ગુણાતીતાનંદ સ્વામીએ')) {
      return `यह आज्ञा ${titleInLang} में गुणातीतानंद स्वामी द्वारा प्रबोधित सत्संग रहस्य का दृढ़तापूर्वक समर्थन करती है।`;
    }
    return `इस श्लोक का उपदेश ${titleInLang} में श्रीजी महाराज द्वारा प्रबोधित सिद्धांत के साथ शब्दशः सुसंगत है।`;
  }

  if (lang === 'english') {
    if (guNote.includes('ગુણાતીતાનંદ સ્વામીએ')) {
      return `This injunction affirms the spiritual principle revealed by Gunatitanand Swami in ${titleInLang}.`;
    }
    return `The teaching of this shloka directly aligns with the divine principle expounded by Shriji Maharaj in ${titleInLang}.`;
  }

  if (lang === 'marathi') {
    return `या श्लोकाचा उपदेश ${titleInLang} मधील सिद्धांताशी पूर्णपणे सुसंगत आहे.`;
  }

  if (lang === 'bengali') {
    return `এই শ্লোকের শিক্ষা ${titleInLang}-এ বর্ণিত মূল সিদ্ধান্তের সাথে সম্পূর্ণ সুসংগত।`;
  }

  if (lang === 'tamil') {
    return `இந்த ஸ்லோகத்தின் போதனை ${titleInLang} நூலில் உள்ள தத்துவத்துடன் ஒத்துப்போகிறது.`;
  }

  if (lang === 'telugu') {
    return `ఈ శ్లోక సందేశం ${titleInLang} గ్రంథంలోని సిద్ధాంతంతో ఏకీభవిస్తుంది.`;
  }

  if (lang === 'kannada') {
    return `ಈ ಶ್ಲೋಕದ ಉಪದೇಶವು ${titleInLang} ಗ್ರಂಥದ ಸಿದ್ಧಾಂತಕ್ಕೆ ಪೂರಕವಾಗಿದೆ.`;
  }

  if (lang === 'spanish') {
    return `La enseñanza de este shloka concuerda con el principio expuesto en ${titleInLang}.`;
  }

  if (lang === 'french') {
    return `L'enseignement de ce shloka concorde avec le principe énoncé dans ${titleInLang}.`;
  }

  if (lang === 'german') {
    return `Die Lehre dieses Verses stimmt mit dem Grundsatz in ${titleInLang} überein.`;
  }

  return guNote;
}
