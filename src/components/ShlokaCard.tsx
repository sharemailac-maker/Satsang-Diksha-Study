import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  FileText, 
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  BookMarked,
  Layers,
  HelpCircle,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';
import { Shloka, UserPreferences, MukhpathLevel, ScriptureReference, WordMeaning } from '../types';
import { 
  getShlokaMeaning, 
  getWordMeaningInLang, 
  getShlokaTitle, 
  getShlokaChapterName,
  getReferenceTitle,
  getReferenceText,
  getReferenceSection,
  getReferenceCorrelation,
  LANGUAGE_METADATA 
} from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface ShlokaCardProps {
  shloka: Shloka;
  preferences: UserPreferences;
  isBookmarked: boolean;
  onToggleBookmark: (shlokaId: number, note?: string) => void;
  bookmarkNote?: string;
  onUpdateBookmarkNote: (shlokaId: number, note: string) => void;
  mukhpathStatus: MukhpathLevel;
  onUpdateMukhpathStatus: (shlokaId: number, status: MukhpathLevel) => void;
  onOpenCrossRef: (ref: ScriptureReference) => void;
  highlightQuery?: string;
}

export const ShlokaCard: React.FC<ShlokaCardProps> = ({
  shloka,
  preferences,
  isBookmarked,
  onToggleBookmark,
  bookmarkNote = '',
  onUpdateBookmarkNote,
  mukhpathStatus,
  onUpdateMukhpathStatus,
  onOpenCrossRef,
  highlightQuery
}) => {
  const [showPadachheda, setShowPadachheda] = useState(preferences.showWordBreakdownDefault || false);
  const [noteText, setNoteText] = useState(bookmarkNote);
  const [copied, setCopied] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const ui = getUIStrings(preferences.activeLanguage);

  // Choose which Sanskrit script to render
  const sanskritText = 
    preferences.sanskritScript === 'gujarati' ? shloka.sanskritGujarati :
    preferences.sanskritScript === 'iast' ? shloka.sanskritIast :
    shloka.sanskritDevanagari;

  const handleCopy = () => {
    const textToCopy = `॥ Satsang Diksha Study - ${ui.shlokaNumberPrefix} ${shloka.id} ॥\n\n${shloka.sanskritDevanagari}\n\n[ગુજરાતી અર્થ]: ${shloka.meaningGu}\n\n[हिन्दी भावार्थ]: ${shloka.meaningHi}\n\n[English Meaning]: ${shloka.meaningEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudioRecitation = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(shloka.sanskritDevanagari);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.lang = 'hi-IN';
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Selected word details
  const selectedWordData: WordMeaning | null = 
    (shloka.padachheda && selectedWordIndex !== null && shloka.padachheda[selectedWordIndex]) 
      ? shloka.padachheda[selectedWordIndex] 
      : null;

  // Primary Meaning Text
  const primaryMeaning = getShlokaMeaning(shloka, preferences.activeLanguage);
  const primaryLangMeta = LANGUAGE_METADATA[preferences.activeLanguage] || LANGUAGE_METADATA.gujarati;

  return (
    <article 
      id={`shloka-card-${shloka.id}`}
      className="bg-white dark:bg-[#221D1A] rounded-3xl shadow-md border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden transition-all hover:shadow-lg mb-6"
    >
      {/* Sacred Maroon & Gold Header Bar */}
      <div className="bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#B45309] px-4 sm:px-6 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm shadow-inner border border-amber-200">
            {shloka.id}
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-amber-100 flex items-center gap-1.5">
              <span>{getShlokaTitle(shloka, preferences.activeLanguage)}</span>
              {preferences.activeLanguage === 'gujarati' && (
                <span className="opacity-75 text-xs font-normal">| {shloka.titleHi}</span>
              )}
              {preferences.activeLanguage !== 'gujarati' && (
                <span className="opacity-75 text-xs font-normal">| {shloka.titleGu}</span>
              )}
            </h3>
            <span className="text-[11px] text-amber-200/80 font-sans">
              {ui.chapterPrefix} {shloka.chapterId}: {getShlokaChapterName(shloka, preferences.activeLanguage)}
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Audio Pronunciation */}
          <button
            onClick={handleAudioRecitation}
            title={isPlayingAudio ? ui.listenAudioStop : ui.listenAudio}
            className={`p-1.5 rounded-lg transition ${
              isPlayingAudio ? 'bg-amber-400 text-amber-950' : 'bg-black/20 hover:bg-black/40 text-amber-200'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Mukhpath Status Dropdown */}
          <select
            value={mukhpathStatus}
            onChange={(e) => onUpdateMukhpathStatus(shloka.id, e.target.value as MukhpathLevel)}
            className="text-[11px] px-2 py-1 rounded-md bg-black/25 text-amber-100 border border-amber-300/30 focus:outline-none cursor-pointer font-medium"
            title="Update Mukhpath study status"
          >
            <option value="unlearned">{ui.statusUnlearned}</option>
            <option value="learning">{ui.statusLearning}</option>
            <option value="memorized">{ui.statusMemorized}</option>
            <option value="mastered">{ui.statusMastered}</option>
          </select>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(shloka.id, noteText)}
            title={isBookmarked ? ui.bookmarkRemove : ui.bookmarkAdd}
            className={`p-1.5 rounded-lg transition ${
              isBookmarked ? 'bg-amber-400 text-amber-950' : 'bg-black/20 hover:bg-black/40 text-amber-200'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title={ui.copyShloka}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-amber-200 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sanskrit Verse Presentation Box */}
      <div className="p-4 sm:p-6 bg-[#FCFBF8] dark:bg-[#1C1714] border-b border-[#EFE8DC] dark:border-[#352D26]">
        <div className="relative p-4 sm:p-6 rounded-2xl bg-[#FFFDF9] dark:bg-[#26201B] border-2 border-amber-500/25 shadow-xs text-center">
          {/* Sanskrit Header Glyph */}
          <div className="text-amber-600 dark:text-amber-400 text-xs font-serif tracking-widest uppercase mb-2">
            ॥ श्री स्वामिनारायणो विजयते ॥
          </div>

          <p 
            className="font-sanskrit font-medium text-[#731E00] dark:text-[#F39C38] leading-relaxed tracking-wide whitespace-pre-line select-text"
            style={{ fontSize: `${preferences.fontSize + 2}px` }}
          >
            {sanskritText}
          </p>

          <div className="mt-2 text-xs text-[#8A7A68] dark:text-[#A89886] font-mono whitespace-pre-line select-text">
            {shloka.sanskritIast}
          </div>
        </div>

        {/* Interactive Word by Word (Padachheda) Breakdown Strip */}
        {shloka.padachheda && shloka.padachheda.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B2500] dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{ui.wordBreakdownTitle} ({ui.wordBreakdownDesc}):</span>
              </div>
              {selectedWordIndex !== null && (
                <button
                  onClick={() => setSelectedWordIndex(null)}
                  className="text-[11px] text-[#8B2500] dark:text-amber-400 underline hover:opacity-80 font-medium"
                >
                  {ui.closeWordBreakdown}
                </button>
              )}
            </div>

            {/* Word Chips for interactive study */}
            <div className="flex flex-wrap items-center gap-1.5">
              {shloka.padachheda.map((item, idx) => {
                const isSelected = selectedWordIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedWordIndex(isSelected ? null : idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-serif transition-all border ${
                      isSelected
                        ? 'bg-[#8B2500] text-amber-50 border-[#8B2500] shadow-sm font-bold scale-105'
                        : 'bg-white dark:bg-[#2C241F] text-[#731E00] dark:text-amber-200 border-amber-300/50 dark:border-amber-700/40 hover:bg-amber-100 dark:hover:bg-[#3D322A]'
                    }`}
                  >
                    <span>{item.word}</span>
                  </button>
                );
              })}
            </div>

            {/* Word Highlight Details Box */}
            {selectedWordData && (
              <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-[#251E18] border-2 border-amber-400/60 shadow-md animate-fadeIn text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                      {selectedWordData.word}
                    </span>
                    {selectedWordData.transliteration && (
                      <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                        ({selectedWordData.transliteration})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
                    {selectedWordData.grammaticalRole || 'પદચ્છેદ & વ્યાકરણ'}
                  </span>
                </div>

                {/* Primary Selected Language Word Meaning */}
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border-2 border-amber-500/40">
                  <div className="text-[10px] font-bold text-[#8B2500] dark:text-amber-300 flex items-center justify-between">
                    <span>{primaryLangMeta.nativeName} ({primaryLangMeta.nameGu}) પદ અર્થ (Selected Language Meaning)</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold">Active</span>
                  </div>
                  <div className="text-sm font-semibold text-[#2D241E] dark:text-[#EDE5D8] mt-1">
                    {getWordMeaningInLang(selectedWordData, preferences.activeLanguage)}
                  </div>
                </div>

                {/* Other Parallel Language Meanings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {preferences.activeLanguage !== 'gujarati' && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-[#2C231C] border border-amber-200/50">
                      <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400">ગુજરાતી પદાર્થ</div>
                      <div className="font-gujarati text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                        {selectedWordData.meaningGu}
                      </div>
                    </div>
                  )}
                  {preferences.activeLanguage !== 'hindi' && (
                    <div className="p-2.5 rounded-xl bg-orange-50/80 dark:bg-[#2C231C] border border-orange-200/50">
                      <div className="text-[10px] font-bold text-orange-800 dark:text-orange-400">हिन्दी पद-अर्थ</div>
                      <div className="font-hindi text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                        {selectedWordData.meaningHi}
                      </div>
                    </div>
                  )}
                  {preferences.activeLanguage !== 'english' && (
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#2C231C] border border-stone-200/60">
                      <div className="text-[10px] font-bold text-stone-700 dark:text-stone-400">English Word Meaning</div>
                      <div className="font-english text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                        {selectedWordData.meaningEn}
                      </div>
                    </div>
                  )}
                </div>

                {/* Specific Scripture Reference for this Word if available */}
                {selectedWordData.scriptureReference && (
                  <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/50 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#8B2500] dark:text-amber-300">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>વચનામૃત સંદર્ભ: {selectedWordData.scriptureReference.source}</span>
                    </div>
                    <p className="italic text-[#4A3E34] dark:text-[#D5C7B7] mt-1 font-gujarati">
                      "{selectedWordData.scriptureReference.quoteGu}"
                    </p>
                    <p className="text-[10px] text-[#6B5E51] dark:text-[#A89886] mt-0.5">
                      {selectedWordData.scriptureReference.correlation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Translations & Purports Section Beneath Sanskrit Verse */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* PRIMARY SELECTED LANGUAGE MEANING (Default: Sanskrit to Gujarati) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-[#27211C] border-l-4 border-[#8B2500] dark:border-amber-500 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span>{primaryLangMeta.nativeName} ({primaryLangMeta.nameGu})</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-bold">
              {ui.primaryMeaningTitle}
            </span>
          </div>
          <p 
            className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed"
            style={{ fontSize: `${preferences.fontSize}px` }}
          >
            {primaryMeaning}
          </p>
        </div>

        {/* SECONDARY LANGUAGES APPLIED BENEATH SANSKRIT VERSE AS PER SETTINGS */}
        {preferences.secondaryLanguages?.includes('hindi') && preferences.activeLanguage !== 'hindi' && (
          <div className="p-3.5 rounded-xl bg-orange-50/50 dark:bg-[#28201B] border-l-4 border-orange-600 dark:border-orange-500">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-orange-800 dark:text-orange-300">
              <span>हिन्दी भावार्थ (Hindi Purport)</span>
            </div>
            <p 
              className="font-hindi text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed"
              style={{ fontSize: `${preferences.fontSize}px` }}
            >
              {shloka.meaningHi}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('english') && preferences.activeLanguage !== 'english' && (
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#241F1A] border-l-4 border-stone-600 dark:border-stone-400">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-stone-700 dark:text-stone-300">
              <span>English Translation & Purport</span>
            </div>
            <p 
              className="font-english text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed"
              style={{ fontSize: `${preferences.fontSize}px` }}
            >
              {shloka.meaningEn}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('marathi') && preferences.activeLanguage !== 'marathi' && (
          <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-[#251F1A] border-l-4 border-amber-700">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-900 dark:text-amber-300">
              <span>मराठी अनुवाद (Marathi)</span>
            </div>
            <p className="font-hindi text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'marathi')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('punjabi') && preferences.activeLanguage !== 'punjabi' && (
          <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-[#251F1A] border-l-4 border-amber-600">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-900 dark:text-amber-300">
              <span>ਪੰਜਾਬੀ ਅਨੁਵਾਦ (Punjabi)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'punjabi')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('bengali') && preferences.activeLanguage !== 'bengali' && (
          <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-[#251F1A] border-l-4 border-emerald-700">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-emerald-900 dark:text-emerald-300">
              <span>বাংলা অনুবাদ (Bengali)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'bengali')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('tamil') && preferences.activeLanguage !== 'tamil' && (
          <div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-[#251F1A] border-l-4 border-rose-700">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-rose-900 dark:text-rose-300">
              <span>தமிழ் விளக்கம் (Tamil)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'tamil')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('telugu') && preferences.activeLanguage !== 'telugu' && (
          <div className="p-3.5 rounded-xl bg-cyan-50/40 dark:bg-[#251F1A] border-l-4 border-cyan-700">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-cyan-900 dark:text-cyan-300">
              <span>తెలుగు భావార్థం (Telugu)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'telugu')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('kannada') && preferences.activeLanguage !== 'kannada' && (
          <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-[#251F1A] border-l-4 border-purple-700">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-purple-900 dark:text-purple-300">
              <span>ಕನ್ನಡ ಭಾವಾರ್ಥ (Kannada)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'kannada')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('spanish') && preferences.activeLanguage !== 'spanish' && (
          <div className="p-3.5 rounded-xl bg-sky-50/40 dark:bg-[#251F1A] border-l-4 border-sky-600">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-sky-900 dark:text-sky-300">
              <span>Español (Spanish Translation)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'spanish')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('french') && preferences.activeLanguage !== 'french' && (
          <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-[#251F1A] border-l-4 border-indigo-600">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-indigo-900 dark:text-indigo-300">
              <span>Français (French Translation)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'french')}
            </p>
          </div>
        )}

        {preferences.secondaryLanguages?.includes('german') && preferences.activeLanguage !== 'german' && (
          <div className="p-3.5 rounded-xl bg-teal-50/40 dark:bg-[#251F1A] border-l-4 border-teal-600">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-teal-900 dark:text-teal-300">
              <span>Deutsch (German Translation)</span>
            </div>
            <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {getShlokaMeaning(shloka, 'german')}
            </p>
          </div>
        )}

        {/* Scriptural Cross-References (Vachnamrut / Swami ni Vato) */}
        {shloka.crossReferences && shloka.crossReferences.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="text-xs font-bold text-[#8B2500] dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{ui.scriptureCrossRefTitle}:</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {shloka.crossReferences.map((ref, idx) => {
                const displayTitle = getReferenceTitle(ref, preferences.activeLanguage);
                const displaySection = getReferenceSection(ref, preferences.activeLanguage);
                const displayText = getReferenceText(ref, preferences.activeLanguage);
                const displayCorrelation = getReferenceCorrelation(ref, preferences.activeLanguage);
                const isVachnamrut = ref.type === 'vachnamrut';
                const readLabel = preferences.activeLanguage === 'hindi' ? 'पढ़ें' : preferences.activeLanguage === 'english' ? 'Read' : 'વાંચો';

                return (
                  <div
                    key={idx}
                    onClick={() => onOpenCrossRef(ref)}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-50/90 to-stone-50 dark:from-[#261F19] dark:to-[#1F1914] border border-amber-300/50 dark:border-amber-800/40 hover:border-amber-500 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif font-bold text-xs text-[#8B2500] dark:text-amber-300">
                          {displayTitle}
                        </span>
                        {displaySection && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold">
                            {displaySection}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4A3E34] dark:text-[#C5B7A8] leading-relaxed italic">
                        "{displayText}"
                      </p>
                      {displayCorrelation && (
                        <p className="text-[11px] text-amber-900 dark:text-amber-300/90 font-medium pt-0.5 border-t border-amber-200/40 dark:border-amber-900/30">
                          {displayCorrelation}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center pl-1 text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">{readLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bookmark Reflection Note Input */}
        {isBookmarked && (
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1.5">
            <label className="text-[11px] font-bold text-[#8B2500] dark:text-amber-400 block">
              {ui.reflectionNoteLabel}
            </label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                onUpdateBookmarkNote(shloka.id, e.target.value);
              }}
              placeholder={ui.reflectionNotePlaceholder}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#1E1915] border border-amber-200 dark:border-amber-900 text-xs text-[#2D241E] dark:text-[#EDE5D8] focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>
    </article>
  );
};
