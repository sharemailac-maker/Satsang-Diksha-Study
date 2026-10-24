import React from 'react';
import { Sparkles, Quote } from 'lucide-react';

interface MukhpathBannerCarouselProps {
  memorizedCount?: number;
  progressPercent?: number;
  lang?: string;
}

export const MukhpathBannerCarousel: React.FC<MukhpathBannerCarouselProps> = ({
  lang = 'gujarati'
}) => {
  const isGujarati = lang === 'gujarati';
  const isHindi = lang === 'hindi';

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#8B2500] dark:border-[#8B2500]/70 bg-gradient-to-br from-[#FFFDF8] via-[#FFF8E7] to-[#FCEECB] dark:from-[#2A160E] dark:via-[#221008] dark:to-[#1A0C06] text-[#2C1808] dark:text-[#FDF8EE] p-5 sm:p-8 md:p-10 select-none transition-all"
      id="mukhpath-divine-quote-banner"
    >
      {/* Background ambient sacred pattern & gold glow */}
      <div className="absolute inset-0 bg-radial from-amber-400/15 via-transparent to-transparent pointer-events-none" />

      {/* Decorative Ornate Brown & Gold Inner Border */}
      <div className="absolute inset-2 sm:inset-3 border border-[#8B2500]/30 dark:border-[#8B2500]/40 rounded-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
        {/* Top Header Tag */}
        <div className="space-y-1.5">
          <span className="text-[11px] sm:text-xs font-serif font-bold text-[#8B2500] dark:text-amber-400 uppercase tracking-widest block">
            {isHindi ? '॥ श्री स्वामिनारायणो विजयते ॥' : isGujarati ? '॥ શ્રી સ્વામિનારાયણો વિજયતે ॥' : '॥ Shree Swaminarayan Sacred Word ॥'}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-[#8B2500] dark:text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300 animate-pulse" />
            <span>
              {isHindi 
                ? 'परम पूज्य महंत स्वामी महाराज का दिव्य प्रेरणा सूत्र' 
                : isGujarati 
                ? 'પરમ પૂજ્ય મહંતસ્વામી મહારાજનું દિવ્ય પ્રેરણા સૂત્ર' 
                : 'Divine Inspiration by HH Mahant Swami Maharaj'}
            </span>
          </div>
        </div>

        {/* Sacred Divine Exclamation Quote Card */}
        <div className="p-5 sm:p-7 md:p-9 rounded-2xl bg-amber-100/60 dark:bg-black/40 border-2 border-[#8B2500]/30 dark:border-amber-600/40 text-center shadow-sm relative">
          <div className="text-amber-700/60 dark:text-amber-400/60 text-2xl sm:text-3xl font-serif">“</div>
          
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#7A1D05] dark:text-amber-100 leading-relaxed tracking-tight text-balance">
            {isGujarati ? (
              <>
                સત્સંગદીક્ષા મોઢે કરે એટલે બધું આવી ગયું.{' '}
                {/* Highlighted with Underline, Bold, and Golden Color */}
                <span className="font-extrabold underline decoration-amber-500 decoration-2 sm:decoration-3 underline-offset-6 text-[#8B2500] dark:text-yellow-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded inline-block sm:inline shadow-2xs">
                  શાસ્ત્ર માત્ર આવી ગયા!
                </span>
              </>
            ) : isHindi ? (
              <>
                सत्सङ्गदीक्षा कंठस्थ कर ली तो सब कुछ आ गया।{' '}
                <span className="font-extrabold underline decoration-amber-500 decoration-2 sm:decoration-3 underline-offset-6 text-[#8B2500] dark:text-yellow-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded inline-block sm:inline shadow-2xs">
                  शास्त्र मात्र आ गए!
                </span>
              </>
            ) : (
              <>
                If one memorises Satsang Diksha, everything is attained.{' '}
                <span className="font-extrabold underline decoration-amber-500 decoration-2 sm:decoration-3 underline-offset-6 text-[#8B2500] dark:text-yellow-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded inline-block sm:inline shadow-2xs">
                  All the scriptures are encompassed!
                </span>
              </>
            )}
          </blockquote>

          <div className="text-amber-700/60 dark:text-amber-400/60 text-2xl sm:text-3xl font-serif">”</div>
        </div>

        {/* Sacred Lotus Divider */}
        <div className="flex items-center justify-center gap-3 text-amber-700 dark:text-amber-400">
          <div className="h-px bg-[#8B2500]/30 dark:bg-amber-400/40 w-16 sm:w-28" />
          <span className="text-xl">🪷</span>
          <div className="h-px bg-[#8B2500]/30 dark:bg-amber-400/40 w-16 sm:w-28" />
        </div>

        {/* Author Attribution & Date/Place */}
        <div className="space-y-0.5 font-serif text-center">
          <div className="text-xs text-amber-900/80 dark:text-amber-300/80 font-medium">
            {isHindi ? 'सत्सङ्गदीक्षा के रचयिता' : isGujarati ? 'સત્સંગદીક્ષાના રચયિતા' : 'Author of Satsang Diksha'}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#7A1D05] dark:text-amber-200">
            {isHindi 
              ? 'प्रगट गुरुहरि प.पू. महंत स्वामी महाराज' 
              : isGujarati 
              ? 'પ્રગટ ગુરુહરિ પ.પૂ. મહંતસ્વામી મહારાજ' 
              : 'Pragat Guruhari HH Mahant Swami Maharaj'}
          </div>
          <div className="text-xs sm:text-sm font-serif font-semibold text-[#8B2500] dark:text-amber-300 tracking-wide pt-1">
            {isHindi 
              ? 'ता. ९/५/२०२६ • सारंगपुर' 
              : isGujarati 
              ? 'તા. ૯/૫/૨૦૨૬ • સારંગપુર' 
              : '9 May 2026 • Sarangpur'}
          </div>
        </div>
      </div>
    </div>
  );
};
