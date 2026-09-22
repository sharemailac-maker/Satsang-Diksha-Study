import React, { useState } from 'react';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, Copy, Check, Tag } from 'lucide-react';
import { ScriptureReference, UserPreferences } from '../types';

interface SwaminiVatoChipsViewProps {
  references: ScriptureReference[];
  preferences: UserPreferences;
  shlokaId?: number;
  initialExpanded?: boolean;
  compact?: boolean;
}

export const SwaminiVatoChipsView: React.FC<SwaminiVatoChipsViewProps> = ({
  references,
  preferences,
  shlokaId,
  initialExpanded = false,
  compact = false,
}) => {
  const swamiRefs = references.filter(r => r.type === 'swamini_vato');
  const lang = preferences.activeLanguage;

  // Selected chip indices (expanded by clicking chip)
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
    new Set(initialExpanded ? swamiRefs.map((_, i) => i) : [])
  );
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (swamiRefs.length === 0) return null;

  const toggleChip = (idx: number) => {
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

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Translations for UI labels
  const ui = {
    title: lang === 'english' ? 'Swamini Vato References' : lang === 'hindi' ? 'स्वामीनी बातें संदर्भ' : 'સ્વામીની વાતો પ્રકરણ સંદર્ભ',
    openInAnirdesh: lang === 'english' ? 'Open in Anirdesh' : lang === 'hindi' ? 'Anirdesh पर देखें' : 'અનિર્દેશ પર જુઓ',
    copyDiscourse: lang === 'english' ? 'Copy' : lang === 'hindi' ? 'कॉपी' : 'કોપી',
    copied: lang === 'english' ? 'Copied' : lang === 'hindi' ? 'कॉपी हो गया' : 'કોપી થઈ ગયું',
    correlationTitle: lang === 'english' ? 'Scriptural Concordance Note:' : lang === 'hindi' ? 'शास्त्रीय समन्वय:' : 'શ્લોક સાથે શાસ્ત્રીય સંવાદ:',
  };

  return (
    <div 
      id={`swamini-vato-concordance-${shlokaId ?? 'view'}`}
      className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-orange-50/70 to-amber-50/50 dark:from-orange-950/20 dark:to-stone-950/30 border border-orange-200/90 dark:border-orange-900/40 space-y-3 shadow-xs"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-orange-200/60 dark:border-orange-900/30 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 dark:bg-orange-400 inline-block ring-4 ring-orange-200/60 dark:ring-orange-950" />
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#8B2E00] dark:text-orange-300 flex items-center gap-1.5">
            <span>{ui.title}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-200/80 dark:bg-orange-900/60 text-orange-950 dark:text-orange-200 font-sans font-semibold">
              {swamiRefs.length}
            </span>
          </h4>
        </div>
      </div>

      {/* Chips-Like View */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {swamiRefs.map((ref, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const sectionLabel = lang === 'english' 
              ? (ref.sectionEn || ref.section) 
              : lang === 'hindi' 
              ? (ref.sectionHi || ref.section) 
              : ref.section;
            
            const categoryLabel = lang === 'english' 
              ? (ref.categoryEn || ref.topicEn || ref.topic) 
              : (ref.categoryGu || ref.topicGu || ref.topic);

            return (
              <button
                key={idx}
                type="button"
                id={`vato-chip-${shlokaId ?? 'item'}-${idx}`}
                onClick={() => toggleChip(idx)}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer shadow-2xs border ${
                  isExpanded
                    ? 'bg-orange-600 text-white border-orange-700 dark:bg-orange-700 dark:border-orange-500 ring-2 ring-orange-400/30'
                    : 'bg-white dark:bg-[#1F1916] text-[#2D241E] dark:text-[#EDE5D8] border-orange-300/70 dark:border-orange-800/60 hover:border-orange-500 hover:bg-orange-50/70 dark:hover:bg-orange-950/30'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${isExpanded ? 'text-white' : 'text-orange-600 dark:text-orange-400'}`} />
                <span className="font-bold tracking-tight">
                  {sectionLabel}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 ml-0.5 opacity-80" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-50 group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Referenced Swamini Vato Listed Below Verse (when any chip is clicked/expanded) */}
      {expandedIndices.size > 0 && (
        <div className="space-y-3 pt-2">
          {swamiRefs.map((ref, idx) => {
            if (!expandedIndices.has(idx)) return null;

            // Study language strictly follows main settings preferences
            const isEnglish = lang === 'english';
            const displayText = isEnglish 
              ? (ref.textEn || ref.textGu || '') 
              : (ref.textGu || ref.textEn || '');

            const sectionLabel = isEnglish 
              ? (ref.sectionEn || ref.section) 
              : lang === 'hindi' 
              ? (ref.sectionHi || ref.section) 
              : ref.section;

            const correlationNote = isEnglish
              ? (ref.correlationNoteEn || ref.correlationNote)
              : lang === 'hindi'
              ? (ref.correlationNoteHi || ref.correlationNote)
              : (ref.correlationNoteGu || ref.correlationNote);

            const vatUrl = ref.anirdeshUrl || (ref.prakaran && ref.vatoNo 
              ? `https://anirdesh.com/vato/index.php?prakaran=${ref.prakaran}&no=${ref.vatoNo}` 
              : 'https://anirdesh.com/vato/index.php?by=category');

            return (
              <div
                key={idx}
                id={`vato-detail-card-${shlokaId ?? 'item'}-${idx}`}
                className="rounded-xl bg-white/95 dark:bg-[#1E1815] border border-orange-200 dark:border-orange-900/60 p-3.5 sm:p-4 space-y-3 shadow-xs"
              >
                {/* Vat Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs shadow-2xs">
                      {sectionLabel}
                    </span>
                  </div>

                  {/* Actions (Copy & External Link) */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopy(displayText, idx)}
                      title={ui.copyDiscourse}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={vatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={ui.openInAnirdesh}
                      className="p-1.5 rounded-lg text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors inline-flex items-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Discourse Text in User's Selected Language (From Settings) */}
                <div className="space-y-3">
                  {displayText ? (
                    <div className={`p-3 rounded-xl border-l-3 ${
                      isEnglish 
                        ? 'bg-amber-50/40 dark:bg-stone-900/40 border-amber-500' 
                        : 'bg-orange-50/40 dark:bg-stone-900/40 border-orange-500'
                    }`}>
                      <p 
                        className={`${isEnglish ? 'font-english' : 'font-gujarati'} text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed whitespace-pre-line text-sm sm:text-base`}
                        style={{ fontSize: `${preferences.fontSize}px` }}
                      >
                        {displayText}
                      </p>
                    </div>
                  ) : null}

                  {/* Concordance Correlation Note */}
                  {correlationNote && (
                    <div className="pt-1 flex items-start gap-1.5 text-xs text-[#7A6B5C] dark:text-[#A89886]">
                      <span className="font-semibold text-orange-900 dark:text-orange-300 shrink-0">
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
