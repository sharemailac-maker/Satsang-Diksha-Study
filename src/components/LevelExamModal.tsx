import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Sparkles,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';
import { QuizTestSet, QuizQuestion, UserPreferences, QuizAttemptRecord } from '../types';
import { getQuestionPrompt, getQuestionOptions, getQuestionExplanation } from '../data/quizDatabase';
import { saveQuizAttempt, recordDailyCompletion } from '../utils/quizStorage';

interface LevelExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelNumber: number;
  testSet: QuizTestSet;
  preferences?: UserPreferences;
  onSuccessPass: (levelNumber: number, percentage: number) => void;
  onNextLevel?: () => void;
}

export function getExamGrade(percentage: number, lang: string = 'gujarati') {
  if (percentage < 50) {
    return {
      passed: false,
      gradeKey: 'failed',
      title: lang === 'hindi' ? 'पुनः प्रयास करें (५०% से कम)' : lang === 'english' ? 'Re-attempt Needed (<50%)' : 'પુનઃ પ્રયાસ કરો (૫૦% થી ઓછા)',
      desc: lang === 'hindi' ? 'पास होने के लिए न्यूनतम ५०% अंक अनिवार्य हैं।' : lang === 'english' ? 'Minimum 50% score required to pass & unlock next level.' : 'પાસ થવા અને નેકસ્ટ સેશન ખોલવા માટે લઘુત્તમ ૫૦% સ્કોર ફરજિયાત છે.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200',
      icon: '❌'
    };
  }
  if (percentage >= 95) {
    return {
      passed: true,
      gradeKey: 'distinction',
      title: lang === 'hindi' ? '🌟 विशेष योग्यता (Distinction ९५%+)' : lang === 'english' ? '🌟 Special Distinction (95%+)' : '🌟 વિશેષ યોગ્યતા (Distinction ૯૫%+)',
      desc: lang === 'hindi' ? 'अद्भुत पांडित्य एवं उत्कृष्ट मुखपाठ!' : lang === 'english' ? 'Outstanding mastery and profound scripture understanding!' : 'અદભુત પાંડિત્ય અને સર્વોત્કૃષ્ટ મુખપાઠ સાધના!',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/80 dark:text-amber-200',
      icon: '🏆'
    };
  }
  if (percentage >= 90) {
    return {
      passed: true,
      gradeKey: 'first_class',
      title: lang === 'hindi' ? '🥇 प्रथम श्रेणी (First Class ९०%)' : lang === 'english' ? '🥇 First Class (90%)' : '🥇 પ્રથમ શ્રેણી (First Class ૯૦%)',
      desc: lang === 'hindi' ? 'उत्कृष्ट स्वाध्याय एवं श्रेष्ठ ज्ञान!' : lang === 'english' ? 'Excellent performance and high accuracy!' : 'ઉત્કૃષ્ટ સ્વાધ્યાય અને શ્રેષ્ઠ જ્ઞાન પ્રાપ્તિ!',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
      icon: '🥇'
    };
  }
  if (percentage >= 75) {
    return {
      passed: true,
      gradeKey: 'second_class',
      title: lang === 'hindi' ? '🥈 द्वितीय श्रेणी (Second Class ७५%)' : lang === 'english' ? '🥈 Second Class (75%)' : '🥈 દ્વિતીય શ્રેણી (Second Class ૭૫%)',
      desc: lang === 'hindi' ? 'बहुत अच्छा स्वाध्याय एवं अभ्यास!' : lang === 'english' ? 'Very good performance and steady study!' : 'ખૂબ સુંદર સ્વાધ્યાય અને ઉત્તમ અભ્યાસ!',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
      icon: '🥈'
    };
  }
  if (percentage >= 60) {
    return {
      passed: true,
      gradeKey: 'third_class',
      title: lang === 'hindi' ? '🥉 तृतीय श्रेणी (Third Class ६०%)' : lang === 'english' ? '🥉 Third Class (60%)' : '🥉 તૃતીય શ્રેણી (Third Class ૬૦%)',
      desc: lang === 'hindi' ? 'सराहनीय स्वाध्याय प्रयास!' : lang === 'english' ? 'Good effort and successful pass!' : 'સુંદર સ્વાધ્યાય પ્રયાસ અને સફળતા!',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
      icon: '🥉'
    };
  }
  return {
    passed: true,
    gradeKey: 'pass',
    title: lang === 'hindi' ? '✓ उत्तीर्ण (Pass ५०%)' : lang === 'english' ? '✓ Pass (50%)' : '✓ ઉત્તીર્ણ (Pass ૫૦%)',
    desc: lang === 'hindi' ? 'न्यूनतम ५०% अंक प्राप्त, अगला सत्र खुला!' : lang === 'english' ? 'Minimum 50% met, next level unlocked!' : '૫૦% સ્કોર પૂર્ણ થયો, આગળનું સેશન અનલૉક થયું!',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200',
    icon: '✓'
  };
}

export const LevelExamModal: React.FC<LevelExamModalProps> = ({
  isOpen,
  onClose,
  levelNumber,
  testSet,
  preferences,
  onSuccessPass,
  onNextLevel
}) => {
  const lang = preferences?.activeLanguage || 'gujarati';
  const sanskritScript = preferences?.sanskritScript || 'gujarati';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttemptRecord | null>(null);
  const [showOnlyMistakes, setShowOnlyMistakes] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setUserSelectedOptions({});
      setIsCompleted(false);
      setLatestAttempt(null);
      setShowOnlyMistakes(false);
      setStartTime(Date.now());
      setElapsedSeconds(0);
    }
  }, [isOpen, testSet.id, levelNumber]);

  // Timer
  useEffect(() => {
    if (!isOpen || isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isCompleted, startTime]);

  if (!isOpen) return null;

  const questions = testSet.questions;
  const currentQ = questions[currentIdx];
  const currentPrompt = currentQ ? getQuestionPrompt(currentQ, lang, sanskritScript) : '';
  const currentOptions = currentQ ? getQuestionOptions(currentQ, sanskritScript) : [];

  const handleSelectOption = (optIndex: number) => {
    setUserSelectedOptions(prev => ({
      ...prev,
      [currentIdx]: optIndex
    }));
  };

  const handleSubmit = () => {
    let score = 0;
    const userAnswers = questions.map((q, idx) => {
      const selected = userSelectedOptions[idx] ?? -1;
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score++;
      return {
        questionId: q.id,
        shlokaId: q.shlokaId,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

    const record: QuizAttemptRecord = {
      id: `attempt_lvl_${levelNumber}_${Date.now()}`,
      testSetId: testSet.id,
      testTitle: `લેવલ ${levelNumber}: શ્લોક ${testSet.startShloka} થી ${testSet.endShloka}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      score,
      total,
      percentage,
      timeSpentSeconds: timeSpent,
      userAnswers
    };

    saveQuizAttempt(record);
    recordDailyCompletion();
    setLatestAttempt(record);
    setIsCompleted(true);

    if (percentage >= 50) {
      onSuccessPass(levelNumber, percentage);
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setUserSelectedOptions({});
    setIsCompleted(false);
    setLatestAttempt(null);
    setShowOnlyMistakes(false);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  const gradeInfo = latestAttempt ? getExamGrade(latestAttempt.percentage, lang) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] bg-[#FAF5EC] dark:bg-[#1E1814] border border-[#ECD8BE] dark:border-stone-800 text-[#2D1A0E] dark:text-[#EAE0D5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#6E1803] via-[#852305] to-[#B35800] px-4 sm:px-6 py-3.5 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-base shadow-sm">
              #{levelNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-200">
                  {lang === 'hindi' ? `लेवल ${levelNumber} परीक्षा` : lang === 'english' ? `Level ${levelNumber} Exam` : `લેવલ ${levelNumber} સ્તર પરીક્ષા`}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                  શ્લોક {testSet.startShloka} - {testSet.endShloka}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
                {lang === 'hindi' ? testSet.chapterHi : lang === 'english' ? testSet.chapterEn : testSet.chapterGu}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!isCompleted ? (
            /* ================= TAKING EXAM ================= */
            <div className="space-y-6">
              {/* Progress & Timer Bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#7A6B5C] dark:text-[#A89886] border-b border-[#EBDCCB] dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-950/60 text-[#7A1E00] dark:text-amber-300 font-bold">
                    પ્રશ્ન {currentIdx + 1} / {questions.length}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                    (પાસ સ્કોર: ૫૦% = {Math.ceil(questions.length * 0.5)} પ્રશ્નો)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E5DACE] dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-[#8B2500] h-full rounded-full transition-all duration-200"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Sanskrit Verse excerpt */}
              {currentQ.verseExcerptGujarati && (
                <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#251E19] border border-amber-300/60 dark:border-amber-900/40 text-center shadow-2xs">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-1">
                    સંસ્કૃત શ્લોક સંદર્ભ (શ્લોક #{currentQ.shlokaId})
                  </span>
                  <p className="font-sanskrit font-bold text-[#731E00] dark:text-amber-300 text-base sm:text-lg">
                    {sanskritScript === 'devanagari' ? currentQ.verseExcerptDevanagari : currentQ.verseExcerptGujarati}
                  </p>
                </div>
              )}

              {/* Question Text */}
              <div className="bg-white dark:bg-[#251E19] p-4 sm:p-5 rounded-2xl border border-[#E8DFD1] dark:border-stone-800 shadow-2xs">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                  {currentPrompt}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentOptions.map((opt, oIdx) => {
                  const isSelected = userSelectedOptions[currentIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#8B2500] bg-amber-50 dark:bg-amber-950/40 text-[#8B2500] dark:text-amber-200 font-bold shadow-xs ring-2 ring-amber-400/30'
                          : 'border-[#E8DFD1] dark:border-stone-800 bg-white dark:bg-[#201915] text-[#2D241E] dark:text-[#EDE5D8] hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected 
                            ? 'bg-[#8B2500] text-white' 
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm font-sans">{opt}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#8B2500] dark:text-amber-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#EBDCCB] dark:border-stone-800">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>પાછળ</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx(prev => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>આગળનો પ્રશ્ન</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer animate-pulse"
                    >
                      <Check className="w-4 h-4" />
                      <span>પરીક્ષા સબમિટ કરો</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ================= RESULT SCREEN ================= */
            latestAttempt && gradeInfo && (
              <div className="space-y-6">
                {/* Result Card */}
                <div className="bg-white dark:bg-[#201915] rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-[#E8DFD1] dark:border-stone-800 space-y-4">
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-inner border-2 ${
                    gradeInfo.passed 
                      ? 'bg-amber-100 border-amber-400 text-amber-700 dark:bg-amber-950/60' 
                      : 'bg-rose-100 border-rose-400 text-rose-700 dark:bg-rose-950/60'
                  }`}>
                    {gradeInfo.icon}
                  </div>

                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${gradeInfo.badgeColor} mb-2`}>
                      {gradeInfo.title}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
                      {gradeInfo.passed ? 'અભિનંદન! પરીક્ષા ઉત્તીર્ણ!' : 'પ્રયાસ ચાલુ રાખો'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7A6B5C] dark:text-[#C5B7A8] max-w-md mx-auto mt-1">
                      {gradeInfo.desc}
                    </p>
                  </div>

                  {/* Score breakdown */}
                  <div className="flex items-center justify-center gap-6 py-3 border-y border-[#F0E8DC] dark:border-stone-800">
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase font-semibold block">ગુણ (Score)</span>
                      <span className="text-2xl font-bold font-mono text-[#8B2500] dark:text-amber-300">
                        {latestAttempt.score} / {latestAttempt.total}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-stone-300 dark:bg-stone-700" />
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase font-semibold block">ટકાવારી (Percentage)</span>
                      <span className={`text-2xl font-bold font-mono ${latestAttempt.percentage >= 50 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                        {latestAttempt.percentage}%
                      </span>
                    </div>
                    <div className="h-8 w-px bg-stone-300 dark:bg-stone-700" />
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase font-semibold block">સ્થિતિ (Status)</span>
                      <span className={`text-sm font-bold ${gradeInfo.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                        {gradeInfo.passed ? 'UNLOCKED 🔓' : 'LOCKED 🔒'}
                      </span>
                    </div>
                  </div>

                  {/* Grading Criteria Table Reference */}
                  <div className="p-3 bg-amber-50/70 dark:bg-stone-900/60 rounded-xl text-left text-xs space-y-1 border border-amber-200/70 dark:border-stone-800">
                    <span className="font-bold text-[#7A1E00] dark:text-amber-300 block">સ્તર શ્રેણી માપદંડ (Grading Scale):</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] text-[#554336] dark:text-stone-300">
                      <div>✓ ૫૦% લઘુત્તમ પાસ</div>
                      <div>🥉 ૬૦% તૃતીય શ્રેણી</div>
                      <div>🥈 ૭૫% દ્વિતીય શ્રેણી</div>
                      <div>🥇 ૯૦% પ્રથમ શ્રેણી</div>
                    </div>
                    <div className="text-[10.5px] text-amber-800 dark:text-amber-300 font-semibold pt-1">
                      🌟 ૯૦%+ વિશેષ યોગ્યતા બેઝ અચિવમેન્ટ (Special Distinction)
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[#7A1E00] dark:text-amber-300 font-bold text-xs flex items-center gap-2 hover:bg-stone-50 cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ફરીથી પરીક્ષા આપો (Unlimited Retake)</span>
                    </button>

                    {gradeInfo.passed && onNextLevel && levelNumber < 26 && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNextLevel();
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>આગલા લેવલ {levelNumber + 1} પર જાઓ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer"
                    >
                      બંધ કરો
                    </button>
                  </div>
                </div>

                {/* Review Mistakes / All Questions Header */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-serif font-bold text-base text-[#2D241E] dark:text-[#EDE5D8]">
                    પ્રશ્નવાર ઉત્તરો અને સમીક્ષા
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowOnlyMistakes(!showOnlyMistakes)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      showOnlyMistakes 
                        ? 'bg-rose-700 text-white' 
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{showOnlyMistakes ? 'તમામ પ્રશ્નો જુઓ' : 'માત્ર ખોટા પડેલા જુઓ'}</span>
                  </button>
                </div>

                {/* Review Questions List */}
                <div className="space-y-4">
                  {questions
                    .map((q, qIdx) => ({ q, qIdx, ans: latestAttempt.userAnswers[qIdx] }))
                    .filter(item => !showOnlyMistakes || !item.ans.isCorrect)
                    .map(({ q, qIdx, ans }) => {
                      const prompt = getQuestionPrompt(q, lang, sanskritScript);
                      const options = getQuestionOptions(q, sanskritScript);
                      const explanation = getQuestionExplanation(q, lang, sanskritScript);

                      return (
                        <div
                          key={q.id}
                          className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 bg-white dark:bg-[#201915] ${
                            ans.isCorrect 
                              ? 'border-emerald-300 dark:border-emerald-900/60' 
                              : 'border-rose-300 dark:border-rose-900/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-stone-400">
                              પ્રશ્ન #{qIdx + 1} (શ્લોક {q.shlokaId})
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              ans.isCorrect 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ans.isCorrect ? '✓ સાચો ઉત્તર' : '✗ ખોટો ઉત્તર'}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-[#2D241E] dark:text-[#EDE5D8]">
                            {prompt}
                          </p>

                          <div className="space-y-1.5 text-xs">
                            {options.map((opt, optIdx) => {
                              const isUserPick = ans.selectedIndex === optIdx;
                              const isRightPick = ans.correctIndex === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                    isRightPick
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                                      : isUserPick && !isRightPick
                                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200 line-through'
                                      : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                                  }`}
                                >
                                  <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                  {isRightPick && <Check className="w-4 h-4 text-emerald-600" />}
                                  {isUserPick && !isRightPick && <X className="w-4 h-4 text-rose-600" />}
                                </div>
                              );
                            })}
                          </div>

                          {explanation && (
                            <div className="p-3 bg-amber-50/60 dark:bg-stone-900/60 rounded-xl border border-amber-200 dark:border-stone-800 text-xs text-[#554336] dark:text-[#C5B7A8]">
                              <span className="font-bold text-[#7A1E00] dark:text-amber-400 block mb-0.5">વિશ્લેષણ / શાસ્ત્રાર્થ:</span>
                              <p className="whitespace-pre-line">{explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
