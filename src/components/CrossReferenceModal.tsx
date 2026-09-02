import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Copy, Check, ShieldCheck, Languages } from 'lucide-react';
import { ScriptureReference, UserPreferences } from '../types';
import { getReferenceTitle, getReferenceSection, getReferenceText, getReferenceCorrelation, LANGUAGE_METADATA } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface CrossReferenceModalProps {
  reference: ScriptureReference | null;
  preferences?: UserPreferences;
  onClose: () => void;
}

export const CrossReferenceModal: React.FC<CrossReferenceModalProps> = ({
  reference,
  preferences,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  if (!reference) return null;

  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  const isVachnamrut = reference.type === 'vachnamrut';
  const displayTitle = getReferenceTitle(reference, lang);
  const displaySection = getReferenceSection(reference, lang);
  const activeLangText = getReferenceText(reference, lang);
  const displayCorrelation = getReferenceCorrelation(reference, lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

  const handleCopy = () => {
    const textToCopy = `${displayTitle} ${displaySection ? `(${displaySection})` : ''}\n\n"${activeLangText}"\n\n${displayCorrelation ? `${displayCorrelation}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRefTypeBadge = () => {
    if (isVachnamrut) {
      if (lang === 'hindi') return 'वचनामृत संदर्भ';
      if (lang === 'english') return 'Vachnamrut Reference';
      if (lang === 'marathi') return 'वचनामृत संदर्भ';
      return 'વચનામૃત સંદર્ભ';
    }
    if (lang === 'hindi') return 'स्वामीनी बातें संदर्भ';
    if (lang === 'english') return 'Swamini Vato Reference';
    if (lang === 'marathi') return 'स्वामींची बातें संदर्भ';
    return 'સ્વામીની વાતો સંદર્ભ';
  };

  const getCorrelationTitle = () => {
    if (lang === 'hindi') return 'सत्सङ्गदीक्षा श्लोक के साथ शास्त्रीय संबंध:';
    if (lang === 'english') return 'Scriptural Correlation with Satsang Diksha Shloka:';
    if (lang === 'marathi') return 'सत्सङ्गदीक्षा श्लोकाशी शास्त्रीय संबंध:';
    return 'સત્સંગ દીક્ષા શ્લોક સાથે શાસ્ત્રીય સંબંધ:';
  };

  const getOriginalTextHeading = () => {
    if (lang === 'gujarati') return 'મૂળ ગ્રંથ વાણી (ગુજરાતી મૂળ પાઠ):';
    if (lang === 'hindi') return 'मूल ग्रंथ पाठ (Original Gujarati):';
    return 'Original Scripture Passage (Gujarati):';
  };

  const getCopyBtnLabel = () => {
    if (copied) {
      if (lang === 'hindi') return 'कॉपी हो गया';
      if (lang === 'english') return 'Copied!';
      return 'કૉપિ થઈ ગયું';
    }
    if (lang === 'hindi') return 'संदर्भ कॉपी करें';
    if (lang === 'english') return 'Copy Reference';
    return 'સંદર્ભ કૉપિ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
                {getRefTypeBadge()}
              </span>
              <h3 className="font-serif font-bold text-lg text-amber-50">
                {displayTitle} {displaySection ? `• ${displaySection}` : ''}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Correlation Note */}
          {displayCorrelation && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#29211B] border-l-4 border-amber-600">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getCorrelationTitle()}</span>
              </div>
              <p className="text-xs text-[#54473C] dark:text-[#D1C5B7] leading-relaxed">
                {displayCorrelation}
              </p>
            </div>
          )}

          {/* Active User Language Display Card */}
          {lang !== 'gujarati' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{langMeta.nativeName} ({langMeta.nameEn}):</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 font-bold">
                  {lang.toUpperCase()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-[#281F18] border-2 border-amber-400/70 shadow-xs">
                <p className="text-sm sm:text-base text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed font-medium">
                  "{activeLangText}"
                </p>
              </div>
            </div>
          )}

          {/* Scripture Passage in Gujarati (Authentic Original Text) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400">
                {getOriginalTextHeading()}
              </span>
              {displaySection && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-semibold">
                  {displaySection}
                </span>
              )}
            </div>
            <div className="p-4 rounded-xl bg-[#FAF6F0] dark:bg-[#1C1714] border border-[#E8DFD1] dark:border-[#352D26]">
              <p className="font-gujarati text-sm sm:text-base text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                "{reference.textGu}"
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] border-t border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">
              {lang === 'hindi' ? 'शास्त्रीय प्रमाण संदर्भ' : lang === 'english' ? 'Scriptural Concordance' : lang === 'marathi' ? 'शास्त्रीय संदर्भ' : 'શાસ્ત્રીય પ્રમાણ સંદર્ભ'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-[#2F251E] dark:hover:bg-[#3D3027] text-[#8B2500] dark:text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{getCopyBtnLabel()}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white text-xs font-bold transition shadow-sm"
            >
              {ui.closeWordBreakdown || 'બંધ કરો'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
