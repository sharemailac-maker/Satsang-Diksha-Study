import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  PackageCheck, 
  Layers, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ExternalLink,
  Terminal, 
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
}

export const ApkBuildModal: React.FC<ApkBuildModalProps> = ({
  isOpen,
  onClose,
  preferences
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'pwabuilder' | 'cli'>('pwa');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheClearedSuccess, setCacheClearedSuccess] = useState(false);

  const { install, isInstallable, isInstalled, isIOS, forceRefresh } = usePWAInstall();

  if (!isOpen) return null;

  const ui = getUIStrings(preferences.activeLanguage);

  // URLs for live APK generation
  const sharedLiveUrl = 'https://ais-pre-m5cbs6s7drqh2usp5rdpvr-146603361802.asia-southeast1.run.app';
  const currentOriginUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : sharedLiveUrl;
  const targetUrl = sharedLiveUrl;

  const pwabuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(targetUrl)}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2500);
  };

  const handleClearCacheAndReload = async () => {
    setIsClearingCache(true);
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
      setCacheClearedSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error('Failed to clear cache:', err);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sacred Header */}
        <div className="bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-amber-50">
                  Android APK & PWA Package Center
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
                  v5.0 (Latest 315 Shlokas)
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                100% Offline Scripture • Udgaan Audio • Google Play Ready
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

        {/* Cache Busting Notice & Update Refresh Bar */}
        <div className="bg-amber-100/90 dark:bg-[#2C221A] px-4 py-2 border-b border-amber-300/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#731E00] dark:text-amber-300">
            <RefreshCw className={`w-4 h-4 ${isClearingCache ? 'animate-spin' : ''}`} />
            <span className="text-[11px] font-medium">
              જૂની કેશ સાફ કરી નવું વર્ઝન લોડ કરવા:
            </span>
          </div>
          <button
            onClick={handleClearCacheAndReload}
            disabled={isClearingCache}
            className="px-3 py-1 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-amber-50 text-[11px] font-bold transition shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            {cacheClearedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>અપડેટ થઈ ગયું! Reloading...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Cache & Force Update</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-amber-50/80 dark:bg-[#1C1714] px-4 py-2 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'pwa', label: '1. Direct Install (Mobile/Desktop)', icon: Zap },
            { id: 'pwabuilder', label: '2. 1-Click APK Builder', icon: PackageCheck },
            { id: 'apk', label: '3. Live URL & Config', icon: Globe },
            { id: 'cli', label: '4. CLI & Play Store AAB', icon: Terminal }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                    : 'text-[#6B5E51] dark:text-[#A89886] hover:bg-amber-200/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#2D241E] dark:text-[#EDE5D8]">
          
          {/* TAB 1: PWA Instant Native Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#2A221C] dark:to-[#221A15] border border-amber-300/60 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>સત્સંગ દીક્ષા એપ સીધી ઇન્સ્ટોલ કરો</span>
                    </div>
                    <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886] leading-relaxed">
                      આ એપ્લિકેશન Android, iOS અને Windows/Mac પર સીધી નેટિવ એપ્લિકેશન તરીકે ઇન્સ્ટોલ થાય છે. તમામ ૩૧૫ શ્લોક, ૬ ઉદ્ગાન, મુખપાઠ અને વચનામૃત સંદર્ભો ૧૦૦% ઑફલાઇન સંગ્રહિત થશે.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {isInstallable ? (
                    <button
                      onClick={install}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>ઇન્સ્ટોલ કરો (Install APK/App Now)</span>
                    </button>
                  ) : isInstalled ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>એપ સફળતાપૂર્વક ઇન્સ્ટોલ થયેલ છે (Running in Standalone App Mode)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#8B2500] dark:text-amber-300">
                        📱 બ્રાઉઝરમાંથી ઇન્સ્ટોલ કરવાની સરળ રીત:
                      </p>
                      <ol className="list-decimal list-inside text-[11px] space-y-1 text-[#6B5E51] dark:text-[#A89886]">
                        <li>Chrome બ્રાઉઝરમાં ઉપર જમણી બાજુના <strong>3 બિંદુઓ (⋮)</strong> પર ટેપ કરો.</li>
                        <li><strong>&apos;Install App&apos;</strong> અથવા <strong>&apos;Add to Home screen&apos;</strong> પસંદ કરો.</li>
                        <li>એપ તમારા ફોનમાં એપ આઇકોન સાથે ઇન્સ્ટોલ થઈ જશે.</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#1E1916] border border-amber-200/50 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    ૧૦૦% ઑફલાઇન (Offline)
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    ઇન્ટરનેટ વગર તમામ ૩૧૫ સંસ્કૃત શ્લોકો, અન્વયાર્થ અને ઉદ્ગાન ઓડિયો ઉપલબ્ધ.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#1E1916] border border-amber-200/50 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    ઝડપી અને સુરક્ષિત
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    કોઈ લોગિન કે જાહેરાત વિના સંપૂર્ણ શુદ્ધ આધ્યાત્મિક અનુભવ.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#1E1916] border border-amber-200/50 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    નવું વર્ઝન ઓટો-સિંક
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    Network-First આર્કિટેક્ચર દ્વારા નવા શ્લોકો અને સુધારા આપોઆપ અપડેટ થશે.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PWABuilder 1-Click APK Generation */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              {/* Alert explaining the 403 bot-check reason and simple fix */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#2A221C] border border-amber-300/60 space-y-3">
                <div className="font-bold text-sm text-[#8B2500] dark:text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    <span>PWABuilder APK & Google Play AAB Generator</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Fixed Solution
                  </span>
                </div>
                
                <p className="text-[11px] text-[#6B5E51] dark:text-[#C5B7A8] leading-relaxed">
                  <strong>નોંધ (PWABuilder Log Error ઉકેલ):</strong> Google Cloud Run પ્રિવ્યૂ લિંક પર બોટ-પ્રોટેક્શન (Cookie Check) હોવાથી PWABuilder ક્યારેક સીધા આઇકોન ડાઉનલોડ કરવામાં <code className="bg-amber-100 dark:bg-black/50 px-1 py-0.5 rounded text-red-600 font-mono">403 Forbidden / text-html</code> એરર બતાવે છે. નીચે આપેલા સરળ પગલાં અનુસરો:
                </p>

                {/* Direct Asset Download Section */}
                <div className="p-3 bg-white dark:bg-[#1E1916] rounded-xl border border-amber-300/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-semibold text-[#8B2500] dark:text-amber-300">
                    ૧. અહીંથી 512x512 App Icon ડાઉનલોડ કરો:
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/icon-512.png"
                      download="icon-512.png"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download icon-512.png</span>
                    </a>
                    <a
                      href="/manifest.json"
                      download="manifest.json"
                      className="px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-amber-50 font-bold text-[11px] flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>manifest.json</span>
                    </a>
                  </div>
                </div>

                {/* 1-Click Generate Button */}
                <div className="pt-1">
                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-white font-bold text-xs shadow-md transition"
                  >
                    <span>PWABuilder વેબસાઇટ ખોલો (Open PWABuilder)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1916] border border-[#E8DFD1] dark:border-stone-800 space-y-2.5">
                <h4 className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                  PWABuilder પર APK બનાવવાની ૧૦૦% સાચી રીત (Step-by-Step Fix):
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-[#6B5E51] dark:text-[#C5B7A8] leading-relaxed">
                  <li>ઉપર આપેલા બટન પરથી <strong>icon-512.png</strong> ડાઉનલોડ કરી લો.</li>
                  <li><strong>Open PWABuilder</strong> બટન પર ક્લિક કરો અને લાઈવ URL પેસ્ટ કરી <strong>&apos;Start&apos;</strong> પર ક્લિક કરો.</li>
                  <li>ત્યાં <strong>&apos;Edit Manifest&apos;</strong> અથવા <strong>&apos;Icons&apos;</strong> વિભાગમાં જઈ ડાઉનલોડ કરેલ <strong>icon-512.png</strong> અપલોડ કરો.</li>
                  <li>હવે <strong>&apos;Package for Stores&apos;</strong> પર ક્લિક કરી <strong>Android (APK / AAB)</strong> ડાઉનલોડ કરો — કોઈ એરર વગર પેકેજ તૈયાર થઈ જશે!</li>
                </ol>
              </div>

              {/* Recommendation Note */}
              <div className="p-3 bg-emerald-50 dark:bg-[#1A251E] rounded-xl border border-emerald-300/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>સૌથી સરળ રીત (No Builder Needed):</strong> એન્ડ્રોઈડ ફોનમાં ક્રોમ બ્રાઉઝરમાં લિંક ખોલી ઉપર આપેલ <strong>&apos;APK / App&apos;</strong> બટન અથવા ક્રોમના મેનુમાંથી <strong>&apos;Install app&apos;</strong> દબાવો. ગૂગલ પ્લે સર્વિસીસ આપોઆપ પૂર્ણ કાર્યરત ઑફલાઇન એન્ડ્રોઈડ એપ તમારા ફોનમાં ઇન્સ્ટોલ કરી દેશે.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Live URL & Package Config */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              {/* Live URL Box for APK building */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#2A221C] border border-amber-300/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>નવું લાઈવ એપ્લિકેશન URL (Latest Live Web App URL):</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(targetUrl, 'liveurl')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#8B2500] text-amber-50 font-bold hover:bg-[#A83200] transition flex items-center gap-1"
                  >
                    {isCopied === 'liveurl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied === 'liveurl' ? 'કોપી થયું!' : 'Copy URL'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-white dark:bg-black/60 rounded-xl border border-amber-300/40 font-mono text-[11px] text-[#8B2500] dark:text-amber-300 break-all select-all">
                  {targetUrl}
                </div>
                <p className="text-[10px] text-[#7A6B5C] dark:text-[#A89886]">
                  આ URL નો ઉપયોગ તમે કોઈપણ APK બિલ્ડર (PWABuilder, AppsGeyser, Web2App) માં કરી શકો છો. આ હંમેશાં લેટેસ્ટ ૩૧૫ શ્લોક વર્ઝન લોડ કરશે.
                </p>
              </div>

              {/* Package Details */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#251E18] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300 flex items-center justify-between">
                  <span>Android Package (APK) Specs</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                    Target: Android 8.0 to Android 15+
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><strong>Package ID:</strong> <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">org.baps.satsangdiksha</code></div>
                  <div><strong>Version:</strong> <code>5.0.0 (Build 500)</code></div>
                  <div><strong>Min SDK:</strong> <code>24 (Android 7.0+)</code></div>
                  <div><strong>Target SDK:</strong> <code>34 (Android 14/15)</code></div>
                  <div><strong>Display:</strong> <code>Standalone (Edge-to-Edge)</code></div>
                  <div><strong>Orientation:</strong> <code>Sensor Portrait & Landscape</code></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLI Commands (Bubblewrap & Capacitor) */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              {/* Bubblewrap CLI */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1E1916] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    Bubblewrap CLI (Google Trusted Web Activity)
                  </span>
                  <button
                    onClick={() => copyToClipboard(`npx @bubblewrap/cli init --manifest=${targetUrl}/manifest.json\nnpx @bubblewrap/cli build`, 'bubblewrap')}
                    className="text-[10px] text-amber-700 hover:underline font-bold"
                  >
                    {isCopied === 'bubblewrap' ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <code className="block p-2.5 bg-black/80 text-green-300 rounded-xl text-[11px] font-mono whitespace-pre-wrap">
{`npx @bubblewrap/cli init --manifest=${targetUrl}/manifest.json
npx @bubblewrap/cli build`}
                </code>
              </div>

              {/* Capacitor CLI */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#221A15] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    Capacitor / Android Studio Build
                  </span>
                  <button
                    onClick={() => copyToClipboard('npm run build\nnpx cap add android\nnpx cap copy android\nnpx cap open android', 'capbuild')}
                    className="text-[10px] text-amber-700 hover:underline font-bold"
                  >
                    {isCopied === 'capbuild' ? 'Copied ✓' : 'Copy Commands'}
                  </button>
                </div>
                <code className="block p-3 bg-black/80 text-amber-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap">
{`# 1. Build production bundle
npm run build

# 2. Add Android Platform & Open in Android Studio
npx cap add android
npx cap copy android
npx cap open android

# 3. In Android Studio: Build > Generate Signed Bundle / APK`}
                </code>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] border-t border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B5E51] dark:text-[#A89886]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PWA & APK ready • All 315 Sanskrit Shlokas</span>
          </div>
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
