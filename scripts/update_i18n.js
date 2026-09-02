import fs from 'fs';

const i18nFile = 'src/utils/i18n.ts';
let content = fs.readFileSync(i18nFile, 'utf8');

// Ensure UIStrings interface has new keys
const newInterfaceProps = `  // Navigation Tabs
  tabHome: string;
  tabReader: string;
  tabMukhpath: string;
  tabChapters: string;
  tabCrossref: string;
  tabQuiz: string;
  tabBookmarks: string;
  tabSettings: string;
  tabApk: string;
  tabUdgaan: string;

  // Home Page Specific
  homeAuthorTitle: string;
  homeHeroTitle: string;
  homeHeroDesc: string;
  homeStartShlokBtn: string;
  homeMukhpathBtn: string;
  homeUdgaanBtn: string;
  homeTotalShlokasBadge: string;
  homeMemorizedBadge: string;
  homeSavedBadge: string;
  homeDailyVerseTitle: string;
  homeExploreVerseBtn: string;
  homeStudyModulesTitle: string;
  homeExploreBtn: string;

  // Home Study Modules
  homeShlokAdhyayanTitle: string;
  homeShlokAdhyayanDesc: string;
  homeMukhpathTitle: string;
  homeMukhpathDesc: string;
  homeChaptersTitle: string;
  homeChaptersDesc: string;
  homeCrossRefTitle: string;
  homeCrossRefDesc: string;
  homeQuizTitle: string;
  homeQuizDesc: string;
  homeBookmarksTitle: string;
  homeBookmarksDesc: string;
  homeUdgaanTitle: string;
  homeUdgaanDesc: string;`;

// Replace interface block
content = content.replace(/\/\/ Navigation Tabs[\s\S]*?tabApk: string;/, newInterfaceProps);

// Translations dictionary for each language
const langTranslations = {
  gujarati: {
    tabUdgaan: 'ઉદ્ગાન શ્રવણ',
    homeAuthorTitle: 'પ્રગટ બ્રહ્મસ્વરૂપ મહંત સ્વામી મહારાજ પ્રણીત',
    homeHeroTitle: 'સત્સંગ દીક્ષા સ્વાધ્યાય',
    homeHeroDesc: 'ભગવાન સ્વામિનારાયણ પ્રબોધિત અક્ષરપુરુષોત્તમ ઉપાસના અને સદાચારના ૩૧૫ સંસ્કૃત શ્લોકોનું પ્રામાણિક અધ્યયન, પદચ્છેદ, મુખપાઠ અને વચનામૃત-વાતો અનુસંધાન.',
    homeStartShlokBtn: 'શ્લોક અધ્યયન શરૂ કરો',
    homeMukhpathBtn: 'મુખપાઠ સાધના',
    homeUdgaanBtn: 'ઉદ્ગાન શ્રવણ (Udgaan Audio)',
    homeTotalShlokasBadge: 'કુલ શ્લોકો: ૩૧૫',
    homeMemorizedBadge: 'મુખપાઠ સિદ્ધ',
    homeSavedBadge: 'સાચવેલા શ્લોકો',
    homeDailyVerseTitle: 'આજનો પ્રેરણાદાયી શ્લોક',
    homeExploreVerseBtn: 'વિસ્તૃત અધ્યયન',
    homeStudyModulesTitle: 'મુખ્ય અધ્યયન વિભાગો',
    homeExploreBtn: 'પ્રવેશ કરો',
    homeShlokAdhyayanTitle: 'શ્લોક અધ્યયન',
    homeShlokAdhyayanDesc: 'સંસ્કૃત શ્લોક, ભાવાર્થ, પદચ્છેદ, વ્યાકરણ અને શાસ્ત્રીય રહસ્ય',
    homeMukhpathTitle: 'મુખપાઠ સાધના',
    homeMukhpathDesc: 'શ્લોકો કંઠસ્થ કરવાની વિશિષ્ટ વૈદિક પદ્ધતિ અને શ્રવણ કસોટી',
    homeChaptersTitle: 'પ્રકરણ અનુક્રમણિકા',
    homeChaptersDesc: '૧૦ પ્રકરણો: મંગલાચરણ, ઉપાસના, નિત્યકર્મ, આહારશુદ્ધિ અને બ્રહ્મવિદ્યા',
    homeCrossRefTitle: 'વચનામૃત-વાતો અનુસંધાન',
    homeCrossRefDesc: 'વચનામૃત અને સ્વામીની વાતોના મૂળ સંદર્ભો સાથે સિદ્ધાંત પ્રમાણ',
    homeQuizTitle: 'સ્વાધ્યાય કસોટી',
    homeQuizDesc: 'શ્લોકાર્થ, ખાલી જગ્યા અને સિદ્ધાંત આધારિત પ્રશ્નોત્તરી',
    homeBookmarksTitle: 'સાચવેલા શ્લોકો & નોંધો',
    homeBookmarksDesc: 'તમારા પસંદગીના શ્લોકો અને મનન-ચિંતનની વ્યક્તિગત નોંધ',
    homeUdgaanTitle: 'ઉદ્ગાન વૈદિક ગાન',
    homeUdgaanDesc: 'BAPS ૧ થી ૬ ઉદ્ગાન અને જૂથવાર સંસ્કૃત શ્લોક શ્રવણ'
  },
  hindi: {
    tabUdgaan: 'उद्गान श्रवण',
    homeAuthorTitle: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रणीत',
    homeHeroTitle: 'सत्सङ्गदीक्षा स्वाध्याय',
    homeHeroDesc: 'भगवान स्वामिनारायण प्रबोधित अक्षरपुरुषोत्तम उपासना एवं सदाचार के ३१५ संस्कृत श्लोकों का प्रामाणिक अध्ययन, पदच्छेद, मुखपाठ और वचनामृत-वातों संबंध।',
    homeStartShlokBtn: 'श्लोक अध्ययन प्रारंभ करें',
    homeMukhpathBtn: 'मुखपाठ साधना',
    homeUdgaanBtn: 'उद्गान श्रवण (Udgaan Audio)',
    homeTotalShlokasBadge: 'कुल श्लोक: ३१५',
    homeMemorizedBadge: 'कंठस्थ श्लोक',
    homeSavedBadge: 'सहेजे गए श्लोक',
    homeDailyVerseTitle: 'आज का प्रेरक श्लोक',
    homeExploreVerseBtn: 'विस्तृत अध्ययन',
    homeStudyModulesTitle: 'मुख्य अध्ययन विभाग',
    homeExploreBtn: 'प्रवेश करें',
    homeShlokAdhyayanTitle: 'श्लोक अध्ययन',
    homeShlokAdhyayanDesc: 'संस्कृत श्लोक, भावार्थ, पदच्छेद, व्याकरण एवं शास्त्रीय रहस्य',
    homeMukhpathTitle: 'मुखपाठ साधना',
    homeMukhpathDesc: 'श्लोक कंठस्थ करने की वैदिक विधि एवं श्रवण परीक्षा',
    homeChaptersTitle: 'प्रकरण अनुक्रमणिका',
    homeChaptersDesc: '१० प्रकरण: मंगलाचरण, उपासना, नित्यकर्म, आहारशुद्धि एवं ब्रह्मविद्या',
    homeCrossRefTitle: 'वचनामृत-वातों संबंध',
    homeCrossRefDesc: 'वचनामृत एवं स्वामीनी बातों के मूल संदर्भों सहित सिद्धांत प्रमाण',
    homeQuizTitle: 'स्वाध्याय परीक्षा',
    homeQuizDesc: 'श्लोकार्थ, रिक्त स्थान एवं सिद्धांत आधारित प्रश्नोत्तरी',
    homeBookmarksTitle: 'सहेजे गए श्लोक एवं नोट्स',
    homeBookmarksDesc: 'आपके प्रिय श्लोक और स्वाध्याय के व्यक्तिगत नोट्स',
    homeUdgaanTitle: 'उद्गान वैदिक गान',
    homeUdgaanDesc: 'BAPS १ से ६ उद्गान एवं समूहवार संस्कृत श्लोक श्रवण'
  },
  english: {
    tabUdgaan: 'Udgaan Audio',
    homeAuthorTitle: 'Authored by Pragat Brahmaswarup Mahant Swami Maharaj',
    homeHeroTitle: 'Satsang Diksha Swadhyay',
    homeHeroDesc: 'Authentic study, word-breakdown, memorization, and scriptural concordance of 315 Sanskrit verses expounding Akshar-Purushottam Upasana and righteous living.',
    homeStartShlokBtn: 'Start Shloka Study',
    homeMukhpathBtn: 'Mukhpath Sadhana',
    homeUdgaanBtn: 'Udgaan Chanting Audio',
    homeTotalShlokasBadge: 'Total Verses: 315',
    homeMemorizedBadge: 'Memorized',
    homeSavedBadge: 'Saved Verses',
    homeDailyVerseTitle: 'Verse of the Day',
    homeExploreVerseBtn: 'Explore Verse',
    homeStudyModulesTitle: 'Main Study Modules',
    homeExploreBtn: 'Explore',
    homeShlokAdhyayanTitle: 'Shloka Study',
    homeShlokAdhyayanDesc: 'Sanskrit verses, meanings, word breakdown, grammar, and insights',
    homeMukhpathTitle: 'Mukhpath Sadhana',
    homeMukhpathDesc: 'Step-by-step memorization, chanting practice, and audio self-testing',
    homeChaptersTitle: 'Chapter Index',
    homeChaptersDesc: '10 Chapters: Invocations, Upasana, Daily Rituals, Diet, and Brahmavidya',
    homeCrossRefTitle: 'Vachnamrut & Vato Concordance',
    homeCrossRefDesc: 'Scriptural cross-references with authentic Vachnamrut and Swamini Vato citations',
    homeQuizTitle: 'Swadhyay Quiz',
    homeQuizDesc: 'Interactive quizzes on verse meanings, missing words, and philosophical tenets',
    homeBookmarksTitle: 'Saved Verses & Notes',
    homeBookmarksDesc: 'Bookmarked verses and personal contemplative study reflections',
    homeUdgaanTitle: 'Udgaan Vedic Chanting',
    homeUdgaanDesc: 'BAPS 1 to 6 Udgaans & grouped verse Sanskrit audio recitation'
  },
  marathi: {
    tabUdgaan: 'उद्गान श्रवण',
    homeAuthorTitle: 'प्रगट ब्रह्मस्वरूप महंत स्वामी महाराज प्रणीत',
    homeHeroTitle: 'सत्सङ्गदीक्षा स्वाध्याय',
    homeHeroDesc: 'भगवान स्वामिनारायण प्रबोधित अक्षरपुरुषोत्तम उपासना व सदाचाराच्या ३१५ संस्कृत श्लोकांचे प्रामाणिक अध्ययन, पदच्छेद, मुखपाठ आणि वचनामृत-वातो संबंध.',
    homeStartShlokBtn: 'श्लोक अध्ययन सुरू करा',
    homeMukhpathBtn: 'मुखपाठ साधना',
    homeUdgaanBtn: 'उद्गान श्रवण (Udgaan Audio)',
    homeTotalShlokasBadge: 'एकूण श्लोक: ३१५',
    homeMemorizedBadge: 'पाठ झालेले श्लोक',
    homeSavedBadge: 'जतन केलेले श्लोक',
    homeDailyVerseTitle: 'आजचा प्रेरक श्लोक',
    homeExploreVerseBtn: 'सविस्तर अध्ययन',
    homeStudyModulesTitle: 'मुख्य अध्ययन विभाग',
    homeExploreBtn: 'प्रवेश करा',
    homeShlokAdhyayanTitle: 'श्लोक अध्ययन',
    homeShlokAdhyayanDesc: 'संस्कृत श्लोक, भावार्थ, पदच्छेद, व्याकरण व शास्त्रीय रहस्य',
    homeMukhpathTitle: 'मुखपाठ साधना',
    homeMukhpathDesc: 'श्लोक पाठांतर करण्याची वैदिक पद्धत व श्रवण परीक्षा',
    homeChaptersTitle: 'प्रकरण सूची',
    homeChaptersDesc: '१० प्रकरणे: मंगलाचरण, उपासना, नित्यकर्म, आहारशुद्धी व ब्रह्मविद्या',
    homeCrossRefTitle: 'वचनामृत-वातो संबंध',
    homeCrossRefDesc: 'वचनामृत व स्वामींच्या वातोच्या मूळ संदर्भांसह सिद्धांत प्रमाण',
    homeQuizTitle: 'स्वाध्याय परीक्षा',
    homeQuizDesc: 'श्लोकार्थ, रिकाम्या जागा व सिद्धांतावर आधारित प्रश्नमंजुषा',
    homeBookmarksTitle: 'जतन केलेले श्लोक व टिपा',
    homeBookmarksDesc: 'आपले आवडते श्लोक आणि मनन-चिंतनाच्या वैयक्तिक टिपा',
    homeUdgaanTitle: 'उद्गान वैदिक गान',
    homeUdgaanDesc: 'BAPS १ ते ६ उद्गान आणि गटवार संस्कृत श्लोक श्रवण'
  },
  bengali: {
    tabUdgaan: 'উদ্গান শ্রবণ',
    homeAuthorTitle: 'প্রকট ব্রহ্মস্বরূপ মহন্ত স্বামী মহারাজ প্রণীত',
    homeHeroTitle: 'সত্সঙ্গদীক্ষা স্বাধ্যায়',
    homeHeroDesc: 'ভগবান স্বামীনারায়ণ প্রবোধিত অক্ষরপুরুষোত্তম উপাসনা ও সদাচারের ৩১৫ সংস্কৃত শ্লোকের প্রামাণিক অধ্যয়ন, পদচ্ছেদ, মুখপাঠ ও শাস্ত্র সম্পর্ক।',
    homeStartShlokBtn: 'শ্লোক অধ্যয়ন শুরু করুন',
    homeMukhpathBtn: 'মুখপাঠ সাধনা',
    homeUdgaanBtn: 'উদ্গান শ্রবণ (Udgaan Audio)',
    homeTotalShlokasBadge: 'মোট শ্লোক: ৩১৫',
    homeMemorizedBadge: 'মুখস্থ শ্লোক',
    homeSavedBadge: 'সংরক্ষিত শ্লোক',
    homeDailyVerseTitle: 'আজকের শ্লোক',
    homeExploreVerseBtn: 'বিস্তারিত অধ্যয়ন',
    homeStudyModulesTitle: 'প্রধান অধ্যয়ন বিভাগ',
    homeExploreBtn: 'প্রবেশ করুন',
    homeShlokAdhyayanTitle: 'শ্লোক অধ্যয়ন',
    homeShlokAdhyayanDesc: 'সংস্কৃত শ্লোক, ভাবার্থ, পদচ্ছেদ, ব্যাকরণ ও শাস্ত্রীয় রহস্য',
    homeMukhpathTitle: 'মুখপাঠ সাধনা',
    homeMukhpathDesc: 'শ্লোক মুখস্থ করার বৈদিক পদ্ধতি ও শ্রবণ পরীক্ষা',
    homeChaptersTitle: 'অধ্যায় সূচি',
    homeChaptersDesc: '১০টি অধ্যায়: মঙ্গলাচরণ, উপাসনা, নিত্যকর্ম, আহারশুদ্ধি ও ব্রহ্মবিদ্যা',
    homeCrossRefTitle: 'বচনামৃত-বাথ সম্পর্ক',
    homeCrossRefDesc: 'বচনামৃত ও স্বামীনী বাতোর মূল তথ্য সহ সিদ্ধান্ত প্রমাণ',
    homeQuizTitle: 'স্বাধ্যায় পরীক্ষা',
    homeQuizDesc: 'শ্লোকার্থ, শূন্যস্থান পূরণ ও সিদ্ধান্ত ভিত্তিক কুইজ',
    homeBookmarksTitle: 'সংরক্ষিত শ্লোক ও নোট',
    homeBookmarksDesc: 'পছন্দের শ্লোক ও ব্যক্তিগত অধ্যয়নের নোট',
    homeUdgaanTitle: 'উদ্গান বৈদিক গান',
    homeUdgaanDesc: 'BAPS ১ থেকে ৬ উদ্গান ও দলবদ্ধ সংস্কৃত শ্লোক শ্রবণ'
  },
  tamil: {
    tabUdgaan: 'உத்கானம் ஆடியோ',
    homeAuthorTitle: 'பிரகட் பிரம்மஸ்வரூப் மஹந்த் சுவாமி மகாராஜ் இயற்றியது',
    homeHeroTitle: 'சத்சங்க தீக்ஷா ஸ்வாத்யாயம்',
    homeHeroDesc: 'பகவான் சுவாமிநாராயணனின் அக்ஷரபுருஷோத்தம உபாசனை மற்றும் சதாசாரத்தின் 315 சமஸ்கிருத ஸ்லோகங்களின் முழுமையான ஆய்வு.',
    homeStartShlokBtn: 'ஸ்லோக ஆய்வைத் தொடங்குங்கள்',
    homeMukhpathBtn: 'முகபாடம் சாதனை',
    homeUdgaanBtn: 'உத்கானம் ஆடியோ (Udgaan Audio)',
    homeTotalShlokasBadge: 'மொத்த ஸ்லோகங்கள்: 315',
    homeMemorizedBadge: 'மனனம் செய்யப்பட்டது',
    homeSavedBadge: 'சேமிக்கப்பட்ட ஸ்லோகங்கள்',
    homeDailyVerseTitle: 'இன்றைய ஸ்லோகம்',
    homeExploreVerseBtn: 'விரிவான ஆய்வு',
    homeStudyModulesTitle: 'முக்கிய ஆய்வுப் பிரிவுகள்',
    homeExploreBtn: 'உள்நுழையவும்',
    homeShlokAdhyayanTitle: 'ஸ்லோக ஆய்வு',
    homeShlokAdhyayanDesc: 'சமஸ்கிருத ஸ்லோகம், பொருள், பதச்சேதம், இலக்கணம் மற்றும் ரகசியம்',
    homeMukhpathTitle: 'முகபாடம் சாதனை',
    homeMukhpathDesc: 'ஸ்லோகங்களை மனனம் செய்யும் முறை மற்றும் கேட்டல் தேர்வு',
    homeChaptersTitle: 'அத்தியாயங்கள் பட்டியல்',
    homeChaptersDesc: '10 அத்தியாயங்கள்: மங்களாசரணம், உபாசனை, நித்யகர்மா, பிரம்மவித்யா',
    homeCrossRefTitle: 'வசனாமிர்தம் குறிப்புகள்',
    homeCrossRefDesc: 'வசனாமிர்தம் மற்றும் சுவாமினி வாதோ ஆதாரங்கள்',
    homeQuizTitle: 'ஸ்வாத்யாய வினாடி வினா',
    homeQuizDesc: 'ஸ்லோக அர்த்தங்கள் மற்றும் கோட்பாடு அடிப்படையிலான வினாடி வினா',
    homeBookmarksTitle: 'சேமிக்கப்பட்டவை & குறிப்புகள்',
    homeBookmarksDesc: 'விருப்பமான ஸ்லோகங்கள் மற்றும் தனிப்பட்ட குறிப்புகள்',
    homeUdgaanTitle: 'உத்கானம் வேத பாடல்',
    homeUdgaanDesc: 'BAPS 1 முதல் 6 உத்கானம் மற்றும் குழு சமஸ்கிருத ஆடியோ'
  },
  telugu: {
    tabUdgaan: 'ఉద్గాన శ్రవణం',
    homeAuthorTitle: 'ప్రకట బ్రహ్మస్వరూప మహంత్ స్వామి మహారాజ్ ప్రణీతం',
    homeHeroTitle: 'సత్సంగ దీక్షా స్వాధ్యాయం',
    homeHeroDesc: 'భగవాన్ స్వామినారాయణ ప్రబోధిత అక్షరపురుషోత్తమ ఉపాసన మరియు సదాచారానికి చెందిన 315 సంస్కృత శ్లోకాల ప్రామాణిక అధ్యయనం.',
    homeStartShlokBtn: 'శ్లోక అధ్యయనం ప్రారంభించండి',
    homeMukhpathBtn: 'ముఖపాఠ సాధన',
    homeUdgaanBtn: 'ఉద్గాన శ్రవణం (Udgaan Audio)',
    homeTotalShlokasBadge: 'మొత్తం శ్లోకాలు: 315',
    homeMemorizedBadge: 'కంఠస్థం చేసినవి',
    homeSavedBadge: 'భద్రపరచిన శ్లోకాలు',
    homeDailyVerseTitle: 'నేటి ప్రేరణాత్మక శ్లోకం',
    homeExploreVerseBtn: 'విస్తృత అధ్యయనం',
    homeStudyModulesTitle: 'ప్రధాన అధ్యయన విభాగాలు',
    homeExploreBtn: 'ప్రవేశించండి',
    homeShlokAdhyayanTitle: 'శ్లోక అధ్యయనం',
    homeShlokAdhyayanDesc: 'సంస్కృత శ్లోకం, భావార్థం, పదచ్ఛేదం, వ్యాకరణం మరియు రహస్యం',
    homeMukhpathTitle: 'ముఖపాఠ సాధన',
    homeMukhpathDesc: 'శ్లోకాలను కంఠస్థం చేసే వైదిక పద్ధతి మరియు శ్రవణ పరీక్ష',
    homeChaptersTitle: 'ప్రకరణాల జాబితా',
    homeChaptersDesc: '10 ప్రకరణాలు: మంగళాచరణం, ఉపాసన, నిత్యకర్మ, ఆహారశుద్ధి, బ్రహ్మవిద్య',
    homeCrossRefTitle: 'వచనామృతం సంబంధం',
    homeCrossRefDesc: 'వచనామృతం మరియు స్వామినీ వాతో మూల ఆధారాలు',
    homeQuizTitle: 'స్వాధ్యాయ క్విజ్',
    homeQuizDesc: 'శ్లోకార్థాలు మరియు సిద్ధాంత ఆధారిత క్విజ్',
    homeBookmarksTitle: 'భద్రపరచిన శ్లోకాలు & నోట్స్',
    homeBookmarksDesc: 'మీ ఇష్టమైన శ్లోకాలు మరియు వ్యక్తిగత అధ్యయన నోట్స్',
    homeUdgaanTitle: 'ఉద్గాన వైదిక గానం',
    homeUdgaanDesc: 'BAPS 1 నుండి 6 ఉద్గాన మరియు సమూహ సంస్కృత ఆడియో'
  },
  kannada: {
    tabUdgaan: 'ಉದ್ಗಾನ ಶ್ರವಣ',
    homeAuthorTitle: 'ಪ್ರಕಟ ಬ್ರಹ್ಮಸ್ವರೂಪ ಮಹಂತ ಸ್ವಾಮಿ ಮಹಾರಾಜ ಪ್ರಣೀತ',
    homeHeroTitle: 'ಸತ್ಸಂಗ ದೀಕ್ಷಾ ಸ್ವಾಧ್ಯಾಯ',
    homeHeroDesc: 'ಭಗವಾನ್ ಸ್ವಾಮಿನಾರಾಯಣ ಪ್ರಬೋಧಿತ ಅಕ್ಷರಪುರುಷೋತ್ತಮ ಉಪಾಸನೆ ಮತ್ತು ಸದಾಚಾರದ 315 ಸಂಸ್ಕೃತ ಶ್ಲೋಕಗಳ ಪ್ರಾಮಾಣಿಕ ಅಧ್ಯಯನ.',
    homeStartShlokBtn: 'ಶ್ಲೋಕ ಅಧ್ಯಯನ ಪ್ರಾರಂಭಿಸಿ',
    homeMukhpathBtn: 'ಮುಖಪಾಠ ಸಾಧನೆ',
    homeUdgaanBtn: 'ಉದ್ಗಾನ ಶ್ರವಣ (Udgaan Audio)',
    homeTotalShlokasBadge: 'ಒಟ್ಟು ಶ್ಲೋಕಗಳು: 315',
    homeMemorizedBadge: 'ಕಂಠಸ್ಥ ಶ್ಲೋಕಗಳು',
    homeSavedBadge: 'ಉಳಿಸಿದ ಶ್ಲೋಕಗಳು',
    homeDailyVerseTitle: 'ಇಂದಿನ ಪ್ರೇರಣಾದಾಯಕ ಶ್ಲೋಕ',
    homeExploreVerseBtn: 'ವಿವರವಾದ ಅಧ್ಯಯನ',
    homeStudyModulesTitle: 'ಮುಖ್ಯ ಅಧ್ಯಯನ ವಿಭಾಗಗಳು',
    homeExploreBtn: 'ಪ್ರವೇಶಿಸಿ',
    homeShlokAdhyayanTitle: 'ಶ್ಲೋಕ ಅಧ್ಯಯನ',
    homeShlokAdhyayanDesc: 'ಸಂಸ್ಕೃತ ಶ್ಲೋಕ, ಭಾವಾರ್ಥ, ಪದಚ್ಛೇದ, ವ್ಯಾಕರಣ ಮತ್ತು ರಹಸ್ಯ',
    homeMukhpathTitle: 'ಮುಖಪಾಠ ಸಾಧನೆ',
    homeMukhpathDesc: 'ಶ್ಲೋಕ ಕಂಠಸ್ಥ ಮಾಡುವ ವೈದಿಕ ವಿಧಾನ ಮತ್ತು ಶ್ರವಣ ಪರೀಕ್ಷೆ',
    homeChaptersTitle: 'ಪ್ರಕರಣಗಳ ಪಟ್ಟಿ',
    homeChaptersDesc: '10 ಪ್ರಕರಣಗಳು: ಮಂಗಳಾಚರಣ, ಉಪಾಸನೆ, ನಿತ್ಯಕರ್ಮ, ಬ್ರಹ್ಮವಿದ್ಯೆ',
    homeCrossRefTitle: 'ವಚನಾಮೃತ ಸಂಬಂಧ',
    homeCrossRefDesc: 'ವಚನಾಮೃತ ಮತ್ತು ಸ್ವಾಮಿನೀ ವಾತುಗಳ ಮೂಲ ಆಧಾರಗಳು',
    homeQuizTitle: 'ಸ್ವಾಧ್ಯಾಯ ರಸಪ್ರಶ್ನೆ',
    homeQuizDesc: 'ಶ್ಲೋಕಾರ್ಥ ಮತ್ತು ಸಿದ್ಧಾಂತ ಆಧಾರಿತ ರಸಪ್ರಶ್ನೆ',
    homeBookmarksTitle: 'ಉಳಿಸಿದ ಶ್ಲೋಕಗಳು & ಟಿಪ್ಪಣಿಗಳು',
    homeBookmarksDesc: 'ಮೆಚ್ಚಿನ ಶ್ಲೋಕಗಳು ಮತ್ತು ವೈಯಕ್ತಿಕ ಟಿಪ್ಪಣಿಗಳು',
    homeUdgaanTitle: 'ಉದ್ಗಾನ ವೈದಿಕ ಗಾನ',
    homeUdgaanDesc: 'BAPS 1 ರಿಂದ 6 ಉದ್ಗಾನ ಮತ್ತು ಗುಂಪು ಸಂಸ್ಕೃತ ಆಡಿಯೋ'
  },
  punjabi: {
    tabUdgaan: 'ਉਦਗਾਨ ਸ਼੍ਰਵਣ',
    homeAuthorTitle: 'ਪ੍ਰਗਟ ਬ੍ਰਹਮਸਵਰੂਪ ਮਹੰਤ ਸਵਾਮੀ ਮਹਾਰਾਜ ਪ੍ਰਣੀਤ',
    homeHeroTitle: 'ਸਤਸੰਗ ਦੀਕਸ਼ਾ ਸਵਾਧਿਆਏ',
    homeHeroDesc: 'ਭਗਵਾਨ ਸਵਾਮੀਨਾਰਾਇਣ ਪ੍ਰਬੋਧਿਤ ਅਕਸ਼ਰਪੁਰੁਸ਼ੋਤਮ ਉਪਾਸਨਾ ਅਤੇ ਸਦਾਚਾਰ ਦੇ 315 ਸੰਸਕ੍ਰਿਤ ਸ਼ਲੋਕਾਂ ਦਾ ਅਧਿਐਨ।',
    homeStartShlokBtn: 'ਸ਼ਲੋਕ ਅਧਿਐਨ ਸ਼ੁਰੂ ਕਰੋ',
    homeMukhpathBtn: 'ਮੁਖਪਾਠ ਸਾਧਨਾ',
    homeUdgaanBtn: 'ਉਦਗਾਨ ਸ਼੍ਰਵਣ (Udgaan Audio)',
    homeTotalShlokasBadge: 'ਕੁੱਲ ਸ਼ਲੋਕ: 315',
    homeMemorizedBadge: 'ਕੰਠਸਥ ਸ਼ਲੋਕ',
    homeSavedBadge: 'ਸੰਭਾਲੇ ਗਏ ਸ਼ਲੋਕ',
    homeDailyVerseTitle: 'ਅੱਜ ਦਾ ਪ੍ਰੇਰਕ ਸ਼ਲੋਕ',
    homeExploreVerseBtn: 'ਵਿਸਤ੍ਰਿਤ ਅਧਿਐਨ',
    homeStudyModulesTitle: 'ਮੁੱਖ ਅਧਿਐਨ ਵਿਭਾਗ',
    homeExploreBtn: 'ਪ੍ਰਵੇਸ਼ ਕਰੋ',
    homeShlokAdhyayanTitle: 'ਸ਼ਲੋਕ ਅਧਿਐਨ',
    homeShlokAdhyayanDesc: 'ਸੰਸਕ੍ਰਿਤ ਸ਼ਲੋਕ, ਭਾਵਾਰਥ, ਪਦੱਛੇਦ, ਵਿਆਕਰਣ ਅਤੇ ਰਹੱਸ',
    homeMukhpathTitle: 'ਮੁਖਪਾਠ ਸਾਧਨਾ',
    homeMukhpathDesc: 'ਸ਼ਲੋਕ ਕੰਠਸਥ ਕਰਨ ਦੀ ਵਿਧੀ ਅਤੇ ਸੁਣਨ ਪ੍ਰੀਖਿਆ',
    homeChaptersTitle: 'ਪ੍ਰਕਰਣ ਸੂਚੀ',
    homeChaptersDesc: '10 ਪ੍ਰਕਰਣ: ਮੰਗਲਾਚਰਨ, ਉਪਾਸਨਾ, ਨਿਤਨੇਮ, ਬ੍ਰਹਮਵਿਦਿਆ',
    homeCrossRefTitle: 'ਵਚਨਾਮ੍ਰਿਤ ਸੰਬੰਧ',
    homeCrossRefDesc: 'ਵਚਨਾਮ੍ਰਿਤ ਅਤੇ ਸਵਾਮੀਨੀ ਵਾਤੋ ਦੇ ਪ੍ਰਮਾਣ',
    homeQuizTitle: 'ਸਵਾਧਿਆਏ ਕੁਇਜ਼',
    homeQuizDesc: 'ਸ਼ਲੋਕਾਰਥ ਅਤੇ ਸਿਧਾਂਤ ਅਧਾਰਤ ਕੁਇਜ਼',
    homeBookmarksTitle: 'ਸੰਭਾਲੇ ਗਏ ਸ਼ਲੋਕ ਅਤੇ ਨੋਟਸ',
    homeBookmarksDesc: 'ਮਨਪਸੰਦ ਸ਼ਲੋਕ ਅਤੇ ਨਿੱਜੀ ਅਧਿਐਨ ਨੋਟਸ',
    homeUdgaanTitle: 'ਉਦਗਾਨ ਵੈਦਿਕ ਗਾਇਨ',
    homeUdgaanDesc: 'BAPS 1 ਤੋਂ 6 ਉਦਗਾਨ ਅਤੇ ਸਮੂਹ ਸੰਸਕ੍ਰਿਤ ਆਡੀਓ'
  },
  spanish: {
    tabUdgaan: 'Audio Udgaan',
    homeAuthorTitle: 'Escrito por Pragat Brahmaswarup Mahant Swami Maharaj',
    homeHeroTitle: 'Satsang Diksha Swadhyay',
    homeHeroDesc: 'Estudio auténtico, desglose de palabras, memorización y concordancia de 315 versos sánscritos sobre Akshar-Purushottam Upasana y rectitud.',
    homeStartShlokBtn: 'Iniciar Estudio de Versos',
    homeMukhpathBtn: 'Sadhana de Memorización',
    homeUdgaanBtn: 'Canto Sagrado Udgaan',
    homeTotalShlokasBadge: 'Total de Versos: 315',
    homeMemorizedBadge: 'Memorizados',
    homeSavedBadge: 'Versos Guardados',
    homeDailyVerseTitle: 'Verso del Día',
    homeExploreVerseBtn: 'Explorar Verso',
    homeStudyModulesTitle: 'Módulos Principales de Estudio',
    homeExploreBtn: 'Explorar',
    homeShlokAdhyayanTitle: 'Estudio de Shlokas',
    homeShlokAdhyayanDesc: 'Versos sánscritos, significados, gramática y secretos espirituales',
    homeMukhpathTitle: 'Mukhpath Sadhana',
    homeMukhpathDesc: 'Método védico para memorizar versos y pruebas de audio',
    homeChaptersTitle: 'Índice de Capítulos',
    homeChaptersDesc: '10 Capítulos: Invocaciones, Upasana, Rituales diarios y Brahmavidya',
    homeCrossRefTitle: 'Concordancia con Vachnamrut',
    homeCrossRefDesc: 'Referencias cruzadas con las escrituras sagradas Vachnamrut y Swamini Vato',
    homeQuizTitle: 'Cuestionario Swadhyay',
    homeQuizDesc: 'Preguntas interactivas sobre significados y filosofía',
    homeBookmarksTitle: 'Versos Guardados y Notas',
    homeBookmarksDesc: 'Tus versos preferidos y reflexiones personales',
    homeUdgaanTitle: 'Canto Védico Udgaan',
    homeUdgaanDesc: 'BAPS 1 al 6 Udgaan y audio sánscrito por grupos'
  },
  french: {
    tabUdgaan: 'Audio Udgaan',
    homeAuthorTitle: 'Rédigé par Pragat Brahmaswarup Mahant Swami Maharaj',
    homeHeroTitle: 'Satsang Diksha Swadhyay',
    homeHeroDesc: 'Étude authentique, analyse mot à mot, mémorisation et concordance de 315 versets sanskrits sur Akshar-Purushottam Upasana et la droiture.',
    homeStartShlokBtn: 'Commencer l’Étude des Versets',
    homeMukhpathBtn: 'Sadhana de Mémorisation',
    homeUdgaanBtn: 'Chant Sacré Udgaan',
    homeTotalShlokasBadge: 'Total des Versets: 315',
    homeMemorizedBadge: 'Mémorisés',
    homeSavedBadge: 'Versets Enregistrés',
    homeDailyVerseTitle: 'Verset du Jour',
    homeExploreVerseBtn: 'Explorer le Verset',
    homeStudyModulesTitle: 'Modules Principaux d’Étude',
    homeExploreBtn: 'Explorer',
    homeShlokAdhyayanTitle: 'Étude des Shlokas',
    homeShlokAdhyayanDesc: 'Versets sanskrits, significations, grammaire et secrets spirituels',
    homeMukhpathTitle: 'Mukhpath Sadhana',
    homeMukhpathDesc: 'Méthode védique pour mémoriser les versets et auto-évaluation audio',
    homeChaptersTitle: 'Index des Chapitres',
    homeChaptersDesc: '10 Chapitres: Invocations, Upasana, Rituels quotidiens et Brahmavidya',
    homeCrossRefTitle: 'Concordance Vachnamrut',
    homeCrossRefDesc: 'Références croisées avec les écritures Vachnamrut et Swamini Vato',
    homeQuizTitle: 'Quiz Swadhyay',
    homeQuizDesc: 'Quiz interactif sur la signification des versets et la philosophie',
    homeBookmarksTitle: 'Favoris et Notes',
    homeBookmarksDesc: 'Vos versets favoris et réflexions personnelles d’étude',
    homeUdgaanTitle: 'Chant Védique Udgaan',
    homeUdgaanDesc: 'BAPS 1 à 6 Udgaans et audio sanskrit par groupes'
  },
  german: {
    tabUdgaan: 'Udgaan Audio',
    homeAuthorTitle: 'Verfasst von Pragat Brahmaswarup Mahant Swami Maharaj',
    homeHeroTitle: 'Satsang Diksha Swadhyay',
    homeHeroDesc: 'Authentisches Studium, Wort-für-Wort-Analyse, Auswendiglernen und Schriftkonkordanz von 315 Sanskrit-Versen über Akshar-Purushottam Upasana.',
    homeStartShlokBtn: 'Versstudium Starten',
    homeMukhpathBtn: 'Mukhpath Sadhana',
    homeUdgaanBtn: 'Udgaan Gesang Audio',
    homeTotalShlokasBadge: 'Gesamtverse: 315',
    homeMemorizedBadge: 'Auswendig gelernt',
    homeSavedBadge: 'Gespeicherte Verse',
    homeDailyVerseTitle: 'Vers des Tages',
    homeExploreVerseBtn: 'Vers Erkunden',
    homeStudyModulesTitle: 'Hauptstudienmodule',
    homeExploreBtn: 'Erkunden',
    homeShlokAdhyayanTitle: 'Shloka Studium',
    homeShlokAdhyayanDesc: 'Sanskrit-Verse, Bedeutungen, Grammatik und spirituelle Geheimnisse',
    homeMukhpathTitle: 'Mukhpath Sadhana',
    homeMukhpathDesc: 'Vedische Methode zum Auswendiglernen und Audio-Selbsttest',
    homeChaptersTitle: 'Kapitelverzeichnis',
    homeChaptersDesc: '10 Kapitel: Anrufung, Upasana, tägliche Rituale und Brahmavidya',
    homeCrossRefTitle: 'Vachnamrut Konkordanz',
    homeCrossRefDesc: 'Querverweise mit den Schriften Vachnamrut und Swamini Vato',
    homeQuizTitle: 'Swadhyay Quiz',
    homeQuizDesc: 'Interaktives Quiz zu Versbedeutungen und Philosophie',
    homeBookmarksTitle: 'Gespeicherte Verse & Notizen',
    homeBookmarksDesc: 'Ihre Lieblingsverse und persönliche Studiennotizen',
    homeUdgaanTitle: 'Udgaan Vedischer Gesang',
    homeUdgaanDesc: 'BAPS 1 bis 6 Udgaans & gruppenweiser Sanskrit-Audio'
  }
};

// Insert translations into each language block in I18N_TRANSLATIONS
for (const [langKey, trans] of Object.entries(langTranslations)) {
  const regex = new RegExp(`(${langKey}:\\s*\\{[\\s\\S]*?tabApk:[^,]+,)`, 'm');
  if (regex.test(content)) {
    const extraFields = `
    tabUdgaan: ${JSON.stringify(trans.tabUdgaan)},
    homeAuthorTitle: ${JSON.stringify(trans.homeAuthorTitle)},
    homeHeroTitle: ${JSON.stringify(trans.homeHeroTitle)},
    homeHeroDesc: ${JSON.stringify(trans.homeHeroDesc)},
    homeStartShlokBtn: ${JSON.stringify(trans.homeStartShlokBtn)},
    homeMukhpathBtn: ${JSON.stringify(trans.homeMukhpathBtn)},
    homeUdgaanBtn: ${JSON.stringify(trans.homeUdgaanBtn)},
    homeTotalShlokasBadge: ${JSON.stringify(trans.homeTotalShlokasBadge)},
    homeMemorizedBadge: ${JSON.stringify(trans.homeMemorizedBadge)},
    homeSavedBadge: ${JSON.stringify(trans.homeSavedBadge)},
    homeDailyVerseTitle: ${JSON.stringify(trans.homeDailyVerseTitle)},
    homeExploreVerseBtn: ${JSON.stringify(trans.homeExploreVerseBtn)},
    homeStudyModulesTitle: ${JSON.stringify(trans.homeStudyModulesTitle)},
    homeExploreBtn: ${JSON.stringify(trans.homeExploreBtn)},
    homeShlokAdhyayanTitle: ${JSON.stringify(trans.homeShlokAdhyayanTitle)},
    homeShlokAdhyayanDesc: ${JSON.stringify(trans.homeShlokAdhyayanDesc)},
    homeMukhpathTitle: ${JSON.stringify(trans.homeMukhpathTitle)},
    homeMukhpathDesc: ${JSON.stringify(trans.homeMukhpathDesc)},
    homeChaptersTitle: ${JSON.stringify(trans.homeChaptersTitle)},
    homeChaptersDesc: ${JSON.stringify(trans.homeChaptersDesc)},
    homeCrossRefTitle: ${JSON.stringify(trans.homeCrossRefTitle)},
    homeCrossRefDesc: ${JSON.stringify(trans.homeCrossRefDesc)},
    homeQuizTitle: ${JSON.stringify(trans.homeQuizTitle)},
    homeQuizDesc: ${JSON.stringify(trans.homeQuizDesc)},
    homeBookmarksTitle: ${JSON.stringify(trans.homeBookmarksTitle)},
    homeBookmarksDesc: ${JSON.stringify(trans.homeBookmarksDesc)},
    homeUdgaanTitle: ${JSON.stringify(trans.homeUdgaanTitle)},
    homeUdgaanDesc: ${JSON.stringify(trans.homeUdgaanDesc)},`;
    
    content = content.replace(regex, `$1${extraFields}`);
  }
}

fs.writeFileSync(i18nFile, content, 'utf8');
console.log('Successfully updated src/utils/i18n.ts with all localized home and udgaan strings!');
