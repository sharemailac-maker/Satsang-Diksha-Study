import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  BookOpen, 
  Sparkles, 
  Radio, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Bookmark as BookmarkIcon,
  ZoomIn
} from 'lucide-react';
import letterGujaratiImg from '../assets/images/satsang_diksha_original_letter_gujarati.jpg';
import letterEnglishImg from '../assets/images/satsang_diksha_original_letter_english.jpg';
import appIconImg from '../assets/images/satsang_diksha_akshar_purushottam_logo_1788180536338.jpg';

interface HomeLettersBannerProps {
  onNavigateTab: (tab: string, chapterId?: number | null) => void;
  memorizedCount: number;
  totalBookmarks: number;
  ui: Record<string, string>;
  activeLanguage?: string;
}

export const HomeLettersBanner: React.FC<HomeLettersBannerProps> = ({
  onNavigateTab,
  memorizedCount,
  totalBookmarks,
  ui,
  activeLanguage = 'gujarati'
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ 
    title: string; 
    type: 'gujarati' | 'english' | 'hero'; 
    src?: string;
  } | null>(null);
  const [lightboxTab, setLightboxTab] = useState<'image' | 'text'>('image');

  // Total 2 slides: Slide 0 = Blessing Letter (Gujarati or English based on user language), Slide 1 = Satsang Diksha Overview
  const totalSlides = 2;
  const isGujarati = activeLanguage === 'gujarati';

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // NOTE: Auto-swiping of banners at Home page is disabled per user directive. Users will swipe or click to see.

  // Touch handlers for swipe left/right
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const threshold = 40; // min swipe distance in px

    if (diffX > threshold) {
      // Swiped Left -> Next
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    } else if (diffX < -threshold) {
      // Swiped Right -> Prev
      setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage) {
        if (e.key === 'Escape') setLightboxImage(null);
      } else {
        if (e.key === 'ArrowLeft') {
          setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        } else if (e.key === 'ArrowRight') {
          setActiveSlide((prev) => (prev + 1) % totalSlides);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, totalSlides]);

  const slideNames = [
    isGujarati ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર' : 'Official English Blessing Letter',
    'સત્સંગ દીક્ષા સ્વાધ્યાય (મુખ્ય બેનર)'
  ];

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-gradient-to-r from-[#631800] via-[#852300] to-[#A34200] text-white select-none transition-all"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="home-blessing-letters-carousel"
    >
      {/* Background ambient sacred pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/25 via-transparent to-black/45 pointer-events-none" />

      {/* CAROUSEL SLIDES CONTAINER (Total 2 Slides: 1 Letter Banner according to language + 1 Main Banner) */}
      <div className="relative min-h-[340px] sm:min-h-[360px] md:min-h-[380px] flex items-center">
        {/* SLIDE 0: BLESSING LETTER (Language-adaptive: Gujarati if Gujarati selected, English for all other languages) */}
        {activeSlide === 0 && (
          <div className="w-full p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-7 animate-fadeIn">
            {/* Left description column */}
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-amber-200 text-xs font-semibold border border-amber-300/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isGujarati 
                    ? 'મૂળ હસ્તલિખિત પત્ર • નેનપુર, ૭-૭-\'૨૦ (મંગળવાર)'
                    : 'Official English Blessing Letter • Nenpur, 7 July 2020'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-50 tracking-tight leading-snug">
                {isGujarati ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર' : 'Official English Blessing Letter'}
              </h2>

              {/* Full unobstructed excerpt of the Letter */}
              {isGujarati ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/35 border border-amber-400/35 text-amber-100 text-xs sm:text-sm space-y-2 leading-relaxed font-serif">
                  <p className="text-amber-300 font-bold">
                    "હવે આપણા બધાએ તેના ઓછામાં ઓછા પાંચ શ્લોકોનું વાંચન દરરોજ કરવું..."
                  </p>
                  <p className="text-amber-100/95 text-[11px] sm:text-xs">
                    "જેમને શક્તિ અને આવડત હોય તેઓ સંસ્કૃત શ્લોકો વાંચે અને યથાશક્તિ મુખપાઠ કરે, એવી અમારી રુચિ છે. બાળકો, કિશોરો, યુવકો મુખપાઠ કરી અક્ષર-પુરુષોત્તમનો ઉદ્ઘોષ કરે, યોગી બાપા અને પ્રમુખ સ્વામી ખૂબ રાજી થશે."
                  </p>
                  <p className="text-amber-200/90 text-[11px] font-sans italic pt-0.5">
                    - સાધુ કેશવજીવનદાસ (પ.પૂ. મહંતસ્વામી મહારાજ)
                  </p>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/35 border border-amber-400/35 text-amber-100 text-xs sm:text-sm space-y-2 leading-relaxed font-sans">
                  <p className="text-amber-300 font-semibold">
                    "By the grace of Maharaj and Swami, the 'Satsang Diksha' text has been prepared. Now, all should daily read at least five verses from it."
                  </p>
                  <p className="text-amber-100/95 text-[11px] sm:text-xs">
                    "Those who are able to should read the verses in Sanskrit and memorise them as per their capacity. May the balaks, kishores, and yuvaks proclaim the Akshar-Purushottam principle. Yogi Bapa and Pramukh Swami will be pleased."
                  </p>
                  <p className="text-amber-200/90 text-[11px] italic pt-0.5">
                    - HH Mahant Swami Maharaj (Sadhu Keshavjivandas)
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
                <button
                  onClick={() => setLightboxImage({ 
                    title: isGujarati ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર (૭.૭.\'૨૦)' : 'Official English Blessing Letter (7 July 2020)', 
                    type: isGujarati ? 'gujarati' : 'english', 
                    src: isGujarati ? letterGujaratiImg : letterEnglishImg 
                  })}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                  title={isGujarati ? 'સંપૂર્ણ પત્ર જુઓ' : 'View Full Letter'}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>{isGujarati ? 'સંપૂર્ણ પત્ર જુઓ' : 'View Full Letter'}</span>
                </button>

                <button
                  onClick={() => onNavigateTab(isGujarati ? 'mukhpath' : 'reader')}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold border border-amber-300/40 transition flex items-center gap-2 cursor-pointer"
                >
                  {isGujarati ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>મુખપાઠ સાધના</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span>Read 315 Shlokas</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Authentic Original Blessing Letter Artwork */}
            <div 
              onClick={() => setLightboxImage({ 
                title: isGujarati ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર (૭.૭.\'૨૦)' : 'Official English Blessing Letter (7 July 2020)', 
                type: isGujarati ? 'gujarati' : 'english', 
                src: isGujarati ? letterGujaratiImg : letterEnglishImg 
              })}
              className="relative group cursor-pointer flex-shrink-0 w-44 sm:w-52 md:w-60"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/90 bg-[#1E0A03] p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-amber-500/30">
                <img 
                  src={isGujarati ? letterGujaratiImg : letterEnglishImg} 
                  alt={isGujarati ? 'Original Gujarati Satsang Diksha Blessing Letter' : 'Official English Satsang Diksha Blessing Letter'} 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain rounded-xl shadow-inner"
                />
              </div>

              {/* Zoom badge overlay */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 text-[11px] font-bold shadow-md flex items-center gap-1 transition-all whitespace-nowrap">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isGujarati ? 'ઝૂમ કરો' : 'Zoom Full View'}</span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 1: SATSANG DIKSHA SWADHYAY OVERVIEW & FAST ACTIONS (MAIN BANNER) */}
        {activeSlide === 1 && (
          <div className="w-full p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-7 animate-fadeIn">
            {/* Left description column */}
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-amber-200 text-xs font-semibold border border-amber-300/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{ui.homeAuthorTitle || 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રણીત'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-50 tracking-tight leading-snug">
                {ui.homeHeroTitle || 'સત્સંગ દીક્ષા સ્વાધ્યાય'}
              </h2>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
                {ui.homeHeroDesc || 'ભગવાન સ્વામિનારાયણ પ્રબોધિત અક્ષરપુરુષોત્તમ ઉપાસના અને સદાચારના ૩૧૫ સંસ્કૃત શ્લોકોનું પ્રામાણિક અધ્યયન, પદચ્છેદ, મુખપાઠ અને વચનામૃત અનુસંધાન.'}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
                <button
                  onClick={() => onNavigateTab('reader')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{ui.homeStartShlokBtn || 'શ્લોક અધ્યયન શરૂ કરો'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateTab('udgaan')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/45 text-amber-100 font-semibold border border-amber-300/40 transition flex items-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-amber-300" />
                  <span>{ui.homeUdgaanBtn || 'ઉદ્ગાન શ્રવણ (Audio)'}</span>
                </button>

                <button
                  onClick={() => onNavigateTab('mukhpath')}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 font-semibold border border-amber-300/40 transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{ui.homeMukhpathBtn || 'મુખપાઠ સાધના'}</span>
                </button>
              </div>
            </div>

            {/* Right: Holy App Icon Artwork */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/80 flex-shrink-0 bg-amber-950">
              <img 
                src={appIconImg} 
                alt="Satsang Diksha Scripture" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* LEFT NAV ARROW */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-amber-200 border border-amber-400/40 backdrop-blur-xs transition shadow-lg cursor-pointer z-10 hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* RIGHT NAV ARROW */}
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % totalSlides)}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-amber-200 border border-amber-400/40 backdrop-blur-xs transition shadow-lg cursor-pointer z-10 hover:scale-110 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* BOTTOM SLIDE DOTS & STATS BAR */}
      <div className="border-t border-amber-400/20 bg-black/35 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
        {/* Slide Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx 
                  ? 'w-7 sm:w-9 bg-amber-400 shadow-xs shadow-amber-300' 
                  : 'w-2 sm:w-2.5 bg-amber-200/40 hover:bg-amber-200/70'
              }`}
              title={slideNames[idx]}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="text-[11px] text-amber-300/80 font-serif ml-2 hidden sm:inline">
            {slideNames[activeSlide]} ({activeSlide + 1}/{totalSlides})
          </span>
        </div>

        {/* Fast Stats Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{ui.homeTotalShlokasBadge || 'કુલ શ્લોકો: ૩૧૫'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>મુખપાઠ: <strong>{memorizedCount}</strong> ({Math.round((memorizedCount / 315) * 100)}%)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <BookmarkIcon className="w-4 h-4 text-amber-300" />
            <span>સાચવેલા: <strong>{totalBookmarks}</strong></span>
          </div>
        </div>
      </div>

      {/* FULL LIGHTBOX ZOOM MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-[#1A0903] border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-amber-500/30 flex items-center justify-between gap-3 bg-[#2A1105] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-lg">🪷</span>
                <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-amber-100">
                  {lightboxImage.title}
                </h3>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/40 rounded-xl p-1 border border-amber-400/30 text-xs">
                  <button
                    onClick={() => setLightboxTab('image')}
                    className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                      lightboxTab === 'image' 
                        ? 'bg-amber-500 text-amber-950 font-bold shadow-xs' 
                        : 'text-amber-200 hover:text-amber-100'
                    }`}
                  >
                    છબી (Image)
                  </button>
                  <button
                    onClick={() => setLightboxTab('text')}
                    className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                      lightboxTab === 'text' 
                        ? 'bg-amber-500 text-amber-950 font-bold shadow-xs' 
                        : 'text-amber-200 hover:text-amber-100'
                    }`}
                  >
                    વાંચન (Text)
                  </button>
                </div>

                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-red-950/80 text-amber-200 hover:text-red-200 border border-amber-400/30 transition cursor-pointer"
                  title="બંધ કરો (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-start">
              {lightboxTab === 'image' ? (
                <div className="max-w-2xl w-full flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-[#0D0401]">
                    <img 
                      src={lightboxImage.src || (lightboxImage.type === 'gujarati' ? letterGujaratiImg : letterEnglishImg)} 
                      alt={lightboxImage.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-amber-300/80 font-serif">
                    ગુરુહરિ પ.પૂ. મહંતસ્વામી મહારાજ કૃત નેનપુર આશીર્વાદ પત્ર (૭ જુલાઈ ૨૦૨૦, મંગળવાર)
                  </p>
                </div>
              ) : (
                /* Text Transcript Mode */
                <div className="max-w-2xl w-full space-y-6 text-amber-100">
                  {/* Show letter transcript according to selected language */}
                  {isGujarati ? (
                    <>
                      {/* Gujarati Letter Transcript First */}
                      <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/40 space-y-4 font-serif">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <div className="text-amber-400 font-bold text-sm">મૂળ ગુજરાતી પત્ર પાઠ</div>
                          <div className="text-xs text-amber-200/80">નેનપુર • ૭. ૭. '૨૦</div>
                        </div>
                        <div className="space-y-3 text-sm leading-relaxed">
                          <p className="font-bold text-amber-200">
                            B.A.P.S સંસ્થાના તમામ આશ્રિતો પ્રતિ,
                          </p>
                          <p className="text-amber-100">
                            સાધુ કેશવજીવનદાસ ના સાષ્ટાંગ હેતપૂર્વક જયશ્રી સ્વામિનારાયણ.
                          </p>
                          <p className="text-amber-50 font-medium">
                            વિ. સત્સંગ દીક્ષા ગ્રંથ મહારાજ સ્વામીની કૃપાથી તૈયાર થયો છે. હવે આપણા બધાએ તેના ઓછામાં ઓછા પાંચ શ્લોકોનું વાંચન દરરોજ કરવું. જેમને શક્તિ અને આવડત હોય તેઓ સંસ્કૃત શ્લોકો વાંચે અને યથા શક્તિ મુખપાઠ કરે, એવી અમારી રુચિ છે.
                          </p>
                          <p className="text-amber-50 font-medium">
                            બાળકો - બાલિકાઓ, કિશોરો - કિશોરીઓ, યુવકો - યુવતીઓ મુખપાઠ કરી અક્ષર-પુરુષોત્તમનો ઉદ્ઘોષ કરે, યોગી બાપા અને પ્રમુખ સ્વામી ખૂબ રાજી થશે.
                          </p>
                          <div className="pt-2 text-right">
                            <p className="text-amber-300 font-bold text-base">જયશ્રી સ્વામિનારાયણ</p>
                            <p className="text-xs text-amber-200/70">સાધુ કેશવજીવનદાસ</p>
                          </div>
                        </div>
                      </div>

                      {/* English Letter Transcript Secondary */}
                      <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/40 space-y-4 font-sans">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <div className="text-amber-400 font-bold text-sm">Official English Translation</div>
                          <div className="text-xs text-amber-200/80">Nenpur, India • 7 July 2020</div>
                        </div>
                        <div className="space-y-3 text-sm leading-relaxed">
                          <p className="font-semibold text-amber-200">
                            To All BAPS Devotees,
                          </p>
                          <p className="text-amber-100">
                            Heartfelt Jai Shri Swaminarayan from Sadhu Keshavjivandas
                          </p>
                          <p className="text-amber-50">
                            By the grace of Maharaj and Swami, the 'Satsang Diksha' text has been prepared. Now, all should daily read at least five verses from it. Those who are able to should read the verses in Sanskrit and memorise them as per their capacity. That is my wish.
                          </p>
                          <p className="text-amber-50">
                            May the balaks-balikas, kishores-kishoris, and yuvaks-yuvatis memorize them and proclaim the Akshar-Purushottam [principle]. Yogi Bapa and Pramukh Swami will be extremely pleased.
                          </p>
                          <div className="pt-2 text-right">
                            <p className="text-amber-300 font-bold text-base">Jai Swaminarayan.</p>
                            <p className="text-xs text-amber-200/70">from Sadhu Keshavjivandas</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* English Letter Transcript First */}
                      <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/40 space-y-4 font-sans">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <div className="text-amber-400 font-bold text-sm">Official English Translation</div>
                          <div className="text-xs text-amber-200/80">Nenpur, India • 7 July 2020</div>
                        </div>
                        <div className="space-y-3 text-sm leading-relaxed">
                          <p className="font-semibold text-amber-200">
                            To All BAPS Devotees,
                          </p>
                          <p className="text-amber-100">
                            Heartfelt Jai Shri Swaminarayan from Sadhu Keshavjivandas
                          </p>
                          <p className="text-amber-50">
                            By the grace of Maharaj and Swami, the 'Satsang Diksha' text has been prepared. Now, all should daily read at least five verses from it. Those who are able to should read the verses in Sanskrit and memorise them as per their capacity. That is my wish.
                          </p>
                          <p className="text-amber-50">
                            May the balaks-balikas, kishores-kishoris, and yuvaks-yuvatis memorize them and proclaim the Akshar-Purushottam [principle]. Yogi Bapa and Pramukh Swami will be extremely pleased.
                          </p>
                          <div className="pt-2 text-right">
                            <p className="text-amber-300 font-bold text-base">Jai Swaminarayan.</p>
                            <p className="text-xs text-amber-200/70">from Sadhu Keshavjivandas</p>
                          </div>
                        </div>
                      </div>

                      {/* Original Gujarati Transcript Secondary */}
                      <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/40 space-y-4 font-serif">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <div className="text-amber-400 font-bold text-sm">મૂળ ગુજરાતી પત્ર પાઠ (Original Gujarati)</div>
                          <div className="text-xs text-amber-200/80">નેનપુર • ૭. ૭. '૨૦</div>
                        </div>
                        <div className="space-y-3 text-sm leading-relaxed">
                          <p className="font-bold text-amber-200">
                            B.A.P.S સંસ્થાના તમામ આશ્રિતો પ્રતિ,
                          </p>
                          <p className="text-amber-100">
                            સાધુ કેશવજીવનદાસ ના સાષ્ટાંગ હેતપૂર્વક જયશ્રી સ્વામિનારાયણ.
                          </p>
                          <p className="text-amber-50 font-medium">
                            વિ. સત્સંગ દીક્ષા ગ્રંથ મહારાજ સ્વામીની કૃપાથી તૈયાર થયો છે. હવે આપણા બધાએ તેના ઓછામાં ઓછા પાંચ શ્લોકોનું વાંચન દરરોજ કરવું. જેમને શક્તિ અને આવડત હોય તેઓ સંસ્કૃત શ્લોકો વાંચે અને યથા શક્તિ મુખપાઠ કરે, એવી અમારી રુચિ છે.
                          </p>
                          <div className="pt-2 text-right">
                            <p className="text-amber-300 font-bold text-base">જયશ્રી સ્વામિનારાયણ</p>
                            <p className="text-xs text-amber-200/70">સાધુ કેશવજીવનદાસ</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-amber-500/30 flex items-center justify-between gap-3 bg-[#2A1105] flex-shrink-0">
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <span>📍</span>
                <span>B.A.P.S. Swaminarayan Mandir, Shahibaug Road, Ahmedabad</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
              >
                સમજાયું (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
