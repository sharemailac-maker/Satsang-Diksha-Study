import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Award, 
  Bookmark as BookmarkIcon, 
  Layers, 
  Link2, 
  RefreshCw, 
  Info, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Home,
  Smartphone
} from 'lucide-react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ShlokaCard } from './components/ShlokaCard';
import { MukhpathView } from './components/MukhpathView';
import { ChapterIndex } from './components/ChapterIndex';
import { CrossScriptureView } from './components/CrossScriptureView';
import { UdgaanView } from './components/UdgaanView';
import { CrossReferenceModal } from './components/CrossReferenceModal';
import { QuizView } from './components/QuizView';
import { BookmarksView } from './components/BookmarksView';
import { SettingsModal } from './components/SettingsModal';
import { QuickJumpModal } from './components/QuickJumpModal';
import { ApkBuildModal } from './components/ApkBuildModal';

import { SHLOKAS, getAllShlokas } from './data/shlokas';
import { CHAPTERS } from './data/chapters';
import { StorageService, DEFAULT_PREFERENCES } from './utils/storage';
import { NotificationService } from './utils/notificationService';
import { getUIStrings } from './utils/i18n';
import { 
  Shloka, 
  UserPreferences, 
  Bookmark, 
  MukhpathLevel, 
  ScriptureReference 
} from './types';
import heroBannerImg from './assets/images/app_banner_1788180199396.jpg';
import appIconImg from './assets/images/satsang_diksha_akshar_purushottam_logo_1788180536338.jpg';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.getBookmarks());
  const [mukhpathRecords, setMukhpathRecords] = useState<Record<number, { status: MukhpathLevel; recitationCount: number }>>(() => StorageService.getMukhpathRecords());
  const [activeTab, setActiveTab] = useState<string>('home'); // Default to Home page matching Vachnamrut Study App
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  
  // Modals state
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [activeCrossRef, setActiveCrossRef] = useState<ScriptureReference | null>(null);

  const ui = getUIStrings(preferences.activeLanguage);

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
    StorageService.savePreferences(preferences);
  }, [preferences]);

  // Periodic check for Daily Study Reminder
  useEffect(() => {
    const checkReminder = () => {
      NotificationService.checkAndTriggerReminder(preferences.reminder);
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000); // Check every 60 seconds
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
    setActiveTab('reader');
    setSelectedChapterId(null);
    setSearchQuery('');
    setTimeout(() => {
      const elem = document.getElementById(`shloka-card-${shlokaId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
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
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#171412] text-[#2D241E] dark:text-[#EDE5D8] transition-colors duration-200 selection:bg-amber-500/30 selection:text-[#8B2500]">
      {/* Header with Search and Language bar */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
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
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 pb-24 md:pb-16">
        {/* TAB 0: HOME PAGE (Vachnamrut Study App Layout) */}
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

        {/* TAB 1: SCRIPTURE READER */}
        {activeTab === 'reader' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
            {/* Chapter Filter Pill Bar */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedChapterId(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedChapterId === null
                    ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                    : 'bg-white dark:bg-[#221D1A] border border-[#E8DFD1] dark:border-[#3D342C] text-[#6B5E51] dark:text-[#C5B7A8] hover:bg-[#FAF6F0]'
                }`}
              >
                {ui.allShlokas}
              </button>
              {CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    selectedChapterId === ch.id
                      ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                      : 'bg-white dark:bg-[#221D1A] border border-[#E8DFD1] dark:border-[#3D342C] text-[#6B5E51] dark:text-[#C5B7A8] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {ui.chapterPrefix} {ch.id}: {preferences.activeLanguage === 'hindi' ? ch.titleHi : ch.titleGu}
                </button>
              ))}
            </div>

            {/* Showing Count & Reset */}
            <div className="flex items-center justify-between text-xs text-[#7A6B5C] dark:text-[#A89D91]">
              <span>
                {ui.filterShowingCount} <strong>{filteredShlokas.length}</strong> / 315
                {selectedChapterId !== null && ` (${ui.chapterPrefix} ${selectedChapterId})`}
                {searchQuery && ` (${searchQuery})`}
              </span>
              {(selectedChapterId !== null || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedChapterId(null);
                    setSearchQuery('');
                  }}
                  className="text-[#8B2500] dark:text-amber-400 font-semibold hover:underline"
                >
                  {ui.clearFilter}
                </button>
              )}
            </div>

            {/* Shloka Cards List */}
            {filteredShlokas.length > 0 ? (
              <div className="space-y-6">
                {filteredShlokas.map(shloka => {
                  const bookmark = bookmarkMap.get(shloka.id);
                  const isBookmarked = !!bookmark;
                  const mRecord = mukhpathRecords[shloka.id];
                  const mStatus = mRecord?.status || 'unlearned';

                  return (
                    <ShlokaCard
                      key={shloka.id}
                      shloka={shloka}
                      preferences={preferences}
                      isBookmarked={isBookmarked}
                      onToggleBookmark={handleToggleBookmark}
                      bookmarkNote={bookmark?.note}
                      onUpdateBookmarkNote={handleUpdateBookmarkNote}
                      mukhpathStatus={mStatus}
                      onUpdateMukhpathStatus={handleUpdateMukhpathStatus}
                      onOpenCrossRef={(ref) => setActiveCrossRef(ref)}
                      highlightQuery={searchQuery}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-12 text-center border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
                <Search className="w-12 h-12 text-amber-500 mx-auto opacity-60" />
                <h3 className="text-base font-serif font-bold text-[#8B2500] dark:text-amber-300">
                  {ui.noShlokasFound}
                </h3>
                <p className="text-xs text-[#6B5E51] dark:text-[#A89886]">
                  {ui.noShlokasDesc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: UDGAAN AUDIO (BAPS VEDIC CHANTING) */}
        {activeTab === 'udgaan' && (
          <UdgaanView
            shlokas={allShlokas}
            preferences={preferences}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 2: MUKHPATH STUDY */}
        {activeTab === 'mukhpath' && (
          <MukhpathView
            shlokas={allShlokas}
            preferences={preferences}
            mukhpathRecords={mukhpathRecords}
            onUpdateStatus={handleUpdateMukhpathStatus}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 3: CHAPTERS INDEX */}
        {activeTab === 'chapters' && (
          <ChapterIndex
            chapters={CHAPTERS}
            preferences={preferences}
            mukhpathRecords={mukhpathRecords}
            onSelectChapter={(chId) => {
              setSelectedChapterId(chId);
              setActiveTab('reader');
            }}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 4: CROSS REFERENCES */}
        {activeTab === 'crossref' && (
          <CrossScriptureView
            shlokas={allShlokas}
            preferences={preferences}
            onOpenCrossRef={(ref) => setActiveCrossRef(ref)}
            onSelectShloka={handleJumpToShloka}
          />
        )}

        {/* TAB 5: QUIZ & TEST */}
        {activeTab === 'quiz' && (
          <QuizView onSelectShloka={handleJumpToShloka} />
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
      <QuickJumpModal
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        onJumpToShloka={handleJumpToShloka}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onResetPreferences={handleResetPreferences}
      />

      <ApkBuildModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        preferences={preferences}
      />

      <CrossReferenceModal
        reference={activeCrossRef}
        preferences={preferences}
        onClose={() => setActiveCrossRef(null)}
      />
    </div>
  );
}
