import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  PackageCheck, 
  Layers, 
  CheckCircle2, 
  X, 
  FileCode, 
  Sparkles, 
  Share2, 
  Terminal, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';

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
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'aab' | 'capacitor'>('pwa');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const ui = getUIStrings(preferences.activeLanguage);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2500);
  };

  const handleInstallPWA = () => {
    // Check if beforeinstallprompt is available or alert user on how to add to home screen
    if ((window as any).deferredPrompt) {
      (window as any).deferredPrompt.prompt();
    } else {
      alert('To install as Native Android App:\n1. Tap the 3-dots menu in Chrome/Browser\n2. Select "Install App" or "Add to Home Screen"\n3. The app will install directly with full offline support & app icon.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sacred Header */}
        <div className="bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-50">
                Android APK / AAB & PWA Package Builder
              </h3>
              <p className="text-[11px] text-amber-200/80">
                Real Native Mobile Application Architecture • 100% Offline
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

        {/* Tab switcher */}
        <div className="bg-amber-50/80 dark:bg-[#1C1714] px-4 py-2 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'pwa', label: '1. Direct Install (PWA/APK)', icon: Zap },
            { id: 'apk', label: '2. APK Package Config', icon: Smartphone },
            { id: 'aab', label: '3. AAB Bundle (Play Store)', icon: Layers },
            { id: 'capacitor', label: '4. Capacitor/CLI Commands', icon: Terminal }
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#2D241E] dark:text-[#EDE5D8]">
          
          {/* TAB 1: PWA Instant Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#2A221C] border border-amber-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Instant Native App Installation</span>
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    Install Satsang Diksha directly on your Android phone/tablet with full offline database, app icon, full-screen standalone mode without browser URL bar.
                  </p>
                </div>
                <button
                  onClick={handleInstallPWA}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    ૧૦૦% ઑફલાઇન (Offline)
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    All 315 Sanskrit verses, audio recitations, word breakdowns & translations work completely without internet.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    No Sign-Up Required
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    Zero accounts, zero login barriers. Seamless native experience with instant study & Mukhpath tracking.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    Real App UI & Gestures
                  </div>
                  <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                    Bottom app navigation bar, haptic vibrations, safe-area padding, fast search, and night theme.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APK Configuration */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#251E18] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-sm text-[#8B2500] dark:text-amber-300 flex items-center justify-between">
                  <span>Android Package (APK) Specifications</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                    Target: Android 8.0 to Android 15+
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><strong>Package ID:</strong> <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded">org.baps.satsangdiksha</code></div>
                  <div><strong>Version:</strong> <code>1.0.0 (Build 100)</code></div>
                  <div><strong>Min SDK:</strong> <code>24 (Android 7.0+)</code></div>
                  <div><strong>Target SDK:</strong> <code>34 (Android 14/15)</code></div>
                  <div><strong>Orientation:</strong> <code>Sensor Portrait & Landscape</code></div>
                  <div><strong>Display:</strong> <code>Standalone (Edge-to-Edge)</code></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-[#2B231D] border border-amber-300/40 space-y-2">
                <div className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                  Built-in WebApp Manifest (public/manifest.json)
                </div>
                <pre className="p-3 bg-black/80 text-amber-200 rounded-xl text-[10px] font-mono overflow-x-auto">
{`{
  "name": "Satsang Diksha",
  "short_name": "Satsang Diksha",
  "start_url": "/?source=apk",
  "display": "standalone",
  "background_color": "#F8F5EE",
  "theme_color": "#8B2500",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Android App Bundle (AAB) */}
          {activeTab === 'aab' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#2A221C] border border-amber-300/50 space-y-2">
                <div className="font-bold text-sm text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span>Google Play Store (AAB) Readiness</span>
                </div>
                <p className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                  This project includes full Android App Bundle (AAB) configuration via Bubblewrap CLI or Capacitor. You can generate a release-signed `.aab` file ready to upload to the Google Play Console:
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#1E1916] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    Step 1: Bubblewrap / TWA Play Store Command
                  </span>
                  <button
                    onClick={() => copyToClipboard('npx @bubblewrap/cli build', 'bubblewrap')}
                    className="text-[10px] text-amber-700 hover:underline font-bold"
                  >
                    {isCopied === 'bubblewrap' ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <code className="block p-2.5 bg-black/80 text-green-300 rounded-xl text-[11px] font-mono">
                  npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.json<br />
                  npx @bubblewrap/cli build
                </code>
              </div>
            </div>
          )}

          {/* TAB 4: Capacitor / CLI Commands */}
          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#221A15] border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#8B2500] dark:text-amber-300">
                    Build APK with Capacitor CLI
                  </span>
                  <button
                    onClick={() => copyToClipboard('npm run build\nnpx cap add android\nnpx cap open android', 'capbuild')}
                    className="text-[10px] text-amber-700 hover:underline font-bold"
                  >
                    {isCopied === 'capbuild' ? 'Copied ✓' : 'Copy Commands'}
                  </button>
                </div>
                <code className="block p-3 bg-black/80 text-amber-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap">
{`# 1. Build web production bundle
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
          <div className="flex items-center gap-1 text-[11px] text-[#6B5E51] dark:text-[#A89886]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for APK & AAB packaging</span>
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
