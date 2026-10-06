import React, { useState } from 'react';
import { 
  Share2, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Send,
  MessageCircle
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCleanAppUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return '';
  };

  const shareTitle = 'Satsang Diksha Study';
  const shareText = 'Authentic Satsang Diksha scripture study app with all 315 Sanskrit shlokas, Vachnamrut & Swamini Vato correlations, Mukhpath and Quiz.';

  const handleCopyLink = async () => {
    const url = getCleanAppUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const url = getCleanAppUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'email') => {
    const url = getCleanAppUrl();
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareText}\n${url}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF7] dark:bg-[#1E1916] rounded-3xl shadow-2xl border-2 border-[#F6DEAC] dark:border-amber-900/50 overflow-hidden text-stone-900 dark:text-stone-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching brown/red branding */}
        <div className="p-6 pb-4 flex items-start justify-between gap-3 border-b border-[#F5E6CE] dark:border-stone-800/80">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/70 flex items-center justify-center text-[#7A1D05] dark:text-amber-300 flex-shrink-0">
              <Share2 className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#7A1D05] dark:text-amber-300 leading-tight">
                Share This App
              </h2>
              <p className="text-xs sm:text-sm text-[#785E4F] dark:text-stone-300 mt-1 leading-snug">
                Share with colleagues, tellers, shopkeepers, or friends
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-100/70 dark:hover:bg-stone-800 text-[#7A1D05] dark:text-amber-300 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Copy Web App Link without disclosing link */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#7A1D05] dark:text-amber-300">
              Copy Web App Link
            </label>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#F6DEAC] dark:border-amber-900/50 bg-white dark:bg-[#251D18] hover:bg-amber-50/60 dark:hover:bg-amber-950/40 text-[#4A2D1B] dark:text-stone-200 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-2xs transition active:scale-98 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#7A1D05] dark:text-amber-400" />
                    <span>Copy App Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                title="Share App"
                className="w-12 h-12 rounded-2xl bg-[#7A1D05] hover:bg-[#601503] text-white flex items-center justify-center shadow-md shadow-[#7A1D05]/25 transition active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Section 2: Share via Social Media & Messaging */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#7A1D05] dark:text-amber-300">
              Share via Social Media & Messaging
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handleSocialShare('whatsapp')}
                className="p-3 rounded-2xl bg-[#F0FDF4] dark:bg-emerald-950/30 border border-[#DCFCE7] dark:border-emerald-900/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 flex items-center gap-3 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#14532D] dark:text-emerald-300 leading-tight">
                    WhatsApp
                  </div>
                  <div className="text-[11px] text-[#166534]/70 dark:text-emerald-400/70 flex items-center gap-1 mt-0.5">
                    <span>Share</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => handleSocialShare('telegram')}
                className="p-3 rounded-2xl bg-[#F0F9FF] dark:bg-sky-950/30 border border-[#E0F2FE] dark:border-sky-900/50 hover:bg-sky-100/60 dark:hover:bg-sky-950/60 flex items-center gap-3 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0088CC] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#0369A1] dark:text-sky-300 leading-tight">
                    Telegram
                  </div>
                  <div className="text-[11px] text-[#0284C7]/70 dark:text-sky-400/70 flex items-center gap-1 mt-0.5">
                    <span>Share</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                onClick={() => handleSocialShare('twitter')}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800/80 flex items-center gap-3 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-black dark:bg-stone-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-lg font-mono">
                  𝕏
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-200 leading-tight">
                    X (Twitter)
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                    <span>Share</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialShare('facebook')}
                className="p-3 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#DBEAFE] dark:border-blue-900/50 hover:bg-blue-100/60 dark:hover:bg-blue-950/60 flex items-center gap-3 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-lg">
                  f
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1E40AF] dark:text-blue-300 leading-tight">
                    Facebook
                  </div>
                  <div className="text-[11px] text-[#2563EB]/70 dark:text-blue-400/70 flex items-center gap-1 mt-0.5">
                    <span>Share</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => handleSocialShare('email')}
                className="p-3 rounded-2xl bg-[#FFFBEB] dark:bg-amber-950/30 border border-[#FEF3C7] dark:border-amber-900/50 hover:bg-amber-100/60 dark:hover:bg-amber-950/60 flex items-center gap-3 transition text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7A1D05] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#7A1D05] dark:text-amber-300 leading-tight">
                    Email
                  </div>
                  <div className="text-[11px] text-[#7A1D05]/70 dark:text-amber-400/70 flex items-center gap-1 mt-0.5">
                    <span>Share</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer: Done button in warm brown/red */}
        <div className="px-6 py-4 bg-[#FAF5EC] dark:bg-[#18130F] border-t border-[#F5E6CE] dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#7A1D05] hover:bg-[#601503] text-white font-bold text-sm shadow-xs transition active:scale-98 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
