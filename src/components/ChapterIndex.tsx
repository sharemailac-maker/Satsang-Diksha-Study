import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Sun, 
  Flame, 
  ShieldCheck, 
  Heart, 
  Users, 
  Compass, 
  Crown, 
  Award, 
  ChevronRight, 
  CheckCircle2,
  Hash
} from 'lucide-react';
import { Chapter, MukhpathLevel, UserPreferences } from '../types';
import { getChapterTitle, getChapterDescription } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface ChapterIndexProps {
  chapters: Chapter[];
  preferences?: UserPreferences;
  mukhpathRecords: Record<number, { status: MukhpathLevel }>;
  onSelectChapter: (chapterId: number) => void;
  onSelectShloka: (shlokaId: number) => void;
}

export const ChapterIndex: React.FC<ChapterIndexProps> = ({
  chapters,
  preferences,
  mukhpathRecords,
  onSelectChapter,
  onSelectShloka
}) => {
  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return Sparkles;
      case 'BookOpen': return BookOpen;
      case 'Sun': return Sun;
      case 'Flame': return Flame;
      case 'ShieldCheck': return ShieldCheck;
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Compass': return Compass;
      case 'Crown': return Crown;
      case 'Award': return Award;
      default: return BookOpen;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Index Title Banner */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
          {lang === 'hindi' ? 'सत्संग दीक्षा अध्याय अनुक्रमणिका' : lang === 'english' ? 'Satsang Diksha Chapter Index' : 'સત્સંગ દીક્ષા પ્રકરણ અનુક્રમણિકા'}
        </h2>
        <p className="text-xs sm:text-sm text-[#6B5E51] dark:text-[#C5B7A8] max-w-xl mx-auto">
          {lang === 'hindi' ? '१० मुख्य अध्यायों में विभाजित ३१५ दिव्य श्लोकों का विषयवार अध्ययन' : lang === 'english' ? 'Subject-wise study of 315 verses organized across 10 main chapters' : '૧૦ મુખ્ય પ્રકરણોમાં વિભાજિત ૩૧૫ દિવ્ય શ્લોકોનું વિષયવાર અધ્યયન અને માર્ગદર્શન'}
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {chapters.map((chapter) => {
          const Icon = getIcon(chapter.iconName);
          const [start, end] = chapter.shlokaRange;
          const totalInChapter = end - start + 1;

          // Count memorized in this chapter
          let memorizedInChapter = 0;
          for (let i = start; i <= end; i++) {
            const st = mukhpathRecords[i]?.status;
            if (st === 'memorized' || st === 'mastered') {
              memorizedInChapter++;
            }
          }

          const percent = Math.round((memorizedInChapter / totalInChapter) * 100);

          return (
            <div
              key={chapter.id}
              className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-400/80 transition-all hover:shadow-lg flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectChapter(chapter.id)}
            >
              <div className="space-y-3">
                {/* Chapter Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${chapter.themeColor} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        {ui.chapterPrefix} {chapter.id}
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#2D241E] dark:text-[#F3ECE1] group-hover:text-[#8B2500] dark:group-hover:text-amber-300 transition">
                        {getChapterTitle(chapter, lang)}
                      </h3>
                      <span className="text-xs text-[#8A7A68] dark:text-[#A89886] font-normal block">
                        {lang === 'gujarati' ? `${chapter.titleHi} • ${chapter.titleEn}` : `${chapter.titleGu} • ${chapter.titleEn}`}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono font-bold whitespace-nowrap">
                    {ui.shlokaNumberPrefix} {start} - {end}
                  </span>
                </div>

                {/* Chapter Description */}
                <p className="text-xs text-[#54473C] dark:text-[#C5B7A8] leading-relaxed line-clamp-2">
                  {getChapterDescription(chapter, lang)}
                </p>
              </div>

              {/* Progress & Quick Shloka Pills */}
              <div className="mt-4 pt-3 border-t border-[#F2EADB] dark:border-[#332A23] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7A6B5C] dark:text-[#A89D91]">
                    {ui.tabMukhpath}: {memorizedInChapter}/{totalInChapter} ({percent}%)
                  </span>
                  <div className="flex items-center text-amber-700 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>{ui.tabReader}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="w-full bg-[#EAE2D5] dark:bg-[#332B24] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
