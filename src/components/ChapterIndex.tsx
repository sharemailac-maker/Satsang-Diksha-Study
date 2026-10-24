import React, { useState, useEffect } from 'react';
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
  Volume2, 
  VolumeX, 
  Type,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Chapter, Shloka, MukhpathLevel, UserPreferences, SanskritScript } from '../types';
import { getChapterTitle, getChapterDescription } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';
import { globalAudio } from '../utils/audioPlayer';

interface ChapterIndexProps {
  chapters: Chapter[];
  shlokas?: Shloka[];
  preferences?: UserPreferences;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
  mukhpathRecords?: Record<number, { status: MukhpathLevel }>;
  onSelectChapter?: (chapterId: number) => void;
  onSelectShloka: (shlokaId: number) => void;
}

export const ChapterIndex: React.FC<ChapterIndexProps> = ({
  chapters,
  shlokas = [],
  preferences,
  onUpdatePreferences,
  onSelectShloka
}) => {
  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  
  // Local script state synced with preferences or toggleable directly here
  const [activeScript, setActiveScript] = useState<SanskritScript>(preferences?.sanskritScript || 'gujarati');
  const [selectedChapterId, setSelectedChapterId] = useState<number | 'all'>('all');
  const [playingShlokaId, setPlayingShlokaId] = useState<number | null>(null);

  useEffect(() => {
    if (preferences?.sanskritScript) {
      setActiveScript(preferences.sanskritScript);
    }
  }, [preferences?.sanskritScript]);

  // Global audio listener
  useEffect(() => {
    return globalAudio.subscribe((state) => {
      if (state.isPlaying) {
        setPlayingShlokaId(state.shlokaId);
      } else {
        setPlayingShlokaId(null);
      }
    });
  }, []);

  const handleScriptChange = (script: SanskritScript) => {
    setActiveScript(script);
    if (onUpdatePreferences) {
      onUpdatePreferences({ sanskritScript: script });
    }
  };

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

  const activeChapters = selectedChapterId === 'all'
    ? chapters
    : chapters.filter(c => c.id === selectedChapterId);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#691800] via-[#8B2500] to-[#B33900] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-amber-400/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-semibold border border-amber-300/30">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {lang === 'hindi' ? 'प्रकरणवार श्लोक पठन' : lang === 'english' ? 'Chapter-wise Verse Recitation' : 'પ્રકરણવાર શ્લોક પઠન'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50">
              {lang === 'hindi' ? 'सत्संग दीक्षा अध्याय श्लोक पाठ' : lang === 'english' ? 'Satsang Diksha Continuous Chanting' : 'સત્સંગ દીક્ષા પ્રકરણ શ્લોક પઠન'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl leading-relaxed">
              {lang === 'hindi' 
                ? 'शुद्ध संस्कृत श्लोक पाठ (बिना अनुवाद प्रत्यक्ष पारायण एवं मुखपाठ हेतु)' 
                : lang === 'english' 
                ? 'Pure Sanskrit verse recitation without translation for direct chanting & path' 
                : 'શુદ્ધ સંસ્કૃત શ્લોકોનું અખંડ પઠન (અનુવાદ રહિત સીધા વાચન અને પારાયણ માટે)'}
            </p>
          </div>

          {/* Script Selection Buttons (Devanagari / Gujarati / Roman IAST) */}
          <div className="bg-black/35 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-300/40 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => handleScriptChange('devanagari')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeScript === 'devanagari'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              દેવનાગરી
            </button>
            <button
              type="button"
              onClick={() => handleScriptChange('gujarati')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeScript === 'gujarati'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              type="button"
              onClick={() => handleScriptChange('iast')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeScript === 'iast'
                  ? 'bg-amber-400 text-amber-950 shadow-sm'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              રોમન (IAST)
            </button>
          </div>
        </div>

        {/* Chapter Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 pb-1 no-scrollbar border-t border-amber-400/20 mt-5">
          <button
            type="button"
            onClick={() => setSelectedChapterId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedChapterId === 'all'
                ? 'bg-white text-[#7A1D05] shadow-md'
                : 'bg-black/25 text-amber-100 hover:bg-black/40'
            }`}
          >
            {lang === 'hindi' ? 'सभी १० अध्याय (१-३१५)' : lang === 'english' ? 'All 10 Chapters (1-315)' : 'તમામ ૧૦ પ્રકરણ (૧-૩૧૫)'}
          </button>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChapterId(ch.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedChapterId === ch.id
                  ? 'bg-white text-[#7A1D05] shadow-md'
                  : 'bg-black/25 text-amber-100 hover:bg-black/40'
              }`}
            >
              {ui.chapterPrefix} {ch.id}: {ch.shlokaRange[0]}-{ch.shlokaRange[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters & Pure Verses List */}
      <div className="space-y-8">
        {activeChapters.map((chapter) => {
          const Icon = getIcon(chapter.iconName);
          const [start, end] = chapter.shlokaRange;
          const chapterShlokas = shlokas.filter(s => s.id >= start && s.id <= end);

          return (
            <div 
              key={chapter.id}
              className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-7 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-6"
            >
              {/* Chapter Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E8DC] dark:border-[#352C24] gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${chapter.themeColor} text-white flex items-center justify-center shadow-md shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        {ui.chapterPrefix} {chapter.id}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-mono font-bold">
                        {ui.shlokaNumberPrefix} {start} - {end} ({end - start + 1} {lang === 'english' ? 'Verses' : 'શ્લોક'})
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2D241E] dark:text-[#F3ECE1]">
                      {getChapterTitle(chapter, lang)}
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-[#7A6B5C] dark:text-[#A89886] font-medium">
                  {lang === 'hindi' ? 'केवल श्लोक वाचन' : lang === 'english' ? 'Chanting Only' : 'માત્ર શ્લોક વાચન'}
                </div>
              </div>

              {/* Pure Shlokas Grid/List - No Translations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapterShlokas.map((s) => {
                  const isCurrentPlaying = playingShlokaId === s.id;
                  const verseText = activeScript === 'gujarati' 
                    ? s.sanskritGujarati 
                    : activeScript === 'iast' 
                    ? s.sanskritIast 
                    : s.sanskritDevanagari;

                  return (
                    <div
                      key={s.id}
                      className={`relative rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                        isCurrentPlaying 
                          ? 'bg-amber-50 dark:bg-[#2A2016] border-amber-500 shadow-md ring-2 ring-amber-400/40' 
                          : 'bg-[#FCFAF6] dark:bg-[#1C1714] border-[#EADBCC] dark:border-[#382E25] hover:border-amber-400/70 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Verse Number & Controls */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0E8DC] dark:border-[#2C231C]">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7A1E00] to-[#8B2500] text-amber-50 flex items-center justify-center font-bold text-xs shadow-2xs">
                            {s.id}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#8B2500] dark:text-amber-300">
                            ॥ શ્લોક {s.id} ॥
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Audio Player Button */}
                          <button
                            type="button"
                            onClick={() => globalAudio.play(s.id, 'sanskrit')}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isCurrentPlaying
                                ? 'bg-amber-500 text-amber-950 border-amber-600 animate-pulse'
                                : 'bg-white dark:bg-[#251E19] text-[#8B2500] dark:text-amber-300 border-amber-200/60 dark:border-stone-700 hover:bg-amber-100'
                            }`}
                            title={isCurrentPlaying ? ui.listenAudioStop : ui.listenAudio}
                          >
                            {isCurrentPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          {/* Jump to Study with meanings */}
                          <button
                            type="button"
                            onClick={() => onSelectShloka(s.id)}
                            className="p-1.5 rounded-lg bg-white dark:bg-[#251E19] text-[#7A6B5C] dark:text-[#A89886] border border-amber-200/60 dark:border-stone-700 hover:text-[#8B2500] hover:bg-amber-50 transition cursor-pointer"
                            title="અધ્યયનમાં ખોલો (Open in Adhyayan)"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Pure Sanskrit Verse Text - Clean and Elegant typography */}
                      <div className="py-2 text-center my-auto">
                        <p className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line text-base sm:text-lg select-text">
                          {verseText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
