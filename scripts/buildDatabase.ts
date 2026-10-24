import fs from 'fs';
import path from 'path';
import { SHLOKAS } from '../src/data/shlokas';
import { PADACHHEDA_DATA } from '../src/data/padachhedaData';
import { CHAPTERS } from '../src/data/chapters';
import { QuizQuestion, QuizTestSet } from '../src/types';

function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffle<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function splitLines(sanskrit: string): [string, string] {
  const parts = sanskrit.split('\n').map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ')];
  }
  const dandaParts = sanskrit.split('।').map(p => p.trim()).filter(Boolean);
  if (dandaParts.length >= 2) {
    return [dandaParts[0] + '।', dandaParts.slice(1).join('।')];
  }
  return [sanskrit, ''];
}

const TRUE_FALSE_BANK: Record<number, { trueGu: string; trueHi: string; trueEn: string; falseGu: string; falseHi: string; falseEn: string; explainGu: string; explainHi: string; explainEn: string }> = {
  1: {
    trueGu: 'સ્વામિનારાયણ ભગવાન સાક્ષાત્ અક્ષરપુરુષોત્તમ પરબ્રહ્મ છે અને સર્વને પરમ શાંતિ તથા સુખ અર્પે છે.',
    trueHi: 'भगवान श्रीस्वामिनारायण साक्षात् अक्षरपुरुषोत्तम परब्रह्म हैं और सबको परम शांति एवं सुख प्रदान करते हैं।',
    trueEn: 'Swaminarayan Bhagwan is himself Akshar-Purushottam Parabrahman and bestows ultimate peace and bliss upon all.',
    falseGu: 'સ્વામિનારાયણ ભગવાન માત્ર એક સામાન્ય જીવ કે દેવતા છે.',
    falseHi: 'भगवान स्वामिनारायण केवल एक सामान्य जीव या देवता हैं।',
    falseEn: 'Swaminarayan Bhagwan is merely an ordinary soul or demigod.',
    explainGu: 'શ્લોક ૧: સ્વામિનારાયણઃ સાક્ષાદ્ અક્ષરપુરુષોત્તમઃ - તેઓ સ્વયં સાક્ષાત્ અક્ષરપુરુષોત્તમ પૂર્ણ પુરુષોત્તમ નારાયણ છે.',
    explainHi: 'श्लोक १ स्पष्ट करता है कि भगवान स्वामिनारायण साक्षात् अक्षरपुरुषोत्तम परब्रह्म हैं।',
    explainEn: 'Shloka 1 declares that Swaminarayan Bhagwan is himself manifest Akshar-Purushottam.'
  },
  2: {
    trueGu: 'આ મનુષ્ય દેહ મુક્તિનું દિવ્ય સાધન છે, કેવળ સાંસારિક ભોગ-વિલાસ માટે નથી.',
    trueHi: 'यह मनुष्य शरीर मुक्ति का दिव्य साधन है, केवल सांसारिक भोग-विलास के लिए नहीं।',
    trueEn: 'This human body is a divine instrument for moksha, not merely for worldly indulgence.',
    falseGu: 'મનુષ્ય દેહ વારંવાર સહેલાઈથી પ્રાપ્ત થાય છે અને તે કેવળ મોજશોખ માટે જ છે.',
    falseHi: 'मनुष्य शरीर बार-बार सरलता से प्राप्त होता है और वह केवल मौज-शौक के लिए ही है।',
    falseEn: 'The human body is easily attained repeatedly and is meant solely for sensory pleasure.',
    explainGu: 'શ્લોક ૨: દેહોઽયં સાધનં મુક્તેર્ન ભોગમાત્રસાધનમ્। દુર્લભો નશ્વરશ્ચાઽયં વારંવારં ન લભ્યતે॥',
    explainHi: 'श्लोक २: देहोऽयं साधनं मुक्तेर्न भोगमात्रसाधनम्। दुर्लभो नश्वरश्चायं वारंवारं न लभ्यते॥',
    explainEn: 'Shloka 2 teaches that this body is for moksha, rare and perishable, not repeatedly attained.'
  },
  54: {
    trueGu: 'નિત્ય પૂજામાં કપાળ પર ચંદનનું તિલક અને તેની મધ્યમાં કુમકુમનો ગોળ ચાંદલો કરવો.',
    trueHi: 'नित्य पूजा में ललाट पर चंदन का तिलक और उसके मध्य में कुमकुम का गोल चांदलो करना चाहिए।',
    trueEn: 'In daily puja, apply a sandalwood tilak on the forehead and a round kumkum chandlo in its center.',
    falseGu: 'તિલક-ચાંદલો કરવો જરૂરી નથી, માત્ર મનમાં પૂજા સ્મરી લેવી કાફી છે.',
    falseHi: 'तिलक-चांदलो करना आवश्यक नहीं है, केवल मन में पूजा याद कर लेना पर्याप्त है।',
    falseEn: 'Tilak-chandlo is unnecessary; mere mental thought is enough.',
    explainGu: 'શ્લોક ૫૪ અનુસાર સાધકે ભાલ પર ચંદનનું તિલક અને કુમકુમનો ગોળ ચાંદલો કરવો એવો આજ્ઞા આદેશ છે.',
    explainHi: 'श्लोक ५४ के अनुसार तिलक और मध्य में कुमकुम चांदलो करना आवश्यक है।',
    explainEn: 'Shloka 54 prescribes applying the U-shaped tilak with a round kumkum chandlo.'
  },
  287: {
    trueGu: 'અક્ષરબ્રહ્મ ગુણાતીતાનંદ સ્વામી છે અને પરબ્રહ્મ ભગવાન સ્વામિનારાયણ છે.',
    trueHi: 'अक्षरब्रह्म गुणातीतानंद स्वामी हैं और परब्रह्म भगवान श्रीस्वामिनारायण हैं।',
    trueEn: 'Aksharbrahman is Gunatitanand Swami and Parabrahman is Bhagwan Swaminarayan.',
    falseGu: 'અક્ષર અને પુરુષોત્તમ બંને એક જ સ્વરૂપ છે અને તેમાં કોઈ અનાદિ ભેદ નથી.',
    falseHi: 'अक्षर और पुरुषोत्तम दोनों एक ही स्वरूप हैं और उनमें कोई अनादि भेद नहीं है।',
    falseEn: 'Akshar and Purushottam are identical entities with no eternal distinction.',
    explainGu: 'શ્લોક ૨૮૭-૨૯૦ સ્પષ્ટ કરે છે કે ગુણાતીતાનંદ સ્વામી મૂળ અક્ષરબ્રહ્મ છે અને સ્વામિનારાયણ ભગવાન સર્વોપરી પરબ્રહ્મ છે.',
    explainHi: 'श्लोक २८७-२९० स्पष्ट करते हैं कि अक्षर और पुरुषोत्तम अनादि तत्त्व हैं।',
    explainEn: 'Shlokas 287-290 establish Gunatitanand Swami as Akshar and Swaminarayan Bhagwan as Purushottam.'
  }
};

// Generate the 32 sets
export function generateAllSets(): QuizTestSet[] {
  const rng = createRng(19200509);

  // Set definitions
  const SET_SPECS = [
    { id: 1, start: 1, end: 12, count: 50, titleGu: "ટેસ્ટ 1: શ્લોક 1 થી 12", titleHi: "टेस्ट 1: श्लोक 1 से 12", titleEn: "Test 1: Verses 1 to 12", chGu: "પ્રસ્તાવના અને મંગલાચરણ", chHi: "प्रस्तावना एवं मंगलाचरण", chEn: "Introduction & Invocation" },
    { id: 2, start: 13, end: 24, count: 50, titleGu: "ટેસ્ટ 2: શ્લોક 13 થી 24", titleHi: "टेस्ट 2: श्लोक 13 से 24", titleEn: "Test 2: Verses 13 to 24", chGu: "દીક્ષા અને આશ્રય મંત્ર", chHi: "दीक्षा एवं आश्रय मंत्र", chEn: "Initiation & Refuge" },
    { id: 3, start: 25, end: 36, count: 50, titleGu: "ટેસ્ટ 3: શ્લોક 25 થી 36", titleHi: "टेस्ट 3: श्लोक 25 से 36", titleEn: "Test 3: Verses 25 to 36", chGu: "પંચ વર્તમાન અને નિયમ", chHi: "पंच वर्तमान एवं नियम", chEn: "Five Vows & Discipline" },
    { id: 4, start: 37, end: 48, count: 50, titleGu: "ટેસ્ટ 4: શ્લોક 37 થી 48", titleHi: "टेस्ट 4: श्लोक 37 से 48", titleEn: "Test 4: Verses 37 to 48", chGu: "નિત્ય પૂજા પદ્ધતિ", chHi: "नित्य पूजा पद्धति", chEn: "Daily Worship Method" },
    { id: 5, start: 49, end: 60, count: 50, titleGu: "ટેસ્ટ 5: શ્લોક 49 થી 60", titleHi: "टेस्ट 5: श्लोक 49 से 60", titleEn: "Test 5: Verses 49 to 60", chGu: "તિલક-ચાંદલો અને માનસી પૂજા", chHi: "तिलक-चांदलो एवं मानसी पूजा", chEn: "Tilak-Chandlo & Mansi Puja" },
    { id: 6, start: 61, end: 72, count: 50, titleGu: "ટેસ્ટ 6: શ્લોક 61 થી 72", titleHi: "टेस्ट 6: श्लोक 61 से 72", titleEn: "Test 6: Verses 61 to 72", chGu: "માળા અને પ્રદક્ષિણા", chHi: "माला एवं प्रदक्षिणा", chEn: "Rosary & Circumambulation" },
    { id: 7, start: 73, end: 84, count: 50, titleGu: "ટેસ્ટ 7: શ્લોક 73 થી 84", titleHi: "टेस्ट 7: श्लोक 73 से 84", titleEn: "Test 7: Verses 73 to 84", chGu: "આરતી, થાળ અને નૈવેદ્ય", chHi: "आरती, थाल एवं नैवेद्य", chEn: "Aarti, Thal & Offering" },
    { id: 8, start: 85, end: 96, count: 50, titleGu: "ટેસ્ટ 8: શ્લોક 85 થી 96", titleHi: "टेस्ट 8: श्लोક 85 से 96", titleEn: "Test 8: Verses 85 to 96", chGu: "મંદિર દર્શન અને સત્સંગ સભા", chHi: "मंदिर दर्शन एवं सत्संग सभा", chEn: "Temple Visit & Assembly" },
    { id: 9, start: 97, end: 108, count: 50, titleGu: "ટેસ્ટ 9: શ્લોક 97 થી 108", titleHi: "टेस्ट 9: श्लोક 97 से 108", titleEn: "Test 9: Verses 97 to 108", chGu: "માતા-પિતા અને ગુરુ આદર", chHi: "माता-पिता एवं गुरु आदर", chEn: "Honor to Parents & Guru" },
    { id: 10, start: 109, end: 120, count: 50, titleGu: "ટેસ્ટ 10: શ્લોક 109 થી 120", titleHi: "टेस्ट 10: श्लोક 109 से 120", titleEn: "Test 10: Verses 109 to 120", chGu: "અહિંસા અને સદાચાર નિયમો", chHi: "अहिंसा एवं सदाचार नियम", chEn: "Ahimsa & Moral Conduct" },
    { id: 11, start: 121, end: 132, count: 50, titleGu: "ટેસ્ટ 11: શ્લોક 121 થી 132", titleHi: "टेस्ट 11: श्लोક 121 से 132", titleEn: "Test 11: Verses 121 to 132", chGu: "આહાર શુદ્ધિ અને વ્યસન મુક્તિ", chHi: "आहार शुद्धि एवं व्यसन मुक्ति", chEn: "Dietary Purity & Sobriety" },
    { id: 12, start: 133, end: 144, count: 50, titleGu: "ટેસ્ટ 12: શ્લોક 133 થી 144", titleHi: "टेस्ट 12: श्लोક 133 से 144", titleEn: "Test 12: Verses 133 to 144", chGu: "ચોરી ત્યાગ અને પ્રમાણિકતા", chHi: "चोरी त्याग एवं प्रामाणिकता", chEn: "Honesty & Non-Stealing" },
    { id: 13, start: 145, end: 156, count: 50, titleGu: "ટેસ્ટ 13: શ્લોક 145 થી 156", titleHi: "टेस्ट 13: श्लोક 145 से 156", titleEn: "Test 13: Verses 145 to 156", chGu: "ગૃહસ્થ ધર્મ અને પરિવાર વ્યવહાર", chHi: "गृहस्थ धर्म एवं परिवार व्यवहार", chEn: "Householder Duties" },
    { id: 14, start: 157, end: 168, count: 50, titleGu: "ટેસ્ટ 14: શ્લોક 157 થી 168", titleHi: "टेस्ट 14: श्लोક 157 से 168", titleEn: "Test 14: Verses 157 to 168", chGu: "પતિ-પત્ની સંબંધ અને સદાચાર", chHi: "पति-पत्नी संबंध एवं सदाचार", chEn: "Family Harmony" },
    { id: 15, start: 169, end: 180, count: 50, titleGu: "ટેસ્ટ 15: શ્લોક 169 થી 180", titleHi: "टेस्ट 15: श्लोક 169 से 180", titleEn: "Test 15: Verses 169 to 180", chGu: "સત્ય વાણી અને અદ્રોહ ભાવ", chHi: "सत्य वाणी एवं अद्रोह भाव", chEn: "Truthful Speech" },
    { id: 16, start: 181, end: 192, count: 50, titleGu: "ટેસ્ટ 16: શ્લોક 181 થી 192", titleHi: "टेस्ट 16: श्लोક 181 से 192", titleEn: "Test 16: Verses 181 to 192", chGu: "સત્સંગી પરસ્પર પ્રીતિ અને સંપ", chHi: "सत्संगी परस्पर प्रीति एवं संप", chEn: "Fellowship & Love" },
    { id: 17, start: 193, end: 204, count: 50, titleGu: "ટેસ્ટ 17: શ્લોક 193 થી 204", titleHi: "टेस्ट 17: श्लोક 193 से 204", titleEn: "Test 17: Verses 193 to 204", chGu: "કુસંગ ત્યાગ અને સત્સંગ રક્ષા", chHi: "कुसंग त्याग एवं सत्संग रक्षा", chEn: "Avoiding Bad Company" },
    { id: 18, start: 205, end: 216, count: 50, titleGu: "ટેસ્ટ 18: શ્લોક 205 થી 216", titleHi: "टेस्ट 18: श्लोક 205 से 216", titleEn: "Test 18: Verses 205 to 216", chGu: "નમ્રતા, દાસત્વ અને માન-ત્યાગ", chHi: "नम्रता, दासत्व एवं मान-त्याग", chEn: "Humility & Overcoming Ego" },
    { id: 19, start: 217, end: 228, count: 50, titleGu: "ટેસ્ટ 19: શ્લોક 217 થી 228", titleHi: "टेस्ट 19: श्लोક 217 से 228", titleEn: "Test 19: Verses 217 to 228", chGu: "ભક્ત સેવા અને નિર્દોષ દૃષ્ટિ", chHi: "भक्त सेवा एवं निर्दोष दृष्टि", chEn: "Service to Devotees" },
    { id: 20, start: 229, end: 240, count: 50, titleGu: "ટેસ્ટ 20: શ્લોક 229 થી 240", titleHi: "टेस्ट 20: श्लोક 229 से 240", titleEn: "Test 20: Verses 229 to 240", chGu: "પ્રગટ સત્પુરુષ મહિમા", chHi: "प्रगट सत्पुरुष महिमा", chEn: "Glory of Manifest Satpurush" },
    { id: 21, start: 241, end: 252, count: 50, titleGu: "ટેસ્ટ 21: શ્લોક 241 થી 252", titleHi: "टेस्ट 21: श्लोક 241 से 252", titleEn: "Test 21: Verses 241 to 252", chGu: "દિવ્યભાવ અને નિર્દોષબુદ્ધિ", chHi: "दिव्यभाव एवं निर्दोषबुद्धि", chEn: "Perceiving Divinity in All" },
    { id: 22, start: 253, end: 264, count: 50, titleGu: "ટેસ્ટ 22: શ્લોક 253 થી 264", titleHi: "टेस्ट 22: श्लोક 253 से 264", titleEn: "Test 22: Verses 253 to 264", chGu: "આજ્ઞા પાલન અને દૃઢ નિષ્ઠા", chHi: "आज्ञा पालन एवं दृढ़ निष्ठा", chEn: "Obedience & Faith" },
    { id: 23, start: 265, end: 276, count: 50, titleGu: "ટેસ્ટ 23: શ્લોક 265 થી 276", titleHi: "टेस्ट 23: श्लोક 265 से 276", titleEn: "Test 23: Verses 265 to 276", chGu: "આત્માનું બ્રહ્મરૂપત્વ", chHi: "आत्मा का ब्रह्मरूपत्व", chEn: "Realizing Soul as Brahmarup" },
    { id: 24, start: 277, end: 288, count: 50, titleGu: "ટેસ્ટ 24: શ્લોક 277 થી 288", titleHi: "टेस्ट 24: श्लोક 277 से 288", titleEn: "Test 24: Verses 277 to 288", chGu: "અક્ષરબ્રહ્મ તત્ત્વજ્ઞાન", chHi: "अक्षरब्रह्म तत्त्वज्ञान", chEn: "Aksharbrahman Tenets" },
    { id: 25, start: 289, end: 300, count: 50, titleGu: "ટેસ્ટ 25: શ્લોક 289 થી 300", titleHi: "टेस्ट 25: श्लोક 289 से 300", titleEn: "Test 25: Verses 289 to 300", chGu: "પરબ્રહ્મ પુરુષોત્તમ ઉપાસના", chHi: "परब्रह्म पुरुषोत्तम उपासना", chEn: "Parabrahman Upasana" },
    { id: 26, start: 301, end: 315, count: 50, titleGu: "ટેસ્ટ 26: શ્લોક 301 થી 315", titleHi: "टेस्ट 26: श्लोક 301 से 315", titleEn: "Test 26: Verses 301 to 315", chGu: "ફલશ્રુતિ અને આશીર્વચન", chHi: "फलश्रुति एवं आशीर्वचन", chEn: "Fruits of Study & Blessings" },

    // 5 Bonus Sets (unlocking every 5 levels)
    { id: 27, start: 1, end: 50, count: 50, titleGu: "બોનસ સેટ 1: મંગલાચરણ & આશ્રય દીક્ષા (શ્લોક 1-50)", titleHi: "बोनस सेट 1: मंगलाचरण एवं आश्रय दीक्षा (श्लोक 1-50)", titleEn: "Bonus Set 1: Invocation & Refuge (Verses 1-50)", chGu: "વિશેષ પુનરાવર્તન ૧", chHi: "विशेष पुनरावर्तन १", chEn: "Special Revision 1" },
    { id: 28, start: 51, end: 100, count: 50, titleGu: "બોનસ સેટ 2: નિત્ય આહ્નિક, તિલક & પૂજા (શ્લોક 51-100)", titleHi: "बोनस सेट 2: नित्य आह्निक, तिलक एवं पूजा (श्लोक 51-100)", titleEn: "Bonus Set 2: Daily Puja & Tilak (Verses 51-100)", chGu: "વિશેષ પુનરાવર્તન ૨", chHi: "विशेष पुनरावर्तन २", chEn: "Special Revision 2" },
    { id: 29, start: 101, end: 180, count: 50, titleGu: "બોનસ સેટ 3: સદાચાર, સદ્ગુણ & પંચ વર્તમાન (શ્લોક 101-180)", titleHi: "बोनस सेट 3: सदाचार, सद्गुण एवं पंच वर्तमान (श्लोक 101-180)", titleEn: "Bonus Set 3: Moral Ethics & Vows (Verses 101-180)", chGu: "વિશેષ પુનરાવર્તન ૩", chHi: "विशेष पुनरावर्तन ३", chEn: "Special Revision 3" },
    { id: 30, start: 181, end: 250, count: 50, titleGu: "બોનસ સેટ 4: સત્સંગ દૃઢતા, સમર્પણ & સેવા (શ્લોક 181-250)", titleHi: "बोनस सेट 4: सत्संग दृढ़ता, समर्पण एवं सेवा (श्लोक 181-250)", titleEn: "Bonus Set 4: Devotion & Service (Verses 181-250)", chGu: "વિશેષ પુનરાવર્તન ૪", chHi: "विशेष पुनरावर्तन ४", chEn: "Special Revision 4" },
    { id: 31, start: 251, end: 315, count: 50, titleGu: "બોનસ સેટ 5: અક્ષરપુરુષોત્તમ ઉપાસના & બ્રહ્મવિદ્યા (શ્લોક 251-315)", titleHi: "बोनस सेट 5: अक्षरपुरुषोत्तम उपासना एवं ब्रह्मविद्या (श्लोक 251-315)", titleEn: "Bonus Set 5: Upasana & Brahmavidya (Verses 251-315)", chGu: "વિશેષ પુનરાવર્તન ૫", chHi: "विशेष पुनरावर्तन ५", chEn: "Special Revision 5" },

    // Grand Ultimate Hard Exam: 100 Very Challenging Questions
    { id: 32, start: 1, end: 315, count: 100, titleGu: "સર્વોચ્ચ ગહન મહાપરીક્ષા: 100 અઘરા પ્રશ્નો (શ્લોક 1-315)", titleHi: "सर्वोच्च गहन महापरीक्षा: 100 कठिन प्रश्न (श्लोक 1-315)", titleEn: "Grand Ultimate Exam: 100 Challenging Questions (All Verses)", chGu: "સંપૂર્ણ શાસ્ત્ર સર્વોચ્ચ કસોટી", chHi: "सम्पूर्ण शास्त्र सर्वोच्च परीक्षा", chEn: "Comprehensive Master Examination" }
  ];

  const allSets: QuizTestSet[] = [];

  for (const spec of SET_SPECS) {
    const rangeShlokas = SHLOKAS.filter(s => s.id >= spec.start && s.id <= spec.end);
    const questions: QuizQuestion[] = [];
    let qCount = 0;
    const targetCount = spec.count; // 50 or 100

    while (questions.length < targetCount) {
      const shlokaIndex = qCount % rangeShlokas.length;
      const shloka = rangeShlokas[shlokaIndex];
      const padachhedas = PADACHHEDA_DATA[shloka.id] || shloka.padachheda || [];
      const mode = qCount % 5; // 0: shloka_fill_blank, 1: word_meaning, 2: completion, 3: meaning_fill_blank, 4: true_false

      qCount++;
      const qId = `q_${spec.id}_${qCount}`;

      // Mode 0: Shloka Fill in the blank (Sanskrit word missing)
      if (mode === 0) {
        const meaningfulWords = padachhedas.filter(p => p.wordGujarati && p.wordGujarati.length >= 3 && !p.wordGujarati.startsWith('('));
        if (meaningfulWords.length > 0) {
          const targetWord = meaningfulWords[Math.floor(rng() * meaningfulWords.length)];
          const targetGu = targetWord.wordGujarati.replace(/[॥।,\(\)\.\-]/g, '').trim();
          const targetDev = targetWord.wordDevanagari?.replace(/[॥।,\(\)\.\-]/g, '').trim() || targetGu;

          const [l1Gu, l2Gu] = splitLines(shloka.sanskritGujarati);
          const [l1Dev, l2Dev] = splitLines(shloka.sanskritDevanagari);

          let lineGu = l1Gu.includes(targetGu) ? l1Gu : (l2Gu.includes(targetGu) ? l2Gu : l1Gu);
          let lineDev = l1Dev.includes(targetDev) ? l1Dev : (l2Dev.includes(targetDev) ? l2Dev : l1Dev);

          const maskedGu = lineGu.replace(targetGu, '______');
          const maskedDev = lineDev.replace(targetDev, '______');

          // Collect distractors from other shlokas
          const distractorsGu: string[] = [];
          const distractorsDev: string[] = [];
          for (let step = 1; step <= 20 && distractorsGu.length < 3; step++) {
            const otherShloka = SHLOKAS[(shloka.id + step * 7) % SHLOKAS.length];
            const otherPadas = PADACHHEDA_DATA[otherShloka.id] || [];
            for (const op of otherPadas) {
              const cleanWGu = op.wordGujarati.replace(/[॥।,\(\)\.\-]/g, '').trim();
              const cleanWDev = op.wordDevanagari?.replace(/[॥।,\(\)\.\-]/g, '').trim() || cleanWGu;
              if (cleanWGu.length >= 3 && cleanWGu !== targetGu && !distractorsGu.includes(cleanWGu)) {
                distractorsGu.push(cleanWGu);
                distractorsDev.push(cleanWDev);
                break;
              }
            }
          }

          while (distractorsGu.length < 3) {
            distractorsGu.push('સાધનમ્');
            distractorsDev.push('साधनम्');
          }

          const optionsGuRaw = [targetGu, ...distractorsGu.slice(0, 3)];
          const optionsDevRaw = [targetDev, ...distractorsDev.slice(0, 3)];

          // Shuffle
          const indices = [0, 1, 2, 3];
          const shuffledIndices = shuffle(indices, rng);
          const correctIdx = shuffledIndices.indexOf(0);

          questions.push({
            id: qId,
            shlokaId: shloka.id,
            type: 'shloka_fill_blank',
            questionGu: `શ્લોક ${shloka.id} માં ખાલી જગ્યા પૂરો:\n«${maskedGu}»`,
            questionHi: `श्लोक ${shloka.id} में रिक्त स्थान की पूर्ति कीजिए:\n«${maskedDev}»`,
            questionEn: `Fill in the blank in Shloka ${shloka.id}:\n«${maskedDev}»`,
            optionsGujarati: shuffledIndices.map(i => optionsGuRaw[i]),
            optionsDevanagari: shuffledIndices.map(i => optionsDevRaw[i]),
            correctIndex: correctIdx,
            explanationGu: `સાચો સંસ્કૃત શબ્દ «${targetGu}» છે.\nસંપૂર્ણ શ્લોક:\n${shloka.sanskritGujarati}\nઅર્થ: ${shloka.meaningGu}`,
            explanationHi: `सही संस्कृत शब्द «${targetDev}» है।\nपूर्ण श्लोक:\n${shloka.sanskritDevanagari}\nअर्थ: ${shloka.meaningHi}`,
            explanationEn: `The correct Sanskrit word is «${targetDev}».\nFull Verse:\n${shloka.sanskritDevanagari}\nMeaning: ${shloka.meaningEn}`,
            fullSanskritDevanagari: shloka.sanskritDevanagari,
            fullSanskritGujarati: shloka.sanskritGujarati
          });
          continue;
        }
      }

      // Mode 1: Word meaning from Padachheda
      if (mode === 1) {
        const meaningfulWords = padachhedas.filter(p => p.meaningGu && p.meaningGu.length >= 3 && !p.meaningGu.includes('વ્યાકરણ'));
        if (meaningfulWords.length > 0) {
          const targetWord = meaningfulWords[Math.floor(rng() * meaningfulWords.length)];
          const correctGu = targetWord.meaningGu || '';
          const correctHi = targetWord.meaningHi || correctGu;
          const correctEn = targetWord.meaningEn || correctGu;

          // Distractor meanings
          const distGu: string[] = [];
          const distHi: string[] = [];
          const distEn: string[] = [];

          for (let step = 1; step <= 25 && distGu.length < 3; step++) {
            const otherShloka = SHLOKAS[(shloka.id + step * 11) % SHLOKAS.length];
            const otherPadas = PADACHHEDA_DATA[otherShloka.id] || [];
            for (const op of otherPadas) {
              if (op.meaningGu && op.meaningGu.length >= 3 && op.meaningGu !== correctGu && !distGu.includes(op.meaningGu)) {
                distGu.push(op.meaningGu);
                distHi.push(op.meaningHi || op.meaningGu);
                distEn.push(op.meaningEn || op.meaningGu);
                break;
              }
            }
          }

          while (distGu.length < 3) {
            distGu.push('પરમ શાંતિ');
            distHi.push('परम शांति');
            distEn.push('ultimate peace');
          }

          const indices = [0, 1, 2, 3];
          const shuffledIndices = shuffle(indices, rng);
          const correctIdx = shuffledIndices.indexOf(0);

          const optsGu = shuffledIndices.map(i => [correctGu, ...distGu][i]);
          const optsHi = shuffledIndices.map(i => [correctHi, ...distHi][i]);
          const optsEn = shuffledIndices.map(i => [correctEn, ...distEn][i]);

          questions.push({
            id: qId,
            shlokaId: shloka.id,
            type: 'word_meaning',
            questionGu: `શ્લોક ${shloka.id} ના પદચ્છેદ અનુસાર «${targetWord.wordGujarati}» શબ્દનો સાચો અર્થ કયો છે?`,
            questionHi: `श्लोक ${shloka.id} के पदच्छेद अनुसार «${targetWord.wordDevanagari || targetWord.wordGujarati}» शब्द का सही अर्थ कौन सा है?`,
            questionEn: `According to the word breakdown of Shloka ${shloka.id}, what is the meaning of «${targetWord.wordDevanagari || targetWord.wordGujarati}»?`,
            optionsGujarati: optsGu,
            optionsDevanagari: optsHi,
            optionsHindi: optsHi,
            optionsEnglish: optsEn,
            options: optsGu,
            correctIndex: correctIdx,
            explanationGu: `«${targetWord.wordGujarati}» શબ્દનો સાચો અર્થ «${correctGu}» થાય છે.\nશ્લોક ${shloka.id}: ${shloka.meaningGu}`,
            explanationHi: `«${targetWord.wordDevanagari || targetWord.wordGujarati}» शब्द का सही अर्थ «${correctHi}» है।\nश्लोक ${shloka.id}: ${shloka.meaningHi}`,
            explanationEn: `The correct meaning of «${targetWord.wordDevanagari || targetWord.wordGujarati}» is «${correctEn}».\nShloka ${shloka.id}: ${shloka.meaningEn}`
          });
          continue;
        }
      }

      // Mode 2: Incomplete line completion (Next line selection)
      if (mode === 2) {
        const [l1Gu, l2Gu] = splitLines(shloka.sanskritGujarati);
        const [l1Dev, l2Dev] = splitLines(shloka.sanskritDevanagari);

        if (l2Gu && l2Gu.length >= 8) {
          // Distractor second lines
          const distL2Gu: string[] = [];
          const distL2Dev: string[] = [];

          for (let step = 1; step <= 20 && distL2Gu.length < 3; step++) {
            const otherShloka = SHLOKAS[(shloka.id + step * 9) % SHLOKAS.length];
            const [, otherL2Gu] = splitLines(otherShloka.sanskritGujarati);
            const [, otherL2Dev] = splitLines(otherShloka.sanskritDevanagari);
            if (otherL2Gu && otherL2Gu !== l2Gu && !distL2Gu.includes(otherL2Gu)) {
              distL2Gu.push(otherL2Gu);
              distL2Dev.push(otherL2Dev);
            }
          }

          while (distL2Gu.length < 3) {
            distL2Gu.push('સર્વેભ્યઃ પરમાં શાન્તિમ્ આનન્દં સુખમર્પયેત્॥');
            distL2Dev.push('सर्वेभ्यः परमां शान्तिम् आनन्दं सुखमर्पयेत्॥');
          }

          const indices = [0, 1, 2, 3];
          const shuffledIndices = shuffle(indices, rng);
          const correctIdx = shuffledIndices.indexOf(0);

          questions.push({
            id: qId,
            shlokaId: shloka.id,
            type: 'completion',
            questionGu: `શ્લોક ${shloka.id} ની અધૂરી કડી પૂર્ણ કરો:\n«${l1Gu}» પછી કઈ સંસ્કૃત પંક્તિ આવે છે?`,
            questionHi: `श्लोक ${shloka.id} की अधूरी पंक्ति पूर्ण कीजिए:\n«${l1Dev}» के बाद कौन सी संस्कृत पंक्ति आती है?`,
            questionEn: `Complete the verse for Shloka ${shloka.id}:\nWhich Sanskrit line follows «${l1Dev}»?`,
            optionsGujarati: shuffledIndices.map(i => [l2Gu, ...distL2Gu][i]),
            optionsDevanagari: shuffledIndices.map(i => [l2Dev, ...distL2Dev][i]),
            correctIndex: correctIdx,
            explanationGu: `શ્લોક ${shloka.id} ની સાચી ઉત્તર પંક્તિ:\n«${l2Gu}»\nઅર્થ: ${shloka.meaningGu}`,
            explanationHi: `श्लोक ${shloka.id} की सही उत्तर पंक्ति:\n«${l2Dev}»\nअर्थ: ${shloka.meaningHi}`,
            explanationEn: `The correct line for Shloka ${shloka.id} is:\n«${l2Dev}»\nMeaning: ${shloka.meaningEn}`
          });
          continue;
        }
      }

      // Mode 3: Meaning Fill-in-the-blank
      if (mode === 3) {
        // Find if any key concept appears in the meaning
        const meaningGu = shloka.meaningGu;
        const meaningHi = shloka.meaningHi;
        const meaningEn = shloka.meaningEn;

        // Try words of length >= 4 from meaning
        const words = meaningGu.split(/[\s,।\(\)\.\-]+/).filter(w => w.length >= 4 && !w.includes('શ્લોક') && !w.includes('એટલે'));
        if (words.length > 0) {
          const targetW = words[Math.floor(rng() * words.length)];
          const maskedMeaningGu = meaningGu.replace(targetW, '______');

          // Distractor words
          const distWordsGu: string[] = [];
          for (let step = 1; step <= 15 && distWordsGu.length < 3; step++) {
            const otherS = SHLOKAS[(shloka.id + step * 8) % SHLOKAS.length];
            const otherWs = otherS.meaningGu.split(/[\s,।\(\)\.\-]+/).filter(w => w.length >= 4 && w !== targetW && !distWordsGu.includes(w));
            if (otherWs.length > 0) distWordsGu.push(otherWs[0]);
          }

          while (distWordsGu.length < 3) {
            distWordsGu.push('મુક્તિ');
          }

          const indices = [0, 1, 2, 3];
          const shuffledIndices = shuffle(indices, rng);
          const correctIdx = shuffledIndices.indexOf(0);
          const rawOpts = [targetW, ...distWordsGu.slice(0, 3)];

          questions.push({
            id: qId,
            shlokaId: shloka.id,
            type: 'meaning_fill_blank',
            questionGu: `શ્લોક ${shloka.id} ના ભાવાર્થમાં ખાલી જગ્યા પૂરો:\n«${maskedMeaningGu}»`,
            questionHi: `श्लोक ${shloka.id} के भावार्थ में रिक्त स्थान की पूर्ति कीजिए:\n«${meaningHi}»`,
            questionEn: `Fill in the blank in the meaning of Shloka ${shloka.id}:\n«${meaningEn}»`,
            optionsGujarati: shuffledIndices.map(i => rawOpts[i]),
            optionsDevanagari: shuffledIndices.map(i => rawOpts[i]),
            options: shuffledIndices.map(i => rawOpts[i]),
            correctIndex: correctIdx,
            explanationGu: `સાચો શબ્દ «${targetW}» છે.\nસંપૂર્ણ અર્થ: ${meaningGu}`,
            explanationHi: `सही शब्द «${targetW}» है।\nपूर्ण अर्थ: ${meaningHi}`,
            explanationEn: `The correct word is «${targetW}».\nFull Meaning: ${meaningEn}`
          });
          continue;
        }
      }

      // Mode 4: True or False statement
      const tfPreset = TRUE_FALSE_BANK[shloka.id];
      const isStatementTrue = rng() > 0.5;

      let stmtGu = isStatementTrue 
        ? (tfPreset ? tfPreset.trueGu : `${shloka.titleGu} ના ઉપદેશ અનુસાર: ${shloka.meaningGu}`)
        : (tfPreset ? tfPreset.falseGu : `${shloka.titleGu} ના ઉપદેશથી વિપરીત: આ શ્લોકનું પાલન કરવું અનિવાર્ય નથી અને મનસ્વી વર્તન કરી શકાય.`);
      
      let stmtHi = isStatementTrue
        ? (tfPreset ? tfPreset.trueHi : `${shloka.titleHi} के उपदेश अनुसार: ${shloka.meaningHi}`)
        : (tfPreset ? tfPreset.falseHi : `${shloka.titleHi} के विपरीत: इस श्लोक का पालन अनिवार्य नहीं है और मनमाना व्यवहार मान्य है।`);

      let stmtEn = isStatementTrue
        ? (tfPreset ? tfPreset.trueEn : `According to ${shloka.titleEn}: ${shloka.meaningEn}`)
        : (tfPreset ? tfPreset.falseEn : `Contradicting ${shloka.titleEn}: Following this verse is not compulsory and one may act willfully.`);

      const correctIndex = isStatementTrue ? 0 : 1;

      questions.push({
        id: qId,
        shlokaId: shloka.id,
        type: 'true_false',
        questionGu: `સત્સંગદીક્ષાના શ્લોક ${shloka.id} ના ઉપદેશ અનુસાર નીચેનું વિધાન ખરું છે કે ખોટું?\n«${stmtGu}»`,
        questionHi: `सत्सङ्गदीक्षा के श्लोक ${shloka.id} के उपदेशानुसार निम्न कथन सत्य है या असत्य?\n«${stmtHi}»`,
        questionEn: `Based on Shloka ${shloka.id} of Satsang Diksha, is the following statement True or False?\n«${stmtEn}»`,
        optionsGujarati: ['ખરું (True)', 'ખોટું (False)'],
        optionsDevanagari: ['सत्य (True)', 'असत्य (False)'],
        optionsHindi: ['सत्य (True)', 'असत्य (False)'],
        optionsEnglish: ['True', 'False'],
        options: ['ખરું (True)', 'ખોટું (False)'],
        correctIndex: correctIndex,
        explanationGu: `વિધાન ${isStatementTrue ? 'ખરું (True)' : 'ખોટું (False)'} છે.\nશ્લોક ${shloka.id} નો વાસ્તવિક ઉપદેશ:\n${shloka.meaningGu}`,
        explanationHi: `कथन ${isStatementTrue ? 'सत्य (True)' : 'असत्य (False)'} है।\nश्लोक ${shloka.id} का वास्तविक उपदेश:\n${shloka.meaningHi}`,
        explanationEn: `The statement is ${isStatementTrue ? 'True' : 'False'}.\nActual Teaching of Shloka ${shloka.id}:\n${shloka.meaningEn}`
      });
    }

    allSets.push({
      id: spec.id,
      startShloka: spec.start,
      endShloka: spec.end,
      titleGu: spec.titleGu,
      titleHi: spec.titleHi,
      titleEn: spec.titleEn,
      chapterGu: spec.chGu,
      chapterHi: spec.chHi,
      chapterEn: spec.chEn,
      questionsCount: questions.length,
      questions
    });
  }

  return allSets;
}

console.log('Generating sets...');
const sets = generateAllSets();
console.log('Generated total sets:', sets.length);
sets.forEach(s => console.log(`Set ${s.id}: ${s.questionsCount} questions`));

// Output to /src/data/quizDatabase.ts
const fileHeader = `// Autogenerated 32 Swadhyay Quiz Test Sets
// Sets 1 to 26: 50 Questions each (1300 Qs)
// Sets 27 to 31: 50 Bonus Questions each (250 Qs)
// Set 32: 100 Hard Grand Examination Questions (100 Qs)
// Total: 1650 authentic, non-leaking, pedagogically diverse questions
import { QuizTestSet, QuizQuestion, SanskritScript } from '../types';

export const QUIZ_TEST_SETS: QuizTestSet[] = ${JSON.stringify(sets, null, 2)};

export function getAllQuizTestSets(): QuizTestSet[] {
  return QUIZ_TEST_SETS;
}

export function getQuizTestSetById(id: number): QuizTestSet | undefined {
  return QUIZ_TEST_SETS.find(s => s.id === id);
}

export function getDailySwadhyayTest(dateKey?: string): QuizTestSet {
  const now = dateKey ? new Date(dateKey) : new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const setIndex = dayOfYear % QUIZ_TEST_SETS.length;
  return QUIZ_TEST_SETS[setIndex];
}

export function getQuestionPrompt(q: QuizQuestion, lang: string, script: SanskritScript = 'devanagari'): string {
  if (lang === 'hindi' || lang === 'marathi') {
    return q.questionHi || q.questionGu || '';
  }
  if (lang === 'english') {
    return q.questionEn || q.questionGu || '';
  }
  return q.questionGu || '';
}

export function getQuestionOptions(q: QuizQuestion, script: SanskritScript = 'devanagari', lang: string = 'gujarati'): string[] {
  if (lang === 'english' && q.optionsEnglish && q.optionsEnglish.length > 0) return q.optionsEnglish;
  if (lang === 'hindi' && q.optionsHindi && q.optionsHindi.length > 0) return q.optionsHindi;
  if (lang === 'gujarati' && q.optionsGujarati && q.optionsGujarati.length > 0 && !q.optionsDevanagari) return q.optionsGujarati;

  if (q.options && q.options.length > 0) return q.options;

  if (script === 'devanagari') {
    return q.optionsDevanagari || q.optionsGujarati || q.options || [];
  }
  return q.optionsGujarati || q.optionsDevanagari || q.options || [];
}

export function getQuestionExplanation(q: QuizQuestion, lang: string, script: SanskritScript = 'devanagari'): string {
  if (lang === 'hindi' || lang === 'marathi') {
    return q.explanationHi || q.explanationGu || '';
  }
  if (lang === 'english') {
    return q.explanationEn || q.explanationGu || '';
  }
  return q.explanationGu || '';
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/quizDatabase.ts'), fileHeader, 'utf-8');
console.log('Successfully written src/data/quizDatabase.ts!');
