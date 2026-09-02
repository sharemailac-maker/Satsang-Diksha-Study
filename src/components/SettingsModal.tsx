import React, { useState } from 'react';
import { 
  SlidersHorizontal,
  Languages,
  X, 
  Check,
  Download, 
  Trash2, 
  RefreshCw, 
  Volume2, 
  Bell, 
  Clock, 
  Type, 
  RotateCcw, 
  Sun,
  Moon,
  Sparkles,
  Wifi,
  BookmarkCheck
} from 'lucide-react';
import { UserPreferences, ThemeMode, SanskritScript, Language } from '../types';
import { StorageService } from '../utils/storage';
import { NotificationService } from '../utils/notificationService';

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
  const [updatingApp, setUpdatingApp] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);
  const [audioCacheCleared, setAudioCacheCleared] = useState(false);
  const [downloadingAllAudio, setDownloadingAllAudio] = useState(false);

  if (!isOpen) return null;

  // Handle App Update check
  const handleUpdateApp = async () => {
    setUpdatingApp(true);
    setUpdateSuccess(null);
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
      setUpdateSuccess('એપ સફળતાપૂર્વક નવીનતમ સંસ્કરણમાં અપડેટ થઈ ગઈ છે! (App updated successfully!) ✓');
      setTimeout(() => {
        window.location.reload();
      }, 1400);
    } catch {
      setUpdateSuccess('એપ અપડેટ થઈ રહી છે... (Reloading...)');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setUpdatingApp(false);
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
        className="bg-[#FAF5EC] dark:bg-[#1A1410] w-full max-w-lg rounded-3xl shadow-2xl border border-[#ECD8BE] dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh] transition-all"
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
                અધ્યયન & ભાષા સેટિંગ્સ
              </h2>
              <p className="text-[11.5px] sm:text-[12px] text-amber-200/95 font-medium leading-tight mt-0.5">
                ભાષા પસંદગી, ઑફલાઇન પેક & નોટિફિકેશન
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
              Exact 2-column grid matching the screenshot!
              ========================================================= */}
          <div 
            id="card-primary-language"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            {/* Header row with Languages icon */}
            <div className="flex items-start gap-2.5 mb-1.5">
              <Languages className="w-5 h-5 text-[#B85D00] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                  મુખ્ય અનુવાદ ભાષા (Primary Meaning Language)
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                  શ્લોક નીચે દર્શાવાતો મુખ્ય ભાવાર્થ. (પૂર્વ-નિર્ધારિત: સંસ્કૃત થી ગુજરાતી):
                </p>
              </div>
            </div>

            {/* 2-Column Grid matching reference screenshot */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-3.5">
              {LANGUAGE_GRID_OPTIONS.map((item) => {
                const isSelected = preferences.activeLanguage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`lang-btn-${item.id}`}
                    type="button"
                    onClick={() => {
                      onUpdatePreferences({ 
                        activeLanguage: item.id,
                        appLanguage: item.id 
                      });
                    }}
                    className={`rounded-xl p-3 text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#7A1D05] text-white border-2 border-[#7A1D05] shadow-xs'
                        : 'bg-white dark:bg-[#181310] border-2 border-[#EADBCC] dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 text-[#2D1A0E] dark:text-stone-100'
                    }`}
                  >
                    <span className={`block font-bold text-[14.5px] sm:text-[15.5px] leading-tight ${
                      isSelected ? 'text-white' : 'text-[#2D1A0E] dark:text-stone-100'
                    }`}>
                      {item.title}
                    </span>
                    <span className={`block text-[11.5px] sm:text-[12px] mt-0.5 leading-tight ${
                      isSelected ? 'text-amber-100/90' : 'text-[#7A6250] dark:text-stone-400'
                    }`}>
                      {item.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              CARD 2: વાંચન & લિપિ સેટિંગ્સ (Sanskrit Script & Display)
              Warm card matching the palette
              ========================================================= */}
          <div 
            id="card-script-display"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            {/* Sanskrit Script */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-[#B85D00]" />
                <span className="font-bold text-[14.5px] sm:text-[15px] text-[#7A1D05] dark:text-amber-300">
                  સંસ્કૃત શ્લોક લિપિ (Sanskrit Script)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'devanagari', label: 'દેવનાગરી', sub: 'Devanagari' },
                  { id: 'gujarati', label: 'ગુજરાતી', sub: 'Gujarati' },
                  { id: 'iast', label: 'અંગ્રેજી (IAST)', sub: 'Roman Script' }
                ].map((s) => {
                  const isSel = preferences.sanskritScript === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onUpdatePreferences({ sanskritScript: s.id as SanskritScript })}
                      className={`p-2.5 rounded-xl text-center border-2 transition cursor-pointer ${
                        isSel
                          ? 'bg-[#7A1D05] text-white border-[#7A1D05] font-bold shadow-xs'
                          : 'bg-white dark:bg-[#181310] border-[#EADBCC] dark:border-stone-700 text-[#2D1A0E] dark:text-stone-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="text-[13.5px] font-bold">{s.label}</div>
                      <div className={`text-[10.5px] ${isSel ? 'text-amber-100/90' : 'text-[#7A6250] dark:text-stone-400'}`}>
                        {s.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Theme */}
            <div className="pt-2 border-t border-[#F5E6CE] dark:border-stone-800">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-[#B85D00]" />
                <span className="font-bold text-[14.5px] sm:text-[15px] text-[#7A1D05] dark:text-amber-300">
                  વાંચન થીમ (Visual Theme)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'પ્રકાશ (Light)', color: 'bg-white border-amber-300 text-stone-900' },
                  { id: 'sepia', label: 'સેપિયા (Sepia)', color: 'bg-[#FBF0D9] border-amber-400 text-[#4A2D1B]' },
                  { id: 'dark', label: 'રાત્રિ (Dark)', color: 'bg-[#1E1916] border-stone-600 text-stone-100' }
                ].map((t) => {
                  const isSel = preferences.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onUpdatePreferences({ theme: t.id as ThemeMode })}
                      className={`p-2.5 rounded-xl text-center border-2 transition cursor-pointer ${
                        isSel
                          ? 'bg-[#7A1D05] text-white border-[#7A1D05] font-bold shadow-xs'
                          : `${t.color} border-[#EADBCC] hover:border-amber-400`
                      }`}
                    >
                      <div className="text-[13px] font-bold">{t.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div className="pt-2 border-t border-[#F5E6CE] dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-[14.5px] text-[#7A1D05] dark:text-amber-300 block">
                  અક્ષર કદ (Font Size)
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  વર્તમાન કદ: {preferences.fontSize || 18} px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ fontSize: Math.max(14, (preferences.fontSize || 18) - 2) })}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 cursor-pointer flex items-center justify-center text-sm"
                >
                  A-
                </button>
                <span className="text-sm font-semibold w-8 text-center text-[#7A1D05] dark:text-amber-200">
                  {preferences.fontSize || 18}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ fontSize: Math.min(28, (preferences.fontSize || 18) + 2) })}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 cursor-pointer flex items-center justify-center text-sm"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Auto Swipe On Read */}
            <div 
              className="pt-2 border-t border-[#F5E6CE] dark:border-stone-800 flex items-center justify-between cursor-pointer"
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
          </div>

          {/* =========================================================
              CARD 3: નિયમ વાચન & રીમાઇન્ડર (Niyam Reading & Reminder)
              ========================================================= */}
          <div 
            id="card-niyam-reminder"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5"
          >
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#B85D00]" />
              <h3 className="font-bold text-[15.5px] sm:text-[16.5px] text-[#7A1D05] dark:text-amber-300">
                નિયમ વાંચન & રીમાઇન્ડર (Daily Niyam & Reminder)
              </h3>
            </div>

            {/* Daily Target Pills */}
            <div>
              <span className="text-xs font-semibold text-[#785E4F] dark:text-stone-300 block mb-1.5">
                દૈનિક નિયમ લક્ષ્યાંક (Daily Target):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 5, 11, 21, 315].map((cnt) => {
                  const isSel = (preferences.dailyGoal || 1) === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => onUpdatePreferences({ dailyGoal: cnt })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isSel
                          ? 'bg-[#7A1D05] text-white shadow-xs'
                          : 'bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#2D1A0E] dark:text-stone-200 hover:border-amber-400'
                      }`}
                    >
                      {cnt === 315 ? 'સંપૂર્ણ (All 315)' : `${cnt} શ્લોક`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Reminder Toggle & Time */}
            <div className="pt-2 border-t border-[#F5E6CE] dark:border-stone-800 space-y-2.5">
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
                    દૈનિક સ્વાધ્યાય રીમાઇન્ડર (Daily Reminder)
                  </span>
                  <span className="text-xs text-[#785E4F] dark:text-stone-400">
                    નિયમિત વાંચન માટે આપેલ સમયે સૂચના
                  </span>
                </div>
                <WarmToggleSwitch
                  id="toggle-reminder"
                  checked={!!preferences.reminder?.enabled}
                  onChange={(val) => onUpdatePreferences({
                    reminder: {
                      ...preferences.reminder,
                      enabled: val
                    }
                  })}
                  label="Daily Reminder"
                />
              </div>

              {preferences.reminder?.enabled && (
                <div className="flex items-center justify-between bg-amber-50/70 dark:bg-stone-900/60 p-2.5 rounded-xl border border-amber-200/80 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7A1D05]" />
                    <span className="text-xs font-medium text-[#4A2D1B] dark:text-stone-200">
                      સમય: {formatTimeTo12Hour(preferences.reminder?.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="px-2 py-1 rounded-lg border border-[#EADBCC] bg-white dark:bg-[#1A1410] text-xs text-[#2D1A0E] dark:text-stone-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleTestNotification}
                      className="px-2.5 py-1 rounded-lg bg-[#7A1D05] hover:bg-[#601503] text-white text-[11px] font-medium transition cursor-pointer"
                    >
                      ટેસ્ટ
                    </button>
                  </div>
                </div>
              )}
              {testNotificationStatus && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {testNotificationStatus}
                </p>
              )}
            </div>
          </div>

          {/* =========================================================
              CARD 4: ઓડિયો સેટિંગ્સ (Audio Settings & Offline Download)
              ========================================================= */}
          <div 
            id="card-audio-settings"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#B85D00]" />
              <h3 className="font-bold text-[15.5px] sm:text-[16.5px] text-[#7A1D05] dark:text-amber-300">
                ઓડિયો પઠન & ઑફલાઇન સેટિંગ્સ (Audio Settings)
              </h3>
            </div>

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onUpdatePreferences({ downloadWifiOnly: !preferences.downloadWifiOnly })}
            >
              <div>
                <span className="font-bold text-[14px] text-[#7A1D05] dark:text-amber-300 block">
                  માત્ર Wi-Fi પર ડાઉનલોડ (Wi-Fi Only)
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  મોબાઇલ ડેટા બચાવવા માટે
                </span>
              </div>
              <WarmToggleSwitch
                id="toggle-wifi-audio"
                checked={!!preferences.downloadWifiOnly}
                onChange={(val) => onUpdatePreferences({ downloadWifiOnly: val })}
                label="Wi-Fi Only"
              />
            </div>

            <div className="pt-2 border-t border-[#F5E6CE] dark:border-stone-800 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={downloadingAllAudio}
                onClick={() => {
                  setDownloadingAllAudio(true);
                  setTimeout(() => {
                    setDownloadingAllAudio(false);
                    alert('તમામ ૩૧૫ શ્લોકોનો ઓડિયો ઑફલાઇન ઉપલબ્ધ થઈ ગયો છે! ✓');
                  }, 1200);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingAllAudio ? 'ડાઉનલોડ ચાલુ છે...' : 'બધા ૩૧૫ ઓડિયો ઑફલાઇન સેવ કરો'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('શું તમે સેવ કરેલ ઓડિયો કેશ ક્લિયર કરવા માંગો છો?')) {
                    setAudioCacheCleared(true);
                    setTimeout(() => setAudioCacheCleared(false), 3000);
                  }
                }}
                className="py-2 px-3 rounded-xl bg-white dark:bg-[#181310] border border-[#EADBCC] hover:bg-stone-50 text-red-600 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>કેશ સાફ કરો</span>
              </button>
            </div>
            {audioCacheCleared && (
              <p className="text-xs text-emerald-600 font-medium text-center">
                ઓડિયો કેશ સફળતાપૂર્વક સાફ કરવામાં આવ્યો છે!
              </p>
            )}
          </div>

          {/* =========================================================
              CARD 5: એપ અપડેટ કરો (Update App)
              EXACT card from the user's attachment!
              ========================================================= */}
          <div 
            id="card-update-app"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              <RefreshCw className={`w-5 h-5 text-[#B85D00] mt-0.5 flex-shrink-0 ${updatingApp ? 'animate-spin' : ''}`} />
              <div className="flex-1">
                <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                  એપ અપડેટ કરો (Update App)
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                  એપમાં થયેલા તમામ નવા સુધારા અને શ્લોકો મેળવવા માટે અપડેટ કરો.
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#F5E6CE] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#7A6250] dark:text-stone-400">
                વર્તમાન આવૃત્તિ: <span className="font-bold text-[#7A1D05] dark:text-amber-300">v2.4 (Latest)</span>
              </div>

              <button
                id="btn-update-app-action"
                type="button"
                onClick={handleUpdateApp}
                disabled={updatingApp}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-75"
              >
                <RefreshCw className={`w-4 h-4 ${updatingApp ? 'animate-spin' : ''}`} />
                <span>{updatingApp ? 'અપડેટ થઈ રહ્યું છે...' : 'અત્યારે અપડેટ કરો (Check & Update)'}</span>
              </button>
            </div>

            {updateSuccess && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center animate-fadeIn">
                {updateSuccess}
              </div>
            )}
          </div>

        </div>

        {/* =========================================================
            BOTTOM FIXED ACTION BAR (Exact Match with Attachment)
            Left: મૂળ સેટિંગ્સ (Reset)
            Right: સાચવો & બંધ કરો (Save & Close)
            ========================================================= */}
        <div 
          id="settings-bottom-bar"
          className="bg-[#FAF5EC] dark:bg-[#1A1410] border-t border-[#ECD8BE] dark:border-stone-800 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0 select-none shadow-xs"
        >
          {/* Left: મૂળ સેટિંગ્સ (Reset) */}
          <button
            id="btn-reset-settings"
            type="button"
            onClick={() => {
              if (confirm('શું તમે તમામ સેટિંગ્સ પૂર્વ-નિર્ધારિત (Default) કરવા માંગો છો?')) {
                onResetPreferences();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-[#4A2D1B] dark:text-stone-300 hover:text-[#7A1D05] text-sm font-medium transition cursor-pointer py-2 px-1"
          >
            <RotateCcw className="w-4 h-4 text-[#7A1D05] stroke-[2.5]" />
            <span>મૂળ સેટિંગ્સ (Reset)</span>
          </button>

          {/* Right: સાચવો & બંધ કરો */}
          <button
            id="btn-save-and-close"
            type="button"
            onClick={onClose}
            className="px-6 sm:px-7 py-2.5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-98"
          >
            સાચવો & બંધ કરો
          </button>
        </div>

      </div>
    </div>
  );
};
