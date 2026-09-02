import React, { useState, useEffect } from 'react';
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
  VolumeX
} from 'lucide-react';
import { Shloka, MukhpathLevel, UserPreferences } from '../types';
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

interface MukhpathViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  mukhpathRecords: Record<number, { status: MukhpathLevel; recitationCount: number }>;
  onUpdateStatus: (shlokaId: number, status: MukhpathLevel) => void;
  onSelectShloka: (id: number) => void;
}

export const MukhpathView: React.FC<MukhpathViewProps> = ({
  shlokas,
  preferences,
  mukhpathRecords,
  onUpdateStatus,
  onSelectShloka
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'recite' | 'hide_sanskrit' | 'hide_meaning' | 'pada_reveal' | 'flashcard'>('recite');
  const [hideState, setHideState] = useState(true);
  const [padaRevealStep, setPadaRevealStep] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | MukhpathLevel>('all');
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filtered shlokas list
  const filteredShlokas = shlokas.filter(s => {
    const record = mukhpathRecords[s.id];
    const status = record?.status || 'unlearned';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (chapterFilter !== 'all' && s.chapterId !== chapterFilter) return false;
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
  const masteredCount = Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel }) => r.status === 'mastered').length;
  const learningCount = Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel }) => r.status === 'learning').length;
  const progressPercent = Math.round((memorizedCount / totalShlokas) * 100);

  const sanskritLines = activeShloka ? activeShloka.sanskritDevanagari.split('\n') : [];

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

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Mukhpath Overview Dashboard Banner */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#D97706] rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-amber-400/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
              <span className="text-xs font-bold tracking-wider uppercase text-amber-200">
                {lang === 'hindi' ? 'सत्संग दीक्षा मुखपाठ साधना' : lang === 'english' ? 'Satsang Diksha Mukhpath Sadhana' : 'સત્સંગ દીક્ષા મુખપાઠ સાધના'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
              {lang === 'hindi' ? 'मुखपाठ एवं कंठस्थ अभ्यास' : lang === 'english' ? 'Mukhpath Memorization Mastery' : 'મુખપાઠ સાધના અને કંઠસ્થ અભ્યાસ'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl">
              {lang === 'hindi' ? 'सभी ३૧૫ संस्कृत श्लोकों को पंक्तिबद्ध स्मरण, फ्लैशकार्ड और शब्दार्थ द्वारा कंठस्थ करें।' : lang === 'english' ? 'Learn, memorize, and master all 315 Sanskrit Shlokas through line-by-line reveal, flashcard testing, and word-by-word recall.' : '૩૧૫ દિવ્ય સંસ્કૃત શ્લોકોનું પદચ્છેદ, શબ્દાર્થ અને ક્રમબદ્ધ પઠન દ્વારા સંપૂર્ણ મુખપાઠ કરો.'}
            </p>
          </div>

          {/* Progress Circle & Counter */}
          <div className="flex items-center gap-4 bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-300/30">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                {memorizedCount}<span className="text-sm font-normal text-amber-200/80">/315</span>
              </div>
              <div className="text-[11px] text-amber-200">{lang === 'hindi' ? 'कंठस्थ श्लोक' : lang === 'english' ? 'Memorized' : 'કંઠસ્થ શ્લોક'}</div>
            </div>
            <div className="h-10 w-px bg-amber-400/30" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                {progressPercent}%
              </div>
              <div className="text-[11px] text-amber-200">{lang === 'hindi' ? 'प्रगति' : lang === 'english' ? 'Completed' : 'સિદ્ધિ'}</div>
            </div>
          </div>
        </div>

        {/* Multi-tier Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-amber-300/20 p-0.5">
            <div 
              className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-amber-200 font-mono">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
            <span>200</span>
            <span>315</span>
          </div>
        </div>

        {/* Milestones Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-amber-400/20">
          <span className="text-xs text-amber-200 font-semibold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            બિરુદ સિદ્ધિ:
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            memorizedCount >= 25 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
          }`}>
            🥉 ૨૫ શ્લોક
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            memorizedCount >= 50 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
          }`}>
            🥈 ૫૦ શ્લોક
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            memorizedCount >= 100 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
          }`}>
            🥇 ૧૦૦ શ્લોક
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            memorizedCount >= 315 ? 'bg-yellow-300 text-amber-950 border-yellow-100 font-extrabold shadow-md animate-bounce' : 'bg-black/20 text-amber-300/60 border-white/10'
          }`}>
            👑 ૩૧૫ સંપૂર્ણ સિદ્ધિ
          </span>
        </div>
      </div>

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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
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
                <span>{isPlayingAudio ? 'વિરામ' : 'શ્રવણ'}</span>
              </button>

              <button
                onClick={() => onSelectShloka(activeShloka.id)}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 transition font-medium flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{ui.tabReader}</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Recite & Study */}
          {practiceMode === 'recite' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#28211C] border-2 border-amber-500/30 text-center shadow-inner">
                <div className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 font-serif">
                  ॥ श्री स्वामिनारायणो विजयते ॥
                </div>
                <p className="font-sanskrit text-xl sm:text-2xl font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line">
                  {activeShloka.sanskritDevanagari}
                </p>
                <div className="mt-3 text-xs text-[#8A7A68] dark:text-[#A89886] font-mono">
                  {activeShloka.sanskritIast}
                </div>
              </div>

              {/* Translations display */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-[#28201B] border-l-4 border-amber-600">
                  <div className="font-bold text-xs text-amber-900 dark:text-amber-300 mb-1">
                    {langMeta.nativeName} ({langMeta.nameEn}) {ui.primaryMeaningTitle}:
                  </div>
                  <p className="text-sm sm:text-base text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                    {getShlokaMeaning(activeShloka, lang)}
                  </p>
                </div>

                {lang !== 'gujarati' && (
                  <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#201B17] border border-amber-200/60 dark:border-[#352D26] text-xs">
                    <span className="font-bold text-[#8B2500] dark:text-amber-400">મૂળ ગુજરાતી ભાવાર્થ: </span>
                    <span className="font-gujarati text-[#4A3D31] dark:text-[#D1C5B7]">{activeShloka.meaningGu}</span>
                  </div>
                )}
              </div>

              {/* Padachheda words list for quick study */}
              {(() => {
                const padachhedaList = (PADACHHEDA_DATA && PADACHHEDA_DATA[activeShloka.id]) || activeShloka.padachheda || [];
                if (!padachhedaList || padachhedaList.length === 0) return null;
                return (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20">
                    <div className="text-xs font-bold text-[#8B2500] dark:text-amber-300 mb-2">
                      {ui.wordBreakdownTitle}:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {padachhedaList.map((item, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white dark:bg-[#261F1A] border border-amber-300/40 flex items-start justify-between gap-2">
                          <span className="font-sanskrit font-bold text-[#8B2500] dark:text-amber-300">{item.word}</span>
                          <span className="text-stone-700 dark:text-stone-300 text-right font-medium">{getWordMeaningInLang(item, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Mode 2: Hide Sanskrit (Recite from Memory) */}
          {practiceMode === 'hide_sanskrit' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-[#28201B] border-l-4 border-amber-600 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200">{langMeta.nativeName} {ui.primaryMeaningTitle}:</span>
                <p className="text-sm sm:text-base mt-1 text-[#2D241E] dark:text-[#EDE5D8]">
                  {getShlokaMeaning(activeShloka, lang)}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#28211C] border-2 border-dashed border-amber-500/40 text-center min-h-[140px] flex flex-col items-center justify-center">
                {hideState ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#8A7A68] dark:text-[#A89886]">
                      🙈 {lang === 'hindi' ? 'संस्कृत श्लोक छिपा हुआ है। स्मरण कर पाठ करें!' : lang === 'english' ? 'Sanskrit verse hidden. Recite from memory!' : 'સંસ્કૃત શ્લોક છુપાયેલ છે. મનમાં અથવા મોટેથી પઠન કરો!'}
                    </p>
                    <button
                      onClick={() => setHideState(false)}
                      className="px-4 py-2 rounded-xl bg-[#8B2500] text-amber-100 text-xs font-bold hover:bg-[#A63000] transition flex items-center gap-1.5 shadow-sm mx-auto cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'hindi' ? 'श्लोक देखें (Reveal Shloka)' : lang === 'english' ? 'Reveal Shloka' : 'શ્લોક તપાસો (Reveal Shloka)'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-sanskrit text-xl sm:text-2xl font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line">
                      {activeShloka.sanskritDevanagari}
                    </p>
                    <button
                      onClick={() => setHideState(true)}
                      className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-300 transition flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'hindi' ? 'फिर छिपाएं (Hide)' : lang === 'english' ? 'Hide Again' : 'ફરી છુપાવો (Hide)'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Hide Meaning */}
          {practiceMode === 'hide_meaning' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#28211C] border-2 border-amber-500/30 text-center">
                <p className="font-sanskrit text-xl sm:text-2xl font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line">
                  {activeShloka.sanskritDevanagari}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-[#28201B] border-2 border-dashed border-amber-500/40 text-center">
                {hideState ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#8A7A68] dark:text-[#A89886]">
                      🧐 {lang === 'hindi' ? 'इस श्लोक का अर्थ स्मरण करें।' : lang === 'english' ? 'Recall the meaning of this verse.' : 'આ સંસ્કૃત શ્લોકનો અર્થ યાદ કરો.'}
                    </p>
                    <button
                      onClick={() => setHideState(false)}
                      className="px-4 py-2 rounded-xl bg-[#8B2500] text-amber-100 text-xs font-bold hover:bg-[#A63000] transition flex items-center gap-1.5 shadow-sm mx-auto cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'hindi' ? 'अर्थ देखें (Reveal Meaning)' : lang === 'english' ? 'Reveal Meaning' : 'અર્થ તપાસો (Reveal Meaning)'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <div className="p-3.5 bg-white dark:bg-[#201B17] rounded-xl border border-amber-200">
                      <span className="font-bold text-xs text-amber-900 dark:text-amber-200">{langMeta.nativeName} {ui.primaryMeaningTitle}:</span>
                      <p className="text-sm mt-1 text-[#2D241E] dark:text-[#EDE5D8]">{getShlokaMeaning(activeShloka, lang)}</p>
                    </div>
                    {lang !== 'gujarati' && (
                      <div className="p-3 bg-white/80 dark:bg-[#201B17] rounded-xl border border-amber-100 text-xs">
                        <span className="font-bold text-stone-600 dark:text-stone-400">ગુજરાતી અર્થ:</span>
                        <p className="font-gujarati text-xs mt-1 text-stone-700 dark:text-stone-300">{activeShloka.meaningGu}</p>
                      </div>
                    )}
                    <button
                      onClick={() => setHideState(true)}
                      className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-300 transition flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{lang === 'hindi' ? 'फिर छिपाएं (Hide)' : lang === 'english' ? 'Hide Again' : 'ફરી છુપાવો (Hide)'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 4: Pada-by-Pada Sequential Reveal */}
          {practiceMode === 'pada_reveal' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#28211C] border-2 border-amber-500/30 text-center space-y-4">
                <div className="text-xs uppercase text-amber-600 dark:text-amber-400 font-serif">
                  Step-by-Step Pada Recitation
                </div>
                
                {sanskritLines.map((line, lIdx) => (
                  <div 
                    key={lIdx}
                    className={`p-3 rounded-xl transition-all ${
                      lIdx <= padaRevealStep
                        ? 'bg-amber-100/70 dark:bg-amber-950/40 text-[#731E00] dark:text-amber-300 font-sanskrit text-lg sm:text-xl font-bold'
                        : 'bg-stone-100 dark:bg-stone-800/40 text-transparent select-none blur-xs'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  disabled={padaRevealStep >= sanskritLines.length - 1}
                  onClick={() => setPadaRevealStep(padaRevealStep + 1)}
                  className="px-5 py-2 rounded-xl bg-[#8B2500] hover:bg-[#A63000] disabled:opacity-40 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  આગળનું પદ ખોલો (Next Line) ➔
                </button>
                <button
                  onClick={() => setPadaRevealStep(0)}
                  className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-300 transition cursor-pointer"
                >
                  ફરીથી (Reset)
                </button>
              </div>
            </div>
          )}

          {/* Mode 5: Flashcard Flip */}
          {practiceMode === 'flashcard' && (
            <div className="space-y-6">
              <div 
                onClick={() => setHideState(!hideState)}
                className="p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF9] to-[#FBF6EE] dark:from-[#26201B] dark:to-[#1E1916] border-2 border-amber-500/40 shadow-md text-center cursor-pointer transition-all hover:scale-[1.01] min-h-[220px] flex flex-col items-center justify-center relative"
              >
                <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-medium">
                  {hideState ? '👆 ક્લિક કરો અર્થ જોવા (Click to flip)' : '👆 ક્લિક કરો શ્લોક જોવા'}
                </span>

                {hideState ? (
                  <div className="space-y-2">
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-serif">॥ સંસ્કૃત શ્લોક ॥</span>
                    <p className="font-sanskrit text-2xl font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line">
                      {activeShloka.sanskritDevanagari}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-xl text-left">
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-bold block text-center">॥ {langMeta.nativeName} ({langMeta.nameEn}) ભાવાર્થ ॥</span>
                    <p className="text-base text-[#2D241E] dark:text-[#EDE5D8]">
                      {getShlokaMeaning(activeShloka, lang)}
                    </p>
                    {lang !== 'gujarati' && (
                      <p className="font-gujarati text-xs text-[#6B5E51] dark:text-[#BDB0A0]">
                        (મૂળ ગુજરાતી: {activeShloka.meaningGu})
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Updater Buttons: [Learning] [Memorized] [Mastered] */}
          <div className="pt-4 border-t border-[#F2EADB] dark:border-[#352D26] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B5E51] dark:text-[#C5B7A8]">
                મુખપાઠ પરિણામ નોંધો:
              </span>
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
  );
};
