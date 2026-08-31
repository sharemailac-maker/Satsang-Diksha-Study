import { Bookmark, Language, LanguagePack, MukhpathRecord, UserPreferences } from '../types';

const STORAGE_KEYS = {
  PREFS: 'satsang_diksha_prefs',
  BOOKMARKS: 'satsang_diksha_bookmarks',
  MUKHPATH: 'satsang_diksha_mukhpath',
  LAST_READ: 'satsang_diksha_last_read',
  DOWNLOADED_PACKS: 'satsang_diksha_lang_packs',
  DAILY_STATS: 'satsang_diksha_daily_stats'
};

export const AVAILABLE_LANGUAGE_PACKS: LanguagePack[] = [
  { id: 'gujarati', nameGu: 'ગુજરાતી ભાષાંતર અને પદચ્છેદ', nameEn: 'Gujarati (Default Authentic)', nativeName: 'ગુજરાતી', sizeMb: 2.4, isDefaultInstalled: true },
  { id: 'hindi', nameGu: 'હિન્દી ભાવાર્થ અને સંદર્ભ', nameEn: 'Hindi Commentary & Meaning', nativeName: 'हिन्दी', sizeMb: 2.1, isDefaultInstalled: true },
  { id: 'english', nameGu: 'અંગ્રેજી અનુવાદ અને વ્યાખ્યા', nameEn: 'English Translation & Purport', nativeName: 'English', sizeMb: 1.8, isDefaultInstalled: true },
  { id: 'marathi', nameGu: 'મરાઠી ભાષાંતર', nameEn: 'Marathi Translation Pack', nativeName: 'मराठी', sizeMb: 1.6 },
  { id: 'bengali', nameGu: 'બંગાળી ભાષાંતર', nameEn: 'Bengali Translation Pack', nativeName: 'বাংলা', sizeMb: 1.5 },
  { id: 'tamil', nameGu: 'તમિલ ભાષાંતર', nameEn: 'Tamil Translation Pack', nativeName: 'தமிழ்', sizeMb: 1.7 },
  { id: 'telugu', nameGu: 'તેલુગુ ભાષાંતર', nameEn: 'Telugu Translation Pack', nativeName: 'తెలుగు', sizeMb: 1.7 },
  { id: 'kannada', nameGu: 'કન્નડ ભાષાંતર', nameEn: 'Kannada Translation Pack', nativeName: 'ಕನ್ನಡ', sizeMb: 1.6 }
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  activeLanguage: 'gujarati', // Default is Sanskrit to Gujarati as requested
  secondaryLanguages: ['hindi', 'english'],
  sanskritScript: 'devanagari',
  theme: 'light',
  fontSize: 18,
  showWordBreakdownDefault: true,
  showCommentaryDefault: true,
  showGrammarDetails: true,
  reminder: {
    enabled: true,
    time: '21:00', // 9:00 PM Indian Standard Time default as requested
    sound: true,
    vibrate: true,
    customMessage: 'સત્સંગ દીક્ષા સ્વાધ્યાય અને મુખપાઠ સાધના કરવાનો સમય થયો છે.'
  },
  installedLanguagePacks: ['gujarati', 'hindi', 'english'],
  dailyGoal: 5
};

export const StorageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (!data) return DEFAULT_PREFERENCES;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        reminder: {
          ...DEFAULT_PREFERENCES.reminder,
          ...(parsed.reminder || {})
        },
        installedLanguagePacks: parsed.installedLanguagePacks || DEFAULT_PREFERENCES.installedLanguagePacks,
        secondaryLanguages: parsed.secondaryLanguages || DEFAULT_PREFERENCES.secondaryLanguages
      };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  },

  installLanguagePack(lang: Language): Language[] {
    const prefs = this.getPreferences();
    const current = new Set<Language>(prefs.installedLanguagePacks || ['gujarati', 'hindi', 'english']);
    current.add(lang);
    const updated: Language[] = Array.from(current);
    prefs.installedLanguagePacks = updated;
    this.savePreferences(prefs);
    return updated;
  },

  uninstallLanguagePack(lang: Language): Language[] {
    if (lang === 'gujarati') return ['gujarati']; // Gujarati cannot be uninstalled
    const prefs = this.getPreferences();
    const updated: Language[] = (prefs.installedLanguagePacks || []).filter(l => l !== lang);
    prefs.installedLanguagePacks = updated;
    if (prefs.activeLanguage === lang) {
      prefs.activeLanguage = 'gujarati';
    }
    this.savePreferences(prefs);
    return updated;
  },

  getBookmarks(): Bookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(shlokaId: number, note?: string): boolean {
    const list = this.getBookmarks();
    const idx = list.findIndex(b => b.shlokaId === shlokaId);
    if (idx >= 0) {
      list.splice(idx, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return false; // Removed
    } else {
      list.push({ shlokaId, createdAt: Date.now(), note });
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      return true; // Added
    }
  },

  updateBookmarkNote(shlokaId: number, note: string): void {
    const list = this.getBookmarks();
    const item = list.find(b => b.shlokaId === shlokaId);
    if (item) {
      item.note = note;
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    }
  },

  getMukhpathRecords(): Record<number, MukhpathRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MUKHPATH);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveMukhpathRecord(shlokaId: number, status: MukhpathRecord['status']): void {
    try {
      const records = this.getMukhpathRecords();
      const existing = records[shlokaId] || { shlokaId, status: 'unlearned', recitationCount: 0, lastPracticed: Date.now() };
      records[shlokaId] = {
        ...existing,
        status,
        recitationCount: existing.recitationCount + 1,
        lastPracticed: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.MUKHPATH, JSON.stringify(records));
    } catch {
      // ignore
    }
  },

  getLastReadShloka(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.LAST_READ);
      return val ? parseInt(val, 10) : 1;
    } catch {
      return 1;
    }
  },

  setLastReadShloka(id: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_READ, id.toString());
    } catch {
      // ignore
    }
  }
};
