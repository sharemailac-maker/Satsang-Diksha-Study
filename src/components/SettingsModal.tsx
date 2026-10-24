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

// 16 Supported Languages with authentic native titles and descriptions
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

// Multilingual translations for Settings UI
function getSettingsLabels(lang: Language) {
  switch (lang) {
    case 'hindi':
      return {
        settingsTitle: 'अध्ययन एवं भाषा सेटिंग्स',
        settingsSubtitle: 'भाषा चयन, ऑफ़लाइन पैक और सूचनाएं',
        primaryLangTitle: 'मुख्य अनुवाद भाषा',
        primaryLangDesc: 'श्लोक के नीचे प्रदर्शित मुख्य भावार्थ भाषा:',
        offlineReady: 'ऑफ़लाइन तैयार',
        downloadOffline: 'ऑफ़लाइन डाउनलोड',
        downloading: 'डाउनलोड हो रहा है...',
        scriptTitle: 'संस्कृत श्लोक लिपि (Sanskrit Script):',
        defaultScript: 'डिफ़ॉल्ट: देवनागरी',
        optDevanagari: 'देवनागरी (Devanagari - Default)',
        optGujarati: 'गुजराती लिपि (Gujarati Script)',
        optIast: 'रोमन लिपि (Roman IAST Script)',
        autoSwipeReadTitle: "'पढ़ा' क्लिक करने पर अगला श्लोक (Auto Swipe)",
        autoSwipeReadDesc: 'श्लोक पूर्ण होने पर स्वतः आगे बढ़ें',
        autoSwipeListenTitle: 'ऑडियो सुनते समय स्वतः आगे बढ़ें (Auto Swipe Verses)',
        autoSwipeListenDesc: 'उद्गान समाप्त होने पर अगला श्लोक स्वतः प्रारंभ करें',
        fontSizeTitle: 'अक्षर आकार (Font Size)',
        fontSizeDesc: 'पठन हेतु अक्षरों का आकार बढ़ाएं या घटाएं',
        dailyTargetTitle: 'दैनिक स्वाध्याय एवं रिमाइंडर (Daily Target & Reminder)',
        goalLabel: 'श्लोक लक्ष्य (Study Goal):',
        shlokasSuffix: 'श्लोक',
        quickTarget: 'त्वरित लक्ष्य:',
        completeAll: '३१५ (संपूर्ण)',
        dailyReminderTitle: 'दैनिक सूचना (Daily Reminder)',
        dailyReminderDesc: 'नियत समय पर स्वाध्याय का रिमाइंडर प्राप्त करें',
        timeLabel: 'समय (Time):',
        testNotification: 'टेस्ट सूचना भेजें',
        updateAppTitle: 'ऐप अपडेट करें (Update App)',
        updateAppDesc: 'नए सुधार, ताजे श्लोक एवं सुविधाएं प्राप्त करने हेतु अपडेट करें।',
        versionLabel: 'संस्करण',
        newVersionAvailable: 'नया संस्करण उपलब्ध!',
        checkUpdates: 'अपडेट्स जांचें',
        updateNow: 'अभी अपडेट करें',
        checkingUpdates: 'जांच हो रही है...',
        updatingNow: 'अपडेट हो रहा है...',
        updateBgNote: '* ऑनलाइन होने पर ऐप स्वतः पृष्ठभूमि में अपडेट जांचती है।',
        visitsTitle: 'कुल ऐप विज़िट्स (App Visits & Access)',
        visitsSubtitle: 'अनाम उपयोगकर्ता गणना (Anonymous Hit Counter)',
        refreshCount: 'रीफ़्रेश',
        totalAccesses: 'कुल ऐप एक्सेस (Total Accesses)',
        times: 'बार',
        privacyNote: '* १००% गोपनीय एवं अनाम: कोई व्यक्तिगत डेटा या कुकीज़ एकत्र नहीं की जाती हैं।',
        shareTitle: 'यह ऐप शेयर करें (Share This App)',
        shareDesc: 'सत्संगी मित्रों, परिवारजनों एवं परिचितों के साथ शेयर करें',
        shareBtn: 'ऐप शेयर करें',
        resetBtn: 'मूल सेटिंग्स (Reset)',
        saveCloseBtn: 'सहेजें और बंद करें',
        resetConfirm: 'क्या आप सभी सेटिंग्स को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?'
      };
    case 'english':
      return {
        settingsTitle: 'Study & Language Settings',
        settingsSubtitle: 'Language selection, offline packs & notifications',
        primaryLangTitle: 'Primary Meaning Language',
        primaryLangDesc: 'Primary translation displayed below each Sanskrit verse:',
        offlineReady: 'Offline Ready',
        downloadOffline: 'Download Offline',
        downloading: 'Downloading...',
        scriptTitle: 'Default Sanskrit Script:',
        defaultScript: 'Default: Devanagari',
        optDevanagari: 'Devanagari (Default)',
        optGujarati: 'Gujarati Script',
        optIast: 'Roman IAST Script',
        autoSwipeReadTitle: "Auto-advance on 'Read' (Auto Swipe)",
        autoSwipeReadDesc: 'Automatically move to the next verse after finishing',
        autoSwipeListenTitle: 'Auto-advance verses while listening',
        autoSwipeListenDesc: 'Automatically play next verse when chanting concludes',
        fontSizeTitle: 'Text Size (Font Size)',
        fontSizeDesc: 'Adjust reading font size larger or smaller',
        dailyTargetTitle: 'Daily Target & Study Reminder',
        goalLabel: 'Verse Goal (Study Goal):',
        shlokasSuffix: 'Verses',
        quickTarget: 'Quick Target:',
        completeAll: '315 (Complete)',
        dailyReminderTitle: 'Daily Reminder',
        dailyReminderDesc: 'Receive notification to maintain regular daily study',
        timeLabel: 'Time:',
        testNotification: 'Send Test Alert',
        updateAppTitle: 'Update App',
        updateAppDesc: 'Get the latest revisions, authentic scriptures and enhancements.',
        versionLabel: 'Version',
        newVersionAvailable: 'New version available!',
        checkUpdates: 'Check for Updates',
        updateNow: 'Update Now',
        checkingUpdates: 'Checking...',
        updatingNow: 'Updating...',
        updateBgNote: '* When online, the app automatically checks for updates in the background.',
        visitsTitle: 'Total App Accesses',
        visitsSubtitle: 'Anonymous Hit Counter',
        refreshCount: 'Refresh',
        totalAccesses: 'Total App Accesses',
        times: 'times',
        privacyNote: '* 100% private & anonymous: No personal data or tracking cookies collected.',
        shareTitle: 'Share This App',
        shareDesc: 'Share with fellow devotees, friends, and family',
        shareBtn: 'Share App',
        resetBtn: 'Reset Defaults',
        saveCloseBtn: 'Save & Close',
        resetConfirm: 'Reset all settings to default?'
      };
    case 'marathi':
      return {
        settingsTitle: 'अध्ययन आणि भाषा सेटिंग्ज',
        settingsSubtitle: 'भाषा निवड, ऑफलाइन पॅक आणि सूचना',
        primaryLangTitle: 'मुख्य अनुवाद भाषा',
        primaryLangDesc: 'श्लोकाखाली प्रदर्शित होणारा मुख्य भावार्थ:',
        offlineReady: 'ऑफलाइन तयार',
        downloadOffline: 'ऑफलाइन डाउनलोड',
        downloading: 'डाउनलोड होत आहे...',
        scriptTitle: 'संस्कृत श्लोक लिपी:',
        defaultScript: 'डिफॉल्ट: देवनागरी',
        optDevanagari: 'देवनागरी (Devanagari)',
        optGujarati: 'गुजराथी लिपी (Gujarati)',
        optIast: 'रोमन लिपी (Roman IAST)',
        autoSwipeReadTitle: "'वाचले' क्लिक केल्यावर पुढील श्लोक",
        autoSwipeReadDesc: 'श्लोक पूर्ण झाल्यावर आपोआप पुढे जा',
        autoSwipeListenTitle: 'ऑडिओ ऐकताना आपोआप पुढे जा',
        autoSwipeListenDesc: 'उद्गान संपल्यावर पुढील श्लोक सुरू करा',
        fontSizeTitle: 'अक्षर आकार (Font Size)',
        fontSizeDesc: 'वाचनासाठी अक्षरांचा आकार वाढवा किंवा कमी करा',
        dailyTargetTitle: 'दैनिक स्वाध्याय आणि स्मरणपत्र',
        goalLabel: 'श्लोक ध्येय:',
        shlokasSuffix: 'श्लोक',
        quickTarget: 'त्वरित ध्येय:',
        completeAll: '३१५ (संपूर्ण)',
        dailyReminderTitle: 'दैनिक स्मरणपत्र (Daily Reminder)',
        dailyReminderDesc: 'ठरलेल्या वेळी स्वाध्याय स्मरणपत्र मिळवा',
        timeLabel: 'वेळ:',
        testNotification: 'चाचणी सूचना पाठवा',
        updateAppTitle: 'अॅप अपडेट करा',
        updateAppDesc: 'नवीन सुधारणा आणि श्लोक मिळवण्यासाठी अपडेट करा.',
        versionLabel: 'आवृत्ती',
        newVersionAvailable: 'नवीन उपलब्ध!',
        checkUpdates: 'अपडेट्स तपासा',
        updateNow: 'आता अपडेट करा',
        checkingUpdates: 'तपासत आहे...',
        updatingNow: 'अपडेट होत आहे...',
        updateBgNote: '* ऑनलाइन असताना अॅप आपोआप अपडेट्स तपासते.',
        visitsTitle: 'एकूण अॅप प्रवेश',
        visitsSubtitle: 'अनामित वापरकर्ता गणना',
        refreshCount: 'रिफ्रेश',
        totalAccesses: 'एकूण प्रवेश',
        times: 'वेळा',
        privacyNote: '* १००% गोपनीय: कोणतीही वैयक्तिक माहिती गोळा केली जात नाही.',
        shareTitle: 'हे अॅप शेअर करा',
        shareDesc: 'मित्र आणि कुटुंबासह शेअर करा',
        shareBtn: 'शेअर करा',
        resetBtn: 'मूळ सेटिंग्ज',
        saveCloseBtn: 'जतन करा आणि बंद करा',
        resetConfirm: 'सर्व सेटिंग्ज पूर्ववत करायची आहेत का?'
      };
    default:
      // Default: Gujarati
      return {
        settingsTitle: 'અધ્યયન & ભાષા સેટિંગ્સ',
        settingsSubtitle: 'ભાષા પસંદગી, ઑફલાઇન પેક & નોટિફિકેશન',
        primaryLangTitle: 'મુખ્ય અનુવાદ ભાષા (Primary Meaning Language)',
        primaryLangDesc: 'શ્લોક નીચે દર્શાવાતો મુખ્ય ભાવાર્થ. (પૂર્વ-નિર્ધારિત: સંસ્કૃત થી ગુજરાતી):',
        offlineReady: 'ઑફલાઇન તૈયાર (Ready)',
        downloadOffline: 'ઑફલાઇન ડાઉનલોડ',
        downloading: 'ડાઉનલોડ...',
        scriptTitle: 'સંસ્કૃત શ્લોક લિપિ (Default Sanskrit Script):',
        defaultScript: 'Default: દેવનાગરી',
        optDevanagari: 'દેવનાગરી (Devanagari - Default)',
        optGujarati: 'ગુજરાતી લિપિ (Gujarati Script)',
        optIast: 'રોમન લિપિ (Roman IAST Script)',
        autoSwipeReadTitle: "'વાંચ્યું' ક્લિક કરતાં આગળનો શ્લોક (Auto Swipe)",
        autoSwipeReadDesc: 'શ્લોક પૂર્ણ થયા પછી આપોઆપ આગળ વધવું',
        autoSwipeListenTitle: 'ઓડિયો શ્રવણ વખતે આપોઆપ આગળ વધવું (Auto swipe Verses while listening)',
        autoSwipeListenDesc: 'ઉદ્ગાન ઓડિયો પૂર્ણ થતાં પછીનો શ્લોક આપોઆપ શરૂ કરવો',
        fontSizeTitle: 'અક્ષર કદ (Font Size)',
        fontSizeDesc: 'વાંચન માટે અક્ષરોનું માપ વધારો કે ઘટાડો',
        dailyTargetTitle: 'દૈનિક સ્વાધ્યાય & રીમાઇન્ડર (Daily Target & Reminder)',
        goalLabel: 'શ્લોક લક્ષ્યાંક (Study Goal):',
        shlokasSuffix: 'શ્લોક',
        quickTarget: 'ઝડપી લક્ષ્યાંક:',
        completeAll: '315 (સંપૂર્ણ)',
        dailyReminderTitle: 'રોજિંદી સૂચના (Daily Reminder)',
        dailyReminderDesc: 'નિયત સમયે સ્વાધ્યાયનું રીમાઇન્ડર મેળવો',
        timeLabel: 'સમય (Time):',
        testNotification: 'ટેસ્ટ સૂચના',
        updateAppTitle: 'એપ અપડેટ કરો (Update App)',
        updateAppDesc: 'એપમાં થયેલા તમામ નવા સુધારા અને શ્લોકો મેળવવા માટે અપડેટ કરો.',
        versionLabel: 'આવૃત્તિ',
        newVersionAvailable: 'નવું ઉપલબ્ધ!',
        checkUpdates: 'અપડેટ્સ માટે તપાસો (Check for Updates)',
        updateNow: 'હમણાં અપડેટ કરો (Update Now)',
        checkingUpdates: 'તપાસ થઈ રહી છે...',
        updatingNow: 'અપડેટ થઈ રહ્યું છે...',
        updateBgNote: '* જ્યારે પણ તમે ઓનલાઇન હોવ ત્યારે એપ આપોઆપ બેકગ્રાઉન્ડમાં નવા અપડેટ્સ તપાસે છે અને તમને સૂચિત કરે છે.',
        visitsTitle: 'કુલ એપ મુલાકાતો (App Visits & Access)',
        visitsSubtitle: 'ગુમનામ વપરાશકર્તા ગણતરી (Anonymous Hit Counter)',
        refreshCount: 'રીફ્રેશ',
        totalAccesses: 'કુલ એપ એક્સેસ (Total Accesses)',
        times: 'વખત',
        privacyNote: '* ૧૦૦% ગોપનીય અને ગુમનામ: કોઈ અંગત માહિતી, નામ, ઈમેલ કે કૂકીઝ એકત્રિત થતી નથી. માત્ર એપ એક્સેસની સંખ્યા ગણવામાં આવે છે.',
        shareTitle: 'આ એપ શેર કરો (Share This App)',
        shareDesc: 'સહપાઠીઓ, મિત્રો અને સત્સંગી પરિજનો સાથે શેર કરો',
        shareBtn: 'એપ શેર કરો (Share App)',
        resetBtn: 'મૂળ સેટિંગ્સ (Reset)',
        saveCloseBtn: 'સાચવો & બંધ કરો',
        resetConfirm: 'બધા જ સેટિંગ્સ મૂળ સ્થિતિમાં લાવવા માંગો છો?'
      };
  }
}

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
    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

  const lang = preferences.activeLanguage || 'gujarati';
  const s = getSettingsLabels(lang);

  if (!isOpen) return null;

  // Selected language pack details
  const selectedLangOption = LANGUAGE_GRID_OPTIONS.find(l => l.id === preferences.activeLanguage);
  const selectedLangPack = AVAILABLE_LANGUAGE_PACKS.find(p => p.id === preferences.activeLanguage);
  const packSizeMb = selectedLangPack?.sizeMb || 1.8;
  const isLangPackInstalled = (preferences.installedLanguagePacks || ['gujarati', 'hindi', 'english']).includes(preferences.activeLanguage);

  // Handle language pack download for offline use
  const handleDownloadPack = (lKey: Language) => {
    setDownloadingPackLang(lKey);
    setPackDownloadMessage(null);
    setTimeout(() => {
      const updated = StorageService.installLanguagePack(lKey);
      onUpdatePreferences({ installedLanguagePacks: updated });
      setDownloadingPackLang(null);
      const langObj = LANGUAGE_GRID_OPTIONS.find(l => l.id === lKey);
      setPackDownloadMessage(`${langObj?.title || lKey} ✓`);
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
          setUpdateSuccess(s.newVersionAvailable);
        }
      } catch {
        setUpdateSuccess('Update check failed.');
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
      setTestNotificationStatus('Notification sent! ✓');
    } else {
      setTestNotificationStatus('Please allow notification permission.');
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
            TOP HEADER BAR
            ========================================================= */}
        <div 
          id="settings-top-bar"
          className="bg-gradient-to-r from-[#6E1803] via-[#852305] to-[#B35800] px-4 sm:px-5 py-3.5 flex items-center justify-between text-white shrink-0 shadow-md select-none"
        >
          <div className="flex items-center gap-3.5">
            <div 
              id="settings-header-icon"
              className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#6E1803] shadow-sm shrink-0"
            >
              <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-tight">
                {s.settingsTitle}
              </h2>
              <p className="text-[11.5px] sm:text-[12px] text-amber-200/95 font-medium leading-tight mt-0.5">
                {s.settingsSubtitle}
              </p>
            </div>
          </div>

          <button
            id="settings-close-btn"
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* =========================================================
            SCROLLABLE CONTENT BODY
            ========================================================= */}
        <div 
          id="settings-scroll-body"
          className="p-3.5 sm:p-5 space-y-4 overflow-y-auto flex-1 text-[#2D1A0E] dark:text-[#E8DDD1]"
        >

          {/* =========================================================
              CARD 1: મુખ્ય અનુવાદ ભાષા (Primary Meaning Language)
              ========================================================= */}
          <div 
            id="card-primary-language"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <Languages className="w-5 h-5 text-[#B85D00] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    {s.primaryLangTitle}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                    {s.primaryLangDesc}
                  </p>
                </div>
              </div>

              <span className="shrink-0 hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-[#7A1D05] dark:text-amber-300 font-bold border border-amber-300/50">
                {selectedLangOption?.title || preferences.activeLanguage}
              </span>
            </div>

            {/* Dropdown Selector */}
            <div className="pt-0.5 flex flex-col sm:flex-row sm:items-center gap-2.5">
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

              {/* Offline Pack Download Button */}
              <div className="shrink-0 flex items-center">
                {isLangPackInstalled ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadPack(preferences.activeLanguage)}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{s.offlineReady}</span>
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
                        <span>{s.downloading}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{s.downloadOffline}</span>
                        <span className="text-[10.5px] opacity-85 font-mono">({packSizeMb} MB)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {packDownloadMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{packDownloadMessage}</span>
              </div>
            )}
          </div>

          {/* =========================================================
              CARD 2: સંસ્કૃત લિપિ સેટિંગ્સ (Sanskrit Script & Auto Swipe)
              ========================================================= */}
          <div 
            id="card-script-display"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#B85D00]" />
                  <span className="font-bold text-[14.5px] sm:text-[15px] text-[#7A1D05] dark:text-amber-300">
                    {s.scriptTitle}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/60">
                  {s.defaultScript}
                </span>
              </div>
              <div className="relative">
                <select
                  id="select-sanskrit-script"
                  value={preferences.sanskritScript}
                  onChange={(e) => onUpdatePreferences({ sanskritScript: e.target.value as SanskritScript })}
                  className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-[#EADBCC] dark:border-stone-700 bg-white dark:bg-[#181310] text-[#7A1D05] dark:text-amber-200 font-bold text-sm focus:outline-none focus:border-[#7A1D05] cursor-pointer shadow-2xs pr-10"
                >
                  <option value="devanagari">{s.optDevanagari}</option>
                  <option value="gujarati">{s.optGujarati}</option>
                  <option value="iast">{s.optIast}</option>
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
                  {s.autoSwipeReadTitle}
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  {s.autoSwipeReadDesc}
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
                  {s.autoSwipeListenTitle}
                </span>
                <span className="text-xs text-[#785E4F] dark:text-stone-400">
                  {s.autoSwipeListenDesc}
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
              CARD 3: અક્ષર કદ (Font Size Settings)
              ========================================================= */}
          <div 
            id="card-font-size-settings"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-[14.5px] text-[#7A1D05] dark:text-amber-300 block">
                {s.fontSizeTitle}
              </span>
              <span className="text-xs text-[#785E4F] dark:text-stone-400">
                {s.fontSizeDesc} ({preferences.fontSize || 18} px)
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
              CARD 4: દૈનિક સ્વાધ્યાય & રીમાઇન્ડર (Daily Target & Reminder)
              ========================================================= */}
          <div 
            id="card-daily-target-reminder"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-[#B85D00] shrink-0" />
              <h3 className="font-bold text-[15.5px] sm:text-[16.5px] text-[#7A1D05] dark:text-amber-300">
                {s.dailyTargetTitle}
              </h3>
            </div>

            {/* Shloka Target Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#785E4F] dark:text-stone-300">
                  {s.goalLabel}
                </span>
                <span className="text-xs font-bold text-[#7A1D05] dark:text-amber-400 font-mono bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-800">
                  {preferences.dailyGoal || 1} / 315 {s.shlokasSuffix}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ dailyGoal: Math.max(1, (preferences.dailyGoal || 1) - 1) })}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#181310] border border-[#EADBCC] dark:border-stone-700 text-[#7A1D05] dark:text-amber-300 font-bold hover:bg-amber-50 dark:hover:bg-stone-800 cursor-pointer flex items-center justify-center transition shadow-2xs"
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
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center justify-between text-[11px] text-[#785E4F] dark:text-stone-400 pt-0.5">
                <span className="text-[10.5px]">{s.quickTarget}</span>
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
                      {preset === 315 ? s.completeAll : `${preset} ${s.shlokasSuffix}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Reminder Toggle & Time */}
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
                    {s.dailyReminderTitle}
                  </span>
                  <span className="text-xs text-[#785E4F] dark:text-stone-400">
                    {s.dailyReminderDesc}
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
                      {s.timeLabel}
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
                    {s.testNotification}
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
              CARD 5: એપ અપડેટ કરો (Update App)
              ========================================================= */}
          <div 
            id="card-update-app"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              <RefreshCw className={`w-5 h-5 text-[#B85D00] mt-0.5 shrink-0 ${updatingApp ? 'animate-spin' : ''}`} />
              <div className="flex-1">
                <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                  {s.updateAppTitle}
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5 leading-normal">
                  {s.updateAppDesc}
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#F5E6CE] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#7A6250] dark:text-stone-400 flex items-center gap-2">
                <span>{s.versionLabel}:</span>
                <span className="font-bold text-[#7A1D05] dark:text-amber-300">
                  v{CURRENT_APP_VERSION.version}
                </span>
                {updateAvailable && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 animate-pulse">
                    {s.newVersionAvailable}
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
                    ? s.updatingNow 
                    : isCheckingUpdate
                    ? s.checkingUpdates
                    : updateAvailable
                    ? s.updateNow
                    : s.checkUpdates}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#8C7665] dark:text-stone-400 mt-2 italic text-center sm:text-left">
              {s.updateBgNote}
            </p>

            {(checkStatusMessage || updateSuccess) && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center animate-fadeIn">
                {checkStatusMessage || updateSuccess}
              </div>
            )}
          </div>

          {/* =========================================================
              CARD 6: એપ મુલાકાતો (Anonymous Hit Counter)
              ========================================================= */}
          <div 
            id="card-anonymous-hit-counter"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/70 flex items-center justify-center text-[#7A1D05] dark:text-amber-300 shrink-0 mt-0.5">
                  <Users className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    {s.visitsTitle}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5">
                    {s.visitsSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={refreshHits}
                disabled={isHitLoading}
                title={s.refreshCount}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1D05] dark:text-amber-300 border border-amber-200 dark:border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHitLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{s.refreshCount}</span>
              </button>
            </div>

            <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#FFF9EE] via-[#FDF5E6] to-[#F5EBD7] dark:from-[#292019] dark:via-[#221B16] dark:to-[#1C1612] border border-[#ECDCC7] dark:border-stone-800 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-[#8C6B52] dark:text-amber-200/80 uppercase tracking-wider block">
                  {s.totalAccesses}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#7A1D05] dark:text-amber-300 tracking-tight font-mono">
                    {isHitLoading ? '...' : hitCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {s.times}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#8C7665] dark:text-stone-400 mt-2.5 leading-relaxed">
              {s.privacyNote}
            </p>
          </div>

          {/* =========================================================
              CARD 7: એપ શેર કરો (Share This App)
              ========================================================= */}
          <div 
            id="card-share-app"
            className="border-2 border-[#F6DEAC] dark:border-amber-900/40 bg-[#FFFDF7] dark:bg-[#201915] rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/70 flex items-center justify-center text-[#7A1D05] dark:text-amber-300 shrink-0 mt-0.5">
                  <Share2 className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#7A1D05] dark:text-amber-300 leading-snug">
                    {s.shareTitle}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#785E4F] dark:text-stone-300 mt-0.5">
                    {s.shareDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>{s.shareBtn}</span>
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================
            BOTTOM FIXED ACTION BAR
            ========================================================= */}
        <div 
          id="settings-bottom-bar"
          className={`border-t px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2 shrink-0 select-none shadow-xs ${
            preferences.theme === 'dark'
              ? 'bg-[#15100C] border-stone-800'
              : 'bg-[#FAF5EC] border-[#ECD8BE]'
          }`}
        >
          <button
            id="btn-reset-settings"
            type="button"
            onClick={() => {
              if (confirm(s.resetConfirm)) {
                onResetPreferences();
                onClose();
              }
            }}
            className="flex items-center gap-2 text-[#4A2D1B] dark:text-stone-300 hover:text-[#7A1D05] text-sm font-medium transition cursor-pointer py-2 px-1 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-[#7A1D05] stroke-[2.5]" />
            <span>{s.resetBtn}</span>
          </button>

          <button
            id="btn-save-and-close"
            type="button"
            onClick={onClose}
            className="px-5 sm:px-7 py-2.5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-98 shrink-0"
          >
            {s.saveCloseBtn}
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
