import React from 'react';
import { X, Type, Sun, Moon, RotateCcw, Sliders, Shield, BookOpen, Sparkles, FileText } from 'lucide-react';
import { UserPreferences, ThemeMode, SanskritScript, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onResetPreferences: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetPreferences
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-base text-amber-50">
              અધ્યયન સેટિંગ્સ (Study & Reading Preferences)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#2D241E] dark:text-[#EDE5D8]">
          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="font-bold text-[#8B2500] dark:text-amber-400 block">
              થીમ મોડ (Visual Theme):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'પ્રકાશ (Light)', desc: 'Warm Ivory' },
                { id: 'sepia', label: 'સેપિયા (Sepia)', desc: 'Ancient Palm Leaf' },
                { id: 'dark', label: 'રાત્રિ (Dark)', desc: 'Night Comfort' }
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdatePreferences({ theme: th.id as ThemeMode })}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    preferences.theme === th.id
                      ? 'border-[#8B2500] dark:border-amber-400 bg-amber-50 dark:bg-amber-950/40 font-bold'
                      : 'border-[#E8DFD1] dark:border-[#3D342C] bg-[#FAF6F0] dark:bg-[#2C241F]'
                  }`}
                >
                  <div className="font-semibold text-xs">{th.label}</div>
                  <div className="text-[10px] opacity-75">{th.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-[#8B2500] dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Type className="w-4 h-4" />
                <span>શાસ્ત્ર લખાણ કદ (Scripture Font Size):</span>
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-300">{preferences.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="26"
              step="1"
              value={preferences.fontSize}
              onChange={(e) => onUpdatePreferences({ fontSize: parseInt(e.target.value, 10) })}
              className="w-full accent-[#8B2500] cursor-pointer"
            />
            <div className="p-3 bg-[#FAF6F0] dark:bg-[#2A221C] rounded-xl border border-amber-300/30 text-center">
              <span style={{ fontSize: `${preferences.fontSize}px` }} className="font-sanskrit text-[#8B2500] dark:text-amber-300 block">
                श्रीमत्परब्रह्मगुरुं स्वामिनारायणं हरिम्
              </span>
              <span style={{ fontSize: `${preferences.fontSize - 2}px` }} className="font-gujarati text-[#4A3E34] dark:text-[#D1C5B7] block mt-1">
                નમૂનો લખાણ કદ (Live Font Preview)
              </span>
            </div>
          </div>

          {/* Sanskrit Script Preference */}
          <div className="space-y-2">
            <label className="font-bold text-[#8B2500] dark:text-amber-400 block">
              સંસ્કૃત શ્લોક લિપિ (Default Sanskrit Script):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'devanagari', label: 'देवनागरी (Devanagari)' },
                { id: 'gujarati', label: 'ગુજરાતી લિપિ (Gujarati)' },
                { id: 'iast', label: 'IAST (Roman English)' }
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => onUpdatePreferences({ sanskritScript: sc.id as SanskritScript })}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    preferences.sanskritScript === sc.id
                      ? 'border-[#8B2500] bg-amber-50 dark:bg-amber-950/40 font-bold text-[#8B2500] dark:text-amber-300'
                      : 'border-[#E8DFD1] dark:border-[#3D342C] bg-[#FAF6F0] dark:bg-[#2C241F]'
                  }`}
                >
                  <div className="text-xs">{sc.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Study Expansion Toggles */}
          <div className="space-y-3">
            <label className="font-bold text-[#8B2500] dark:text-amber-400 block">
              અધ્યયન વિકલ્પો (Study Display Options):
            </label>
            
            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-[#2A221C] border border-amber-300/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>પદચ્છેદ અને શબ્દાર્થ આપમેળે ખોલો</span>
                </div>
                <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                  Auto-expand word-by-word breakdown by default
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showWordBreakdownDefault}
                onChange={(e) => onUpdatePreferences({ showWordBreakdownDefault: e.target.checked })}
                className="w-5 h-5 accent-[#8B2500] rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-[#2A221C] border border-amber-300/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>અન્વયાર્થ અને વિશ્લેષણ આપમેળે ખોલો</span>
                </div>
                <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                  Auto-expand commentary & philosophical insights
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showCommentaryDefault}
                onChange={(e) => onUpdatePreferences({ showCommentaryDefault: e.target.checked })}
                className="w-5 h-5 accent-[#8B2500] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Offline Security Info */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-300/40 flex items-center gap-2 text-[11px] text-emerald-900 dark:text-emerald-200">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>આ એપ સંપૂર્ણપણે ૧૦૦% ઑફલાઇન કાર્ય કરે છે. કોઈ નેટવર્ક કે ઇન્ટરનેટ ડેટાની જરૂર નથી.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] border-t border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-between">
          <button
            onClick={onResetPreferences}
            className="text-xs text-[#8B2500] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>મૂળ સેટિંગ્સ (Reset)</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white text-xs font-bold transition shadow-sm"
          >
            થઈ ગયું / Done
          </button>
        </div>
      </div>
    </div>
  );
};
