import re

file_path = 'src/components/UdgaanView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports - remove ExternalLink
content = re.sub(r'  ExternalLink,\n', '', content)

# 2. Replace interface UdgaanSection and const UDGAAN_SECTIONS up to const UDGAAN_I18N
old_sections_pattern = re.compile(r'interface UdgaanSection\s*\{.*?const UDGAAN_SECTIONS:\s*UdgaanSection\[\]\s*=\s*\[.*?\n\];', re.DOTALL)

new_presets = """export interface PresetRange {
  id: number;
  labelGu: string;
  labelHi: string;
  labelEn: string;
  range: [number, number];
}

export const PRESET_RANGES: PresetRange[] = [
  { id: 1, range: [1, 50], labelGu: '૧–૫૦', labelHi: '१–५०', labelEn: '1–50' },
  { id: 2, range: [51, 115], labelGu: '૫૧–૧૧૫', labelHi: '५૧–१૧૫', labelEn: '51–115' },
  { id: 3, range: [116, 158], labelGu: '૧૧૬–૧૫૮', labelHi: '११६–१५૮', labelEn: '116–158' },
  { id: 4, range: [159, 208], labelGu: '૧૫૯–૨૦૮', labelHi: '१५૯–२०૮', labelEn: '159–208' },
  { id: 5, range: [209, 257], labelGu: '૨૦૯–૨૫૭', labelHi: '२०९–२૫૭', labelEn: '209–257' },
  { id: 6, range: [258, 315], labelGu: '૨૫૮–૩૧૫', labelHi: '२५૮–३૧૫', labelEn: '258–315' },
];"""

assert old_sections_pattern.search(content) is not None, "old_sections_pattern not found"
content = old_sections_pattern.sub(new_presets, content)

# 3. Replace UDGAAN_I18N and helper functions
old_i18n_pattern = re.compile(r'const UDGAAN_I18N:\s*Record<string,.*?\n\};\n\nconst getUdgaanStrings.*?const getUdgaanSectionDesc.*?;\n\};', re.DOTALL)

new_i18n = """const UDGAAN_I18N = {
  gujarati: {
    tag: 'અધિકૃત સંસ્કૃત ઉદ્ગાન (Authentic Vedic Chanting)',
    title: 'સત્સંગ દીક્ષા ઉદ્ગાન શ્રવણ',
    desc: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રબોધિત ૩૧૫ સંસ્કૃત શ્લોકોનું પવિત્ર કૃષ્ણ યજુર્વેદીય ઉદ્ગાન શ્રવણ. પુરૂષ સ્વરમાં મધુર બેકગ્રાઉન્ડ સંગીત સાથે અવિરત મંગલ ગાન.',
    badge: '૩૧૫ શ્લોક • અવિરત વૈદિક ગાન',
    voiceStyleTitle: 'સ્વર અને ગાન શૈલી (Audio Voice & Raag):',
    voiceStyleDesc: 'સંગીત સાથે મૂળ પુરૂષ સ્વર (Male Voice with Background Music)',
    rangePlaybackTitle: 'શ્લોક શ્રેણી જૂથ શ્રવણ (Shloka Range Group Playback)',
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
    continuousPlaybackTitle: (active: boolean) => active ? 'અવિરત ક્રમિક ગાન ચાલુ' : 'અવિરત ક્રમિક ગાન બંધ',
    loopVerse: 'આ શ્લોક લૂપ',
    loopVerseTitle: (active: boolean) => active ? 'શ્લોક પુનરાવર્તન ચાલુ (Loop)' : 'શ્લોક પુનરાવર્તન બંધ',
    prevVerseTitle: 'પાછલો શ્લોક (Previous Shloka)',
    nextVerseTitle: 'આગલો શ્લોક (Next Shloka)',
    playTitle: 'શ્રવણ શરૂ કરો (Play)',
    pauseTitle: 'વિરામ (Pause)',
    verseListTitle: (start: number, end: number, count: number) => `શ્લોક યાદી (શ્લોક ${start} થી ${end} - કુલ ${count})`,
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
    rangePlaybackTitle: 'श्लोक श्रेणी समूह श्रवण (Shloka Range Group Playback)',
    rangePlaybackDesc: 'श्लोक १ से ३१५ के मध्य कोई भी प्रारंभिक एवं अंतिम श्लोक चुनकर अविरत समूह श्रवण करें',
    startVerseLabel: 'प्रारंभिक श्लोक',
    endVerseLabel: 'अंतिम श्लोक',
    totalVersesBadge: (count: number) => `कुल ${count} श्लोक श्रेणी`,
    playRangeBtn: (start: number, end: number) => `श्लोक ${start} से ${end} श्रवण शुरू करें`,
    quickPresetsLabel: 'त्वरित श्लोक श्रेणी विकल्प:',
    fullScriptureChanting: 'सर्व १ से ३१५ अखंड पाठ',
    rangePrefix: (start: number, end: number) => `श्लोक ${start} से ${end}`,
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
    tag: 'Authentic Sanskrit Udgaan (Authentic Vedic Chanting)',
    title: 'Satsang Diksha Udgaan Audio',
    desc: 'Sacred Krishna Yajurvedic chanting of all 315 Sanskrit verses composed by Pragat Brahmaswarup Mahant Swami Maharaj. Melodious male recital with divine ambient background accompaniment.',
    badge: '315 Verses • Vedic Chanting',
    voiceStyleTitle: 'Audio Voice & Chanting Style:',
    voiceStyleDesc: 'Traditional Male Voice with Divine Ambient Music',
    rangePlaybackTitle: 'Shloka Range Group Playback',
    rangePlaybackDesc: 'Select any start and end verse from 1 to 315 for continuous group playback',
    startVerseLabel: 'Start Verse',
    endVerseLabel: 'End Verse',
    totalVersesBadge: (count: number) => `Total ${count} Verses Range`,
    playRangeBtn: (start: number, end: number) => `Start Playback (${start}–${end})`,
    quickPresetsLabel: 'Quick Range Presets:',
    fullScriptureChanting: 'Full 1–315 Scripture Recitation',
    rangePrefix: (start: number, end: number) => `Verses ${start}–${end}`,
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
};"""

assert old_i18n_pattern.search(content) is not None, "old_i18n_pattern not found"
content = old_i18n_pattern.sub(new_i18n, content)

# 4. Update UdgaanView component state
old_state_pattern = re.compile(
    r"const \[selectedUdgaanId, setSelectedUdgaanId\] = useState<number>\(1\);\s*"
    r"const \[groupingMode, setGroupingMode\] = useState<'udgaan' \| '5' \| '10' \| '25' \| 'all'>\('udgaan'\);",
    re.DOTALL
)

new_state = """const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(50);
  const rangeStartRef = useRef<number>(1);
  const rangeEndRef = useRef<number>(50);"""

assert old_state_pattern.search(content) is not None, "old_state_pattern not found"
content = old_state_pattern.sub(new_state, content)

# 5. Remove groupingModeRef and selectedUdgaanIdRef
content = re.sub(r"  const groupingModeRef = useRef<.*?>\(groupingMode\);\n  const selectedUdgaanIdRef = useRef<number>\(selectedUdgaanId\);\n", "", content)

# 6. Replace activeRange computation and refs synchronization
old_active_range = re.compile(
    r"// Determine current active verse range based on groupingMode\s*"
    r"const activeRange = useMemo<\[number, number\]>\(\(\) => \{.*?\n  \}, \[groupingMode, selectedUdgaanId, currentShlokaId\]\);",
    re.DOTALL
)

new_active_range = """// Active verse range for group playback (any start and end from 1 to 315)
  const activeRange = useMemo<[number, number]>(() => {
    return [rangeStart, rangeEnd];
  }, [rangeStart, rangeEnd]);"""

assert old_active_range.search(content) is not None, "old_active_range not found"
content = old_active_range.sub(new_active_range, content)

# 7. Update refs assignments
old_refs_sync = """  isPlayingRef.current = isPlaying;
  isAutoAdvanceRef.current = isAutoAdvance;
  isLoopCurrentRef.current = isLoopCurrent;
  activeRangeRef.current = activeRange;
  audioFormatRef.current = audioFormat;
  playbackSpeedRef.current = playbackSpeed;
  isMutedRef.current = isMuted;
  groupingModeRef.current = groupingMode;
  selectedUdgaanIdRef.current = selectedUdgaanId;"""

new_refs_sync = """  isPlayingRef.current = isPlaying;
  isAutoAdvanceRef.current = isAutoAdvance;
  isLoopCurrentRef.current = isLoopCurrent;
  rangeStartRef.current = rangeStart;
  rangeEndRef.current = rangeEnd;
  activeRangeRef.current = activeRange;
  audioFormatRef.current = audioFormat;
  playbackSpeedRef.current = playbackSpeed;
  isMutedRef.current = isMuted;"""

content = content.replace(old_refs_sync, new_refs_sync)

# 8. Remove currentUdgaan and replace getBoundsForShloka
old_bounds = re.compile(r"// Get current udgaan section\s*const currentUdgaan = useMemo\(.*?return \[1, 315\];\s*\};", re.DOTALL)

new_bounds = """// Helper to get active range bounds for playback
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
  };"""

assert old_bounds.search(content) is not None, "old_bounds not found"
content = old_bounds.sub(new_bounds, content)

# 9. In playShloka, adjust range if clicked shloka is outside
old_play_range_sync = """    // Automatically synchronize Udgaan section tab if in 'udgaan' grouping mode
    if (groupingModeRef.current === 'udgaan') {
      const section = UDGAAN_SECTIONS.find(u => shlokaId >= u.range[0] && shlokaId <= u.range[1]);
      if (section) {
        setSelectedUdgaanId(section.id);
        selectedUdgaanIdRef.current = section.id;
        activeRangeRef.current = section.range;
      }
    } else {
      activeRangeRef.current = getBoundsForShloka(shlokaId);
    }"""

new_play_range_sync = """    // Ensure range covers this shloka if user clicked a shloka outside current range
    if (shlokaId < rangeStartRef.current) {
      setRangeStart(shlokaId);
      rangeStartRef.current = shlokaId;
    } else if (shlokaId > rangeEndRef.current) {
      setRangeEnd(shlokaId);
      rangeEndRef.current = shlokaId;
    }
    activeRangeRef.current = [rangeStartRef.current, rangeEndRef.current];"""

content = content.replace(old_play_range_sync, new_play_range_sync)

# 10. Remove handleSelectUdgaan
content = re.sub(
    r"  // Select an Udgaan section\s*const handleSelectUdgaan = \(section: UdgaanSection\) => \{.*?\n  \};\n\n",
    "",
    content,
    flags=re.DOTALL
)

# 11. Remove BAPS external publication link in header banner
old_header_link = re.compile(
    r'<a \s*href="https://www\.baps\.org/Publications/Books/Satsang-Diksha-1402\.aspx".*?</a>',
    re.DOTALL
)

new_header_badge = """<div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-amber-100 text-xs font-semibold border border-amber-300/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.badge}</span>
          </div>"""

assert old_header_link.search(content) is not None, "old_header_link not found"
content = old_header_link.sub(new_header_badge, content)

# 12. Replace the 6 main udgaan cards AND the old grouping controls with the Shloka Range Group Playback component
old_cards_and_grouping = re.compile(
    r'\{\/\* 6 MAIN UDGAANS SELECTION TABS \*\/.*?'
    r'\{\/\* GROUPING CONTROLS \*\/.*?<\/div>\s*<\/div>\s*<\/div>',
    re.DOTALL
)

new_range_component = """{/* SHLOKA RANGE GROUP PLAYBACK SELECTOR */}
      <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-5 sm:p-6 border border-[#E8DFD1] dark:border-[#3D342C] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E8DC] dark:border-[#352C24] pb-3">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#8B2500] dark:text-amber-300 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>{t.rangePlaybackTitle}</span>
            </h3>
            <p className="text-xs text-[#7A6B5C] dark:text-[#A89886]">
              {t.rangePlaybackDesc}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300/50 text-[#8B2500] dark:text-amber-300 text-xs font-bold self-start sm:self-auto shadow-2xs">
            <span>{t.totalVersesBadge(rangeEnd - rangeStart + 1)}</span>
            <span className="text-stone-400">•</span>
            <span>{t.rangePrefix(rangeStart, rangeEnd)}</span>
          </div>
        </div>

        {/* Range Inputs & Action Controls */}
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

          {/* Action Button: Play This Range */}
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

        {/* Quick Range Presets */}
        <div className="pt-2 space-y-2">
          <div className="text-[11px] font-semibold text-[#7A6B5C] dark:text-[#A89886] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.quickPresetsLabel}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {/* Traditional section presets */}
            {PRESET_RANGES.map((preset) => {
              const isMatch = rangeStart === preset.range[0] && rangeEnd === preset.range[1];
              const pLabel = lang === 'hindi' ? preset.labelHi : lang === 'english' ? preset.labelEn : preset.labelGu;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSetRange(preset.range[0], preset.range[1])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isMatch
                      ? 'bg-[#8B2500] text-amber-50 shadow-xs ring-1 ring-amber-400'
                      : 'bg-[#FAF6F0] dark:bg-[#2A221C] text-[#5C4F42] dark:text-[#C5B7A8] hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200/50 dark:border-stone-800'
                  }`}
                >
                  <span>{pLabel}</span>
                  <span className="opacity-70 text-[10px]">({preset.range[0]}–{preset.range[1]})</span>
                </button>
              );
            })}

            {/* Full 315 Shlokas */}
            <button
              type="button"
              onClick={() => handleSetRange(1, 315)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                rangeStart === 1 && rangeEnd === 315
                  ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400'
                  : 'bg-amber-100/70 dark:bg-[#32251D] text-amber-900 dark:text-amber-200 hover:bg-amber-200 border border-amber-300/60'
              }`}
            >
              {t.fullScriptureChanting}
            </button>

            {/* Relative offset spans */}
            <button
              type="button"
              onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 4))}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              +5 {lang === 'hindi' ? 'श्लोक' : lang === 'english' ? 'Verses' : 'શ્લોક'}
            </button>
            <button
              type="button"
              onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 9))}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              +10 {lang === 'hindi' ? 'श्लोक' : lang === 'english' ? 'Verses' : 'શ્લોક'}
            </button>
            <button
              type="button"
              onClick={() => handleSetRange(currentShlokaId, Math.min(315, currentShlokaId + 24))}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF6F0] dark:bg-[#2A221C] text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              +25 {lang === 'hindi' ? 'श्लोक' : lang === 'english' ? 'Verses' : 'શ્લોક'}
            </button>
          </div>
        </div>
      </div>"""

assert old_cards_and_grouping.search(content) is not None, "old_cards_and_grouping not found"
content = old_cards_and_grouping.sub(new_range_component, content)

# 13. Replace currentUdgaan ribbon badge
old_ribbon_badge = """<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  {currentUdgaan ? getUdgaanSectionTitle(currentUdgaan, lang) : t.udgaanPrefix}
                </span>"""

new_ribbon_badge = """<span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  {t.rangePrefix(rangeStart, rangeEnd)}
                </span>"""

content = content.replace(old_ribbon_badge, new_ribbon_badge)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("UdgaanView.tsx updated successfully!")
