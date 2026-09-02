import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'badge' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone app, hide install button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'badge') {
      return (
        <button
          onClick={install}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-semibold shadow-sm transition ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#8B2500] hover:from-amber-600 hover:to-[#701E00] px-3.5 py-2 text-xs font-bold text-white shadow-md hover:scale-[1.02] transition ${className}`}
      >
        <Smartphone className="w-4 h-4 text-amber-200" />
        <span>Install App (APK/PWA)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-amber-100 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span>Install on iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#221D1A] p-6 shadow-2xl border border-amber-300/40 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-3">
                <h3 className="text-base font-serif font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  <span>iPhone / iPad પર ઇન્સ્ટોલ કરો</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="text-xs text-[#524438] dark:text-[#D4C7B8] space-y-3 list-decimal list-inside leading-relaxed">
                <li>
                  Safari બ્રાઉઝરમાં નીચે આપેલા <strong>Share</strong> બટન (<span className="text-blue-500">⎋/⎙</span>) પર ટેપ કરો.
                </li>
                <li>
                  યાદીમાંથી નીચે સ્ક્રોલ કરી <strong>&apos;Add to Home Screen&apos; (હોમ સ્ક્રીન પર ઉમેરો)</strong> પસંદ કરો.
                </li>
                <li>
                  ઉપર જમણી બાજુએ <strong>&apos;Add&apos;</strong> પર ટેપ કરો.
                </li>
              </ol>

              <div className="p-3 bg-amber-50 dark:bg-[#2C231D] rounded-xl border border-amber-300/30 text-[11px] text-[#7A6B5C] dark:text-[#A89886]">
                સત્સંગ દીક્ષા એપ તમારા ફોનની હોમ સ્ક્રીન પર નેટિવ એપ તરીકે પૂર્ણ ઑફલાઇન ઉપલબ્ધ થઈ જશે.
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A83200] text-amber-50 text-xs font-bold transition shadow-sm"
              >
                સમજાયું (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
