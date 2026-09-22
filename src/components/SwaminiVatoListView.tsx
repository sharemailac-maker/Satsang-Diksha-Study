import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ExternalLink, ChevronDown, ChevronUp, Sparkles, Filter, ArrowUpRight } from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { 
  getSwaminiVatoConcordanceList, 
  SwaminiVatoConcordanceItem 
} from '../data/concordanceReverseIndex';
import { getShlokaTitle } from '../utils/translationHelper';
import { ShlokaChipsList } from './ShlokaChipsList';

interface SwaminiVatoListViewProps {
  shlokas: Shloka[];
  preferences?: UserPreferences;
  onSelectShloka: (shlokaId: number) => void;
  externalSearchQuery?: string;
}

export const SwaminiVatoListView: React.FC<SwaminiVatoListViewProps> = ({
  shlokas,
  preferences,
  onSelectShloka,
  externalSearchQuery = ''
}) => {
  const [selectedPrakaran, setSelectedPrakaran] = useState<number | 'all'>('all');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const lang = preferences?.activeLanguage || 'gujarati';

  // Build quick map for Shloka lookup
  const shlokaMap = useMemo(() => {
    const map = new Map<number, Shloka>();
    for (const s of shlokas) {
      map.set(s.id, s);
    }
    return map;
  }, [shlokas]);

  const allSwaminiVato = useMemo(() => getSwaminiVatoConcordanceList(), []);
  const totalCount = allSwaminiVato.length;

  // Compute prakaran breakdown
  const prakaranMeta = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const item of allSwaminiVato) {
      counts[item.prakaran] = (counts[item.prakaran] || 0) + 1;
    }
    const prakarans = Object.keys(counts).map(k => parseInt(k, 10)).sort((a, b) => a - b);
    return prakarans.map(p => ({
      prakaran: p,
      count: counts[p]
    }));
  }, [allSwaminiVato]);

  const filteredSwaminiVato = useMemo(() => {
    let result = allSwaminiVato;

    // Filter by Prakaran
    if (selectedPrakaran !== 'all') {
      result = result.filter(item => item.prakaran === selectedPrakaran);
    }

    // Filter by search query
    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.toLowerCase().trim();
      const numMatch = parseInt(q, 10);

      result = result.filter(item => {
        // Match key (e.g. "1/8")
        if (item.key.toLowerCase().includes(q)) return true;
        // Match sections
        if (item.sectionGu.toLowerCase().includes(q)) return true;
        if (item.sectionHi.toLowerCase().includes(q)) return true;
        if (item.sectionEn.toLowerCase().includes(q)) return true;
        // Match topics
        if (item.topicGu.toLowerCase().includes(q)) return true;
        if (item.topicHi.toLowerCase().includes(q)) return true;
        if (item.topicEn.toLowerCase().includes(q)) return true;
        // Match texts
        if (item.textGu.toLowerCase().includes(q)) return true;
        if (item.textHi.toLowerCase().includes(q)) return true;
        if (item.textEn.toLowerCase().includes(q)) return true;
        // Match related shloka IDs
        if (!isNaN(numMatch) && item.relatedShlokaIds.includes(numMatch)) return true;

        return false;
      });
    }

    return result;
  }, [allSwaminiVato, selectedPrakaran, externalSearchQuery]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSectionDisplayName = (item: SwaminiVatoConcordanceItem) => {
    if (lang === 'english') return item.sectionEn;
    if (lang === 'hindi') return item.sectionHi;
    return item.sectionGu;
  };

  const getTopicDisplayName = (item: SwaminiVatoConcordanceItem) => {
    if (lang === 'english') return item.topicEn || item.topicGu;
    if (lang === 'hindi') return item.topicHi || item.topicGu;
    return item.topicGu;
  };

  const getVatText = (item: SwaminiVatoConcordanceItem) => {
    if (lang === 'english') return item.textEn || item.textGu;
    if (lang === 'hindi') return item.textHi || item.textGu;
    return item.textGu;
  };

  return (
    <div className="space-y-5">
      {/* Prakaran Filter Pills */}
      <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 shadow-sm border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            {lang === 'english' ? 'Swamini Vato Prakaran' : lang === 'hindi' ? 'स्वामीनी बातें प्रकरण' : 'સ્વામીની વાતો પ્રકરણ'}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            {filteredSwaminiVato.length} / {totalCount}{' '}
            {lang === 'english' ? 'Vato' : lang === 'hindi' ? 'बातें' : 'વાતો'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedPrakaran('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedPrakaran === 'all'
                ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {lang === 'english' ? `All (${totalCount})` : lang === 'hindi' ? `सभी (${totalCount})` : `બધી વાતો (${totalCount})`}
          </button>
          {prakaranMeta.map((p) => (
            <button
              key={p.prakaran}
              onClick={() => setSelectedPrakaran(p.prakaran)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedPrakaran === p.prakaran
                  ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>
                {lang === 'english'
                  ? `Prakaran ${p.prakaran}`
                  : lang === 'hindi'
                    ? `प्रकरण ${p.prakaran}`
                    : `પ્રકરણ ${p.prakaran}`}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {p.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Swamini Vato Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSwaminiVato.map((item) => {
          const isExpanded = expandedKeys[item.key] ?? false;
          const vatText = getVatText(item);
          const topic = getTopicDisplayName(item);

          return (
            <div
              key={item.key}
              id={`swami-item-${item.key.replace('/', '-')}`}
              className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-sm border border-[#E8DFD1] dark:border-[#3D342C] space-y-3.5 transition-all hover:border-amber-400/60"
            >
              {/* Header: Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#F2EADB] dark:border-[#352D26]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1.5 rounded-xl bg-orange-500/15 dark:bg-orange-400/20 text-orange-950 dark:text-orange-300 font-bold text-xs sm:text-sm border border-orange-500/30 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    {getSectionDisplayName(item)}
                  </span>
                </div>

                {/* Related Shlokas Count Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    {item.relatedShlokaIds.length}{' '}
                    {lang === 'english' ? 'Verses Linked' : lang === 'hindi' ? 'श्लोक संबंधित' : 'શ્લોક સંબંધિત'}
                  </span>
                  {item.anirdeshUrl && (
                    <a
                      href={item.anirdeshUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={lang === 'english' ? 'View on Anirdesh' : 'અનિર્દેશ પર જુઓ'}
                      className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Authentic Swamini Vato Text */}
              {vatText && (
                <div className="relative bg-orange-50/60 dark:bg-orange-950/20 rounded-xl p-3.5 border border-orange-200/60 dark:border-orange-900/40">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 text-lg leading-none select-none font-serif">
                      “
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-serif">
                        {isExpanded || vatText.length < 220
                          ? vatText
                          : `${vatText.slice(0, 220)}...`}
                      </p>

                      {/* Secondary English translation if viewing in Gujarati/Indian languages */}
                      {isExpanded && lang !== 'english' && item.textEn && (
                        <div className="pt-2 border-t border-orange-200/40 dark:border-orange-900/30">
                          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1">
                            English Translation:
                          </span>
                          <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 font-serif italic">
                            {item.textEn}
                          </p>
                        </div>
                      )}

                      {vatText.length >= 220 && (
                        <button
                          onClick={() => toggleExpand(item.key)}
                          className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 hover:underline flex items-center gap-1 pt-1"
                        >
                          <span>
                            {isExpanded
                              ? (lang === 'english' ? 'Show Less' : lang === 'hindi' ? 'कम देखें' : 'ઓછું બતાવો')
                              : (lang === 'english' ? 'Read Full Vat' : lang === 'hindi' ? 'सम्पूर्ण बात पढ़ें' : 'સંપૂર્ણ વાત વાંચો')}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Satsang Diksha Shlokas Chips Section */}
              <ShlokaChipsList
                shlokaIds={item.relatedShlokaIds}
                shlokaMap={shlokaMap}
                preferences={preferences}
                onSelectShloka={onSelectShloka}
                accentColor="orange"
              />
            </div>
          );
        })}

        {filteredSwaminiVato.length === 0 && (
          <div className="p-10 text-center bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] space-y-2">
            <BookOpen className="w-10 h-10 text-orange-600 mx-auto opacity-40" />
            <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200">
              {lang === 'english' ? 'No Swamini Vato matching your search' : 'કોઈ સ્વામીની વાત મળી નથી'}
            </h4>
            <p className="text-xs text-stone-500">
              {lang === 'english' ? 'Try changing the prakaran or search query' : 'શોધ શબ્દ અથવા પ્રકરણ ફિલ્ટર બદલીને પ્રયાસ કરો'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
