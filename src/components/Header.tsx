import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Settings, 
  Sun, 
  Moon, 
  Compass, 
  Bookmark as BookmarkIcon,
  Hash,
  Home,
  Languages,
  Bell,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Language, SanskritScript, ThemeMode, UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';
import appIconImg from '../assets/images/satsang_diksha_akshar_purushottam_logo_1788180536338.jpg';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickJump: () => void;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
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
  onOpenApkModal,
  activeTab,
  setActiveTab,
  totalBookmarks
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const ui = getUIStrings(preferences.activeLanguage);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'sepia', 'dark'];
    const nextIdx = (themes.indexOf(preferences.theme) + 1) % themes.length;
    onUpdatePreferences({ theme: themes[nextIdx] });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#7A1E00] text-white shadow-lg border-b border-[#A63000]/60">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Holy Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300/80 bg-amber-950 flex-shrink-0">
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
                <span>{ui.appTitle}</span>
                <span className="text-amber-300 text-xs sm:text-sm font-sans font-normal opacity-90">| 315 Shlokas</span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/90 font-sans tracking-wide">
              {ui.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Jump Button */}
          <button
            id="header-quick-jump-btn"
            onClick={onOpenQuickJump}
            title={ui.quickJump}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold transition"
          >
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.quickJump}</span>
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
            title={`Theme: ${preferences.theme}`}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition"
          >
            {preferences.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title={ui.settingsTitle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition relative"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {showSearchInput && (
        <div className="bg-[#601500] px-4 py-2 border-t border-amber-500/30 animate-fadeIn">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-300" />
            <input
              type="text"
              id="global-shloka-search-input"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab === 'home' && e.target.value.trim()) {
                  setActiveTab('reader');
                }
              }}
              placeholder={ui.searchPlaceholder}
              className="w-full bg-black/20 text-white placeholder-amber-200/60 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-amber-400/30 focus:outline-none focus:border-amber-300"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-amber-300 hover:text-white px-2 py-1 font-semibold whitespace-nowrap"
              >
                {ui.clearSearch}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Language & Script Toolbar */}
      <div className="bg-[#4E1000] px-3 sm:px-6 py-1.5 border-t border-amber-900/60 flex items-center justify-between text-xs overflow-x-auto gap-2 no-scrollbar">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-amber-300/80 mr-1 text-[11px] font-medium hidden sm:inline">
            {ui.meaningLanguageLabel}
          </span>
          {(['gujarati', 'hindi', 'english', 'all'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdatePreferences({ activeLanguage: lang })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                preferences.activeLanguage === lang
                  ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang === 'gujarati' && 'ગુજરાતી (Default)'}
              {lang === 'hindi' && 'हिन्दी'}
              {lang === 'english' && 'English'}
              {lang === 'all' && 'All / સર્વ'}
            </button>
          ))}
          <button
            onClick={onOpenSettings}
            className="text-[11px] text-amber-300 hover:underline px-1.5 py-0.5 rounded ml-1 font-medium flex items-center gap-1"
          >
            <Languages className="w-3 h-3" />
            <span>{ui.moreLanguages}</span>
          </button>
        </div>

        {/* Sanskrit Script Selector */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-amber-300/80 mr-1 text-[11px] font-medium hidden sm:inline">
            {ui.sanskritScriptLabel}
          </span>
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
