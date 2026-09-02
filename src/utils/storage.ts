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
  { id: 'gujarati', nameGu: 'ગુજરાતી ભાષાંતર અને પદચ્છેદ', nameEn: 'Gujarati (Default Core Pack)', nativeName: 'ગુજરાતી', sizeMb: 2.4, isDefaultInstalled: true },
  { id: 'hindi', nameGu: 'હિન્દી ભાવાર્થ અને સંદર્ભ', nameEn: 'Hindi Commentary & Meaning', nativeName: 'हिन्दी', sizeMb: 2.1, isDefaultInstalled: true },
  { id: 'english', nameGu: 'અંગ્રેજી અનુવાદ અને વ્યાખ્યા', nameEn: 'English Translation & Purport', nativeName: 'English', sizeMb: 1.8, isDefaultInstalled: true },
  { id: 'portuguese', nameGu: 'પોર્ટુગીઝ ભાષાંતર પેક', nameEn: 'Portuguese Language Pack', nativeName: 'Português', sizeMb: 1.8 },
  { id: 'russian', nameGu: 'રશિયન ભાષાંતર પેક', nameEn: 'Russian Language Pack', nativeName: 'Русский', sizeMb: 2.1 },
  { id: 'greek', nameGu: 'ગ્રીક ભાષાંતર પેક', nameEn: 'Greek Language Pack', nativeName: 'Ελληνικά', sizeMb: 1.9 },
  { id: 'polish', nameGu: 'પોલિશ ભાષાંતર પેક', nameEn: 'Polish Language Pack', nativeName: 'Polski', sizeMb: 1.8 },
  { id: 'marathi', nameGu: 'મરાઠી પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Marathi Regional Language Pack', nativeName: 'मराठी', sizeMb: 1.6 },
  { id: 'punjabi', nameGu: 'પંજાબી પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Punjabi Regional Language Pack', nativeName: 'ਪੰਜਾਬੀ', sizeMb: 1.6 },
  { id: 'bengali', nameGu: 'બંગાળી પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Bengali Regional Language Pack', nativeName: 'বাংলা', sizeMb: 1.5 },
  { id: 'tamil', nameGu: 'તમિલ પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Tamil Regional Language Pack', nativeName: 'தமிழ்', sizeMb: 1.7 },
  { id: 'telugu', nameGu: 'તેલુગુ પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Telugu Regional Language Pack', nativeName: 'తెలుగు', sizeMb: 1.7 },
  { id: 'kannada', nameGu: 'કન્નડ પ્રાદેશિક ભાષાંતર પેક', nameEn: 'Kannada Regional Language Pack', nativeName: 'ಕನ್ನಡ', sizeMb: 1.6 },
  { id: 'spanish', nameGu: 'સ્પેનિશ ભાષાંતર પેક', nameEn: 'Spanish International Pack', nativeName: 'Español', sizeMb: 1.8 },
  { id: 'french', nameGu: 'ફ્રેન્ચ ભાષાંતર પેક', nameEn: 'French International Pack', nativeName: 'Français', sizeMb: 1.8 },
  { id: 'german', nameGu: 'જર્મન ભાષાંતર પેક', nameEn: 'German International Pack', nativeName: 'Deutsch', sizeMb: 1.9 }
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  activeLanguage: 'english',
  appLanguage: 'english',
  secondaryLanguages: ['gujarati', 'hindi'],
  sanskritScript: 'devanagari',
  theme: 'light',
  fontSize: 18,
  showWordBreakdownDefault: true,
  showCommentaryDefault: true,
  showGrammarDetails: true,
  reminder: {
    enabled: true,
    time: '19:40', // 07:40 PM as in user screenshot
    sound: true,
    vibrate: true,
    customMessage: 'સત્સંગ દીક્ષા સ્વાધ્યાય અને મુખપાઠ સાધના કરવાનો સમય થયો છે.'
  },
  installedLanguagePacks: ['gujarati', 'hindi', 'english', 'portuguese', 'russian', 'greek', 'polish'],
  dailyGoal: 1, // 1 Shloka daily reading target
  readerTimeout: '5 Minutes',
  autoSwipeOnRead: false,
  downloadWifiOnly: false,
  playingMethod: 'Stream and Save',
  autoMarkReadWithAudio: false
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
        secondaryLanguages: parsed.secondaryLanguages || DEFAULT_PREFERENCES.secondaryLanguages,
        readerTimeout: parsed.readerTimeout || DEFAULT_PREFERENCES.readerTimeout,
        autoSwipeOnRead: parsed.autoSwipeOnRead ?? DEFAULT_PREFERENCES.autoSwipeOnRead,
        downloadWifiOnly: parsed.downloadWifiOnly ?? DEFAULT_PREFERENCES.downloadWifiOnly,
        playingMethod: parsed.playingMethod || DEFAULT_PREFERENCES.playingMethod,
        autoMarkReadWithAudio: parsed.autoMarkReadWithAudio ?? DEFAULT_PREFERENCES.autoMarkReadWithAudio,
        dailyGoal: parsed.dailyGoal || DEFAULT_PREFERENCES.dailyGoal
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
