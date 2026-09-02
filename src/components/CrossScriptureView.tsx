import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Link2, 
  ChevronRight, 
  Sparkles, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  CheckCircle2, 
  Quote,
  Languages
} from 'lucide-react';
import { Shloka, ScriptureReference, WordMeaning, UserPreferences } from '../types';
import { 
  getShlokaMeaning, 
  getWordMeaningInLang, 
  getShlokaTitle, 
  getShlokaChapterName,
  getReferenceTitle, 
  getReferenceText,
  getReferenceCorrelation,
  LANGUAGE_METADATA 
} from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface CrossScriptureViewProps {
  shlokas: Shloka[];
  preferences?: UserPreferences;
  onOpenCrossRef: (ref: ScriptureReference) => void;
  onSelectShloka: (id: number) => void;
}

export const CrossScriptureView: React.FC<CrossScriptureViewProps> = ({
  shlokas,
  preferences,
  onOpenCrossRef,
  onSelectShloka
}) => {
  const [filterType, setFilterType] = useState<'all' | 'vachnamrut' | 'swamini_vato'>('all');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWordShlokaId, setExpandedWordShlokaId] = useState<number | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<{ [shlokaId: number]: number }>({});

  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

  const filteredItems = useMemo(() => {
    return shlokas.filter(s => {
      // Filter by scripture type
      if (filterType !== 'all') {
        const hasType = s.crossReferences?.some(r => r.type === filterType);
        if (!hasType) return false;
      }

      // Filter by chapter
      if (selectedChapter !== 'all' && s.chapterId !== selectedChapter) {
        return false;
      }

      // Filter by search query (id, title, meaning, sanskrit, vachnamrut title, or word)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = s.id.toString() === query || `shlok ${s.id}`.includes(query) || `verse ${s.id}`.includes(query);
        const textMatch = 
          s.titleGu.toLowerCase().includes(query) ||
          s.titleHi.toLowerCase().includes(query) ||
          s.titleEn.toLowerCase().includes(query) ||
          s.sanskritDevanagari.toLowerCase().includes(query) ||
          s.sanskritGujarati.toLowerCase().includes(query) ||
          s.meaningGu.toLowerCase().includes(query) ||
          s.meaningHi.toLowerCase().includes(query) ||
          s.meaningEn.toLowerCase().includes(query);
        
        const refMatch = s.crossReferences?.some(r => 
          (r.title && r.title.toLowerCase().includes(query)) ||
          (r.titleGu && r.titleGu.toLowerCase().includes(query)) ||
          (r.titleHi && r.titleHi.toLowerCase().includes(query)) ||
          (r.titleEn && r.titleEn.toLowerCase().includes(query)) ||
          (r.section && r.section.toLowerCase().includes(query)) ||
          (r.textGu && r.textGu.toLowerCase().includes(query)) ||
          (r.textHi && r.textHi.toLowerCase().includes(query)) ||
          (r.textEn && r.textEn.toLowerCase().includes(query)) ||
          (r.correlationNote && r.correlationNote.toLowerCase().includes(query))
        );

        const wordMatch = s.padachheda?.some(p => 
          p.word.toLowerCase().includes(query) ||
          p.meaningGu.toLowerCase().includes(query) ||
          p.meaningHi.toLowerCase().includes(query) ||
          p.meaningEn.toLowerCase().includes(query) ||
          (p.scriptureReference?.source && p.scriptureReference.source.toLowerCase().includes(query))
        );

        return idMatch || textMatch || refMatch || wordMatch;
      }

      return true;
    });
  }, [shlokas, filterType, selectedChapter, searchQuery]);

  const toggleWordBreakdown = (id: number) => {
    setExpandedWordShlokaId(prev => prev === id ? null : id);
  };

  const handleWordSelect = (shlokaId: number, wordIdx: number) => {
    setActiveWordIndex(prev => ({
      ...prev,
      [shlokaId]: wordIdx
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 backdrop-blur-xs">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ત્રિવેણી સંગમ પ્રમાણ અધ્યયન (Cross-Reference Concordance)
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
              સત્સંગ દીક્ષા • વચનામૃત • સ્વામીની વાતો શબ્દશઃ સંબંધ
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl leading-relaxed mt-2">
          પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજે રચેલ 'સત્સંગ દીક્ષા'ના તમામ ૩૧૫ શ્લોકો ભગવાન શ્રી સ્વામિનારાયણના સર્વોપરી <strong>વચનામૃત</strong> અને અક્ષરબ્રહ્મ ગુણાતીતાનંદ <strong>સ્વામીની વાતો</strong>ના રહસ્યમય સિદ્ધાંતોનું જ પદચ્છેદ અને શબ્દશઃ સૂત્રાત્મક નિરૂપણ છે. નીચે દરેક શ્લોકનું વચનામૃત-વાતો પ્રમાણ અને પદ-સંબંધ દર્શાવેલ છે.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-4 border-t border-amber-400/25 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-900 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="શ્લોક નં., વચનામૃત (દા.ત. ગઢડા ૧-૧), શબ્દ કે વિષય શોધો..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scripture Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'vachnamrut', 'swamini_vato'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    filterType === t
                      ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                      : 'bg-black/25 text-amber-100 hover:bg-black/40'
                  }`}
                >
                  {t === 'all' && (lang === 'gujarati' ? 'તમામ ૩૧૫ શ્લોક' : lang === 'hindi' ? 'समस्त ३१५ श्लोक' : 'All 315 Verses')}
                  {t === 'vachnamrut' && (lang === 'gujarati' ? '📖 વચનામૃત' : lang === 'hindi' ? '📖 वचनामृत' : '📖 Vachnamrut')}
                  {t === 'swamini_vato' && (lang === 'gujarati' ? '📿 સ્વામીની વાતો' : lang === 'hindi' ? '📿 स्वामीनी बातें' : '📿 Swamini Vato')}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-amber-200/80 font-medium whitespace-nowrap mr-1">
              {ui.chapterPrefix}:
            </span>
            <button
              onClick={() => setSelectedChapter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                selectedChapter === 'all'
                  ? 'bg-white text-amber-950 font-bold shadow-xs'
                  : 'bg-white/10 text-amber-100 hover:bg-white/20'
              }`}
            >
              {lang === 'gujarati' ? 'બધાં પ્રકરણો' : lang === 'hindi' ? 'सभी प्रकरण' : 'All Chapters'}
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                  selectedChapter === ch
                    ? 'bg-white text-amber-950 font-bold shadow-xs'
                    : 'bg-white/10 text-amber-100 hover:bg-white/20'
                }`}
              >
                {ui.chapterPrefix} {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-2 text-xs text-[#7A6B5C] dark:text-[#A89886]">
        <span>
          કુલ <strong>{filteredItems.length}</strong> શ્લોકના શાસ્ત્રીય સંબંધો ઉપલબ્ધ
        </span>
        {searchQuery && (
          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-medium">
            શોધ: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Cross Reference Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredItems.map((shloka) => {
          const isWordExpanded = expandedWordShlokaId === shloka.id;
          const currentWordIdx = activeWordIndex[shloka.id] ?? 0;
          const selectedWord: WordMeaning | undefined = shloka.padachheda?.[currentWordIdx];

          return (
            <div
              key={shloka.id}
              id={`crossref-card-${shloka.id}`}
              className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 sm:p-6 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-4 transition-all hover:border-amber-400/60"
            >
              {/* Shloka Summary Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EADB] dark:border-[#352D26]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-amber-950 font-bold flex items-center justify-center text-sm shadow-sm border border-amber-300">
                    #{shloka.id}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                      {getShlokaTitle(shloka, lang)}
                    </h3>
                    <span className="text-xs text-[#8A7A68] dark:text-[#A89886]">
                      {ui.chapterPrefix} {shloka.chapterId}: {getShlokaChapterName(shloka, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWordBreakdown(shloka.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                      isWordExpanded
                        ? 'bg-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{ui.wordBreakdownTitle}</span>
                    {isWordExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onSelectShloka(shloka.id)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white font-semibold transition shadow-xs flex items-center gap-1"
                  >
                    <span>{ui.tabReader}</span>
                    <BookOpen className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Sanskrit Verse & Meaning Box */}
              <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8B2500] dark:text-amber-400 uppercase tracking-wider">
                    સત્સંગ દીક્ષા સૂત્ર વાણી
                  </span>
                  <span className="text-[11px] text-[#8A7A68] dark:text-[#A89886]">
                    {ui.shlokaNumberPrefix} {shloka.id} / ૩૧૫
                  </span>
                </div>
                <p className="font-sanskrit text-base sm:text-lg font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed">
                  {shloka.sanskritDevanagari}
                </p>
                <div className="pt-1 border-t border-amber-200/40 dark:border-[#352D26] space-y-1">
                  <p className="text-xs sm:text-sm text-[#4A3D31] dark:text-[#DCD1C3] leading-relaxed">
                    <strong className="text-[#8B2500] dark:text-amber-400">{langMeta.nativeName} ({langMeta.nameEn}):</strong> {getShlokaMeaning(shloka, lang)}
                  </p>
                  {lang !== 'gujarati' && (
                    <p className="font-gujarati text-[11px] text-[#6B5E51] dark:text-[#A89886] leading-relaxed">
                      <strong>મૂળ ગુજરાતી:</strong> {shloka.meaningGu}
                    </p>
                  )}
                </div>
              </div>

              {/* Word-by-Word Vachnamrut & Swami ni Vato Breakdown (Expandable) */}
              {isWordExpanded && shloka.padachheda && shloka.padachheda.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-[#28201A] border border-amber-300 dark:border-amber-900/50 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      {ui.wordBreakdownTitle}:
                    </span>
                    <span className="text-[11px] text-[#7A6B5C] dark:text-[#B5A595]">
                      ({ui.wordBreakdownDesc})
                    </span>
                  </div>

                  {/* Word Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {shloka.padachheda.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleWordSelect(shloka.id, pIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                          currentWordIdx === pIdx
                            ? 'bg-[#8B2500] text-white font-bold shadow-xs'
                            : 'bg-white dark:bg-[#1E1916] text-[#54473C] dark:text-[#D1C5B7] border border-amber-200 dark:border-[#3D342C] hover:border-amber-400'
                        }`}
                      >
                        <span className="font-sanskrit font-semibold">{p.word}</span>
                        {currentWordIdx === pIdx && <CheckCircle2 className="w-3 h-3 text-amber-300" />}
                      </button>
                    ))}
                  </div>

                  {/* Selected Word Scriptural Correlation Detail Box */}
                  {selectedWord && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1916] border border-amber-300/80 dark:border-amber-900/40 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-sanskrit text-sm font-bold text-[#8B2500] dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                            પદ: {selectedWord.word}
                          </span>
                          <span className="text-xs text-[#2D241E] dark:text-[#EDE5D8] font-semibold">
                            {getWordMeaningInLang(selectedWord, lang)}
                          </span>
                          {lang !== 'gujarati' && (
                            <span className="text-xs text-[#6B5E51] dark:text-[#A89886]">
                              (ગુજરાતી: {selectedWord.meaningGu})
                            </span>
                          )}
                        </div>
                      </div>

                      {selectedWord.scriptureReference && (
                        <div className="text-xs space-y-1.5 pt-2 border-t border-amber-100 dark:border-[#352D26]">
                          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>મૂળ શાસ્ત્ર પ્રમાણ: {selectedWord.scriptureReference.source}</span>
                          </div>
                          <p className="text-[12px] text-[#3D3227] dark:text-[#E2D7CB] bg-[#FAF6F0] dark:bg-[#251E19] p-2.5 rounded-lg border-l-2 border-amber-600 italic">
                            "{selectedWord.scriptureReference.quoteGu}"
                          </p>
                          <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                            <strong>શાસ્ત્રીય સમન્વય:</strong> {selectedWord.scriptureReference.correlation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Referenced Scriptures List (Vachnamrut & Swami ni Vato) */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 block">
                  {ui.scriptureCrossRefTitle}:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shloka.crossReferences?.map((ref, idx) => (
                    <div
                      key={idx}
                      onClick={() => onOpenCrossRef(ref)}
                      className="p-4 rounded-xl bg-[#FAF6F0] dark:bg-[#28211C] border border-amber-200 dark:border-amber-900/40 hover:border-amber-500 cursor-pointer transition shadow-xs flex flex-col justify-between group hover:shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-700 group-hover:text-amber-600 transition" />
                            {getReferenceTitle(ref, lang)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-amber-700 dark:text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-[#3D3227] dark:text-[#E2D7CB] line-clamp-3 leading-relaxed">
                          "{getReferenceText(ref, lang)}"
                        </p>
                        {ref.correlationNote && (
                          <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] line-clamp-2 italic pt-1 border-t border-amber-200/50 dark:border-[#352D26]">
                            {getReferenceCorrelation(ref, lang)}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between">
                        <span>સંપૂર્ણ સંદર્ભ વાંચો</span>
                        <span>➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
            <BookOpen className="w-12 h-12 text-amber-600 mx-auto opacity-50" />
            <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
              કોઈ સંદર્ભ મળ્યો નથી
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              કૃપા કરીને શોધ શબ્દ બદલો અથવા ફિલ્ટર સાફ કરો.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setSelectedChapter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold text-xs"
            >
              તમામ ફિલ્ટર સાફ કરો
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

