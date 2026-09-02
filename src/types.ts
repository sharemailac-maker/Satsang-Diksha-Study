export type Language = 
  | 'gujarati' 
  | 'hindi' 
  | 'english' 
  | 'marathi' 
  | 'punjabi' 
  | 'bengali' 
  | 'tamil' 
  | 'telugu' 
  | 'kannada' 
  | 'spanish' 
  | 'french' 
  | 'german'
  | 'portuguese'
  | 'russian'
  | 'greek'
  | 'polish';

export type SanskritScript = 'devanagari' | 'gujarati' | 'iast';

export type ThemeMode = 'light' | 'sepia' | 'dark';

export type MukhpathLevel = 'unlearned' | 'learning' | 'memorized' | 'mastered';

export interface WordMeaning {
  word: string;
  transliteration?: string;
  meaningGu: string;
  meaningHi: string;
  meaningEn: string;
  meaningMr?: string;
  meaningPa?: string;
  meaningBn?: string;
  meaningTa?: string;
  meaningTe?: string;
  meaningKn?: string;
  meaningEs?: string;
  meaningFr?: string;
  meaningDe?: string;
  meaningPt?: string;
  meaningRu?: string;
  meaningEl?: string;
  meaningPl?: string;
  grammaticalRole?: string;
  grammar?: string;
  gujarati?: string;
  hindi?: string;
  english?: string;
  scriptureReference?: {
    source: string; // e.g. 'વચનામૃત ગઢડા પ્રથમ ૧' or 'સ્વામીની વાત ૧/૩'
    quoteGu: string;
    correlation: string;
  };
}

export interface ScriptureReference {
  type?: 'vachnamrut' | 'swamini_vato' | 'shikshapatri' | string;
  source?: string;
  title?: string;
  titleGu?: string;
  titleHi?: string;
  titleEn?: string;
  section?: string;
  topic?: string;
  textGu?: string;
  textHi?: string;
  textEn?: string;
  quoteGu?: string;
  quoteHi?: string;
  quoteEn?: string;
  correlationNote?: string;
}

export interface Shloka {
  id: number;
  chapterId: number;
  chapterGu: string;
  chapterHi: string;
  chapterEn: string;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  sanskritDevanagari: string;
  sanskritGujarati: string;
  sanskritIast: string;
  meaningGu: string;
  meaningHi: string;
  meaningEn: string;
  meaningMr?: string;
  meaningPa?: string;
  meaningBn?: string;
  meaningTa?: string;
  meaningTe?: string;
  meaningKn?: string;
  meaningEs?: string;
  meaningFr?: string;
  meaningDe?: string;
  meaningPl?: string;
  meaningPt?: string;
  meaningEl?: string;
  meaningRu?: string;
  padachheda?: WordMeaning[];
  anwayarthGu?: string;
  anwayarthHi?: string;
  anwayarthEn?: string;
  tags: string[];
  crossReferences?: ScriptureReference[];
  keyTeaching?: string;
  commentaryGu?: string;
  commentaryHi?: string;
  commentaryEn?: string;
}

export interface Chapter {
  id: number;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  shlokaRange: [number, number];
  descriptionGu: string;
  descriptionHi: string;
  descriptionEn: string;
  themeColor: string;
  iconName: string;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // e.g. "21:00" for 9:00 PM IST
  sound: boolean;
  vibrate: boolean;
  customMessage?: string;
}

export interface LanguagePack {
  id: Language;
  nameGu: string;
  nameEn: string;
  nativeName: string;
  sizeMb: number;
  isDefaultInstalled?: boolean;
}

export interface UserPreferences {
  activeLanguage: Language; // Primary language (Default: 'gujarati')
  appLanguage?: Language; // Application UI language
  secondaryLanguages: Language[];
  sanskritScript: SanskritScript;
  theme: ThemeMode;
  fontSize: number; // in px, e.g. 18
  showWordBreakdownDefault: boolean;
  showCommentaryDefault: boolean;
  showGrammarDetails: boolean;
  reminder: ReminderSettings;
  installedLanguagePacks: Language[];
  dailyGoal: number; // shlokas per day, default 1 or 5

  // Reader Screen preferences from settings
  readerTimeout?: string; // e.g. '5 Minutes', '10 Minutes', '15 Minutes', 'Never'
  autoSwipeOnRead?: boolean; // Auto Swipe when 'Mark as Read'

  // Audio preferences from settings
  downloadWifiOnly?: boolean; // Download using Wi-Fi Only
  playingMethod?: string; // 'Stream and Save' | 'Stream Only' | 'Download All'
  autoMarkReadWithAudio?: boolean; // Auto 'Mark as Read' with audio
}

export interface Bookmark {
  shlokaId: number;
  createdAt: number;
  note?: string;
  category?: string;
}

export interface MukhpathRecord {
  shlokaId: number;
  status: MukhpathLevel;
  lastPracticed: number;
  recitationCount: number;
}

export interface QuizQuestion {
  id: string;
  shlokaId: number;
  type: 'verse_to_meaning' | 'fill_blank' | 'cross_reference' | 'true_false';
  question: string;
  questionLang: Language;
  options: string[];
  correctIndex: number;
  explanation: string;
}
