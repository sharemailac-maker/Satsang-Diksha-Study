import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2
} from 'lucide-react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { MukhpathView } from './components/MukhpathView';
import { ChapterIndex } from './components/ChapterIndex';
import { CrossScriptureView } from './components/CrossScriptureView';
import { UdgaanView } from './components/UdgaanView';
import { QuizView } from './components/QuizView';
import { BookmarksView } from './components/BookmarksView';
import { SettingsModal } from './components/SettingsModal';
import { QuickJumpModal } from './components/QuickJumpModal';
import { AppUpdateBanner } from './components/AppUpdateBanner';
import { ScrollToTopButton } from './components/ScrollToTopButton';

import { getAllShlokas } from './data/shlokas';
import { CHAPTERS } from './data/chapters';
import { StorageService, DEFAULT_PREFERENCES } from './utils/storage';
import { NotificationService } from './utils/notificationService';
import { getUIStrings } from './utils/i18n';
import { recordOrFetchVisit } from './utils/hitCounter';
import { 
  UserPreferences, 
  Bookmark, 
  MukhpathLevel, 
  ScriptureReference 
} from './types';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.getBookmarks());
  const [mukhpathRecords, setMukhpathRecords] = useState<Record<number, { status: MukhpathLevel; recitationCount: number }>>(() => StorageService.getMukhpathRecords());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedShlokaId, setSelectedShlokaId] = useState<number | null>(null);
  
  // Modals state
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const ui = getUIStrings(preferences.appLanguage || preferences.activeLanguage);

  // All 315 Shlokas data
  const allShlokas = useMemo(() => getAllShlokas(), []);

  // Sync theme changes with DOM root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark', 'dark');
    if (preferences.theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (preferences.theme === 'sepia') {
      root.classList.add('theme-sepia');
    } else {
      root.classList.add('theme-light');
    }
    document.body.className = `theme-${preferences.theme} ${preferences.theme === 'dark' ? 'dark' : ''}`;
    StorageService.savePreferences(preferences);
  }, [preferences.theme]);

  // Anonymous aggregate visit registration on app launch
  useEffect(() => {
    recordOrFetchVisit();
  }, []);

  // Periodic check for Daily Study Reminder
  useEffect(() => {
    const checkReminder = () => {
      NotificationService.checkAndTriggerReminder(preferences.reminder);
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [preferences.reminder]);

  const handleUpdatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      StorageService.savePreferences(updated);
      return updated;
    });
  };

  const handleResetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    StorageService.savePreferences(DEFAULT_PREFERENCES);
  };

  const handleToggleBookmark = (shlokaId: number, note?: string) => {
    StorageService.toggleBookmark(shlokaId, note);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleUpdateBookmarkNote = (shlokaId: number, note: string) => {
    StorageService.updateBookmarkNote(shlokaId, note);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleUpdateMukhpathStatus = (shlokaId: number, status: MukhpathLevel) => {
    StorageService.saveMukhpathRecord(shlokaId, status);
    setMukhpathRecords(StorageService.getMukhpathRecords());
  };

  const handleJumpToShloka = (shlokaId: number) => {
    setSelectedShlokaId(shlokaId);
    setActiveTab('mukhpath');
    setSelectedChapterId(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter shlokas based on search and chapter selection
  const filteredShlokas = useMemo(() => {
    let result = allShlokas;

    if (selectedChapterId !== null) {
      result = result.filter(s => s.chapterId === selectedChapterId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const num = parseInt(q, 10);

      result = result.filter(s => {
        if (!isNaN(num) && s.id === num) return true;
        if (s.sanskritDevanagari.toLowerCase().includes(q)) return true;
        if (s.sanskritGujarati.toLowerCase().includes(q)) return true;
        if (s.sanskritIast.toLowerCase().includes(q)) return true;
        if (s.meaningGu.toLowerCase().includes(q)) return true;
        if (s.meaningHi.toLowerCase().includes(q)) return true;
        if (s.meaningEn.toLowerCase().includes(q)) return true;
        if (s.titleGu.toLowerCase().includes(q)) return true;
        if (s.tags.some(t => t.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return result;
  }, [allShlokas, selectedChapterId, searchQuery]);

  const bookmarkMap = useMemo(() => {
    const map = new Map<number, Bookmark>();
    bookmarks.forEach(b => map.set(b.shlokaId, b));
    return map;
  }, [bookmarks]);

  const memorizedTotal = useMemo(() => {
    return Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel }) => r.status === 'memorized' || r.status === 'mastered').length;
  }, [mukhpathRecords]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-amber-500/30 selection:text-[#8B2500] ${
      preferences.theme === 'dark'
        ? 'bg-[#171412] text-[#EDE5D8]'
        : preferences.theme === 'sepia'
          ? 'bg-[#F4ECD8] text-[#382513]'
          : 'bg-[#FDFBF7] text-[#2D241E]'
    }`}>
      {/* Automatic Background App Update Notification Banner */}
      <AppUpdateBanner language={preferences.appLanguage || preferences.activeLanguage} />

      {/* Header with Search and Language bar */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBookmarks={bookmarks.length}
      />

      {/* Secondary Tab Navigation (Desktop Top Bar & Mobile Bottom Bar) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mukhpathCount={memorizedTotal}
        totalBookmarks={bookmarks.length}
        preferences={preferences}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 pb-24 md:pb-16">
        {/* TAB 0: HOME PAGE */}
        {activeTab === 'home' && (
          <HomeView
            shlokas={allShlokas}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            mukhpathRecords={mukhpathRecords}
            totalBookmarks={bookmarks.length}
            onNavigateTab={(tab, chId) => {
              if (chId !== undefined && chId !== null) {
                setSelectedChapterId(chId);
              }
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectShloka={handleJumpToShloka}
            onOpenQuickJump={() => setIsQuickJumpOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* TAB 1: SHLOKA ADHYAYAN (Mukhpath Sadhna renamed to Shloka Adhyayan, positioned beside Home) */}
        {activeTab === 'mukhpath' && (
          <MukhpathView
            shlokas={allShlokas}
            preferences={preferences}
            mukhpathRecords={mukhpathRecords}
            onUpdateStatus={handleUpdateMukhpathStatus}
            onSelectShloka={handleJumpToShloka}
            selectedShlokaId={selectedShlokaId}
            searchQuery={searchQuery}
          />
        )}

        {/* TAB 2: UDGAAN AUDIO (VEDIC CHANTING) */}
        {activeTab === 'udgaan' && (
          <UdgaanView
            shlokas={allShlokas}
            preferences={preferences}
            onSelectShloka={handleJumpToShloka}
            onUpdatePreferences={handleUpdatePreferences}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 3: CHAPTERS INDEX */}
        {activeTab === 'chapters' && (
          <ChapterIndex
            chapters={CHAPTERS}
            shlokas={allShlokas}
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            mukhpathRecords={mukhpathRecords}
            onSelectChapter={(chId) => {
              setSelectedChapterId(chId);
            }}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 4: CROSS REFERENCES */}
        {activeTab === 'crossref' && (
          <CrossScriptureView
            shlokas={allShlokas}
            preferences={preferences}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 5: QUIZ & TEST */}
        {activeTab === 'quiz' && (
          <QuizView
            preferences={preferences}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 6: BOOKMARKS & NOTES */}
        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            shlokas={allShlokas}
            preferences={preferences}
            onRemoveBookmark={handleToggleBookmark}
            onSelectShloka={handleJumpToShloka}
          />
        )}
      </main>

      {/* Modals */}
      {isQuickJumpOpen && (
        <QuickJumpModal
          isOpen={isQuickJumpOpen}
          onClose={() => setIsQuickJumpOpen(false)}
          onJumpToShloka={handleJumpToShloka}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onResetPreferences={handleResetPreferences}
        />
      )}

      {/* Global Go to Top floating button */}
      <ScrollToTopButton preferences={preferences} />
    </div>
  );
}
