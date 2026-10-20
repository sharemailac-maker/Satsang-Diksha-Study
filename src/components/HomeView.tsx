import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  Link2, 
  Award, 
  Bookmark as BookmarkIcon, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Compass, 
  Volume2, 
  VolumeX, 
  Calendar,
  ChevronRight,
  Radio
} from 'lucide-react';
import { Shloka, UserPreferences, MukhpathLevel } from '../types';
import { getUIStrings, getShlokaMeaning } from '../utils/i18n';
import { globalAudio } from '../utils/audioPlayer';
import appIconImg from '../assets/images/satsang_diksha_akshar_purushottam_logo_1788180536338.jpg';
import { HomeLettersBanner } from './HomeLettersBanner';

interface HomeViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  mukhpathRecords: Record<number, { status: MukhpathLevel; recitationCount: number }>;
  totalBookmarks: number;
  onNavigateTab: (tab: string, chapterId?: number | null) => void;
  onSelectShloka: (shlokaId: number) => void;
  onOpenQuickJump: () => void;
  onOpenSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  shlokas,
  preferences,
  mukhpathRecords,
  totalBookmarks,
  onNavigateTab,
  onSelectShloka
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const ui = getUIStrings(preferences.activeLanguage);

  // Calculate today's shloka (e.g. based on day of the year)
  const todayIndex = useMemo(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = Date.now() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return (dayOfYear % 315) + 1;
  }, []);

  const todayShloka = useMemo(() => {
    return shlokas.find(s => s.id === todayIndex) || shlokas[0];
  }, [shlokas, todayIndex]);

  // Subscribe to global audio state for Daily Shloka
  useEffect(() => {
    return globalAudio.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying && state.shlokaId === todayShloka.id);
    });
  }, [todayShloka.id]);

  // Memorized counts
  const memorizedCount = useMemo(() => {
    return Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel; recitationCount: number }) => r.status === 'memorized' || r.status === 'mastered').length;
  }, [mukhpathRecords]);

  // Audio recitation using authentic male voice Vedic chanting
  const handlePlayShlokaAudio = (_text?: string) => {
    globalAudio.play(todayShloka.id, 'sanskrit');
  };

  // Primary Study Modules
  const studyModules = [
    {
      id: 'reader',
      title: ui.homeShlokAdhyayanTitle || 'શ્લોક અધ્યયન',
      subtitle: ui.homeShlokAdhyayanDesc || 'સંસ્કૃત શ્લોક, ભાવાર્થ, પદચ્છેદ અને વ્યાકરણ',
      icon: BookOpen,
      color: 'from-[#8B2500] to-[#B33900]',
      badge: ui.allShlokas || '૩૧૫ શ્લોક'
    },
    {
      id: 'udgaan',
      title: ui.homeUdgaanTitle || 'ઉદ્ગાન વૈદિક ગાન',
      subtitle: ui.homeUdgaanDesc || 'સંસ્કૃત શ્લોક શ્રેણી અને જૂથવાર વૈદિક ગાન શ્રવણ (૧ થી ૩૧૫)',
      icon: Radio,
      color: 'from-[#D97706] to-[#B45309]',
      badge: '૩૧૫ શ્લોક ગાન'
    },
    {
      id: 'mukhpath',
      title: ui.homeMukhpathTitle || 'મુખપાઠ સાધના',
      subtitle: ui.homeMukhpathDesc || 'શ્લોકો કંઠસ્થ કરવાની વિશિષ્ટ વૈદિક પદ્ધતિ અને શ્રવણ કસોટી',
      icon: Sparkles,
      color: 'from-[#B45309] to-[#D97706]',
      badge: `${memorizedCount}/315`
    },
    {
      id: 'chapters',
      title: ui.homeChaptersTitle || 'પ્રકરણ અનુક્રમણિકા',
      subtitle: ui.homeChaptersDesc || '૧૦ પ્રકરણો: મંગલાચરણ, ઉપાસના, નિત્યકર્મ, આહારશુદ્ધિ અને બ્રહ્મવિદ્યા',
      icon: Layers,
      color: 'from-[#047857] to-[#059669]',
      badge: '10'
    },
    {
      id: 'crossref',
      title: ui.homeCrossRefTitle || 'વચનામૃત-વાતો અનુસંધાન',
      subtitle: ui.homeCrossRefDesc || 'વચનામૃત અને સ્વામીની વાતોના મૂળ સંદર્ભો સાથે સિદ્ધાંત પ્રમાણ',
      icon: Link2,
      color: 'from-[#6D28D9] to-[#7C3AED]',
      badge: '315+315'
    },
    {
      id: 'quiz',
      title: ui.homeQuizTitle || 'સ્વાધ્યાય કસોટી',
      subtitle: ui.homeQuizDesc || 'શ્લોકાર્થ, ખાલી જગ્યા અને સિદ્ધાંત આધારિત પ્રશ્નોત્તરી',
      icon: Award,
      color: 'from-[#C2410C] to-[#EA580C]',
      badge: 'Quiz'
    },
    {
      id: 'bookmarks',
      title: ui.homeBookmarksTitle || 'સાચવેલા શ્લોકો & નોંધો',
      subtitle: ui.homeBookmarksDesc || 'તમારા પસંદગીના શ્લોકો અને મનન-ચિંતનની વ્યક્તિગત નોંધ',
      icon: BookmarkIcon,
      color: 'from-[#475569] to-[#64748B]',
      badge: `${totalBookmarks}`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 animate-fadeIn pb-16">
      {/* Home Page Blessing Letters Carousel Banner (Swipe left/right style) */}
      <HomeLettersBanner
        onNavigateTab={onNavigateTab}
        memorizedCount={memorizedCount}
        totalBookmarks={totalBookmarks}
        ui={ui}
        activeLanguage={preferences.activeLanguage}
      />

      {/* TODAY'S FEATURED SHLOKA */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-6 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0E8DC] dark:border-[#352C24] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-[#8B2500] dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                {ui.homeDailyVerseTitle || 'આજનો પ્રેરણાદાયી શ્લોક (Verse of the Day)'}
              </h3>
              <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886]">
                {ui.shlokaNumberPrefix} {todayShloka.id} • {ui.chapterPrefix} {todayShloka.chapterId}: {todayShloka.chapterGu}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePlayShlokaAudio(todayShloka.sanskritDevanagari)}
              title={ui.listenAudio}
              className={`p-2 rounded-xl border transition ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-amber-950 border-amber-600 animate-pulse' 
                  : 'bg-amber-50 dark:bg-[#2E2620] text-[#8B2500] dark:text-amber-300 border-amber-300/40 hover:bg-amber-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSelectShloka(todayShloka.id)}
              className="px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-amber-50 text-xs font-semibold shadow-xs transition flex items-center gap-1"
            >
              <span>{ui.homeExploreVerseBtn || 'વિસ્તૃત અધ્યયન'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sanskrit Verse Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] dark:bg-[#1C1714] border-2 border-amber-500/20 text-center space-y-2">
          <div className="text-xs font-serif text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            ॥ શ્રી સ્વામિનારાયણો વિજયતે ॥
          </div>
          <p 
            className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line text-base sm:text-lg"
          >
            {preferences.sanskritScript === 'gujarati' 
              ? todayShloka.sanskritGujarati 
              : preferences.sanskritScript === 'iast'
              ? todayShloka.sanskritIast
              : todayShloka.sanskritDevanagari}
          </p>
        </div>

        {/* Meaning in User's selected language */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-[#28211B] border-l-4 border-[#8B2500] text-xs space-y-1">
          <div className="font-bold text-[#8B2500] dark:text-amber-300">
            {ui.primaryMeaningTitle}:
          </div>
          <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed text-sm">
            {getShlokaMeaning(todayShloka, preferences.activeLanguage)}
          </p>
          {preferences.activeLanguage !== 'gujarati' && (
            <p className="font-gujarati text-[11px] text-[#6B5E51] dark:text-[#A89886] pt-1 border-t border-amber-200/40">
              <strong>મૂળ ગુજરાતી:</strong> {todayShloka.meaningGu}
            </p>
          )}
        </div>
      </div>

      {/* PRIMARY STUDY PILLARS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>{ui.homeStudyModulesTitle || 'મુખ્ય અધ્યયન વિભાગો'}</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            {ui.appSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                id={`home-module-${module.id}`}
                onClick={() => onNavigateTab(module.id)}
                className="group relative bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/30">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 group-hover:text-amber-600 transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-xs text-[#5D4E41] dark:text-[#C5B7A8] mt-1.5 line-clamp-2 leading-relaxed">
                      {module.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F2ECE1] dark:border-[#332A22] flex items-center justify-between text-xs font-semibold text-[#8B2500] dark:text-amber-400">
                  <span>{ui.homeExploreBtn || 'પ્રવેશ કરો'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
