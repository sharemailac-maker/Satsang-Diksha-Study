import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Settings, 
  Sun, 
  Moon, 
  Compass, 
  Bookmark as BookmarkIcon,
  Hash
} from 'lucide-react';
import { Language, SanskritScript, ThemeMode, UserPreferences } from '../types';
import appIconImg from '../assets/images/satsang_diksha_app_icon_1787932968623.jpg';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickJump: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalBookmarks: number;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  searchQuery,
  onSearchChange,
  onOpenQuickJump,
  onOpenSettings,
  activeTab,
  setActiveTab,
  totalBookmarks
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'sepia', 'dark'];
    const nextIdx = (themes.indexOf(preferences.theme) + 1) % themes.length;
    onUpdatePreferences({ theme: themes[nextIdx] });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#8B2500] text-white shadow-lg border-b border-[#A63000]/60">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Holy Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('reader')}>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md border-2 border-amber-300/80 bg-amber-950 flex-shrink-0">
            <img 
              src={appIconImg} 
              alt="Satsang Diksha Holy Scripture" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight text-amber-100 flex items-center gap-1.5">
                <span>સત્સંગ દીક્ષા</span>
                <span className="text-amber-300 text-xs sm:text-sm font-sans font-normal opacity-90">| सत्सङ्गदीक्षा</span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/90 font-sans tracking-wide">
              BAPS Swaminarayan Scripture Study • 315 Shlokas
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Jump Button */}
          <button
            id="header-quick-jump-btn"
            onClick={onOpenQuickJump}
            title="Jump to Shloka # (1-315)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold transition"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1 - 315</span>
          </button>

          {/* Search Toggle */}
          <button
            id="header-search-toggle-btn"
            onClick={() => setShowSearchInput(!showSearchInput)}
            title="Search Shlokas"
            className={`p-2 rounded-lg transition ${showSearchInput ? 'bg-amber-400 text-amber-950' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Quick Switcher */}
          <button
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            title={`Current Theme: ${preferences.theme}`}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition"
          >
            {preferences.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title="Study & Reading Preferences"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {showSearchInput && (
        <div className="bg-[#6E1C00] px-4 py-2 border-t border-amber-500/30 animate-fadeIn">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-300" />
            <input
              type="text"
              id="global-shloka-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by shloka #, Sanskrit words, Gujarati/Hindi/English meaning, or tags..."
              className="w-full bg-black/20 text-white placeholder-amber-200/60 text-sm px-3 py-1.5 rounded-lg border border-amber-400/30 focus:outline-none focus:border-amber-300"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-amber-300 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Language & Script Toolbar */}
      <div className="bg-[#541500]/95 px-3 sm:px-6 py-1.5 border-t border-amber-900 flex items-center justify-between text-xs overflow-x-auto gap-2">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-amber-300/80 mr-1 text-[11px] font-medium hidden sm:inline">ભાષા / Language:</span>
          {(['all', 'gujarati', 'hindi', 'english'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdatePreferences({ activeLanguage: lang })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                preferences.activeLanguage === lang
                  ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang === 'all' && 'All / ત્રિભાષા'}
              {lang === 'gujarati' && 'ગુજરાતી'}
              {lang === 'hindi' && 'हिन्दी'}
              {lang === 'english' && 'English'}
            </button>
          ))}
        </div>

        {/* Sanskrit Script Selector */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-amber-300/80 mr-1 text-[11px] font-medium hidden sm:inline">લિપિ / Script:</span>
          {(['devanagari', 'gujarati', 'iast'] as SanskritScript[]).map((script) => (
            <button
              key={script}
              onClick={() => onUpdatePreferences({ sanskritScript: script })}
              className={`px-2 py-0.5 rounded text-[11px] transition ${
                preferences.sanskritScript === script
                  ? 'bg-amber-300 text-amber-950 font-bold'
                  : 'text-amber-200/70 hover:bg-white/10'
              }`}
            >
              {script === 'devanagari' && 'संस्कृत (देवनागरी)'}
              {script === 'gujarati' && 'સંસ્કૃત (ગુજરાતી)'}
              {script === 'iast' && 'IAST (Roman)'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
