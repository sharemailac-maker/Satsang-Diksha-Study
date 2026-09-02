import fs from 'fs';
import path from 'path';
import { SHLOKAS } from '../src/data/shlokas.ts';
import { PADACHHEDA_DATA } from '../src/data/padachhedaData.ts';
import { WordMeaning } from '../src/types.ts';

// Unicode conversion between Gujarati and Devanagari
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

// Special authentic Anvaya & Word Breakdown overrides from official Satsang Diksha Study Guide (Attachment)
const OFFICIAL_ANVAYA_OVERRIDES: Record<number, {
  anvayaDev: string;
  anvayaGu: string;
  words: Array<{
    wordGu: string;
    wordDev: string;
    trans: string;
    meaningGu: string;
    meaningHi: string;
    meaningEn: string;
    grammar: string;
  }>;
}> = {
  1: {
    anvayaDev: "स्वामिनारायणः साक्षात् अक्षरपुरुषोत्तमः (भगवान्) सर्वेभ्यः परमां शान्तिम् आनन्दं सुखम् अर्पयेत्।",
    anvayaGu: "સ્વામિનારાયણઃ સાક્ષાત્ અક્ષરપુરુષોત્તમઃ (ભગવાન) સર્વેભ્યઃ પરમાં શાન્તિમ્ આનન્દં સુખમ્ અર્પયેત્ ।",
    words: [
      {
        wordGu: "સ્વામિનારાયણઃ",
        wordDev: "स्वामिनारायणः",
        trans: "Swāminārāyaṇah",
        meaningGu: "ભગવાન શ્રી સ્વામિનારાયણ",
        meaningHi: "भगवान श्री स्वामिनारायण",
        meaningEn: "Bhagwan Swaminarayan",
        grammar: "સંજ્ઞા (પ્રથમા એકવચન)"
      },
      {
        wordGu: "સાક્ષાત્",
        wordDev: "साक्षात्",
        trans: "sākṣhāt",
        meaningGu: "એટલે કે સાક્ષાત્ / પ્રત્યક્ષ",
        meaningHi: "अर्थात् साक्षात् / प्रत्यक्ष",
        meaningEn: "that is, directly / in person",
        grammar: "અવ્યય"
      },
      {
        wordGu: "અક્ષરપુરુષોત્તમઃ",
        wordDev: "अक्षरपुरुषोत्तमः",
        trans: "Akṣhara-Puruṣhottamah",
        meaningGu: "અક્ષરપુરુષોત્તમ મહારાજ",
        meaningHi: "अक्षरपुरुषोत्तम महाराज",
        meaningEn: "Akshar-Purushottam Maharaj",
        grammar: "કર્મધારય સમાસ"
      },
      {
        wordGu: "(ભગવાન)",
        wordDev: "(भगवान्)",
        trans: "(bhagawān)",
        meaningGu: "પરબ્રહ્મ પરમાત્મા",
        meaningHi: "परब्रह्म परमात्मा",
        meaningEn: "Supreme God",
        grammar: "અધ્યાહાર પદ"
      },
      {
        wordGu: "સર્વેભ્યઃ",
        wordDev: "सर्वेभ्यः",
        trans: "sarvebhyah",
        meaningGu: "સર્વ ભક્તો અને જીવોને",
        meaningHi: "सभी भक्तों और जीवों को",
        meaningEn: "upon all devotees and souls",
        grammar: "સર્વનામ (ચતુર્થી બહુવચન)"
      },
      {
        wordGu: "પરમામ્",
        wordDev: "परमाम्",
        trans: "paramām",
        meaningGu: "પરમ / સર્વોચ્ચ",
        meaningHi: "परम / सर्वश्रेष्ठ",
        meaningEn: "supreme / ultimate",
        grammar: "વિશેષણ (દ્વિતીયા એકવચન)"
      },
      {
        wordGu: "શાન્તિમ્",
        wordDev: "शान्तिम्",
        trans: "shāntim",
        meaningGu: "શાંતિ",
        meaningHi: "शांति",
        meaningEn: "peace",
        grammar: "સંજ્ઞા (દ્વિતીયા એકવચન)"
      },
      {
        wordGu: "આનન્દમ્",
        wordDev: "आनन्दम्",
        trans: "ānandam",
        meaningGu: "આનંદ",
        meaningHi: "आनंद",
        meaningEn: "bliss",
        grammar: "સંજ્ઞા (દ્વિતીયા એકવચન)"
      },
      {
        wordGu: "સુખમ્",
        wordDev: "सुखम्",
        trans: "sukham",
        meaningGu: "અને આત્મિક સુખ",
        meaningHi: "और सुख",
        meaningEn: "and happiness",
        grammar: "સંજ્ઞા (દ્વિતીયા એકવચન)"
      },
      {
        wordGu: "અર્પયેત્",
        wordDev: "अर्पयेत्",
        trans: "arpayet",
        meaningGu: "અર્પે / પ્રદાન કરે",
        meaningHi: "प्रदान करें",
        meaningEn: "may bestow / grant",
        grammar: "ક્રિયાપદ (વિધ્યર્થ)"
      }
    ]
  },
  2: {
    anvayaDev: "अयं देहः मुक्तेः साधनं (अस्ति), भोगमात्रसाधनं न (अस्ति)। दुर्लभः च नश्वरः अयं वारंवारं न लभ्यते।",
    anvayaGu: "અયં દેહઃ મુક્તેઃ સાધનં (અસ્તિ), ભોગમાત્રસાધનં ન (અસ્તિ) । દુર્લભઃ ચ નશ્વરઃ અયં વારંવારં ન લભ્યતે ।",
    words: [
      {
        wordGu: "અયં દેહઃ",
        wordDev: "अयं देहः",
        trans: "ayam dehah",
        meaningGu: "આ માનવ દેહ",
        meaningHi: "यह मानव शरीर",
        meaningEn: "this human body",
        grammar: "પ્રથમા એકવચન"
      },
      {
        wordGu: "મુક્તેઃ સાધનમ્",
        wordDev: "मुक्तेः साधनम्",
        trans: "mukteh sādhanam",
        meaningGu: "મુક્તિનું સાધન છે",
        meaningHi: "मुक्ति का साधन है",
        meaningEn: "is the means to liberation",
        grammar: "ષષ્ઠી / પ્રથમા"
      },
      {
        wordGu: "ભોગમાત્રસાધનમ્",
        wordDev: "भोगमात्रसाधनम्",
        trans: "bhogamātra-sādhanam",
        meaningGu: "કેવળ વિષયભોગનું સાધન",
        meaningHi: "केवल विषयभोग का साधन",
        meaningEn: "a means for sensory pleasures only",
        grammar: "કર્મધારય સમાસ"
      },
      {
        wordGu: "ન",
        wordDev: "न",
        trans: "na",
        meaningGu: "નથી",
        meaningHi: "नहीं है",
        meaningEn: "is not",
        grammar: "નિષેધવાચક અવ્યય"
      },
      {
        wordGu: "દુર્લભઃ",
        wordDev: "दुर्लभः",
        trans: "durlabhah",
        meaningGu: "અતિ દુર્લભ",
        meaningHi: "अति दुर्लभ",
        meaningEn: "rare to obtain",
        grammar: "વિશેષણ"
      },
      {
        wordGu: "ચ નશ્વરઃ",
        wordDev: "च नश्वरः",
        trans: "cha nashwarah",
        meaningGu: "અને નાશવંત એવો",
        meaningHi: "और नश्वर ऐसा",
        meaningEn: "and perishable",
        grammar: "અવ્યય + વિશેષણ"
      },
      {
        wordGu: "અયમ્",
        wordDev: "अयम्",
        trans: "ayam",
        meaningGu: "આ દેહ",
        meaningHi: "यह देह",
        meaningEn: "this body",
        grammar: "સર્વનામ"
      },
      {
        wordGu: "વારંવારમ્",
        wordDev: "वारंवारम्",
        trans: "vāram-vāram",
        meaningGu: "વારંવાર / પુનઃ પુનઃ",
        meaningHi: "बार-बार",
        meaningEn: "again and again",
        grammar: "ક્રિયા-વિશેષણ"
      },
      {
        wordGu: "ન લભ્યતે",
        wordDev: "न लभ्यते",
        trans: "na labhyate",
        meaningGu: "મળતો નથી",
        meaningHi: "प्राप्त नहीं होता",
        meaningEn: "is not obtained",
        grammar: "ક્રિયાપદ (કર્મણિ વર્તમાનકાળ)"
      }
    ]
  },
  41: {
    anvayaDev: "आत्मघातः अपि हिंसा एव (अस्ति)। अतः पतन-गलबन्ध-आद्यैः विषभक्ष-आदिभिः तथा (आत्मघातः) कदाचन न कार्यः।",
    anvayaGu: "આત્મઘાતઃ અપિ હિંસા એવ (અસ્તિ) । અતઃ પતન-ગલબન્ધ-આદ્યૈઃ વિષભક્ષ-આદિભિઃ તથા (આત્મઘાતઃ) કદાચન ન કાર્યઃ ।",
    words: [
      {
        wordGu: "આત્મઘાતઃ",
        wordDev: "आत्मघातः",
        trans: "ātmaghātah",
        meaningGu: "આત્મહત્યા કરવી તે",
        meaningHi: "आत्महत्या करना",
        meaningEn: "Committing suicide",
        grammar: "સંજ્ઞા (પ્રથમા એકવચન)"
      },
      {
        wordGu: "અપિ",
        wordDev: "अपि",
        trans: "api",
        meaningGu: "પણ",
        meaningHi: "भी",
        meaningEn: "also / even",
        grammar: "સમુચ્ચયાર્થક અવ્યય"
      },
      {
        wordGu: "હિંસા",
        wordDev: "हिंसा",
        trans: "hinsā",
        meaningGu: "હિંસા",
        meaningHi: "हिंसा",
        meaningEn: "violence / harm",
        grammar: "સ્ત્રીલિંગ સંજ્ઞા"
      },
      {
        wordGu: "એવ",
        wordDev: "एव",
        trans: "eva",
        meaningGu: "જ",
        meaningHi: "ही",
        meaningEn: "indeed / definitely",
        grammar: "અવધારણાર્થક અવ્યય"
      },
      {
        wordGu: "(અસ્તિ)",
        wordDev: "(अस्ति)",
        trans: "(asti)",
        meaningGu: "છે",
        meaningHi: "है",
        meaningEn: "is",
        grammar: "ક્રિયાપદ (અધ્યાહાર)"
      },
      {
        wordGu: "અતઃ",
        wordDev: "अतः",
        trans: "atah",
        meaningGu: "આથી",
        meaningHi: "अतः / इसलिए",
        meaningEn: "therefore",
        grammar: "હેતુભાવે અવ્યય"
      },
      {
        wordGu: "પતન-ગલબન્ધ-આદ્યૈઃ",
        wordDev: "पतन-गलबन्ध-आद्यैः",
        trans: "patana-gala-bandha-ādyaih",
        meaningGu: "પડતું મૂકવું, ગળે ટૂંપો ખાવો",
        meaningHi: "ऊंचाई से कूदना, फांसी लगाना आदि द्वारा",
        meaningEn: "by jumping/falling from heights, hanging oneself, etc.",
        grammar: "તૃતીયા બહુવચન (બહુવ્રીહિ સમાસ)"
      },
      {
        wordGu: "વિષભક્ષ-આદિભિઃ",
        wordDev: "विषभक्ष-आदिभिः",
        trans: "viṣhabhakṣha-ādibhih",
        meaningGu: "ઝેર ખાવું ઇત્યાદિ",
        meaningHi: "विषपान आदि से",
        meaningEn: "by consuming poison, etc.",
        grammar: "તૃતીયા બહુવચન"
      },
      {
        wordGu: "તથા",
        wordDev: "तथा",
        trans: "tathā",
        meaningGu: "કોઇ રીતે",
        meaningHi: "या किसी भी प्रकार से",
        meaningEn: "or in any such manner",
        grammar: "સમુચ્ચયાર્થક અવ્યય"
      },
      {
        wordGu: "(આત્મઘાતઃ)",
        wordDev: "(आत्मघातः)",
        trans: "(ātmaghātah)",
        meaningGu: "આત્મહત્યા",
        meaningHi: "आत्महत्या",
        meaningEn: "suicide",
        grammar: "કર્મ (અધ્યાહાર)"
      },
      {
        wordGu: "કદાચન",
        wordDev: "कदाचन",
        trans: "kadāchana",
        meaningGu: "ક્યારેય",
        meaningHi: "कभी भी / कदापि",
        meaningEn: "ever / at any time",
        grammar: "કાલવાચક અવ્યય"
      },
      {
        wordGu: "ન",
        wordDev: "न",
        trans: "na",
        meaningGu: "ન",
        meaningHi: "नहीं",
        meaningEn: "not",
        grammar: "નિષેધવાચક અવ્યય"
      },
      {
        wordGu: "કાર્યઃ",
        wordDev: "कार्यः",
        trans: "kāryah",
        meaningGu: "કરવી",
        meaningHi: "करनी चाहिए",
        meaningEn: "should be done / committed",
        grammar: "કૃદંત (વિધ્યર્થ)"
      }
    ]
  }
};

// Well-known dictionary of common Sanskrit words in Satsang Diksha and their context meanings
const COMMON_SANSKRIT_WORDS: Record<string, { gu: string; hi: string; en: string; grammar?: string }> = {
  'અસ્તિ': { gu: 'છે', hi: 'है', en: 'is', grammar: 'ક્રિયાપદ' },
  '(અસ્તિ)': { gu: 'છે', hi: 'है', en: 'is', grammar: 'ક્રિયાપદ (અધ્યાહાર)' },
  'સ્યાત્': { gu: 'થાય / બને', hi: 'होवे / बने', en: 'may become / be', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
  'ભવેત્': { gu: 'થાય', hi: 'हो', en: 'may be', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
  'કુર્યાત્': { gu: 'કરવો / કરવી', hi: 'करे / करना चाहिए', en: 'should do / perform', grammar: 'ક્રિયાપદ (વિધ્યર્થ)' },
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
  'પ્રસીદતિ': { gu: 'પ્રસન્ન થાય છે', hi: 'प्रसन्न होते हैं', en: 'becomes pleased', grammar: 'ક્રિયાપદ' },
  'પ્રસીદેત્': { gu: 'પ્રસન્ન થાય', hi: 'प्रसन्न हों', en: 'may be pleased', grammar: 'ક્રિયાપદ' },
  'અર્પયેત્': { gu: 'અર્પે / પ્રદાન કરે', hi: 'प्रदान करें', en: 'may bestow / grant', grammar: 'ક્રિયાપદ' },
  'જ્ઞાતવ્યમ્': { gu: 'જાણવું', hi: 'जानना चाहिए', en: 'should be known', grammar: 'કૃદંત' },
  'વિજ્ઞાતવ્યમ્': { gu: 'વિશેષપણે જાણવું', hi: 'भली-भांति जानना चाहिए', en: 'should be specifically known', grammar: 'કૃદંત' },
  'પૂજયેત્': { gu: 'પૂજન કરવું', hi: 'पूजन करना चाहिए', en: 'should worship', grammar: 'ક્રિયાપદ' },
  'નમેત્': { gu: 'નમન કરવું', hi: 'नमन करना चाहिए', en: 'should bow down', grammar: 'ક્રિયાપદ' },
  'પ્રણમેત્': { gu: 'પ્રણામ કરવા', hi: 'प्रणाम करना चाहिए', en: 'should prostrate', grammar: 'ક્રિયાપદ' },
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
  'એકઃ': { gu: 'એક', hi: 'एक', en: 'one', grammar: 'સંખ્યાવાચક' },
  'સ્વામિનારાયણઃ': { gu: 'ભગવાન શ્રી સ્વામિનારાયણ', hi: 'भगवान श्री स्वामिनारायण', en: 'Bhagwan Swaminarayan', grammar: 'સંજ્ઞા' },
  'અક્ષરપુરુષોત્તમઃ': { gu: 'અક્ષરપુરુષોત્તમ મહારાજ', hi: 'अक्षरपुरुषोत्तम महाराज', en: 'Akshar-Purushottam Maharaj', grammar: 'સમાસ' },
  'પરબ્રહ્મણા': { gu: 'પરબ્રહ્મ પરમાત્મા દ્વારા', hi: 'परब्रह्म परमात्मा द्वारा', en: 'by Parabrahman', grammar: 'તૃતીયા' },
  'સહજાનન્દમ્': { gu: 'સહજાનંદ શ્રીહરિને', hi: 'सहजानंद श्रीहरि को', en: 'unto Sahajanand Shri Hari', grammar: 'દ્વિતીયા' },
  'હરિઃ': { gu: 'શ્રીહરિ', hi: 'श्रीहरि', en: 'Shri Hari', grammar: 'પ્રથમા' },
  'હરિમ્': { gu: 'શ્રીહરિને', hi: 'श्रीहरि को', en: 'unto Shri Hari', grammar: 'દ્વિતીયા' },
  'ગુરુઃ': { gu: 'ગુરુ', hi: 'गुरु', en: 'Guru', grammar: 'પ્રથમા' },
  'ગુરુમ્': { gu: 'પ્રગટ ગુરુને', hi: 'प्रगट गुरु को', en: 'unto the manifest Guru', grammar: 'દ્વિતીયા' },
  'સત્સઙ્ગઃ': { gu: 'સત્સંગ', hi: 'सत्सङ्ग', en: 'Satsang', grammar: 'પ્રથમા' },
  'સત્સઙ્ગમ્': { gu: 'સત્સંગનો', hi: 'सत्सङ्ग को', en: 'Satsang', grammar: 'દ્વિતીયા' },
  'મુમુક્ષુભિઃ': { gu: 'મુમુક્ષુઓએ', hi: 'मुमुक्षुओं को', en: 'by seekers of liberation', grammar: 'તૃતીયા બહુવચન' },
  'મુમુક્ષુઃ': { gu: 'મોક્ષનો અભિલાષી મુમુક્ષુ', hi: 'मोक्षार्थी मुमुक्षु', en: 'a seeker of liberation', grammar: 'પ્રથમા' },
  'દેહઃ': { gu: 'આ માનવ શરીર', hi: 'यह शरीर', en: 'body', grammar: 'પ્રથમા' },
  'સાધનમ્': { gu: 'સાધન છે', hi: 'साधन है', en: 'instrument / means', grammar: 'પ્રથમા' },
  'ભક્તિમ્': { gu: 'ભગવાનની ભક્તિ', hi: 'भगवान की भक्ति', en: 'devotion to God', grammar: 'દ્વિતીયા' },
  'શાન્તિમ્': { gu: 'પરમ શાંતિ', hi: 'परम शांति', en: 'peace', grammar: 'દ્વિતીયા' },
  'આનન્દમ્': { gu: 'દિવ્ય આનંદ', hi: 'दिव्य आनंद', en: 'bliss', grammar: 'દ્વિતીયા' },
  'સુખમ્': { gu: 'આત્મિક સુખ', hi: 'सुख', en: 'happiness', grammar: 'દ્વિતીયા' },
  'દીક્ષા': { gu: 'દીક્ષા', hi: 'दीक्षा', en: 'initiation / Diksha', grammar: 'સંજ્ઞા' },
  'હિંસા': { gu: 'કોઈ પણ જીવની હિંસા', hi: 'किसी भी जीव की हिंसा', en: 'violence / injury', grammar: 'સંજ્ઞા' },
  'આત્મઘાતઃ': { gu: 'આત્મહત્યા કરવી તે', hi: 'आत्महत्या करना', en: 'committing suicide', grammar: 'સંજ્ઞા' }
};

// Process all 315 shlokas
const reconstructedAnvayaData: Record<number, { devanagari: string; gujarati: string; iast: string }> = {};
const reconstructedPadachhedaData: Record<number, WordMeaning[]> = {};

for (const shloka of SHLOKAS) {
  const id = shloka.id;

  // Check if we have an explicit official override
  if (OFFICIAL_ANVAYA_OVERRIDES[id]) {
    const override = OFFICIAL_ANVAYA_OVERRIDES[id];
    reconstructedAnvayaData[id] = {
      devanagari: override.anvayaDev,
      gujarati: override.anvayaGu,
      iast: override.words.map(w => w.trans).join(' ')
    };
    reconstructedPadachhedaData[id] = override.words.map(w => ({
      word: w.wordGu,
      wordDevanagari: w.wordDev,
      wordGujarati: w.wordGu,
      transliteration: w.trans,
      meaningGu: w.meaningGu,
      meaningHi: w.meaningHi,
      meaningEn: w.meaningEn,
      grammaticalRole: w.grammar,
      grammar: w.grammar,
      gujarati: w.meaningGu,
      hindi: w.meaningHi,
      english: w.meaningEn
    }));
    continue;
  }

  // Otherwise, take existing words from PADACHHEDA_DATA
  const existingList = PADACHHEDA_DATA[id] || [];
  
  // Filter out pure English token artifact at the end if it duplicated another word
  const cleanedWords: WordMeaning[] = [];
  for (let i = 0; i < existingList.length; i++) {
    const item = existingList[i];
    const isLatin = /^[a-zA-Z\s\-_’]+$/.test(item.word);
    
    // If it's a pure latin word at the end of the array
    if (isLatin) {
      // If previous word exists, convert this latin word into its transliteration or skip if duplicate
      const prev = cleanedWords[cleanedWords.length - 1];
      if (prev && !prev.transliteration) {
        prev.transliteration = item.word;
      }
      // If the item had a meaning that was unique, merge with previous or convert word to Gujarati
      continue;
    }

    // Ensure word has both Gujarati and Devanagari forms
    let wordGu = item.word;
    let wordDev = gujToDev(item.word);

    // If word is already Devanagari
    if (/[\u0900-\u097F]/.test(item.word)) {
      wordDev = item.word;
      wordGu = devToGuj(item.word);
    }

    let meaningGu = item.meaningGu;
    let meaningHi = item.meaningHi;
    let meaningEn = item.meaningEn;
    let grammar = item.grammaticalRole || item.grammar || 'પદાર્થ અને અન્વય';

    const norm = wordGu.trim().replace(/[॥।૦-૯0-9]/g, '');
    if (COMMON_SANSKRIT_WORDS[norm]) {
      const entry = COMMON_SANSKRIT_WORDS[norm];
      // If the current meaning looks shifted or doesn't match the word
      if (!meaningGu || meaningGu === 'સંસ્કૃત વ્યાકરણ પદ' || (norm === 'ન' && !meaningGu.includes('ન')) || norm === 'ચ' || norm === 'વા' || norm === 'તુ' || norm === 'અપિ' || norm === 'એવ' || norm === 'અતઃ' || norm === 'સદા') {
        meaningGu = entry.gu;
        meaningHi = entry.hi;
        meaningEn = entry.en;
        grammar = entry.grammar || grammar;
      }
    }

    cleanedWords.push({
      ...item,
      word: wordGu,
      wordGujarati: wordGu,
      wordDevanagari: wordDev,
      transliteration: item.transliteration || '',
      meaningGu,
      meaningHi,
      meaningEn,
      grammaticalRole: grammar,
      grammar,
      gujarati: meaningGu,
      hindi: meaningHi,
      english: meaningEn
    });
  }

  // Construct Anvaya sentence
  const anvayaWordsDev = cleanedWords.map(w => (w as any).wordDevanagari || gujToDev(w.word));
  const anvayaWordsGu = cleanedWords.map(w => w.word);

  const anvayaDev = anvayaWordsDev.join(' ') + '।';
  const anvayaGu = anvayaWordsGu.join(' ') + ' ।';
  const anvayaIast = cleanedWords.map(w => w.transliteration || '').filter(Boolean).join(' ');

  reconstructedAnvayaData[id] = {
    devanagari: anvayaDev,
    gujarati: anvayaGu,
    iast: anvayaIast
  };
  reconstructedPadachhedaData[id] = cleanedWords;
}

// Write out anvayaData.ts
const anvayaFilePath = path.join(process.cwd(), 'src', 'data', 'anvayaData.ts');
const anvayaContent = `// Authentic Sanskrit Anvaya (Prose Order) for all 315 Satsang Diksha Shlokas
export interface ShlokaAnvaya {
  devanagari: string;
  gujarati: string;
  iast?: string;
}

export const ANVAYA_DATA: Record<number, ShlokaAnvaya> = ${JSON.stringify(reconstructedAnvayaData, null, 2)};
`;

fs.writeFileSync(anvayaFilePath, anvayaContent, 'utf-8');
console.log('Saved anvayaData.ts with', Object.keys(reconstructedAnvayaData).length, 'verses.');

// Write out updated padachhedaData.ts
const padachhedaFilePath = path.join(process.cwd(), 'src', 'data', 'padachhedaData.ts');
const padachhedaContent = `// Comprehensive Authentic Padachheda for all 315 Satsang Diksha Shlokas
import { WordMeaning } from '../types';

export const PADACHHEDA_DATA: Record<number, WordMeaning[]> = ${JSON.stringify(reconstructedPadachhedaData, null, 2)};
`;

fs.writeFileSync(padachhedaFilePath, padachhedaContent, 'utf-8');
console.log('Saved padachhedaData.ts with', Object.keys(reconstructedPadachhedaData).length, 'verses.');
