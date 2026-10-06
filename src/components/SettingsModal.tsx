import React, { useState } from 'react';
import { 
  SlidersHorizontal,
  Languages,
  X, 
  Check,
  Download, 
  RefreshCw, 
  Bell, 
  Clock, 
  Type, 
  RotateCcw, 
  Sun,
  Moon,
  Sparkles,
  BookmarkCheck,
  ChevronDown,
  CheckCircle2,
  Minus,
  Plus,
  Users,
  Share2
} from 'lucide-react';
import { ShareAppModal } from './ShareAppModal';
import { UserPreferences, ThemeMode, SanskritScript, Language } from '../types';
import { StorageService, AVAILABLE_LANGUAGE_PACKS } from '../utils/storage';
import { NotificationService } from '../utils/notificationService';
import { getUIStrings } from '../utils/i18n';
import { useAppUpdate } from '../hooks/useAppUpdate';
import { CURRENT_APP_VERSION } from '../version';
import { useHitCounter } from '../utils/hitCounter';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onResetPreferences: () => void;
}

// 16 Supported Languages with authentic native titles and descriptions matching screenshot
const LANGUAGE_GRID_OPTIONS: Array<{
  id: Language;
  title: string;
  subtitle: string;
}> = [
  { id: 'gujarati', title: 'ગુજરાતી', subtitle: 'ગુજરાતી (મૂળ)' },
  { id: 'hindi', title: 'हिन्दी', subtitle: 'हिन्दी भावार्थ' },
  { id: 'english', title: 'English', subtitle: 'English Meaning' },
  { id: 'marathi', title: 'मराठी', subtitle: 'मराठी अनुवाद' },
  { id: 'bengali', title: 'বাংলা', subtitle: 'বাংলা अनुवाद' },
  { id: 'tamil', title: 'தமிழ்', subtitle: 'தமிழ் விளக்கம்' },
  { id: 'telugu', title: 'తెలుగు', subtitle: 'తెలుగు భావార్థం' },
  { id: 'kannada', title: 'ಕನ್ನಡ', subtitle: 'ಕನ್ನಡ ಭಾವಾರ್ಥ' },
  { id: 'punjabi', title: 'ਪੰਜਾਬੀ', subtitle: 'ਪੰਜਾਬੀ ਅਨੁਵਾਦ' },
  { id: 'spanish', title: 'Español', subtitle: 'Español' },
  { id: 'french', title: 'Français', subtitle: 'Français' },
  { id: 'german', title: 'Deutsch', subtitle: 'Deutsch' },
  { id: 'portuguese', title: 'Português', subtitle: 'Português' },
  { id: 'russian', title: 'Русский', subtitle: 'Русский' },
  { id: 'greek', title: 'Ελληνικά', subtitle: 'Ελληνικά' },
  { id: 'polish', title: 'Polski', subtitle: 'Polski' }
];

// Helper to format 24h time to 12h AM/PM
function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr) return '07:40 PM';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hour = parseInt(parts[0], 10);
  const min = parts[1].padStart(2, '0');
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;
}

// Convert 12h time back to HH:mm for <input type="time" />
function convertTo24Hour(time12h: string): string {
  if (!time12h) return '19:40';
  if (!time12h.includes('AM') && !time12h.includes('PM')) return time12h;
  const [time, modifier] = time12h.split(' ');
  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  if (hours === 12 && modifier === 'AM') hours = 0;
  if (hours < 12 && modifier === 'PM') hours += 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Warm Brown/Amber Satsang Diksha Toggle Switch
const WarmToggleSwitch: React.FC<{ 
  checked: boolean; 
  onChange: (val: boolean) => void; 
  id?: string;
  label?: string;
}> = ({ checked, onChange, id, label }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-[#7A1D05]' : 'bg-[#E5DACE] dark:bg-[#382E26]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onResetPreferences
}) => {
  const {
    updateAvailable,
    remoteVersion,
    isChecking: isCheckingUpdate,
    checkStatusMessage,
    checkForUpdates,
    applyUpdate
  } = useAppUpdate();

  const [updatingApp, setUpdatingApp] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);
  const [downloadingPackLang, setDownloadingPackLang] = useState<Language | null>(null);
  const [packDownloadMessage, setPackDownloadMessage] = useState<string | null>(null);

  // Anonymous Aggregate Hit Counter
  const { count: hitCount, isLoading: isHitLoading, refresh: refreshHits } = useHitCounter();

  // Share App Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const ui = getUIStrings(preferences.activeLanguage);

  if (!isOpen) return null;

  // Selected language pack details
  const selectedLangOption = LANGUAGE_GRID_OPTIONS.find(l => l.id === preferences.activeLanguage);
  const selectedLangPack = AVAILABLE_LANGUAGE_PACKS.find(p => p.id === preferences.activeLanguage);
  const packSizeMb = selectedLangPack?.sizeMb || 1.8;
  const isLangPackInstalled = (preferences.installedLanguagePacks || ['gujarati', 'hindi', 'english']).includes(preferences.activeLanguage);

  // Handle language pack download for offline use
  const handleDownloadPack = (lang: Language) => {
    setDownloadingPackLang(lang);
    setPackDownloadMessage(null);
    setTimeout(() => {
      const updated = StorageService.installLanguagePack(lang);
      onUpdatePreferences({ installedLanguagePacks: updated });
      setDownloadingPackLang(null);
      const langObj = LANGUAGE_GRID_OPTIONS.find(l => l.id === lang);
      setPackDownloadMessage(`${langObj?.title || lang} ઑફલાઇન પેક સફળતાપૂર્વક સાચવવામાં આવ્યું છે! ✓`);
      setTimeout(() => setPackDownloadMessage(null), 4000);
    }, 700);
  };

  // Handle App Update check or apply
  const handleUpdateApp = async () => {
    if (updateAvailable) {
      setUpdatingApp(true);
      await applyUpdate();
    } else {
      setUpdatingApp(true);
      try {
        const found = await checkForUpdates(false);
        if (found) {
          setUpdateSuccess('નવું સંસ્કરણ ઉપલબ્ધ છે! કૃપા કરીને અપડેટ કરો.');
        }
      } catch {
        setUpdateSuccess('અપડેટ તપાસવામાં નિષ્ફળતા આવી. કૃપા કરીને પુનઃ પ્રયાસ કરો.');
      } finally {
        setUpdatingApp(false);
      }
    }
  };

  // Test Notification
  const handleTestNotification = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      NotificationService.sendNotification('સત્સંગ દીક્ષા સ્વાધ્યાય રીમાઇન્ડર', {
        body: `નિયમ શ્લોક પાઠ અને મુખપાઠ કરવાનો સમય થયો છે. (${formatTimeTo12Hour(preferences.reminder?.time)})`,
        icon: '/icon-192.png'
      });
      setTestNotificationStatus('નોટિફિકેશન સફળતાપૂર્વક મોકલાઈ ગયું! ✓');
    } else {
      setTestNotificationStatus('કૃપા કરીને બ્રાઉઝરમાં નોટિફિકેશન પરવાનગી આપો.');
    }
    setTimeout(() => setTestNotificationStatus(null), 3500);
  };

  return (
    <div 
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="settings-modal-container"
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all border ${
          preferences.theme === 'dark'
            ? 'bg-[#1A1410] border-stone-800 text-stone-100'
            : 'bg-[#FAF5EC] border-[#ECD8BE] text-[#2D1A0E]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            TOP HEADER BAR (Matching Reference Screenshot)
            Rich gradient: Deep russet to golden amber with round yellow icon
            ========================================================= */}
        <div 
          id="settings-top-bar"
          className="bg-gradient-to-r from-[#6E1803] via-[#852305] to-[#B35800] px-4 sm:px-5 py-3.5 flex items-center justify-between text-white flex-shrink-0 shadow-md select-none"
        >
          <div className="flex items-center gap-3.5">
            {/* Yellow / Golden Round Badge with Sliders Icon */}
            <div 
              id="settings-header-icon"
              className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#6E1803] shadow-sm flex-shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-tight">
                {ui.settingsTitle}
              </h2>
              <p className="text-[11.5px] sm:text-[12px] text-amber-200/95 font-medium leading-tight mt-0.5">
                {ui.settingsSubtitle}
              </p>
            </div>
          </div>

          {/* Close Button: Circular translucent matching screenshot */}
          <button
            id="settings-close-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* =========================================================
            SCROLLABLE CONTENT BODY
            Warm cream cards with golden-amber borders
            ========================================================= */}
        <div 
          id="settings-scroll-body"
          className="p-3.5 sm:p-5 space-y-4 overflow-y-auto flex-1 text-[#2D1A0E] dark:text-[#E8DDD1]"
        >

          {/* =========================================================
              CARD 1: મુખ્ય અનુવાદ ભાષા (Primary Meaning Language)
              Compact Drop-down Selector + Offline Pack Download Option
              ========================================================= */}
          <div 
            id="card-primary-language"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            {/* Header row with Languages icon */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <Languages className="w-5 h-5 text-[#B85D00] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    {ui.primaryLanguageTitle}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                    {ui.primaryLanguageDesc}
                  </p>
                </div>
              </div>

              {/* Active Badge */}
              <span className="shrink-0 hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-[#7A1D05] dark:text-amber-300 font-bold border border-amber-300/50">
                {selectedLangOption?.title || preferences.activeLanguage}
              </span>
            </div>

            {/* Compact Dropdown & Offline Download Action Row */}
            <div className="pt-0.5 flex flex-col sm:flex-row sm:items-center gap-2.5">
              {/* Dropdown Selector */}
              <div className="relative flex-1">
                <select
                  id="select-primary-language"
                  value={preferences.activeLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    onUpdatePreferences({ 
                      activeLanguage: newLang,
                      appLanguage: newLang 
                    });
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl bg-white dark:bg-[#181310] border-2 border-[#EADBCC] dark:border-stone-700 text-[#2D1A0E] dark:text-stone-100 text-sm font-semibold focus:outline-none focus:border-[#7A1D05] dark:focus:border-amber-500 shadow-2xs cursor-pointer"
                >
                  {LANGUAGE_GRID_OPTIONS.map((item) => (
                    <option key={item.id} value={item.id} className="text-[#2D1A0E] dark:text-stone-100 py-1.5 bg-white dark:bg-[#201915]">
                      {item.title} — {item.subtitle}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7A1D05] dark:text-amber-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Offline Pack Download / Installed Badge Button */}
              <div className="shrink-0 flex items-center">
                {isLangPackInstalled ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadPack(preferences.activeLanguage)}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs"
                    title="ઑફલાઇન પેક તૈયાર છે (Offline Pack Ready)"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{ui.offlineReadyBadge || 'ઑફલાઇન તૈયાર (Ready)'}</span>
                    <span className="text-[10.5px] text-emerald-700/80 dark:text-emerald-400/80 font-mono">({packSizeMb} MB)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={downloadingPackLang === preferences.activeLanguage}
                    onClick={() => handleDownloadPack(preferences.activeLanguage)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs disabled:opacity-75"
                  >
                    {downloadingPackLang === preferences.activeLanguage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{ui.installingButton || 'ડાઉનલોડ...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{ui.installButton || 'ઑફલાઇન ડાઉનલોડ'}</span>
                        <span className="text-[10.5px] opacity-85 font-mono">({packSizeMb} MB)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Notification Banner when pack is downloaded */}
            {packDownloadMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{packDownloadMessage}</span>
              </div>
            )}
          </div>

          {/* =========================================================
              CARD 2: વાંચન & લિપિ સેટિંગ્સ (Sanskrit Script & Display)
              Warm card matching the palette
              ========================================================= */}
          <div 
            id="card-script-display"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            {/* Sanskrit Script Dropdown Menu */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#B85D00]" />
                  <span className="font-bold text-[14.5px] sm:text-[15px] text-[#7A1D05] dark:text-amber-300">
                    {ui.sanskritScriptTitle}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/60">
                  Default: દેવનાગરી
                </span>
              </div>
              <div className="relative">
                <select
                  id="select-sanskrit-script"
                  value={preferences.sanskritScript}
                  onChange={(e) => onUpdatePreferences({ sanskritScript: e.target.value as SanskritScript })}
                  className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-[#EADBCC] dark:border-stone-700 bg-white dark:bg-[#181310] text-[#7A1D05] dark:text-amber-200 font-bold text-sm focus:outline-none focus:border-[#7A1D05] cursor-pointer shadow-2xs pr-10"
                >
                  <option value="devanagari">દેવનાગરી (Devanagari - Default)</option>
                  <option value="gujarati">ગુજરાતી લિપિ (Gujarati Script)</option>
                  <option value="iast">રોમન લિપિ (Roman IAST Script)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7A1D05] dark:text-amber-300">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Auto Swipe On Read */}
            <div 
              className="pt-3 border-t border-[#F5E6CE] dark:border-stone-800 flex items-center justify-between cursor-pointer"
              onClick={() => onUpdatePreferences({ autoSwipeOnRead: !preferences.autoSwipeOnRead })}
            >
              <div>
                <span className="font-bold text-[14px] text-[#7A1D05] dark:text-amber-300 block">
                  'વાંચ્યું' ક્લિક કરતાં આગળનો શ્લોક (Auto Swipe)
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  શ્લોક પૂર્ણ થયા પછી આપોઆપ આગળ વધવું
                </span>
              </div>
              <WarmToggleSwitch
                id="toggle-auto-swipe"
                checked={!!preferences.autoSwipeOnRead}
                onChange={(val) => onUpdatePreferences({ autoSwipeOnRead: val })}
                label="Auto Swipe"
              />
            </div>

            {/* Auto Swipe Verses while listening */}
            <div 
              className="pt-3 border-t border-[#F5E6CE] dark:border-stone-800 flex items-center justify-between cursor-pointer"
              onClick={() => onUpdatePreferences({ autoSwipeWhileListening: !(preferences.autoSwipeWhileListening ?? true) })}
            >
              <div>
                <span className="font-bold text-[14px] text-[#7A1D05] dark:text-amber-300 block">
                  ઓડિયો શ્રવણ વખતે આપોઆપ આગળ વધવું (Auto swipe Verses while listening)
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  ઉદ્ગાન ઓડિયો પૂર્ણ થતાં પછીનો શ્લોક આપોઆપ શરૂ કરવો
                </span>
              </div>
              <WarmToggleSwitch
                id="toggle-auto-swipe-listening"
                checked={preferences.autoSwipeWhileListening !== false}
                onChange={(val) => onUpdatePreferences({ autoSwipeWhileListening: val })}
                label="Auto swipe while listening"
              />
            </div>
          </div>

          {/* =========================================================
              CARD: અક્ષર કદ (Font Size Settings - Outside layout group)
              ========================================================= */}
          <div 
            id="card-font-size-settings"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-[14.5px] text-[#7A1D05] dark:text-amber-300 block">
                {ui.fontSizeTitle || 'અક્ષર કદ (Font Size)'}
              </span>
              <span className="text-xs text-[#785E4F] dark:text-stone-400">
                વાંચન માટે અક્ષરોનું માપ વધારો કે ઘટાડો ({preferences.fontSize || 18} px)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ fontSize: Math.max(14, (preferences.fontSize || 18) - 2) })}
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 cursor-pointer flex items-center justify-center text-sm shadow-2xs active:scale-95"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-sm font-bold w-9 text-center text-[#7A1D05] dark:text-amber-200">
                {preferences.fontSize || 18}
              </span>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ fontSize: Math.min(28, (preferences.fontSize || 18) + 2) })}
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 cursor-pointer flex items-center justify-center text-sm shadow-2xs active:scale-95"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          {/* =========================================================
              CARD 3: દૈનિક સ્વાધ્યાય & રીમાઇન્ડર (Daily Target & Reminder)
              Streamlined, concise, non-repeating
              ========================================================= */}
          <div 
            id="card-daily-target-reminder"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            {/* Unified Card Header */}
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#B85D00] flex-shrink-0" />
              <h3 className="font-bold text-[15.5px] sm:text-[16.5px] text-[#7A1D05] dark:text-amber-300">
                દૈનિક સ્વાધ્યાય & રીમાઇન્ડર (Daily Target & Reminder)
              </h3>
            </div>

            {/* Shloka Target Selection: 1/315 Stepper, Slider & Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#785E4F] dark:text-stone-300">
                  શ્લોક લક્ષ્યાંક (Study Goal):
                </span>
                <span className="text-xs font-bold text-[#7A1D05] dark:text-amber-400 font-mono bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-800">
                  {preferences.dailyGoal || 1} / 315 શ્લોક
                </span>
              </div>

              {/* Stepper + Range Slider + Number Input in 1/315 style */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ dailyGoal: Math.max(1, (preferences.dailyGoal || 1) - 1) })}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 dark:hover:bg-stone-800 cursor-pointer flex items-center justify-center transition shadow-2xs"
                  title="Previous Shloka"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="relative flex-1 flex items-center">
                  <input
                    type="range"
                    min={1}
                    max={315}
                    value={preferences.dailyGoal || 1}
                    onChange={(e) => onUpdatePreferences({ dailyGoal: parseInt(e.target.value, 10) || 1 })}
                    className="w-full h-2 bg-amber-200/60 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#7A1D05]"
                  />
                </div>

                <div className="flex items-center bg-white dark:bg-[#181310] border-2 border-[#EADBCC] dark:border-stone-700 rounded-lg px-2 py-0.5 shadow-2xs focus-within:border-[#7A1D05]">
                  <input
                    type="number"
                    min={1}
                    max={315}
                    value={preferences.dailyGoal || 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        onUpdatePreferences({ dailyGoal: Math.min(315, Math.max(1, val)) });
                      }
                    }}
                    className="w-10 text-center text-xs font-bold text-[#7A1D05] dark:text-amber-300 bg-transparent focus:outline-none"
                  />
                  <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 font-mono">/ 315</span>
                </div>

                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ dailyGoal: Math.min(315, (preferences.dailyGoal || 1) + 1) })}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 dark:hover:bg-stone-800 cursor-pointer flex items-center justify-center transition shadow-2xs"
                  title="Next Shloka"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Shortcuts */}
              <div className="flex items-center justify-between text-[11px] text-[#785E4F] dark:text-stone-400 pt-0.5">
                <span className="text-[10.5px]">ઝડપી લક્ષ્યાંક:</span>
                <div className="flex items-center gap-1">
                  {[1, 5, 11, 21, 315].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onUpdatePreferences({ dailyGoal: preset })}
                      className={`px-2 py-0.5 rounded text-[10.5px] font-medium transition cursor-pointer ${
                        (preferences.dailyGoal || 1) === preset
                          ? 'bg-[#7A1D05] text-white font-bold shadow-2xs'
                          : 'bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#2D1A0E] dark:text-stone-300 hover:border-amber-400'
                      }`}
                    >
                      {preset === 315 ? '315 (સંપૂર્ણ)' : `${preset} શ્લોક`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Reminder Toggle & Time Settings */}
            <div className="pt-3 border-t border-[#F5E6CE] dark:border-stone-800 space-y-2.5">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => onUpdatePreferences({
                  reminder: {
                    ...preferences.reminder,
                    enabled: !preferences.reminder?.enabled
                  }
                })}
              >
                <div>
                  <span className="font-bold text-[14px] text-[#7A1D05] dark:text-amber-300 block">
                    રોજિંદી સૂચના (Daily Reminder)
                  </span>
                  <span className="text-xs text-[#785E4F] dark:text-stone-400">
                    નિયત સમયે સ્વાધ્યાયનું રીમાઇન્ડર મેળવો
                  </span>
                </div>
                <WarmToggleSwitch
                  id="toggle-reminder"
                  checked={!!preferences.reminder?.enabled}
                  onChange={async (val) => {
                    if (val) {
                      await NotificationService.requestPermission();
                    }
                    onUpdatePreferences({
                      reminder: {
                        ...preferences.reminder,
                        enabled: val
                      }
                    });
                  }}
                  label="Daily Reminder"
                />
              </div>

              {preferences.reminder?.enabled && (
                <div className="flex items-center justify-between bg-amber-50/70 dark:bg-stone-900/60 p-2.5 rounded-xl border border-amber-200/80 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7A1D05] dark:text-amber-400" />
                    <span className="text-xs font-semibold text-[#4A2D1B] dark:text-stone-200">
                      સમય (Time):
                    </span>
                    <input
                      type="time"
                      value={convertTo24Hour(preferences.reminder?.time || '07:40 PM')}
                      onChange={(e) => {
                        onUpdatePreferences({
                          reminder: {
                            ...preferences.reminder,
                            time: formatTimeTo12Hour(e.target.value)
                          }
                        });
                      }}
                      className="px-2 py-1 rounded-lg border border-[#EADBCC] dark:border-stone-700 bg-white dark:bg-[#1A1410] text-xs font-bold text-[#2D1A0E] dark:text-stone-100 focus:outline-none focus:border-[#7A1D05]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="px-2.5 py-1.5 rounded-lg bg-[#7A1D05] hover:bg-[#601503] text-white text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    {ui.testNotificationButton || 'ટેસ્ટ સૂચના'}
                  </button>
                </div>
              )}

              {testNotificationStatus && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {testNotificationStatus}
                </p>
              )}
            </div>
          </div>

          {/* =========================================================
              CARD 4: એપ અપડેટ કરો (Update App)
              Clean, compact card with refresh status
              ========================================================= */}
          <div 
            id="card-update-app"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              <RefreshCw className={`w-5 h-5 text-[#B85D00] mt-0.5 flex-shrink-0 ${updatingApp ? 'animate-spin' : ''}`} />
              <div className="flex-1">
                <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                  {ui.updateAppTitle || 'એપ અપડેટ કરો (Update App)'}
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                  {ui.updateAppDesc || 'એપમાં થયેલા તમામ નવા સુધારા અને શ્લોકો મેળવવા માટે અપડેટ કરો.'}
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#F5E6CE] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#7A6250] dark:text-stone-400 flex items-center gap-2">
                <span>{ui.appVersionLabel || 'આવૃત્તિ'}:</span>
                <span className="font-bold text-[#7A1D05] dark:text-amber-300">
                  v{CURRENT_APP_VERSION.version}
                </span>
                {updateAvailable && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 animate-pulse">
                    નવું ઉપલબ્ધ! (v{remoteVersion?.version || '2.5.0'})
                  </span>
                )}
              </div>

              <button
                id="btn-update-app-action"
                type="button"
                onClick={handleUpdateApp}
                disabled={updatingApp || isCheckingUpdate}
                className={`w-full sm:w-auto py-2.5 px-5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-75 ${
                  updateAvailable
                    ? 'bg-emerald-700 hover:bg-emerald-800 ring-2 ring-emerald-400/50'
                    : 'bg-[#7A1D05] hover:bg-[#601503]'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${(updatingApp || isCheckingUpdate) ? 'animate-spin' : ''}`} />
                <span>
                  {updatingApp 
                    ? (ui.updatingAppButton || 'અપડેટ થઈ રહ્યું છે...') 
                    : isCheckingUpdate
                    ? 'તપાસ થઈ રહી છે...'
                    : updateAvailable
                    ? 'હમણાં અપડેટ કરો (Update Now)'
                    : 'અપડેટ્સ માટે તપાસો (Check for Updates)'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#8C7665] dark:text-stone-400 mt-2 italic text-center sm:text-left">
              * જ્યારે પણ તમે ઓનલાઇન હોવ ત્યારે એપ આપોઆપ બેકગ્રાઉન્ડમાં નવા અપડેટ્સ તપાસે છે અને તમને સૂચિત કરે છે.
            </p>

            {(checkStatusMessage || updateSuccess) && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center animate-fadeIn">
                {checkStatusMessage || updateSuccess}
              </div>
            )}
          </div>



          {/* =========================================================
              CARD 5: એપ વપરાશ & મુલાકાતીઓ (Anonymous Hit Counter & GA4)
              Real-time aggregate app visits counter without personal data
              ========================================================= */}
          <div 
            id="card-anonymous-hit-counter"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/70 flex items-center justify-center text-[#7A1D05] dark:text-amber-300 flex-shrink-0 mt-0.5">
                  <Users className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    કુલ એપ મુલાકાતો (App Visits & Access)
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5">
                    ગુમનામ વપરાશકર્તા ગણતરી (Anonymous Hit Counter)
                  </p>
                </div>
              </div>

              {/* Refresh Live Count Button */}
              <button
                type="button"
                onClick={refreshHits}
                disabled={isHitLoading}
                title="રીફ્રેશ કરો (Refresh Count)"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1D05] dark:text-amber-300 border border-amber-200 dark:border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHitLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">રીફ્રેશ</span>
              </button>
            </div>

            {/* Live Count Display Metric */}
            <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#FFF9EE] via-[#FDF5E6] to-[#F5EBD7] dark:from-[#292019] dark:via-[#221B16] dark:to-[#1C1612] border border-[#ECDCC7] dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-[#8C6B52] dark:text-amber-200/80 uppercase tracking-wider block">
                  કુલ એપ એક્સેસ (Total Accesses)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#7A1D05] dark:text-amber-300 tracking-tight font-mono">
                    {isHitLoading ? '...' : hitCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    વખત
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#8C7665] dark:text-stone-400 mt-2.5 leading-relaxed">
              * ૧૦૦% ગોપનીય અને ગુમનામ: કોઈ અંગત માહિતી, નામ, ઈમેલ કે કૂકીઝ એકત્રિત થતી નથી. માત્ર એપ એક્સેસની સંખ્યા ગણવામાં આવે છે.
            </p>
          </div>

          {/* =========================================================
              CARD 6: એપ શેર કરો (Share This App)
              Only in settings matching existing brown/red branding without disclosing link
              ========================================================= */}
          <div 
            id="card-share-app"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/70 flex items-center justify-center text-[#7A1D05] dark:text-amber-300 flex-shrink-0 mt-0.5">
                  <Share2 className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    Share This App
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5">
                    Share with colleagues, tellers, shopkeepers, or friends
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer flex-shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Share App</span>
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================
            BOTTOM FIXED ACTION BAR (Exact Match with Attachment)
            Left: મૂળ સેટિંગ્સ (Reset)
            Center: મુલાકાતીઓ કાઉન્ટર ઇન્ડિકેટર (Visitor Counter)
            Right: સાચવો & બંધ કરો (Save & Close)
            ========================================================= */}
        <div 
          id="settings-bottom-bar"
          className={`border-t px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2 flex-shrink-0 select-none shadow-xs ${
            preferences.theme === 'dark'
              ? 'bg-[#15100C] border-stone-800'
              : 'bg-[#FAF5EC] border-[#ECD8BE]'
          }`}
        >
          {/* Left: મૂળ સેટિંગ્સ (Reset) */}
          <button
            id="btn-reset-settings"
            type="button"
            onClick={() => {
              if (confirm('Reset all settings to default?')) {
                onResetPreferences();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-[#4A2D1B] dark:text-stone-300 hover:text-[#7A1D05] text-sm font-medium transition cursor-pointer py-2 px-1 flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-[#7A1D05] stroke-[2.5]" />
            <span>{ui.resetButton}</span>
          </button>

          {/* Right: સાચવો & બંધ કરો */}
          <button
            id="btn-save-and-close"
            type="button"
            onClick={onClose}
            className="px-5 sm:px-7 py-2.5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-98 flex-shrink-0"
          >
            {ui.saveCloseButton}
          </button>
        </div>

      </div>

      {/* Share This App Modal */}
      <ShareAppModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
};
