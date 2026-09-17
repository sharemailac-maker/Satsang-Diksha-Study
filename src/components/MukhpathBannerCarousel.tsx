import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Quote
} from 'lucide-react';

interface MukhpathBannerCarouselProps {
  memorizedCount: number;
  progressPercent: number;
  lang: string;
}

export const MukhpathBannerCarousel: React.FC<MukhpathBannerCarouselProps> = ({
  memorizedCount,
  progressPercent,
  lang
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<{ title: string; src?: string } | null>(null);
  
  // Custom uploaded quote image stored in localStorage (from Editor session)
  const [customQuoteImg] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mukhpath_banner_quote_img');
    } catch {
      return null;
    }
  });

  // Touch swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const totalSlides = 2;

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative select-none" id="mukhpath-banner-carousel-container">
      {/* Outer Card with Framed aesthetic */}
      <div 
        className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides Track */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {/* SLIDE 1: Existing Mukhpath Progress Sadhana Banner */}
          <div className="w-full flex-shrink-0 bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#D97706] p-5 sm:p-7 text-white border border-amber-400/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
                  <span className="text-xs font-bold tracking-wider uppercase text-amber-200">
                    {lang === 'hindi' ? 'सत्संग दीक्षा मुखपाठ साधना' : lang === 'english' ? 'Satsang Diksha Mukhpath Sadhana' : 'સત્સંગ દીક્ષા મુખપાઠ સાધના'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
                  {lang === 'hindi' ? 'मुखपाठ एवं कंठस्थ अभ्यास' : lang === 'english' ? 'Mukhpath Memorization Mastery' : 'મુખપાઠ સાધના અને કંઠસ્થ અભ્યાસ'}
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl leading-relaxed">
                  {lang === 'hindi' ? 'सभी ३૧૫ संस्कृत श्लोकों को पंक्तिबद्ध स्मरण, फ्लैशकार्ड और शब्दार्थ द्वारा कंठस्थ करें।' : lang === 'english' ? 'Learn, memorize, and master all 315 Sanskrit Shlokas through line-by-line reveal, flashcard testing, and word-by-word recall.' : '૩૧૫ દિવ્ય સંસ્કૃત શ્લોકોનું પદચ્છેદ, શબ્દાર્થ અને ક્રમબદ્ધ પઠન દ્વારા સંપૂર્ણ મુખપાઠ કરો.'}
                </p>
              </div>

              {/* Progress Circle & Counter */}
              <div className="flex items-center gap-4 bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-300/30">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                    {memorizedCount}<span className="text-sm font-normal text-amber-200/80">/315</span>
                  </div>
                  <div className="text-[11px] text-amber-200">
                    {lang === 'hindi' ? 'कंठस्थ श्लोक' : lang === 'english' ? 'Memorized' : 'કંઠસ્થ શ્લોક'}
                  </div>
                </div>
                <div className="h-10 w-px bg-amber-400/30" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                    {progressPercent}%
                  </div>
                  <div className="text-[11px] text-amber-200">
                    {lang === 'hindi' ? 'प्रगति' : lang === 'english' ? 'Completed' : 'સિદ્ધિ'}
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-tier Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-amber-300/20 p-0.5">
                <div 
                  className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-amber-200 font-mono">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>100</span>
                <span>200</span>
                <span>315</span>
              </div>
            </div>

            {/* Milestones Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-amber-400/20">
              <span className="text-xs text-amber-200 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                બિરુદ સિદ્ધિ:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                memorizedCount >= 25 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
              }`}>
                🥉 ૨૫ શ્લોક
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                memorizedCount >= 50 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
              }`}>
                🥈 ૫૦ શ્લોક
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                memorizedCount >= 100 ? 'bg-amber-400 text-amber-950 border-amber-300 font-bold' : 'bg-black/20 text-amber-300/60 border-white/10'
              }`}>
                🥇 ૧૦૦ શ્લોક
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                memorizedCount >= 315 ? 'bg-yellow-300 text-amber-950 border-yellow-100 font-extrabold shadow-md animate-bounce' : 'bg-black/20 text-amber-300/60 border-white/10'
              }`}>
                👑 ૩૧૫ સંપૂર્ણ સિદ્ધિ
              </span>
            </div>
          </div>

          {/* SLIDE 2: Mahant Swami Maharaj Divine Quote Banner */}
          <div className="w-full flex-shrink-0 relative overflow-hidden bg-[#26150F] text-[#FDF8EE] border border-amber-500/40">
            {customQuoteImg ? (
              // Display user's uploaded raw original image
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[350px] bg-[#1a0f0a] flex items-center justify-center overflow-hidden">
                <img 
                  src={customQuoteImg} 
                  alt="પ.પૂ. મહંતસ્વામી મહારાજ મુખપાઠ પ્રેરણા શ્લોક" 
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => setLightboxImage({ title: 'પ.પૂ. મહંતસ્વામી મહારાજ પ્રેરણા આશીર્વાદ', src: customQuoteImg, type: 'quote' })}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => setLightboxImage({ title: 'પ.પૂ. મહંતસ્વામી મહારાજ પ્રેરણા આશીર્વાદ', src: customQuoteImg, type: 'quote' })}
                    className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-amber-200 border border-amber-400/40 text-xs flex items-center gap-1.5 backdrop-blur-xs transition cursor-pointer"
                    title="મોટી સાઈઝમાં જુઓ"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>મોટી સાઈઝમાં જુઓ</span>
                  </button>
                </div>
              </div>
            ) : (
              // Authentic Ornate Framed Sacred Presentation
              <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#3D1E12] via-[#2A130A] to-[#1D0C06] relative overflow-hidden">
                {/* Ornate Gold Border Accent */}
                <div className="absolute inset-2 sm:inset-3 border-2 border-amber-400/30 rounded-2xl pointer-events-none" />
                <div className="absolute inset-3 sm:inset-4 border border-amber-500/15 rounded-xl pointer-events-none" />
                
                {/* Background Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Sacred Gujarati Blessing Quote */}
                  <div className="md:col-span-7 space-y-3.5 sm:space-y-4 pl-2 sm:pl-4">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Quote className="w-6 h-6 text-amber-400/80 rotate-180 flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-300/90 font-serif">
                        દિવ્ય મુખપાઠ પ્રેરણા સૂત્ર
                      </span>
                    </div>

                    <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-100 leading-snug tracking-tight text-balance">
                      “સત્સંગદીક્ષા મોઢે કરે એટલે બધું આવી ગયું.{' '}
                      <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-4">
                        શાસ્ત્ર માત્ર આવી ગયા!
                      </span>”
                    </blockquote>

                    {/* Lotus divider flourish */}
                    <div className="flex items-center gap-2 py-1 text-amber-400/60">
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent flex-1" />
                      <span className="text-base text-amber-400 font-serif">🪷</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent flex-1" />
                    </div>

                    {/* Author Attributions */}
                    <div className="space-y-0.5 text-amber-200/90 font-serif">
                      <div className="text-xs sm:text-sm text-amber-300/80">સત્સંગદીક્ષાના રચયિતા</div>
                      <div className="text-base sm:text-lg font-bold text-amber-300">
                        પ્રગટ ગુરુહરિ પ.પૂ. મહંતસ્વામી મહારાજ
                      </div>
                      <div className="text-xs text-amber-400/70 font-mono">
                        તા. ૯/૫/૨૦૨૬ • સારંગપુર
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Divine Guru Framed Presentation & Controls */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center">
                    <div 
                      onClick={() => setLightboxImage({ title: 'સત્સંગદીક્ષા મુખપાઠ પ્રેરણા સૂત્ર', type: 'quote' })}
                      className="relative group cursor-pointer"
                    >
                      {/* Gold filigree decorative frame */}
                      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-1.5 shadow-2xl shadow-amber-950/60 transition-transform group-hover:scale-[1.02]">
                        <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#FFF5DE] to-[#FCE7BC] p-2 flex flex-col items-center justify-center text-center relative overflow-hidden border border-amber-900/30">
                          {/* Inner Temple Saffron Glow */}
                          <div className="absolute inset-0 bg-radial from-amber-200/40 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Guru Icon / Pranam Symbol */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 to-[#8B2500] p-1 shadow-inner mb-2 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl filter drop-shadow">🙏</span>
                          </div>

                          <span className="text-[11px] sm:text-xs font-serif font-bold text-[#7A1D05] uppercase tracking-wider leading-tight">
                            પ.પૂ. મહંતસ્વામી મહારાજ
                          </span>
                          <span className="text-[10px] text-amber-900/80 font-serif mt-0.5">
                            દિવ્ય આશીર્વાદ
                          </span>
                        </div>
                      </div>

                      {/* Full-view button badge */}
                      <button
                        onClick={() => setLightboxImage({ title: 'સત્સંગદીક્ષા મુખપાઠ પ્રેરણા સૂત્ર' })}
                        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 text-[11px] font-bold shadow-md flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer"
                        title="વિસ્તારથી જુઓ"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>વિસ્તૃત જુઓ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          id="btn-banner-prev"
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-amber-200 border border-amber-400/40 backdrop-blur-xs flex items-center justify-center transition shadow-lg z-20 hover:scale-105 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          id="btn-banner-next"
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-amber-200 border border-amber-400/40 backdrop-blur-xs flex items-center justify-center transition shadow-lg z-20 hover:scale-105 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Pagination Dots & Swipe Hint */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-0 right-0 flex items-center justify-between px-4 sm:px-6 pointer-events-none z-20">
          {/* Slide Title / Category Pill */}
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/30 text-[10px] sm:text-[11px] text-amber-200 font-medium">
            {activeSlide === 0 ? '૧. મુખપાઠ પ્રગતિ' : '૨. સ્વામીશ્રી પ્રેરણા સૂત્ર'}
          </div>

          {/* Indicators Dots */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30">
            {[0, 1].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx 
                    ? 'w-6 bg-amber-400 shadow-xs' 
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide counter badge */}
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30 text-[10px] text-amber-300 font-mono">
            {activeSlide + 1} / {totalSlides}
          </div>
        </div>
      </div>

      {/* LIGHTBOX / FULL-VIEW MODAL FOR QUOTE */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#241610] text-[#FDF8EE] rounded-3xl border-2 border-amber-400/60 shadow-2xl p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/30 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl text-amber-400">🪷</span>
                <h3 className="text-base sm:text-xl font-serif font-bold text-amber-200">
                  {lightboxImage.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="w-9 h-9 rounded-full bg-amber-950 hover:bg-amber-900 border border-amber-400/40 text-amber-200 flex items-center justify-center transition"
                title="બંધ કરો"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {lightboxImage.src ? (
              <div className="flex items-center justify-center bg-black/40 rounded-2xl p-2 sm:p-4 border border-amber-400/20">
                <img 
                  src={lightboxImage.src} 
                  alt={lightboxImage.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              /* High-Res Full Frame for Quote */
              <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFF9EA] to-[#FBF2DE] text-[#2C1808] p-6 sm:p-10 rounded-2xl border-4 border-amber-600 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#8B2500] uppercase tracking-widest">
                    શ્રી અક્ષર-પુરુષોત્તમ મહારાજની જય
                  </span>
                  <div className="text-sm font-serif text-amber-900">
                    પરમ પૂજ્ય મહંતસ્વામી મહારાજનું દિવ્ય પ્રેરણા સૂત્ર
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-xl bg-amber-100/60 border-2 border-amber-300 text-center space-y-4">
                  <div className="text-amber-700 text-3xl font-serif">“</div>
                  <blockquote className="text-2xl sm:text-4xl font-serif font-extrabold text-[#7A1D05] leading-relaxed">
                    સત્સંગદીક્ષા મોઢે કરે એટલે બધું આવી ગયું. શાસ્ત્ર માત્ર આવી ગયા!
                  </blockquote>
                  <div className="text-amber-700 text-3xl font-serif">”</div>
                </div>

                <div className="flex items-center justify-center gap-3 text-amber-700">
                  <div className="h-px bg-amber-400/60 w-16 sm:w-28" />
                  <span className="text-xl">🪷</span>
                  <div className="h-px bg-amber-400/60 w-16 sm:w-28" />
                </div>

                <div className="text-center space-y-1 font-serif">
                  <div className="text-sm text-amber-900 font-medium">સત્સંગદીક્ષાના રચયિતા</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#7A1D05]">
                    પ.પૂ. મહંતસ્વામી મહારાજ
                  </div>
                  <div className="text-xs sm:text-sm text-amber-800 font-mono">
                    તા. ૯/૫/૨૦૨૬, સારંગપુર
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="mt-6 pt-4 border-t border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2 text-amber-300/90 font-serif">
                <span>🪷</span>
                <span className="text-xs sm:text-sm">પ્રગટ ગુરુહરિ પ.પૂ. મહંતસ્વામી મહારાજ દિવ્ય પ્રેરણા</span>
              </div>

              <button
                onClick={() => setLightboxImage(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold transition shadow-md text-xs sm:text-sm cursor-pointer"
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
