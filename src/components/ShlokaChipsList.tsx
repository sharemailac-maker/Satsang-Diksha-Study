import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight, BookOpen } from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { getShlokaTitle, getShlokaChapterName } from '../utils/translationHelper';

interface ShlokaChipsListProps {
  shlokaIds: number[];
  shlokaMap: Map<number, Shloka>;
  preferences?: UserPreferences;
  onSelectShloka: (shlokaId: number) => void;
  accentColor?: 'amber' | 'orange';
}

export const ShlokaChipsList: React.FC<ShlokaChipsListProps> = ({
  shlokaIds,
  shlokaMap,
  preferences,
  onSelectShloka,
  accentColor = 'amber'
}) => {
  const [expandedShlokaId, setExpandedShlokaId] = useState<number | null>(null);

  const lang = preferences?.activeLanguage || 'gujarati';
  const script = preferences?.sanskritScript || 'gujarati';

  if (!shlokaIds || shlokaIds.length === 0) return null;

  const toggleShloka = (id: number) => {
    setExpandedShlokaId(prev => (prev === id ? null : id));
  };

  const activeShloka = expandedShlokaId ? shlokaMap.get(expandedShlokaId) : null;

  const getSanskritText = (shloka: Shloka) => {
    if (script === 'gujarati') return shloka.sanskritGujarati;
    if (script === 'iast') return shloka.sanskritIast;
    return shloka.sanskritDevanagari;
  };

  const getMeaningText = (shloka: Shloka) => {
    if (lang === 'english') return shloka.meaningEn;
    if (lang === 'hindi') return shloka.meaningHi;
    return shloka.meaningGu;
  };

  const isOrange = accentColor === 'orange';

  return (
    <div className="space-y-3 pt-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isOrange ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'}`} />
          <h4 className="text-xs font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wide">
            {lang === 'english'
              ? 'Related Verses'
              : lang === 'hindi'
              ? 'संबंधित श्लोक'
              : 'સંબંધિત શ્લોકો'}
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {shlokaIds.length}
            </span>
          </h4>
        </div>
        <span className="text-[10px] text-stone-500 dark:text-stone-400">
          {lang === 'english'
            ? 'Click chip to view shloka'
            : lang === 'hindi'
            ? 'श्लोक देखने के लिए चिप पर क्लिक करें'
            : 'શ્લોક જોવા ચિપ પર ક્લિક કરો'}
        </span>
      </div>

      {/* Chips Row */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {shlokaIds.map((shlokaId) => {
          const shloka = shlokaMap.get(shlokaId);
          const isExpanded = expandedShlokaId === shlokaId;
          const title = shloka ? getShlokaTitle(shloka, lang) : '';

          return (
            <button
              key={shlokaId}
              type="button"
              onClick={() => toggleShloka(shlokaId)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border shadow-2xs ${
                isExpanded
                  ? isOrange
                    ? 'bg-orange-600 text-white border-orange-700 dark:bg-orange-700 dark:border-orange-500 ring-2 ring-orange-400/30'
                    : 'bg-amber-700 text-white border-amber-800 dark:bg-amber-600 dark:border-amber-400 ring-2 ring-amber-400/30'
                  : 'bg-[#FAF6F0] dark:bg-[#2C2520] text-stone-800 dark:text-stone-200 border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-500 hover:bg-amber-50/80 dark:hover:bg-[#382E25]'
              }`}
            >
              <span className={`font-bold ${isExpanded ? 'text-white' : isOrange ? 'text-orange-700 dark:text-orange-400' : 'text-[#8B2500] dark:text-amber-400'}`}>
                {lang === 'english' ? `Verse ${shlokaId}` : lang === 'hindi' ? `श्लोक ${shlokaId}` : `શ્લોક ${shlokaId}`}
              </span>

              {title && (
                <span className={`max-w-[120px] sm:max-w-[170px] truncate text-[11px] ${isExpanded ? 'text-amber-100' : 'text-stone-600 dark:text-stone-400'}`}>
                  {title}
                </span>
              )}

              {isExpanded ? (
                <ChevronUp className="w-3 h-3 ml-0.5 opacity-90" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-50 group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Shloka Details Card */}
      {activeShloka && (
        <div
          id={`expanded-shloka-preview-${activeShloka.id}`}
          className={`rounded-2xl p-4 sm:p-5 space-y-3.5 border transition-all duration-200 shadow-sm ${
            isOrange
              ? 'bg-orange-50/60 dark:bg-orange-950/25 border-orange-200/90 dark:border-orange-900/50'
              : 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200/90 dark:border-amber-900/50'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-2xs ${
                isOrange ? 'bg-orange-600' : 'bg-amber-700'
              }`}>
                {lang === 'english' ? `Verse ${activeShloka.id}` : lang === 'hindi' ? `श्लोक ${activeShloka.id}` : `શ્લોક ${activeShloka.id}`}
              </span>
              <div>
                <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {getShlokaTitle(activeShloka, lang)}
                </h5>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {getShlokaChapterName(activeShloka, lang)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setExpandedShlokaId(null)}
                className="text-xs px-2 py-1 rounded-lg bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sanskrit Text */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1916] border border-amber-200/70 dark:border-amber-900/40 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              ॥ {lang === 'english' ? 'Sanskrit Verse' : lang === 'hindi' ? 'संस्कृत श्लोक' : 'મૂળ સંસ્કૃત શ્લોક'} ॥
            </span>
            <p className="font-sanskrit text-sm sm:text-base font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide">
              {getSanskritText(activeShloka)}
            </p>
          </div>

          {/* Translation */}
          <div className="space-y-1 px-1">
            <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
              {lang === 'english' ? 'Meaning' : lang === 'hindi' ? 'सरल अर्थ' : 'સરળ ભાવાર્થ'}:
            </span>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              {getMeaningText(activeShloka)}
            </p>
          </div>

          {/* Action Link to Shloka Adhyayan */}
          <div className="pt-2 border-t border-stone-200/70 dark:border-stone-800 flex justify-end">
            <button
              type="button"
              onClick={() => onSelectShloka(activeShloka.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-95 ${
                isOrange ? 'bg-orange-700 hover:bg-orange-800' : 'bg-[#8B2500] hover:bg-[#A63000]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {lang === 'english'
                  ? 'Open in Shloka Adhyayan'
                  : lang === 'hindi'
                  ? 'श्लोक अध्ययन में विस्तृत देखें'
                  : 'શ્લોક અધ્યયનમાં સવિસ્તાર જુઓ'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
