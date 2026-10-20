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
  ArrowRight
} from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { AudioFormat, AUDIO_FORMAT_OPTIONS, getAudioUrls, globalAudio } from '../utils/audioPlayer';
import { getShlokaMeaning, getShlokaChapterName, LANGUAGE_METADATA } from '../utils/translationHelper';

interface UdgaanViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onSelectShloka?: (shlokaId: number) => void;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
}

export type PlaybackMode = 'single' | 'group';
export type RepeatMode = 'loop_verse' | 'continuous' | 'once';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

const UDGAAN_I18N = {
  gujarati: {
    tag: 'અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)',
    title: 'સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ',
    desc: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. પુરૂષ સ્વરમાં મધુર સંગીત સાથે અવિરત મંગલ ગાન.',
    badge: '૩૧૫ શ્લોક • અવિરત વૈદિક ગાન',
    voiceStyleTitle: 'સ્વર અને ગાન શૈલી (Audio Voice & Raag):',
    voiceStyleDesc: 'મૂળ પુરૂષ સ્વર (સંગીત સાથે)',
    playbackModeLabel: 'શ્રવણ પદ્ધતિ (Playback Mode):',
    singleModeLabel: '૧ શ્લોક શ્રવણ (Single Shloka)',
    groupModeLabel: 'જૂથ શ્રવણ (Group Range)',
    singleModeDesc: 'કોઈપણ ૧ શ્લોક સાંભળો અથવા વારંવાર લૂપ કરી કંઠસ્થ કરો',
    groupModeDesc: 'કોઈપણ શ્લોક ૧ થી ૩૧૫ વચ્ચેનો પ્રારંભિક અને અંતિમ શ્લોક પસંદ કરી જૂથ શ્રવણ કરો',
    rangePlaybackTitle: 'શ્લોક શ્રેણી જૂથ શ્રવણ (Shloka Range Playback)',
    startVerseLabel: 'પ્રારંભિક શ્લોક',
    endVerseLabel: 'અંતિમ શ્લોક',
    singleVerseLabel: 'શ્લોક પસંદ કરો',
    totalVersesBadge: (count: number) => `કુલ ${count} શ્લોક શ્રેણી`,
    playRangeBtn: (start: number, end: number) => `શ્લોક ${start} થી ${end} જૂથ શ્રવણ શરૂ કરો`,
    playSingleBtn: (id: number) => `શ્લોક ${id} શ્રવણ શરૂ કરો`,
    fullScriptureChanting: 'સર્વ ૧ થી ૩૧૫ અખંડ પાઠ',
    rangePrefix: (start: number, end: number) => `શ્લોક ${start} થી ${end}`,
    activeHeroVerseTitle: (id: number) => `સત્સંગ દીક્ષા • શ્લોક ${id}`,
    studyBtn: 'અધ્યયન જુઓ',
    mangalChanting: '॥ શ્રી સ્વામિનારાયણો વિજયતે ॥',
    originalMeaningTitle: 'મૂળ ગુજરાતી ભાવાર્થ:',
    translatedMeaningTitle: 'ભાવાર્થ:',
    speedLabel: 'ગતિ (Speed)',
    repeatLabel: 'પુનરાવર્તન (Repeat)',
    repeatLoopVerse: 'આ શ્લોક લૂપ',
    repeatLoopVerseTitle: 'આ શ્લોક વારંવાર સાંભળો (Loop this verse)',
    repeatContinuous: 'અવિરત ક્રમિક',
    repeatContinuousTitle: 'આગલા શ્લોક પર આપમેળે આગળ વધો (Continuous Auto-advance)',
    repeatOnce: 'એક વાર',
    repeatOnceTitle: 'એક વાર ગાન બાદ અટકો (Play once)',
    prevVerseTitle: 'પાછલો શ્લોક (Previous)',
    nextVerseTitle: 'આગલો શ્લોક (Next)',
    rewind5: '૫ સેકન્ડ પાછળ (-5s)',
    forward5: '૫ સેકન્ડ આગળ (+5s)',
    playTitle: 'શ્રવણ શરૂ કરો (Play)',
    pauseTitle: 'વિરામ (Pause)',
    verseListTitle: (start: number, end: number, count: number) => `શ્લોક યાદી (શ્લોક ${start} થી ${end} - કુલ ${count})`,
    verseListSubtitle: 'ક્લિક કરી સીધા ગાન સાંભળો',
    chapterPrefix: 'પ્રકરણ',
    nowPlaying: 'હવે વાગી રહ્યું છે',
    audioBuffering: 'લોડ થઈ રહ્યું છે...',
    audioError: 'ઓડિયો લોડ કરવામાં ક્ષતિ, ફરી પ્રયાસ કરો.'
  },
  hindi: {
    tag: 'अधिकृत संस्कृत उद्गान (Authentic Vedic Chanting)',
    title: 'सत्संग दीक्षा उद्गान श्रवण',
    desc: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रबोधित ३१५ संस्कृत श्लोकों का पवित्र कृष्ण यजुर्वेदीय उद्गान श्रवण। पुरुष स्वर में मधुर संगीत के साथ अविरत मंगल गान।',
    badge: '३१५ श्लोक • अविरत वैदिक गान',
    voiceStyleTitle: 'स्वर एवं गान शैली (Audio Voice & Raag):',
    voiceStyleDesc: 'मूल पुरुष स्वर (संगीत के साथ)',
    playbackModeLabel: 'श्रवण पद्धति (Playback Mode):',
    singleModeLabel: '१ श्लोक श्रवण (Single Shloka)',
    groupModeLabel: 'समूह श्रवण (Group Range)',
    singleModeDesc: 'कोई भी १ श्लोक सुनें अथवा बार-बार लूप कर कंठस्थ करें',
    groupModeDesc: 'श्लोक १ से ३१५ के मध्य कोई भी प्रारंभिक एवं अंतिम श्लोक चुनकर समूह श्रवण करें',
    rangePlaybackTitle: 'श्लोक श्रेणी समूह श्रवण (Shloka Range Playback)',
    startVerseLabel: 'प्रारंभिक श्लोक',
    endVerseLabel: 'अंतिम श्लोक',
    singleVerseLabel: 'श्लोक चुनें',
    totalVersesBadge: (count: number) => `कुल ${count} श्लोक श्रेणी`,
    playRangeBtn: (start: number, end: number) => `श्लोक ${start} से ${end} समूह श्रवण शुरू करें`,
    playSingleBtn: (id: number) => `श्लोक ${id} श्रवण शुरू करें`,
    fullScriptureChanting: 'सर्व १ से ३१५ अखंड पाठ',
    rangePrefix: (start: number, end: number) => `श्लोक ${start} से ${end}`,
    activeHeroVerseTitle: (id: number) => `सत्संग दीक्षा • श्लोक ${id}`,
    studyBtn: 'अध्ययन देखें',
    mangalChanting: '॥ श्री स्वामिनारायणो विजयते ॥',
    originalMeaningTitle: 'मूल गुजराती भावार्थ:',
    translatedMeaningTitle: 'हिंदी भावार्थ:',
    speedLabel: 'गति (Speed)',
    repeatLabel: 'पुनरावर्तन (Repeat)',
    repeatLoopVerse: 'यह श्लोक लूप',
    repeatLoopVerseTitle: 'यह श्लोक बार-बार सुनें (Loop this verse)',
    repeatContinuous: 'अविरत क्रमिक',
    repeatContinuousTitle: 'अगले श्लोक पर स्वतः आगे बढ़ें (Continuous Auto-advance)',
    repeatOnce: 'एक बार',
    repeatOnceTitle: 'एक बार गान के बाद विराम (Play once)',
    prevVerseTitle: 'पिछला श्लोक (Previous)',
    nextVerseTitle: 'अगला श्लोक (Next)',
    rewind5: '५ सेकंड पीछे (-5s)',
    forward5: '५ सेकंड आगे (+5s)',
    playTitle: 'श्रवण शुरू करें (Play)',
    pauseTitle: 'विराम (Pause)',
    verseListTitle: (start: number, end: number, count: number) => `श्लोक सूची (श्लोक ${start} से ${end} - कुल ${count})`,
    verseListSubtitle: 'क्लिक कर सीधे गान सुनें',
    chapterPrefix: 'प्रकरण',
    nowPlaying: 'अब बज रहा है',
    audioBuffering: 'लोड हो रहा है...',
    audioError: 'ऑडियो लोड करने में त्रुटि, पुनः प्रयास करें।'
  },
  english: {
    tag: 'Authentic Sanskrit Udgaan (Authentic Vedic Chanting)',
    title: 'Satsang Diksha Udgaan Audio',
    desc: 'Sacred Krishna Yajurvedic chanting of all 315 Sanskrit verses composed by Pragat Brahmaswarup Mahant Swami Maharaj. Melodious male recital with divine ambient background accompaniment.',
    badge: '315 Verses • Vedic Chanting',
    voiceStyleTitle: 'Audio Voice & Chanting Style:',
    voiceStyleDesc: 'Authentic Male Voice with Divine Music',
    playbackModeLabel: 'Playback Mode:',
    singleModeLabel: 'Single Shloka (1 Verse)',
    groupModeLabel: 'Group Playback (Range)',
    singleModeDesc: 'Listen to a single verse or loop it repeatedly for memorization',
    groupModeDesc: 'Select any start and end verse from 1 to 315 for continuous group playback',
    rangePlaybackTitle: 'Shloka Range Group Playback',
    startVerseLabel: 'Start Verse',
    endVerseLabel: 'End Verse',
    singleVerseLabel: 'Select Verse',
    totalVersesBadge: (count: number) => `Total ${count} Verses Range`,
    playRangeBtn: (start: number, end: number) => `Play Range (${start}–${end})`,
    playSingleBtn: (id: number) => `Play Shloka #${id}`,
    fullScriptureChanting: 'Full 1–315 Scripture Recitation',
    rangePrefix: (start: number, end: number) => `Verses ${start}–${end}`,
    activeHeroVerseTitle: (id: number) => `Satsang Diksha • Verse ${id}`,
    studyBtn: 'Study Verse',
    mangalChanting: '॥ Shree Swaminarayanō Vijayate ॥',
    originalMeaningTitle: 'Original Gujarati Meaning:',
    translatedMeaningTitle: 'Meaning:',
    speedLabel: 'Speed',
    repeatLabel: 'Repeat Mode',
    repeatLoopVerse: 'Loop Verse',
    repeatLoopVerseTitle: 'Loop current verse repeatedly',
    repeatContinuous: 'Continuous',
    repeatContinuousTitle: 'Continuous auto-advance to next verse',
    repeatOnce: 'Play Once',
    repeatOnceTitle: 'Stop after playing once',
    prevVerseTitle: 'Previous Verse',
    nextVerseTitle: 'Next Verse',
    rewind5: 'Rewind 5s',
    forward5: 'Forward 5s',
    playTitle: 'Play Audio',
    pauseTitle: 'Pause Audio',
    verseListTitle: (start: number, end: number, count: number) => `Verses List (${start}–${end} • Total ${count})`,
    verseListSubtitle: 'Tap any verse to chant',
    chapterPrefix: 'Chapter',
    nowPlaying: 'Now Playing',
    audioBuffering: 'Loading audio...',
    audioError: 'Error loading audio, please retry.'
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
  onSelectShloka 
}) => {
  // Playback mode: 'single' (1 shlok) vs 'group' (range between any start and end from 1 to 315)
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('single');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(50);
  const [audioFormat, setAudioFormat] = useState<AudioFormat>('sanskrit');
  
  const [currentShlokaId, setCurrentShlokaId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('continuous');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeVerseRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Synchronized state refs to prevent stale closure bugs in audio event handlers
  const currentShlokaIdRef = useRef<number>(currentShlokaId);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const playbackModeRef = useRef<PlaybackMode>(playbackMode);
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  const rangeStartRef = useRef<number>(rangeStart);
  const rangeEndRef = useRef<number>(rangeEnd);
  const audioFormatRef = useRef<AudioFormat>(audioFormat);
  const playbackSpeedRef = useRef<number>(playbackSpeed);
  const isMutedRef = useRef<boolean>(isMuted);

  // Sync refs on render
  currentShlokaIdRef.current = currentShlokaId;
  isPlayingRef.current = isPlaying;
  playbackModeRef.current = playbackMode;
  repeatModeRef.current = repeatMode;
  rangeStartRef.current = rangeStart;
  rangeEndRef.current = rangeEnd;
  audioFormatRef.current = audioFormat;
  playbackSpeedRef.current = playbackSpeed;
  isMutedRef.current = isMuted;

  const lang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const t = getUdgaanStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

  // Current shloka object
  const currentShloka = useMemo(() => {
    return shlokas.find(s => s.id === currentShlokaId) || shlokas[0];
  }, [shlokas, currentShlokaId]);

  // Active shlokas list based on playback mode
  const displayedShlokas = useMemo(() => {
    if (playbackMode === 'group') {
      const s = Math.min(rangeStart, rangeEnd);
      const e = Math.max(rangeStart, rangeEnd);
      return shlokas.filter(item => item.id >= s && item.id <= e);
    }
    // In single mode, show all 315 shlokas for quick selection
    return shlokas;
  }, [shlokas, playbackMode, rangeStart, rangeEnd]);

  // Helper to adjust range bounds cleanly
  const handleSetRange = (newStart: number, newEnd: number, autoStartPlayback: boolean = false) => {
    const s = Math.max(1, Math.min(315, newStart));
    const e = Math.max(s, Math.min(315, newEnd));
    setRangeStart(s);
    setRangeEnd(e);
    rangeStartRef.current = s;
    rangeEndRef.current = e;

    if (autoStartPlayback) {
      playShloka(s, true, audioFormatRef.current);
    } else if (currentShlokaIdRef.current < s || currentShlokaIdRef.current > e) {
      playShloka(s, isPlayingRef.current, audioFormatRef.current);
    }
  };

  // Play a specific shloka with automatic mirror fallback
  const playShloka = (shlokaId: number, autoPlay: boolean = true, formatToUse: AudioFormat = audioFormatRef.current) => {
    isTransitioningRef.current = true;
    currentShlokaIdRef.current = shlokaId;
    setCurrentShlokaId(shlokaId);
    setHasError(false);

    // Stop global audio from ShlokaCard so sounds do not clash
    globalAudio.stop();

    if (playbackModeRef.current === 'group') {
      // Ensure range covers this shloka if user clicked a shloka outside current range
      if (shlokaId < rangeStartRef.current) {
        setRangeStart(shlokaId);
        rangeStartRef.current = shlokaId;
      } else if (shlokaId > rangeEndRef.current) {
        setRangeEnd(shlokaId);
        rangeEndRef.current = shlokaId;
      }
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

  // Previous Shloka
  const handlePrevious = () => {
    const currentId = currentShlokaIdRef.current;
    if (playbackModeRef.current === 'group') {
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const prevId = currentId > start ? currentId - 1 : end;
      playShloka(prevId, isPlayingRef.current, audioFormatRef.current);
    } else {
      const prevId = currentId > 1 ? currentId - 1 : 315;
      playShloka(prevId, isPlayingRef.current, audioFormatRef.current);
    }
  };

  // Next Shloka
  const handleNext = () => {
    const currentId = currentShlokaIdRef.current;
    if (playbackModeRef.current === 'group') {
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const nextId = currentId < end ? currentId + 1 : start;
      playShloka(nextId, isPlayingRef.current, audioFormatRef.current);
    } else {
      const nextId = currentId < 315 ? currentId + 1 : 1;
      playShloka(nextId, isPlayingRef.current, audioFormatRef.current);
    }
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

  // On audio ended - handles repeat modes (loop_verse, continuous, once)
  const handleAudioEnded = () => {
    if (isTransitioningRef.current) return;

    // 1. Loop current verse repeatedly
    if (repeatModeRef.current === 'loop_verse') {
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

    // 2. Play once
    if (repeatModeRef.current === 'once') {
      if (playbackModeRef.current === 'single') {
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }
      // In group mode with 'once': advance to next verse until end of range
      const currentId = currentShlokaIdRef.current;
      if (currentId >= rangeEndRef.current) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }
      playShloka(currentId + 1, true, audioFormatRef.current);
      return;
    }

    // 3. Continuous sequential playback
    if (playbackModeRef.current === 'group') {
      const currentId = currentShlokaIdRef.current;
      const start = rangeStartRef.current;
      const end = rangeEndRef.current;
      const nextId = currentId < end ? currentId + 1 : start;
      playShloka(nextId, true, audioFormatRef.current);
    } else {
      // In single mode with continuous repeat: advance to next shloka (1 -> 2 -> ... -> 315)
      const currentId = currentShlokaIdRef.current;
      const nextId = currentId < 315 ? currentId + 1 : 1;
      playShloka(nextId, true, audioFormatRef.current);
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6 animate-fadeIn pb-32 select-none">
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

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-amber-100 text-xs font-semibold border border-amber-300/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.badge}</span>
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

      {/* PLAYBACK MODE SELECTOR: Single Shloka vs Group Playback (Shloka Range) */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-4 sm:p-5 border border-[#E8DFD1] dark:border-[#3D342C] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>{t.playbackModeLabel}</span>
            </h3>
            <p className="text-xs text-[#7A6B5C] dark:text-[#A89886] mt-0.5">
              {playbackMode === 'single' ? t.singleModeDesc : t.groupModeDesc}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-[#FAF6F0] dark:bg-[#2A221C] border border-[#E8DFD1] dark:border-[#3D342C] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPlaybackMode('single')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                playbackMode === 'single'
                  ? 'bg-gradient-to-r from-[#8B2500] to-[#B33900] text-amber-50 shadow-xs'
                  : 'text-[#6B5E51] dark:text-[#A89886] hover:text-[#8B2500]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{t.singleModeLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setPlaybackMode('group')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                playbackMode === 'group'
                  ? 'bg-gradient-to-r from-[#8B2500] to-[#B33900] text-amber-50 shadow-xs'
                  : 'text-[#6B5E51] dark:text-[#A89886] hover:text-[#8B2500]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.groupModeLabel}</span>
            </button>
          </div>
        </div>

        {/* CONDITIONALLY SHOWN: Group Playback Range Selector (Any start & end from 1 to 315) */}
        {playbackMode === 'group' && (
          <div className="pt-3 border-t border-[#F0E8DC] dark:border-[#352C24] space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300">
                {t.rangePlaybackTitle}
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300/50 text-[#8B2500] dark:text-amber-300 text-xs font-bold shadow-2xs">
                <span>{t.totalVersesBadge(Math.max(rangeStart, rangeEnd) - Math.min(rangeStart, rangeEnd) + 1)}</span>
                <span className="text-stone-400">•</span>
                <span>{t.rangePrefix(Math.min(rangeStart, rangeEnd), Math.max(rangeStart, rangeEnd))}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Start Verse Stepper */}
              <div className="sm:col-span-4 bg-[#FAF6F0] dark:bg-[#2A221C] p-3 rounded-2xl border border-amber-200/60 dark:border-[#3D342C]">
                <label className="block text-[11px] font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wider mb-1.5">
                  {t.startVerseLabel} (1–315)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart - 1, rangeEnd)}
                    disabled={rangeStart <= 1}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/60 dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                    title="Decrease start verse"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">#</span>
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
                      className="w-full pl-7 pr-3 py-1.5 text-center font-bold text-base rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/70 dark:border-amber-800 text-[#8B2500] dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart + 1, Math.max(rangeStart + 1, rangeEnd))}
                    disabled={rangeStart >= 315}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/60 dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                    title="Increase start verse"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* End Verse Stepper */}
              <div className="sm:col-span-4 bg-[#FAF6F0] dark:bg-[#2A221C] p-3 rounded-2xl border border-amber-200/60 dark:border-[#3D342C]">
                <label className="block text-[11px] font-bold text-[#8B2500] dark:text-amber-300 uppercase tracking-wider mb-1.5">
                  {t.endVerseLabel} (1–315)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart, Math.max(rangeStart, rangeEnd - 1))}
                    disabled={rangeEnd <= rangeStart}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/60 dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                    title="Decrease end verse"
                  >
                    -
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 dark:text-amber-400">#</span>
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
                      className="w-full pl-7 pr-3 py-1.5 text-center font-bold text-base rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/70 dark:border-amber-800 text-[#8B2500] dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetRange(rangeStart, rangeEnd + 1)}
                    disabled={rangeEnd >= 315}
                    className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1815] border border-amber-300/60 dark:border-[#3D342C] text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-base"
                    title="Increase end verse"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Button: Start Range Playback */}
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
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#B45309] hover:from-[#8B2500] hover:to-[#C25E00] text-amber-50 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.playRangeBtn(rangeStart, rangeEnd)}</span>
                </button>
              </div>
            </div>

            {/* Range Presets Helpers */}
            <div className="flex flex-wrap gap-2 pt-1 items-center">
              <span className="text-[11px] font-semibold text-[#7A6B5C] dark:text-[#A89886] flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>ઝડપી શ્રેણી:</span>
              </span>
              <button
                type="button"
                onClick={() => handleSetRange(1, 315)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  rangeStart === 1 && rangeEnd === 315
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-100/80 dark:bg-[#32251D] text-amber-900 dark:text-amber-200 hover:bg-amber-200 border border-amber-300/60'
                }`}
              >
                {t.fullScriptureChanting}
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 4))}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              >
                +5 શ્લોક
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 9))}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              >
                +10 શ્લોક
              </button>
              <button
                type="button"
                onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 24))}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              >
                +25 શ્લોક
              </button>
            </div>
          </div>
        )}

        {/* CONDITIONALLY SHOWN: Single Shloka Quick Picker */}
        {playbackMode === 'single' && (
          <div className="pt-3 border-t border-[#F0E8DC] dark:border-[#352C24] flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8B2500] dark:text-amber-300">
                {t.singleVerseLabel}:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => playShloka(Math.max(1, currentShlokaId - 1), isPlaying, audioFormat)}
                  disabled={currentShlokaId <= 1}
                  className="w-8 h-8 rounded-lg bg-[#FAF6F0] dark:bg-[#2A221C] border border-amber-300/50 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-sm"
                >
                  -
                </button>
                <div className="relative w-20">
                  <input
                    type="number"
                    min="1"
                    max="315"
                    value={currentShlokaId}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= 315) {
                        playShloka(val, isPlaying, audioFormat);
                      }
                    }}
                    className="w-full py-1 text-center font-bold text-sm rounded-lg bg-[#FAF6F0] dark:bg-[#2A221C] border border-amber-300/70 text-[#8B2500] dark:text-amber-200 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => playShloka(Math.min(315, currentShlokaId + 1), isPlaying, audioFormat)}
                  disabled={currentShlokaId >= 315}
                  className="w-8 h-8 rounded-lg bg-[#FAF6F0] dark:bg-[#2A221C] border border-amber-300/50 text-[#8B2500] dark:text-amber-300 font-bold hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => playShloka(currentShlokaId, true, audioFormat)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#7A1E00] via-[#8B2500] to-[#B45309] text-amber-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.playSingleBtn(currentShlokaId)}</span>
            </button>
          </div>
        )}
      </div>

      {/* RESTORED MAIN HERO AUDIO PLAYER PANEL */}
      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] dark:from-[#241D19] dark:to-[#1C1714] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/50 dark:border-amber-600/40 shadow-xl space-y-6">
        {/* Top Player Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 dark:border-[#3D342C] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7A1E00] to-[#A03900] text-amber-300 font-bold text-base flex items-center justify-center shadow-md border border-amber-300/40 flex-shrink-0">
              #{currentShloka.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
                  {isPlaying ? t.nowPlaying : t.pauseTitle}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                  {t.chapterPrefix} {currentShloka.chapterId}: {getShlokaChapterName(currentShloka, lang)}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#7A1E00] dark:text-amber-200">
                {currentShloka.titleGu}
                {lang !== 'gujarati' && (
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400 ml-2">
                    ({lang === 'hindi' ? currentShloka.titleHi : currentShloka.titleEn})
                  </span>
                )}
              </h3>
            </div>
          </div>

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

        {/* Audio Toolbar: Speed Adjustment & Repeat / Loop Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-amber-200/60 dark:border-[#3D342C]">
          {/* 1. Playback Speed Adjustment (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x) */}
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

          {/* 2. Repeat / Loop Mode Options ("repeatedly hear or not") */}
          <div className="bg-white/80 dark:bg-[#1E1815] p-3 rounded-2xl border border-amber-200/60 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#8B2500] dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.repeatLabel}</span>
              </span>
              <span className="text-[10px] text-[#7A6B5C] dark:text-[#A89886]">
                {repeatMode === 'loop_verse' 
                  ? t.repeatLoopVerse 
                  : repeatMode === 'continuous' 
                  ? t.repeatContinuous 
                  : t.repeatOnce}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setRepeatMode('loop_verse')}
                title={t.repeatLoopVerseTitle}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center ${
                  repeatMode === 'loop_verse'
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs ring-1 ring-amber-400'
                    : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#A89886] hover:bg-amber-100'
                }`}
              >
                <span>🔂</span>
                <span className="truncate">{t.repeatLoopVerse}</span>
              </button>
              <button
                type="button"
                onClick={() => setRepeatMode('continuous')}
                title={t.repeatContinuousTitle}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center ${
                  repeatMode === 'continuous'
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs ring-1 ring-amber-400'
                    : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#A89886] hover:bg-amber-100'
                }`}
              >
                <span>🔁</span>
                <span className="truncate">{t.repeatContinuous}</span>
              </button>
              <button
                type="button"
                onClick={() => setRepeatMode('once')}
                title={t.repeatOnceTitle}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center ${
                  repeatMode === 'once'
                    ? 'bg-[#8B2500] text-amber-50 shadow-xs ring-1 ring-amber-400'
                    : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#6B5E51] dark:text-[#A89886] hover:bg-amber-100'
                }`}
              >
                <span>⏹️</span>
                <span className="truncate">{t.repeatOnce}</span>
              </button>
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
              {playbackMode === 'group'
                ? t.verseListTitle(Math.min(rangeStart, rangeEnd), Math.max(rangeStart, rangeEnd), displayedShlokas.length)
                : t.verseListTitle(1, 315, 315)}
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
                onClick={() => playShloka(s.id, true, audioFormat)}
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

      {/* STICKY BOTTOM AUDIO PLAYER BAR (Appears while playing or paused) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1E1815]/95 backdrop-blur-md border-t border-amber-300/40 dark:border-stone-800 shadow-2xl py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Active Shloka Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#8B2500] text-amber-100 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              #{currentShloka.id}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#8B2500] dark:text-amber-300 truncate">
                {currentShloka.titleGu}
              </p>
              <p className="text-[10px] text-[#7A6B5C] dark:text-[#A89886] truncate">
                {formatTime(currentTime)} / {formatTime(duration)} • {playbackSpeed}x • {repeatMode === 'loop_verse' ? '🔂 Loop' : repeatMode === 'continuous' ? '🔁 Auto' : '⏹️ Once'}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrevious}
              className="p-1.5 rounded-lg text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title={t.prevVerseTitle}
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-9 h-9 rounded-xl bg-[#8B2500] text-amber-100 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              title={isPlaying ? t.pauseTitle : t.playTitle}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title={t.nextVerseTitle}
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
