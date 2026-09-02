import React from 'react';
import { 
  Home,
  BookOpen, 
  Sparkles, 
  Layers, 
  Link2, 
  Award, 
  Bookmark,
  Settings,
  Smartphone,
  Radio
} from 'lucide-react';
import { Language, UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mukhpathCount: number;
  totalBookmarks: number;
  preferences: UserPreferences;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  mukhpathCount,
  totalBookmarks,
  preferences,
  onOpenSettings,
  onOpenApkModal
}) => {
  const ui = getUIStrings(preferences.activeLanguage);

  const tabs = [
    {
      id: 'home',
      label: ui.tabHome,
      icon: Home
    },
    {
      id: 'reader',
      label: ui.tabReader,
      icon: BookOpen,
      badge: '315'
    },
    {
      id: 'udgaan',
      label: ui.tabUdgaan || 'ઉદ્ગાન શ્રવણ',
      icon: Radio,
      badge: 'Audio'
    },
    {
      id: 'mukhpath',
      label: ui.tabMukhpath,
      icon: Sparkles,
      badge: `${mukhpathCount}/315`
    },
    {
      id: 'chapters',
      label: ui.tabChapters,
      icon: Layers
    },
    {
      id: 'crossref',
      label: ui.tabCrossref,
      icon: Link2
    },
    {
      id: 'quiz',
      label: ui.tabQuiz,
      icon: Award
    },
    {
      id: 'bookmarks',
      label: ui.tabBookmarks,
      icon: Bookmark,
      badge: totalBookmarks > 0 ? totalBookmarks.toString() : undefined
    }
  ];

  const handleTabClick = (tabId: string) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {
      // ignore
    }
    onTabChange(tabId);
  };

  return (
    <>
      {/* Top Desktop/Tablet Navigation Bar */}
      <nav className="hidden md:block bg-[#FAF6F0] dark:bg-[#1E1916] border-b border-[#E8DFD1] dark:border-[#382F28] sticky top-[68px] sm:top-[74px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-1.5 no-scrollbar">
            <div className="flex items-center gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-[#8B2500] text-amber-50 shadow-sm font-semibold'
                        : 'text-[#6B5E51] dark:text-[#B3A698] hover:bg-[#EDE5D8] dark:hover:bg-[#2C241F] hover:text-[#8B2500] dark:hover:text-amber-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'opacity-80'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-amber-400 text-amber-950 font-bold' 
                          : 'bg-[#E3D6C3] dark:bg-[#382E26] text-[#7A6B5C] dark:text-[#C5B7A8]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick APK/AAB Native App status button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenApkModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#8B2500] dark:text-amber-300 border border-amber-400/30 text-xs font-semibold transition"
                title="Android APK & AAB Ready"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#8B2500] dark:text-amber-400" />
                <span>{ui.tabApk}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Real Mobile App Bottom Navigation Bar (Fixed at Bottom for Native Look & Feel) */}
      <nav 
        id="native-mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 dark:bg-[#1C1714]/95 backdrop-blur-md border-t border-[#E8DFD1] dark:border-[#382F28] px-1 py-1.5 shadow-lg safe-area-bottom"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-around gap-0.5">
          {/* Home */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition ${
              activeTab === 'home' 
                ? 'text-[#8B2500] dark:text-amber-400 font-bold' 
                : 'text-[#7A6B5C] dark:text-[#9A8D80]'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-[#8B2500]/15 dark:bg-amber-400/20' : ''}`}>
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabHome}</span>
          </button>

          {/* Reader 1-315 */}
          <button
            onClick={() => handleTabClick('reader')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition ${
              activeTab === 'reader' 
                ? 'text-[#8B2500] dark:text-amber-400 font-bold' 
                : 'text-[#7A6B5C] dark:text-[#9A8D80]'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'reader' ? 'bg-[#8B2500]/15 dark:bg-amber-400/20' : ''}`}>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabReader}</span>
          </button>

          {/* Udgaan Chanting */}
          <button
            onClick={() => handleTabClick('udgaan')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition ${
              activeTab === 'udgaan' 
                ? 'text-[#8B2500] dark:text-amber-400 font-bold' 
                : 'text-[#7A6B5C] dark:text-[#9A8D80]'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'udgaan' ? 'bg-[#8B2500]/15 dark:bg-amber-400/20' : ''}`}>
              <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabUdgaan || 'ઉદ્ગાન'}</span>
          </button>

          {/* Mukhpath Tool */}
          <button
            onClick={() => handleTabClick('mukhpath')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition relative ${
              activeTab === 'mukhpath' 
                ? 'text-[#8B2500] dark:text-amber-400 font-bold' 
                : 'text-[#7A6B5C] dark:text-[#9A8D80]'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'mukhpath' ? 'bg-[#8B2500]/15 dark:bg-amber-400/20' : ''}`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabMukhpath}</span>
            {mukhpathCount > 0 && (
              <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white font-bold text-[8px] flex items-center justify-center">
                {mukhpathCount}
              </span>
            )}
          </button>

          {/* Cross References (વચનામૃત-વાતો) */}
          <button
            onClick={() => handleTabClick('crossref')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition ${
              activeTab === 'crossref' 
                ? 'text-[#8B2500] dark:text-amber-400 font-bold' 
                : 'text-[#7A6B5C] dark:text-[#9A8D80]'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'crossref' ? 'bg-[#8B2500]/15 dark:bg-amber-400/20' : ''}`}>
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabCrossref}</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition text-[#7A6B5C] dark:text-[#9A8D80] hover:text-[#8B2500] dark:hover:text-amber-400"
          >
            <div className="p-1 rounded-full">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[55px]">{ui.tabSettings}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
