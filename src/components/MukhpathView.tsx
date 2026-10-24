import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Flame, 
  Filter, 
  Check, 
  RefreshCw, 
  Trophy,
  Layers,
  HelpCircle,
  Bookmark,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Bell,
  Star,
  ArrowRight,
  Target
} from 'lucide-react';
import { Shloka, MukhpathLevel, UserPreferences, QuizTestSet } from '../types';
import { 
  getShlokaTitle, 
  getShlokaChapterName, 
  getShlokaMeaning, 
  getWordMeaningInLang,
  LANGUAGE_METADATA 
} from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';
import { globalAudio } from '../utils/audioPlayer';
import { PADACHHEDA_DATA } from '../data/padachhedaData';
import { MukhpathBannerCarousel } from './MukhpathBannerCarousel';
import { QUIZ_TEST_SETS } from '../data/quizDatabase';
import { getBestScores } from '../utils/quizStorage';
import { LevelExamModal, getExamGrade } from './LevelExamModal';

interface MukhpathViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  mukhpathRecords: Record<number, { status: MukhpathLevel; recitationCount: number }>;
  onUpdateStatus: (shlokaId: number, status: MukhpathLevel) => void;
  onSelectShloka: (id: number) => void;
  selectedShlokaId?: number | null;
  searchQuery?: string;
}

export const MukhpathView: React.FC<MukhpathViewProps> = ({
  shlokas,
  preferences,
  mukhpathRecords,
  onUpdateStatus,
  onSelectShloka,
  selectedShlokaId,
  searchQuery
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'levels' | 'study'>('levels');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'recite' | 'hide_sanskrit' | 'hide_meaning' | 'pada_reveal' | 'flashcard'>('recite');
  const [hideState, setHideState] = useState(true);
  const [padaRevealStep, setPadaRevealStep] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | MukhpathLevel>('all');
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState<number | 'all'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 26 Levels Exam Modal state
  const [examLevelNumber, setExamLevelNumber] = useState<number | null>(null);
  const [bestScores, setBestScores] = useState<Record<string, { score: number; total: number; percentage: number; date: string }>>({});

  useEffect(() => {
    setBestScores(getBestScores());
  }, []);

  const refreshScores = () => {
    setBestScores(getBestScores());
  };

  // The 26 progressive test sets
  const levelSets = useMemo(() => {
    return QUIZ_TEST_SETS.slice(0, 26);
  }, []);

  // Remaining bonus & revision sets (27 to 32)
  const bonusSets = useMemo(() => {
    return QUIZ_TEST_SETS.slice(26);
  }, []);

  // Determine unlocked levels: Level 1 always unlocked, Level k unlocked if Level k-1 bestScore >= 50%
  const isLevelUnlocked = (lvlNum: number): boolean => {
    if (lvlNum <= 1) return true;
    const prevScore = bestScores[String(lvlNum - 1)];
    return prevScore !== undefined && prevScore.percentage >= 50;
  };

  // Today's Target Level: first unlocked level that hasn't achieved at least 50% yet
  const todayTargetLevel = useMemo(() => {
    for (let i = 1; i <= 26; i++) {
      if (isLevelUnlocked(i)) {
        const sc = bestScores[String(i)];
        if (!sc || sc.percentage < 50) return i;
      }
    }
    return 26;
  }, [bestScores]);

  // Jump to selected shloka if passed
  useEffect(() => {
    if (selectedShlokaId && selectedShlokaId >= 1 && selectedShlokaId <= 315) {
      const targetIndex = shlokas.findIndex(s => s.id === selectedShlokaId);
      if (targetIndex !== -1) {
        setStatusFilter('all');
        setChapterFilter('all');
        setActiveLevelFilter('all');
        setActiveSubTab('study');
        setCurrentIdx(targetIndex);
      }
    }
  }, [selectedShlokaId, shlokas]);

  // Filtered shlokas list
  const filteredShlokas = shlokas.filter(s => {
    const record = mukhpathRecords[s.id];
    const status = record?.status || 'unlearned';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (chapterFilter !== 'all' && s.chapterId !== chapterFilter) return false;

    if (activeLevelFilter !== 'all') {
      const lvl = levelSets[activeLevelFilter - 1];
      if (lvl && (s.id < lvl.startShloka || s.id > lvl.endShloka)) {
        return false;
      }
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const num = parseInt(q, 10);
      if (!isNaN(num) && s.id === num) return true;
      if (s.sanskritDevanagari.toLowerCase().includes(q)) return true;
      if (s.sanskritGujarati.toLowerCase().includes(q)) return true;
      if (s.sanskritIast.toLowerCase().includes(q)) return true;
      if (s.meaningGu.toLowerCase().includes(q)) return true;
      if (s.meaningHi.toLowerCase().includes(q)) return true;
      if (s.meaningEn.toLowerCase().includes(q)) return true;
      if (s.titleGu.toLowerCase().includes(q)) return true;
      return false;
    }

    return true;
  });

  const activeShloka = filteredShlokas[currentIdx] || shlokas[0];
  const activeRecord = activeShloka ? mukhpathRecords[activeShloka.id] : undefined;
  const currentStatus = activeRecord?.status || 'unlearned';

  // Audio subscription for Mukhpath active shloka
  useEffect(() => {
    if (!activeShloka) return;
    return globalAudio.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying && state.shlokaId === activeShloka.id);
    });
  }, [activeShloka?.id]);

  // Stats calculation
  const totalShlokas = 315;
  const memorizedCount = Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel }) => r.status === 'memorized' || r.status === 'mastered').length;
  const progressPercent = Math.round((memorizedCount / totalShlokas) * 100);

  const sanskritVerse = activeShloka 
    ? (preferences.sanskritScript === 'gujarati' 
        ? activeShloka.sanskritGujarati 
        : preferences.sanskritScript === 'iast' 
        ? activeShloka.sanskritIast 
        : activeShloka.sanskritDevanagari)
    : '';

  const sanskritLines = sanskritVerse ? sanskritVerse.split('\n') : [];

  const handleNext = () => {
    setHideState(true);
    setPadaRevealStep(0);
    if (currentIdx < filteredShlokas.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    setHideState(true);
    setPadaRevealStep(0);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

  const handleStartLevelStudy = (lvlNum: number) => {
    setActiveLevelFilter(lvlNum);
    setStatusFilter('all');
    setChapterFilter('all');
    const lvl = levelSets[lvlNum - 1];
    if (lvl) {
      const idx = shlokas.findIndex(s => s.id === lvl.startShloka);
      if (idx !== -1) setCurrentIdx(0);
    }
    setActiveSubTab('study');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const currentExamSet = examLevelNumber ? QUIZ_TEST_SETS.find(s => s.id === examLevelNumber) : null;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Mukhpath Overview Swipeable Banner Carousel */}
      <MukhpathBannerCarousel
        memorizedCount={memorizedCount}
        progressPercent={progressPercent}
        lang={lang}
      />

      {/* Daily Motivation & Goal Notification Card */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 dark:from-amber-950/40 dark:via-stone-900/40 dark:to-amber-950/40 border-2 border-amber-400/60 dark:border-amber-700/60 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B2500] text-amber-100 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 uppercase tracking-wider">
                  {lang === 'hindi' ? 'दैनिक स्वाध्याय संकल्प' : lang === 'english' ? 'Daily Level Goal' : 'દૈનિક સ્વાધ્યાય સંકલ્પ'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                  {lang === 'hindi' ? `आज का लक्ष्य: लेवल ${todayTargetLevel}` : lang === 'english' ? `Today: Level ${todayTargetLevel}` : `આજનું લક્ષ્ય: લેવલ ${todayTargetLevel}`}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#2D241E] dark:text-[#F3ECE1] mt-0.5">
                {lang === 'hindi'
                  ? `रोजाना १ लेवल सिद्ध करें! आज लेवल ${todayTargetLevel} की परीक्षा उत्तीर्ण कर अगला स्तर अनलॉक करें 🎯`
                  : lang === 'english'
                  ? `Achieve 1 Level daily! Pass Level ${todayTargetLevel} exam with 50%+ to unlock the next level 🎯`
                  : `રોજ એક લેવલ અચિવ કરવાનો દૃઢ સંકલ્પ! આજે લેવલ ${todayTargetLevel} ની પરીક્ષા પાસ કરી નેકસ્ટ સેશન અનલૉક કરો 🎯`}
              </h3>
              <p className="text-xs text-[#6B5E51] dark:text-[#C5B7A8] mt-1">
                {lang === 'hindi'
                  ? '५०% पास • ६०% तृतीय श्रेणी • ७५% द्वितीय श्रेणी • ९०% प्रथम श्रेणी • ९०%+ विशेष योग्यता • असीमित पुनः प्रयास'
                  : lang === 'english'
                  ? '50% Pass • 60% 3rd Class • 75% 2nd Class • 90% 1st Class • 90%+ Distinction • Unlimited retakes'
                  : '૫૦% લઘુત્તમ પાસ • ૬૦% તૃતીય શ્રેણી • ૭૫% દ્વિતીય શ્રેણી • ૯૦% પ્રથમ શ્રેણી • ૯૦%+ વિશેષ યોગ્યતા • અનલિમિટેડ પ્રયાસ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setExamLevelNumber(todayTargetLevel)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7A1E00] to-[#8B2500] text-amber-50 font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'hindi' ? `लेवल ${todayTargetLevel} परीक्षा दें` : lang === 'english' ? `Take Level ${todayTargetLevel} Exam` : `લેવલ ${todayTargetLevel} પરીક્ષા આપો`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector (26 Levels Roadmap vs Shloka Practice) */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-[#EFE6D8] dark:bg-[#201915] border border-[#E0D3C1] dark:border-stone-800 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('levels')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === 'levels'
              ? 'bg-[#8B2500] text-amber-100 shadow-md'
              : 'text-[#6B5E51] dark:text-[#A89886] hover:text-[#8B2500]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{lang === 'hindi' ? '२६ स्तर साधना यात्रा' : lang === 'english' ? '26 Levels Roadmap' : '૨૬ સ્તર સાધના યાત્રા'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('study')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
            activeSubTab === 'study'
              ? 'bg-[#8B2500] text-amber-100 shadow-md'
              : 'text-[#6B5E51] dark:text-[#A89886] hover:text-[#8B2500]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'hindi' ? 'श्लोक मुखपाठ अध्ययन' : lang === 'english' ? 'Verse Practice' : 'શ્લોક મુખપાઠ અધ્યયન'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: 26 LEVELS ROADMAP & GAMIFIED PROGRESSION */}
      {/* ========================================================================= */}
      {activeSubTab === 'levels' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Section Introduction */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DFD1] dark:border-stone-800 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
                {lang === 'hindi' ? '२६ सोपान परीक्षा एवं मुखपाठ क्रम' : lang === 'english' ? '26 Progressive Exam Levels' : '૨૬ સોપાન પરીક્ષા & મુખપાઠ સાધના ક્રમ'}
              </h2>
              <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                {lang === 'hindi' 
                  ? 'श्लोक १ से ३१५ का २५+१ स्तरों में विभाजन • प्रत्येक स्तर के अंत में परीक्षा • ५०% उत्तीर्ण होने पर ही अगला सत्र खुलेगा' 
                  : lang === 'english'
                  ? '315 Verses organized into 26 progressive levels • Pass exam with 50%+ to unlock next level'
                  : 'શ્લોક ૧ થી ૩૧૫ નું ૨૬ સ્તરોમાં ક્રમબદ્ધ વિભાજન • દરેક લેવલના અંતે એક્ઝામ • ૫૦% ઉત્તીર્ણ થયા પછી જ નેકસ્ટ લેવલ ખૂલશે'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>અનલૉક</span>
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400 ml-2" />
              <span>લૉક</span>
            </div>
          </div>

          {/* 26 Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levelSets.map((lvl) => {
              const lvlNum = lvl.id;
              const unlocked = isLevelUnlocked(lvlNum);
              const best = bestScores[String(lvlNum)];
              const grade = best ? getExamGrade(best.percentage, lang) : null;
              const isTodayGoal = lvlNum === todayTargetLevel;

              return (
                <div
                  key={lvlNum}
                  className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                    !unlocked
                      ? 'bg-stone-100/70 dark:bg-[#181310] border-stone-300 dark:border-stone-800 opacity-70 select-none'
                      : isTodayGoal
                      ? 'bg-[#FFFDF7] dark:bg-[#231B15] border-amber-500 shadow-md ring-2 ring-amber-400/30'
                      : 'bg-white dark:bg-[#201915] border-[#E8DFD1] dark:border-stone-800 hover:border-amber-400/80 shadow-xs'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Level Number & Lock Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          unlocked 
                            ? 'bg-gradient-to-br from-[#7A1E00] to-[#8B2500] text-amber-50 shadow-2xs' 
                            : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}>
                          {lvlNum}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300">
                            લેવલ {lvlNum}
                          </span>
                          <span className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] block">
                            શ્લોક {lvl.startShloka} - {lvl.endShloka}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {unlocked ? (
                          <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" title="અનલૉક">
                            <Unlock className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300" title="લૉક - પાછલું લેવલ પાસ કરો">
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chapter Title */}
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] line-clamp-1">
                        {lang === 'hindi' ? lvl.chapterHi : lang === 'english' ? lvl.chapterEn : lvl.chapterGu}
                      </h4>
                      <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886]">
                        {lvl.questions.length} પ્રશ્નો • {lvl.endShloka - lvl.startShloka + 1} શ્લોકો
                      </p>
                    </div>

                    {/* Grade & Score Badge */}
                    {unlocked && (
                      <div className="pt-2 border-t border-[#F0E8DC] dark:border-stone-800">
                        {best ? (
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${grade?.badgeColor}`}>
                              {grade?.title}
                            </span>
                            <span className="font-mono font-bold text-[#8B2500] dark:text-amber-300">
                              {best.score}/{best.total} ({best.percentage}%)
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>પરીક્ષા આપવાની બાકી (Pending Exam)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Study Verses or Take Exam */}
                  <div className="pt-2 border-t border-[#F0E8DC] dark:border-stone-800 flex items-center gap-2">
                    {unlocked ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartLevelStudy(lvlNum)}
                          className="flex-1 py-2 px-2 rounded-xl bg-amber-50 dark:bg-[#2A2016] text-[#8B2500] dark:text-amber-300 border border-amber-200 dark:border-stone-700 hover:bg-amber-100 text-xs font-bold transition cursor-pointer text-center"
                        >
                          શ્લોક સાધના
                        </button>
                        <button
                          type="button"
                          onClick={() => setExamLevelNumber(lvlNum)}
                          className="flex-1 py-2 px-2 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white text-xs font-bold transition shadow-xs cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{best ? 'ફરી પરીક્ષા' : 'પરીક્ષા આપો'}</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2 text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>લેવલ {lvlNum - 1} માં ૫૦%+ મેળવો</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* BONUS ROUNDS & REVISION QUIZZES (Sets 27 to 32) */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-[#251E19] dark:via-[#1F1813] dark:to-[#251E19] rounded-3xl p-6 sm:p-7 border-2 border-amber-300 dark:border-amber-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-amber-950">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
                  {lang === 'hindi' ? '🌟 बोनस राउंड एवं पुनरावर्तन क्विज (Sets 27-32)' : lang === 'english' ? '🌟 Bonus Rounds & Revision Quizzes' : '🌟 બોનસ રાઉન્ડ અને રિવિઝન ક્વિઝ (Sets 27-32)'}
                </h3>
                <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                  {lang === 'hindi' 
                    ? 'विषयवार पुनरावर्तन, सिद्धांतरहस्य एवं समग्र शास्त्र मॉक परीक्षा' 
                    : lang === 'english'
                    ? 'Comprehensive mock examinations and deep doctrinal revisions'
                    : 'વિષયવાર પુનરાવર્તન, સિદ્ધાંત દર્શન અને સંપૂર્ણ શાસ્ત્ર આધારિત મોક પરીક્ષાઓ'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {bonusSets.map((bSet) => {
                const best = bestScores[String(bSet.id)];
                return (
                  <div 
                    key={bSet.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#1E1713] border border-amber-200 dark:border-stone-700 shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block uppercase">
                        બોનસ સેટ #{bSet.id}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8]">
                        {lang === 'hindi' ? bSet.titleHi : lang === 'english' ? bSet.titleEn : bSet.titleGu}
                      </h4>
                      <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] mt-0.5">
                        {bSet.questions.length} પ્રશ્નો
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                      {best ? (
                        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {best.score}/{best.total} ({best.percentage}%)
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400">બાકી</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setExamLevelNumber(bSet.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white text-xs font-bold transition cursor-pointer"
                      >
                        ક્વિઝ શરૂ કરો
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: VERSE-BY-VERSE STUDY & PRACTICE (All 5 Modes & Padachheda) */}
      {/* ========================================================================= */}
      {activeSubTab === 'study' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Level Header Banner if filtered by level */}
          {activeLevelFilter !== 'all' && (
            <div className="p-3.5 rounded-2xl bg-amber-100/80 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8B2500] dark:text-amber-300" />
                <span className="text-xs font-bold text-[#7A1E00] dark:text-amber-300">
                  લેવલ {activeLevelFilter} શ્લોક સાધના (શ્લોક {levelSets[activeLevelFilter - 1]?.startShloka} થી {levelSets[activeLevelFilter - 1]?.endShloka})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExamLevelNumber(activeLevelFilter)}
                  className="px-3 py-1 rounded-xl bg-[#8B2500] text-white font-bold text-xs shadow-2xs hover:bg-[#A83200] cursor-pointer"
                >
                  આ લેવલની પરીક્ષા આપો
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLevelFilter('all')}
                  className="text-xs text-[#7A6B5C] underline hover:text-[#8B2500] cursor-pointer"
                >
                  તમામ ૩૧૫ શ્લોક જુઓ
                </button>
              </div>
            </div>
          )}

          {/* Filter & Practice Mode Bar */}
          <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 shadow-sm border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
            {/* Practice Mode Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 mr-1 flex-shrink-0">
                અભ્યાસ પદ્ધતિ:
              </span>
              {[
                { id: 'recite', label: '📖 શ્લોક પઠન (Recite & Study)', desc: 'Study full verse & word details' },
                { id: 'hide_sanskrit', label: '🙈 સંસ્કૃત છુપાવો (Recite from Memory)', desc: 'Hide verse and recall' },
                { id: 'hide_meaning', label: '🧐 અર્થ છુપાવો (Test Meaning)', desc: 'Hide meaning and translate' },
                { id: 'pada_reveal', label: '🪜 પદ ક્રમશઃ (Pada-by-Pada Reveal)', desc: 'Reveal line by line' },
                { id: 'flashcard', label: '🗂️ ફ્લેશકાર્ડ (Flashcard Flip)', desc: 'Flip card practice' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setPracticeMode(mode.id as typeof practiceMode);
                    setHideState(true);
                    setPadaRevealStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    practiceMode === mode.id
                      ? 'bg-[#8B2500] text-amber-100 font-bold shadow-sm'
                      : 'bg-[#FAF6F0] dark:bg-[#2C241F] text-[#6B5E51] dark:text-[#C5B7A8] hover:bg-[#EFE8DC]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2EADB] dark:border-[#332A23] text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span className="font-semibold text-[#6B5E51] dark:text-[#C5B7A8]">સ્થિતિ / Status:</span>
                {(['all', 'unlearned', 'learning', 'memorized', 'mastered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentIdx(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                      statusFilter === st
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-[#FAF6F0] dark:bg-[#2C241F] text-[#7A6B5C] dark:text-[#A89D91] hover:bg-[#EFE8DC]'
                    }`}
                  >
                    {st === 'all' && 'તમામ (All)'}
                    {st === 'unlearned' && 'બાકી (Unlearned)'}
                    {st === 'learning' && 'અભ્યાસ ચાલુ (Learning)'}
                    {st === 'memorized' && 'મુખપાઠ (Memorized)'}
                    {st === 'mastered' && 'સિદ્ધ (Mastered)'}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#8A7A68] dark:text-[#A89886] font-medium">
                શ્લોક {activeShloka ? activeShloka.id : 0} of 315
              </div>
            </div>
          </div>

          {/* Main Interactive Mukhpath Practice Canvas */}
          {activeShloka ? (
            <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E8DFD1] dark:border-[#3D342C] space-y-6">
              {/* Top Info Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F2EADB] dark:border-[#352D26]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-base shadow-sm">
                    #{activeShloka.id}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300">
                      {getShlokaTitle(activeShloka, lang)}
                    </h3>
                    <span className="text-xs text-[#8A7A68] dark:text-[#A89886]">
                      {ui.chapterPrefix} {activeShloka.chapterId}: {getShlokaChapterName(activeShloka, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => globalAudio.play(activeShloka.id, 'sanskrit')}
                    title={isPlayingAudio ? ui.listenAudioStop : ui.listenAudio}
                    className={`text-xs px-3 py-1.5 rounded-xl transition font-medium flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isPlayingAudio 
                        ? 'bg-amber-500 text-amber-950 font-bold animate-pulse' 
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'બંધ કરો' : 'શ્રવણ'}</span>
                  </button>

                  <span className={`text-[11px] px-3 py-1 rounded-full font-semibold border ${
                    currentStatus === 'mastered' 
                      ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200' 
                      : currentStatus === 'memorized'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
                      : currentStatus === 'learning'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                      : 'bg-[#FAF6F0] text-[#7A6B5C] border-[#E8DFD1] dark:bg-[#2C241F] dark:text-[#A89D91]'
                  }`}>
                    {currentStatus === 'mastered' && 'સિદ્ધ કંઠસ્થ ★'}
                    {currentStatus === 'memorized' && 'મુખપાઠ થયેલ ✓'}
                    {currentStatus === 'learning' && 'અભ્યાસ ચાલુ ⏳'}
                    {currentStatus === 'unlearned' && 'શીખવાનું બાકી'}
                  </span>
                </div>
              </div>

              {/* Shloka Verse Presentation according to practice mode */}
              <div className="p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#1C1714] border-2 border-amber-500/20 text-center space-y-4">
                {practiceMode === 'hide_sanskrit' ? (
                  <div>
                    {hideState ? (
                      <div className="py-8 space-y-3">
                        <p className="text-sm text-stone-500 italic">
                          યાદ કરો: શ્લોક #{activeShloka.id} નું સંસ્કૃત લખાણ શું છે?
                        </p>
                        <button
                          onClick={() => setHideState(false)}
                          className="px-4 py-2 rounded-xl bg-[#8B2500] text-white font-semibold text-xs shadow-md hover:bg-[#A63000] transition cursor-pointer"
                        >
                          સંસ્કૃત શ્લોક જુઓ (Reveal Verse)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fadeIn">
                        <p className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line text-lg sm:text-xl">
                          {sanskritVerse}
                        </p>
                        <button
                          onClick={() => setHideState(true)}
                          className="text-xs text-amber-700 dark:text-amber-400 underline cursor-pointer"
                        >
                          ફરીથી છુપાવો
                        </button>
                      </div>
                    )}
                  </div>
                ) : practiceMode === 'pada_reveal' ? (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      {sanskritLines.map((line, lIdx) => (
                        <p 
                          key={lIdx} 
                          className={`font-sanskrit font-bold text-lg sm:text-xl transition-all duration-300 ${
                            lIdx <= padaRevealStep 
                              ? 'text-[#731E00] dark:text-[#F39C38] opacity-100' 
                              : 'text-stone-300 dark:text-stone-700 opacity-20 blur-xs'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => setPadaRevealStep(prev => Math.min(sanskritLines.length - 1, prev + 1))}
                        disabled={padaRevealStep >= sanskritLines.length - 1}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer"
                      >
                        આગળનું પદ ખોલો (Next Line)
                      </button>
                      <button
                        onClick={() => setPadaRevealStep(0)}
                        className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                      >
                        રીસેટ
                      </button>
                    </div>
                  </div>
                ) : practiceMode === 'flashcard' ? (
                  <div 
                    onClick={() => setHideState(!hideState)}
                    className="p-8 rounded-2xl bg-white dark:bg-[#251E19] border-2 border-amber-300 shadow-sm cursor-pointer hover:border-amber-500 transition text-center space-y-4"
                  >
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block">
                      {hideState ? 'કાર્ડ ફેરવવા ક્લિક કરો (Click to Flip: Sanskrit ↺ Meaning)' : 'કાર્ડ ફેરવવા ક્લિક કરો (Click to Flip: Meaning ↺ Sanskrit)'}
                    </span>
                    {hideState ? (
                      <p className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] text-lg sm:text-xl leading-relaxed whitespace-pre-line">
                        {sanskritVerse}
                      </p>
                    ) : (
                      <p className="text-base text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                        {getShlokaMeaning(activeShloka, lang)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line text-lg sm:text-xl">
                    {sanskritVerse}
                  </p>
                )}
              </div>

              {/* Shloka Meaning */}
              {practiceMode !== 'hide_meaning' || !hideState ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#28211B] border-l-4 border-[#8B2500] space-y-1.5">
                  <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300 block uppercase">
                    {lang === 'hindi' ? 'सरल भावार्थ:' : lang === 'english' ? 'Meaning:' : 'સરળ ભાવાર્થ:'}
                  </span>
                  <p className="text-sm text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                    {getShlokaMeaning(activeShloka, lang)}
                  </p>
                  {practiceMode === 'hide_meaning' && !hideState && (
                    <button
                      onClick={() => setHideState(true)}
                      className="text-xs text-amber-700 underline pt-1 cursor-pointer"
                    >
                      અર્થ છુપાવો
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#28211B] border border-dashed border-amber-300 text-center space-y-2">
                  <p className="text-xs text-stone-500">
                    અર્થ યાદ કરો: આ શ્લોકનો ભાવાર્થ શું છે?
                  </p>
                  <button
                    onClick={() => setHideState(false)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs cursor-pointer"
                  >
                    અર્થ જુઓ
                  </button>
                </div>
              )}

              {/* Word-by-Word Padachheda Study Accordion */}
              {PADACHHEDA_DATA[activeShloka.id] && (
                <div className="p-4 rounded-2xl bg-[#FCFAF6] dark:bg-[#1E1916] border border-[#E8DFD1] dark:border-[#352D26] space-y-3">
                  <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300 block">
                    પદચ્છેદ અને શબ્દાર્થ (Word-by-Word Breakdown):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {PADACHHEDA_DATA[activeShloka.id].map((w, wIdx) => (
                      <div key={wIdx} className="p-2.5 rounded-xl bg-white dark:bg-[#28211B] border border-[#EADBCC] dark:border-stone-800 flex items-baseline justify-between gap-2">
                        <span className="font-sanskrit font-bold text-[#7A1E00] dark:text-amber-300">
                          {preferences.sanskritScript === 'devanagari' ? w.wordDevanagari : w.wordGujarati}
                        </span>
                        <span className="text-[#554336] dark:text-stone-300 text-right">
                          {getWordMeaningInLang(w, lang)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Action Pills */}
              <div className="pt-4 border-t border-[#F2EADB] dark:border-[#352D26] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#6B5E51] dark:text-[#C5B7A8] mr-1">
                    તમારો અભ્યાસ સ્ટેટસ:
                  </span>
                  <button
                    onClick={() => onUpdateStatus(activeShloka.id, 'unlearned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentStatus === 'unlearned'
                        ? 'bg-stone-400 text-white font-bold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    બાકી
                  </button>
                  <button
                    onClick={() => onUpdateStatus(activeShloka.id, 'learning')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentStatus === 'learning'
                        ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    અભ્યાસ ચાલુ ⏳
                  </button>
                  <button
                    onClick={() => onUpdateStatus(activeShloka.id, 'memorized')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentStatus === 'memorized'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200'
                    }`}
                  >
                    મુખપાઠ થયેલ ✓
                  </button>
                  <button
                    onClick={() => onUpdateStatus(activeShloka.id, 'mastered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentStatus === 'mastered'
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-200'
                    }`}
                  >
                    સિદ્ધ કંઠસ્થ ★
                  </button>
                </div>

                {/* Navigation Buttons: Previous / Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2C241F] hover:bg-[#EFE8DC] disabled:opacity-30 text-[#8B2500] dark:text-amber-300 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>પાછળ</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIdx === filteredShlokas.length - 1}
                    className="px-3 py-2 rounded-xl bg-[#8B2500] hover:bg-[#A63000] disabled:opacity-30 text-white font-semibold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
                  >
                    <span>આગળ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] text-[#6B5E51]">
              આ ફિલ્ટર માટે કોઈ શ્લોક મળ્યો નથી. કૃપા કરીને ફિલ્ટર બદલો.
            </div>
          )}
        </div>
      )}

      {/* Interactive Level Exam Modal */}
      {examLevelNumber && currentExamSet && (
        <LevelExamModal
          isOpen={!!examLevelNumber}
          onClose={() => setExamLevelNumber(null)}
          levelNumber={examLevelNumber}
          testSet={currentExamSet}
          preferences={preferences}
          onSuccessPass={(_lvl, _pct) => {
            refreshScores();
          }}
          onNextLevel={() => {
            if (examLevelNumber < 26) {
              setExamLevelNumber(examLevelNumber + 1);
            }
          }}
        />
      )}
    </div>
  );
};
