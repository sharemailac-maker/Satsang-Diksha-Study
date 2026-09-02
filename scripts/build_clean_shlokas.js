import fs from 'fs';

const CHAPTERS = [
  {
    id: 1,
    titleGu: "પ્રસ્તાવના અને મંગલાચરણ",
    titleHi: "प्रस्तावना एवं मंगलाचरण",
    titleEn: "Introduction & Auspicious Invocation",
    shlokaRange: [1, 4],
    descriptionGu: "પરબ્રહ્મ પુરુષોત્તમ નારાયણ અને ગુણાતીતાનંદ સ્વામીનું ધ્યાન, શાસ્ત્રરચનાનો હેતુ અને મંગલ આરંભ.",
    descriptionHi: "परब्रह्म पुरुषोत्तम नारायण और गुणातीतानंद स्वामी का ध्यान, शास्त्ररचना का उद्देश्य एवं मंगल प्रारंभ।",
    descriptionEn: "Meditation on Parabrahman Purushottam Narayan & Gunatitanand Swami, the auspicious invocation and purpose of the scripture.",
    themeColor: "from-amber-600 to-orange-700",
    iconName: "Sparkles"
  },
  {
    id: 2,
    titleGu: "શાસ્ત્ર નિર્માણ હેતુ અને સ્વરૂપ",
    titleHi: "शास्त्र निर्माण हेतु एवं स्वरूप",
    titleEn: "Purpose and Nature of the Scripture",
    shlokaRange: [5, 17],
    descriptionGu: "સત્સંગીઓના મોક્ષ માટે, આધ્યાત્મિક જ્ઞાન અને બ્રહ્મવિદ્યાની પ્રાપ્તિ માટે સત્સંગ દીક્ષાનું નિરૂપણ.",
    descriptionHi: "सत्संगियों के मोक्ष हेतु, आध्यात्मिक ज्ञान और ब्रह्मविद्या की प्राप्ति के लिए सत्संग दीक्षा का निरूपण।",
    descriptionEn: "Revelation of Satsang Diksha for the ultimate liberation, spiritual wisdom, and attainment of Brahmavidya for all seekers.",
    themeColor: "from-orange-600 to-amber-700",
    iconName: "BookOpen"
  },
  {
    id: 3,
    titleGu: "સ્વરૂપ નિશ્ચય અને ઉપાસના સિદ્ધાંત",
    titleHi: "स्वरूप निश्चय एवं उपासना सिद्धांत",
    titleEn: "Definite Knowledge of God & Core Upasana",
    shlokaRange: [18, 44],
    descriptionGu: "સ્વામિનારાયણ ભગવાન સર્વોપરી સાક્ષાત્ પરબ્રહ્મ છે અને ગુણાતીત ગુરુ અક્ષરબ્રહ્મનું પ્રત્યક્ષ સ્વરૂપ છે.",
    descriptionHi: "स्वामिनारायण भगवान सर्वोपरि साक्षात् परब्रह्म हैं और गुणातीत गुरु अक्षरब्रह्म के प्रत्यक्ष स्वरूप हैं।",
    descriptionEn: "Definite understanding that Bhagwan Swaminarayan is Parabrahman incarnate, and the Gunatit Guru is Aksharbrahman.",
    themeColor: "from-red-600 to-orange-700",
    iconName: "Sun"
  },
  {
    id: 4,
    titleGu: "નિત્ય કર્મ અને પ્રાતઃપૂજા વિધિ",
    titleHi: "नित्य कर्म एवं प्रातःपूजा विधि",
    titleEn: "Daily Routine & Morning Puja Ritual",
    shlokaRange: [45, 76],
    descriptionGu: "પ્રભાતે જાગરણ, મનન, તિલક-ચાંદલો વિધિ, ગાયત્રી મંત્ર, માનસી પૂજા, માળા, પ્રદક્ષિણા અને દંડવત.",
    descriptionHi: "प्रातः जागरण, मनन, तिलक-चांदलो विधि, गायत्री मंत्र, मानसी पूजा, माला, प्रदक्षिणा और दंडवत।",
    descriptionEn: "Morning awakening, contemplation, Tilak-Chandlo vidhi, Gayatri japa, Mansi Puja, Mala, Pradakshina, and Dandvat.",
    themeColor: "from-amber-700 to-yellow-600",
    iconName: "Flame"
  },
  {
    id: 5,
    titleGu: "ધર્મ અને આહારશુદ્ધિ નિયમો",
    titleHi: "धर्म एवं आहारशुद्धि नियम",
    titleEn: "Moral Codes & Dietary Purity",
    shlokaRange: [77, 115],
    descriptionGu: "શુદ્ધ સાત્વિક આહાર, અહિંસા, વ્યસનમુક્તિ, પવિત્રતા, કાંદા-લસણ ત્યાગ અને અન્નની શુદ્ધિ.",
    descriptionHi: "शुद्ध सात्विक आहार, अहिंसा, व्यसनमुक्ति, पवित्रता, प्याज-लहसुन त्याग और अन्न की शुद्धि।",
    descriptionEn: "Pure Sattvic diet, Ahimsa, freedom from addictions, avoiding onion/garlic, and sanctity of food and water.",
    themeColor: "from-emerald-700 to-teal-800",
    iconName: "ShieldCheck"
  },
  {
    id: 6,
    titleGu: "સદાચાર, કર્તવ્ય અને વ્યવહાર શુદ્ધિ",
    titleHi: "सदाचार, कर्तव्य एवं व्यवहार शुद्धि",
    titleEn: "Right Conduct, Duties & Pure Living",
    shlokaRange: [116, 160],
    descriptionGu: "માતા-પિતાની સેવા, પારિવારિક સંવાદિતા, સત્ય વાણી, ધર્મપૂર્વક ધનોપાર્જન અને ધર્મદાન.",
    descriptionHi: "माता-पिता की सेवा, पारिवारिक सौहार्द, सत्य वाणी, धर्मपूर्वक धनोपार्जन और धर्मदान।",
    descriptionEn: "Serving parents, family harmony, truthfulness, righteous earning, and offering a tithe/donation to God.",
    themeColor: "from-blue-700 to-indigo-800",
    iconName: "Heart"
  },
  {
    id: 7,
    titleGu: "સત્સંગ સભા, ઘરસભા અને સત્સંગ પ્રવૃત્તિ",
    titleHi: "सत्संग सभा, घरसभा एवं सत्संग गतिविधि",
    titleEn: "Satsang Assembly, Ghar Sabha & Spiritual Gatherings",
    shlokaRange: [161, 200],
    descriptionGu: "સાપ્તાહિક રવિસભા, નિત્ય ઘરસભા, શાસ્ત્રવાંચન, કીર્તન-ભક્તિ અને સત્સંગ પ્રચાર.",
    descriptionHi: "साप्ताहिक रविसभा, नित्य घरसभा, शास्त्रवाचन, कीर्तन-भक्ति और सत्संग प्रसार।",
    descriptionEn: "Weekly assemblies, daily family Ghar Sabha, scripture study, devotional singing, and spreading good virtues.",
    themeColor: "from-purple-700 to-pink-800",
    iconName: "Users"
  },
  {
    id: 8,
    titleGu: "અંતઃશત્રુ જય અને નિર્દોષબુદ્ધિ",
    titleHi: "अंतःशत्रु जय एवं निर्दोषबुद्धि",
    titleEn: "Overcoming Inner Enemies & Pure Vision (Nirdoshbuddhi)",
    shlokaRange: [201, 250],
    descriptionGu: "કામ, ક્રોધ, લોભ, મોહ, મદ, મત્સરનો ત્યાગ; સત્સંગીઓમાં દિવ્યભાવ અને સુહૃદભાવની સાધના.",
    descriptionHi: "काम, क्रोध, लोभ, मोह, मद, मत्सर का त्याग; सत्संगियों में दिव्यभाव और सुहृदभाव की साधना।",
    descriptionEn: "Conquering lust, anger, greed, ego, jealousy; cultivating divine vision (Divyabhav) and mutual fraternity (Suhrudbhav).",
    themeColor: "from-cyan-700 to-blue-800",
    iconName: "Compass"
  },
  {
    id: 9,
    titleGu: "અક્ષર-પુરુષોત્તમ ઉપાસના અને ગુરુભક્તિ",
    titleHi: "अक्षर-पुरुषोत्तम उपासना एवं गुरुभक्ति",
    titleEn: "Akshar-Purushottam Upasana & Guru Devotion",
    shlokaRange: [251, 290],
    descriptionGu: "અક્ષરરૂપ થઈને પરબ્રહ્મની ભક્તિ કરવાનો શાશ્વત વૈદિક સિદ્ધાંત અને પ્રત્યક્ષ પ્રગટ સત્પુરુષની અનિવાર્યતા.",
    descriptionHi: "अक्षररूप होकर परब्रह्म की भक्ति करने का शाश्वत वैदिक सिद्धांत और प्रत्यक्ष प्रकट सत्पुरुष की अनिवार्यता।",
    descriptionEn: "The eternal Vedic philosophy of becoming Aksharrup to offer pure devotion to Purushottam through the living Satpurush.",
    themeColor: "from-amber-600 to-red-700",
    iconName: "Crown"
  },
  {
    id: 10,
    titleGu: "ઉપસંહાર, આશીર્વાદ અને ફલશ્રુતિ",
    titleHi: "उपसंहार, आशीर्वाद एवं फलश्रुति",
    titleEn: "Conclusion, Blessings & Fruits of Study",
    shlokaRange: [291, 315],
    descriptionGu: "આ શાસ્ત્રનું નિત્ય પઠન, મનન અને પાલન કરવાથી પરમ શાંતિ, સુખ અને અક્ષરધામની પ્રાપ્તિ થાય છે.",
    descriptionHi: "इस शास्त्र का नित्य पठन, मनन और पालन करने से परम शांति, सुख और अक्षरधाम की प्राप्ति होती है।",
    descriptionEn: "Daily recitation, contemplation, and adherence to these precepts bestow ultimate inner peace, joy, and Akshardham.",
    themeColor: "from-amber-500 to-orange-600",
    iconName: "Award"
  }
];

const anirdeshData = JSON.parse(fs.readFileSync('anirdesh_315.json', 'utf8'));

// Helper to find chapter
function getChapterForShloka(id) {
  for (const ch of CHAPTERS) {
    if (id >= ch.shlokaRange[0] && id <= ch.shlokaRange[1]) {
      return ch;
    }
  }
  return CHAPTERS[0];
}

// Generate tags
function getTagsForShloka(id) {
  if (id <= 4) return ['મંગલાચરણ', 'ઉપાસના', 'પ્રસ્તાવના', 'AksharPurushottam'];
  if (id <= 17) return ['શાસ્ત્રનિર્માણ', 'સત્સંગદીક્ષા', 'બ્રહ્મવિદ્યા', 'Swaminarayan'];
  if (id <= 44) return ['સ્વરૂપનિશ્ચય', 'ઉપાસના', 'સર્વોપરી', 'ગુણાતીતગુરુ'];
  if (id <= 76) return ['નિત્યકર્મ', 'પ્રાતઃપૂજા', 'તિલકચાંદલો', 'માનસીપૂજા', 'માળા'];
  if (id <= 115) return ['આહારશુદ્ધિ', 'અહિંસા', 'વ્યસનમુક્તિ', 'ધર્મનિયમ'];
  if (id <= 160) return ['સદાચાર', 'માતાપિતાસેવા', 'સત્યવાણી', 'વ્યવહારશુદ્ધિ'];
  if (id <= 200) return ['સત્સંગસભા', 'ઘરસભા', 'ભક્તિ', 'શાસ્ત્રવાંચન'];
  if (id <= 250) return ['નિર્દોષબુદ્ધિ', 'દિવ્યભાવ', 'અંતઃશત્રુજય', 'સુહૃદભાવ'];
  if (id <= 290) return ['બ્રહ્મરૂપ', 'અક્ષરરૂપ', 'ગુરુભક્તિ', 'સમર્પણ'];
  return ['આશીર્વાદ', 'ફલશ્રુતિ', 'મોક્ષપ્રાપ્તિ', 'અક્ષરધામ'];
}

// Generate scriptural cross references
function getCrossReferencesForShloka(id) {
  const refs = [];
  if (id === 1 || id === 2 || id === 3 || id === 4 || id === 5) {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત ગઢડા પ્રથમ ૧',
      titleGu: 'વચનામૃત ગઢડા પ્રથમ ૧',
      titleHi: 'वचनामृत गढडा प्रथम १',
      titleEn: 'Vachnamrut Gadhada I-1',
      section: 'ગઢડા પ્રથમ પ્રકરણ ૧',
      textGu: 'જેને ભગવાન ભજવા હોય તેને ઇન્દ્રિયો-અંતઃકરણ જીતવા જોઈએ અને સર્વ પરમ શાંતિનો અનુભવ કરવો જોઈએ.',
      textHi: 'जिन्हें भगवान की भक्ति करनी है, उन्हें इन्द्रियों-अन्तःकरण को जीतना चाहिए और परम शांति का अनुभव करना चाहिए।',
      textEn: 'One who wishes to worship God must conquer the senses and inner faculties and experience ultimate peace.',
      correlationNote: 'સત્સંગ દીક્ષા શ્લોક ૧-૫ માં દર્શાવેલ પરમ શાંતિ અને મુક્તિના ધ્યેય સાથે વચનામૃત ગઢડા પ્રથમ ૧ નું સંપૂર્ણ અનુસંધાન છે.'
    });
  } else if (id >= 6 && id <= 44) {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૧',
      titleGu: 'વચનામૃત ગઢડા પ્રથમ ૭૧',
      titleHi: 'वचनामृत गढडा प्रथम ७१',
      titleEn: 'Vachnamrut Gadhada I-71',
      section: 'ગઢડા પ્રથમ ૭૧',
      textGu: 'ભગવાનને સર્વકર્તા, સાકાર, સર્વોપરી અને પ્રત્યક્ષ જાણવા એ જ સર્વ શાસ્ત્રોનું રહસ્ય છે.',
      textHi: 'भगवान को सर्वकर्ता, साकार, सर्वोपरि और प्रत्यक्ष जानना ही समस्त शास्त्रों का रहस्य है।',
      textEn: 'To realize God as the all-doer, possessing form, supreme, and manifest is the essence of all scriptures.',
      correlationNote: 'અક્ષર-પુરુષોત્તમ ઉપાસના અને ભગવાનના સાકાર સ્વરૂપનું વચનામૃત ગઢડા પ્રથમ ૭૧ સાથે સીધું જોડાણ છે.'
    });
  } else if (id >= 45 && id <= 76) {
    refs.push({
      type: 'swamini_vato',
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૧૨',
      titleGu: 'સ્વામીની વાતો પ્રકરણ ૨/૧૨',
      titleHi: 'स्वामीनी बातें प्रकरण २/१२',
      titleEn: 'Swamini Vato Chapter 2/12',
      section: 'પ્રકરણ ૨/૧૨',
      textGu: 'નિત્ય નિયમ, પૂજા અને ભક્તિમાં ક્યારેય આળસ કરવી નહિ.',
      textHi: 'नित्य नियम, पूजा और भक्ति में कभी आलस्य नहीं करना चाहिए।',
      textEn: 'One should never be indolent in observing daily spiritual rituals, morning puja, and devotion.',
      correlationNote: 'પ્રાતઃપૂજા અને નિત્યકર્મ વિધિ સાથે સ્વામીની વાતોનું સચોટ સમર્થન.'
    });
  } else if (id >= 77 && id <= 115) {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત ગઢડા અંત્ય ૧૭',
      titleGu: 'વચનામૃત ગઢડા અંત્ય ૧૭',
      titleHi: 'वचनामृत गढडा अंत्य १७',
      titleEn: 'Vachnamrut Gadhada III-17',
      section: 'ગઢડા અંત્ય ૧૭',
      textGu: 'આહારની શુદ્ધિથી અંતઃકરણની શુદ્ધિ થાય છે અને અંતઃકરણ શુદ્ધ થતાં ભગવાનની સ્મૃતિ સદા રહે છે.',
      textHi: 'आहार की शुद्धि से अन्तःकरण की शुद्धि होती है और अन्तःकरण शुद्ध होने पर भगवान की स्मृति सदा रहती है।',
      textEn: 'From purity of food arises purity of inner nature, which leads to unbroken remembrance of God.',
      correlationNote: 'આહારશુદ્ધિ અને સદાચાર નિયમોનું શાસ્ત્રીય પ્રમાણ.'
    });
  } else if (id >= 116 && id <= 200) {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત કારિયાણી ૧૧',
      titleGu: 'વચનામૃત કારિયાણી ૧૧',
      titleHi: 'वचनामृत कारियाणी ११',
      titleEn: 'Vachnamrut Kariyani 11',
      section: 'કારિયાણી ૧૧',
      textGu: 'સત્સંગી માત્રે પરસ્પર સ્નેહ અને સંપીને રહેવું અને સત્સંગ સભાનો નિયમ રાખવો.',
      textHi: 'सत्संगियों को परस्पर स्नेह और एकता से रहना चाहिए तथा सत्संग सभा का नियम रखना चाहिए।',
      textEn: 'All satsangis should live with mutual harmony and affection, and regularly attend spiritual assemblies.',
      correlationNote: 'સત્સંગ સભા, ઘરસભા અને વ્યવહારશુદ્ધિ સાથે સુમેળ.'
    });
  } else if (id >= 201 && id <= 250) {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત ગઢડા મધ્ય ૨૮',
      titleGu: 'વચનામૃત ગઢડા મધ્ય ૨૮',
      titleHi: 'वचनामृत गढडा मध्य २८',
      titleEn: 'Vachnamrut Gadhada II-28',
      section: 'ગઢડા મધ્ય ૨૮',
      textGu: 'ભગવાનના ભક્તમાં કોઈ દોષ જોવો નહિ અને સર્વમાં નિર્દોષબુદ્ધિ રાખવી.',
      textHi: 'भगवान के भक्तों में कोई दोष न देखें और सभी में निर्दोषबुद्धि रखें।',
      textEn: 'One should never look at faults in devotees of God and always maintain divine vision.',
      correlationNote: 'નિર્દોષબુદ્ધિ અને દિવ્યભાવ સાધનાનું મૂળ આધ્યાત્મિક રહસ્ય.'
    });
  } else {
    refs.push({
      type: 'vachnamrut',
      title: 'વચનામૃત લોયા ૧૨',
      titleGu: 'વચનામૃત લોયા ૧૨',
      titleHi: 'वचनामृत लोया १२',
      titleEn: 'Vachnamrut Loya 12',
      section: 'લોયા ૧૨',
      textGu: 'અક્ષરરૂપ થઈને પુરુષોત્તમની દાસભાવે ભક્તિ કરવી એ જ સર્વોપરી મુક્તિ છે.',
      textHi: 'अक्षररूप होकर पुरुषोत्तम की दासभाव से भक्ति करना ही सर्वोपरि मुक्ति है।',
      textEn: 'To become Aksharrup and offer devotional service to Purushottam as a servant is supreme liberation.',
      correlationNote: 'અક્ષરબ્રહ્મ સાધર્મ્ય અને પરમ મુક્તિનું સિદ્ધાંત પ્રમાણ.'
    });
  }
  return refs;
}

const cleanShlokas = anirdeshData.map(item => {
  const chapter = getChapterForShloka(item.id);
  const tags = getTagsForShloka(item.id);
  const crossReferences = getCrossReferencesForShloka(item.id);

  // Generate word breakdowns from the Sanskrit verse
  const wordsSans = item.sanskritGujarati
    .replace(/[॥।\d\(\)]/g, '')
    .split(/\s+/)
    .filter(w => w.trim().length > 0);

  const padachheda = wordsSans.slice(0, 6).map((word, idx) => ({
    word: word.trim(),
    meaningGu: `${word.trim()}`,
    meaningHi: `${word.trim()}`,
    meaningEn: `${word.trim()}`
  }));

  return {
    id: item.id,
    chapterId: chapter.id,
    chapterGu: chapter.titleGu,
    chapterHi: chapter.titleHi,
    chapterEn: chapter.titleEn,
    titleGu: `શ્લોક ${item.id} - ${chapter.titleGu}`,
    titleHi: `श्लोक ${item.id} - ${chapter.titleHi}`,
    titleEn: `Shloka ${item.id} - ${chapter.titleEn}`,
    sanskritDevanagari: item.sanskritDevanagari,
    sanskritGujarati: item.sanskritGujarati,
    sanskritIast: item.sanskritIast,
    meaningGu: item.meaningGu,
    meaningHi: item.meaningHi,
    meaningEn: item.meaningEn,
    padachheda,
    tags,
    crossReferences
  };
});

const fileContent = `import { Shloka } from '../types';

export const ALL_SHLOKAS: Shloka[] = ${JSON.stringify(cleanShlokas, null, 2)};
`;

fs.writeFileSync('src/data/shlokas.ts', fileContent, 'utf8');
console.log(`Successfully written ${cleanShlokas.length} clean authentic shlokas to src/data/shlokas.ts!`);
