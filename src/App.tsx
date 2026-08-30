import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ShlokaCard } from './components/ShlokaCard';
import { MukhpathView } from './components/MukhpathView';
import { ChapterIndex } from './components/ChapterIndex';
import { CrossScriptureView } from './components/CrossScriptureView';
import { CrossReferenceModal } from './components/CrossReferenceModal';
import { QuizView } from './components/QuizView';
import { BookmarksView } from './components/BookmarksView';
import { SettingsModal } from './components/SettingsModal';
import { QuickJumpModal } from './components/QuickJumpModal';

import { SHLOKAS, getAllShlokas } from './data/shlokas';
import { CHAPTERS } from './data/chapters';
import { StorageService, DEFAULT_PREFERENCES } from './utils/storage';
import { 
  Shloka, 
  UserPreferences, 
  Bookmark, 
  MukhpathLevel, 
  ScriptureReference 
} from './types';
import heroBannerImg from './assets/images/satsang_diksha_banner_1787932984420.jpg';
import appIconImg from './assets/images/satsang_diksha_app_icon_1787932968623.jpg';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => StorageService.getBookmarks());
  const [mukhpathRecords, setMukhpathRecords] = useState<Record<number, { status: MukhpathLevel; recitationCount: number }>>(() => StorageService.getMukhpathRecords());
  const [activeTab, setActiveTab] = useState<string>('reader');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  
  // Modals state
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeCrossRef, setActiveCrossRef] = useState<ScriptureReference | null>(null);

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
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#171412] text-[#2D241E] dark:text-[#EDE5D8] transition-colors duration-200">
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

      {/* Secondary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        mukhpathCount={memorizedTotal}
        totalBookmarks={bookmarks.length}
      />

      {/* Main App Canvas */}
      <main className="flex-1 pb-16">
        {/* TAB 1: SCRIPTURE READER */}
        {activeTab === 'reader' && (
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
            {/* Hero Study Header with Holy Scripture Artwork */}
            {selectedChapterId === null && !searchQuery && (
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-400/40 bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] text-white">
                <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-semibold border border-amber-300/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રણીત</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 leading-tight">
                      સત્સંગ દીક્ષા અધ્યયન ગ્રંથ
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
                      અક્ષર-પુરુષોત્તમ ઉપાસના, નિત્ય વિધિ, આહારશુદ્ધિ, સદાચાર અને બ્રહ્મવિદ્યાનું માર્ગદર્શન આપતા ૩૧૫ સંસ્કૃત શ્લોકો ત્રિભાષા (ગુજરાતી, હિન્દી, અંગ્રેજી) અર્થ, પદચ્છેદ અને વચનામૃત-સ્વામીની વાતો સંદર્ભ સાથે.
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
                      <button
                        onClick={() => setIsQuickJumpOpen(true)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-md transition flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>શ્લોક પર જાઓ (1 - 315)</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('mukhpath')}
                        className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold border border-amber-300/40 transition flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>મુખપાઠ સાધના શરૂ કરો</span>
                      </button>
                    </div>
                  </div>

                  {/* Holy Artwork / Icon Banner */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/70 flex-shrink-0 bg-amber-950">
                    <img 
                      src={appIconImg} 
                      alt="Satsang Diksha Holy Granth Blessing" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

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
                સર્વ શ્લોકો (All 315)
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
                  પ્રકરણ {ch.id}: {ch.titleGu}
                </button>
              ))}
            </div>

            {/* Showing Count & Reset */}
            <div className="flex items-center justify-between text-xs text-[#7A6B5C] dark:text-[#A89D91]">
              <span>
                દર્શાવેલ શ્લોકો: <strong>{filteredShlokas.length}</strong> of 315
                {selectedChapterId !== null && ` (પ્રકરણ ${selectedChapterId})`}
                {searchQuery && ` (શોધ: "${searchQuery}")`}
              </span>
              {(selectedChapterId !== null || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedChapterId(null);
                    setSearchQuery('');
                  }}
                  className="text-[#8B2500] dark:text-amber-400 font-semibold hover:underline"
                >
                  ફિલ્ટર હટાવો (Clear Filter)
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
                  કોઈ મેળ ખાતો શ્લોક મળ્યો નથી
                </h3>
                <p className="text-xs text-[#6B5E51] dark:text-[#A89886]">
                  "{searchQuery}" માટે કોઈ પરિણામ મળ્યું નથી. કૃપા કરીને શ્લોક નંબર (૧ થી ૩૧૫) અથવા અન્ય શબ્દો વડે શોધો.
                </p>
              </div>
            )}
          </div>
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

      <CrossReferenceModal
        reference={activeCrossRef}
        onClose={() => setActiveCrossRef(null)}
      />
    </div>
  );
}
