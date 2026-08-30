import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  Link2, 
  HelpCircle, 
  Bookmark,
  Award
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mukhpathCount: number;
  totalBookmarks: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  mukhpathCount,
  totalBookmarks
}) => {
  const tabs = [
    {
      id: 'reader',
      labelGu: 'શ્લોક અધ્યયન',
      labelHi: 'श्लोक अध्ययन',
      labelEn: 'Shlokas 1-315',
      icon: BookOpen,
      badge: '315'
    },
    {
      id: 'mukhpath',
      labelGu: 'મુખપાઠ સાધના',
      labelHi: 'मुखपाठ साधना',
      labelEn: 'Mukhpath Tool',
      icon: Sparkles,
      badge: `${mukhpathCount}/315`
    },
    {
      id: 'chapters',
      labelGu: 'પ્રકરણ સૂચિ',
      labelHi: 'प्रकरण सूची',
      labelEn: 'Chapters',
      icon: Layers
    },
    {
      id: 'crossref',
      labelGu: 'વચનામૃત-વાતો સંબંધ',
      labelHi: 'वचनामृत-वातो संबंध',
      labelEn: 'Vachnamrut & Vato',
      icon: Link2
    },
    {
      id: 'quiz',
      labelGu: 'સ્વાધ્યાય કસોટી',
      labelHi: 'स्वाध्याय परीक्षा',
      labelEn: 'Quiz & Test',
      icon: Award
    },
    {
      id: 'bookmarks',
      labelGu: 'બુકમાર્ક્સ & નોંધો',
      labelHi: 'बुकमार्क्स & नोट्स',
      labelEn: 'Bookmarks',
      icon: Bookmark,
      badge: totalBookmarks > 0 ? totalBookmarks.toString() : undefined
    }
  ];

  return (
    <nav className="bg-[#FAF6F0] dark:bg-[#1E1916] border-b border-[#E8DFD1] dark:border-[#382F28] sticky top-[98px] sm:top-[106px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-1.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-[#8B2500] text-amber-50 shadow-sm font-semibold'
                    : 'text-[#6B5E51] dark:text-[#B3A698] hover:bg-[#EDE5D8] dark:hover:bg-[#2C241F] hover:text-[#8B2500] dark:hover:text-amber-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'opacity-80'}`} />
                <span>{tab.labelGu}</span>
                <span className="hidden md:inline opacity-75 text-[11px]">({tab.labelEn})</span>
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
      </div>
    </nav>
  );
};
