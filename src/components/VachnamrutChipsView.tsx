import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Copy, Check, Tag } from 'lucide-react';
import { ScriptureReference, UserPreferences } from '../types';
import { 
  getVachnamrutEntry, 
  getVachnamrutQuotationsInLang,
  hasVachnamrutQuotation,
  VachnamrutEntry 
} from '../data/vachnamrutService';

interface VachnamrutChipsViewProps {
  references: ScriptureReference[];
  preferences: UserPreferences;
  shlokaId?: number;
  initialExpanded?: boolean;
  compact?: boolean;
}

export const VachnamrutChipsView: React.FC<VachnamrutChipsViewProps> = ({
  references,
  preferences,
  shlokaId,
  initialExpanded = false,
  compact = false,
}) => {
  const vachRefs = references.filter(r => r.type === 'vachnamrut');
  const lang = preferences.activeLanguage;

  // Track expanded chip indices (only for chips that have quotations)
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
    new Set(initialExpanded ? vachRefs.map((_, i) => i) : [])
  );
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (vachRefs.length === 0) return null;

  const toggleChip = (idx: number, hasQuotes: boolean) => {
    if (!hasQuotes) return;
    setExpandedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleCopy = (quotes: string[], idx: number) => {
    const textToCopy = quotes.join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Translations for UI labels
  const ui = {
    title: lang === 'english' ? 'Vachnamrut References' : lang === 'hindi' ? 'वचनामृत संदर्भ' : 'વચનામૃત સંદર્ભ',
    copy: lang === 'english' ? 'Copy Quotation' : lang === 'hindi' ? 'कॉपी' : 'કોપી',
    copied: lang === 'english' ? 'Copied' : lang === 'hindi' ? 'कॉपी हो गया' : 'કોપી થઈ ગયું',
    correlationTitle: lang === 'english' ? 'Scriptural Concordance Note:' : lang === 'hindi' ? 'शास्त्रीय समन्वय:' : 'શ્લોક સાથે શાસ્ત્રીય સંવાદ:',
    availableQuotation: lang === 'english' ? 'Click to view quotation' : lang === 'hindi' ? 'अवतरण देखने के लिए क्लिक करें' : 'અવતરણ જોવા ક્લિક કરો',
    noQuotationTag: lang === 'english' ? 'Concordance number' : lang === 'hindi' ? 'संदर्भ संख्या' : 'સંદર્ભ ક્રમાંક',
  };

  return (
    <div 
      id={`vachnamrut-concordance-${shlokaId ?? 'view'}`}
      className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 dark:from-amber-950/20 dark:to-stone-950/30 border border-amber-200/90 dark:border-amber-900/40 space-y-3 shadow-xs"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/30 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400 inline-block ring-4 ring-amber-200/60 dark:ring-amber-950" />
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
            <span>{ui.title}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-sans font-semibold">
              {vachRefs.length}
            </span>
          </h4>
        </div>
      </div>

      {/* Chips-Like View */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {vachRefs.map((ref, idx) => {
            const vachEntry = getVachnamrutEntry(ref.section);
            const hasQuotes = Boolean(vachEntry && vachEntry.quotes && vachEntry.quotes.length > 0);
            const isExpanded = expandedIndices.has(idx);

            const sectionLabel = lang === 'english' 
              ? (vachEntry?.sectionEn || ref.sectionEn || ref.section) 
              : lang === 'hindi' 
              ? (vachEntry?.sectionHi || ref.sectionHi || ref.section) 
              : (vachEntry?.sectionGu || ref.section);
            
            const topicLabel = lang === 'english' 
              ? (vachEntry?.titleEn || ref.topicEn || ref.topic) 
              : lang === 'hindi'
              ? (vachEntry?.titleHi || ref.topicHi || ref.topic)
              : (vachEntry?.titleGu || ref.topicGu || ref.topic);

            // If quotation available: provide book like icon before that number and allow click to expand
            if (hasQuotes) {
              return (
                <button
                  key={idx}
                  type="button"
                  id={`vach-chip-${shlokaId ?? 'item'}-${idx}`}
                  onClick={() => toggleChip(idx, true)}
                  title={ui.availableQuotation}
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer shadow-2xs border ${
                    isExpanded
                      ? 'bg-amber-700 text-white border-amber-800 dark:bg-amber-600 dark:border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-white dark:bg-[#1F1916] text-[#2D241E] dark:text-[#EDE5D8] border-amber-300/80 dark:border-amber-800/60 hover:border-amber-600 hover:bg-amber-50/80 dark:hover:bg-amber-950/30'
                  }`}
                >
                  {/* Book-like icon before number when quotation is available */}
                  <BookOpen className={`w-3.5 h-3.5 ${isExpanded ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                  
                  <span className="font-bold tracking-tight">
                    {sectionLabel}
                  </span>

                  {topicLabel && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md truncate max-w-[140px] sm:max-w-[180px] ${
                        isExpanded
                          ? 'bg-amber-800/90 text-amber-100'
                          : 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      {topicLabel}
                    </span>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 ml-0.5 opacity-90" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              );
            }

            // If there is NO quotation available for Vachnamrut number:
            // Retain that number without book like icon at number
            return (
              <div
                key={idx}
                id={`vach-chip-${shlokaId ?? 'item'}-${idx}`}
                title={ui.noQuotationTag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-stone-100/80 dark:bg-[#1E1916] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800/80 shadow-2xs select-none"
              >
                {/* No book-like icon when quotation is not available */}
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {sectionLabel}
                </span>

                {topicLabel && (
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 border-l border-stone-300 dark:border-stone-700 pl-1.5">
                    {topicLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Referenced Vachnamrut Quotation Cards (when expanded) */}
      {expandedIndices.size > 0 && (
        <div className="space-y-3 pt-2">
          {vachRefs.map((ref, idx) => {
            if (!expandedIndices.has(idx)) return null;

            const vachEntry = getVachnamrutEntry(ref.section);
            if (!vachEntry) return null;

            const isEnglish = lang === 'english';
            const isHindi = lang === 'hindi';

            const sectionLabel = isEnglish 
              ? (vachEntry.sectionEn || ref.sectionEn || ref.section) 
              : isHindi 
              ? (vachEntry.sectionHi || ref.sectionHi || ref.section) 
              : (vachEntry.sectionGu || ref.section);

            const topicLabel = isEnglish 
              ? (vachEntry.titleEn || ref.topicEn || ref.topic) 
              : isHindi 
              ? (vachEntry.titleHi || ref.topicHi || ref.topic) 
              : (vachEntry.titleGu || ref.topicGu || ref.topic);

            const quotesInLang = getVachnamrutQuotationsInLang(vachEntry, lang);

            const correlationNote = isEnglish
              ? (ref.correlationNoteEn || ref.correlationNote)
              : isHindi
              ? (ref.correlationNoteHi || ref.correlationNote)
              : (ref.correlationNoteGu || ref.correlationNote);

            return (
              <div
                key={idx}
                id={`vach-detail-card-${shlokaId ?? 'item'}-${idx}`}
                className="rounded-xl bg-white/95 dark:bg-[#1E1815] border border-amber-200/90 dark:border-amber-900/60 p-3.5 sm:p-4 space-y-3 shadow-xs"
              >
                {/* Vach Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-700 dark:bg-amber-600 text-white font-bold text-xs shadow-2xs">
                      {sectionLabel}
                    </span>
                    {topicLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-950 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300/50 dark:border-amber-800/40">
                        <Tag className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        {topicLabel}
                      </span>
                    )}
                  </div>

                  {/* Copy Action (No external link in app as instructed) */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopy(quotesInLang, idx)}
                      title={ui.copy}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200/80 dark:border-stone-700/60"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[11px] text-emerald-700 font-medium">{ui.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">{ui.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quotations in User's Selected Language */}
                <div className="space-y-2.5">
                  {quotesInLang.map((quote, qIdx) => (
                    <div 
                      key={qIdx}
                      className="p-3 rounded-xl border-l-3 bg-amber-50/50 dark:bg-stone-900/40 border-amber-600 dark:border-amber-500 shadow-2xs"
                    >
                      <p 
                        className={`${isEnglish ? 'font-english' : isHindi ? 'font-hindi' : 'font-gujarati'} text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed whitespace-pre-line text-sm sm:text-base`}
                        style={{ fontSize: `${preferences.fontSize}px` }}
                      >
                        {quote}
                      </p>
                    </div>
                  ))}

                  {/* Concordance Correlation Note */}
                  {correlationNote && (
                    <div className="pt-1 flex items-start gap-1.5 text-xs text-[#7A6B5C] dark:text-[#A89886]">
                      <span className="font-semibold text-amber-900 dark:text-amber-300 shrink-0">
                        {ui.correlationTitle}
                      </span>
                      <span>{correlationNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
