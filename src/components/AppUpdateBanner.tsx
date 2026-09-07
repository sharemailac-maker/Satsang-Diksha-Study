import React, { useState } from 'react';
import { Sparkles, RefreshCw, X, ArrowUpCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppUpdate } from '../hooks/useAppUpdate';
import { Language } from '../types';

interface AppUpdateBannerProps {
  language?: Language;
}

export const AppUpdateBanner: React.FC<AppUpdateBannerProps> = ({ language = 'gujarati' }) => {
  const { updateAvailable, remoteVersion, currentVersion, applyUpdate, dismissUpdate } = useAppUpdate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!updateAvailable) {
    return null;
  }

  const handleApply = async () => {
    setIsUpdating(true);
    try {
      await applyUpdate();
    } catch {
      window.location.reload();
    }
  };

  // Multilingual labels
  const getLabels = () => {
    switch (language) {
      case 'hindi':
        return {
          title: 'सत्संग दीक्षा ऐप का नया संस्करण उपलब्ध है!',
          subtitle: 'नवीनतम शास्त्रीय संदर्भ और सुधार प्राप्त करने के लिए कृपया अभी अपडेट करें।',
          button: isUpdating ? 'अपडेट हो रहा है...' : 'अभी अपडेट करें',
          later: 'बाद में',
          versionLabel: 'नया संस्करण',
          currentLabel: 'वर्तमान संस्करण',
          detailsLabel: 'सुधार विवरण'
        };
      case 'english':
        return {
          title: 'A new version of Satsang Diksha is available!',
          subtitle: 'Please update now to get the latest scriptural concordance and enhancements.',
          button: isUpdating ? 'Updating...' : 'Update Now',
          later: 'Later',
          versionLabel: 'New Version',
          currentLabel: 'Current Version',
          detailsLabel: 'What is new'
        };
      case 'gujarati':
      default:
        return {
          title: 'સત્સંગ દીક્ષા એપનું નવું સંસ્કરણ ઉપલબ્ધ છે!',
          subtitle: 'નવા વિસ્તૃત શાસ્ત્રીય સંદર્ભો અને સુધારાઓ મેળવવા માટે કૃપા કરીને હમણાં અપડેટ કરો.',
          button: isUpdating ? 'અપડેટ થઈ રહ્યું છે...' : 'હમણાં અપડેટ કરો',
          later: 'પછીથી',
          versionLabel: 'નવું વર્ઝન',
          currentLabel: 'હાલનું વર્ઝન',
          detailsLabel: 'સુધારાની વિગત'
        };
    }
  };

  const labels = getLabels();
  const releaseNotes = language === 'hindi'
    ? remoteVersion?.releaseNotesHi
    : language === 'english'
    ? remoteVersion?.releaseNotesEn
    : remoteVersion?.releaseNotesGu;

  return (
    <div
      id="app-update-notification-banner"
      className="sticky top-0 z-50 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg border-b border-emerald-600/40 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Main Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600/60 text-emerald-100 flex-shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm sm:text-base tracking-wide text-white">
                  {labels.title}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-500/30">
                  {remoteVersion?.version ? `v${remoteVersion.version}` : 'Update'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 line-clamp-1 sm:line-clamp-none mt-0.5">
                {labels.subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            {releaseNotes && (
              <button
                id="toggle-update-details-button"
                onClick={() => setShowDetails(!showDetails)}
                className="px-2 py-1.5 rounded text-xs text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition flex items-center gap-1"
                title={labels.detailsLabel}
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{labels.detailsLabel}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            <button
              id="apply-app-update-button"
              onClick={handleApply}
              disabled={isUpdating}
              className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-950 hover:bg-emerald-50 active:scale-95 font-bold text-xs sm:text-sm shadow transition-all flex items-center gap-1.5 disabled:opacity-75 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{labels.button}</span>
            </button>

            <button
              id="dismiss-app-update-button"
              onClick={dismissUpdate}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition cursor-pointer"
              title={labels.later}
              aria-label={labels.later}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Release Notes Details */}
        {showDetails && releaseNotes && (
          <div className="mt-2.5 pt-2 border-t border-emerald-600/50 text-xs text-emerald-50 bg-emerald-900/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-emerald-200">
                {labels.detailsLabel}:
              </span>
              <span className="text-[11px] text-emerald-300">
                {labels.currentLabel}: v{currentVersion.version} → {labels.versionLabel}: v{remoteVersion?.version}
              </span>
            </div>
            <p className="text-emerald-100/90 leading-relaxed">
              {releaseNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
