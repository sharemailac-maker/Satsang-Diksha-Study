import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Link2, 
  ChevronRight, 
  Sparkles, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  CheckCircle2, 
  Quote,
  Languages
} from 'lucide-react';
import { Shloka, ScriptureReference, WordMeaning, UserPreferences } from '../types';
import { 
  getShlokaMeaning, 
  getWordMeaningInLang, 
  getShlokaTitle, 
  getShlokaChapterName,
  getReferenceTitle, 
  getReferenceSection,
  LANGUAGE_METADATA 
} from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';
import { PADACHHEDA_DATA } from '../data/padachhedaData';
import { ANVAYA_DATA } from '../data/anvayaData';

const CROSS_REF_I18N: Record<string, {
  tag: string;
  title: string;
  desc: string;
  searchPlaceholder: string;
  allVerses: string;
  vachnamrut: string;
  swaminiVato: string;
  allChapters: string;
  availableCount: (c: number) => string;
  searchQueryLabel: string;
  sutraVani: string;
  fullVerseLabel: string;
  anvayaTitle: string;
  wordBreakdownTitle: string;
  wordBreakdownDesc: string;
  selectWordLabel: string;
  wordPrefix: string;
  scriptureProofPrefix: string;
  correlationPrefix: string;
  scriptureCrossRefTitle: string;
  referencesLabel: string;
  readerBtn: string;
}> = {
  gujarati: {
    tag: 'ત્રિવેણી સંગમ પ્રમાણ અધ્યયન (Cross-Reference Concordance)',
    title: 'સત્સંગ દીક્ષા • વચનામૃત • સ્વામીની વાતો શબ્દશઃ સંબંધ',
    desc: "પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજે રચેલ 'સત્સંગ દીક્ષા'ના તમામ ૩૧૫ શ્લોકો સર્વોપરી ભગવાન શ્રી સ્વામિનારાયણ ઉદબોધિત વચનામૃત અને અક્ષરબ્રહ્મ ગુણાતીતાનંદ સ્વામીની વાતોના રહસ્યમય સિદ્ધાંતોનું જ પદચ્છેદ અને શબ્દશઃ સૂત્રાત્મક નિરૂપણ છે. નીચે દરેક શ્લોકનું વચનામૃત-વાતો પ્રમાણ અને પદ-સંબંધ દર્શાવેલ છે.",
    searchPlaceholder: 'શ્લોક નં., વચનામૃત (દા.ત. ગઢડા ૧-૧), શબ્દ કે વિષય શોધો...',
    allVerses: 'તમામ ૩૧૫ શ્લોક',
    vachnamrut: '📖 વચનામૃત',
    swaminiVato: '📿 સ્વામીની વાતો',
    allChapters: 'બધાં પ્રકરણો',
    availableCount: (c) => `કુલ ${c} શ્લોકના શાસ્ત્રીય સંબંધો ઉપલબ્ધ`,
    searchQueryLabel: 'શોધ',
    sutraVani: 'સત્સંગ દીક્ષા સૂત્ર વાણી',
    fullVerseLabel: 'સંપૂર્ણ સંસ્કૃત શ્લોક (Full Sanskrit Verse)',
    anvayaTitle: 'અન્વય (સંસ્કૃત ગદ્ય-ક્રમ - Prose Order)',
    wordBreakdownTitle: 'શબ્દશઃ પદચ્છેદ અને શાસ્ત્રીય સંબંધ',
    wordBreakdownDesc: 'શ્લોકના પ્રત્યેક પદનો અન્વય-અર્થ અને વચનામૃત/વાતો સાથે સંબંધ',
    selectWordLabel: 'પદ પસંદ કરો:',
    wordPrefix: 'પદ:',
    scriptureProofPrefix: 'મૂળ શાસ્ત્ર પ્રમાણ:',
    correlationPrefix: 'શાસ્ત્રીય સમન્વય:',
    scriptureCrossRefTitle: 'શાસ્ત્રીય સંદર્ભ (વચનામૃત અને સ્વામીની વાતો)',
    referencesLabel: 'સંદર્ભો',
    readerBtn: 'અધ્યયન'
  },
  hindi: {
    tag: 'त्रिवेणी संगम प्रमाण अध्ययन (Cross-Reference Concordance)',
    title: 'सत्संग दीक्षा • वचनामृत • स्वामीनी बातें शब्दशः संबंध',
    desc: "प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज द्वारा रचित 'सत्संग दीक्षा' के समस्त ३१५ श्लोक सर्वोपरी भगवान श्री स्वामिनारायण उद्बोधित वचनामृत एवं अक्षरब्रह्म गुणातीतानंद स्वामी की बातों के रहस्यमय सिद्धांतों का ही पदच्छेद व शब्दशः सूत्रात्मक निरूपण हैं। नीचे प्रत्येक श्लोक का वचनामृत-वार्ता प्रमाण एवं पद-संबंध दर्शाया गया है।",
    searchPlaceholder: 'श्लोक सं., वचनामृत (उदा. गढडा १-१), शब्द या विषय खोजें...',
    allVerses: 'समस्त ३१५ श्लोक',
    vachnamrut: '📖 वचनामृत',
    swaminiVato: '📿 स्वामीनी बातें',
    allChapters: 'सभी प्रकरण',
    availableCount: (c) => `कुल ${c} श्लोकों के शास्त्रीय संदर्भ उपलब्ध`,
    searchQueryLabel: 'खोज',
    sutraVani: 'सत्संग दीक्षा सूत्र वाणी',
    fullVerseLabel: 'सम्पूर्ण संस्कृत श्लोक (Full Sanskrit Verse)',
    anvayaTitle: 'अन्वय (संस्कृत गद्य-क्रम - Prose Order)',
    wordBreakdownTitle: 'शब्दशः पदच्छेद एवं शास्त्रीय संबंध',
    wordBreakdownDesc: 'श्लोक के प्रत्येक पद का अन्वय-अर्थ और वचनामृत/बातों से संबंध',
    selectWordLabel: 'पद चुनें:',
    wordPrefix: 'पद:',
    scriptureProofPrefix: 'मूल शास्त्र प्रमाण:',
    correlationPrefix: 'शास्त्रीय समन्वय:',
    scriptureCrossRefTitle: 'शास्त्रीय संदर्भ (वचनामृत एवं स्वामीनी बातें)',
    referencesLabel: 'संदर्भ',
    readerBtn: 'अध्ययन'
  },
  english: {
    tag: 'Scriptural Concordance Study (Cross-Reference Concordance)',
    title: 'Satsang Diksha • Vachnamrut • Swamini Vato Concordance',
    desc: "All 315 verses of 'Satsang Diksha' composed by Pragat Brahmaswarup Mahant Swami Maharaj are a word-by-word padachheda and aphoristic exposition of the profound principles of the Vachnamrut expounded by supreme Bhagwan Shri Swaminarayan and the Swamini Vato of Aksharbrahma Gunatitanand Swami. Below is the Vachnamrut-Vato scriptural authority and word correlation for each verse.",
    searchPlaceholder: 'Search verse no., Vachnamrut (e.g. Gadhada I-1), word or topic...',
    allVerses: 'All 315 Verses',
    vachnamrut: '📖 Vachnamrut',
    swaminiVato: '📿 Swamini Vato',
    allChapters: 'All Chapters',
    availableCount: (c) => `Total ${c} verses with scriptural references available`,
    searchQueryLabel: 'Search',
    sutraVani: 'Satsang Diksha Sacred Verse',
    fullVerseLabel: 'Complete Sanskrit Verse',
    anvayaTitle: 'Anvaya (Sanskrit Prose Order)',
    wordBreakdownTitle: 'Word-by-Word Breakdown & Concordance',
    wordBreakdownDesc: 'Word meaning and correlation with Vachnamrut / Swamini Vato',
    selectWordLabel: 'Select word to view details:',
    wordPrefix: 'Word:',
    scriptureProofPrefix: 'Original Scripture Reference:',
    correlationPrefix: 'Scriptural Correlation:',
    scriptureCrossRefTitle: 'Scriptural References (Vachnamrut & Swamini Vato)',
    referencesLabel: 'references',
    readerBtn: 'Study'
  },
  marathi: {
    tag: 'त्रिवेणी संगम प्रमाण अध्ययन (Cross-Reference Concordance)',
    title: 'सत्संग दीक्षा • वचनामृत • स्वामींची वातो शब्दशः संबंध',
    desc: "प्रगट ब्रह्मस्वरूप महंत स्वामी महाराजांनी रचलेले 'सत्संग दीक्षा'चे सर्व ३१५ श्लोक सर्वोपरी भगवान श्री स्वामिनारायण उद्बोधित वचनामृत आणि अक्षरब्रह्म गुणातीतानंद स्वामींच्या वातोच्या रहस्यमय सिद्धांतांचेच पदच्छेद व शब्दशः सूत्रात्मक निरूपण आहेत. खाली प्रत्येक श्लोकाचे वचनामृत-वातो प्रमाण आणि पद-संबंध दर्शविले आहेत.",
    searchPlaceholder: 'श्लोक क्र., वचनामृत (उदा. गढडा १-१), शब्द किंवा विषय शोधा...',
    allVerses: 'सर्व ३१५ श्लोक',
    vachnamrut: '📖 वचनामृत',
    swaminiVato: '📿 स्वामींची वातो',
    allChapters: 'सर्व प्रकरणे',
    availableCount: (c) => `एकूण ${c} श्लोकांचे शास्त्रीय संदर्भ उपलब्ध`,
    searchQueryLabel: 'शोध',
    sutraVani: 'सत्संग दीक्षा सूत्र वाणी',
    fullVerseLabel: 'संपूर्ण संस्कृत श्लोक (Full Sanskrit Verse)',
    anvayaTitle: 'अन्वय (संस्कृत गद्य-क्रम - Prose Order)',
    wordBreakdownTitle: 'शब्दशः पदच्छेद आणि शास्त्रीय संबंध',
    wordBreakdownDesc: 'श्लोकातील प्रत्येक पदाचा अन्वय-अर्थ आणि वचनामृत/वातोशी संबंध',
    selectWordLabel: 'पद निवडा:',
    wordPrefix: 'पद:',
    scriptureProofPrefix: 'मूळ शास्त्र प्रमाण:',
    correlationPrefix: 'शास्त्रीय समन्वय:',
    scriptureCrossRefTitle: 'शास्त्रीय संदर्भ (वचनामृत आणि स्वामींची वातो)',
    referencesLabel: 'संदर्भ',
    readerBtn: 'अध्ययन'
  },
  punjabi: {
    tag: 'ਤ੍ਰਿਵੇਣੀ ਸੰਗਮ ਪ੍ਰਮਾਣ ਅਧਿਐਨ (Cross-Reference Concordance)',
    title: 'ਸਤਿਸੰਗ ਦੀਕਸ਼ਾ • ਵਚਨਾਮ੍ਰਿਤ • ਸਵਾਮੀਨੀ ਵਾਤੋ ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਸੰਬੰਧ',
    desc: "ਪ੍ਰਗਟ ਬ੍ਰਹਮਸਵਰੂਪ ਮਹੰਤ ਸਵਾਮੀ ਮਹਾਰਾਜ ਦੁਆਰਾ ਰਚਿਤ 'ਸਤਿਸੰਗ ਦੀਕਸ਼ਾ' ਦੇ ਸਾਰੇ ੩੧੫ ਸ਼ਲੋਕ ਸਰਵੋਪਰੀ ਭਗਵਾਨ ਸ਼੍ਰੀ ਸਵਾਮੀਨਾਰਾਇਣ ਉਦਬੋਧਿਤ ਵਚਨਾਮ੍ਰਿਤ ਅਤੇ ਅਕਸ਼ਰਬ੍ਰਹਮ ਗੁਣਾਤੀਤਾਨੰਦ ਸਵਾਮੀ ਜੀ ਦੀਆਂ ਵਾਤਾਂ ਦੇ ਰਹੱਸਮਈ ਸਿਧਾਂਤਾਂ ਦਾ ਹੀ ਪਦ-ਛੇਦ ਅਤੇ ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਸੂਤਰ-ਰੂਪ ਨਿਰੂਪਣ ਹਨ। ਹੇਠਾਂ ਹਰੇਕ ਸ਼ਲੋਕ ਦਾ ਵਚਨਾਮ੍ਰਿਤ-ਵਾਤੋ ਪ੍ਰਮਾਣ ਅਤੇ ਪਦ-ਸੰਬੰਧ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
    searchPlaceholder: 'ਸ਼ਲੋਕ ਨੰ., ਵਚਨਾਮ੍ਰਿਤ (ਜਿਵੇਂ ਗਢਡਾ ੧-੧), ਸ਼ਬਦ ਜਾਂ ਵਿਸ਼ਾ ਖੋਜੋ...',
    allVerses: 'ਸਾਰੇ ੩੧੫ ਸ਼ਲੋਕ',
    vachnamrut: '📖 ਵਚਨਾਮ੍ਰਿਤ',
    swaminiVato: '📿 ਸਵਾਮੀਨੀ ਵਾਤੋ',
    allChapters: 'ਸਾਰੇ ਅਧਿਆਏ',
    availableCount: (c) => `ਕੁੱਲ ${c} ਸ਼ਲੋਕਾਂ ਦੇ ਸ਼ਾਸਤਰੀ ਸੰਦਰਭ ਉਪਲਬਧ`,
    searchQueryLabel: 'ਖੋਜ',
    sutraVani: 'ਸਤਿਸੰਗ ਦੀਕਸ਼ਾ ਸੂਤਰ ਬਾਣੀ',
    fullVerseLabel: 'ਸੰਪੂਰਨ ਸੰਸਕ੍ਰਿਤ ਸ਼ਲੋਕ (Full Sanskrit Verse)',
    anvayaTitle: 'ਅਨਵੈ (ਸੰਸਕ੍ਰਿਤ ਗੱਦ-ਕ੍ਰਮ - Prose Order)',
    wordBreakdownTitle: 'ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਪਦ-ਛੇਦ ਅਤੇ ਸ਼ਾਸਤਰੀ ਸੰਬੰਧ',
    wordBreakdownDesc: 'ਸ਼ਲੋਕ ਦੇ ਹਰੇਕ ਪਦ ਦਾ ਅਰਥ ਅਤੇ ਵਚਨਾਮ੍ਰਿਤ/ਵਾਤੋ ਨਾਲ ਸੰਬੰਧ',
    selectWordLabel: 'ਪਦ ਚੁਣੋ:',
    wordPrefix: 'ਪਦ:',
    scriptureProofPrefix: 'ਮੂਲ ਸ਼ਾਸਤਰ ਪ੍ਰਮਾਣ:',
    correlationPrefix: 'ਸ਼ਾਸਤਰੀ ਤਾਲਮੇਲ:',
    scriptureCrossRefTitle: 'ਸ਼ਾਸਤਰੀ ਸੰਦਰਭ (ਵਚਨਾਮ੍ਰਿਤ ਅਤੇ ਸਵਾਮੀਨੀ ਵਾਤੋ)',
    referencesLabel: 'ਸੰਦਰਭ',
    readerBtn: 'ਅਧਿਐਨ'
  },
  bengali: {
    tag: 'ত্রিবেণী সঙ্গম প্রমাণ অধ্যয়ন (Cross-Reference Concordance)',
    title: 'সৎসঙ্গ দীক্ষা • বচনামৃত • স্বামীনী বাতো শব্দশঃ সম্পর্ক',
    desc: "প্রকট ব্রহ্মস্বরূপ মহন্ত স্বামী মহারাজ কর্তৃক রচিত 'সৎসঙ্গ দীক্ষা'র সমস্ত ৩১৫টি শ্লোক সর্বোপোপরি ভগবান শ্রী স্বামীনারায়ণের উদ্ভাসিত বচনামৃত এবং অক্ষরব্রহ্ম গুণাতীতানন্দ স্বামীর কথার রহস্যময় তত্ত্বসমূহেরই পদচ্ছেদ ও আক্ষরিক সূত্রাত্মক নিরুপণ। নীচে প্রতিটি শ্লোকের বচনামৃত-বাথ প্রমাণ ও পদ-সম্পর্ক প্রদর্শিত হয়েছে।",
    searchPlaceholder: 'শ্লোক নং, বচনামৃত (যেমন গঢডা ১-১), শব্দ বা বিষয় সন্ধান করুন...',
    allVerses: 'সমস্ত ৩১৫টি শ্লোক',
    vachnamrut: '📖 বচনামৃত',
    swaminiVato: '📿 স্বামীনী বাতো',
    allChapters: 'সমস্ত অধ্যায়',
    availableCount: (c) => `মোট ${c}টি শ্লোকের শাস্ত্রীয় প্রমাণ উপলব্ধ`,
    searchQueryLabel: 'সন্ধান',
    sutraVani: 'সৎসঙ্গ দীক্ষা সূত্র বাণী',
    fullVerseLabel: 'সম্পূর্ণ সংস্কৃত শ্লোক (Full Sanskrit Verse)',
    anvayaTitle: 'অন্বয় (সংস্কৃত গদ্য-ক্রম - Prose Order)',
    wordBreakdownTitle: 'শব্দশঃ পদচ্ছেদ এবং শাস্ত্রীয় সম্পর্ক',
    wordBreakdownDesc: 'শ্লোকের প্রতিটি পদের অর্থ এবং বচনামৃত/বাতোর সাথে সম্পর্ক',
    selectWordLabel: 'পদ নির্বাচন করুন:',
    wordPrefix: 'পদ:',
    scriptureProofPrefix: 'মূল শাস্ত্র প্রমাণ:',
    correlationPrefix: 'শাস্ত্রীয় সমন্বয়:',
    scriptureCrossRefTitle: 'শাস্ত্রীয় প্রসঙ্গ (বচনামৃত এবং স্বামীনী বাতো)',
    referencesLabel: 'প্রসঙ্গ',
    readerBtn: 'অধ্যয়ন'
  },
  tamil: {
    tag: 'திரிவேணி சங்கம பிரமாண ஆய்வு (Cross-Reference Concordance)',
    title: 'சத்சங்க தீக்ஷா • வசனாமிர்தம் • சுவாமினி வாதோ சொல் தொடர்பு',
    desc: "பிரகட் பிரம்மசுவரூப் மஹந்த் சுவாமி மகாராஜ் இயற்றிய 'சத்சங்க தீக்ஷா'வின் அனைத்து 315 சுலோகங்களும் சர்வோத்தம பகவான் ஸ்ரீ சுவாமிநாராயணனின் உரைத்த வசனாமிர்தம் மற்றும் அக்ஷரபிரம்மா குணாதீதானந்த சுவாமியின் வாதோவின் ஆழ்ந்த தத்துவங்களின் சொல்வாரியான பதச்சேதமும் சூத்திர வடிவமும் ஆகும். கீழே ஒவ்வொரு சுலோகத்தின் வசனாமிர்தம்-வாதோ சான்றுகளும் சொல் இணைப்புகளும் வழங்கப்பட்டுள்ளன.",
    searchPlaceholder: 'சுலோகம் எண், வசனாமிர்தம் (எ.கா. கத்தடா 1-1), சொல் அல்லது தலைப்பைத் தேடவும்...',
    allVerses: 'அனைத்து 315 சுலோகங்கள்',
    vachnamrut: '📖 வசனாமிர்தம்',
    swaminiVato: '📿 சுவாமினி வாதோ',
    allChapters: 'அனைத்து அத்தியாயங்கள்',
    availableCount: (c) => `மொத்தம் ${c} சுலோகங்களின் சான்றுகள் கிடைக்கின்றன`,
    searchQueryLabel: 'தேடல்',
    sutraVani: 'சத்சங்க தீக்ஷா சூத்திர மொழி',
    fullVerseLabel: 'முழு சமஸ்கிருத சுலோகம் (Full Sanskrit Verse)',
    anvayaTitle: 'அன்வயம் (உரைநடை ஒழுங்கு - Prose Order)',
    wordBreakdownTitle: 'சொல்வாரியான பதச்சேதம் மற்றும் சான்றுகள்',
    wordBreakdownDesc: 'சுலோகத்தின் ஒவ்வொரு சொல்லின் பொருளும் வசனாமிர்தம்/வாதோ உடனான தொடர்பும்',
    selectWordLabel: 'சொல்லைத் தேர்ந்தெடுக்கவும்:',
    wordPrefix: 'சொல்:',
    scriptureProofPrefix: 'மூல சாஸ்திர பிரமாணம்:',
    correlationPrefix: 'சாஸ்திர தொடர்பு:',
    scriptureCrossRefTitle: 'சாஸ்திர ஆதாரங்கள் (வசனாமிர்தம் & சுவாமினி வாதோ)',
    referencesLabel: 'ஆதாரங்கள்',
    readerBtn: 'படிக்க'
  },
  telugu: {
    tag: 'త్రివేణీ సంగమ ప్రమాణ అధ్యయనం (Cross-Reference Concordance)',
    title: 'సత్సంగ్ దీక్ష • వచనామృతం • స్వామినీ వాతో పద సంబంధం',
    desc: "ప్రగట్ బ్రహ్మస్వరూప్ మహంత్ స్వామి మహారాజ్ రచించిన 'సత్సంగ్ దీక్ష'లోని మొత్తం 315 శ్లోకాలు సర్వోన్నత భగవాన్ శ్రీ స్వామినారాయణ్ ఉద్బోధించిన వచనామృతం మరియు అక్షరబ్రహ్మ గుణాతీతానంద స్వామి వాతోల నిగూఢ సిద్ధాంతాల పదచ్ఛేదం మరియు అక్షరాలా సూత్రాత్మక నిరూపణలు. క్రింద ప్రతి శ్లోకం యొక్క వచనామృతం-వాతో ప్రమాణం మరియు పద-సంబంధం చూపబడింది.",
    searchPlaceholder: 'శ్లోకం సంఖ్య, వచనామృతం (ఉదా. గఢడా 1-1), పదం లేదా విషయాన్ని వెతకండి...',
    allVerses: 'అన్ని 315 శ్లోకాలు',
    vachnamrut: '📖 వచనామృతం',
    swaminiVato: '📿 స్వామినీ వాతో',
    allChapters: 'అన్ని ప్రకరణాలు',
    availableCount: (c) => `మొత్తం ${c} శ్లోకాల శాస్త్రీయ ఆధారాలు అందుబాటులో ఉన్నాయి`,
    searchQueryLabel: 'శోధన',
    sutraVani: 'సత్సంగ్ దీక్ష సూత్ర వాణి',
    fullVerseLabel: 'సంపూర్ణ సంస్కృత శ్లోకం (Full Sanskrit Verse)',
    anvayaTitle: 'అన్వయం (గద్య క్రమం - Prose Order)',
    wordBreakdownTitle: 'పదచ్ఛేదం మరియు శాస్త్రీయ సంబంధం',
    wordBreakdownDesc: 'శ్లోకంలోని ప్రతి పదం యొక్క అర్థం మరియు వచనామృతం/వాతో సంబంధం',
    selectWordLabel: 'పదాన్ని ఎంచుకోండి:',
    wordPrefix: 'పదం:',
    scriptureProofPrefix: 'మూల శాస్త్ర ప్రమాణం:',
    correlationPrefix: 'శాస్త్రీయ సమన్వయం:',
    scriptureCrossRefTitle: 'శాస్త్రీయ ఆధారాలు (వచనామృతం మరియు స్వామినీ వాతో)',
    referencesLabel: 'ఆధారాలు',
    readerBtn: 'అధ్యయనం'
  },
  kannada: {
    tag: 'ತ್ರಿವೇಣಿ ಸಂಗಮ ಪ್ರಮಾಣ ಅಧ್ಯಯನ (Cross-Reference Concordance)',
    title: 'ಸತ್ಸಂಗ ದೀಕ್ಷಾ • ವಚನಾಮೃತ • ಸ್ವಾಮಿನೀ ವಾತುಗಳ ಪದ ಸಂಬಂಧ',
    desc: "ಪ್ರಗಟ ಬ್ರಹ್ಮಸ್ವರೂಪ ಮಹಂತ ಸ್ವಾಮಿ ಮಹಾರಾಜರು ರಚಿಸಿದ 'ಸತ್ಸಂಗ ದೀಕ್ಷಾ'ದ ಎಲ್ಲಾ ೩೧೫ ಶ್ಲೋಕಗಳು ಸರ್ವೋನ್ನತ ಭಗವಾನ್ ಶ್ರೀ ಸ್ವಾಮಿನಾರಾಯಣರು ಬೋಧಿಸಿದ ವಚನಾಮೃತ ಮತ್ತು ಅಕ್ಷರಬ್ರಹ್ಮ ಗುಣಾತೀತಾನಂದ ಸ್ವಾಮಿಗಳ ವಾತುಗಳ ನಿಗೂಢ ತತ್ವಗಳ ಪದಚ್ಛೇದ ಮತ್ತು ಅಕ್ಷರಶಃ ಸೂತ್ರಾತ್ಮಕ ನಿರೂಪಣೆಯಾಗಿದೆ. ಕೆಳಗೆ ಪ್ರತಿಯೊಂದು ಶ್ಲೋಕದ ವಚನಾಮೃತ-ವಾತೋ ಪ್ರಮಾಣ ಮತ್ತು ಪದ-ಸಂಬಂಧವನ್ನು ನೀಡಲಾಗಿದೆ.",
    searchPlaceholder: 'ಶ್ಲೋಕ ಸಂ., ವಚನಾಮೃತ (ಉದಾ. ಗಢಡಾ ೧-೧), ಪದ ಅಥವಾ ವಿಷಯ ಹುಡುಕಿ...',
    allVerses: 'ಎಲ್ಲಾ ೩೧೫ ಶ್ಲೋಕಗಳು',
    vachnamrut: '📖 ವಚನಾಮೃತ',
    swaminiVato: '📿 ಸ್ವಾಮಿನೀ ವಾತುಗಳು',
    allChapters: 'ಎಲ್ಲಾ ಪ್ರಕರಣಗಳು',
    availableCount: (c) => `ಒಟ್ಟು ${c} ಶ್ಲೋಕಗಳ ಶಾಸ್ತ್ರೀಯ ಪ್ರಮಾಣಗಳು ಲಭ್ಯವಿದೆ`,
    searchQueryLabel: 'ಹುಡುಕು',
    sutraVani: 'ಸತ್ಸಂಗ ದೀಕ್ಷಾ ಸೂತ್ರ ವಾಣಿ',
    fullVerseLabel: 'ಸಂಪೂರ್ಣ ಸಂಸ್ಕೃತ ಶ್ಲೋಕ (Full Sanskrit Verse)',
    anvayaTitle: 'ಅನ್ವಯ (ಗದ್ಯ ಕ್ರಮ - Prose Order)',
    wordBreakdownTitle: 'ಪದಚ್ಛೇದ ಮತ್ತು ಶಾಸ್ತ್ರೀಯ ಸಂಬಂಧ',
    wordBreakdownDesc: 'ಶ್ಲೋಕದ ಪ್ರತಿಯೊಂದು ಪದದ ಅರ್ಥ ಮತ್ತು ವಚನಾಮೃತ/ವಾತುಗಳೊಂದಿಗಿನ ಸಂಬಂಧ',
    selectWordLabel: 'ಪದ ಆಯ್ಕೆಮಾಡಿ:',
    wordPrefix: 'ಪದ:',
    scriptureProofPrefix: 'ಮೂಲ ಶಾಸ್ತ್ರ ಪ್ರಮಾಣ:',
    correlationPrefix: 'ಶಾಸ್ತ್ರೀಯ ಸಮನ್ವಯ:',
    scriptureCrossRefTitle: 'ಶಾಸ್ತ್ರೀಯ ಆಧಾರಗಳು (ವಚನಾಮೃತ ಮತ್ತು ಸ್ವಾಮಿನೀ ವಾತುಗಳು)',
    referencesLabel: 'ಆಧಾರಗಳು',
    readerBtn: 'ಅಧ್ಯಯನ'
  },
  spanish: {
    tag: 'Estudio de Concordancia de Escrituras (Cross-Reference Concordance)',
    title: 'Concordancia Satsang Diksha • Vachnamrut • Swamini Vato',
    desc: "Los 315 versos de 'Satsang Diksha' compuestos por Pragat Brahmaswarup Mahant Swami Maharaj son una exposición aforística y desglose palabra por palabra de los profundos principios del Vachnamrut expuesto por el supremo Bhagwan Shri Swaminarayan y el Swamini Vato de Aksharbrahma Gunatitanand Swami. A continuación se detalla la autoridad escritural de Vachnamrut-Vato y la correlación término a término de cada verso.",
    searchPlaceholder: 'Buscar núm. de verso, Vachnamrut (ej. Gadhada I-1), palabra o tema...',
    allVerses: 'Todos los 315 versos',
    vachnamrut: '📖 Vachnamrut',
    swaminiVato: '📿 Swamini Vato',
    allChapters: 'Todos los capítulos',
    availableCount: (c) => `Total de ${c} versos con referencias escriturales disponibles`,
    searchQueryLabel: 'Buscar',
    sutraVani: 'Verso sagrado de Satsang Diksha',
    fullVerseLabel: 'Verso sánscrito completo (Full Sanskrit Verse)',
    anvayaTitle: 'Anvaya (Orden de prosa en sánscrito - Prose Order)',
    wordBreakdownTitle: 'Desglose palabra por palabra y concordancia',
    wordBreakdownDesc: 'Significado de la palabra y correlación con Vachnamrut / Swamini Vato',
    selectWordLabel: 'Seleccione palabra para ver detalles:',
    wordPrefix: 'Palabra:',
    scriptureProofPrefix: 'Referencia original de las escrituras:',
    correlationPrefix: 'Correlación escritural:',
    scriptureCrossRefTitle: 'Referencias escriturales (Vachnamrut y Swamini Vato)',
    referencesLabel: 'referencias',
    readerBtn: 'Estudiar'
  },
  french: {
    tag: 'Étude de Concordance des Écritures (Cross-Reference Concordance)',
    title: 'Concordance Satsang Diksha • Vachnamrut • Swamini Vato',
    desc: "L'ensemble des 315 versets de 'Satsang Diksha' composés par Pragat Brahmaswarup Mahant Swami Maharaj constituent une analyse mot à mot et une formulation aphoristique des principes profonds du Vachnamrut énoncé par le suprême Bhagwan Shri Swaminarayan et du Swamini Vato d'Aksharbrahma Gunatitanand Swami. Ci-dessous sont présentées l'autorité scripturaire Vachnamrut-Vato et la corrélation terme à terme pour chaque verset.",
    searchPlaceholder: 'Rechercher n° de verset, Vachnamrut (ex. Gadhada I-1), mot ou sujet...',
    allVerses: 'Tous les 315 versets',
    vachnamrut: '📖 Vachnamrut',
    swaminiVato: '📿 Swamini Vato',
    allChapters: 'Tous les chapitres',
    availableCount: (c) => `Total de ${c} versets avec références disponibles`,
    searchQueryLabel: 'Recherche',
    sutraVani: 'Verset sacré de Satsang Diksha',
    fullVerseLabel: 'Verset sanskrit complet (Full Sanskrit Verse)',
    anvayaTitle: 'Anvaya (Ordre de la prose sanskrite - Prose Order)',
    wordBreakdownTitle: 'Analyse mot à mot et concordance',
    wordBreakdownDesc: 'Sens du mot et corrélation avec Vachnamrut / Swamini Vato',
    selectWordLabel: 'Sélectionnez un mot pour voir les détails :',
    wordPrefix: 'Mot :',
    scriptureProofPrefix: 'Référence scripturaire originale :',
    correlationPrefix: 'Corrélation scripturaire :',
    scriptureCrossRefTitle: 'Références scripturaires (Vachnamrut et Swamini Vato)',
    referencesLabel: 'références',
    readerBtn: 'Étudier'
  },
  german: {
    tag: 'Schriftliche Konkordanz-Studie (Cross-Reference Concordance)',
    title: 'Satsang Diksha • Vachnamrut • Swamini Vato Konkordanz',
    desc: "Alle 315 Verse der von Pragat Brahmaswarup Mahant Swami Maharaj verfassten 'Satsang Diksha' sind eine wortwörtliche Analyse und aphoristische Darlegung der tiefgründigen Prinzipien des von dem höchsten Bhagwan Shri Swaminarayan offenbarten Vachnamrut und des Swamini Vato von Aksharbrahma Gunatitanand Swami. Unten sind die Vachnamrut-Vato-Schriftbelege und Wortbezüge für jeden Vers aufgeführt.",
    searchPlaceholder: 'Vers-Nr., Vachnamrut (z. B. Gadhada I-1), Wort oder Thema suchen...',
    allVerses: 'Alle 315 Verse',
    vachnamrut: '📖 Vachnamrut',
    swaminiVato: '📿 Swamini Vato',
    allChapters: 'Alle Kapitel',
    availableCount: (c) => `Insgesamt ${c} Verse mit Schriftbelegen verfügbar`,
    searchQueryLabel: 'Suche',
    sutraVani: 'Heiliger Satsang Diksha Vers',
    fullVerseLabel: 'Vollständiger Sanskrit-Vers (Full Sanskrit Verse)',
    anvayaTitle: 'Anvaya (Sanskrit-Prosareihenfolge - Prose Order)',
    wordBreakdownTitle: 'Wort-für-Wort-Gliederung & Konkordanz',
    wordBreakdownDesc: 'Wortbedeutung und Beziehung zu Vachnamrut / Swamini Vato',
    selectWordLabel: 'Wort zur Detailansicht auswählen:',
    wordPrefix: 'Wort:',
    scriptureProofPrefix: 'Ursprünglicher Schriftbeleg:',
    correlationPrefix: 'Schriftliche Korrelation:',
    scriptureCrossRefTitle: 'Schriftliche Referenzen (Vachnamrut & Swamini Vato)',
    referencesLabel: 'Referenzen',
    readerBtn: 'Studieren'
  },
  portuguese: {
    tag: 'Estudo de Concordância das Escrituras (Cross-Reference Concordance)',
    title: 'Concordância Satsang Diksha • Vachnamrut • Swamini Vato',
    desc: "Todos os 315 versos de 'Satsang Diksha' compostos por Pragat Brahmaswarup Mahant Swami Maharaj são uma análise palavra por palavra e exposição aforística dos princípios profundos do Vachnamrut exposto pelo supremo Bhagwan Shri Swaminarayan e do Swamini Vato de Aksharbrahma Gunatitanand Swami. Abaixo constam a autoridade escritural de Vachnamrut-Vato e a correlação termo a termo para cada verso.",
    searchPlaceholder: 'Buscar versículo nº, Vachnamrut (ex.: Gadhada I-1), palavra ou tema...',
    allVerses: 'Todos os 315 versículos',
    vachnamrut: '📖 Vachnamrut',
    swaminiVato: '📿 Swamini Vato',
    allChapters: 'Todos os capítulos',
    availableCount: (c) => `Total de ${c} versículos com referências disponíveis`,
    searchQueryLabel: 'Pesquisar',
    sutraVani: 'Versículo sagrado de Satsang Diksha',
    fullVerseLabel: 'Versículo sânscrito completo (Full Sanskrit Verse)',
    anvayaTitle: 'Anvaya (Ordem de prosa em sânscrito - Prose Order)',
    wordBreakdownTitle: 'Desdobramento palavra por palavra e concordância',
    wordBreakdownDesc: 'Significado da palavra e correlação com Vachnamrut / Swamini Vato',
    selectWordLabel: 'Selecione uma palavra para ver detalhes:',
    wordPrefix: 'Palavra:',
    scriptureProofPrefix: 'Referência escritural original:',
    correlationPrefix: 'Correlação escritural:',
    scriptureCrossRefTitle: 'Referências escriturais (Vachnamrut & Swamini Vato)',
    referencesLabel: 'referências',
    readerBtn: 'Estudar'
  },
  russian: {
    tag: 'Изучение богооткровенных первоисточников (Cross-Reference Concordance)',
    title: 'Сатсанг Дикша • Вачнамрут • Свамини Вато: пословная связь',
    desc: "Все 315 стихов 'Сатсанг Дикши', составленных Прагат Брахмасварупом Махант Свами Махараджем, представляют собой пословный разбор и афористическое изложение сокровенных принципов Вачнамрута, возвещенного верховным Бхагваном Шри Сваминараяном, и Свамини Вато Акшарбрахмы Гунатитананда Свами. Ниже приведены свидетельства первоисточников Вачнамрут-Вато и пословные параллели к каждому стиху.",
    searchPlaceholder: '№ стиха, Вачнамрут (напр. Гадхада I-1), слово или тему...',
    allVerses: 'Все 315 стихов',
    vachnamrut: '📖 Вачнамрут',
    swaminiVato: '📿 Свамини Вато',
    allChapters: 'Все главы',
    availableCount: (c) => `Всего ${c} стихов со священными параллелями`,
    searchQueryLabel: 'Поиск',
    sutraVani: 'Священный стих Сатсанг Дикши',
    fullVerseLabel: 'Полный стих на санскрите (Full Sanskrit Verse)',
    anvayaTitle: 'Анвая (прозаический порядок санскрита - Prose Order)',
    wordBreakdownTitle: 'Пословный разбор и священная связь',
    wordBreakdownDesc: 'Значение каждого слова и связь с Вачнамрутом / Свамини Вато',
    selectWordLabel: 'Выберите слово для подробностей:',
    wordPrefix: 'Слово:',
    scriptureProofPrefix: 'Свидетельство священного первоисточника:',
    correlationPrefix: 'Богословское соответствие:',
    scriptureCrossRefTitle: 'Священные источники (Вачнамрут и Свамини Вато)',
    referencesLabel: 'ссылок',
    readerBtn: 'Изучить'
  },
  greek: {
    tag: 'Μελέτη Συμφωνίας Ιερών Κειμένων (Cross-Reference Concordance)',
    title: 'Σατσάνγκ Ντίκσα • Βατσναμρούτ • Σουαμίνι Βάτο: Αντιστοίχιση',
    desc: "Και οι 315 στίχοι του 'Σατσάνγκ Ντίκσα' που συνέθεσε ο Πραγκάτ Μπραχμασβαρούπ Μαχάντ Σουάμι Μαχαράτζ αποτελούν λέξη προς λέξη ανάλυση και αφοριστική διατύπωση των βαθιών αρχών του Βατσναμρούτ που εξήγησε ο υπέρτατος Μπαγκβάν Σρι Σουαμιναραγιάν και του Σουαμίνι Βάτο του Ακσαρμπράχμα Γκουνατιτάναντ Σουάμι. Παρακάτω παρατίθενται οι αυθεντικές αναφορές Βατσναμρούτ-Βάτο και η αντιστοίχιση των όρων για κάθε στίχο.",
    searchPlaceholder: 'Αρ. στίχου, Βατσναμρούτ (π.χ. Γκαντάντα 1-1), λέξη ή θέμα...',
    allVerses: 'Και οι 315 στίχοι',
    vachnamrut: '📖 Βατσναμρούτ',
    swaminiVato: '📿 Σουαμίνι Βάτο',
    allChapters: 'Όλα τα κεφάλαια',
    availableCount: (c) => `Συνολικά ${c} στίχοι με αυθεντικές παραπομπές`,
    searchQueryLabel: 'Αναζήτηση',
    sutraVani: 'Ιερός στίχος Σατσάνγκ Ντίκσα',
    fullVerseLabel: 'Πλήρης σανσκριτικός στίχος (Full Sanskrit Verse)',
    anvayaTitle: 'Ανβάγια (Πεζή σειρά στα σανσκριτικά - Prose Order)',
    wordBreakdownTitle: 'Ανάλυση λέξη προς λέξη και αντιστοίχιση',
    wordBreakdownDesc: 'Σημασία κάθε λέξης και συσχέτιση με Βατσναμρούτ / Σουαμίνι Βάτο',
    selectWordLabel: 'Επιλέξτε λέξη για λεπτομέρειες:',
    wordPrefix: 'Λέξη:',
    scriptureProofPrefix: 'Πρωτότυπη αναφορά γραφής:',
    correlationPrefix: 'Γραφική συσχέτιση:',
    scriptureCrossRefTitle: 'Παραπομπές γραφών (Βατσναμρούτ & Σουαμίνι Βάτο)',
    referencesLabel: 'παραπομπές',
    readerBtn: 'Μελέτη'
  },
  polish: {
    tag: 'Studium Konkordancji Pism Świętych (Cross-Reference Concordance)',
    title: 'Satsang Diksza • Wacznamrut • Swamini Wato: Konkordancja',
    desc: "Wszystkie 315 wersetów 'Satsang Dikszy' skomponowanych przez Pragat Brahmaswarupa Mahant Swami Maharadża stanowią słowo po słowie rozbiór i aforystyczny wykład głębokich zasad Wacznamrutu wygłoszonego przez Najwyższego Bhagwana Śri Swaminarajana oraz Swamini Wato Akszarbrahmy Gunatitananda Swamiego. Poniżej przedstawiono autorytet pism Wacznamrut-Wato oraz korelacje słowne dla każdego wersetu.",
    searchPlaceholder: 'Nr wersetu, Wacznamrut (np. Gadhada I-1), słowo lub temat...',
    allVerses: 'Wszystkie 315 wersetów',
    vachnamrut: '📖 Wacznamrut',
    swaminiVato: '📿 Swamini Wato',
    allChapters: 'Wszystkie rozdziały',
    availableCount: (c) => `Łącznie ${c} wersetów z odsyłaczami do pism`,
    searchQueryLabel: 'Szukaj',
    sutraVani: 'Święty werset Satsang Dikszy',
    fullVerseLabel: 'Kompletny werset w sanskrycie (Full Sanskrit Verse)',
    anvayaTitle: 'Anvaya (Kolejność prozy w sanskrycie - Prose Order)',
    wordBreakdownTitle: 'Rozbiór słowo po słowie i konkordancja',
    wordBreakdownDesc: 'Znaczenie słowa i powiązanie z Wacznamrut / Swamini Wato',
    selectWordLabel: 'Wybierz słowo, aby zobaczyć szczegóły:',
    wordPrefix: 'Słowo:',
    scriptureProofPrefix: 'Pierwotny autorytet pism:',
    correlationPrefix: 'Korelacja z pismami:',
    scriptureCrossRefTitle: 'Odsyłacze do pism (Wacznamrut i Swamini Wato)',
    referencesLabel: 'odsyłaczy',
    readerBtn: 'Studiuj'
  }
};

const getCrossRefStrings = (lang: string) => {
  return CROSS_REF_I18N[lang] || CROSS_REF_I18N.english;
};

interface CrossScriptureViewProps {
  shlokas: Shloka[];
  preferences?: UserPreferences;
  onOpenCrossRef?: (ref: ScriptureReference) => void;
  onSelectShloka: (id: number) => void;
}

export const CrossScriptureView: React.FC<CrossScriptureViewProps> = ({
  shlokas,
  preferences,
  onOpenCrossRef,
  onSelectShloka
}) => {
  const [filterType, setFilterType] = useState<'all' | 'vachnamrut' | 'swamini_vato'>('all');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWordShlokaId, setExpandedWordShlokaId] = useState<number | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<{ [shlokaId: number]: number }>({});

  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;
  const t = getCrossRefStrings(lang);

  const filteredItems = useMemo(() => {
    return shlokas.filter(s => {
      // Filter by scripture type
      if (filterType !== 'all') {
        const hasType = s.crossReferences?.some(r => r.type === filterType);
        if (!hasType) return false;
      }

      // Filter by chapter
      if (selectedChapter !== 'all' && s.chapterId !== selectedChapter) {
        return false;
      }

      // Filter by search query (id, title, meaning, sanskrit, vachnamrut title, or word)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = s.id.toString() === query || `shlok ${s.id}`.includes(query) || `verse ${s.id}`.includes(query);
        const textMatch = 
          s.titleGu.toLowerCase().includes(query) ||
          s.titleHi.toLowerCase().includes(query) ||
          s.titleEn.toLowerCase().includes(query) ||
          s.sanskritDevanagari.toLowerCase().includes(query) ||
          s.sanskritGujarati.toLowerCase().includes(query) ||
          s.meaningGu.toLowerCase().includes(query) ||
          s.meaningHi.toLowerCase().includes(query) ||
          s.meaningEn.toLowerCase().includes(query);
        
        const refMatch = s.crossReferences?.some(r => 
          (r.title && r.title.toLowerCase().includes(query)) ||
          (r.titleGu && r.titleGu.toLowerCase().includes(query)) ||
          (r.titleHi && r.titleHi.toLowerCase().includes(query)) ||
          (r.titleEn && r.titleEn.toLowerCase().includes(query)) ||
          (r.section && r.section.toLowerCase().includes(query)) ||
          (r.textGu && r.textGu.toLowerCase().includes(query)) ||
          (r.textHi && r.textHi.toLowerCase().includes(query)) ||
          (r.textEn && r.textEn.toLowerCase().includes(query)) ||
          (r.correlationNote && r.correlationNote.toLowerCase().includes(query))
        );

        const padachhedaList: WordMeaning[] = (PADACHHEDA_DATA && PADACHHEDA_DATA[s.id]) || s.padachheda || [];
        const wordMatch = padachhedaList.some(p => 
          p.word.toLowerCase().includes(query) ||
          (p.wordDevanagari && p.wordDevanagari.toLowerCase().includes(query)) ||
          (p.wordGujarati && p.wordGujarati.toLowerCase().includes(query)) ||
          (p.meaningGu && p.meaningGu.toLowerCase().includes(query)) ||
          (p.meaningHi && p.meaningHi.toLowerCase().includes(query)) ||
          (p.meaningEn && p.meaningEn.toLowerCase().includes(query)) ||
          (p.scriptureReference?.source && p.scriptureReference.source.toLowerCase().includes(query))
        );

        return idMatch || textMatch || refMatch || wordMatch;
      }

      return true;
    });
  }, [shlokas, filterType, selectedChapter, searchQuery]);

  const toggleWordBreakdown = (id: number) => {
    setExpandedWordShlokaId(prev => prev === id ? null : id);
  };

  const handleWordSelect = (shlokaId: number, wordIdx: number) => {
    setActiveWordIndex(prev => ({
      ...prev,
      [shlokaId]: wordIdx
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-white/10 text-amber-300 backdrop-blur-xs">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t.tag}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
              {t.title}
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-amber-100/90 max-w-3xl leading-relaxed mt-2">
          {t.desc}
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-4 border-t border-amber-400/25 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-900 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scripture Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'vachnamrut', 'swamini_vato'] as const).map((filterOpt) => (
                <button
                  key={filterOpt}
                  onClick={() => setFilterType(filterOpt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    filterType === filterOpt
                      ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                      : 'bg-black/25 text-amber-100 hover:bg-black/40'
                  }`}
                >
                  {filterOpt === 'all' && t.allVerses}
                  {filterOpt === 'vachnamrut' && t.vachnamrut}
                  {filterOpt === 'swamini_vato' && t.swaminiVato}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-amber-200/80 font-medium whitespace-nowrap mr-1">
              {ui.chapterPrefix}:
            </span>
            <button
              onClick={() => setSelectedChapter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                selectedChapter === 'all'
                  ? 'bg-white text-amber-950 font-bold shadow-xs'
                  : 'bg-white/10 text-amber-100 hover:bg-white/20'
              }`}
            >
              {t.allChapters}
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                  selectedChapter === ch
                    ? 'bg-white text-amber-950 font-bold shadow-xs'
                    : 'bg-white/10 text-amber-100 hover:bg-white/20'
                }`}
              >
                {ui.chapterPrefix} {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-2 text-xs text-[#7A6B5C] dark:text-[#A89886]">
        <span>
          {t.availableCount(filteredItems.length)}
        </span>
        {searchQuery && (
          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-medium">
            {t.searchQueryLabel}: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Cross Reference Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredItems.map((shloka) => {
          const isWordExpanded = expandedWordShlokaId === shloka.id;
          const currentWordIdx = activeWordIndex[shloka.id] ?? 0;
          const padachhedaList: WordMeaning[] = (PADACHHEDA_DATA && PADACHHEDA_DATA[shloka.id]) || shloka.padachheda || [];
          const anvaya = ANVAYA_DATA ? ANVAYA_DATA[shloka.id] : null;
          const selectedWord: WordMeaning | undefined = padachhedaList[currentWordIdx];

          return (
            <div
              key={shloka.id}
              id={`crossref-card-${shloka.id}`}
              className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 sm:p-6 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-4 transition-all hover:border-amber-400/60"
            >
              {/* Shloka Summary Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EADB] dark:border-[#352D26]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-amber-950 font-bold flex items-center justify-center text-sm shadow-sm border border-amber-300">
                    #{shloka.id}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#8B2500] dark:text-amber-300">
                      {getShlokaTitle(shloka, lang)}
                    </h3>
                    <span className="text-xs text-[#8A7A68] dark:text-[#A89886]">
                      {ui.chapterPrefix} {shloka.chapterId}: {getShlokaChapterName(shloka, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWordBreakdown(shloka.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                      isWordExpanded
                        ? 'bg-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.wordBreakdownTitle}</span>
                    {isWordExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onSelectShloka(shloka.id)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white font-semibold transition shadow-xs flex items-center gap-1"
                  >
                    <span>{t.readerBtn}</span>
                    <BookOpen className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Sanskrit Verse & Meaning Box */}
              <div className="p-4 bg-[#FAF6F0] dark:bg-[#1E1916] rounded-xl border border-amber-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8B2500] dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t.sutraVani}
                  </span>
                  <span className="text-[11px] text-[#8A7A68] dark:text-[#A89886] font-mono">
                    {ui.shlokaNumberPrefix} {shloka.id} / 315
                  </span>
                </div>

                {/* Primary Sanskrit Script based on preference */}
                <p className="font-sanskrit text-base sm:text-lg font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide select-text">
                  {preferences?.sanskritScript === 'gujarati' ? shloka.sanskritGujarati : shloka.sanskritDevanagari}
                </p>

                {/* Alternate Script Display */}
                {preferences?.sanskritScript === 'gujarati' ? (
                  <p className="font-sanskrit text-xs sm:text-sm text-[#8B2500]/85 dark:text-amber-300/80 leading-relaxed whitespace-pre-line">
                    {shloka.sanskritDevanagari}
                  </p>
                ) : (
                  <p className="font-gujarati text-xs sm:text-sm text-[#8B2500]/85 dark:text-amber-300/80 leading-relaxed whitespace-pre-line">
                    {shloka.sanskritGujarati}
                  </p>
                )}

                {/* IAST Transliteration */}
                {shloka.sanskritIast && (
                  <p className="text-xs text-[#8A7A68] dark:text-[#A89886] font-mono italic">
                    {shloka.sanskritIast}
                  </p>
                )}

                <div className="pt-2 border-t border-amber-200/40 dark:border-[#352D26] space-y-1">
                  <p className="text-xs sm:text-sm text-[#4A3D31] dark:text-[#DCD1C3] leading-relaxed">
                    <strong className="text-[#8B2500] dark:text-amber-400">{langMeta.nativeName}:</strong> {getShlokaMeaning(shloka, lang)}
                  </p>
                  {lang !== 'gujarati' && (
                    <p className="font-gujarati text-[11px] text-[#6B5E51] dark:text-[#A89886] leading-relaxed">
                      <strong>મૂળ ગુજરાતી:</strong> {shloka.meaningGu}
                    </p>
                  )}
                </div>
              </div>

              {/* Word-by-Word Vachnamrut & Swami ni Vato Breakdown (Expandable) */}
              {isWordExpanded && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-[#28201A] border-2 border-amber-300 dark:border-amber-900/50 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900/40">
                    <span className="text-xs sm:text-sm font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      {t.wordBreakdownTitle}:
                    </span>
                    <span className="text-[11px] text-[#7A6B5C] dark:text-[#B5A595]">
                      ({t.wordBreakdownDesc})
                    </span>
                  </div>

                  {/* Complete Full Sanskrit Verse prominently shown in Word Breakdown */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1916] border border-amber-300/80 dark:border-amber-900/40 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <span>॥ {t.fullVerseLabel} ॥</span>
                      {shloka.sanskritMeter && (
                        <span className="text-[10px] text-[#8A7A68] dark:text-[#A89886] font-normal normal-case">
                          {lang === 'gujarati' ? `છંદ: ${shloka.sanskritMeter}` : `Meter: ${shloka.sanskritMeter}`}
                        </span>
                      )}
                    </div>
                    {/* Full Devanagari */}
                    <p className="font-sanskrit text-base sm:text-lg font-bold text-[#731E00] dark:text-[#F39C38] leading-relaxed whitespace-pre-line tracking-wide select-text">
                      {shloka.sanskritDevanagari}
                    </p>
                    {/* Full Gujarati Script */}
                    <p className="font-gujarati text-xs sm:text-sm font-semibold text-[#8B2500] dark:text-amber-300 leading-relaxed whitespace-pre-line">
                      {shloka.sanskritGujarati}
                    </p>
                    {/* IAST Transliteration */}
                    {shloka.sanskritIast && (
                      <p className="text-xs text-[#8A7A68] dark:text-[#A89886] font-mono italic">
                        {shloka.sanskritIast}
                      </p>
                    )}
                  </div>

                  {/* Authentic Sanskrit Anvaya (Prose Order) */}
                  {anvaya && (
                    <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#201A16] border border-amber-200 dark:border-[#382E25] space-y-1.5">
                      <div className="text-[11px] font-bold text-[#8B2500] dark:text-amber-400">
                        {t.anvayaTitle}
                      </div>
                      <p className="font-sanskrit text-xs sm:text-sm font-medium text-[#4A3D31] dark:text-[#DCD1C3] leading-relaxed">
                        {preferences?.sanskritScript === 'gujarati' ? anvaya.gujarati : anvaya.devanagari}
                      </p>
                      {anvaya.iast && (
                        <p className="text-[11px] text-[#8A7A68] dark:text-[#A89886] font-mono italic">
                          {anvaya.iast}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Word Chips */}
                  {padachhedaList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-[#7A6B5C] dark:text-[#B5A595]">
                        {t.selectWordLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {padachhedaList.map((p, pIdx) => {
                          const isSelected = currentWordIdx === pIdx;
                          return (
                            <button
                              key={pIdx}
                              onClick={() => handleWordSelect(shloka.id, pIdx)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#8B2500] text-white font-bold shadow-xs'
                                  : 'bg-white dark:bg-[#1E1916] text-[#54473C] dark:text-[#D1C5B7] border border-amber-200 dark:border-[#3D342C] hover:border-amber-400'
                              }`}
                            >
                              <span className="font-sanskrit font-semibold">
                                {preferences?.sanskritScript === 'gujarati' ? (p.wordGujarati || p.word) : (p.wordDevanagari || p.word)}
                              </span>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-300" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Word Scriptural Correlation Detail Box */}
                  {selectedWord && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1916] border border-amber-300/80 dark:border-amber-900/40 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-sanskrit text-sm font-bold text-[#8B2500] dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                            {t.wordPrefix} {preferences?.sanskritScript === 'gujarati' ? (selectedWord.wordGujarati || selectedWord.word) : (selectedWord.wordDevanagari || selectedWord.word)}
                          </span>
                          {selectedWord.transliteration && (
                            <span className="text-xs text-[#8A7A68] dark:text-[#A89886] font-mono italic">
                              ({selectedWord.transliteration})
                            </span>
                          )}
                          {selectedWord.grammaticalRole && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[#6B5E51] dark:text-[#A89886]">
                              {selectedWord.grammaticalRole}
                            </span>
                          )}
                          <span className="text-xs text-[#2D241E] dark:text-[#EDE5D8] font-semibold">
                            {getWordMeaningInLang(selectedWord, lang)}
                          </span>
                          {lang !== 'gujarati' && selectedWord.meaningGu && (
                            <span className="text-xs text-[#6B5E51] dark:text-[#A89886]">
                              (ગુજરાતી: {selectedWord.meaningGu})
                            </span>
                          )}
                        </div>
                      </div>

                      {selectedWord.scriptureReference && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-100 dark:border-[#352D26] text-xs">
                          <span className="font-bold text-[#8B2500] dark:text-amber-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            {t.scriptureProofPrefix}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 font-bold text-amber-950 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/50 shadow-2xs">
                            {selectedWord.scriptureReference.source}
                          </span>
                          {selectedWord.scriptureReference.correlation && (
                            <span className="text-[11px] text-[#6B5E51] dark:text-[#A89886]">
                              • {selectedWord.scriptureReference.correlation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Referenced Scriptures (Vachnamrut & Swami ni Vato) - Reference Numbers Interface */}
              {shloka.crossReferences && shloka.crossReferences.length > 0 && (() => {
                const vachRefs = shloka.crossReferences.filter(r => r.type === 'vachnamrut');
                const swamiRefs = shloka.crossReferences.filter(r => r.type === 'swamini_vato');
                const vachLabel = lang === 'english' ? 'Vachnamrut' : lang === 'hindi' ? 'वचनामृत' : 'વચનામૃત';
                const swamiLabel = lang === 'english' ? 'Swamini Vato' : lang === 'hindi' ? 'स्वामीनी बातें' : 'સ્વામીની વાતો';

                return (
                  <div className="space-y-2 pt-2 border-t border-amber-200/50 dark:border-amber-950/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8B2500] dark:text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{ui.scriptureCrossRefTitle}:</span>
                      </span>
                      <span className="text-[10px] text-[#7A6B5C] dark:text-[#A89886] font-medium">
                        {shloka.crossReferences.length} {lang === 'english' ? 'references' : lang === 'hindi' ? 'संदर्भ' : 'સંદર્ભો'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Vachnamrut Reference Numbers */}
                      {vachRefs.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B2500] dark:text-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 inline-block" />
                            <span>{vachLabel}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold ml-auto">
                              {vachRefs.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {vachRefs.map((ref, idx) => {
                              const section = getReferenceSection(ref, lang) || getReferenceTitle(ref, lang);
                              return (
                                <div
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1E1916] border border-amber-300/60 dark:border-amber-800/50 text-xs text-[#2D241E] dark:text-[#EDE5D8] shadow-2xs"
                                >
                                  <span className="font-semibold text-amber-950 dark:text-amber-200">
                                    {section}
                                  </span>
                                  {ref.topic && (
                                    <span className="text-[10px] text-[#7A6B5C] dark:text-[#A89886] border-l border-amber-200 dark:border-stone-700 pl-1.5">
                                      {ref.topic}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Swamini Vato Reference Numbers */}
                      {swamiRefs.length > 0 && (
                        <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E3E00] dark:text-orange-300">
                            <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400 inline-block" />
                            <span>{swamiLabel}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200/80 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 font-semibold ml-auto">
                              {swamiRefs.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {swamiRefs.map((ref, idx) => {
                              const section = getReferenceSection(ref, lang) || getReferenceTitle(ref, lang);
                              return (
                                <div
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1E1916] border border-orange-300/60 dark:border-orange-800/50 text-xs text-[#2D241E] dark:text-[#EDE5D8] shadow-2xs"
                                >
                                  <span className="font-semibold text-orange-950 dark:text-orange-200">
                                    {section}
                                  </span>
                                  {ref.topic && (
                                    <span className="text-[10px] text-[#7A6B5C] dark:text-[#A89886] border-l border-orange-200 dark:border-stone-700 pl-1.5">
                                      {ref.topic}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#221D1A] rounded-2xl border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
            <BookOpen className="w-12 h-12 text-amber-600 mx-auto opacity-50" />
            <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
              કોઈ સંદર્ભ મળ્યો નથી
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              કૃપા કરીને શોધ શબ્દ બદલો અથવા ફિલ્ટર સાફ કરો.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setSelectedChapter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold text-xs"
            >
              તમામ ફિલ્ટર સાફ કરો
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

