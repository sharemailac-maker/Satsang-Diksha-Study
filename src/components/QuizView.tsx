import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  Trophy,
  Calendar,
  Flame,
  Search,
  Clock,
  Star,
  ArrowLeft,
  Check,
  Zap,
  Layers,
  HelpCircle,
  Lock
} from 'lucide-react';
import { UserPreferences, QuizTestSet, QuizQuestion, QuizAttemptRecord } from '../types';
import { 
  getAllQuizTestSets, 
  getDailySwadhyayTest, 
  getQuestionPrompt, 
  getQuestionOptions, 
  getQuestionExplanation 
} from '../data/quizDatabase';
import { 
  saveQuizAttempt, 
  getQuizAttempts, 
  getBestScores, 
  getDailyStreak, 
  recordDailyCompletion, 
  getBonusUnlockStatus,
  DailyStreakInfo 
} from '../utils/quizStorage';

interface QuizViewProps {
  preferences?: UserPreferences;
  onSelectShloka: (id: number) => void;
}

type QuizMode = 'catalog' | 'taking' | 'result';

export const QuizView: React.FC<QuizViewProps> = ({ preferences, onSelectShloka }) => {
  const activeLang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const sanskritScript = preferences?.sanskritScript || 'gujarati';

  const allTestSets = useMemo(() => getAllQuizTestSets(), []);
  const totalQuestionsCount = useMemo(() => allTestSets.reduce((sum, s) => sum + s.questions.length, 0), [allTestSets]);

  // View mode
  const [mode, setMode] = useState<QuizMode>('catalog');

  // Selected test set
  const [activeSet, setActiveSet] = useState<QuizTestSet>(allTestSets[0]);
  const [isDailyMode, setIsDailyMode] = useState<boolean>(false);

  // Active quiz state (during test taking)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Completed result state
  const [latestAttempt, setLatestAttempt] = useState<QuizAttemptRecord | null>(null);
  const [showOnlyMistakes, setShowOnlyMistakes] = useState<boolean>(false);

  // Local state for statistics & streak
  const [streakInfo, setStreakInfo] = useState<DailyStreakInfo>(getDailyStreak());
  const [bestScores, setBestScores] = useState<Record<string, { score: number; total: number; percentage: number; date: string }>>({});
  const [recentAttempts, setRecentAttempts] = useState<QuizAttemptRecord[]>([]);

  // Search and filter in catalog
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'attempted' | 'mastered'>('all');

  // Load scores & history on mount
  useEffect(() => {
    setStreakInfo(getDailyStreak());
    setBestScores(getBestScores());
    setRecentAttempts(getQuizAttempts());
  }, [mode]);

  // Timer during quiz taking
  useEffect(() => {
    let timer: any;
    if (mode === 'taking') {
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, startTime]);

  // Today's daily test set
  const dailySet = useMemo(() => getDailySwadhyayTest(), []);

  // Start a regular test set
  const handleStartSet = (testSet: QuizTestSet, daily: boolean = false) => {
    if (!daily && testSet.id >= 27) {
      const bonusInfo = getBonusUnlockStatus(testSet.id, bestScores);
      if (!bonusInfo.isUnlocked) {
        return;
      }
    }
    setActiveSet(testSet);
    setIsDailyMode(daily);
    setCurrentIdx(0);
    setUserSelectedOptions({});
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setShowOnlyMistakes(false);
    setMode('taking');
  };

  // User selects an option for current question
  const handleSelectOption = (optIdx: number) => {
    setUserSelectedOptions(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  // Submit test and compute results
  const handleSubmitTest = () => {
    const questions = activeSet.questions;
    let score = 0;
    const userAnswers = questions.map((q, idx) => {
      const selected = userSelectedOptions[idx] !== undefined ? userSelectedOptions[idx] : -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        shlokaId: q.shlokaId,
        selectedOption: selected,
        correctOption: q.correctIndex,
        isCorrect
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

    const record: QuizAttemptRecord = {
      id: 'att_' + Date.now(),
      testSetId: isDailyMode ? 'daily' : activeSet.id,
      testTitle: isDailyMode 
        ? (activeLang === 'hindi' ? 'दैनिक स्वाध्याय टेस्ट (20 प्रश्न)' : activeLang === 'english' ? 'Daily Swadhyay Test (20 Qs)' : 'દૈનિક સ્વાધ્યાય ટેસ્ટ (૨૦ પ્રશ્નો)')
        : getSetTitle(activeSet, activeLang),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      score,
      total,
      percentage,
      timeSpentSeconds: timeSpent,
      userAnswers
    };

    // Save offline
    saveQuizAttempt(record);
    if (isDailyMode) {
      const updatedStreak = recordDailyCompletion();
      setStreakInfo(updatedStreak);
    }

    setLatestAttempt(record);
    setBestScores(getBestScores());
    setRecentAttempts(getQuizAttempts());
    setMode('result');
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filtered test sets in catalog
  const filteredSets = useMemo(() => {
    return allTestSets.filter(set => {
      // Search term
      if (catalogSearch.trim()) {
        const term = catalogSearch.toLowerCase().trim();
        const num = parseInt(term, 10);
        if (!isNaN(num)) {
          // If searching by shloka number (e.g. 55)
          const inRange = num >= set.startShloka && num <= set.endShloka;
          const matchSetId = set.id === num;
          if (!inRange && !matchSetId) return false;
        } else {
          const matchTitle = set.titleGu.toLowerCase().includes(term) ||
                             set.titleHi.toLowerCase().includes(term) ||
                             set.titleEn.toLowerCase().includes(term) ||
                             set.chapterGu.toLowerCase().includes(term);
          if (!matchTitle) return false;
        }
      }

      // Filter
      const best = bestScores[String(set.id)];
      if (catalogFilter === 'attempted' && !best) return false;
      if (catalogFilter === 'mastered' && (!best || best.percentage < 80)) return false;

      return true;
    });
  }, [allTestSets, catalogSearch, catalogFilter, bestScores]);

  // Helper for set title in current language
  function getSetTitle(set: QuizTestSet, lang: string): string {
    if (lang === 'hindi' || lang === 'marathi') return set.titleHi || set.titleGu;
    if (lang === 'english') return set.titleEn;
    if (lang === 'gujarati') return set.titleGu;
    return set.titleEn || set.titleGu;
  }

  // Helper for chapter title in current language
  function getSetChapter(set: QuizTestSet, lang: string): string {
    if (lang === 'hindi' || lang === 'marathi') return set.chapterHi || set.chapterGu;
    if (lang === 'english') return set.chapterEn;
    if (lang === 'gujarati') return set.chapterGu;
    return set.chapterEn || set.chapterGu;
  }

  // Helper for set badge label (e.g. सेट 1, સેટ 1, Set 1)
  function getSetBadgeLabel(id: number, lang: string): string {
    if (lang === 'hindi' || lang === 'marathi') return `सेट ${id}`;
    if (lang === 'english') return `Set ${id}`;
    if (lang === 'gujarati') return `સેટ ${id}`;
    return `Set ${id}`;
  }

  // Current question during test taking
  const currentQ = activeSet.questions[currentIdx];
  const currentPrompt = currentQ ? getQuestionPrompt(currentQ, activeLang, sanskritScript) : '';
  const currentOptions = currentQ ? getQuestionOptions(currentQ, sanskritScript, activeLang) : [];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Quiz Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                {activeLang === 'hindi' ? 'सत्संग दीक्षा स्वाध्याय परीक्षा' : activeLang === 'english' ? 'Satsang Diksha Swadhyay Quiz' : 'સત્સંગ દીક્ષા સ્વાધ્યાય કસોટી'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50">
              {activeLang === 'hindi' ? 'संस्कृत श्लोक स्वाध्याय व अभ्यास' : activeLang === 'english' ? 'Sanskrit Verse Study & Mastery' : 'સંસ્કૃત શ્લોક સ્વાધ્યાય અને પરીક્ષા'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
              {activeLang === 'hindi' 
                ? `${allTestSets.length} टेस्ट सेट • ${totalQuestionsCount} प्रश्न • दैनिक स्वाध्याय टेस्ट • शत-प्रतिशत ऑफलाइन`
                : activeLang === 'english'
                ? `${allTestSets.length} Curated Test Sets • ${totalQuestionsCount} Questions • Daily Swadhyay Practice • 100% Offline`
                : `${allTestSets.length} ટેસ્ટ સેટ • ${totalQuestionsCount} પ્રશ્નો • દૈનિક સ્વાધ્યાય કસોટી • ૧૦૦% ઓફલાઇન`}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] text-amber-200 uppercase font-semibold">
                {activeLang === 'hindi' ? 'दैनिक शृंखला' : activeLang === 'english' ? 'Daily Streak' : 'દૈનિક શૃંખલા'}
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-center gap-1">
                <span>{streakInfo.streak}</span>
                <span className="text-xs text-amber-200 font-sans">
                  {activeLang === 'hindi' ? 'दिन' : activeLang === 'english' ? 'Days' : 'દિવસ'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: CATALOG OF TEST SETS + DAILY TEST HERO */}
      {/* ========================================================================= */}
      {mode === 'catalog' && (
        <div className="space-y-6">
          {/* DAILY SWADHYAY TEST HERO CARD */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#29201A] dark:to-[#1F1813] border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/70 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {activeLang === 'hindi' ? `आज का दैनिक स्वाध्याय टेस्ट (${dailySet.questions.length} प्रश्न)` : activeLang === 'english' ? `Today's Daily Swadhyay Test (${dailySet.questions.length} Qs)` : `આજનો દૈનિક સ્વાધ્યાય ટેસ્ટ (${dailySet.questions.length} પ્રશ્નો)`}
                  </span>
                  {streakInfo.completedToday && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                      ✓ {activeLang === 'hindi' ? 'आज पूर्ण' : activeLang === 'english' ? 'Completed Today' : 'આજે પૂર્ણ'}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
                  {getSetTitle(dailySet, activeLang)}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
                  {activeLang === 'hindi' 
                    ? `आज के निर्धारित श्लोक: ${dailySet.startShloka} से ${dailySet.endShloka} (${getSetChapter(dailySet, activeLang)}). ${dailySet.questions.length} प्रश्नों से अपने ज्ञान की परीक्षा लीजिए!`
                    : activeLang === 'english'
                    ? `Today's focused verses: Shlokas ${dailySet.startShloka} to ${dailySet.endShloka} (${getSetChapter(dailySet, activeLang)}). Test your mastery with ${dailySet.questions.length} questions!`
                    : `આજના નિર્ધારિત શ્લોકો: ${dailySet.startShloka} થી ${dailySet.endShloka} (${getSetChapter(dailySet, activeLang)}). ${dailySet.questions.length} પ્રશ્નોથી તમારા જ્ઞાનની પરીક્ષા લો!`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartSet(dailySet, true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>
                    {streakInfo.completedToday 
                      ? (activeLang === 'hindi' ? 'दैनिक टेस्ट पुनः दें' : activeLang === 'english' ? 'Retake Daily Test' : 'દૈનિક ટેસ્ટ ફરીથી આપો')
                      : (activeLang === 'hindi' ? `दैनिक टेस्ट शुरू करें (${dailySet.questions.length} प्रश्न)` : activeLang === 'english' ? `Start Daily Test (${dailySet.questions.length} Qs)` : `દૈનિક ટેસ્ટ શરૂ કરો (${dailySet.questions.length} પ્રશ્નો)`)}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Catalog Filter & Search Bar */}
          <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 border border-[#E8DFD1] dark:border-[#3D342C] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeLang === 'hindi' ? 'श्लोक नंबर या विषय खोजें...' : activeLang === 'english' ? 'Search verse # or topic...' : 'શ્લોક નંબર અથવા વિષય શોધો...'}
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-[#2C241F] border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  catalogFilter === 'all'
                    ? 'bg-[#8B2500] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {activeLang === 'hindi' ? `सभी ${allTestSets.length} सेट (${totalQuestionsCount} प्रश्न)` : activeLang === 'english' ? `All ${allTestSets.length} Sets (${totalQuestionsCount} Qs)` : `બધા ${allTestSets.length} સેટ (${totalQuestionsCount} પ્રશ્નો)`}
              </button>

              <button
                onClick={() => setCatalogFilter('attempted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  catalogFilter === 'attempted'
                    ? 'bg-[#8B2500] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {activeLang === 'hindi' ? 'प्रयास किए गए' : activeLang === 'english' ? 'Attempted' : 'આપેલા ટેસ્ટ'}
              </button>

              <button
                onClick={() => setCatalogFilter('mastered')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  catalogFilter === 'mastered'
                    ? 'bg-[#8B2500] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {activeLang === 'hindi' ? 'उत्कृष्ट (80%+)' : activeLang === 'english' ? 'Mastered (80%+)' : 'ઉત્કૃષ્ટ (૮૦%+)'}
              </button>
            </div>
          </div>

          {/* Ascending 26 Sets Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-semibold px-1">
              <span>
                {activeLang === 'hindi' 
                  ? `कुल ${filteredSets.length} टेस्ट सेट उपलब्ध`
                  : activeLang === 'english'
                  ? `Showing ${filteredSets.length} Test Sets`
                  : `કુલ ${filteredSets.length} ટેસ્ટ સેટ ઉપલબ્ધ`}
              </span>
              <span>
                {activeLang === 'hindi' ? 'क्रमशः 1 से 315 श्लोक' : activeLang === 'english' ? 'Ascending Verses 1 to 315' : 'ક્રમશઃ ૧ થી ૩૧૫ શ્લોક'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSets.map(testSet => {
                const best = bestScores[String(testSet.id)];
                const bonusInfo = testSet.id >= 27 ? getBonusUnlockStatus(testSet.id, bestScores) : null;
                const isLocked = bonusInfo ? !bonusInfo.isUnlocked : false;

                return (
                  <div
                    key={testSet.id}
                    className={`rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between gap-4 group ${
                      isLocked
                        ? 'bg-stone-50/90 dark:bg-[#1C1613] border-stone-200 dark:border-stone-800 opacity-85'
                        : testSet.id === 32
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#2A180E] dark:to-[#1C130D] border-2 border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-white dark:bg-[#221D1A] border-[#E8DFD1] dark:border-[#3D342C] hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                          testSet.id === 32
                            ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-extrabold'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                        }`}>
                          <Layers className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                          <span>{getSetBadgeLabel(testSet.id, activeLang)}</span>
                          <span className="text-amber-500">•</span>
                          <span>{testSet.questionsCount} Qs</span>
                        </span>

                        {isLocked ? (
                          <div className="px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <Lock className="w-3 h-3" />
                            <span>{bonusInfo?.passedCount}/{bonusInfo?.totalCount} પાસ (૯૦%+)</span>
                          </div>
                        ) : best ? (
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono flex items-center gap-1 ${
                            best.percentage >= 80 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : best.percentage >= 50
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}>
                            <Star className="w-3 h-3 fill-current" />
                            <span>{best.score}/{best.total} ({best.percentage}%)</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium">
                            {activeLang === 'hindi' ? 'नया टेस्ट' : activeLang === 'english' ? 'Not Attempted' : 'નવો ટેસ્ટ'}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] group-hover:text-[#8B2500] dark:group-hover:text-amber-300 transition-colors">
                          {getSetTitle(testSet, activeLang)}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {getSetChapter(testSet, activeLang)}
                        </p>
                        {isLocked && bonusInfo && (
                          <p className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold mt-1">
                            {activeLang === 'hindi' ? bonusInfo.labelHi : activeLang === 'english' ? bonusInfo.labelEn : bonusInfo.labelGu}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        {activeLang === 'hindi' ? 'श्लोक ' : activeLang === 'english' ? 'Verses ' : 'શ્લોક '}
                        <strong className="text-stone-800 dark:text-stone-200">{testSet.startShloka} - {testSet.endShloka}</strong>
                      </div>

                      {isLocked ? (
                        <button
                          disabled
                          className="px-3.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed"
                          title={activeLang === 'hindi' ? bonusInfo?.labelHi : activeLang === 'english' ? bonusInfo?.labelEn : bonusInfo?.labelGu}
                        >
                          <Lock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{activeLang === 'hindi' ? 'लॉक (९०%+ आवश्यक)' : activeLang === 'english' ? 'Locked (90%+ req)' : 'લૉક (૯૦%+ જરૂરી)'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartSet(testSet, false)}
                          className="px-4 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2C241F] hover:bg-[#8B2500] hover:text-white dark:hover:bg-[#8B2500] text-[#8B2500] dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <span>{activeLang === 'hindi' ? 'टेस्ट दें' : activeLang === 'english' ? 'Start Test' : 'ટેસ્ટ આપો'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TAKING A 20-QUESTION TEST */}
      {/* ========================================================================= */}
      {mode === 'taking' && currentQ && (
        <div className="space-y-5">
          {/* Top Control Bar */}
          <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 border border-[#E8DFD1] dark:border-[#3D342C] shadow-sm flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (window.confirm(activeLang === 'hindi' ? 'क्या आप टेस्ट छोड़कर वापस जाना चाहते हैं?' : activeLang === 'english' ? 'Leave test and return to catalog?' : 'શું તમે આ કસોટી છોડીને પાછા જવા માંગો છો?')) {
                  setMode('catalog');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activeLang === 'hindi' ? 'छोड़ें' : activeLang === 'english' ? 'Exit' : 'પાછા'}</span>
            </button>

            <div className="text-center">
              <div className="text-xs font-bold text-[#8B2500] dark:text-amber-300 font-serif">
                {isDailyMode 
                  ? (activeLang === 'hindi' ? 'दैनिक स्वाध्याय टेस्ट' : activeLang === 'english' ? 'Daily Swadhyay Test' : 'દૈનિક સ્વાધ્યાય ટેસ્ટ')
                  : getSetTitle(activeSet, activeLang)}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {activeLang === 'hindi' ? 'प्रश्न ' : activeLang === 'english' ? 'Question ' : 'પ્રશ્ન '}
                <strong className="text-stone-800 dark:text-stone-100">{currentIdx + 1}</strong> / {activeSet.questions.length}
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Progress Bar with 20 Question Dots */}
          <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-3 border border-[#E8DFD1] dark:border-[#3D342C] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>{Math.round(((Object.keys(userSelectedOptions).length) / activeSet.questions.length) * 100)}% {activeLang === 'hindi' ? 'पूर्ण' : activeLang === 'english' ? 'Answered' : 'જવાબ આપ્યા'}</span>
              <span>{Object.keys(userSelectedOptions).length} / {activeSet.questions.length}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
              {activeSet.questions.map((_, dotIdx) => {
                const isCurrent = dotIdx === currentIdx;
                const isAnswered = userSelectedOptions[dotIdx] !== undefined;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIdx(dotIdx)}
                    className={`flex-1 min-w-[14px] h-2.5 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-[#8B2500] ring-2 ring-amber-400'
                        : isAnswered
                        ? 'bg-emerald-500'
                        : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                    title={`Question ${dotIdx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E8DFD1] dark:border-[#3D342C] space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 font-mono">
                {activeLang === 'hindi' ? `प्रश्न ${currentIdx + 1} / ${activeSet.questions.length}` : activeLang === 'english' ? `Question ${currentIdx + 1} of ${activeSet.questions.length}` : `પ્રશ્ન ${currentIdx + 1} / ${activeSet.questions.length}`}
              </span>

              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {activeSet.id === 32 ? (activeLang === 'english' ? 'Grand 100 Qs Test' : 'સર્વોચ્ચ ૧૦૦ પ્રશ્નોની મહાપરીક્ષા') : (activeLang === 'english' ? 'Swadhyay Exam' : 'સ્વાધ્યાય કસોટી')}
              </span>
            </div>

            {/* Prompt in user's active language */}
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed whitespace-pre-line">
              {currentPrompt}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">
                {activeLang === 'hindi' ? 'विकल्प:' : activeLang === 'english' ? 'Options:' : 'વિકલ્પો:'}
              </div>

              {currentOptions.map((optText, optIdx) => {
                const isSelected = userSelectedOptions[currentIdx] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 text-sm sm:text-base font-serif leading-relaxed ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-[#8B2500] dark:border-amber-400 text-[#8B2500] dark:text-amber-100 font-bold shadow-sm ring-1 ring-[#8B2500]/20'
                        : 'bg-[#FAF6F0] dark:bg-[#2C241F] border-[#E8DFD1] dark:border-[#3D342C] text-[#2D241E] dark:text-[#EDE5D8] hover:bg-[#F2EADB] dark:hover:bg-[#362C26]'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-sans text-xs font-bold flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#8B2500] text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="flex-1 pt-0.5">{optText}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#8B2500] dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{activeLang === 'hindi' ? 'पिछला' : activeLang === 'english' ? 'Previous' : 'પાછળ'}</span>
              </button>

              {currentIdx < activeSet.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-md"
                >
                  <span>{activeLang === 'hindi' ? 'अगला प्रश्न' : activeLang === 'english' ? 'Next' : 'આગળનો પ્રશ્ન'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md animate-pulse"
                >
                  <Check className="w-4 h-4" />
                  <span>{activeLang === 'hindi' ? 'टेस्ट सबमिट करें' : activeLang === 'english' ? 'Submit Test' : 'ટેસ્ટ સબમિટ કરો'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: RESULT AND DETAILED QUESTION-BY-QUESTION REVIEW */}
      {/* Right Answer in GREEN, Wrong Answer in RED */}
      {/* ========================================================================= */}
      {mode === 'result' && latestAttempt && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E8DFD1] dark:border-[#3D342C] text-center space-y-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-inner border-2 ${
              latestAttempt.percentage >= 80
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                : latestAttempt.percentage >= 50
                ? 'bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 border-amber-400'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-400'
            }`}>
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {latestAttempt.testTitle}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
                {latestAttempt.percentage >= 80 
                  ? (activeLang === 'hindi' ? 'उत्कृष्ट स्वाध्याय!' : activeLang === 'english' ? 'Excellent Performance!' : 'અભિનંદન! ઉત્કૃષ્ટ સ્વાધ્યાય!')
                  : latestAttempt.percentage >= 50
                  ? (activeLang === 'hindi' ? 'सराहनीय प्रयास!' : activeLang === 'english' ? 'Good Effort!' : 'સુંદર પ્રયાસ! ઉત્તીર્ણ!')
                  : (activeLang === 'hindi' ? 'पुनः अभ्यास करें' : activeLang === 'english' ? 'Needs Practice' : 'પુનઃ સ્વાધ્યાય આવશ્યક')}
              </h2>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#8B2500] dark:text-amber-300">
                {latestAttempt.score} / {latestAttempt.total}
                <span className="text-lg font-sans text-stone-500 dark:text-stone-400 ml-2">
                  ({latestAttempt.percentage}%)
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto py-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                  {activeLang === 'hindi' ? 'सही' : activeLang === 'english' ? 'Correct' : 'સાચા'}
                </div>
                <div className="text-lg font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {latestAttempt.score}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <div className="text-[10px] text-rose-800 dark:text-rose-300 font-bold uppercase">
                  {activeLang === 'hindi' ? 'गलत' : activeLang === 'english' ? 'Incorrect' : 'ખોટા'}
                </div>
                <div className="text-lg font-mono font-bold text-rose-700 dark:text-rose-300">
                  {latestAttempt.total - latestAttempt.score}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <div className="text-[10px] text-stone-600 dark:text-stone-300 font-bold uppercase">
                  {activeLang === 'hindi' ? 'समय' : activeLang === 'english' ? 'Time' : 'સમય'}
                </div>
                <div className="text-lg font-mono font-bold text-stone-700 dark:text-stone-200">
                  {formatTime(latestAttempt.timeSpentSeconds)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartSet(activeSet, isDailyMode)}
                className="px-5 py-2.5 rounded-2xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{activeLang === 'hindi' ? 'यह टेस्ट पुनः दें' : activeLang === 'english' ? 'Retake Test' : 'આ ટેસ્ટ ફરીથી આપો'}</span>
              </button>

              <button
                onClick={() => setMode('catalog')}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Layers className="w-4 h-4" />
                <span>{activeLang === 'hindi' ? 'अन्य टेस्ट सेट चुनें' : activeLang === 'english' ? 'Choose Another Set' : 'બીજો ટેસ્ટ સેટ પસંદ કરો'}</span>
              </button>
            </div>
          </div>

          {/* QUESTION REVIEW FILTER HEADER */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] flex items-center gap-2">
              <span>{activeLang === 'hindi' ? 'विस्तृत प्रश्न समीक्षा (20 प्रश्न)' : activeLang === 'english' ? 'Detailed Question Review (20 Questions)' : 'સંપૂર્ણ પ્રશ્ન સમીક્ષા (૨૦ પ્રશ્નો)'}</span>
            </h3>

            <button
              onClick={() => setShowOnlyMistakes(!showOnlyMistakes)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                showOnlyMistakes
                  ? 'bg-rose-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{activeLang === 'hindi' ? 'केवल गलत उत्तर देखें' : activeLang === 'english' ? 'Show Only Mistakes' : 'માત્ર ખોટા પડેલા જુઓ'}</span>
            </button>
          </div>

          {/* QUESTION-BY-QUESTION REVIEW LIST (RIGHT IN GREEN, WRONG IN RED) */}
          <div className="space-y-5">
            {activeSet.questions
              .map((q, idx) => ({ q, idx, ans: latestAttempt.userAnswers[idx] }))
              .filter(item => !showOnlyMistakes || !item.ans.isCorrect)
              .map(({ q, idx, ans }) => {
                const prompt = getQuestionPrompt(q, activeLang, sanskritScript);
                const options = getQuestionOptions(q, sanskritScript);
                const explanation = getQuestionExplanation(q, activeLang, sanskritScript);

                return (
                  <div
                    key={q.id}
                    className={`bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-7 shadow-sm border-2 transition-all space-y-4 ${
                      ans.isCorrect
                        ? 'border-emerald-300 dark:border-emerald-900/60'
                        : 'border-rose-300 dark:border-rose-900/60'
                    }`}
                  >
                    {/* Review Item Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-400">
                          #{idx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold">
                          {activeLang === 'hindi' ? `श्लोक ${q.shlokaId}` : activeLang === 'english' ? `Shloka ${q.shlokaId}` : `શ્લોક ${q.shlokaId}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ans.isCorrect ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>{activeLang === 'hindi' ? 'सही उत्तर' : activeLang === 'english' ? 'Correct' : 'સાચો ઉત્તર'}</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            <span>{activeLang === 'hindi' ? 'गलत उत्तर' : activeLang === 'english' ? 'Incorrect' : 'ખોટો ઉત્તર'}</span>
                          </span>
                        )}

                        <button
                          onClick={() => onSelectShloka(q.shlokaId)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 text-xs font-medium flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{activeLang === 'hindi' ? 'श्लोक पढ़ें' : activeLang === 'english' ? 'View' : 'વાચક'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <h4 className="text-base font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed whitespace-pre-line">
                      {prompt}
                    </h4>

                    {/* 4 Options with GREEN for Right Answer and RED for Wrong Answer */}
                    <div className="space-y-2.5">
                      {options.map((optText, optIdx) => {
                        const isCorrectOption = optIdx === q.correctIndex;
                        const isUserSelected = ans.selectedOption === optIdx;
                        const letter = String.fromCharCode(65 + optIdx);

                        // Styling criteria:
                        // 1. Correct Answer: HIGHLIGHTED IN GREEN
                        // 2. User Selected Wrong Answer: HIGHLIGHTED IN RED
                        // 3. Other Neutral Options: Muted
                        let cardStyle = "bg-[#FAF6F0]/60 dark:bg-[#2C241F]/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 opacity-80";
                        let badgeStyle = "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300";

                        if (isCorrectOption) {
                          // GREEN HIGHLIGHT FOR RIGHT ANSWER
                          cardStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm";
                          badgeStyle = "bg-emerald-600 text-white";
                        } else if (isUserSelected && !isCorrectOption) {
                          // RED HIGHLIGHT FOR USER'S WRONG ANSWER
                          cardStyle = "bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-950 dark:text-rose-100 font-bold shadow-sm";
                          badgeStyle = "bg-rose-600 text-white";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 text-sm sm:text-base font-serif ${cardStyle}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-sans text-xs font-bold flex-shrink-0 mt-0.5 ${badgeStyle}`}>
                                {letter}
                              </span>
                              <span className="pt-0.5">{optText}</span>
                            </div>

                            {/* Status label next to option */}
                            <div className="flex-shrink-0 pt-0.5">
                              {isCorrectOption && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 font-sans px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>
                                    {isUserSelected
                                      ? (activeLang === 'hindi' ? 'आपका सही उत्तर' : activeLang === 'english' ? 'Your Correct Answer' : 'તમારો ઉત્તર (સાચો)')
                                      : (activeLang === 'hindi' ? 'सही उत्तर' : activeLang === 'english' ? 'Right Answer' : 'સાચો ઉત્તર')}
                                  </span>
                                </span>
                              )}

                              {isUserSelected && !isCorrectOption && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 font-sans px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>
                                    {activeLang === 'hindi' ? 'आपका गलत चयन' : activeLang === 'english' ? 'Your Selection' : 'તમારો ઉત્તર (ખોટો)'}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#29201A]/70 border border-amber-200 dark:border-amber-900/50 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>{activeLang === 'hindi' ? 'श्लोक व शास्त्रीय रहस्य:' : activeLang === 'english' ? 'Sanskrit Verse & Teaching:' : 'શ્લોક અને શાસ્ત્રીય રહસ્ય:'}</span>
                      </div>

                      {/* Full Sanskrit Verse */}
                      <div className="text-xs sm:text-sm font-serif font-semibold text-stone-800 dark:text-stone-200 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-amber-200/50 whitespace-pre-line leading-relaxed">
                        {sanskritScript === 'devanagari' ? q.fullSanskritDevanagari : q.fullSanskritGujarati}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                        {explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
