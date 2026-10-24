import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ZoomIn
} from 'lucide-react';
import letterGujaratiImg from '../assets/images/satsang_diksha_original_letter_gujarati.jpg';
import letterEnglishImg from '../assets/images/satsang_diksha_original_letter_english.jpg';

interface HomeLettersBannerProps {
  onNavigateTab?: (tab: string, chapterId?: number | null) => void;
  memorizedCount?: number;
  totalBookmarks?: number;
  ui?: Record<string, string>;
  activeLanguage?: string;
}

export const HomeLettersBanner: React.FC<HomeLettersBannerProps> = ({
  activeLanguage = 'gujarati'
}) => {
  const [lightboxImage, setLightboxImage] = useState<{ 
    title: string; 
    type: 'gujarati' | 'english'; 
    src?: string;
  } | null>(null);
  const [lightboxTab, setLightboxTab] = useState<'image' | 'text'>('image');

  const isGujarati = activeLanguage === 'gujarati';

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage && e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  const letterTitle = isGujarati 
    ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર • નેનપુર, ૭-૭-\'૨૦' 
    : 'Official English Blessing Letter • Nenpur, 7 July 2020';

  const letterImgSrc = isGujarati ? letterGujaratiImg : letterEnglishImg;

  const openLightbox = () => {
    setLightboxImage({ 
      title: letterTitle, 
      type: isGujarati ? 'gujarati' : 'english', 
      src: letterImgSrc 
    });
  };

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-gradient-to-r from-[#631800] via-[#852300] to-[#A34200] text-white select-none transition-all"
      id="home-blessing-letter-banner"
    >
      {/* Background ambient sacred pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/25 via-transparent to-black/45 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-4">
        {/* Top: Date & Day Line (Only this line is retained per user request) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 text-amber-200 text-xs sm:text-sm font-bold border border-amber-400/50 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>
            {isGujarati 
              ? 'મૂળ હસ્તલિખિત પત્ર • નેનપુર, ૭-૭-\'૨૦ (મંગળવાર)'
              : 'Official English Blessing Letter • Nenpur, 7 July 2020 (Tuesday)'}
          </span>
        </div>

        {/* Large Prominently Displayed Letter Artwork */}
        <div 
          onClick={openLightbox}
          className="relative group cursor-pointer w-full max-w-sm sm:max-w-md md:max-w-lg transition-transform duration-300 hover:scale-[1.015]"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/90 bg-[#1E0A03] p-2 transition-all group-hover:border-amber-400 group-hover:shadow-amber-500/40">
            <img 
              src={letterImgSrc} 
              alt={isGujarati ? 'મૂળ ગુજરાતી આશીર્વાદ પત્ર' : 'Official English Blessing Letter'} 
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[460px] sm:max-h-[540px] md:max-h-[600px] object-contain rounded-xl shadow-inner mx-auto"
            />
          </div>

          {/* Zoom Instruction Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer">
            <ZoomIn className="w-4 h-4" />
            <span>{isGujarati ? 'પત્ર પર ઝૂમ કરો' : 'Zoom Full View'}</span>
          </div>
        </div>

        {/* Subtle spacing buffer for zoom button */}
        <div className="h-2" />
      </div>

      {/* FULL LIGHTBOX ZOOM MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-[#1A0903] border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-amber-500/30 flex items-center justify-between gap-3 bg-[#2A1105] shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-lg">🪷</span>
                <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-amber-100">
                  {lightboxImage.title}
                </h3>
              </div>

              {/* View Switcher Tabs: Image vs Text */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/40 rounded-xl p-1 border border-amber-400/30 text-xs">
                  <button
                    type="button"
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
                    type="button"
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
                  type="button"
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
                /* High Resolution Image View */
                <div className="max-w-2xl w-full flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-[#0D0401]">
                    <img 
                      src={letterImgSrc} 
                      alt={lightboxImage.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[72vh] object-contain rounded-xl"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-amber-300/80 font-serif">
                    ગુરુહરિ પ.પૂ. મહંતસ્વામી મહારાજ કૃત નેનપુર આશીર્વાદ પત્ર (૭ જુલાઈ ૨૦૨૦, મંગળવાર)
                  </p>
                </div>
              ) : (
                /* Text Transcript Mode with Underlined, Bold, Distinct Colored Highlighted Text */
                <div className="max-w-2xl w-full space-y-6 text-amber-100">
                  {isGujarati ? (
                    <>
                      {/* Gujarati Letter Transcript */}
                      <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/40 space-y-4 font-serif">
                        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                          <div className="text-amber-400 font-bold text-sm">મૂળ ગુજરાતી પત્ર પાઠ</div>
                          <div className="text-xs text-amber-200/80">નેનપુર • ૭. ૭. '૨૦</div>
                        </div>
                        <div className="space-y-3.5 text-sm leading-relaxed">
                          <p className="font-bold text-amber-200">
                            B.A.P.S સંસ્થાના તમામ આશ્રિતો પ્રતિ,
                          </p>
                          <p className="text-amber-100">
                            સાધુ કેશવજીવનદાસ ના સાષ્ટાંગ હેતપૂર્વક જયશ્રી સ્વામિનારાયણ.
                          </p>
                          <p className="text-amber-50 font-medium">
                            વિ. સત્સંગ દીક્ષા ગ્રંથ મહારાજ સ્વામીની કૃપાથી તૈયાર થયો છે.{' '}
                            {/* Highlighted text with underline, bold, and distinct golden-yellow color */}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              હવે આપણા બધાએ તેના ઓછામાં ઓછા પાંચ શ્લોકોનું વાંચન દરરોજ કરવું.
                            </span>{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              જેમને શક્તિ અને આવડત હોય તેઓ સંસ્કૃત શ્લોકો વાંચે અને યથા શક્તિ મુખપાઠ કરે, એવી અમારી રુચિ છે.
                            </span>
                          </p>
                          <p className="text-amber-50 font-medium">
                            {/* Highlighted text with underline, bold, and distinct golden-yellow color */}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              બાળકો - બાલિકાઓ, કિશોરો - કિશોરીઓ, યુવકો - યુવતીઓ મુખપાઠ કરી અક્ષર-પુરુષોત્તમનો ઉદ્ઘોષ કરે, યોગી બાપા અને પ્રમુખ સ્વામી ખૂબ રાજી થશે.
                            </span>
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
                        <div className="space-y-3.5 text-sm leading-relaxed">
                          <p className="font-semibold text-amber-200">
                            To All BAPS Devotees,
                          </p>
                          <p className="text-amber-100">
                            Heartfelt Jai Shri Swaminarayan from Sadhu Keshavjivandas
                          </p>
                          <p className="text-amber-50">
                            By the grace of Maharaj and Swami, the 'Satsang Diksha' text has been prepared.{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              Now, all should daily read at least five verses from it.
                            </span>{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              Those who are able to should read the verses in Sanskrit and memorise them as per their capacity. That is my wish.
                            </span>
                          </p>
                          <p className="text-amber-50">
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              May the balaks-balikas, kishores-kishoris, and yuvaks-yuvatis memorize them and proclaim the Akshar-Purushottam [principle]. Yogi Bapa and Pramukh Swami will be extremely pleased.
                            </span>
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
                        <div className="space-y-3.5 text-sm leading-relaxed">
                          <p className="font-semibold text-amber-200">
                            To All BAPS Devotees,
                          </p>
                          <p className="text-amber-100">
                            Heartfelt Jai Shri Swaminarayan from Sadhu Keshavjivandas
                          </p>
                          <p className="text-amber-50">
                            By the grace of Maharaj and Swami, the 'Satsang Diksha' text has been prepared.{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              Now, all should daily read at least five verses from it.
                            </span>{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              Those who are able to should read the verses in Sanskrit and memorise them as per their capacity. That is my wish.
                            </span>
                          </p>
                          <p className="text-amber-50">
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              May the balaks-balikas, kishores-kishoris, and yuvaks-yuvatis memorize them and proclaim the Akshar-Purushottam [principle]. Yogi Bapa and Pramukh Swami will be extremely pleased.
                            </span>
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
                        <div className="space-y-3.5 text-sm leading-relaxed">
                          <p className="font-bold text-amber-200">
                            B.A.P.S સંસ્થાના તમામ આશ્રિતો પ્રતિ,
                          </p>
                          <p className="text-amber-100">
                            સાધુ કેશવજીવનદાસ ના સાષ્ટાંગ હેતપૂર્વક જયશ્રી સ્વામિનારાયણ.
                          </p>
                          <p className="text-amber-50 font-medium">
                            વિ. સત્સંગ દીક્ષા ગ્રંથ મહારાજ સ્વામીની કૃપાથી તૈયાર થયો છે.{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              હવે આપણા બધાએ તેના ઓછામાં ઓછા પાંચ શ્લોકોનું વાંચન દરરોજ કરવું.
                            </span>{' '}
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              જેમને શક્તિ અને આવડત હોય તેઓ સંસ્કૃત શ્લોકો વાંચે અને યથા શક્તિ મુખપાઠ કરે, એવી અમારી રુચિ છે.
                            </span>
                          </p>
                          <p className="text-amber-50 font-medium">
                            <span className="font-extrabold underline decoration-amber-400 decoration-2 text-yellow-300 bg-amber-950/60 px-1 py-0.5 rounded inline">
                              બાળકો - બાલિકાઓ, કિશોરો - કિશોરીઓ, યુવકો - યુવતીઓ મુખપાઠ કરી અક્ષર-પુરુષોત્તમનો ઉદ્ઘોષ કરે, યોગી બાપા અને પ્રમુખ સ્વામી ખૂબ રાજી થશે.
                            </span>
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
            <div className="p-4 border-t border-amber-500/30 flex items-center justify-between gap-3 bg-[#2A1105] shrink-0">
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <span>📍</span>
                <span>B.A.P.S. Swaminarayan Mandir, Shahibaug Road, Ahmedabad</span>
              </div>
              <button
                type="button"
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
