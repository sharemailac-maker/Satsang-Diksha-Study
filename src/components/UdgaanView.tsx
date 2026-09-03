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
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Shloka, UserPreferences } from '../types';
import { AudioFormat, AUDIO_FORMAT_OPTIONS, getAudioUrls } from '../utils/audioPlayer';
import { getShlokaMeaning, getShlokaChapterName, LANGUAGE_METADATA } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface UdgaanViewProps {
  shlokas: Shloka[];
  preferences: UserPreferences;
  onSelectShloka?: (shlokaId: number) => void;
}

interface UdgaanSection {
  id: number;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  titleDeva: string;
  range: [number, number];
  descriptionGu: string;
  descriptionHi: string;
  descriptionEn: string;
}

// Exact 6 Udgaan verse ranges per BAPS Satsang Diksha official publication
const UDGAAN_SECTIONS: UdgaanSection[] = [
  {
    id: 1,
    titleGu: 'ઉદ્ગાન ૧ (Udgaan 1)',
    titleHi: 'उद्गान १ (श्लोक १–५०)',
    titleEn: 'Udgaan 1 (Verses 1–50)',
    titleDeva: 'उद्गानम् १ (श्लोकाः १–५०)',
    range: [1, 50],
    descriptionGu: 'મંગલાચરણ, શાસ્ત્ર પ્રયોજન, નિત્ય પ્રાતઃપૂજા વિધિ અને આહ્નિક નિયમ',
    descriptionHi: 'मंगलाचरण, शास्त्र प्रयोजन, नित्य प्रातःपूजा विधि एवं आह्निक नियम',
    descriptionEn: 'Invocation, purpose of scripture, morning puja ritual, and daily practices'
  },
  {
    id: 2,
    titleGu: 'ઉદ્ગાન ૨ (Udgaan 2)',
    titleHi: 'उद्गान २ (श्लोक ५१–११५)',
    titleEn: 'Udgaan 2 (Verses 51–115)',
    titleDeva: 'उद्गानम् २ (श्लोकाः ५१–११५)',
    range: [51, 115],
    descriptionGu: 'તિલક-ચાંદલો, કંઠી ધારણ, આહાર શુદ્ધિ, ઉપવાસ અને સદાચાર નિયમો',
    descriptionHi: 'तिलक-चांदलो, कंठी धारण, आहार शुद्धि, उपवास एवं सदाचार नियम',
    descriptionEn: 'Tilak-chandlo, kanthi, dietary purity, fasting, and moral conduct'
  },
  {
    id: 3,
    titleGu: 'ઉદ્ગાન ૩ (Udgaan 3)',
    titleHi: 'उद्गान ३ (श्लोक ११६–१५८)',
    titleEn: 'Udgaan 3 (Verses 116–158)',
    titleDeva: 'उद्गानम् ३ (श्लोकाः ११६–१५८)',
    range: [116, 158],
    descriptionGu: 'નિર્વ્યસની જીવન, અહિંસા, સત્સંગ સભા અને ઘરસભા મર્યાદા',
    descriptionHi: 'निर्व्यसनी जीवन, अहिंसा, सत्संग सभा एवं घरसभा मर्यादा',
    descriptionEn: 'Addiction-free living, non-violence, satsang assembly, and home assembly'
  },
  {
    id: 4,
    titleGu: 'ઉદ્ગાન ૪ (Udgaan 4)',
    titleHi: 'उद्गान ४ (श्लोक १५९–२०૮)',
    titleEn: 'Udgaan 4 (Verses 159–208)',
    titleDeva: 'उद्गानम् ४ (श्लोकाः १५९–२०८)',
    range: [159, 208],
    descriptionGu: 'પારિવારિક સંવાદિતા, માતા-પિતા ભક્તિ, સંપ અને વ્યવહાર શુદ્ધિ',
    descriptionHi: 'पारिवारिक सौहार्द, माता-पिता भक्ति, संप एवं व्यवहार शुद्धि',
    descriptionEn: 'Family harmony, devotion to parents, unity, and social integrity'
  },
  {
    id: 5,
    titleGu: 'ઉદ્ગાન ૫ (Udgaan 5)',
    titleHi: 'उद्गान ५ (श्लोक २०९–२५७)',
    titleEn: 'Udgaan 5 (Verses 209–257)',
    titleDeva: 'उद्गानम् ५ (श्लोकाः २०९–२५७)',
    range: [209, 257],
    descriptionGu: 'અંતઃશત્રુ વિજય, નિર્દોષબુદ્ધિ, મહિમા ચિંતન અને દિવ્યભાવ સાધના',
    descriptionHi: 'अंतःशत्रु विजय, निर्दोषबुद्धि, महिमा चिंतन एवं दिव्यभाव साधना',
    descriptionEn: 'Overcoming inner enemies, seeing virtues, divine glory, and spiritual vision'
  },
  {
    id: 6,
    titleGu: 'ઉદ્ગાન ૬ (Udgaan 6)',
    titleHi: 'उद्गान ६ (श्लोक २५८–३१५)',
    titleEn: 'Udgaan 6 (Verses 258–315)',
    titleDeva: 'उद्गानम् ६ (श्लोकाः २५८–३१५)',
    range: [258, 315],
    descriptionGu: 'અક્ષરપુરુષોત્તમ દાર્શનિક સિદ્ધાંત, ગુરુભક્તિ, આશીર્વાદ અને ફલશ્રુતિ',
    descriptionHi: 'अक्षरपुरुषोत्तम दार्शनिक सिद्धांत, गुरुभक्ति, आशीर्वाद एवं फलश्रुति',
    descriptionEn: 'Akshar-Purushottam philosophy, devotion to Guru, blessings, and fruits'
  }
];

const UDGAAN_I18N: Record<string, {
  tag: string;
  title: string;
  desc: string;
  officialPublication: string;
  voiceStyleTitle: string;
  voiceStyleDesc: string;
  mainUdgaansTitle: string;
  allVersesCount: string;
  udgaanPrefix: string;
  rangePrefix: (start: number, end: number) => string;
  groupPlaybackTitle: string;
  groupModes: { id: string; label: string }[];
  activeHeroVerseTitle: (id: number) => string;
  studyBtn: string;
  mangalChanting: string;
  originalMeaningTitle: string;
  translatedMeaningTitle: string;
  audioConnecting: string;
  loading: string;
  continuousPlayback: string;
  continuousPlaybackTitle: (active: boolean) => string;
  loopVerse: string;
  loopVerseTitle: (active: boolean) => string;
  prevVerseTitle: string;
  nextVerseTitle: string;
  playTitle: string;
  pauseTitle: string;
  verseListTitle: (start: number, end: number, count: number) => string;
  verseListSubtitle: string;
  chapterPrefix: string;
}> = {
  gujarati: {
    tag: 'BAPS અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)',
    title: 'સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ',
    desc: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. પુરૂષ સ્વરમાં મધુર બેકગ્રાઉન્ડ સંગીત સાથે અવિરત મંગલ ગાન.',
    officialPublication: 'BAPS સત્તાવાર પ્રકાશન',
    voiceStyleTitle: 'સ્વર અને ગાન શૈલી (Audio Voice & Raag):',
    voiceStyleDesc: 'સંગીત સાથે મૂળ પુરૂષ સ્વર (Male Voice with Background Music)',
    mainUdgaansTitle: '૧ થી ૬ મુખ્ય ઉદ્ગાન વિભાગો (6 Main Udgaans)',
    allVersesCount: '૩૧૫ શ્લોક પૂર્ણ સંગ્રહ',
    udgaanPrefix: 'ઉદ્ગાન',
    rangePrefix: (start, end) => `શ્લોક ${start} થી ${end}`,
    groupPlaybackTitle: 'શ્લોક જૂથ શ્રવણ વિકલ્પ (Group Playback):',
    groupModes: [
      { id: 'udgaan', label: '૬ ઉદ્ગાન' },
      { id: '5', label: '૫ શ્લોક જૂથ' },
      { id: '10', label: '૧૦ શ્લોક જૂથ' },
      { id: '25', label: '૨૫ શ્લોક જૂથ' },
      { id: 'all', label: '૩૧૫ અખંડ પાઠ' }
    ],
    activeHeroVerseTitle: (id) => `સત્સંગ દીક્ષા • શ્લોક ${id}`,
    studyBtn: 'અધ્યયન જુઓ',
    mangalChanting: '॥ શ્રી સ્વામિનારાયણો વિજયતે ॥',
    originalMeaningTitle: 'મૂળ ગુજરાતી ભાવાર્થ:',
    translatedMeaningTitle: 'ભાવાર્થ:',
    audioConnecting: 'ઓડિયો કનેક્ટ થઈ રહ્યું છે, કૃપા કરીને Play બટન ફરી દબાવો.',
    loading: 'લોડ થઈ રહ્યું છે...',
    continuousPlayback: 'અવિરત ગાન',
    continuousPlaybackTitle: (active) => active ? 'અવિરત ક્રમિક ગાન ચાલુ' : 'અવિરત ક્રમિક ગાન બંધ',
    loopVerse: 'આ શ્લોક લૂપ',
    loopVerseTitle: (active) => active ? 'શ્લોક પુનરાવર્તન ચાલુ (Loop)' : 'શ્લોક પુનરાવર્તન બંધ',
    prevVerseTitle: 'પાછલો શ્લોક (Previous Shloka)',
    nextVerseTitle: 'આગલો શ્લોક (Next Shloka)',
    playTitle: 'શ્રવણ શરૂ કરો (Play)',
    pauseTitle: 'વિરામ (Pause)',
    verseListTitle: (start, end, count) => `શ્લોક યાદી (શ્લોક ${start} થી ${end} - કુલ ${count})`,
    verseListSubtitle: 'ક્લિક કરી સીધા ગાન સાંભળો',
    chapterPrefix: 'પ્રકરણ'
  },
  hindi: {
    tag: 'BAPS अधिकृत संस्कृत उद्गान (Authentic Vedic Chanting)',
    title: 'सत्संग दीक्षा उद्गान श्रवण',
    desc: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रबोधित ३१५ संस्कृत श्लोकों का पवित्र कृष्ण यजुर्वेदीय उद्गान श्रवण। पुरुष स्वर में मधुर पृष्ठभूमि संगीत के साथ अविरत मंगल गान।',
    officialPublication: 'BAPS आधिकारिक प्रकाशन',
    voiceStyleTitle: 'स्वर एवं गान शैली (Audio Voice & Raag):',
    voiceStyleDesc: 'संगीत के साथ मूल पुरुष स्वर (Male Voice with Background Music)',
    mainUdgaansTitle: '१ से ६ मुख्य उद्गान विभाग (6 Main Udgaans)',
    allVersesCount: '३१५ श्लोक पूर्ण संग्रह',
    udgaanPrefix: 'उद्गान',
    rangePrefix: (start, end) => `श्लोक ${start} से ${end}`,
    groupPlaybackTitle: 'श्लोक समूह श्रवण विकल्प (Group Playback):',
    groupModes: [
      { id: 'udgaan', label: '६ उद्गान' },
      { id: '5', label: '५ श्लोक समूह' },
      { id: '10', label: '१० श्लोक समूह' },
      { id: '25', label: '२५ श्लोक समूह' },
      { id: 'all', label: '३१५ अखंड पाठ' }
    ],
    activeHeroVerseTitle: (id) => `सत्संग दीक्षा • श्लोक ${id}`,
    studyBtn: 'अध्ययन देखें',
    mangalChanting: '॥ श्री स्वामिनारायणो विजयते ॥',
    originalMeaningTitle: 'मूल गुजराती भावार्थ:',
    translatedMeaningTitle: 'हिंदी भावार्थ:',
    audioConnecting: 'ऑडियो कनेक्ट हो रहा है, कृपया पुनः Play दबाएं।',
    loading: 'लोड हो रहा है...',
    continuousPlayback: 'अविरत गान',
    continuousPlaybackTitle: (active) => active ? 'अविरत क्रमिक गान चालू' : 'अविरत क्रमिक गान बंद',
    loopVerse: 'यह श्लोक लूप',
    loopVerseTitle: (active) => active ? 'श्लोक पुनरावर्तन चालू (Loop)' : 'श्लोक पुनरावर्तन बंद',
    prevVerseTitle: 'पिछला श्लोक (Previous Shloka)',
    nextVerseTitle: 'अगला श्लोक (Next Shloka)',
    playTitle: 'श्रवण शुरू करें (Play)',
    pauseTitle: 'विराम (Pause)',
    verseListTitle: (start, end, count) => `श्लोक सूची (श्लोक ${start} से ${end} - कुल ${count})`,
    verseListSubtitle: 'क्लिक कर सीधे गान सुनें',
    chapterPrefix: 'प्रकरण'
  },
  english: {
    tag: 'BAPS Authentic Sanskrit Udgaan (Authentic Vedic Chanting)',
    title: 'Satsang Diksha Udgaan Audio',
    desc: 'Sacred Krishna Yajurvedic chanting of all 315 Sanskrit verses composed by Pragat Brahmaswarup Mahant Swami Maharaj. Melodious male recital with divine ambient background accompaniment.',
    officialPublication: 'BAPS Official Publication',
    voiceStyleTitle: 'Audio Voice & Chanting Style:',
    voiceStyleDesc: 'Traditional Male Voice with Divine Ambient Music',
    mainUdgaansTitle: '1 to 6 Main Udgaan Sections',
    allVersesCount: 'Complete Collection of 315 Verses',
    udgaanPrefix: 'Udgaan',
    rangePrefix: (start, end) => `Verses ${start}–${end}`,
    groupPlaybackTitle: 'Group Playback Options:',
    groupModes: [
      { id: 'udgaan', label: '6 Udgaans' },
      { id: '5', label: '5 Verses' },
      { id: '10', label: '10 Verses' },
      { id: '25', label: '25 Verses' },
      { id: 'all', label: 'Full 315 Chanting' }
    ],
    activeHeroVerseTitle: (id) => `Satsang Diksha • Verse ${id}`,
    studyBtn: 'Study Verse',
    mangalChanting: '॥ Shree Swaminarayanō Vijayate ॥',
    originalMeaningTitle: 'Original Gujarati Meaning:',
    translatedMeaningTitle: 'Meaning:',
    audioConnecting: 'Connecting audio stream, please tap Play again.',
    loading: 'Loading audio...',
    continuousPlayback: 'Auto Advance',
    continuousPlaybackTitle: (active) => active ? 'Continuous playback enabled' : 'Continuous playback disabled',
    loopVerse: 'Loop Verse',
    loopVerseTitle: (active) => active ? 'Verse repeat enabled' : 'Verse repeat disabled',
    prevVerseTitle: 'Previous Verse',
    nextVerseTitle: 'Next Verse',
    playTitle: 'Play Audio',
    pauseTitle: 'Pause Audio',
    verseListTitle: (start, end, count) => `Verses List (${start}–${end} • Total ${count})`,
    verseListSubtitle: 'Tap any verse to chant',
    chapterPrefix: 'Chapter'
  }
};

const getUdgaanStrings = (lang: string) => {
  if (lang === 'gujarati') return UDGAAN_I18N.gujarati;
  if (lang === 'hindi') return UDGAAN_I18N.hindi;
  return UDGAAN_I18N.english;
};

const getUdgaanSectionTitle = (section: UdgaanSection, lang: string) => {
  if (lang === 'gujarati') return `ઉદ્ગાન ${section.id}`;
  if (lang === 'hindi') return `उद्गान ${section.id}`;
  return `Udgaan ${section.id}`;
};

const getUdgaanSectionRange = (range: [number, number], lang: string) => {
  if (lang === 'gujarati') return `શ્લોક ${range[0]} થી ${range[1]}`;
  if (lang === 'hindi') return `श्लोक ${range[0]} से ${range[1]}`;
  return `Verses ${range[0]}–${range[1]}`;
};

const getUdgaanSectionDesc = (section: UdgaanSection, lang: string) => {
  if (lang === 'gujarati') return section.descriptionGu;
  if (lang === 'hindi') return section.descriptionHi || section.descriptionEn;
  return section.descriptionEn || section.descriptionGu;
};

export const UdgaanView: React.FC<UdgaanViewProps> = ({ shlokas, preferences, onSelectShloka }) => {
  const [selectedUdgaanId, setSelectedUdgaanId] = useState<number>(1);
  const [groupingMode, setGroupingMode] = useState<'udgaan' | '5' | '10' | '25' | 'all'>('udgaan');
  const [audioFormat, setAudioFormat] = useState<AudioFormat>('sanskrit');
  
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

  const lang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const t = getUdgaanStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

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
    return [1, 315];
  }, [groupingMode, selectedUdgaanId, currentShlokaId]);

  // List of shlokas in active range
  const activeShlokas = useMemo(() => {
    const [start, end] = activeRange;
    return shlokas.filter(s => s.id >= start && s.id <= end);
  }, [shlokas, activeRange]);

  // Get current shloka object
  const currentShloka = useMemo(() => {
    return shlokas.find(s => s.id === currentShlokaId) || shlokas[0];
  }, [shlokas, currentShlokaId]);

  // Get current udgaan section
  const currentUdgaan = useMemo(() => {
    return UDGAAN_SECTIONS.find(u => currentShloka.id >= u.range[0] && currentShloka.id <= u.range[1]);
  }, [currentShloka.id]);

  // Switch to a specific shloka with automatic mirror fallback
  const playShloka = (shlokaId: number, autoPlay: boolean = true, formatToUse: AudioFormat = audioFormat) => {
    setCurrentShlokaId(shlokaId);
    setHasError(false);
    
    if (!audioRef.current) return;

    const urls = getAudioUrls(shlokaId, formatToUse);
    let mirrorIndex = 0;

    const loadAndPlayMirror = (idx: number) => {
      if (idx >= urls.length) {
        setIsLoadingAudio(false);
        setIsPlaying(false);
        setHasError(true);
        return;
      }

      if (!audioRef.current) return;
      audioRef.current.src = urls[idx];
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.muted = isMuted;

      if (autoPlay) {
        setIsLoadingAudio(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
          setHasError(false);
        }).catch(() => {
          // If first mirror failed, try next mirror
          if (idx + 1 < urls.length) {
            loadAndPlayMirror(idx + 1);
          } else {
            setIsLoadingAudio(false);
            setIsPlaying(false);
            setHasError(true);
          }
        });
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
    } else {
      if (!audioRef.current.src || audioRef.current.src === '' || hasError) {
        playShloka(currentShlokaId, true, audioFormat);
      } else {
        setIsLoadingAudio(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        }).catch(() => {
          // Retry loading from fresh URL
          playShloka(currentShlokaId, true, audioFormat);
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
    playShloka(nextId, isPlaying, audioFormat);
  };

  // Next Shloka
  const handleNext = () => {
    const [start, end] = activeRange;
    let nextId = currentShlokaId + 1;
    if (nextId > end) {
      nextId = start;
    }
    playShloka(nextId, isPlaying, audioFormat);
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
        playShloka(currentShlokaId + 1, true, audioFormat);
      } else {
        // At the end of range, loop back to start
        playShloka(start, true, audioFormat);
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
    playShloka(section.range[0], isPlaying, audioFormat);
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
    audio.src = getAudioUrls(currentShlokaId, audioFormat)[0];
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
      {/* Header Banner - Fully localized */}
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

          <a 
            href="https://www.baps.org/Publications/Books/Satsang-Diksha-1402.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-100 text-xs font-semibold border border-amber-300/40 transition whitespace-nowrap shadow-sm"
          >
            <span>{t.officialPublication}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* AUDIO FORMAT SELECTOR */}
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
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
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

      {/* 6 MAIN UDGAANS SELECTION TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>{t.mainUdgaansTitle}</span>
          </h3>
          <span className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
            {t.allVersesCount}
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
                      {getUdgaanSectionTitle(section, lang)}
                    </span>
                    {isSelected && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm mt-1.5">
                    {getUdgaanSectionRange(section.range, lang)}
                  </h4>
                </div>
                <p className={`text-[10px] mt-1 line-clamp-2 ${
                  isSelected ? 'text-amber-200/90' : 'text-[#7A6B5C] dark:text-[#A89886]'
                }`}>
                  {getUdgaanSectionDesc(section, lang)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* GROUPING CONTROLS */}
      <div className="p-4 bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B2500] dark:text-amber-300">
          <Sliders className="w-4 h-4" />
          <span>{t.groupPlaybackTitle}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {t.groupModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setGroupingMode(mode.id as any);
                if (mode.id === 'all') {
                  playShloka(1, isPlaying, audioFormat);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
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
                  {t.activeHeroVerseTitle(currentShloka.id)}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  {currentUdgaan ? getUdgaanSectionTitle(currentUdgaan, lang) : t.udgaanPrefix}
                </span>
              </div>
              <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
                {t.chapterPrefix} {currentShloka.chapterId}: {getShlokaChapterName(currentShloka, lang)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Sanskrit Verse Chanting Display */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FCFAF6] dark:bg-[#1A1512] border-2 border-amber-500/30 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-serif text-amber-600 dark:text-amber-400 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.mangalChanting}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Primary Script */}
          <p className="font-sanskrit font-bold text-xl sm:text-2xl text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide">
            {preferences?.sanskritScript === 'gujarati' ? currentShloka.sanskritGujarati : currentShloka.sanskritDevanagari}
          </p>

          {/* Alternate Script */}
          {preferences?.sanskritScript === 'gujarati' ? (
            <p className="font-sanskrit text-sm sm:text-base text-[#8B2500]/80 dark:text-amber-300/80 leading-relaxed whitespace-pre-line">
              {currentShloka.sanskritDevanagari}
            </p>
          ) : (
            <p className="font-gujarati font-semibold text-base sm:text-lg text-[#8B2500] dark:text-amber-300 leading-relaxed">
              {currentShloka.sanskritGujarati}
            </p>
          )}

          {currentShloka.sanskritIast && (
            <p className="text-xs text-[#8A7A68] dark:text-[#A89886] font-mono italic">
              {currentShloka.sanskritIast}
            </p>
          )}
        </div>

        {/* Meaning in Selected Language */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-[#251D17] border-l-4 border-[#8B2500] text-xs space-y-1">
          <div className="font-bold text-[#8B2500] dark:text-amber-300">
            {lang === 'gujarati' ? t.originalMeaningTitle : `${langMeta.nativeName} ${t.translatedMeaningTitle}:`}
          </div>
          <p className="text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed text-sm">
            {getShlokaMeaning(currentShloka, lang)}
          </p>
          {lang !== 'gujarati' && (
            <div className="pt-2 mt-1 border-t border-amber-200/50 dark:border-stone-800">
              <span className="font-bold text-[#8B2500] dark:text-amber-400">મૂળ ગુજરાતી: </span>
              <span className="font-gujarati text-[#4A3E34] dark:text-[#D5C7B7]">{currentShloka.meaningGu}</span>
            </div>
          )}
        </div>

        {/* Audio Scrubber & Controls */}
        <div className="space-y-4 pt-2 border-t border-[#F0E8DC] dark:border-[#352C24]">
          {hasError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t.audioConnecting}</span>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#7A6B5C] dark:text-[#A89886] font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{isLoadingAudio ? t.loading : formatTime(duration)}</span>
            </div>
            <div 
              className="w-full bg-[#E8DFD1] dark:bg-[#3D342C] h-2 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                if (audioRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = pos * duration;
                }
              }}
            >
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
                title={t.continuousPlaybackTitle(isAutoAdvance)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isAutoAdvance 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 border-amber-300' 
                    : 'bg-[#FAF6F0] dark:bg-[#221D1A] text-stone-400 border-stone-300'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span className="hidden sm:inline">{t.continuousPlayback}</span>
              </button>

              <button
                onClick={() => setIsLoopCurrent(!isLoopCurrent)}
                title={t.loopVerseTitle(isLoopCurrent)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isLoopCurrent 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 border-amber-300' 
                    : 'bg-[#FAF6F0] dark:bg-[#221D1A] text-stone-400 border-stone-300'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">{t.loopVerse}</span>
              </button>
            </div>

            {/* Core Play / Skip Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                title={t.prevVerseTitle}
                className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2E241E] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 transition shadow-xs cursor-pointer"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                id="udgaan-play-btn"
                title={isPlaying ? t.pauseTitle : t.playTitle}
                className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-[#8B2500] text-amber-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-amber-950" />
                ) : (
                  <Play className="w-7 h-7 fill-amber-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                title={t.nextVerseTitle}
                className="p-3 rounded-2xl bg-[#FAF6F0] dark:bg-[#2E241E] text-[#8B2500] dark:text-amber-300 hover:bg-amber-100 transition shadow-xs cursor-pointer"
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
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
            <span>{t.verseListTitle(activeRange[0], activeRange[1], activeShlokas.length)}</span>
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
