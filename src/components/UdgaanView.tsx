import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers, 
  ExternalLink,
  Music,
  Check,
  Headphones,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Shloka, UserPreferences } from '../types';

interface UdgaanViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onSelectShloka?: (shlokaId: number) => void;
}

interface UdgaanSection {
  id: number;
  titleGu: string;
  titleEn: string;
  titleDeva: string;
  range: [number, number];
  descriptionGu: string;
  descriptionEn: string;
}

const UDGAAN_SECTIONS: UdgaanSection[] = [
  {
    id: 1,
    titleGu: 'ઉદ્ગાન ૧ (Udgaan 1)',
    titleEn: 'Udgaan 1 (Verses 1–53)',
    titleDeva: 'उद्गानम् १ (श्लोकाः १–५३)',
    range: [1, 53],
    descriptionGu: 'મંગલાચરણ, શાસ્ત્ર હેતુ, પ્રાતઃપૂજા અને નિત્ય આહ્નિક વિધિ',
    descriptionEn: 'Invocation, purpose of scripture, morning puja, and daily rites'
  },
  {
    id: 2,
    titleGu: 'ઉદ્ગાન ૨ (Udgaan 2)',
    titleEn: 'Udgaan 2 (Verses 54–105)',
    titleDeva: 'उद्गानम् २ (श्लोकाः ५४–१०५)',
    range: [54, 105],
    descriptionGu: 'તિલક-ચાંદલો, કંઠી ધારણ, આહાર શુદ્ધિ અને સદાચાર નિયમો',
    descriptionEn: 'Tilak-chandlo, kanthi, dietary purity, and moral conduct'
  },
  {
    id: 3,
    titleGu: 'ઉદ્ગાન ૩ (Udgaan 3)',
    titleEn: 'Udgaan 3 (Verses 106–158)',
    titleDeva: 'उद्गानम् ३ (श्लोकाः १०६–१५८)',
    range: [106, 158],
    descriptionGu: 'નિર્વ્યસની જીવન, અહિંસા, સત્સંગ સભા અને ઘરસભા મર્યાદા',
    descriptionEn: 'Addiction-free living, non-violence, satsang assembly, and home assembly'
  },
  {
    id: 4,
    titleGu: 'ઉદ્ગાન ૪ (Udgaan 4)',
    titleEn: 'Udgaan 4 (Verses 159–210)',
    titleDeva: 'उद्गानम् ४ (श्लोकाः १५૯–२१०)',
    range: [159, 210],
    descriptionGu: 'પારિવારિક સંવાદિતા, માતા-પિતા ભક્તિ અને વ્યવહાર શુદ્ધિ',
    descriptionEn: 'Family harmony, devotion to parents, and social integrity'
  },
  {
    id: 5,
    titleGu: 'ઉદ્ગાન ૫ (Udgaan 5)',
    titleEn: 'Udgaan 5 (Verses 211–263)',
    titleDeva: 'उद्गानम् ५ (श्लोकाः २११–२६३)',
    range: [211, 263],
    descriptionGu: 'અંતઃશત્રુ વિજય, નિર્દોષબુદ્ધિ, મહિમા ચિંતન અને દિવ્યભાવ',
    descriptionEn: 'Overcoming inner enemies, faultlessness, divine glory, and spiritual vision'
  },
  {
    id: 6,
    titleGu: 'ઉદ્ગાન ૬ (Udgaan 6)',
    titleEn: 'Udgaan 6 (Verses 264–315)',
    titleDeva: 'उद्गानम् ६ (श्लोकाः २६४–३१५)',
    range: [264, 315],
    descriptionGu: 'અક્ષરપુરુષોત્તમ દાર્શનિક સિદ્ધાંત, ગુરુભક્તિ, આશીર્વાદ અને ફલશ્રુતિ',
    descriptionEn: 'Akshar-Purushottam philosophy, devotion to Guru, blessings, and fruits'
  }
];

export const UdgaanView: React.FC<UdgaanViewProps> = ({ shlokas, preferences, onSelectShloka }) => {
  const [selectedUdgaanId, setSelectedUdgaanId] = useState<number>(1);
  const [groupingMode, setGroupingMode] = useState<'udgaan' | '5' | '10' | '25' | 'all' | 'custom'>('udgaan');
  const [customRange, setCustomRange] = useState<[number, number]>([1, 10]);
  
  const [currentShlokaId, setCurrentShlokaId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoAdvance, setIsAutoAdvance] = useState<boolean>(true);
  const [isLoopCurrent, setIsLoopCurrent] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);

  // Determine current active verse range based on groupingMode
  const activeRange = useMemo<[number, number]>(() => {
    if (groupingMode === 'udgaan') {
      const section = UDGAAN_SECTIONS.find(s => s.id === selectedUdgaanId) || UDGAAN_SECTIONS[0];
      return section.range;
    }
    if (groupingMode === '5') {
      const start = Math.floor((currentShlokaId - 1) / 5) * 5 + 1;
      const end = Math.min(315, start + 4);
      return [start, end];
    }
    if (groupingMode === '10') {
      const start = Math.floor((currentShlokaId - 1) / 10) * 10 + 1;
      const end = Math.min(315, start + 9);
      return [start, end];
    }
    if (groupingMode === '25') {
      const start = Math.floor((currentShlokaId - 1) / 25) * 25 + 1;
      const end = Math.min(315, start + 24);
      return [start, end];
    }
    if (groupingMode === 'all') {
      return [1, 315];
    }
    return customRange;
  }, [groupingMode, selectedUdgaanId, currentShlokaId, customRange]);

  // List of shlokas in active range
  const activeShlokas = useMemo(() => {
    const [start, end] = activeRange;
    return shlokas.filter(s => s.id >= start && s.id <= end);
  }, [shlokas, activeRange]);

  // Get current shloka object
  const currentShloka = useMemo(() => {
    return shlokas.find(s => s.id === currentShlokaId) || shlokas[0];
  }, [shlokas, currentShlokaId]);

  // Build audio URL for the given shloka ID
  const getAudioUrl = (id: number) => {
    const numStr = id < 10 ? `00${id}` : id < 100 ? `0${id}` : `${id}`;
    return `https://ia601703.us.archive.org/35/items/satsang_diksha/sanskrit_${numStr}.mp3`;
  };

  // Switch to a specific shloka
  const playShloka = (shlokaId: number, autoPlay: boolean = true) => {
    setCurrentShlokaId(shlokaId);
    setHasError(false);
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(shlokaId);
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.muted = isMuted;
      if (autoPlay) {
        setIsLoadingAudio(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch(err => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          setHasError(true);
        });
      }
    }
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        playShloka(currentShlokaId, true);
      } else {
        setIsLoadingAudio(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch(() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
      }
    }
  };

  // Previous Shloka
  const handlePrevious = () => {
    const [start, end] = activeRange;
    let nextId = currentShlokaId - 1;
    if (nextId < start) {
      nextId = end;
    }
    playShloka(nextId, isPlaying);
  };

  // Next Shloka
  const handleNext = () => {
    const [start, end] = activeRange;
    let nextId = currentShlokaId + 1;
    if (nextId > end) {
      nextId = start;
    }
    playShloka(nextId, isPlaying);
  };

  // On audio ended
  const handleAudioEnded = () => {
    if (isLoopCurrent) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (isAutoAdvance) {
      const [start, end] = activeRange;
      if (currentShlokaId < end) {
        playShloka(currentShlokaId + 1, true);
      } else {
        // At the end of range, loop back to start
        playShloka(start, true);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Update speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Select an Udgaan section
  const handleSelectUdgaan = (section: UdgaanSection) => {
    setSelectedUdgaanId(section.id);
    setGroupingMode('udgaan');
    playShloka(section.range[0], isPlaying);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = getAudioUrl(currentShlokaId);
    audio.playbackRate = playbackSpeed;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoadingAudio(false);
    };

    const onEnded = () => handleAudioEnded();

    const onError = () => {
      setIsLoadingAudio(false);
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Auto-scroll active verse card into view inside the list
  useEffect(() => {
    if (activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentShlokaId]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 animate-fadeIn pb-24">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-400/40 bg-gradient-to-r from-[#691800] via-[#8B2500] to-[#A03900] text-white p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 text-amber-200 text-xs font-semibold border border-amber-300/30">
              <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>BAPS અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50 tracking-tight">
              સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
              ભગવાન સ્વામિનારાયણ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. ૧ થી ૬ ઉદ્ગાન અથવા જૂથવાર અવિરત મંગલ ગાન.
            </p>
          </div>

          <a 
            href="https://www.baps.org/Publications/Books/Satsang-Diksha-1402.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 text-xs font-semibold border border-amber-300/40 transition whitespace-nowrap shadow-sm"
          >
            <span>BAPS સત્તાવાર પ્રકાશન</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 6 MAIN UDGAANS SELECTION TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>૧ થી ૬ મુખ્ય ઉદ્ગાન વિભાગો (6 Main Udgaans)</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            ૩૧૫ શ્લોક પૂર્ણ સંગ્રહ
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {UDGAAN_SECTIONS.map((section) => {
            const isSelected = groupingMode === 'udgaan' && selectedUdgaanId === section.id;
            return (
              <button
                key={section.id}
                id={`udgaan-tab-${section.id}`}
                onClick={() => handleSelectUdgaan(section)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#8B2500] to-[#B33900] text-amber-50 border-amber-400 shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-[#221D1A] text-[#4A3E34] dark:text-[#C5B7A8] border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 dark:bg-[#2E241E] text-amber-900 dark:text-amber-300'
                    }`}>
                      ઉદ્ગાન {section.id}
                    </span>
                    {isSelected && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm mt-1.5">
                    શ્લોક {section.range[0]} થી {section.range[1]}
                  </h4>
                </div>
                <p className={`text-[10px] mt-1 line-clamp-2 ${
                  isSelected ? 'text-amber-200/90' : 'text-[#7A6B5C] dark:text-[#A89886]'
                }`}>
                  {section.descriptionGu}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* GROUPING & CUSTOM RANGE CONTROLS */}
      <div className="p-4 bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B2500] dark:text-amber-300">
          <Sliders className="w-4 h-4" />
          <span>શ્લોક જૂથ શ્રવણ વિકલ્પ (Group Playback):</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {[
            { id: 'udgaan', label: '૬ ઉદ્ગાન' },
            { id: '5', label: '૫ શ્લોક જૂથ' },
            { id: '10', label: '૧૦ શ્લોક જૂથ' },
            { id: '25', label: '૨૫ શ્લોક જૂથ' },
            { id: 'all', label: '૩૧૫ અખંડ પાઠ' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setGroupingMode(mode.id as any);
                if (mode.id === 'all') {
                  playShloka(1, isPlaying);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                groupingMode === mode.id
                  ? 'bg-[#8B2500] text-amber-50 font-bold shadow-xs'
                  : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#B5A595] hover:bg-amber-100'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE PLAYING SHLOKA HERO CARD */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-amber-400/40 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Shloka Meta Ribbon */}
        <div className="flex items-center justify-between border-b border-[#F0E8DC] dark:border-[#352C24] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-amber-950 font-bold text-base flex items-center justify-center shadow-md border border-amber-300">
              #{currentShloka.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300">
                  સત્સંગ દીક્ષા • શ્લોક {currentShloka.id}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  {UDGAAN_SECTIONS.find(u => currentShloka.id >= u.range[0] && currentShloka.id <= u.range[1])?.titleGu || 'ઉદ્ગાન'}
                </span>
              </div>
              <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                પ્રકરણ {currentShloka.chapterId}: {currentShloka.chapterGu}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSelectShloka && (
              <button
                onClick={() => onSelectShloka(currentShloka.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-[#2E241E] text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-200 transition"
              >
                અધ્યયન જુઓ
              </button>
            )}
          </div>
        </div>

        {/* Sanskrit Verse Chanting Display */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#1A1512] border-2 border-amber-500/30 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>॥ શ્રી સ્વામિનારાયણો વિજયતે ॥</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <p className="font-sanskrit font-bold text-xl sm:text-2xl text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide">
            {currentShloka.sanskritDevanagari}
          </p>

          <p className="font-gujarati font-semibold text-base sm:text-lg text-[#8B2500] dark:text-amber-300 leading-relaxed">
            {currentShloka.sanskritGujarati}
          </p>

          <p className="text-xs text-[#8A7A68] dark:text-[#A89886] font-mono italic">
            {currentShloka.sanskritIast}
          </p>
        </div>

        {/* Meaning Preview in Gujarati */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-[#251D17] border-l-4 border-[#8B2500] text-xs space-y-1">
          <div className="font-bold text-[#8B2500] dark:text-amber-300">
            મૂળ ગુજરાતી ભાવાર્થ:
          </div>
          <p className="font-gujarati text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed text-sm">
            {currentShloka.meaningGu}
          </p>
        </div>

        {/* Audio Scrubber & Controls */}
        <div className="space-y-4 pt-2 border-t border-[#F0E8DC] dark:border-[#352C24]">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#7A6B5C] dark:text-[#A89886] font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{isLoadingAudio ? 'લોડ થઈ રહ્યું છે...' : formatTime(duration)}</span>
            </div>
            <div className="w-full bg-[#E8DFD1] dark:bg-[#3D342C] h-2 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="bg-gradient-to-r from-amber-500 to-[#8B2500] h-full rounded-full transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Playback mode options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoAdvance(!isAutoAdvance)}
                title={isAutoAdvance ? 'અવિરત ક્રમિક ગાન ચાલુ' : 'અવિરત ક્રમિક ગાન બંધ'}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isAutoAdvance 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 border-amber-300' 
                    : 'bg-[#FAF6F0] dark:bg-[#221D1A] text-stone-400 border-stone-300'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span className="hidden sm:inline">અવિરત ગાન</span>
              </button>

              <button
                onClick={() => setIsLoopCurrent(!isLoopCurrent)}
                title={isLoopCurrent ? 'શ્લોક પુનરાવર્તન ચાલુ (Loop)' : 'શ્લોક પુનરાવર્તન બંધ'}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isLoopCurrent 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 border-amber-300' 
                    : 'bg-[#FAF6F0] dark:bg-[#221D1A] text-stone-400 border-stone-300'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">આ શ્લોક લૂપ</span>
              </button>
            </div>

            {/* Core Play / Skip Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                title="પાછલો શ્લોક (Previous Shloka)"
                className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2E241E] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 transition shadow-xs"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                id="udgaan-play-btn"
                title={isPlaying ? 'વિરામ (Pause)' : 'શ્રવણ શરૂ કરો (Play)'}
                className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-[#8B2500] text-amber-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-amber-950" />
                ) : (
                  <Play className="w-7 h-7 fill-amber-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                title="આગલો શ્લોક (Next Shloka)"
                className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2E241E] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 transition shadow-xs"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-[#FAF6F0] dark:bg-[#2A221C] p-1 rounded-xl border border-[#E8DFD1] dark:border-[#3D342C]">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                    playbackSpeed === speed
                      ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                      : 'text-[#6B5E51] dark:text-[#A89886] hover:text-[#8B2500]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHLOKAS LIST IN CURRENT UDGAAN / GROUP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-500" />
            <span>શ્લોક યાદી (શ્લોક {activeRange[0]} થી {activeRange[1]} - કુલ {activeShlokas.length})</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            ક્લિક કરી સીધા ગાન સાંભળો
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-1 no-scrollbar">
          {activeShlokas.map((s) => {
            const isCurrent = s.id === currentShlokaId;
            return (
              <div
                key={s.id}
                ref={isCurrent ? activeVerseRef : undefined}
                onClick={() => playShloka(s.id, true)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white dark:bg-[#221D1A] border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-400 hover:bg-amber-50/40'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs flex-shrink-0 ${
                    isCurrent 
                      ? 'bg-[#8B2500] text-amber-50 shadow-sm' 
                      : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#8B2500] dark:text-amber-300 border border-amber-200 dark:border-[#3D342C]'
                  }`}>
                    #{s.id}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-sanskrit text-sm font-bold truncate ${
                      isCurrent ? 'text-[#8B2500] dark:text-amber-300' : 'text-[#4A3E34] dark:text-[#DCD1C3]'
                    }`}>
                      {s.sanskritDevanagari}
                    </p>
                    <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] truncate">
                      {s.meaningGu}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <span className="w-1 bg-[#8B2500] dark:bg-amber-400 h-full animate-bounce rounded-full" />
                      <span className="w-1 bg-[#8B2500] dark:bg-amber-400 h-2/3 animate-bounce rounded-full [animation-delay:0.2s]" />
                      <span className="w-1 bg-[#8B2500] dark:bg-amber-400 h-4/5 animate-bounce rounded-full [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <Play className={`w-4 h-4 ${isCurrent ? 'text-[#8B2500] dark:text-amber-300' : 'text-stone-400'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
