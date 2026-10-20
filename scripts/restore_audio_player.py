import re

new_content = """import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Music, 
  Check, 
  Headphones, 
  Sliders, 
  Sparkles, 
  AlertCircle,
  Disc3,
  ListFilter
} from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { AudioFormat, AUDIO_FORMAT_OPTIONS, getAudioUrls, globalAudio } from '../utils/audioPlayer';
import { getShlokaMeaning, getShlokaChapterName, LANGUAGE_METADATA } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface UdgaanViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onSelectShloka?: (shlokaId: number) => void;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
}

export interface PresetRange {
  id: number;
  labelGu: string;
  labelHi: string;
  labelEn: string;
  range: [number, number];
}

export const PRESET_RANGES: PresetRange[] = [
  { id: 1, range: [1, 50], labelGu: '૧–૫૦', labelHi: '१–५०', labelEn: '1–50' },
  { id: 2, range: [51, 115], labelGu: '૫૧–૧૧૫', labelHi: '५१–११५', labelEn: '51–115' },
  { id: 3, range: [116, 158], labelGu: '૧૧૬–૧૫૮', labelHi: '११६–१५૮', labelEn: '116–158' },
  { id: 4, range: [159, 208], labelGu: '૧૫૯–૨૦૮', labelHi: '१५९–२०૮', labelEn: '159–208' },
  { id: 5, range: [209, 257], labelGu: '૨૦૯–૨૫૭', labelHi: '२०९–२૫૭', labelEn: '209–257' },
  { id: 6, range: [258, 315], labelGu: '૨૫૮–૩૧૫', labelHi: '२५૮–३૧૫', labelEn: '258–315' },
];

const UDGAAN_I18N = {
  gujarati: {
    tag: 'અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)',
    title: 'સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ',
    desc: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. પુરૂષ સ્વરમાં મધુર બેકગ્રાઉન્ડ સંગીત સાથે અવિરત મંગલ ગાન.',
    badge: '૩૧૫ શ્લોક • અવિરત વૈદિક ગાન',
    voiceStyleTitle: 'સ્વર અને ગાન શૈલી (Audio Voice & Raag):',
    voiceStyleDesc: 'સંગીત સાથે મૂળ પુરૂષ સ્વર (Male Voice with Background Music)',
    playbackModeLabel: 'શ્રવણ વિકલ્પ (Playback Mode):',
    singleVerseMode: '૧ શ્લોક શ્રવણ (Play 1 Shloka)',
    groupVerseMode: 'જૂથ / શ્રેણી શ્રવણ (Group Range)',
    rangePlaybackTitle: 'શ્લોક શ્રેણી જૂથ શ્રવણ (Shloka Range Selection)',
    rangePlaybackDesc: 'કોઈપણ શ્લોક ૧ થી ૩૧૫ વચ્ચેનો પ્રારંભિક અને અંતિમ શ્લોક પસંદ કરી અવિરત જૂથ શ્રવણ કરો',
    startVerseLabel: 'પ્રારંભિક શ્લોક',
    endVerseLabel: 'અંતિમ શ્લોક',
    totalVersesBadge: (count: number) => `કુલ ${count} શ્લોક શ્રેણી`,
    playRangeBtn: (start: number, end: number) => `શ્લોક ${start} થી ${end} શ્રવણ શરૂ કરો`,
    quickPresetsLabel: 'ઝડપી શ્લોક શ્રેણી વિકલ્પો:',
    fullScriptureChanting: 'સર્વ ૧ થી ૩૧૫ અખંડ પાઠ',
    rangePrefix: (start: number, end: number) => `શ્લોક ${start} થી ${end}`,
    activeHeroVerseTitle: (id: number) => `સત્સંગ દીક્ષા • શ્લોક ${id}`,
    studyBtn: 'અધ્યયન જુઓ',
    mangalChanting: '॥ શ્રી સ્વામિનારાયણો વિજયતે ॥',
    originalMeaningTitle: 'મૂળ ગુજરાતી ભાવાર્થ:',
    translatedMeaningTitle: 'ભાવાર્થ:',
    audioConnecting: 'ઓડિયો કનેક્ટ થઈ રહ્યું છે, કૃપા કરીને Play બટન ફરી દબાવો.',
    loading: 'લોડ થઈ રહ્યું છે...',
    continuousPlayback: 'અવિરત ગાન',
    continuousPlaybackTitle: (active: boolean) => active ? 'અવિરત ક્રમિક ગાન ચાલુ (Auto-advance ON)' : 'અવિરત ક્રમિક ગાન બંધ (Auto-advance OFF)',
    loopVerse: 'આ શ્લોક લૂપ',
    loopVerseActive: 'વારંવાર શ્રવણ ચાલુ',
    loopVerseTitle: (active: boolean) => active ? 'આ શ્લોક વારંવાર ગવાશે (Loop ON)' : 'આ શ્લોક વારંવાર સાંભળો (Loop OFF)',
    prevVerseTitle: 'પાછલો શ્લોક (Previous Shloka)',
    nextVerseTitle: 'આગલો શ્લોક (Next Shloka)',
    playTitle: 'શ્રવણ શરૂ કરો (Play)',
    pauseTitle: 'વિરામ (Pause)',
    speedLabel: 'ગતિ (Speed):',
    verseListTitle: (start: number, end: number, count: number, isSingle: boolean) => 
      isSingle ? `સંપૂર્ણ ૩૧૫ શ્લોક યાદી (ક્લિક કરી સાંભળો)` : `શ્લોક યાદી (શ્લોક ${start} થી ${end} - કુલ ${count})`,
    verseListSubtitle: 'ક્લિક કરી સીધા ગાન સાંભળો',
    chapterPrefix: 'પ્રકરણ'
  },
  hindi: {
    tag: 'अधिकृत संस्कृत उद्गान (Authentic Vedic Chanting)',
    title: 'सत्संग दीक्षा उद्गान श्रवण',
    desc: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रबोधित ३१५ संस्कृत श्लोकों का पवित्र कृष्ण यजुर्वेदीय उद्गान श्रवण। पुरुष स्वर में मधुर पृष्ठभूमि संगीत के साथ अविरत मंगल गान।',
    badge: '३१५ श्लोक • अविरत वैदिक गान',
    voiceStyleTitle: 'स्वर एवं गान शैली (Audio Voice & Raag):',
    voiceStyleDesc: 'संगीत के साथ मूल पुरुष स्वर (Male Voice with Background Music)',
    playbackModeLabel: 'श्रवण विकल्प (Playback Mode):',
    singleVerseMode: '१ श्लोक श्रवण (Play 1 Shloka)',
    groupVerseMode: 'समूह / श्रेणी श्रवण (Group Range)',
    rangePlaybackTitle: 'श्लोक श्रेणी समूह श्रवण (Shloka Range Selection)',
    rangePlaybackDesc: 'श्लोक १ से ३१५ के मध्य कोई भी प्रारंभिक एवं अंतिम श्लोक चुनकर अविरत समूह श्रवण करें',
    startVerseLabel: 'प्रारंभिक श्लोक',
    endVerseLabel: 'अंतिम श्लोक',
    totalVersesBadge: (count: number) => `कुल ${count} श्लोक श्रेणी`,
    playRangeBtn: (start: number, end: number) => `श्लोक ${start} से ${end} श्रवण शुरू करें`,
    quickPresetsLabel: 'त्वरित श्लोक श्रेणी विकल्प:',
    fullScriptureChanting: 'सर्व १ से ३१५ अखंड पाठ',
    rangePrefix: (start: number, end: number) => `श्लोक ${start} से ${end}`,
    activeHeroVerseTitle: (id: number) => `सत्संग दीक्षा • श्लोक ${id}`,
    studyBtn: 'अध्ययन देखें',
    mangalChanting: '॥ श्री स्वामिनारायणो विजयते ॥',
    originalMeaningTitle: 'मूल गुजराती भावार्थ:',
    translatedMeaningTitle: 'हिंदी भावार्थ:',
    audioConnecting: 'ऑडियो कनेक्ट हो रहा है, कृपया पुनः Play दबाएं।',
    loading: 'लोड हो रहा है...',
    continuousPlayback: 'अविरत गान',
    continuousPlaybackTitle: (active: boolean) => active ? 'अविरत क्रमिक गान चालू (Auto-advance ON)' : 'अविरत क्रमिक गान बंद (Auto-advance OFF)',
    loopVerse: 'यह श्लोक लूप',
    loopVerseActive: 'बार-बार श्रवण चालू',
    loopVerseTitle: (active: boolean) => active ? 'यह श्लोक बार-बार गाया जाएगा (Loop ON)' : 'यह श्लोक बार-बार सुनें (Loop OFF)',
    prevVerseTitle: 'पिछला श्लोक (Previous Shloka)',
    nextVerseTitle: 'अगला श्लोक (Next Shloka)',
    playTitle: 'श्रवण शुरू करें (Play)',
    pauseTitle: 'विराम (Pause)',
    speedLabel: 'गति (Speed):',
    verseListTitle: (start: number, end: number, count: number, isSingle: boolean) => 
      isSingle ? `सम्पूर्ण ३१५ श्लोक सूची (क्लिक कर सीधे सुनें)` : `श्लोक सूची (श्लोक ${start} से ${end} - कुल ${count})`,
    verseListSubtitle: 'क्लिक कर सीधे गान सुनें',
    chapterPrefix: 'प्रकरण'
  },
  english: {
    tag: 'Authentic Sanskrit Udgaan (Authentic Vedic Chanting)',
    title: 'Satsang Diksha Udgaan Audio',
    desc: 'Sacred Krishna Yajurvedic chanting of all 315 Sanskrit verses composed by Pragat Brahmaswarup Mahant Swami Maharaj. Melodious male recital with divine ambient background accompaniment.',
    badge: '315 Verses • Vedic Chanting',
    voiceStyleTitle: 'Audio Voice & Chanting Style:',
    voiceStyleDesc: 'Traditional Male Voice with Divine Ambient Music',
    playbackModeLabel: 'Playback Mode:',
    singleVerseMode: 'Play 1 Shloka',
    groupVerseMode: 'Group Range Playback',
    rangePlaybackTitle: 'Shloka Range Selection',
    rangePlaybackDesc: 'Select any start and end verse from 1 to 315 for continuous group playback',
    startVerseLabel: 'Start Verse',
    endVerseLabel: 'End Verse',
    totalVersesBadge: (count: number) => `Total ${count} Verses Range`,
    playRangeBtn: (start: number, end: number) => `Start Playback (${start}–${end})`,
    quickPresetsLabel: 'Quick Range Presets:',
    fullScriptureChanting: 'Full 1–315 Scripture Recitation',
    rangePrefix: (start: number, end: number) => `Verses ${start}–${end}`,
    activeHeroVerseTitle: (id: number) => `Satsang Diksha • Verse ${id}`,
    studyBtn: 'Study Verse',
    mangalChanting: '॥ Shree Swaminarayanō Vijayate ॥',
    originalMeaningTitle: 'Original Gujarati Meaning:',
    translatedMeaningTitle: 'Meaning:',
    audioConnecting: 'Connecting audio stream, please tap Play again.',
    loading: 'Loading audio...',
    continuousPlayback: 'Auto Advance',
    continuousPlaybackTitle: (active: boolean) => active ? 'Continuous playback enabled' : 'Continuous playback disabled',
    loopVerse: 'Loop Verse',
    loopVerseActive: 'Repeating Verse',
    loopVerseTitle: (active: boolean) => active ? 'Verse repeat active (Loop ON)' : 'Repeatedly hear this verse (Loop OFF)',
    prevVerseTitle: 'Previous Verse',
    nextVerseTitle: 'Next Verse',
    playTitle: 'Play Audio',
    pauseTitle: 'Pause Audio',
    speedLabel: 'Speed:',
    verseListTitle: (start: number, end: number, count: number, isSingle: boolean) => 
      isSingle ? `All 315 Verses Collection (Tap to Play)` : `Verses List (${start}–${end} • Total ${count})`,
    verseListSubtitle: 'Tap any verse to chant',
    chapterPrefix: 'Chapter'
  }
};

const getUdgaanStrings = (lang: string) => {
  if (lang === 'gujarati') return UDGAAN_I18N.gujarati;
  if (lang === 'hindi') return UDGAAN_I18N.hindi;
  return UDGAAN_I18N.english;
};

export const UdgaanView: React.FC<UdgaanViewProps> = ({ shlokas, preferences, onSelectShloka, onUpdatePreferences }) => {
  // Playback mode: 'single' (play only 1 shlok) vs 'group' (group range playback)
  const [playMode, setPlayMode] = useState<'single' | 'group'>('group');
  const playModeRef = useRef<'single' | 'group'>('group');
  playModeRef.current = playMode;

  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(50);
  const rangeStartRef = useRef<number>(1);
  const rangeEndRef = useRef<number>(50);

  const [audioFormat, setAudioFormat] = useState<AudioFormat>('sanskrit');
  
  const [currentShlokaId, setCurrentShlokaId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoAdvance, setIsAutoAdvance] = useState<boolean>(preferences?.autoSwipeWhileListening !== false);
  const [isLoopCurrent, setIsLoopCurrent] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Synchronized state refs to prevent stale closure bugs in audio events
  const currentShlokaIdRef = useRef<number>(currentShlokaId);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const isAutoAdvanceRef = useRef<boolean>(preferences?.autoSwipeWhileListening !== false);
  const isLoopCurrentRef = useRef<boolean>(isLoopCurrent);
  const audioFormatRef = useRef<AudioFormat>(audioFormat);
  const playbackSpeedRef = useRef<number>(playbackSpeed);
  const isMutedRef = useRef<boolean>(isMuted);

  // Synchronize with external preferences if changed from Settings Modal
  useEffect(() => {
    if (preferences?.autoSwipeWhileListening !== undefined) {
      setIsAutoAdvance(preferences.autoSwipeWhileListening);
      isAutoAdvanceRef.current = preferences.autoSwipeWhileListening;
    }
  }, [preferences?.autoSwipeWhileListening]);

  const lang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const t = getUdgaanStrings(lang);

  // Active verse range for group playback (any start and end from 1 to 315)
  const activeRange = useMemo<[number, number]>(() => {
    return [rangeStart, rangeEnd];
  }, [rangeStart, rangeEnd]);

  const activeRangeRef = useRef<[number, number]>(activeRange);

  // Keep refs synchronized
  useEffect(() => {
    currentShlokaIdRef.current = currentShlokaId;
  }, [currentShlokaId]);

  isPlayingRef.current = isPlaying;
  isAutoAdvanceRef.current = isAutoAdvance;
  isLoopCurrentRef.current = isLoopCurrent;
  rangeStartRef.current = rangeStart;
  rangeEndRef.current = rangeEnd;
  activeRangeRef.current = activeRange;
  audioFormatRef.current = audioFormat;
  playbackSpeedRef.current = playbackSpeed;
  isMutedRef.current = isMuted;

  // List of shlokas in active range or full list in single mode
  const activeShlokas = useMemo(() => {
    if (playMode === 'single') {
      return shlokas;
    }
    const [start, end] = activeRange;
    return shlokas.filter(s => s.id >= start && s.id <= end);
  }, [shlokas, activeRange, playMode]);

  // Get current shloka object
  const currentShloka = useMemo(() => {
    return shlokas.find(s => s.id === currentShlokaId) || shlokas[0];
  }, [shlokas, currentShlokaId]);

  // Helper to get active range bounds for playback
  const getBoundsForShloka = (_shlokaId?: number): [number, number] => {
    return [rangeStartRef.current, rangeEndRef.current];
  };

  // Change range dynamically (start and end between 1 and 315)
  const handleSetRange = (newStart: number, newEnd: number, autoStartPlayback: boolean = false) => {
    const s = Math.max(1, Math.min(315, newStart));
    const e = Math.max(s, Math.min(315, newEnd));
    setRangeStart(s);
    setRangeEnd(e);
    rangeStartRef.current = s;
    rangeEndRef.current = e;
    activeRangeRef.current = [s, e];

    if (currentShlokaIdRef.current < s || currentShlokaIdRef.current > e) {
      playShloka(s, autoStartPlayback || isPlayingRef.current, audioFormatRef.current);
    } else if (autoStartPlayback) {
      playShloka(currentShlokaIdRef.current, true, audioFormatRef.current);
    }
  };

  // Switch to a specific shloka with automatic mirror fallback
  const playShloka = (shlokaId: number, autoPlay: boolean = true, formatToUse: AudioFormat = audioFormatRef.current) => {
    isTransitioningRef.current = true;
    currentShlokaIdRef.current = shlokaId;
    setCurrentShlokaId(shlokaId);
    setHasError(false);

    // Stop global audio from ShlokaCard so sounds do not overlap
    globalAudio.stop();

    // Ensure range covers this shloka if user clicked a shloka outside current range in group mode
    if (playModeRef.current === 'group') {
      if (shlokaId < rangeStartRef.current) {
        setRangeStart(shlokaId);
        rangeStartRef.current = shlokaId;
      } else if (shlokaId > rangeEndRef.current) {
        setRangeEnd(shlokaId);
        rangeEndRef.current = shlokaId;
      }
      activeRangeRef.current = [rangeStartRef.current, rangeEndRef.current];
    }
    
    if (!audioRef.current) {
      isTransitioningRef.current = false;
      return;
    }

    try {
      audioRef.current.pause();
    } catch (_) {}

    const urls = getAudioUrls(shlokaId, formatToUse);
    let mirrorIndex = 0;

    const loadAndPlayMirror = (idx: number) => {
      if (idx >= urls.length) {
        setIsLoadingAudio(false);
        setIsPlaying(false);
        isPlayingRef.current = false;
        isTransitioningRef.current = false;
        setHasError(true);
        return;
      }

      setIsLoadingAudio(true);
      const url = urls[idx];
      audioRef.current!.src = url;
      audioRef.current!.playbackRate = playbackSpeedRef.current;
      audioRef.current!.muted = isMutedRef.current;
      audioRef.current!.load();

      if (autoPlay) {
        const playPromise = audioRef.current!.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            setIsLoadingAudio(false);
            isTransitioningRef.current = false;
          }).catch(() => {
            mirrorIndex++;
            loadAndPlayMirror(mirrorIndex);
          });
        }
      } else {
        setIsLoadingAudio(false);
        isTransitioningRef.current = false;
      }
    };

    loadAndPlayMirror(mirrorIndex);
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      globalAudio.stop();
      if (!audioRef.current.src || audioRef.current.src === '' || hasError) {
        playShloka(currentShlokaIdRef.current, true, audioFormatRef.current);
      } else {
        setIsLoadingAudio(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            setIsLoadingAudio(false);
          }).catch(() => {
            playShloka(currentShlokaIdRef.current, true, audioFormatRef.current);
          });
        }
      }
    }
  };

  // Previous Shloka
  const handlePrevious = () => {
    const currentId = currentShlokaIdRef.current;
    if (playModeRef.current === 'single') {
      const prevId = currentId > 1 ? currentId - 1 : 315;
      playShloka(prevId, isPlayingRef.current, audioFormatRef.current);
    } else {
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const prevId = currentId > start ? currentId - 1 : end;
      playShloka(prevId, isPlayingRef.current, audioFormatRef.current);
    }
  };

  // Next Shloka
  const handleNext = () => {
    const currentId = currentShlokaIdRef.current;
    if (playModeRef.current === 'single') {
      const nextId = currentId < 315 ? currentId + 1 : 1;
      playShloka(nextId, isPlayingRef.current, audioFormatRef.current);
    } else {
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const nextId = currentId < end ? currentId + 1 : start;
      playShloka(nextId, isPlayingRef.current, audioFormatRef.current);
    }
  };

  // On audio ended - handles single verse (repeat or pause) vs group auto-advance
  const handleAudioEnded = () => {
    if (isTransitioningRef.current) return;

    // 1. Loop current single verse if repeat is active (Repeatedly hear this verse)
    if (isLoopCurrentRef.current) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
          }).catch(() => {});
        }
      }
      return;
    }

    // 2. If in Single Verse mode (and repeat is OFF), stop playback after this 1 verse
    if (playModeRef.current === 'single') {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // 3. In Group Playback mode with auto-advance:
    if (isAutoAdvanceRef.current) {
      const currentId = currentShlokaIdRef.current;
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const nextId = currentId < end ? currentId + 1 : start;

      playShloka(nextId, true, audioFormatRef.current);
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const handleAudioEndedRef = useRef(handleAudioEnded);
  handleAudioEndedRef.current = handleAudioEnded;

  // Update speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    playbackSpeedRef.current = speed;
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Initialize audio element with stable listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = getAudioUrls(currentShlokaIdRef.current, audioFormatRef.current)[0];
    audio.playbackRate = playbackSpeedRef.current;

    const onTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
        }
      }
    };

    const onLoadedMetadata = () => {
      if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
      setIsLoadingAudio(false);
    };

    const onCanPlay = () => {
      setIsLoadingAudio(false);
      isTransitioningRef.current = false;
    };

    const onPlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
      isPlayingRef.current = true;
      isTransitioningRef.current = false;
    };

    const onEnded = () => {
      if (isTransitioningRef.current) return;
      handleAudioEndedRef.current();
    };

    const onError = () => {
      setIsLoadingAudio(false);
      isTransitioningRef.current = false;
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
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
      {/* Header Banner - Fully localized with no external links */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-400/40 bg-gradient-to-r from-[#691800] via-[#8B2500] to-[#A03900] text-white p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 text-amber-200 text-xs font-semibold border border-amber-300/30">
              <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50 tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
              {t.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-amber-100 text-xs font-semibold border border-amber-300/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.badge}</span>
          </div>
        </div>
      </div>

      {/* AUDIO FORMAT SELECTOR - KEEP ALL 4 AUDIO VOICES AND RAAG */}
      <div className="bg-white dark:bg-[#221D1A] rounded-2xl p-4 border border-[#E8DFD1] dark:border-[#3D342C] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B2500] dark:text-amber-300">
            <Music className="w-4 h-4 text-amber-500" />
            <span>{t.voiceStyleTitle}</span>
          </div>
          <span className="text-[11px] text-[#7A6B5C] dark:text-[#A89886]">
            {t.voiceStyleDesc}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AUDIO_FORMAT_OPTIONS.map((opt) => {
            const isSelected = audioFormat === opt.id;
            const optLabel = lang === 'hindi' ? opt.labelHi : lang === 'english' ? opt.labelEn : opt.labelGu;
            const optDesc = lang === 'english' ? opt.descriptionEn : opt.descriptionGu;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setAudioFormat(opt.id);
                  playShloka(currentShlokaId, isPlaying, opt.id);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#8B2500] to-[#B33900] text-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-400'
                    : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#4A3E34] dark:text-[#C5B7A8] border-[#E8DFD1] dark:border-[#3D342C] hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{optLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </div>
                <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-amber-200/90' : 'text-[#7A6B5C] dark:text-[#A89886]'}`}>
                  {optDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPLETE RESTORED AUDIO PLAYER WITH PLAY SPEED, REPEAT/LOOP, AND INTEGRATED GROUP PLAYBACK */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-amber-400/40 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Shloka Meta Ribbon & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8DC] dark:border-[#352C24] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-amber-950 font-bold text-base flex items-center justify-center shadow-md border border-amber-300 shrink-0">
              #{currentShloka.id}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-lg text-[#8B2500] dark:text-amber-300">
                  {t.activeHeroVerseTitle(currentShloka.id)}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  {playMode === 'single' ? t.singleVerseMode : t.rangePrefix(rangeStart, rangeEnd)}
                </span>
              </div>
              <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                {t.chapterPrefix} {currentShloka.chapterId}: {getShlokaChapterName(currentShloka, lang)}
              </p>
            </div>
          </div>

          {/* Mode Switcher: Play 1 Shlok vs Group Playback */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FAF6F0] dark:bg-[#2A221C] p-1 rounded-2xl border border-amber-300/50 dark:border-stone-800 shadow-2xs">
              <button
                type="button"
                onClick={() => setPlayMode('single')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  playMode === 'single'
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                title="Play only 1 selected shloka"
              >
                <Disc3 className="w-3.5 h-3.5" />
                <span>{t.singleVerseMode}</span>
              </button>
              <button
                type="button"
                onClick={() => setPlayMode('group')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  playMode === 'group'
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
                title="Group playback with custom shloka range"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.groupVerseMode}</span>
              </button>
            </div>

            {onSelectShloka && (
              <button
                onClick={() => onSelectShloka(currentShloka.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-[#2E241E] text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-200 transition cursor-pointer"
              >
                {t.studyBtn}
              </button>
            )}
          </div>
        </div>

        {/* Group Range Selection Box (Integrated inside Player when in group mode) */}
        {playMode === 'group' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-amber-300/60 dark:border-[#3D342C] space-y-3.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/50 dark:border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-xs sm:text-sm text-[#8B2500] dark:text-amber-300">
                  {t.rangePlaybackTitle}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-950 text-[#8B2500] dark:text-amber-300 text-xs font-bold">
                {t.totalVersesBadge(rangeEnd - rangeStart + 1)} ({rangeStart}–{rangeEnd})
              </span>
            </div>

            {/* Range Pickers: Start Verse and End Verse (1 to 315) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Start Verse Stepper */}
              <div className="sm:col-span-4 bg-white dark:bg-[#1E1815] p-3 rounded-xl border border-amber-200/80 dark:border-stone-800 shadow-2xs">
                <label className="block text-[11px] font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wider mb-1">
                  {t.startVerseLabel} (1–315)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart - 1, rangeEnd)}
                    disabled={rangeStart <= 1}
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#2A221C] border border-amber-300/60 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">#</span>
                    <input
                      type="number"
                      min="1"
                      max="315"
                      value={rangeStart}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          handleSetRange(val, Math.max(val, rangeEnd));
                        }
                      }}
                      className="w-full pl-6 pr-2 py-1 text-center font-bold text-sm rounded-lg bg-transparent border border-amber-300/50 text-[#8B2500] dark:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart + 1, Math.max(rangeStart + 1, rangeEnd))}
                    disabled={rangeStart >= 315}
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#2A221C] border border-amber-300/60 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* End Verse Stepper */}
              <div className="sm:col-span-4 bg-white dark:bg-[#1E1815] p-3 rounded-xl border border-amber-200/80 dark:border-stone-800 shadow-2xs">
                <label className="block text-[11px] font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wider mb-1">
                  {t.endVerseLabel} (1–315)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart, Math.max(rangeStart, rangeEnd - 1))}
                    disabled={rangeEnd <= rangeStart}
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#2A221C] border border-amber-300/60 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">#</span>
                    <input
                      type="number"
                      min={rangeStart}
                      max="315"
                      value={rangeEnd}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          handleSetRange(Math.min(rangeStart, val), val);
                        }
                      }}
                      className="w-full pl-6 pr-2 py-1 text-center font-bold text-sm rounded-lg bg-transparent border border-amber-300/50 text-[#8B2500] dark:text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart, rangeEnd + 1)}
                    disabled={rangeEnd >= 315}
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-[#2A221C] border border-amber-300/60 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Play Range Action Button */}
              <div className="sm:col-span-4 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (currentShlokaId >= rangeStart && currentShlokaId <= rangeEnd && isPlaying) {
                      playShloka(currentShlokaId, true, audioFormat);
                    } else {
                      playShloka(rangeStart, true, audioFormat);
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#B45309] hover:from-[#8B2500] hover:to-[#C25E00] text-amber-50 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.playRangeBtn(rangeStart, rangeEnd)}</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 self-center mr-1">
                {t.quickPresetsLabel}
              </span>
              {PRESET_RANGES.map((preset) => {
                const isMatch = rangeStart === preset.range[0] && rangeEnd === preset.range[1];
                const pLabel = lang === 'hindi' ? preset.labelHi : lang === 'english' ? preset.labelEn : preset.labelGu;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSetRange(preset.range[0], preset.range[1])}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      isMatch
                        ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                        : 'bg-white dark:bg-[#1E1815] text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    {pLabel}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleSetRange(1, 315)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  rangeStart === 1 && rangeEnd === 315
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-100 dark:bg-[#32251D] text-amber-900 dark:text-amber-200 hover:bg-amber-200 border border-amber-300/60'
                }`}
              >
                {t.fullScriptureChanting}
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 4))}
                className="px-2 py-1 rounded-lg text-[11px] bg-white dark:bg-[#1E1815] text-stone-600 dark:text-stone-400 hover:bg-stone-100 border border-stone-200 dark:border-stone-800 transition cursor-pointer"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 9))}
                className="px-2 py-1 rounded-lg text-[11px] bg-white dark:bg-[#1E1815] text-stone-600 dark:text-stone-400 hover:bg-stone-100 border border-stone-200 dark:border-stone-800 transition cursor-pointer"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 24))}
                className="px-2 py-1 rounded-lg text-[11px] bg-white dark:bg-[#1E1815] text-stone-600 dark:text-stone-400 hover:bg-stone-100 border border-stone-200 dark:border-stone-800 transition cursor-pointer"
              >
                +25
              </button>
            </div>
          </div>
        )}

        {/* Sanskrit Verse Chanting Display */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#1A1512] border-2 border-amber-500/30 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.mangalChanting}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Primary Script */}
          <p className="font-sanskrit font-bold text-xl sm:text-2xl text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide">
            {preferences?.sanskritScript === 'gujarati' 
              ? currentShloka.sanskritGujarati 
              : preferences?.sanskritScript === 'iast' 
              ? currentShloka.sanskritIast 
              : currentShloka.sanskritDevanagari}
          </p>

          {/* Alternate Script (Devanagari or Gujarati) */}
          {preferences?.sanskritScript === 'gujarati' && (
            <p className="font-sanskrit text-sm sm:text-base text-[#8B2500]/80 dark:text-amber-300/80 leading-relaxed whitespace-pre-line">
              {currentShloka.sanskritDevanagari}
            </p>
          )}
          {preferences?.sanskritScript === 'devanagari' && (
            <p className="font-gujarati font-semibold text-base sm:text-lg text-[#8B2500] dark:text-amber-300 leading-relaxed">
              {currentShloka.sanskritGujarati}
            </p>
          )}
        </div>

        {/* Shloka Meaning Display */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-[#28201B] border border-amber-200/70 dark:border-stone-800 text-xs sm:text-sm space-y-1">
          <span className="font-bold text-[#8B2500] dark:text-amber-300 text-xs uppercase tracking-wider block">
            {t.translatedMeaningTitle}
          </span>
          <p className="text-[#4A3E34] dark:text-[#DCD1C3] leading-relaxed">
            {getShlokaMeaning(currentShloka, lang)}
          </p>
        </div>

        {/* Timeline & Scrubber Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#7A6B5C] dark:text-[#A89886]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            }}
            className="w-full h-2 bg-amber-200/60 dark:bg-[#3D342C] rounded-lg appearance-none cursor-pointer accent-[#8B2500] dark:accent-amber-500"
          />
        </div>

        {/* Playback Controls & Features Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Main Playback Buttons: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-1">
            <button
              type="button"
              onClick={handlePrevious}
              title={t.prevVerseTitle}
              className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950 transition shadow-xs cursor-pointer"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              id="udgaan-play-btn"
              onClick={handleTogglePlay}
              title={isPlaying ? t.pauseTitle : t.playTitle}
              className={`p-4 rounded-3xl text-amber-50 shadow-lg transform active:scale-95 transition cursor-pointer ${
                isPlaying
                  ? 'bg-gradient-to-br from-[#7A1E00] to-[#992600] ring-4 ring-amber-400/40'
                  : 'bg-gradient-to-br from-[#8B2500] to-[#C25E00] hover:scale-105 ring-2 ring-amber-400/30'
              }`}
            >
              {isLoadingAudio ? (
                <div className="w-6 h-6 border-3 border-amber-100 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              title={t.nextVerseTitle}
              className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950 transition shadow-xs cursor-pointer"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Right Action Controls: Repeat (Loop), Auto-Advance, Volume & Speed Adjustment */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 order-1 sm:order-2 w-full sm:w-auto">
            {/* Repeatedly Hear or Not (Loop current verse) */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !isLoopCurrent;
                setIsLoopCurrent(nextVal);
                isLoopCurrentRef.current = nextVal;
              }}
              title={t.loopVerseTitle(isLoopCurrent)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                isLoopCurrent
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-400 animate-pulse'
                  : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 border border-amber-200 dark:border-stone-700'
              }`}
            >
              <Repeat className={`w-3.5 h-3.5 ${isLoopCurrent ? 'rotate-180' : ''}`} />
              <span>{isLoopCurrent ? t.loopVerseActive : t.loopVerse}</span>
            </button>

            {/* Continuous Playback / Auto-Advance */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !isAutoAdvance;
                setIsAutoAdvance(nextVal);
                isAutoAdvanceRef.current = nextVal;
                if (onUpdatePreferences) {
                  onUpdatePreferences({ autoSwipeWhileListening: nextVal });
                }
              }}
              title={t.continuousPlaybackTitle(isAutoAdvance)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                isAutoAdvance
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-500 hover:text-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.continuousPlayback}</span>
            </button>

            {/* Volume Mute / Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Play Speed Adjustment (0.75x, 1x, 1.25x, 1.5x) */}
            <div className="flex items-center gap-1 bg-[#FAF6F0] dark:bg-[#2A221C] p-1 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] font-bold text-stone-500 px-1 hidden md:inline">
                {t.speedLabel}
              </span>
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer text-[11px] font-semibold ${
                    playbackSpeed === speed
                      ? 'bg-[#8B2500] text-amber-50 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHLOKAS LIST IN CURRENT RANGE OR ALL VERSES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-500" />
            <span>{t.verseListTitle(rangeStart, rangeEnd, activeShlokas.length, playMode === 'single')}</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            {t.verseListSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-1 no-scrollbar">
          {activeShlokas.map((s) => {
            const isCurrent = s.id === currentShlokaId;
            const verseLine = preferences?.sanskritScript === 'gujarati' ? s.sanskritGujarati : s.sanskritDevanagari;
            const meaningLine = getShlokaMeaning(s, lang);
            return (
              <div
                key={s.id}
                ref={isCurrent ? activeVerseRef : undefined}
                onClick={() => playShloka(s.id, true, audioFormat)}
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
                      {verseLine}
                    </p>
                    <p className="text-[11px] text-[#7A6B5C] dark:text-[#A89886] truncate">
                      {meaningLine}
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
"""

with open('src/components/UdgaanView.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("UdgaanView.tsx completely updated with full restored player!")
