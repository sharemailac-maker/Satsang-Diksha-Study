import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Sun, 
  Moon, 
  RotateCcw, 
  Sliders, 
  Shield, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Smartphone,
  Trash2,
  Languages,
  Bell,
  Clock,
  RefreshCw
} from 'lucide-react';
import { UserPreferences, ThemeMode, SanskritScript, Language } from '../types';
import { AVAILABLE_LANGUAGE_PACKS, StorageService } from '../utils/storage';
import { NotificationService } from '../utils/notificationService';
import { getUIStrings } from '../utils/i18n';

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
  const [downloadingPack, setDownloadingPack] = useState<Language | null>(null);
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);
  const [updatingApp, setUpdatingApp] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const ui = getUIStrings(preferences.activeLanguage);

  // Handle installing/downloading language pack
  const handleInstallPack = (packId: Language) => {
    setDownloadingPack(packId);
    setTimeout(() => {
      const updated = StorageService.installLanguagePack(packId);
      onUpdatePreferences({ installedLanguagePacks: updated });
      setDownloadingPack(null);
    }, 600);
  };

  // Handle removing language pack
  const handleUninstallPack = (packId: Language) => {
    if (packId === 'gujarati') return; // Cannot uninstall core Gujarati pack
    const updated = StorageService.uninstallLanguagePack(packId);
    onUpdatePreferences({ installedLanguagePacks: updated });
  };

  // Test Notification handler
  const handleTestNotification = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      NotificationService.sendNotification('સત્સંગ દીક્ષા સ્વાધ્યાય સમય (Daily Study Reminder)', {
        body: `સમય થયો છે સત્સંગ દીક્ષા અધ્યયન અને મુખપાઠ સાધના કરવાનો... (દરરોજ સાંજે ${preferences.reminder.time} IST)`,
        icon: '/icon-192.png'
      });
      setTestNotificationStatus('Notification sent successfully! ✓');
    } else {
      setTestNotificationStatus('Please enable notifications in your browser/device settings.');
    }
    setTimeout(() => setTestNotificationStatus(null), 4000);
  };

  // Update App handler
  const handleUpdateApp = async () => {
    setUpdatingApp(true);
    try {
      // Clear cache if service worker is present
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
      setUpdateSuccess(
        preferences.activeLanguage === 'hindi'
          ? 'ऐप नवीनतम संस्करण में सफलतापूर्वक अपडेट हो गया है! ✓'
          : preferences.activeLanguage === 'english'
          ? 'App successfully updated to the latest version! ✓'
          : 'એપ સફળતાપૂર્વક નવીનતમ આવૃત્તિમાં અપડેટ થઈ ગઈ છે! ✓'
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      window.location.reload();
    } finally {
      setUpdatingApp(false);
    }
  };

  const singleLanguages: { id: Language; labelGu: string; labelEn: string; native: string }[] = [
    { id: 'gujarati', labelGu: 'ગુજરાતી (મૂળ)', labelEn: 'Gujarati (Default)', native: 'ગુજરાતી' },
    { id: 'hindi', labelGu: 'हिन्दी भावार्थ', labelEn: 'Hindi', native: 'हिन्दी' },
    { id: 'english', labelGu: 'English Meaning', labelEn: 'English', native: 'English' },
    { id: 'marathi', labelGu: 'मराठी अनुवाद', labelEn: 'Marathi', native: 'मराठी' },
    { id: 'bengali', labelGu: 'বাংলা অনুবাদ', labelEn: 'Bengali', native: 'বাংলা' },
    { id: 'tamil', labelGu: 'தமிழ் விளக்கம்', labelEn: 'Tamil', native: 'தமிழ்' },
    { id: 'telugu', labelGu: 'తెలుగు భావార్థం', labelEn: 'Telugu', native: 'తెలుగు' },
    { id: 'kannada', labelGu: 'ಕನ್ನಡ ಭಾವಾರ್ಥ', labelEn: 'Kannada', native: 'ಕನ್ನಡ' },
    { id: 'punjabi', labelGu: 'ਪੰਜਾਬੀ ਅਨੁਵਾਦ', labelEn: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { id: 'spanish', labelGu: 'Español', labelEn: 'Spanish', native: 'Español' },
    { id: 'french', labelGu: 'Français', labelEn: 'French', native: 'Français' },
    { id: 'german', labelGu: 'Deutsch', labelEn: 'German', native: 'Deutsch' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Sacred Maroon Gradient */}
        <div className="bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-inner">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-50">
                {ui.settingsTitle}
              </h3>
              <p className="text-[11px] text-amber-200/80">
                {ui.settingsSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#2D241E] dark:text-[#EDE5D8]">
          
          {/* 1. SINGLE LANGUAGE SELECTION */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-[#2A221C] border-2 border-amber-300/50 dark:border-amber-700/40">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#8B2500] dark:text-amber-300">
              <Languages className="w-5 h-5 text-amber-600" />
              <span>{ui.primaryLanguageTitle}</span>
            </div>
            <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
              {ui.primaryLanguageDesc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {singleLanguages.map(langItem => (
                <button
                  key={langItem.id}
                  onClick={() => onUpdatePreferences({ activeLanguage: langItem.id, secondaryLanguages: [] })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    preferences.activeLanguage === langItem.id
                      ? 'bg-[#8B2500] text-amber-50 border-[#8B2500] font-bold shadow-xs'
                      : 'bg-white dark:bg-[#241E18] text-[#4A3E34] dark:text-[#C5B7A8] border-amber-200 dark:border-amber-800/40 hover:bg-amber-100/60'
                  }`}
                >
                  <div className="font-bold text-xs">{langItem.native}</div>
                  <div className="text-[10px] opacity-80">{langItem.labelGu}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. UPDATE APP / એપ અપડેટ કરો */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-[#8B2500] dark:text-amber-300">
                <RefreshCw className={`w-4 h-4 text-amber-600 ${updatingApp ? 'animate-spin' : ''}`} />
                <span>
                  {preferences.activeLanguage === 'hindi' ? 'ऐप अपडेट करें (Update App)' : preferences.activeLanguage === 'english' ? 'Update App' : 'એપ અપડેટ કરો (Update App)'}
                </span>
              </div>
              <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                {preferences.activeLanguage === 'hindi' 
                  ? 'ऐप के नवीनतम सुधार और श्लोक तुरंत लोड करने के लिए अपडेट करें।' 
                  : preferences.activeLanguage === 'english'
                  ? 'Reload app to fetch the latest shlokas and updates immediately.'
                  : 'એપમાં થયેલા તમામ નવા સુધારા અને શ્લોકો મેળવવા માટે અપડેટ કરો.'}
              </p>
              {updateSuccess && (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {updateSuccess}
                </div>
              )}
            </div>

            <button
              onClick={handleUpdateApp}
              disabled={updatingApp}
              className="px-4 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updatingApp ? 'animate-spin' : ''}`} />
              <span>
                {updatingApp 
                  ? (preferences.activeLanguage === 'hindi' ? 'अपडेट हो रहा है...' : 'અપડેટ થઈ રહ્યું છે...') 
                  : (preferences.activeLanguage === 'hindi' ? 'अपडेट करें' : preferences.activeLanguage === 'english' ? 'Update Now' : 'એપ અપડેટ કરો')}
              </span>
            </button>
          </div>

          {/* 3. DAILY REMINDER NOTIFICATION SETTINGS */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-[#2A221C] border-2 border-amber-300/50 dark:border-amber-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#8B2500] dark:text-amber-300">
                <Bell className="w-5 h-5 text-[#8B2500] dark:text-amber-400" />
                <span>{ui.dailyReminderTitle}</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.reminder.enabled}
                onChange={(e) => onUpdatePreferences({
                  reminder: {
                    ...preferences.reminder,
                    enabled: e.target.checked
                  }
                })}
                className="w-5 h-5 accent-[#8B2500] rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
              {ui.dailyReminderDesc}
            </p>

            {/* Time Picker */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#1F1A16] border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#2D241E] dark:text-[#EDE5D8]">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{ui.reminderTimeLabel}</span>
              </div>
              <input
                type="time"
                value={preferences.reminder.time}
                onChange={(e) => onUpdatePreferences({
                  reminder: {
                    ...preferences.reminder,
                    time: e.target.value
                  }
                })}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-[#2A221C] border border-amber-300 dark:border-amber-700 text-sm font-bold text-[#8B2500] dark:text-amber-300 focus:outline-none"
              />
            </div>

            {/* Test Notification Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <button
                onClick={handleTestNotification}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{ui.testNotificationButton}</span>
              </button>
              {testNotificationStatus && (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {testNotificationStatus}
                </span>
              )}
            </div>
          </div>

          {/* 4. SANSKRIT SCRIPT PREFERENCE */}
          <div className="space-y-2">
            <label className="font-bold text-[#8B2500] dark:text-amber-400 block">
              {ui.sanskritScriptTitle}
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

          {/* 5. THEME SELECTION */}
          <div className="space-y-2">
            <label className="font-bold text-[#8B2500] dark:text-amber-400 block">
              {ui.themeTitle}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: ui.themeLight, desc: 'Warm Ivory' },
                { id: 'sepia', label: ui.themeSepia, desc: 'Palm Leaf' },
                { id: 'dark', label: ui.themeDark, desc: 'Night Comfort' }
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdatePreferences({ theme: th.id as ThemeMode })}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    preferences.theme === th.id
                      ? 'border-[#8B2500] dark:border-amber-400 bg-amber-50 dark:bg-amber-950/40 font-bold text-[#8B2500] dark:text-amber-300'
                      : 'border-[#E8DFD1] dark:border-[#3D342C] bg-[#FAF6F0] dark:bg-[#2C241F]'
                  }`}
                >
                  <div className="font-semibold text-xs">{th.label}</div>
                  <div className="text-[10px] opacity-75">{th.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. FONT SIZE SLIDER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-bold text-[#8B2500] dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Type className="w-4 h-4" />
                <span>{ui.fontSizeTitle}</span>
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
          </div>

          {/* 7. OFFLINE SECURITY GUARANTEE */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300/40 flex items-center gap-2.5 text-[11px] text-emerald-900 dark:text-emerald-200">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{ui.offlineSecurityBadge}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] border-t border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-between">
          <button
            onClick={onResetPreferences}
            className="text-xs text-[#8B2500] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{ui.resetButton}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white text-xs font-bold transition shadow-sm"
          >
            {ui.saveCloseButton}
          </button>
        </div>
      </div>
    </div>
  );
};
