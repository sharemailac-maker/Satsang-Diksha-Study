import fs from 'fs';
import path from 'path';
import { SHLOKAS } from '../src/data/shlokas.ts';
import { PADACHHEDA_DATA } from '../src/data/padachhedaData.ts';
import { WordMeaning, Shloka } from '../src/types.ts';

// Unicode script converter
function gujToDev(str: string): string {
  if (!str) return '';
  const diff = 0x0900 - 0x0A80;
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 0x0A81 && code <= 0x0AF9) {
      return String.fromCharCode(code + diff);
    }
    return c;
  }).join('');
}

function devToGuj(str: string): string {
  if (!str) return '';
  const diff = 0x0A80 - 0x0900;
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 0x0901 && code <= 0x0979) {
      return String.fromCharCode(code + diff);
    }
    return c;
  }).join('');
}

// Well-known dictionary of common Sanskrit words in Satsang Diksha and their context meanings
const COMMON_SANSKRIT_WORDS: Record<string, { gu: string; hi: string; en: string; grammar?: string }> = {
  // Verbs & Auxiliaries
  'અસ્તિ': { gu: 'છે', hi: 'है', en: 'is', grammar: 'ક્રિયાપદ' },
  '(અસ્તિ)': { gu: 'છે', hi: 'है', en: 'is', grammar: 'ક્રિયાપદ (અધ્યાહાર)' },
  'સ્યાત્': { gu: 'થાય / બને', hi: 'होवे / बने', en: 'may become / be', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
  'ભવેત્': { gu: 'થાય', hi: 'हो', en: 'may be', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
  'કુર્યાત્': { gu: 'કરવો / કરવી', hi: 'करे / करना चाहिए', en: 'should do / perform', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
  'ન કુર્યાત્': { gu: 'ન કરવો', hi: 'नहीं करना चाहिए', en: 'should not do', grammar: 'ક્રિયાપદ' },
  'કાર્યઃ': { gu: 'કરવી / કરવો', hi: 'करनी चाहिए', en: 'should be done', grammar: 'વિધ્યર્થ કૃદંત' },
  'કાર્યા': { gu: 'કરવી', hi: 'करनी चाहिए', en: 'should be done', grammar: 'વિધ્યર્થ કૃદંત' },
  'કાર્યમ્': { gu: 'કરવું', hi: 'करना चाहिए', en: 'should be done', grammar: 'વિધ્યર્થ કૃદંત' },
  'કરણીયઃ': { gu: 'કરવો જોઈએ', hi: 'करना चाहिए', en: 'ought to be done', grammar: 'કૃદંત' },
  'કરણીયા': { gu: 'કરવી જોઈએ', hi: 'करनी चाहिए', en: 'ought to be done', grammar: 'કૃદંત' },
  'કરણીયમ્': { gu: 'કરવું જોઈએ', hi: 'करना चाहिए', en: 'ought to be done', grammar: 'કૃદંત' },
  'પાલયેત્': { gu: 'પાળવું', hi: 'पालन करना चाहिए', en: 'should observe / follow', grammar: 'ક્રિયાપદ' },
  'પાલ્યા': { gu: 'પાળવી', hi: 'पालन करनी चाहिए', en: 'should be observed', grammar: 'કૃદંત' },
  'ત્યજેત્': { gu: 'ત્યાગ કરવો', hi: 'त्याग करना चाहिए', en: 'should renounce / abandon', grammar: 'ક્રિયાપદ' },
  'આશ્રયેત્': { gu: 'આશરો કરવો / લેવો', hi: 'आश्रय लेना चाहिए', en: 'should take refuge in', grammar: 'ક્રિયાપદ' },
  'લભ્યતે': { gu: 'પ્રાપ્ત થાય છે / મળે છે', hi: 'प्राप्त होता है', en: 'is attained / obtained', grammar: 'ક્રિયાપદ' },
  'ન લભ્યતે': { gu: 'મળતો નથી', hi: 'प्राप्त नहीं होता', en: 'is not attained', grammar: 'ક્રિયાપદ' },
  'પ્રસીદતિ': { gu: 'પ્રસન્ન થાય છે', hi: 'प्रसन्न होते हैं', en: 'becomes pleased', grammar: 'ક્રિયાપદ' },
  'પ્રસીદેત્': { gu: 'પ્રસન્ન થાય', hi: 'प्रसन्न हों', en: 'may be pleased', grammar: 'ક્રિયાપદ' },
  'અર્પયેત્': { gu: 'અર્પે / પ્રદાન કરે', hi: 'प्रदान करें', en: 'may bestow / grant', grammar: 'ક્રિયાપદ' },
  'જ્ઞાતવ્યમ્': { gu: 'જાણવું', hi: 'जानना चाहिए', en: 'should be known', grammar: 'કૃદંત' },
  'વિજ્ઞાતવ્યમ્': { gu: 'વિશેષપણે જાણવું', hi: 'भली-भांति जानना चाहिए', en: 'should be specifically known', grammar: 'કૃદંત' },
  'પૂજયેત્': { gu: 'પૂજન કરવું', hi: 'पूजन करना चाहिए', en: 'should worship', grammar: 'ક્રિયાપદ' },
  'નમેત્': { gu: 'નમન કરવું', hi: 'नमन करना चाहिए', en: 'should bow down', grammar: 'ક્રિયાપદ' },
  'પ્રણમેત્': { gu: 'પ્રણામ કરવા', hi: 'प्रणाम करना चाहिए', en: 'should prostrate', grammar: 'ક્રિયાપદ' },

  // Particles & Prepositions & Conjunctions
  'ન': { gu: 'ન / નથી', hi: 'नहीं', en: 'not / never', grammar: 'નિષેધવાચક અવ્યય' },
  'નૈવ': { gu: 'ક્યારેય નહીં / કદાપિ નહીં', hi: 'कभी नहीं / बिल्कुल नहीं', en: 'never / certainly not', grammar: 'અવ્યય' },
  'ચ': { gu: 'અને', hi: 'और', en: 'and', grammar: 'સમુચ્ચયાર્થક અવ્યય' },
  'વા': { gu: 'અથવા / કે', hi: 'अथवा / या', en: 'or', grammar: 'વિકલ્પાર્થક અવ્યય' },
  'તુ': { gu: 'તો', hi: 'तो', en: 'indeed / but', grammar: 'અવ્યય' },
  'હિ': { gu: 'ખરેખર / કેમ કે', hi: 'क्योंकि / निश्चय ही', en: 'indeed / surely / for', grammar: 'અવ્યય' },
  'અપિ': { gu: 'પણ', hi: 'भी', en: 'also / even', grammar: 'અવ્યય' },
  'એવ': { gu: 'જ', hi: 'ही', en: 'only / indeed', grammar: 'અવધારણાર્થક અવ્યય' },
  'એવમ્': { gu: 'એમ / આ પ્રમાણે', hi: 'इस प्रकार', en: 'thus / in this manner', grammar: 'ક્રિયા-વિશેષણ' },
  'તથા': { gu: 'તેમજ / તથા / તે પ્રમાણે', hi: 'तथा / उसी प्रकार', en: 'and / likewise', grammar: 'સમુચ્ચયાર્થક અવ્યય' },
  'તથૈવ': { gu: 'તેમ જ', hi: 'वैसे ही', en: 'just so / likewise', grammar: 'અવ્યય' },
  'ઇતિ': { gu: 'એમ / એ રીતે', hi: 'ऐसा / इस प्रकार', en: 'thus / so', grammar: 'અવ્યય' },
  'અતઃ': { gu: 'આથી / માટે', hi: 'अतः / इसलिए', en: 'therefore', grammar: 'હેતુભાવે અવ્યય' },
  'તસ્માત્': { gu: 'તેથી', hi: 'इसलिए', en: 'hence / therefore', grammar: 'અવ્યય' },
  'સદા': { gu: 'સદાય / હમેશાં', hi: 'सदा / सदैव', en: 'always / perpetually', grammar: 'કાલવાચક અવ્યય' },
  'સદૈવ': { gu: 'સદાય જ', hi: 'सदैव ही', en: 'always indeed', grammar: 'અવ્યય' },
  'સર્વદા': { gu: 'સર્વકાળ / સદાય', hi: 'सब समय', en: 'at all times', grammar: 'અવ્યય' },
  'નિત્યમ્': { gu: 'નિત્ય પ્રત્યે', hi: 'नित्य प्रति', en: 'daily / constantly', grammar: 'અવ્યય' },
  'પ્રતિદિનમ્': { gu: 'દરરોજ / પ્રતિદિન', hi: 'प्रतिदिन', en: 'every day', grammar: 'અવ્યય' },
  'કદાચન': { gu: 'ક્યારેય / કદાપિ', hi: 'कभी भी / कदापि', en: 'ever / at any time', grammar: 'અવ્યય' },
  'કર્હિચિત્': { gu: 'ક્યારેય પણ', hi: 'कभी भी', en: 'at any time / ever', grammar: 'અવ્યય' },

  // Pronouns
  'અયમ્': { gu: 'આ', hi: 'यह', en: 'this', grammar: 'પુલ્લિંગ સર્વનામ' },
  'ઇદમ્': { gu: 'આ', hi: 'यह', en: 'this', grammar: 'નપુંસકલિંગ સર્વનામ' },
  'ઇયમ્': { gu: 'આ', hi: 'यह', en: 'this', grammar: 'સ્ત્રીલિંગ સર્વનામ' },
  'સઃ': { gu: 'તે', hi: 'वह', en: 'he / that', grammar: 'સર્વનામ' },
  'સા': { gu: 'તે', hi: 'वह', en: 'she / that', grammar: 'સ્ત્રીલિંગ સર્વનામ' },
  'તત્': { gu: 'તે', hi: 'वह', en: 'that', grammar: 'નપુંસકલિંગ સર્વનામ' },
  'અસ્ય': { gu: 'આ / આનું', hi: 'इस / इसका', en: 'of this', grammar: 'સર્વનામ (ષષ્ઠી)' },
  'તસ્ય': { gu: 'તેનું', hi: 'उसका', en: 'of that / his', grammar: 'સર્વનામ (ષષ્ઠી)' },
  'નઃ': { gu: 'આપણા / આપણા માટે', hi: 'हमारे / हमारे लिए', en: 'our / for us', grammar: 'સર્વનામ' },
  'મે': { gu: 'મારા / મને', hi: 'मेरे / मुझे', en: 'my / to me', grammar: 'સર્વનામ' },
  'મમ': { gu: 'મારું / મારા', hi: 'मेरा / मेरे', en: 'my / mine', grammar: 'સર્વનામ (ષષ્ઠી)' },
  'સર્વેભ્યઃ': { gu: 'સર્વને', hi: 'सभी को', en: 'unto all', grammar: 'સર્વનામ (ચતુર્થી)' },
  'સર્વેષામ્': { gu: 'સર્વેનાં / બધાનાં', hi: 'सभी का', en: 'of all', grammar: 'સર્વનામ (ષષ્ઠી)' },
  'સર્વમ્': { gu: 'આ સર્વ / બધું', hi: 'यह सब', en: 'all this', grammar: 'વિશેષણ' },
  'સર્વાઃ': { gu: 'સર્વે', hi: 'सभी', en: 'all', grammar: 'વિશેષણ' },
  'એકઃ': { gu: 'એક', hi: 'एक', en: 'one', grammar: 'સંખ્યાવાચક' },

  // Core Satsang Concepts
  'સ્વામિનારાયણઃ': { gu: 'ભગવાન શ્રી સ્વામિનારાયણ', hi: 'भगवान श्री स्वामिनारायण', en: 'Bhagwan Swaminarayan', grammar: 'સંજ્ઞા' },
  'અક્ષરપુરુષોત્તમઃ': { gu: 'અક્ષરપુરુષોત્તમ મહારાજ', hi: 'अक्षरपुरुषोत्तम महाराज', en: 'Akshar-Purushottam Maharaj', grammar: 'સમાસ' },
  'અક્ષરપુરુષોત્તમૌ': { gu: 'અક્ષર અને પુરુષોત્તમ બંને', hi: 'अक्षर और पुरुषोत्तम दोनों', en: 'both Akshar and Purushottam', grammar: 'દ્વિવચન' },
  'પરબ્રહ્મણા': { gu: 'પરબ્રહ્મ પરમાત્મા દ્વારા', hi: 'परब्रह्म परमात्मा द्वारा', en: 'by Parabrahman', grammar: 'તૃતીયા' },
  'સહજાનન્દમ્': { gu: 'સહજાનંદ શ્રીહરિને', hi: 'सहजानंद श्रीहरि को', en: 'unto Sahajanand Shri Hari', grammar: 'દ્વિતીયા' },
  'હરિમ્': { gu: 'શ્રીહરિને', hi: 'श्रीहरि को', en: 'unto Shri Hari', grammar: 'દ્વિતીયા' },
  'હરિઃ': { gu: 'શ્રીહરિ', hi: 'श्रीहरि', en: 'Shri Hari', grammar: 'પ્રથમા' },
  'બ્રહ્માઽક્ષરમ્': { gu: 'અક્ષરબ્રહ્મ સ્વામીને', hi: 'अक्षरब्रह्म स्वामी को', en: 'unto Aksharbrahman Swami', grammar: 'દ્વિતીયા' },
  'ગુણાતીતમ્': { gu: 'ગુણાતીતાનંદ સ્વામી / ગુણાતીત ગુરુને', hi: 'गुणातीतानंद स्वामी / गुणातीत गुरु को', en: 'unto Gunatitanand Swami / Gunatit Guru', grammar: 'દ્વિતીયા' },
  'ગુરુમ્': { gu: 'પ્રગટ ગુરુને', hi: 'प्रगट गुरु को', en: 'unto the manifest Guru', grammar: 'દ્વિતીયા' },
  'ગુરુઃ': { gu: 'ગુરુ', hi: 'गुरु', en: 'Guru', grammar: 'પ્રથમા' },
  'સત્સઙ્ગઃ': { gu: 'સત્સંગ', hi: 'सत्सङ्ग', en: 'Satsang', grammar: 'પ્રથમા' },
  'સત્સઙ્ગમ્': { gu: 'સત્સંગનો', hi: 'सत्सङ्ग को', en: 'Satsang', grammar: 'દ્વિતીયા' },
  'સત્સઙ્ગાત્': { gu: 'સત્સંગ કરવાથી', hi: 'सत्सङ्ग करने से', en: 'from associating with Satsang', grammar: 'પંચમી' },
  'સત્સઙ્ગસ્ય': { gu: 'સત્સંગનું', hi: 'सत्सङ्ग का', en: 'of Satsang', grammar: 'ષષ્ઠી' },
  'સત્સઙ્ગી': { gu: 'સત્સંગી ભક્ત', hi: 'सत्सङ्गी भक्त', en: 'a Satsangi devotee', grammar: 'પ્રથમા' },
  'મુમુક્ષુભિઃ': { gu: 'મુમુક્ષુઓએ', hi: 'मुमुक्षुओं को', en: 'by seekers of liberation', grammar: 'તૃતીયા બહુવચન' },
  'મુમુક્ષુઃ': { gu: 'મોક્ષનો અભિલાષી મુમુક્ષુ', hi: 'मोक्षार्थी मुमुक्षु', en: 'a seeker of liberation', grammar: 'પ્રથમા' },
  'મુક્તયે': { gu: 'મુક્તિ માટે', hi: 'मुक्ति के लिए', en: 'for liberation', grammar: 'ચતુર્થી' },
  'સ્વાત્મમુક્તયે': { gu: 'પોતાના આત્માની મુક્તિ માટે', hi: 'अपनी आत्मा की मुक्ति हेतु', en: "for one's soul liberation", grammar: 'ચતુર્થી' },
  'દેહઃ': { gu: 'આ માનવ શરીર', hi: 'यह शरीर', en: 'body', grammar: 'પ્રથમા' },
  'દેહસ્ય': { gu: 'આ દેહનું / શરીરનું', hi: 'इस देह का', en: 'of the body', grammar: 'ષષ્ઠી' },
  'સાધનમ્': { gu: 'સાધન છે', hi: 'साधन है', en: 'instrument / means', grammar: 'પ્રથમા' },
  'ભક્તિમ્': { gu: 'ભગવાનની ભક્તિ', hi: 'भगवान की भक्ति', en: 'devotion to God', grammar: 'દ્વિતીયા' },
  'શાન્તિમ્': { gu: 'પરમ શાંતિ', hi: 'परम शांति', en: 'peace', grammar: 'દ્વિતીયા' },
  'આનન્દમ્': { gu: 'દિવ્ય આનંદ', hi: 'दिव्य आनंद', en: 'bliss', grammar: 'દ્વિતીયા' },
  'સુખમ્': { gu: 'આત્મિક સુખ', hi: 'सुख', en: 'happiness', grammar: 'દ્વિતીયા' },
  'દીક્ષા': { gu: 'દીક્ષા', hi: 'दीक्षा', en: 'initiation / Diksha', grammar: 'સંજ્ઞા' },
  'હિંસા': { gu: 'કોઈ પણ જીવની હિંસા', hi: 'किसी भी जीव की हिंसा', en: 'violence / injury', grammar: 'સંજ્ઞા' },
  'આત્મઘાતઃ': { gu: 'આત્મહત્યા કરવી તે', hi: 'आत्महत्या करना', en: 'committing suicide', grammar: 'સંજ્ઞા' }
};

// Check if word or meaning needs enrichment
function enrichWord(wordGu: string, rawMeaningGu: string, rawMeaningHi: string, rawMeaningEn: string): {
  meaningGu: string;
  meaningHi: string;
  meaningEn: string;
  grammar: string;
} {
  const normWord = wordGu.trim().replace(/[॥।૦-૯0-9]/g, '');
  if (COMMON_SANSKRIT_WORDS[normWord]) {
    const entry = COMMON_SANSKRIT_WORDS[normWord];
    return {
      meaningGu: entry.gu,
      meaningHi: entry.hi,
      meaningEn: entry.en,
      grammar: entry.grammar || 'સંસ્કૃત વ્યાકરણ પદ'
    };
  }
  return {
    meaningGu: rawMeaningGu || 'પદાર્થ અને અન્વય',
    meaningHi: rawMeaningHi || 'पदार्थ एवं अन्वय',
    meaningEn: rawMeaningEn || 'Contextual meaning in verse',
    grammar: 'સંસ્કૃત વ્યાકરણ પદ'
  };
}

console.log('Alignment helper initialized successfully.');
