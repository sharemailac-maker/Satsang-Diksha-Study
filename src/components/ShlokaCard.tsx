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
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  BookMarked,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Shloka, UserPreferences, MukhpathLevel, ScriptureReference, WordMeaning } from '../types';

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
  const [showAnwayarth, setShowAnwayarth] = useState(preferences.showCommentaryDefault || false);
  const [noteText, setNoteText] = useState(bookmarkNote);
  const [copied, setCopied] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // Choose which Sanskrit script to render
  const sanskritText = 
    preferences.sanskritScript === 'gujarati' ? shloka.sanskritGujarati :
    preferences.sanskritScript === 'iast' ? shloka.sanskritIast :
    shloka.sanskritDevanagari;

  const handleCopy = () => {
    const textToCopy = `॥ Satsang Diksha Study - શ્લોક ${shloka.id} ॥\n\n${shloka.sanskritDevanagari}\n\n[ગુજરાતી અર્થ]: ${shloka.meaningGu}\n\n[हिन्दी भावार्थ]: ${shloka.meaningHi}\n\n[English Meaning]: ${shloka.meaningEn}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mukhpathColors: Record<MukhpathLevel, { bg: string; text?: string; labelGu: string; labelEn: string }> = {
    unlearned: { bg: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300', labelGu: 'શીખવાનું બાકી', labelEn: 'Unlearned' },
    learning: { bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/40', labelGu: 'અભ્યાસ ચાલુ ⏳', labelEn: 'Learning' },
    memorized: { bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/40', labelGu: 'મુખપાઠ થયેલ ✓', labelEn: 'Memorized' },
    mastered: { bg: 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300/40 font-bold', labelGu: 'સિદ્ધ / કંઠસ્થ ★', labelEn: 'Mastered' }
  };

  // Selected word details
  const selectedWordData: WordMeaning | null = 
    (shloka.padachheda && selectedWordIndex !== null && shloka.padachheda[selectedWordIndex]) 
      ? shloka.padachheda[selectedWordIndex] 
      : null;

  return (
    <article 
      id={`shloka-card-${shloka.id}`}
      className="bg-white dark:bg-[#221D1A] rounded-2xl shadow-md border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden transition-all hover:shadow-lg mb-6"
    >
      {/* Sacred Gold Header Bar */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] px-4 sm:px-6 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-sm shadow-inner border border-amber-200">
            {shloka.id}
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-amber-100 flex items-center gap-1.5">
              <span>{shloka.titleGu}</span>
              <span className="opacity-75 text-xs font-normal">| {shloka.titleHi}</span>
            </h3>
            <span className="text-[11px] text-amber-200/80 font-sans">
              પ્રકરણ {shloka.chapterId}: {shloka.chapterGu}
            </span>
          </div>
        </div>

        {/* Right Action Icons: Bookmark, Copy, Mukhpath Level */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mukhpath Status Dropdown */}
          <select
            value={mukhpathStatus}
            onChange={(e) => onUpdateMukhpathStatus(shloka.id, e.target.value as MukhpathLevel)}
            className="text-[11px] px-2 py-1 rounded-md bg-black/25 text-amber-100 border border-amber-300/30 focus:outline-none cursor-pointer"
            title="Update Mukhpath study status"
          >
            <option value="unlearned">શીખવાનું બાકી (Unlearned)</option>
            <option value="learning">અભ્યાસ ચાલુ (Learning)</option>
            <option value="memorized">મુખપાઠ થયેલ (Memorized)</option>
            <option value="mastered">સિદ્ધ કંઠસ્થ (Mastered)</option>
          </select>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(shloka.id, noteText)}
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            className={`p-1.5 rounded-lg transition ${
              isBookmarked ? 'bg-amber-400 text-amber-950' : 'bg-black/20 hover:bg-black/40 text-amber-200'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy Shloka & Translations"
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-amber-200 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sanskrit Verse Presentation Box */}
      <div className="p-4 sm:p-6 bg-[#FCFBF8] dark:bg-[#1C1714] border-b border-[#EFE8DC] dark:border-[#352D26]">
        <div className="relative p-4 sm:p-6 rounded-xl bg-[#FFFDF9] dark:bg-[#26201B] border-2 border-amber-500/25 shadow-xs text-center">
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

          <div className="mt-2 text-xs text-[#8A7A68] dark:text-[#A89886] font-mono">
            {shloka.sanskritIast}
          </div>
        </div>

        {/* Interactive Word Highlighting and Study Strip */}
        {shloka.padachheda && shloka.padachheda.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B2500] dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>શબ્દાર્થ અધ્યયન (Click any word to inspect meaning & Vachnamrut context):</span>
              </div>
              {selectedWordIndex !== null && (
                <button
                  onClick={() => setSelectedWordIndex(null)}
                  className="text-[11px] text-[#8B2500] dark:text-amber-400 underline hover:opacity-80"
                >
                  બંધ કરો (Clear)
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all border ${
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

            {/* Word Highlight Details Card */}
            {selectedWordData && (
              <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-[#251E18] border-2 border-amber-400/50 shadow-sm animate-fadeIn text-xs space-y-2">
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-medium">
                    પદ અર્થ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-[#2C231C]">
                    <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400">ગુજરાતી અર્થ</div>
                    <div className="font-gujarati text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                      {selectedWordData.meaningGu}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50/70 dark:bg-[#2C231C]">
                    <div className="text-[10px] font-bold text-orange-800 dark:text-orange-400">हिन्दी अर्थ</div>
                    <div className="font-hindi text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                      {selectedWordData.meaningHi}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 dark:bg-[#2C231C]">
                    <div className="text-[10px] font-bold text-stone-700 dark:text-stone-400">English Meaning</div>
                    <div className="font-english text-[#2D241E] dark:text-[#EDE5D8] mt-0.5 font-medium">
                      {selectedWordData.meaningEn}
                    </div>
                  </div>
                </div>

                {/* Specific Scripture Reference for this Word if available */}
                {selectedWordData.scriptureReference && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 border border-amber-300/40 text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-[#8B2500] dark:text-amber-300">
                      <BookOpen className="w-3 h-3" />
                      <span>{selectedWordData.scriptureReference.source}</span>
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

      {/* Translations & Purports Section */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Gujarati Translation */}
        {(preferences.activeLanguage === 'all' || preferences.activeLanguage === 'gujarati') && (
          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-[#27211C] border-l-4 border-amber-600 dark:border-amber-500">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-800 dark:text-amber-300">
              <span>ગુજરાતી સરળ ભાવાર્થ</span>
            </div>
            <p 
              className="font-gujarati text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed"
              style={{ fontSize: `${preferences.fontSize}px` }}
            >
              {shloka.meaningGu}
            </p>
          </div>
        )}

        {/* Hindi Translation */}
        {(preferences.activeLanguage === 'all' || preferences.activeLanguage === 'hindi') && (
          <div className="p-3.5 rounded-xl bg-orange-50/50 dark:bg-[#28201B] border-l-4 border-orange-600 dark:border-orange-500">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-orange-800 dark:text-orange-300">
              <span>हिन्दी सरल भावार्थ</span>
            </div>
            <p 
              className="font-hindi text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed"
              style={{ fontSize: `${preferences.fontSize}px` }}
            >
              {shloka.meaningHi}
            </p>
          </div>
        )}

        {/* English Translation */}
        {(preferences.activeLanguage === 'all' || preferences.activeLanguage === 'english') && (
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

        {/* Padachheda (Complete Word-by-Word Breakdown) Accordion */}
        {shloka.padachheda && shloka.padachheda.length > 0 && (
          <div className="border border-[#E8DFD1] dark:border-[#3D342C] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowPadachheda(!showPadachheda)}
              className="w-full px-4 py-2.5 bg-[#FAF6F0] dark:bg-[#29221C] hover:bg-[#F2EADB] dark:hover:bg-[#322A23] flex items-center justify-between text-xs font-semibold text-[#6B5E51] dark:text-[#D5C7B7] transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>સંપૂર્ણ પદચ્છેદ અને શબ્દાર્થ કોષ્ટક (Word-by-word Breakdown Table)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  {shloka.padachheda.length} શબ્દો
                </span>
              </div>
              {showPadachheda ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showPadachheda && (
              <div className="p-3 bg-white dark:bg-[#201B17] overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DFD1] dark:border-[#3D342C] text-[#8B2500] dark:text-amber-400">
                      <th className="py-2 px-2.5 font-bold">સંસ્કૃત પદ / Word</th>
                      <th className="py-2 px-2.5 font-bold">ગુજરાતી અર્થ</th>
                      <th className="py-2 px-2.5 font-bold">हिन्दी अर्थ</th>
                      <th className="py-2 px-2.5 font-bold">English Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EADB] dark:divide-[#2C241E]">
                    {shloka.padachheda.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20">
                        <td className="py-2 px-2.5 font-sanskrit font-bold text-[#8B2500] dark:text-amber-300">
                          {item.word}
                        </td>
                        <td className="py-2 px-2.5 font-gujarati text-[#2D241E] dark:text-[#E2D8CC]">
                          {item.meaningGu}
                        </td>
                        <td className="py-2 px-2.5 font-hindi text-[#2D241E] dark:text-[#E2D8CC]">
                          {item.meaningHi}
                        </td>
                        <td className="py-2 px-2.5 font-english text-[#4A3E34] dark:text-[#BDB0A0]">
                          {item.meaningEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Detailed Anwayarth / Commentary Accordion */}
        {shloka.anwayarthGu && (
          <div className="border border-[#E8DFD1] dark:border-[#3D342C] rounded-xl overflow-hidden">
            <button
              onClick={() => setShowAnwayarth(!showAnwayarth)}
              className="w-full px-4 py-2.5 bg-[#FAF6F0] dark:bg-[#29221C] hover:bg-[#F2EADB] dark:hover:bg-[#322A23] flex items-center justify-between text-xs font-semibold text-[#6B5E51] dark:text-[#D5C7B7] transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>અન્વયાર્થ અને વિશ્લેષણ (Detailed Commentary & Spiritual Context)</span>
              </div>
              {showAnwayarth ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAnwayarth && (
              <div className="p-4 bg-white dark:bg-[#201B17] text-xs leading-relaxed space-y-2 text-[#4A3E34] dark:text-[#D1C5B7]">
                <p><strong className="text-[#8B2500] dark:text-amber-400">ગુજરાતી વિવરણ:</strong> {shloka.anwayarthGu}</p>
                {shloka.anwayarthHi && <p><strong className="text-orange-700 dark:text-orange-400">हिन्दी व्याख्या:</strong> {shloka.anwayarthHi}</p>}
                {shloka.anwayarthEn && <p><strong className="text-stone-700 dark:text-stone-300">English Commentary:</strong> {shloka.anwayarthEn}</p>}
              </div>
            )}
          </div>
        )}

        {/* Cross Scripture References (Derived from Vachnamrut & Swami ni Vato) */}
        {shloka.crossReferences && shloka.crossReferences.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#261E19] dark:to-[#2C211A] border border-amber-200 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B2500] dark:text-amber-300">
              <BookOpen className="w-4 h-4" />
              <span>વચનામૃત & સ્વામીની વાતો સંબંધ (Derived Scriptural Cross-References):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {shloka.crossReferences.map((ref, rIdx) => (
                <button
                  key={rIdx}
                  onClick={() => onOpenCrossRef(ref)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#342A22] hover:bg-amber-100 dark:hover:bg-[#43352B] border border-amber-300/60 dark:border-amber-700/50 text-xs font-medium text-[#731E00] dark:text-amber-200 transition shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{ref.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags & Mukhpath Badge Footer */}
        <div className="pt-2 border-t border-[#F2EADB] dark:border-[#352D26] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1">
            {shloka.tags.map((tag, tIdx) => (
              <span 
                key={tIdx}
                className="px-2 py-0.5 rounded-md bg-[#F2EADB] dark:bg-[#2F2721] text-[#6B5E51] dark:text-[#BFAF9E] text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Mukhpath Level Pill */}
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${mukhpathColors[mukhpathStatus].bg}`}>
              {mukhpathColors[mukhpathStatus].labelGu}
            </span>
          </div>
        </div>

        {/* Personal Note Editor */}
        {isBookmarked && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50/40 dark:bg-[#251E19] border border-amber-300/30">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1.5">
              <span>તમારી અંગત નોંધ (Personal Study Note):</span>
              <button
                onClick={() => onUpdateBookmarkNote(shloka.id, noteText)}
                className="text-[11px] px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition"
              >
                સાચવો / Save
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="આ શ્લોક વિશે તમારું મનન, ગુરુહરિના વચનો કે અભ્યાસ નોંધ અહીં લખો..."
              className="w-full bg-white dark:bg-[#1E1916] text-[#2D241E] dark:text-[#EDE5D8] text-xs p-2 rounded-lg border border-amber-300/40 focus:outline-none focus:border-amber-500 resize-none h-16"
            />
          </div>
        )}
      </div>
    </article>
  );
};
