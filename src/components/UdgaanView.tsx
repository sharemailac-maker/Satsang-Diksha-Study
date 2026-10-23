import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw,
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
  BookOpen,
  ArrowRight,
  X,
  RefreshCw
} from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { AudioFormat, AUDIO_FORMAT_OPTIONS, getAudioUrls, globalAudio } from '../utils/audioPlayer';
import { getShlokaMeaning, getShlokaChapterName, LANGUAGE_METADATA } from '../utils/translationHelper';

interface UdgaanViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onSelectShloka?: (shlokaId: number) => void;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
  onNavigateTab?: (tab: string) => void;
}

export type RepetitionOrder = 'each_verse' | 'whole_range';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

const UDGAAN_I18N = {
  gujarati: {
    tag: 'અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)',
    title: 'સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ',
    desc: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. પુરૂષ સ્વરમાં મધુર સંગીત સાથે અવિરત મંગલ ગાન.',
    badge: '૩૧૫ શ્લોક • અવિરત વૈદિક ગાન',
    voiceStyleTitle: 'સ્વર અને ગાન શૈલી (Audio Voice & Raag):',
    voiceStyleDesc: 'મૂળ પુરૂષ સ્વર (સંગીત સાથે)',
    repeatModalTitle: 'રિપીટ',
    shlokaLabel: 'શ્લોક',
    toLabel: 'થી',
    howManyTimesLabel: 'કેટલી વાર',
    patternEachVerse: '1-1, 2-2',
    patternEachVerseDesc: 'દરેક શ્લોક ક્રમશઃ પુનરાવર્તિત કરો (Mukhpath)',
    patternWholeRange: '1-2, 1-2',
    patternWholeRangeDesc: 'સમગ્ર શ્રેણી ક્રમિક પુનરાવર્તિત કરો (Parayan)',
    cancelBtn: 'રદ કરો',
    playBtn: 'વગાડો',
    repeatSettingsBtn: 'રિપીટ / ગ્રૂપ શ્રવણ સેટિંગ્સ',
    quickPresetsLabel: 'ઝડપી વિકલ્પો:',
    fullScriptureChanting: 'સર્વ ૧ થી ૩૧૫ અખંડ પાઠ',
    activeHeroVerseTitle: (id: number) => `સત્સંગ દીક્ષા • શ્લોક ${id}`,
    studyBtn: 'અધ્યયન જુઓ',
    mangalChanting: '॥ શ્રી સ્વામિનારાયણો વિજયતે ॥',
    originalMeaningTitle: 'મૂળ ગુજરાતી ભાવાર્થ:',
    translatedMeaningTitle: 'ભાવાર્થ:',
    speedLabel: 'ગતિ (Speed)',
    prevVerseTitle: 'પાછલો શ્લોક (Previous)',
    nextVerseTitle: 'આગલો શ્લોક (Next)',
    rewind5: '૫ સેકન્ડ પાછળ (-5s)',
    forward5: '૫ સેકન્ડ આગળ (+5s)',
    playTitle: 'શ્રવણ શરૂ કરો (Play)',
    pauseTitle: 'વિરામ (Pause)',
    verseListTitle: (start: number, end: number, count: number) => 
      start === end 
        ? `શ્લોક #${start} (એકલ શ્રવણ)` 
        : `શ્લોક યાદી (શ્લોક ${start} થી ${end} - કુલ ${count})`,
    verseListSubtitle: 'ક્લિક કરી સીધા ગાન સાંભળો',
    chapterPrefix: 'પ્રકરણ',
    nowPlaying: 'હવે વાગી રહ્યું છે',
    audioBuffering: 'લોડ થઈ રહ્યું છે...',
    singleShlokaNote: 'બંનેમાં સરખો શ્લોક નંબર લખવાથી ૧ જ શ્લોક વાગશે',
    groupRangeNote: 'નાનાથી મોટા શ્લોક નંબર લખવાથી જૂથ વાગશે'
  },
  hindi: {
    tag: 'अधिकृत संस्कृत उद्गान (Authentic Vedic Chanting)',
    title: 'सत्संग दीक्षा उद्गान श्रवण',
    desc: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रबोधित ३१५ संस्कृत श्लोकों का पवित्र कृष्ण यजुर्वेदीय उद्गान श्रवण। पुरुष स्वर में मधुर संगीत के साथ अविरत मंगल गान।',
    badge: '३१५ श्लोक • अविरत वैदिक गान',
    voiceStyleTitle: 'स्वर एवं गान शैली (Audio Voice & Raag):',
    voiceStyleDesc: 'मूल पुरुष स्वर (संगीत के साथ)',
    repeatModalTitle: 'रिपीट',
    shlokaLabel: 'श्लोक',
    toLabel: 'से',
    howManyTimesLabel: 'कितनी बार',
    patternEachVerse: '1-1, 2-2',
    patternEachVerseDesc: 'प्रत्येक श्लोक क्रमशः दोहराएं (Mukhpath)',
    patternWholeRange: '1-2, 1-2',
    patternWholeRangeDesc: 'संपूर्ण श्रेणी क्रमिक दोहराएं (Parayan)',
    cancelBtn: 'रद्द करें',
    playBtn: 'बजाएं',
    repeatSettingsBtn: 'रिपीट / समूह श्रवण सेटिंग्स',
    quickPresetsLabel: 'त्वरित विकल्प:',
    fullScriptureChanting: 'सर्व १ से ३१५ अखंड पाठ',
    activeHeroVerseTitle: (id: number) => `सत्संग दीक्षा • श्लोक ${id}`,
    studyBtn: 'अध्ययन देखें',
    mangalChanting: '॥ श्री स्वामिनारायणो विजयते ॥',
    originalMeaningTitle: 'मूल गुजराती भावार्थ:',
    translatedMeaningTitle: 'हिंदी भावार्थ:',
    speedLabel: 'गति (Speed)',
    prevVerseTitle: 'पिछला श्लोक (Previous)',
    nextVerseTitle: 'अगला श्लोक (Next)',
    rewind5: '५ सेकंड पीछे (-5s)',
    forward5: '५ सेकंड आगे (+5s)',
    playTitle: 'श्रवण शुरू करें (Play)',
    pauseTitle: 'विराम (Pause)',
    verseListTitle: (start: number, end: number, count: number) => 
      start === end 
        ? `श्लोक #${start} (एकल श्रवण)` 
        : `श्लोक सूची (श्लोक ${start} से ${end} - कुल ${count})`,
    verseListSubtitle: 'क्लिक कर सीधे गान सुनें',
    chapterPrefix: 'प्रकरण',
    nowPlaying: 'अब बज रहा है',
    audioBuffering: 'लोड हो रहा है...',
    singleShlokaNote: 'समान संख्या से १ ही श्लोक बजेगा',
    groupRangeNote: 'निम्न से उच्च संख्या से समूह बजेगा'
  },
  english: {
    tag: 'Authentic Sanskrit Udgaan (Authentic Vedic Chanting)',
    title: 'Satsang Diksha Udgaan Audio',
    desc: 'Sacred Krishna Yajurvedic chanting of all 315 Sanskrit verses composed by Pragat Brahmaswarup Mahant Swami Maharaj. Melodious male recital with divine ambient background accompaniment.',
    badge: '315 Verses • Vedic Chanting',
    voiceStyleTitle: 'Audio Voice & Chanting Style:',
    voiceStyleDesc: 'Authentic Male Voice with Divine Music',
    repeatModalTitle: 'Repeat',
    shlokaLabel: 'Verse',
    toLabel: 'to',
    howManyTimesLabel: 'Repeat Count',
    patternEachVerse: '1-1, 2-2',
    patternEachVerseDesc: 'Repeat each verse consecutively (Mukhpath)',
    patternWholeRange: '1-2, 1-2',
    patternWholeRangeDesc: 'Repeat entire sequence consecutively (Parayan)',
    cancelBtn: 'Cancel',
    playBtn: 'Play',
    repeatSettingsBtn: 'Repeat / Group Settings',
    quickPresetsLabel: 'Quick Range:',
    fullScriptureChanting: 'Full 1–315 Scripture Recitation',
    activeHeroVerseTitle: (id: number) => `Satsang Diksha • Verse ${id}`,
    studyBtn: 'Study Verse',
    mangalChanting: '॥ Shree Swaminarayanō Vijayate ॥',
    originalMeaningTitle: 'Original Gujarati Meaning:',
    translatedMeaningTitle: 'Meaning:',
    speedLabel: 'Speed',
    prevVerseTitle: 'Previous Verse',
    nextVerseTitle: 'Next Verse',
    rewind5: 'Rewind 5s',
    forward5: 'Forward 5s',
    playTitle: 'Play Audio',
    pauseTitle: 'Pause Audio',
    verseListTitle: (start: number, end: number, count: number) => 
      start === end 
        ? `Verse #${start} (Single Verse)` 
        : `Verses List (${start}–${end} • Total ${count})`,
    verseListSubtitle: 'Tap any verse to chant',
    chapterPrefix: 'Chapter',
    nowPlaying: 'Now Playing',
    audioBuffering: 'Loading audio...',
    singleShlokaNote: 'Same start and end number plays 1 single verse',
    groupRangeNote: 'Lower to higher range plays group sequence'
  }
};

const getUdgaanStrings = (lang: string) => {
  if (lang === 'gujarati') return UDGAAN_I18N.gujarati;
  if (lang === 'hindi') return UDGAAN_I18N.hindi;
  return UDGAAN_I18N.english;
};

export const UdgaanView: React.FC<UdgaanViewProps> = ({ 
  shlokas, 
  preferences, 
  onSelectShloka,
  onNavigateTab 
}) => {
  // Active range bounds: lower to higher for group play, or same number for single play
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(315);

  // Repeat count (how many times: 1, 2, 3...)
  const [repeatCount, setRepeatCount] = useState<number>(2);

  // Repetition Order: 'each_verse' (1-1, 2-2) or 'whole_range' (1-2, 1-2)
  const [repetitionOrder, setRepetitionOrder] = useState<RepetitionOrder>('each_verse');

  // Repetition tracking counters
  const [verseRepeatIndex, setVerseRepeatIndex] = useState<number>(1);
  const [rangeCycleIndex, setRangeCycleIndex] = useState<number>(1);

  // Modal dialog open/closed state
  const [isRepeatModalOpen, setIsRepeatModalOpen] = useState<boolean>(false);

  // Modal draft form state (empty by default so user can directly enter single or range without clearing)
  const [modalStart, setModalStart] = useState<string>('');
  const [modalEnd, setModalEnd] = useState<string>('');
  const [modalRepeatCount, setModalRepeatCount] = useState<string>('2');
  const [modalRepetitionOrder, setModalRepetitionOrder] = useState<RepetitionOrder>('each_verse');

  // Audio configuration & state
  const [audioFormat, setAudioFormat] = useState<AudioFormat>('sanskrit');
  const [currentShlokaId, setCurrentShlokaId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Synchronized state refs to prevent stale closure bugs in audio event listeners
  const currentShlokaIdRef = useRef<number>(currentShlokaId);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const rangeStartRef = useRef<number>(rangeStart);
  const rangeEndRef = useRef<number>(rangeEnd);
  const repeatCountRef = useRef<number>(repeatCount);
  const repetitionOrderRef = useRef<RepetitionOrder>(repetitionOrder);
  const verseRepeatIndexRef = useRef<number>(verseRepeatIndex);
  const rangeCycleIndexRef = useRef<number>(rangeCycleIndex);
  const audioFormatRef = useRef<AudioFormat>(audioFormat);
  const playbackSpeedRef = useRef<number>(playbackSpeed);
  const isMutedRef = useRef<boolean>(isMuted);

  // Sync refs on render
  currentShlokaIdRef.current = currentShlokaId;
  isPlayingRef.current = isPlaying;
  rangeStartRef.current = rangeStart;
  rangeEndRef.current = rangeEnd;
  repeatCountRef.current = repeatCount;
  repetitionOrderRef.current = repetitionOrder;
  verseRepeatIndexRef.current = verseRepeatIndex;
  rangeCycleIndexRef.current = rangeCycleIndex;
  audioFormatRef.current = audioFormat;
  playbackSpeedRef.current = playbackSpeed;
  isMutedRef.current = isMuted;

  const lang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const t = getUdgaanStrings(lang);

  // Check if currently single shloka or group range
  const isSingleVerse = rangeStart === rangeEnd;

  // Current shloka object
  const currentShloka = useMemo(() => {
    return shlokas.find(s => s.id === currentShlokaId) || shlokas[0];
  }, [shlokas, currentShlokaId]);

  // Active shlokas list based on range
  const displayedShlokas = useMemo(() => {
    const s = Math.min(rangeStart, rangeEnd);
    const e = Math.max(rangeStart, rangeEnd);
    return shlokas.filter(item => item.id >= s && item.id <= e);
  }, [shlokas, rangeStart, rangeEnd]);

  // Open Repeat Modal - shloka ranges are empty so user can directly fill for single or group play
  const openRepeatModal = () => {
    setModalStart('');
    setModalEnd('');
    setModalRepeatCount(String(repeatCount || 2));
    setModalRepetitionOrder(repetitionOrder);
    setIsRepeatModalOpen(true);
  };

  // Close Repeat Modal
  const closeRepeatModal = () => {
    setIsRepeatModalOpen(false);
  };

  // Apply modal settings and start playback
  const handleModalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawS = parseInt(modalStart.trim(), 10);
    const rawE = modalEnd.trim() !== '' ? parseInt(modalEnd.trim(), 10) : rawS;
    const rawCount = Math.max(1, parseInt(modalRepeatCount.trim(), 10) || 1);

    if (isNaN(rawS)) return;

    // Normalize bounds between 1 and 315
    const clampedS = Math.max(1, Math.min(315, rawS));
    const clampedE = isNaN(rawE) ? clampedS : Math.max(1, Math.min(315, rawE));

    // Allow user to enter same number for single verse, or lower to higher for group play
    const s = Math.min(clampedS, clampedE);
    const endVal = Math.max(clampedS, clampedE);

    setRangeStart(s);
    setRangeEnd(endVal);
    rangeStartRef.current = s;
    rangeEndRef.current = endVal;

    setRepeatCount(rawCount);
    repeatCountRef.current = rawCount;

    setRepetitionOrder(modalRepetitionOrder);
    repetitionOrderRef.current = modalRepetitionOrder;

    // Reset progress counters
    setVerseRepeatIndex(1);
    verseRepeatIndexRef.current = 1;
    setRangeCycleIndex(1);
    rangeCycleIndexRef.current = 1;

    setIsRepeatModalOpen(false);

    // Play starting verse
    playShloka(s, true, audioFormatRef.current);
  };

  // Play a specific shloka with automatic mirror fallback
  const playShloka = (shlokaId: number, autoPlay: boolean = true, formatToUse: AudioFormat = audioFormatRef.current) => {
    isTransitioningRef.current = true;
    currentShlokaIdRef.current = shlokaId;
    setCurrentShlokaId(shlokaId);
    setHasError(false);

    // Stop global audio from ShlokaCard so recitations do not clash
    globalAudio.stop();

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

      if (!audioRef.current) {
        isTransitioningRef.current = false;
        return;
      }

      audioRef.current.src = urls[idx];
      audioRef.current.playbackRate = playbackSpeedRef.current;
      audioRef.current.muted = isMutedRef.current;

      if (autoPlay) {
        setIsLoadingAudio(true);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            setIsLoadingAudio(false);
            setHasError(false);
            isTransitioningRef.current = false;
          }).catch((err) => {
            console.warn(`Audio play failed for mirror ${idx} on shloka ${shlokaId}:`, err);
            if (idx + 1 < urls.length) {
              loadAndPlayMirror(idx + 1);
            } else {
              setIsLoadingAudio(false);
              setIsPlaying(false);
              isPlayingRef.current = false;
              isTransitioningRef.current = false;
              setHasError(true);
            }
          });
        } else {
          isTransitioningRef.current = false;
        }
      } else {
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

  // Previous Shloka within active range
  const handlePrevious = () => {
    const currentId = currentShlokaIdRef.current;
    const start = rangeStartRef.current;
    const end = rangeEndRef.current;
    const prevId = currentId > start ? currentId - 1 : end;
    setVerseRepeatIndex(1);
    verseRepeatIndexRef.current = 1;
    playShloka(prevId, isPlayingRef.current, audioFormatRef.current);
  };

  // Next Shloka within active range
  const handleNext = () => {
    const currentId = currentShlokaIdRef.current;
    const start = rangeStartRef.current;
    const end = rangeEndRef.current;
    const nextId = currentId < end ? currentId + 1 : start;
    setVerseRepeatIndex(1);
    verseRepeatIndexRef.current = 1;
    playShloka(nextId, isPlayingRef.current, audioFormatRef.current);
  };

  // Rewind 5s
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Forward 5s
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Seek bar change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Audio ended handler implementing both 1-1, 2-2 and 1-2, 1-2 repetition rules
  const handleAudioEnded = () => {
    if (isTransitioningRef.current) return;

    const currentId = currentShlokaIdRef.current;
    const start = rangeStartRef.current;
    const end = rangeEndRef.current;
    const count = repeatCountRef.current;
    const order = repetitionOrderRef.current;

    // CASE 1: Single verse mode (start === end)
    if (start === end) {
      if (verseRepeatIndexRef.current < count) {
        verseRepeatIndexRef.current += 1;
        setVerseRepeatIndex(verseRepeatIndexRef.current);
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
      } else {
        // Completed all repetitions of single verse
        setVerseRepeatIndex(1);
        verseRepeatIndexRef.current = 1;
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
      return;
    }

    // CASE 2: Group range (start < end)
    // Pattern A: "1-1, 2-2" (Repeat each verse N times consecutively before advancing)
    if (order === 'each_verse') {
      if (verseRepeatIndexRef.current < count) {
        verseRepeatIndexRef.current += 1;
        setVerseRepeatIndex(verseRepeatIndexRef.current);
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
      } else {
        // Finished repeating this verse N times, move to next verse in range
        setVerseRepeatIndex(1);
        verseRepeatIndexRef.current = 1;
        if (currentId < end) {
          playShloka(currentId + 1, true, audioFormatRef.current);
        } else {
          // Reached end of the group range
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }
      return;
    }

    // Pattern B: "1-2, 1-2" (Play full range start to end, repeat whole sequence N times)
    if (order === 'whole_range') {
      if (currentId < end) {
        // Advance to next verse in the range
        playShloka(currentId + 1, true, audioFormatRef.current);
      } else {
        // Reached end of range sequence
        if (rangeCycleIndexRef.current < count) {
          rangeCycleIndexRef.current += 1;
          setRangeCycleIndex(rangeCycleIndexRef.current);
          // Restart from range start for next cycle
          playShloka(start, true, audioFormatRef.current);
        } else {
          // Finished all range cycles
          setRangeCycleIndex(1);
          rangeCycleIndexRef.current = 1;
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }
      return;
    }
  };

  const handleAudioEndedRef = useRef(handleAudioEnded);
  handleAudioEndedRef.current = handleAudioEnded;

  // Change playback speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    playbackSpeedRef.current = speed;
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Initialize audio element with stable event listeners
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

  // Auto-scroll active verse card into view in the list
  useEffect(() => {
    if (activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentShlokaId]);

  // Sanskrit text based on user preference
  const sanskritText = preferences?.sanskritScript === 'gujarati' 
    ? currentShloka.sanskritGujarati 
    : preferences?.sanskritScript === 'iast' 
    ? currentShloka.sanskritIast 
    : currentShloka.sanskritDevanagari;

  const currentMeaning = getShlokaMeaning(currentShloka, lang);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 animate-fadeIn pb-28 select-none">
      {/* Top Section Breadcrumb / Navigation Bar */}
      {onNavigateTab && (
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white/80 dark:bg-[#221D1A]/80 border border-[#E8DFD1] dark:border-[#3D342C] shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('reader')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7A1E00] to-[#8B2500] text-amber-50 font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'hindi' ? '← श्लोक अध्ययन (Reader)' : lang === 'english' ? '← Shloka Study (Reader)' : '← શ્લોક અધ્યયન (Reader)'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('home')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#A89886] font-semibold text-xs border border-amber-200/60 dark:border-stone-800 hover:bg-amber-50 transition cursor-pointer"
            >
              <span>{lang === 'hindi' ? 'मुख्य पृष्ठ (Home)' : lang === 'english' ? 'Home' : 'મુખ્ય પેજ (Home)'}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={openRepeatModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-[#8B2500] dark:text-amber-300 font-bold text-xs border border-amber-300/70 hover:bg-amber-200 transition cursor-pointer shadow-2xs"
            title={t.repeatSettingsBtn}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.repeatModalTitle}</span>
          </button>
        </div>
      )}

      {/* Header Banner - Zero external redirection links */}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openRepeatModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-amber-100 text-xs font-bold border border-amber-300/50 shadow-xs transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>{t.repeatModalTitle}</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/25 text-amber-200 text-xs font-semibold border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIO VOICE & RAAG SELECTOR (All 4 formats preserved) */}
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
                type="button"
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

      {/* RETAINED HERO AUDIO PLAYER PANEL */}
      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] dark:from-[#241D19] dark:to-[#1C1714] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/50 dark:border-amber-600/40 shadow-xl space-y-6">
        {/* Top Player Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 dark:border-[#3D342C] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7A1E00] to-[#A03900] text-amber-300 font-bold text-base flex items-center justify-center shadow-md border border-amber-300/40 flex-shrink-0">
              #{currentShloka.id}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
                  {isPlaying ? t.nowPlaying : t.pauseTitle}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                  {t.chapterPrefix} {currentShloka.chapterId}: {getShlokaChapterName(currentShloka, lang)}
                </span>
                {/* Active repetition indicator pill */}
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#8B2500] dark:text-amber-300 text-[10px] font-bold border border-amber-300/60">
                  {isSingleVerse 
                    ? `૧ શ્લોક (${verseRepeatIndex}/${repeatCount})` 
                    : repetitionOrder === 'each_verse' 
                    ? `જૂથ ${rangeStart}–${rangeEnd} • 1-1, 2-2 (${verseRepeatIndex}/${repeatCount})` 
                    : `જૂથ ${rangeStart}–${rangeEnd} • 1-2, 1-2 (આવર્તન ${rangeCycleIndex}/${repeatCount})`}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#7A1E00] dark:text-amber-200 mt-0.5">
                {currentShloka.titleGu}
                {lang !== 'gujarati' && (
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400 ml-2">
                    ({lang === 'hindi' ? currentShloka.titleHi : currentShloka.titleEn})
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Open Repeat Modal */}
            <button
              type="button"
              onClick={openRepeatModal}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 text-[#8B2500] dark:text-amber-300 transition cursor-pointer border border-amber-300/50 shadow-2xs"
              title={t.repeatModalTitle}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Jump to Reader Study */}
            {onSelectShloka && (
              <button
                type="button"
                onClick={() => onSelectShloka(currentShloka.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 text-[#8B2500] dark:text-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-amber-300/50 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.studyBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sanskrit Text & Meaning Presentation */}
        <div className="bg-white/80 dark:bg-[#181311]/90 rounded-2xl p-4 sm:p-5 border border-amber-200/50 dark:border-stone-800 shadow-inner space-y-3">
          <p className="font-sanskrit text-base sm:text-xl font-bold text-[#731E00] dark:text-amber-200 leading-relaxed text-center whitespace-pre-line tracking-wide">
            {sanskritText}
          </p>
          <div className="border-t border-amber-100 dark:border-stone-800 pt-2.5 text-center">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mr-1.5">
              {lang === 'gujarati' ? t.originalMeaningTitle : t.translatedMeaningTitle}
            </span>
            <span className="text-xs sm:text-sm text-[#4A3E34] dark:text-[#C5B7A8] font-medium leading-normal">
              {currentMeaning}
            </span>
          </div>
        </div>

        {/* Progress Bar & Scrubber */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-amber-200/60 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#8B2500] dark:accent-amber-400"
              title="Seek audio position"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#7A6B5C] dark:text-[#A89886]">
            <span>{formatTime(currentTime)}</span>
            <span>{isLoadingAudio ? t.audioBuffering : formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Audio Player Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
          {/* Skip Previous Shloka */}
          <button
            type="button"
            onClick={handlePrevious}
            title={t.prevVerseTitle}
            className="w-11 h-11 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E8DFD1] dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-xs"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Rewind 5s */}
          <button
            type="button"
            onClick={handleRewind}
            title={t.rewind5}
            className="w-10 h-10 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E8DFD1] dark:border-[#3D342C] text-[#6B5E51] dark:text-stone-300 hover:bg-amber-100 hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer text-xs font-bold"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            title={isPlaying ? t.pauseTitle : t.playTitle}
            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7A1E00] via-[#8B2500] to-[#B33900] text-amber-50 shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer ring-4 ring-amber-400/40"
          >
            {isLoadingAudio ? (
              <div className="w-6 h-6 border-3 border-amber-200 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Forward 5s */}
          <button
            type="button"
            onClick={handleForward}
            title={t.forward5}
            className="w-10 h-10 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E8DFD1] dark:border-[#3D342C] text-[#6B5E51] dark:text-stone-300 hover:bg-amber-100 hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer text-xs font-bold"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Skip Next Shloka */}
          <button
            type="button"
            onClick={handleNext}
            title={t.nextVerseTitle}
            className="w-11 h-11 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E8DFD1] dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-xs"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Audio Speed Adjustment Toolbar */}
        <div className="pt-3 border-t border-amber-200/60 dark:border-[#3D342C]">
          <div className="bg-white/80 dark:bg-[#1E1815] p-3 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B2500] dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.speedLabel}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-[#8B2500] dark:text-amber-300 text-[11px] font-mono font-bold">
                {playbackSpeed}x
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SPEED_OPTIONS.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleSpeedChange(spd)}
                  className={`flex-1 min-w-[42px] py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                    playbackSpeed === spd
                      ? 'bg-[#8B2500] text-amber-50 shadow-xs ring-1 ring-amber-400'
                      : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#A89886] hover:bg-amber-100'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHLOKAS LIST IN ACTIVE SELECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-500" />
            <span>
              {t.verseListTitle(rangeStart, rangeEnd, displayedShlokas.length)}
            </span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            {t.verseListSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-1 no-scrollbar">
          {displayedShlokas.map((s) => {
            const isCurrent = s.id === currentShlokaId;
            const verseLine = preferences?.sanskritScript === 'gujarati' ? s.sanskritGujarati : s.sanskritDevanagari;
            const meaningLine = getShlokaMeaning(s, lang);
            return (
              <div
                key={s.id}
                ref={isCurrent ? activeVerseRef : undefined}
                onClick={() => {
                  // Tapping a verse in list plays that verse
                  playShloka(s.id, true, audioFormat);
                  setVerseRepeatIndex(1);
                  verseRepeatIndexRef.current = 1;
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-500 shadow-md ring-2 ring-amber-400/50'
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

      {/* REPEAT MODAL DIALOG (Exact replication of user screenshot) */}
      {isRepeatModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={closeRepeatModal}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-[#F4EFF6] dark:bg-[#27212E] p-6 shadow-2xl border border-purple-200/40 dark:border-purple-900/40 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-2xl text-[#2C2416] dark:text-amber-100">
                {t.repeatModalTitle}
              </h3>
              <button
                type="button"
                onClick={closeRepeatModal}
                className="p-1 rounded-full text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-5">
              {/* Row 1: શ્લોક [  ] થી [  ] (Blank by default - user fills for single verse or group range) */}
              <div className="flex items-center gap-2.5 text-base font-bold text-[#2C2416] dark:text-amber-100">
                <span className="text-base">{t.shlokaLabel}</span>
                <input
                  type="number"
                  min="1"
                  max="315"
                  value={modalStart}
                  onChange={(e) => setModalStart(e.target.value)}
                  placeholder="૧"
                  className="w-24 px-3 py-2 text-center text-lg font-bold rounded-2xl bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 text-[#2C2416] dark:text-amber-100 placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#8B2500] shadow-2xs"
                  required
                  autoFocus
                />
                <span className="text-base">{t.toLabel}</span>
                <input
                  type="number"
                  min="1"
                  max="315"
                  value={modalEnd}
                  onChange={(e) => setModalEnd(e.target.value)}
                  placeholder="૩૧૫"
                  className="w-24 px-3 py-2 text-center text-lg font-bold rounded-2xl bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 text-[#2C2416] dark:text-amber-100 placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#8B2500] shadow-2xs"
                />
              </div>

              {/* Row 2: કેટલી વાર [ 2 ] */}
              <div className="flex items-center gap-3 text-base font-bold text-[#2C2416] dark:text-amber-100">
                <span className="text-base">{t.howManyTimesLabel}</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={modalRepeatCount}
                  onChange={(e) => setModalRepeatCount(e.target.value)}
                  placeholder="૨"
                  className="w-24 px-3 py-2 text-center text-lg font-bold rounded-2xl bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 text-[#2C2416] dark:text-amber-100 placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#8B2500] shadow-2xs"
                  required
                />
              </div>

              {/* Row 3: Radio Options (1-1, 2-2  and  1-2, 1-2) */}
              <div className="flex items-center justify-center gap-6 pt-1 text-base font-bold text-[#2C2416] dark:text-amber-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modalRepetitionOrder"
                    value="each_verse"
                    checked={modalRepetitionOrder === 'each_verse'}
                    onChange={() => setModalRepetitionOrder('each_verse')}
                    className="w-5 h-5 text-[#8B2500] focus:ring-[#8B2500] accent-[#8B2500] cursor-pointer"
                  />
                  <span className="text-base font-semibold">{t.patternEachVerse}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modalRepetitionOrder"
                    value="whole_range"
                    checked={modalRepetitionOrder === 'whole_range'}
                    onChange={() => setModalRepetitionOrder('whole_range')}
                    className="w-5 h-5 text-[#8B2500] focus:ring-[#8B2500] accent-[#8B2500] cursor-pointer"
                  />
                  <span className="text-base font-semibold">{t.patternWholeRange}</span>
                </label>
              </div>

              {/* Row 4: Action Buttons [ રદ કરો ] [ વગાડો ] */}
              <div className="flex items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={closeRepeatModal}
                  className="px-6 py-2.5 rounded-full bg-white dark:bg-[#1E1815] text-[#8B2500] dark:text-amber-300 font-bold text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-50 shadow-2xs transition cursor-pointer min-w-[100px]"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white dark:bg-[#342738] text-[#8B2500] dark:text-amber-300 font-bold text-sm border border-purple-200 dark:border-purple-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-2xs transition cursor-pointer min-w-[100px]"
                >
                  {t.playBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
