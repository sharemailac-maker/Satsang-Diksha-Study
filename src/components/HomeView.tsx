import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  Link2, 
  Award, 
  Bookmark as BookmarkIcon, 
  Bell, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Compass, 
  Volume2, 
  VolumeX, 
  Share2, 
  Check, 
  Copy,
  Calendar,
  ChevronRight,
  TrendingUp,
  Settings,
  Download
} from 'lucide-react';
import { Shloka, UserPreferences, MukhpathLevel, Chapter } from '../types';
import { CHAPTERS } from '../data/chapters';
import { NotificationService } from '../utils/notificationService';
import appIconImg from '../assets/images/satsang_diksha_akshar_purushottam_logo_1788180536338.jpg';
import bannerImg from '../assets/images/app_banner_1788180199396.jpg';

interface HomeViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  mukhpathRecords: Record<number, { status: MukhpathLevel; recitationCount: number }>;
  totalBookmarks: number;
  onNavigateTab: (tab: string, chapterId?: number | null) => void;
  onSelectShloka: (shlokaId: number) => void;
  onOpenQuickJump: () => void;
  onOpenSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  shlokas,
  preferences,
  onUpdatePreferences,
  mukhpathRecords,
  totalBookmarks,
  onNavigateTab,
  onSelectShloka,
  onOpenQuickJump,
  onOpenSettings
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Calculate today's shloka (e.g. based on day of the year)
  const todayIndex = React.useMemo(() => {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = Date.now() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return (dayOfYear % 315) + 1;
  }, []);

  const todayShloka = React.useMemo(() => {
    return shlokas.find(s => s.id === todayIndex) || shlokas[0];
  }, [shlokas, todayIndex]);

  // Memorized counts
  const memorizedCount = React.useMemo(() => {
    return Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel; recitationCount: number }) => r.status === 'memorized' || r.status === 'mastered').length;
  }, [mukhpathRecords]);

  const learningCount = React.useMemo(() => {
    return Object.values(mukhpathRecords).filter((r: { status: MukhpathLevel; recitationCount: number }) => r.status === 'learning').length;
  }, [mukhpathRecords]);

  // Audio recitation using SpeechSynthesis
  const handlePlayShlokaAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.lang = 'hi-IN';
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTestReminder = async () => {
    const hasPermission = await NotificationService.requestPermission();
    if (hasPermission) {
      NotificationService.sendNotification('સત્સંગ દીક્ષા સ્વાધ્યાય સમય (Daily Study Reminder)', {
        body: `આજનો પ્રેરક શ્લોક ${todayShloka.id}: "${todayShloka.meaningGu.slice(0, 80)}..."`,
        icon: '/icon-192.png'
      });
      setReminderToast(`નોટિફિકેશન ટેસ્ટ સફળ! દરરોજ સાંજે ${preferences.reminder.time} વાગ્યે રીમાઇન્ડર આવશે.`);
    } else {
      setReminderToast(`નોટિફિકેશન મોકલી શકાયું નથી. કૃપા કરીને બ્રાઉઝરમાં Notification Permission સ્વીકારો.`);
    }
    setTimeout(() => setReminderToast(null), 5000);
  };

  // Primary Study Modules (matching Vachnamrut Study App architecture)
  const studyModules = [
    {
      id: 'reader',
      titleGu: 'શ્લોક અધ્યયન',
      titleHi: 'श्लोक अध्ययन',
      titleEn: 'Shlok Adhyayan (Verses 1-315)',
      subtitleGu: 'સંસ્કૃત શ્લોક, ગુજરાતી-હિન્દી-અંગ્રેજી ભાવાર્થ, પદચ્છેદ અને વ્યાકરણ',
      icon: BookOpen,
      color: 'from-[#8B2500] to-[#B33900]',
      badge: '૩૧૫ શ્લોક',
      count: '315 Verses'
    },
    {
      id: 'mukhpath',
      titleGu: 'મુખપાઠ સાધના',
      titleHi: 'मुखपाठ साधना',
      titleEn: 'Mukhpath Memorization',
      subtitleGu: 'શ્લોકો કંઠસ્થ કરવાની વિશિષ્ટ વૈદિક પદ્ધતિ, શ્રવણ અને કસોટી',
      icon: Sparkles,
      color: 'from-[#B45309] to-[#D97706]',
      badge: `${memorizedCount}/315 પૂર્ણ`,
      count: `${Math.round((memorizedCount / 315) * 100)}%`
    },
    {
      id: 'chapters',
      titleGu: 'પ્રકરણ અનુક્રમણિકા',
      titleHi: 'प्रकरण सूची',
      titleEn: 'Chapter Index (14 Prakarans)',
      subtitleGu: 'મંગલાચરણ, ઉપાસના, નિત્યકર્મ, આહારશુદ્ધિ અને બ્રહ્મવિદ્યા',
      icon: Layers,
      color: 'from-[#047857] to-[#059669]',
      badge: '૧૪ પ્રકરણ',
      count: '14 Chapters'
    },
    {
      id: 'crossref',
      titleGu: 'વચનામૃત-વાતો અનુસંધાન',
      titleHi: 'वचनामृत-वातो संबंध',
      titleEn: 'Scriptural Cross-References',
      subtitleGu: 'વચનામૃત અને સ્વામીની વાતોના મૂળ સંદર્ભો સાથે સિદ્ધાંત પ્રમાણ',
      icon: Link2,
      color: 'from-[#6D28D9] to-[#7C3AED]',
      badge: 'શાસ્ત્રીય સંદર્ભ',
      count: 'Vachnamrut Links'
    },
    {
      id: 'quiz',
      titleGu: 'સ્વાધ્યાય કસોટી',
      titleHi: 'स्वाध्याय परीक्षा',
      titleEn: 'Swadhyay Quiz & Self-Assessment',
      subtitleGu: 'શ્લોકાર્થ, ખાલી જગ્યા અને સિદ્ધાંત આધારિત પ્રશ્નોત્તરી',
      icon: Award,
      color: 'from-[#C2410C] to-[#EA580C]',
      badge: 'ક્વિઝ',
      count: 'Interactive Quiz'
    },
    {
      id: 'bookmarks',
      titleGu: 'સાચવેલા શ્લોકો & નોંધો',
      titleHi: 'बुकमार्क्स & नोट्स',
      titleEn: 'Saved Verses & Personal Notes',
      subtitleGu: 'તમારા પસંદગીના શ્લોકો અને મનન-ચિંતનની વ્યક્તિગત નોંધ',
      icon: BookmarkIcon,
      color: 'from-[#475569] to-[#64748B]',
      badge: `${totalBookmarks} સાચવેલ`,
      count: `${totalBookmarks} Verses`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 animate-fadeIn">
      {/* Toast Notification Banner */}
      {reminderToast && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-amber-950 font-medium text-xs shadow-lg flex items-center justify-between border-2 border-amber-300">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>{reminderToast}</span>
          </div>
          <button onClick={() => setReminderToast(null)} className="font-bold text-sm px-2">✕</button>
        </div>
      )}

      {/* Hero Welcome Card - Vachnamrut Study App Iconic Style */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-400/40 bg-gradient-to-r from-[#701A00] via-[#8B2500] to-[#B45309] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-black/30 pointer-events-none" />
        
        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-amber-200 text-xs font-semibold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રણીત</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50 tracking-tight leading-tight">
              સત્સંગ દીક્ષા સ્વાધ્યાય
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
              ભગવાન સ્વામિનારાયણ પ્રબોધિત અક્ષરપુરુષોત્તમ ઉપાસના અને સદાચારના ૩૧૫ સંસ્કૃત શ્લોકોનું પ્રામાણિક અધ્યયન, પદચ્છેદ, મુખપાઠ અને વચનામૃત અનુસંધાન.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
              <button
                onClick={() => onNavigateTab('reader')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-md transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>શ્લોક અધ્યયન શરૂ કરો</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateTab('mukhpath')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold border border-amber-300/40 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>મુખપાઠ સાધના</span>
              </button>
            </div>
          </div>

          {/* Holy App Icon Artwork */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/80 flex-shrink-0 bg-amber-950">
            <img 
              src={appIconImg} 
              alt="Satsang Diksha Scripture" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Fast Stats Ribbon */}
        <div className="border-t border-amber-400/20 bg-black/25 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>કુલ શ્લોકો: <strong>૩૧૫</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>મુખપાઠ સિદ્ધ: <strong>{memorizedCount}</strong> ({Math.round((memorizedCount / 315) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-4 h-4 text-amber-300" />
            <span>સાચવેલા શ્લોકો: <strong>{totalBookmarks}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>દૈનિક રીમાઇન્ડર: <strong>{preferences.reminder.time} IST</strong></span>
          </div>
        </div>
      </div>

      {/* TODAY'S FEATURED SHLOKA (આજનો પ્રેરણાદાયી શ્લોક) */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-6 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0E8DC] dark:border-[#352C24] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-[#8B2500] dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                આજનો પ્રેરણાદાયી શ્લોક (Verse of the Day)
              </h3>
              <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886]">
                શ્લોક {todayShloka.id} • પ્રકરણ {todayShloka.chapterId}: {todayShloka.chapterGu}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePlayShlokaAudio(todayShloka.sanskritDevanagari)}
              title="Listen to recitation"
              className={`p-2 rounded-xl border transition ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-amber-950 border-amber-600 animate-pulse' 
                  : 'bg-amber-50 dark:bg-[#2E2620] text-[#8B2500] dark:text-amber-300 border-amber-300/40 hover:bg-amber-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSelectShloka(todayShloka.id)}
              className="px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-amber-50 text-xs font-semibold shadow-xs transition flex items-center gap-1"
            >
              <span>વિસ્તૃત અધ્યયન</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sanskrit Verse Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFAF6] dark:bg-[#1C1714] border-2 border-amber-500/20 text-center space-y-2">
          <div className="text-xs font-serif text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            ॥ શ્રી સ્વામિનારાયણો વિજયતે ॥
          </div>
          <p 
            className="font-sanskrit font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line text-base sm:text-lg"
          >
            {preferences.sanskritScript === 'gujarati' ? todayShloka.sanskritGujarati : todayShloka.sanskritDevanagari}
          </p>
          <p className="text-xs text-stone-500 font-mono">
            {todayShloka.sanskritIast}
          </p>
        </div>

        {/* Meaning in User's selected language */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-[#28211B] border-l-4 border-[#8B2500] text-xs space-y-1">
          <div className="font-bold text-[#8B2500] dark:text-amber-300">
            સરળ ભાવાર્થ ({preferences.activeLanguage.toUpperCase()} Meaning):
          </div>
          <p className="font-gujarati text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed text-sm">
            {todayShloka.meaningGu}
          </p>
          {todayShloka.meaningEn && preferences.activeLanguage !== 'gujarati' && (
            <p className="font-english text-[#4A3E34] dark:text-[#C5B8A8] text-xs pt-1 border-t border-amber-200/40">
              {todayShloka.meaningEn}
            </p>
          )}
        </div>
      </div>

      {/* PRIMARY STUDY PILLARS (મુખ્ય અધ્યયન સ્તંભો) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>મુખ્ય અધ્યયન વિભાગો (Main Study Modules)</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            સત્સંગ દીક્ષા સ્વાધ્યાય
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                id={`home-module-${module.id}`}
                onClick={() => onNavigateTab(module.id)}
                className="group relative bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${module.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/30">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 group-hover:text-amber-600 transition-colors">
                      {module.titleGu}
                    </h4>
                    <div className="text-[11px] text-[#8A7A68] dark:text-[#A89886] font-medium">
                      {module.titleEn}
                    </div>
                    <p className="text-xs text-[#5D4E41] dark:text-[#C5B7A8] mt-1.5 line-clamp-2 leading-relaxed">
                      {module.subtitleGu}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F2ECE1] dark:border-[#332A22] flex items-center justify-between text-xs font-semibold text-[#8B2500] dark:text-amber-400">
                  <span>પ્રવેશ કરો (Explore)</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAILY REMINDER & NOTIFICATION SETTINGS CARD */}
      <div className="bg-gradient-to-r from-amber-50 via-[#FAF5EC] to-amber-100/50 dark:from-[#26201B] dark:to-[#1C1714] rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-300/60 dark:border-amber-700/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B2500] text-amber-300 flex items-center justify-center shadow-md flex-shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                  દૈનિક સત્સંગ દીક્ષા સ્વાધ્યાય રીમાઇન્ડર
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {preferences.reminder.enabled ? 'સક્રિય (Active)' : 'નિષ્ક્રિય'}
                </span>
              </div>
              <p className="text-xs text-[#6B5E51] dark:text-[#A89886]">
                નિયમિત મુખપાઠ અને શ્લોક અધ્યયન માટે દૈનિક નોટિફિકેશન (પૂર્વ-નિર્ધારિત સમય: <strong>રાત્રે ૯:૦૦ વાગ્યે / 9:00 PM IST</strong>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestReminder}
              className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>ટેસ્ટ નોટિફિકેશન</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#2F2721] border border-amber-300/60 dark:border-amber-700/60 text-[#8B2500] dark:text-amber-300 text-xs font-semibold hover:bg-amber-50 transition flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>સમય બદલો</span>
            </button>
          </div>
        </div>

        {/* Quick Time Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs">
          {[
            { label: 'સવારે ૬:૦૦ (6:00 AM)', time: '06:00' },
            { label: 'બપોરે ૧૨:૦૦ (12:00 PM)', time: '12:00' },
            { label: 'સાંજે ૭:૦૦ (7:00 PM)', time: '19:00' },
            { label: 'રાત્રે ૯:૦૦ IST (9:00 PM)', time: '21:00', isDefault: true }
          ].map(slot => (
            <button
              key={slot.time}
              onClick={() => {
                onUpdatePreferences({
                  reminder: {
                    ...preferences.reminder,
                    enabled: true,
                    time: slot.time
                  }
                });
                setReminderToast(`રીમાઇન્ડર સમય ${slot.label} પર સેટ થયો!`);
                setTimeout(() => setReminderToast(null), 3000);
              }}
              className={`p-2.5 rounded-xl border text-center transition ${
                preferences.reminder.time === slot.time
                  ? 'bg-[#8B2500] text-amber-50 border-[#8B2500] font-bold shadow-xs'
                  : 'bg-white dark:bg-[#2C241F] text-[#4A3E34] dark:text-[#C5B7A8] border-amber-200 dark:border-amber-800/40 hover:bg-amber-100/50'
              }`}
            >
              <div className="font-semibold text-xs">{slot.label}</div>
              {slot.isDefault && <div className="text-[10px] text-amber-300 opacity-90">પ્રાથમિક (Default)</div>}
            </button>
          ))}
        </div>
      </div>

      {/* CHAPTER PREVIEWS (પ્રકરણ ઝડપી પ્રવેશો) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>મુખ્ય પ્રકરણો (Scripture Chapters)</span>
          </h3>
          <button
            onClick={() => onNavigateTab('chapters')}
            className="text-xs font-bold text-[#8B2500] dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>સર્વ ૧૪ પ્રકરણો જુઓ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHAPTERS.slice(0, 6).map(ch => (
            <div
              key={ch.id}
              onClick={() => onNavigateTab('reader', ch.id)}
              className="p-4 rounded-2xl bg-white dark:bg-[#221D1A] border border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  પ્રકરણ {ch.id} • શ્લોક {ch.shlokaRange[0]}-{ch.shlokaRange[1]}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#2D241E] dark:text-[#EDE5D8]">
                  {ch.titleGu}
                </h4>
                <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] line-clamp-1">
                  {ch.titleEn}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
