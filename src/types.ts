export type Language = 'gujarati' | 'hindi' | 'english' | 'all';

export type SanskritScript = 'devanagari' | 'gujarati' | 'iast';

export type ThemeMode = 'light' | 'sepia' | 'dark';

export type MukhpathLevel = 'unlearned' | 'learning' | 'memorized' | 'mastered';

export interface WordMeaning {
  word: string;
  transliteration?: string;
  meaningGu: string;
  meaningHi: string;
  meaningEn: string;
  scriptureReference?: {
    source: string; // e.g. 'વચનામૃત ગઢડા પ્રથમ ૧' or 'સ્વામીની વાત ૧/૩'
    quoteGu: string;
    correlation: string;
  };
}

export interface ScriptureReference {
  type: 'vachnamrut' | 'swamini_vato' | 'shikshapatri';
  title: string;
  section: string;
  textGu: string;
  textHi: string;
  textEn: string;
  correlationNote: string;
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
  padachheda?: WordMeaning[];
  anwayarthGu?: string;
  anwayarthHi?: string;
  anwayarthEn?: string;
  tags: string[];
  crossReferences?: ScriptureReference[];
  keyTeaching?: string;
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

export interface UserPreferences {
  activeLanguage: Language;
  sanskritScript: SanskritScript;
  theme: ThemeMode;
  fontSize: number; // in px, e.g. 18
  showWordBreakdownDefault: boolean;
  showCommentaryDefault: boolean;
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
