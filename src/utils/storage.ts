import { Bookmark, MukhpathRecord, UserPreferences } from '../types';

const STORAGE_KEYS = {
  PREFS: 'satsang_diksha_prefs',
  BOOKMARKS: 'satsang_diksha_bookmarks',
  MUKHPATH: 'satsang_diksha_mukhpath',
  LAST_READ: 'satsang_diksha_last_read'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  activeLanguage: 'all',
  sanskritScript: 'devanagari',
  theme: 'light',
  fontSize: 18,
  showWordBreakdownDefault: false,
  showCommentaryDefault: false
};

export const StorageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFS);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
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
