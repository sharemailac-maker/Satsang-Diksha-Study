import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ExternalLink, ChevronDown, ChevronUp, Sparkles, Filter, ArrowUpRight } from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { 
  getVachnamrutConcordanceList, 
  getVachnamrutSectionsMeta, 
  VachnamrutConcordanceItem 
} from '../data/concordanceReverseIndex';
import { getShlokaTitle } from '../utils/translationHelper';

interface VachnamrutListViewProps {
  shlokas: Shloka[];
  preferences?: UserPreferences;
  onSelectShloka: (shlokaId: number) => void;
  externalSearchQuery?: string;
}

export const VachnamrutListView: React.FC<VachnamrutListViewProps> = ({
  shlokas,
  preferences,
  onSelectShloka,
  externalSearchQuery = ''
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});

  const lang = preferences?.activeLanguage || 'gujarati';

  // Build quick map for Shloka lookup
  const shlokaMap = useMemo(() => {
    const map = new Map<number, Shloka>();
    for (const s of shlokas) {
      map.set(s.id, s);
    }
    return map;
  }, [shlokas]);

  const allVachnamruts = useMemo(() => getVachnamrutConcordanceList(), []);
  const sectionsMeta = useMemo(() => getVachnamrutSectionsMeta(), []);

  const totalCount = allVachnamruts.length;

  const filteredVachnamruts = useMemo(() => {
    let result = allVachnamruts;

    // Filter by Section prefix
    if (selectedSection !== 'all') {
      result = result.filter(item => item.prefix === selectedSection);
    }

    // Filter by search query
    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.toLowerCase().trim();
      const numMatch = parseInt(q, 10);

      result = result.filter(item => {
        // Match code (e.g. "GI-1", "g1")
        if (item.code.toLowerCase().includes(q)) return true;
        // Match section names
        if (item.sectionGu.toLowerCase().includes(q)) return true;
        if (item.sectionHi.toLowerCase().includes(q)) return true;
        if (item.sectionEn.toLowerCase().includes(q)) return true;
        // Match titles
        if (item.titleGu.toLowerCase().includes(q)) return true;
        if (item.titleHi.toLowerCase().includes(q)) return true;
        if (item.titleEn.toLowerCase().includes(q)) return true;
        // Match quotes
        const quoteMatch = item.quotes.some(
          quote =>
            quote.quoteGu.toLowerCase().includes(q) ||
            quote.quoteHi.toLowerCase().includes(q) ||
            quote.quoteEn.toLowerCase().includes(q)
        );
        if (quoteMatch) return true;
        // Match related shloka IDs
        if (!isNaN(numMatch) && item.relatedShlokaIds.includes(numMatch)) return true;

        return false;
      });
    }

    return result;
  }, [allVachnamruts, selectedSection, externalSearchQuery]);

  const toggleExpand = (code: string) => {
    setExpandedCodes(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const getSectionDisplayName = (item: VachnamrutConcordanceItem) => {
    if (lang === 'english') return item.sectionEn;
    if (lang === 'hindi') return item.sectionHi;
    return item.sectionGu;
  };

  const getTitleDisplayName = (item: VachnamrutConcordanceItem) => {
    if (lang === 'english') return item.titleEn || item.titleGu;
    if (lang === 'hindi') return item.titleHi || item.titleGu;
    return item.titleGu;
  };

  const getQuoteText = (item: VachnamrutConcordanceItem) => {
    if (!item.quotes || item.quotes.length === 0) return null;
    const q = item.quotes[0];
    if (lang === 'english') return q.quoteEn || q.quoteGu;
    if (lang === 'hindi') return q.quoteHi || q.quoteGu;
    return q.quoteGu;
  };

  return (
    <div className="space-y-5">
      {/* Section Filter Pills */}
      <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 shadow-sm border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            {lang === 'english' ? 'Vachnamrut Sections' : lang === 'hindi' ? 'वचनामृत प्रकरण' : 'વચનામૃત પ્રકરણો'}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            {filteredVachnamruts.length} / {totalCount}{' '}
            {lang === 'english' ? 'Discourses' : lang === 'hindi' ? 'वचनामृत' : 'વચનામૃત'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedSection === 'all'
                ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {lang === 'english' ? `All (${totalCount})` : lang === 'hindi' ? `सभी (${totalCount})` : `બધાં (${totalCount})`}
          </button>
          {sectionsMeta.map((sec) => (
            <button
              key={sec.prefix}
              onClick={() => setSelectedSection(sec.prefix)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedSection === sec.prefix
                  ? 'bg-[#8B2500] text-amber-50 shadow-sm font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{lang === 'english' ? sec.nameEn : lang === 'hindi' ? sec.nameHi : sec.nameGu}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {sec.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vachnamruts Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredVachnamruts.map((item) => {
          const isExpanded = expandedCodes[item.code] ?? false;
          const quoteText = getQuoteText(item);
          const hasMultipleQuotes = item.quotes.length > 1;

          return (
            <div
              key={item.code}
              id={`vach-item-${item.code}`}
              className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-sm border border-[#E8DFD1] dark:border-[#3D342C] space-y-3.5 transition-all hover:border-amber-400/60"
            >
              {/* Header: Section & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#F2EADB] dark:border-[#352D26]">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 text-[#8B2500] dark:text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {getSectionDisplayName(item)}
                  </span>
                  {getTitleDisplayName(item) && (
                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {getTitleDisplayName(item)}
                    </h3>
                  )}
                </div>

                {/* Related Shlokas Count Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                    {item.relatedShlokaIds.length}{' '}
                    {lang === 'english' ? 'Verses Linked' : lang === 'hindi' ? 'श्लोक संबंधित' : 'શ્લોક સંબંધિત'}
                  </span>
                </div>
              </div>

              {/* Authentic Vachnamrut Quotation */}
              {quoteText && (
                <div className="relative bg-amber-50/70 dark:bg-amber-950/20 rounded-xl p-3.5 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 text-lg leading-none select-none font-serif">
                      “
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-serif">
                        {isExpanded || quoteText.length < 220
                          ? quoteText
                          : `${quoteText.slice(0, 220)}...`}
                      </p>

                      {/* Additional quotes if any and expanded */}
                      {isExpanded && item.quotes.slice(1).map((q, idx) => {
                        const subQuote = lang === 'english' ? q.quoteEn : lang === 'hindi' ? q.quoteHi : q.quoteGu;
                        return (
                          <div key={idx} className="pt-2 border-t border-amber-200/40 dark:border-amber-900/30">
                            <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 font-serif">
                              {subQuote}
                            </p>
                          </div>
                        );
                      })}

                      {(quoteText.length >= 220 || hasMultipleQuotes) && (
                        <button
                          onClick={() => toggleExpand(item.code)}
                          className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 pt-1"
                        >
                          <span>
                            {isExpanded
                              ? (lang === 'english' ? 'Show Less' : lang === 'hindi' ? 'कम देखें' : 'ઓછું બતાવો')
                              : (lang === 'english' ? `Read Full Passage (${item.quotes.length} quote${item.quotes.length > 1 ? 's' : ''})` : lang === 'hindi' ? 'सम्पूर्ण पढ़ें' : 'સંપૂર્ણ વચનામૃત પ્રમાણ વાંચો')}
                          </span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Satsang Diksha Shlokas Section */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-xs font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wide">
                    {lang === 'english'
                      ? 'Related Satsang Diksha Verses (Click to study in Shloka Adhyayan):'
                      : lang === 'hindi'
                        ? 'संबंधित सत्संग दीक्षा श्लोक (श्लोक अध्ययन में देखने के लिए क्लिक करें):'
                        : 'સંબંધિત સત્સંગ દીક્ષા શ્લોકો (શ્લોક અધ્યયનમાં જોવા માટે ક્લિક કરો):'}
                  </h4>
                </div>

                {/* Shloka Chips Grid */}
                <div className="flex flex-wrap gap-2">
                  {item.relatedShlokaIds.map((shlokaId) => {
                    const shloka = shlokaMap.get(shlokaId);
                    const title = shloka ? getShlokaTitle(shloka, lang) : `Verse ${shlokaId}`;

                    return (
                      <button
                        key={shlokaId}
                        onClick={() => onSelectShloka(shlokaId)}
                        title={`${title} - ${lang === 'english' ? 'Click to open in Shloka Reader' : 'શ્લોક અધ્યયનમાં જોવા માટે ક્લિક કરો'}`}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2C2520] hover:bg-[#8B2500] hover:text-white dark:hover:bg-amber-600 border border-[#E8DFD1] dark:border-[#3D342C] text-stone-800 dark:text-stone-200 transition-all shadow-xs hover:shadow-md cursor-pointer text-xs"
                      >
                        <span className="font-bold text-[#8B2500] dark:text-amber-400 group-hover:text-amber-200">
                          #{shlokaId}
                        </span>
                        {shloka && (
                          <span className="max-w-[150px] sm:max-w-[200px] truncate text-[11px] font-medium text-stone-600 dark:text-stone-400 group-hover:text-white">
                            {title}
                          </span>
                        )}
                        <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-amber-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {filteredVachnamruts.length === 0 && (
          <div className="p-10 text-center bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] space-y-2">
            <BookOpen className="w-10 h-10 text-amber-600 mx-auto opacity-40" />
            <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200">
              {lang === 'english' ? 'No Vachnamrut matching your search' : 'કોઈ વચનામૃત મળ્યું નથી'}
            </h4>
            <p className="text-xs text-stone-500">
              {lang === 'english' ? 'Try changing the section or search query' : 'શોધ શબ્દ અથવા પ્રકરણ ફિલ્ટર બદલીને પ્રયાસ કરો'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
