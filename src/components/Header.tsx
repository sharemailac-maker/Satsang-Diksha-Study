import React, { useState } from 'react';
import { 
  Search, 
  Settings, 
  Sun, 
  Moon, 
  Hash,
  Languages
} from 'lucide-react';
import { ThemeMode, UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';
import appIconImg from '../assets/images/satsang_diksha_study_icon.png';

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
  setActiveTab
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const ui = getUIStrings(preferences.activeLanguage);

  const toggleTheme = () => {
    const next: ThemeMode = preferences.theme === 'light' ? 'dark' : 'light';
    onUpdatePreferences({ theme: next });
  };

  const getLangBadge = () => {
    const l = preferences.activeLanguage;
    if (l === 'gujarati') return 'GUJ';
    if (l === 'hindi') return 'HIN';
    if (l === 'english') return 'ENG';
    if (l === 'marathi') return 'MAR';
    if (l === 'bengali') return 'BEN';
    if (l === 'tamil') return 'TAM';
    if (l === 'telugu') return 'TEL';
    if (l === 'kannada') return 'KAN';
    if (l === 'punjabi') return 'PUN';
    return (l || 'GUJ').substring(0, 3).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#7A1E00] text-white shadow-lg border-b border-[#A63000]/60 pt-[env(safe-area-inset-top,0px)]">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Bigger Holy App Icon & Title/Sub-info */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {/* App Image-Icon */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-300 bg-amber-950 flex-shrink-0">
            <img 
              src={appIconImg} 
              alt="Satsang Diksha Study" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Sub Info beside App Icon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-amber-100 leading-tight">
                {ui.appTitle}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] sm:text-xs font-mono font-semibold">
                ૩૧૫ શ્લોક | 10 પ્રકરણ
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/90 font-sans tracking-wide truncate mt-0.5">
              {ui.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Icons Row (Search, # Quick Jump, Language, Theme, Settings) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 self-end sm:self-center">
          {/* Quick Jump Button (#) */}
          <button
            id="header-quick-jump-btn"
            onClick={onOpenQuickJump}
            title={ui.quickJump}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 text-xs font-semibold transition"
          >
            <Hash className="w-4 h-4" />
            <span className="hidden md:inline">{ui.quickJump}</span>
          </button>

          {/* Search Toggle */}
          <button
            id="header-search-toggle-btn"
            onClick={() => setShowSearchInput(!showSearchInput)}
            title="Search Shlokas"
            className={`p-2 rounded-xl border transition ${showSearchInput ? 'bg-amber-400 text-amber-950 border-amber-400' : 'bg-white/10 hover:bg-white/20 text-white border-amber-400/30'}`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Icon (Direct to Settings Language Section) */}
          <button
            id="header-language-btn"
            onClick={onOpenSettings}
            title={`Language: ${preferences.activeLanguage}`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 text-xs font-semibold transition"
          >
            <Languages className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold text-amber-100">{getLangBadge()}</span>
          </button>

          {/* Theme Quick Switcher */}
          <button
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            title={`Theme: ${preferences.theme}`}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 transition"
          >
            {preferences.theme === 'dark' ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title={ui.settingsTitle}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 transition relative"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Search Bar */}
      {showSearchInput && (
        <div className="bg-[#601500] px-4 py-2.5 border-t border-amber-500/30 animate-fadeIn">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-300" />
            <input
              type="text"
              id="global-shloka-search-input"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab === 'home' && e.target.value.trim()) {
                  setActiveTab('mukhpath');
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
    </header>
  );
};
