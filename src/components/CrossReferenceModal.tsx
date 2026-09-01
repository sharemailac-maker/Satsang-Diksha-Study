import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import { ScriptureReference } from '../types';

interface CrossReferenceModalProps {
  reference: ScriptureReference | null;
  onClose: () => void;
}

export const CrossReferenceModal: React.FC<CrossReferenceModalProps> = ({
  reference,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  if (!reference) return null;

  const isVachnamrut = reference.type === 'vachnamrut';

  const handleCopy = () => {
    const textToCopy = `${reference.title} (${reference.section})\n\n"${reference.textGu}"\n\nસંબંધ: ${reference.correlationNote}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                <span>{isVachnamrut ? 'વચનામૃત સંદર્ભ' : 'સ્વામીની વાતો સંદર્ભ'}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 text-[10px]">ઓફલાઇન ડેટા</span>
              </span>
              <h3 className="font-serif font-bold text-lg text-amber-50">
                {reference.title}
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
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#29211B] border-l-4 border-amber-600">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>સત્સંગ દીક્ષા શ્લોક સાથે શાસ્ત્રીય સંબંધ:</span>
            </div>
            <p className="text-xs text-[#54473C] dark:text-[#D1C5B7] leading-relaxed">
              {reference.correlationNote}
            </p>
          </div>

          {/* Scripture Passage in Gujarati */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400">
                મૂળ ગ્રંથ વાણી (ગુજરાતી મૂળ પાઠ):
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-semibold">
                {reference.section}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF6F0] dark:bg-[#1C1714] border border-[#E8DFD1] dark:border-[#352D26]">
              <p className="font-gujarati text-sm sm:text-base text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                "{reference.textGu}"
              </p>
            </div>
          </div>

          {/* Scripture Passage in Hindi */}
          {reference.textHi && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                हिन्दी अनुवाद:
              </span>
              <div className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1C1714] border border-[#E8DFD1] dark:border-[#352D26]">
                <p className="font-hindi text-sm text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
                  "{reference.textHi}"
                </p>
              </div>
            </div>
          )}

          {/* Scripture Passage in English */}
          {reference.textEn && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                English Translation:
              </span>
              <div className="p-3.5 rounded-xl bg-[#FAF6F0] dark:bg-[#1C1714] border border-[#E8DFD1] dark:border-[#352D26]">
                <p className="font-english text-xs sm:text-sm text-[#4A3E34] dark:text-[#D1C5B7] leading-relaxed">
                  "{reference.textEn}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] border-t border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">૧૦૦% ઓફલાઇન સંગ્રહિત</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-[#2F251E] dark:hover:bg-[#3D3027] text-[#8B2500] dark:text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'કૉપિ થઈ ગયું' : 'સંદર્ભ કૉપિ'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white text-xs font-bold transition shadow-sm"
            >
              બંધ કરો
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
