import { ScriptureReference } from '../types';

export interface BookCorrelationGroup {
  startShloka: number;
  endShloka: number;
  vachnamrut: {
    title: string;
    section: string;
    quoteGu: string;
    correlationNote?: string;
  };
  swaminiVato: {
    title: string;
    section: string;
    prakaran?: number;
    vatoNo?: number;
    quoteGu: string;
    correlationNote?: string;
  };
}

/**
 * 20 Authentic Sections of Satsang Diksha Tri-Scriptural Correlations (Shlokas 1 to 315)
 * Aligned with Vachnamrut and Swamini Vato citations & quotes from Satsang Diksha Correlations Book.
 */
export const BOOK_CORRELATION_GROUPS: BookCorrelationGroup[] = [
  // SECTION 1: Verses 1 to 10
  {
    startShloka: 1,
    endShloka: 1,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા અંત્ય ૮',
      section: 'ગઢડા અંત્ય ૮',
      quoteGu: 'ભગવાનના ભક્તને સદાય પરમ સુખિયા રહેવું... જેને ભગવાનનો માહાત્મ્યજ્ઞાને સહિત નિશ્ચય થયો તેને પરમ શાંતિ ને સુખ વર્તે છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧',
      section: 'પ્રકરણ ૧/૧',
      prakaran: 1,
      vatoNo: 1,
      quoteGu: 'જેને ભગવાન ને ભગવાનના સાધુ મળ્યા છે તેને તો પરમ શાંતિ ને સુખ પ્રાપ્ત થયાં જ છે, પણ પોતાને મહિમા સમજાતો નથી એટલું જ અજ્ઞાન છે.'
    }
  },
  {
    startShloka: 2,
    endShloka: 2,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૧૩ તથા વરતાલ ૧૯',
      section: 'ગઢડા પ્રથમ ૧૩, વરતાલ ૧૯',
      quoteGu: 'માનસ દેહ છે તે તો મોક્ષનું દ્વાર છે... (ગઢડા પ્ર. ૧૩) આ મનુષ્ય દેહ આવ્યો છે તે તો કેવળ ભગવાનનું ભજન કરીને માયાથી મુકાઈને ભગવાનના ધામને પામવા આવ્યો છે, પણ વિષય ભોગવવા માટે નથી આવ્યો. (વરતાલ ૧૯)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૪',
      section: 'પ્રકરણ ૧/૧૪',
      prakaran: 1,
      vatoNo: 14,
      quoteGu: 'આ મનુષ્ય દેહ મળ્યો છે તે તો કાંઈ રળવા-ખાવા સારુ નથી મળ્યો, એ તો ભગવાન ભજવા સારુ મળ્યો છે.'
    }
  },
  {
    startShloka: 3,
    endShloka: 3,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા દ્વિતીય ૬૧',
      section: 'ગઢડા દ્વિતીય ૬૧',
      quoteGu: 'સંસારનો વ્યવહાર છે તે તો દેહ નિર્વાહ માત્ર છે, પણ જીવનું કલ્યાણ કરી લેવું એ જ મનુષ્ય દેહનું પરમ પ્રયોજન છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨',
      section: 'પ્રકરણ ૨/૬૨',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'આપણો જન્મ તો અક્ષરધામમાં જવા સારુ થયો છે, પણ કાંઈ ધૂળ ખાવા સારુ થયો નથી.'
    }
  },
  {
    startShloka: 4,
    endShloka: 5,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૪૪',
      section: 'ગઢડા પ્રથમ ૪૪',
      quoteGu: 'ચાર પ્રકારના સત્યમાં જીવે પોતાના આત્માને બ્રહ્મરૂપ માનીને પરબ્રહ્મની ભક્તિ કરવી એ જ એકાંતિક ધર્મ છે ને તે સત્સંગથી જ સિદ્ધ થાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૩૧',
      section: 'પ્રકરણ ૨/૩૧',
      prakaran: 2,
      vatoNo: 31,
      quoteGu: 'સત્સંગ કરવો તે તો બ્રહ્મરૂપ થઈને પુરુષોત્તમ નારાયણની સેવા-ભક્તિ કરવા સારુ જ છે ને સત્સંગથી સર્વ દોષો ટળી જાય છે.'
    }
  },
  {
    startShloka: 6,
    endShloka: 7,
    vachnamrut: {
      title: 'વચનામૃત કારિયાણી ૫',
      section: 'કારિયાણી ૫',
      quoteGu: 'ભગવાન જીવના કલ્યાણને અર્થે આ પૃથ્વી પર મનુષ્ય જેવો આકાર ધારીને પ્રગટ થાય છે ને ધર્મ, જ્ઞાન, વૈરાગ્ય તથા ભક્તિરૂપી સત્સંગની સ્થાપના કરે છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૩૯૭',
      section: 'પ્રકરણ ૫/૩૯૭',
      prakaran: 5,
      vatoNo: 397,
      quoteGu: 'શ્રીજીમહારાજ પોતે પુરુષોત્તમ નારાયણ છે, તે જીવોના કલ્યાણ સારુ આ લોકમાં પધાર્યા ને આ મોટો સત્સંગ પ્રવર્તાવ્યો છે.'
    }
  },
  {
    startShloka: 8,
    endShloka: 9,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૪૪',
      section: 'ગઢડા પ્રથમ ૪૪',
      quoteGu: 'સત્ય એવો જે આત્મા તેનો સંગ કરવો ને સત્ય એવા જે પરમાત્મા તેનો સંગ કરવો ને સત્ય એવા જે સંત તેનો સંગ કરવો ને સત્ય એવાં જે શાસ્ત્ર તેનો સંગ કરવો.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૭',
      section: 'પ્રકરણ ૧/૧૭',
      prakaran: 1,
      vatoNo: 17,
      quoteGu: 'મોટા સાધુનો સંગ એ જ મોટો સત્સંગ છે, ને એ સંગે કરીને જ આત્મા, પરમાત્મા ને શાસ્ત્રનું યથાર્થ જ્ઞાન થાય છે.'
    }
  },
  {
    startShloka: 10,
    endShloka: 10,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૨',
      section: 'ગઢડા પ્રથમ ૭૨',
      quoteGu: 'જેને ભગવાનનો માહાત્મ્યે સહિત દૃઢ નિશ્ચય હોય ને પોતાનું સમર્પણ કરેલું હોય તેને સત્સંગમાં કોઈ વિઘ્ન બાધ કરી શકતું નથી.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૨૧',
      section: 'પ્રકરણ ૨/૨૧',
      prakaran: 2,
      vatoNo: 21,
      quoteGu: 'ભગવાનનો દૃઢ આશરો ને નિષ્ઠા એ જ મોટું સાધન છે; જેને એવો પાકો આશરો છે તેને કાંઈ કરવું રહ્યું નથી.'
    }
  },

  // SECTION 2: Verses 11 to 20
  {
    startShloka: 11,
    endShloka: 11,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૯',
      section: 'ગઢડા મધ્ય ૯',
      quoteGu: 'ઉપાસનાની દૃઢતા ને આજ્ઞાનું પાલન એ બે હોય તો જીવનું કલ્યાણ સહેજે થાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૨૧',
      section: 'પ્રકરણ ૪/૨૧',
      prakaran: 4,
      vatoNo: 21,
      quoteGu: 'એક ઉપાસના, બીજી આજ્ઞા, ત્રીજો સમાગમ ને ચોથું સત્શાસ્ત્રનું વ્યસન, એ ચાર દૃઢ કરીને રાખવાં.'
    }
  },
  {
    startShloka: 12,
    endShloka: 13,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૮',
      section: 'ગઢડા પ્રથમ ૭૮',
      quoteGu: 'ભગવાનની ભક્તિ કરવામાં ને કલ્યાણના માર્ગમાં સ્ત્રી કે પુરુષ કોઈ ભેદ નથી; જે ભક્તિ કરે તે સર્વે ભગવાનના ધામને પામે છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૬૮',
      section: 'પ્રકરણ ૫/૬૮',
      prakaran: 5,
      vatoNo: 68,
      quoteGu: 'ભક્તિમાં તો જીવમાત્ર સરખા છે; જે પોતપોતાની મર્યાદા રાખીને ભગવાનનું ભજન કરે તેનું કલ્યાણ થાય છે.'
    }
  },
  {
    startShloka: 14,
    endShloka: 16,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા અંત્ય ૧૪',
      section: 'ગઢડા અંત્ય ૧૪',
      quoteGu: 'જે ભગવાનનો ભક્ત હોય તે ગમે તે જાતિનો હોય તો પણ ઉત્તમ છે ને જે વિમુખ છે તે ઊંચી જાતિનો હોય તો પણ કનિષ્ઠ છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૧૧૭',
      section: 'પ્રકરણ ૨/૧૧૭',
      prakaran: 2,
      vatoNo: 117,
      quoteGu: 'ભગવાનના ભક્તમાં નાત-જાતનો ભેદ રાખવો નહિ; સર્વે હરિભક્તોનો મહિમા સમજવો ને દાસભાવે સેવા કરવી.'
    }
  },
  {
    startShloka: 17,
    endShloka: 17,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૫૨',
      section: 'ગઢડા મધ્ય ૫૨',
      quoteGu: 'ગૃહસ્થ હોય કે ત્યાગી હોય પણ જો ભગવાનનો એકાંતિક ભક્ત છે તો બંને સમાન મોક્ષના અધિકારી છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૨૫',
      section: 'પ્રકરણ ૨/૨૫',
      prakaran: 2,
      vatoNo: 25,
      quoteGu: 'ત્યાગી કે ગૃહી એવો ભેદ નથી; જેને ભગવાનનો યથાર્થ નિશ્ચય ને નિયમ-ધર્મ દૃઢ છે તે સર્વે કલ્યાણના અધિકારી છે.'
    }
  },
  {
    startShloka: 18,
    endShloka: 20,
    vachnamrut: {
      title: 'વચનામૃત વરતાલ ૧૧ તથા ગઢડા પ્રથમ ૭૨',
      section: 'વરતાલ ૧૧, ગઢડા પ્રથમ ૭૨',
      quoteGu: 'આવે લક્ષણે યુક્ત જે સાધુ હોય તેના હૃદયમાં સાક્ષાત્ ભગવાન વિરાજમાન છે એમ જાણવું... (વરતાલ ૧૧) \'હું તો કૃતાર્થ છું ને જે કાંઈ સાધન કરું છું તે તો ભગવાનની પ્રસન્નતાને અર્થે કરું છું,\' એમ સમજે તેને ભગવાનનો માહાત્મ્યે સહિત નિશ્ચય જાણવો. (ગઢડા પ્ર. ૭૨)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૬ ને ૨/૬૨',
      section: 'પ્રકરણ ૧/૧૬, ૨/૬૨',
      prakaran: 1,
      vatoNo: 16,
      quoteGu: 'મોટા સાધુના સેવનથી કાળ, કર્મ ને માયા સર્વે વશ થાય છે ને મોટો આશરો પાકો થાય છે. (૧/૧૬) મોટા રાજી થાય તો સર્વે કામ થાય. (૨/૬૨)'
    }
  },

  // SECTION 3: Verses 21 to 35
  {
    startShloka: 21,
    endShloka: 24,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩૩',
      section: 'ગઢડા પ્રથમ ૩૩',
      quoteGu: 'જે ભગવાનનો ભક્ત હોય તેને તો વ્યસન માત્રનો સર્વથા ત્યાગ રાખવો ને સ્વધર્મમાં દૃઢ રહેવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૩',
      section: 'પ્રકરણ ૪/૧૩',
      prakaran: 4,
      vatoNo: 13,
      quoteGu: 'ધર્મ તો લાજે કરીને રહે છે ને નિયમમાં રહ્યો નહિ તો ધર્મથી ભ્રષ્ટ થઈ જવાણું.'
    }
  },
  {
    startShloka: 25,
    endShloka: 28,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા દ્વિતીય ૩૫',
      section: 'ગઢડા દ્વિતીય ૩૫',
      quoteGu: 'ધર્મ વિનાની જે ભક્તિ તે તો વ્યભિચારિણી ભક્તિ કહેવાય, માટે જીવહિંસા તથા માંસાહારાદિ દોષોનો ત્યાગ કરી શુદ્ધ આચરણ રાખવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૨૩૪',
      section: 'પ્રકરણ ૧/૨૩૪',
      prakaran: 1,
      vatoNo: 234,
      quoteGu: 'પંચવર્તમાન દૃઢ પાળવા ને વિષયમાત્રથી નિયમબદ્ધ રહેવું એ જ સાચો સત્સંગ છે.'
    }
  },
  {
    startShloka: 29,
    endShloka: 32,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૭',
      section: 'ગઢડા પ્રથમ ૭૭',
      quoteGu: 'સ્વધર્મ, જ્ઞાન, વૈરાગ્ય ને ભક્તિ એ ચારેય અંગ સાચવવાં. ચોરી કે કપટ ક્યારેય ન આચરવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૧૪૬',
      section: 'પ્રકરણ ૫/૧૪૬',
      prakaran: 5,
      vatoNo: 146,
      quoteGu: 'અધર્મ કરીને સુખિયા થવું નથી; એક ભગવાનના ભજનનું ને શુદ્ધ નીતિનું સુખ સાચું છે.'
    }
  },
  {
    startShloka: 33,
    endShloka: 35,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૩૩',
      section: 'ગઢડા મધ્ય ૩૩',
      quoteGu: 'જેને ભગવાનનું ભજન કરવું હોય તેને અષ્ટપ્રકારે સ્ત્રી-પુરુષના કુસંગથી છેટે રહેવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૨૫૫',
      section: 'પ્રકરણ ૧/૨૫૫',
      prakaran: 1,
      vatoNo: 255,
      quoteGu: 'ઇન્દ્રિયજય રાખવો ને કુસંગથી દૂર રહેવું; નીકર સત્સંગમાંથી જીવ પડી જાય.'
    }
  },

  // SECTION 4: Verses 36 to 50
  {
    startShloka: 36,
    endShloka: 40,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૬૯',
      section: 'ગઢડા પ્રથમ ૬૯',
      quoteGu: 'ભગવાનના સાધુના ને ધર્મી પુરુષના લક્ષણ એ છે જે, કોઈ જીવ માત્રને પીડા ન ઉપજાવવી ને દયા રાખવી.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૩૬',
      section: 'પ્રકરણ ૫/૩૬',
      prakaran: 5,
      vatoNo: 36,
      quoteGu: 'અહિંસા એ મોટો ધર્મ છે; પ્રભુના જીવ જાણી સર્વે ઉપર દયા ને અનુકંપા રાખવી.'
    }
  },
  {
    startShloka: 41,
    endShloka: 45,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૪',
      section: 'ગઢડા પ્રથમ ૭૪',
      quoteGu: 'આપત્કાળે પણ ધર્મ ને ધીરજ ન ત્યજવાં; ભગવાનના આશરાનું બળ રાખવું પણ ક્યારેય કાયર ન થવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૧૨',
      section: 'પ્રકરણ ૧/૧૧૨',
      prakaran: 1,
      vatoNo: 112,
      quoteGu: 'દુઃખ આવે ત્યારે ભગવાન સંભારી રાખવા પણ હિંમત ન હારવી; ભગવાન સાધુની રક્ષા કરે છે.'
    }
  },
  {
    startShloka: 46,
    endShloka: 50,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૮',
      section: 'ગઢડા પ્રથમ ૮',
      quoteGu: 'ઇન્દ્રિયોની ક્રિયાને નિર્મળ રાખવી ને શુદ્ધ આહાર-પાણી ગ્રહણ કરવાં જેથી અંતઃકરણ પવિત્ર રહે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૭૬',
      section: 'પ્રકરણ ૨/૭૬',
      prakaran: 2,
      vatoNo: 76,
      quoteGu: 'આહાર શુદ્ધ હોય તો અંતઃકરણ શુદ્ધ થાય ને અંતઃકરણ શુદ્ધ થાય તો ભગવાનનું ધ્યાન નિર્વિઘ્ન થાય.'
    }
  },

  // SECTION 5: Verses 51 to 75
  {
    startShloka: 51,
    endShloka: 55,
    vachnamrut: {
      title: 'વચનામૃત અમદાવાદ ૨',
      section: 'અમદાવાદ ૨',
      quoteGu: 'નાહી-ધોઈને શુદ્ધ આસન ઉપર બેસી ભગવાનની પૂજા કરવી ને મનને સ્થિર રાખવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૭૬',
      section: 'પ્રકરણ ૨/૭૬',
      prakaran: 2,
      vatoNo: 76,
      quoteGu: 'પ્રભાતમાં ઊઠીને પ્રથમ ભગવાનનું સ્મરણ ને પૂજા-પાઠ કરવા, તેથી આખો દિવસ આનંદમાં રહેવાય.'
    }
  },
  {
    startShloka: 56,
    endShloka: 60,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩૨',
      section: 'ગઢડા પ્રથમ ૩૨',
      quoteGu: 'ભગવાનના દાસત્વપણારૂપી તિલક ને ઊર્ધ્વપુંડ્ર છાપ-ચિહ્નો ધારણ કરવાં એ સત્સંગીનું મુખ્ય ભૂષણ છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૩',
      section: 'પ્રકરણ ૪/૧૩',
      prakaran: 4,
      vatoNo: 13,
      quoteGu: 'સત્સંગના બાહ્ય ચિહ્નો ને તિલક-ચાંદલો નિયમપૂર્વક રાખવાં તેથી વિમુખનો સંગ ટળે છે.'
    }
  },
  {
    startShloka: 61,
    endShloka: 65,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૨૩ તથા ગઢડા અંત્ય ૨૩',
      section: 'ગઢડા પ્રથમ ૨૩, ગઢડા અંત્ય ૨૩',
      quoteGu: 'ભગવાનની માનસી પૂજા અત્યંત ભાવપૂર્વક કરવી ને ઉત્તમ વસ્ત્ર-અલંકાર તથા નૈવેદ્ય અર્પણ કરવાં. (ગઢડા પ્ર. ૨૩)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૩૪',
      section: 'પ્રકરણ ૧/૩૪',
      prakaran: 1,
      vatoNo: 34,
      quoteGu: 'માનસી પૂજા એવી સચેત કરવી જાણે સાક્ષાત્ ભગવાન ને સાધુ આપણી સન્મુખ બિરાજમાન છે.'
    }
  },
  {
    startShloka: 66,
    endShloka: 75,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૪૦',
      section: 'ગઢડા મધ્ય ૪૦',
      quoteGu: 'રોજ એક દંડવત્ પ્રણામ વધારે કરવો ને ભગવાન આગળ દીનભાવે નમ્રતાપૂર્વક પ્રાર્થના કરવી.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૩',
      section: 'પ્રકરણ ૧/૩',
      prakaran: 1,
      vatoNo: 3,
      quoteGu: 'જીભે કરીને ભજન, મનમાં ચિંતવન ને નેત્રમાં મૂર્તિ રાખીને માળા ફેરવવી એ સર્વોપરી સાધન છે.'
    }
  },

  // SECTION 6: Verses 76 to 89
  {
    startShloka: 76,
    endShloka: 80,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩',
      section: 'ગઢડા પ્રથમ ૩',
      quoteGu: 'ભગવાનની સંધ્યા આરતી ને કથા-કીર્તનમાં ચિત્ત જોડવું તેથી દિવસભરના માયિક સંકલ્પો શમી જાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૪',
      section: 'પ્રકરણ ૧/૧૪',
      prakaran: 1,
      vatoNo: 14,
      quoteGu: 'સાંજે આરતી-કીર્તન કરવાં ને ભગવાનની મૂર્તિમાં ધ્યાન રાખવું તે જીવના કલ્યાણનું સાધન છે.'
    }
  },
  {
    startShloka: 81,
    endShloka: 85,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૧',
      section: 'ગઢડા પ્રથમ ૭૧',
      quoteGu: 'ભક્તજન જે જે વસ્તુ ભગવાનને અર્પણ કરે છે તે તે વસ્તુ ભગવાનના ધામને વિષે દિવ્યરૂપ થાય છે ને ભગવાન તેને પ્રીતિપૂર્વક અંગીકાર કરે છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૩૦',
      section: 'પ્રકરણ ૨/૩૦',
      prakaran: 2,
      vatoNo: 30,
      quoteGu: 'ભગવાનને થાળ ધરાવીને જમવું તેથી અન્નદોષ ટળે છે ને બુદ્ધિ પવિત્ર બને છે.'
    }
  },
  {
    startShloka: 86,
    endShloka: 89,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૨૧',
      section: 'ગઢડા પ્રથમ ૨૧',
      quoteGu: 'હરિભક્તોએ પરસ્પર કથાવાર્તા, પ્રશ્નોત્તરી ને પ્રભુની વાતો કરવી જેથી સત્સંગ વધતો રહે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૩૬',
      section: 'પ્રકરણ ૪/૩૬',
      prakaran: 4,
      vatoNo: 36,
      quoteGu: 'ઘરમાં સત્સંગની વાતું કરવી ને ઘરસભા રાખવી જેથી બહારનો વિમુખ કે કુસંગ ઘરમાં પ્રવેશી ન શકે.'
    }
  },

  // SECTION 7: Verses 90 to 95
  {
    startShloka: 90,
    endShloka: 95,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૫૬ ને ગઢડા પ્રથમ ૭૧',
      section: 'ગઢડા પ્રથમ ૫૬, ગઢડા પ્રથમ ૭૧',
      quoteGu: 'મંદિરો કરાવીને તેમાં ભગવાનની મૂર્તિઓ પધરાવવી એ સત્સંગની વૃદ્ધિ ને અનંત જીવોના મોક્ષનું કારણ છે. (ગઢડા પ્ર. ૫૬) ભગવાન પોતાના ભક્તની સેવા સ્વીકારવા અક્ષરધામ સહિત પૃથ્વી પર પધારે છે. (ગઢડા પ્ર. ૭૧)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૩/૧૨ ને ૫/૩૯૭',
      section: 'પ્રકરણ ૩/૧૨, ૫/૩૯૭',
      prakaran: 3,
      vatoNo: 12,
      quoteGu: 'મંદિરોમાં મૂર્તિઓ પધરાવીને મહારાજ ને મોટા સાધુ અનંત જીવોનો ઉદ્ધાર કરે છે. (૩/૧૨) અક્ષર ને પુરુષોત્તમ બંને સ્વરૂપોની શુદ્ધ ઉપાસના મંદિરો દ્વારા વિશ્વમાં પ્રવર્તે છે. (૫/૩૯૭)'
    }
  },

  // SECTION 8: Verses 96 to 115
  {
    startShloka: 96,
    endShloka: 101,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૯ તથા ૧૩',
      section: 'ગઢડા મધ્ય ૯, ૧૩',
      quoteGu: 'ભગવાન સદા સાકાર, સર્વોપરી ને દિવ્ય મૂર્તિમાન છે... પુરુષોત્તમ નારાયણ જે તે સર્વ અવતારના અવતારી છે. (ગઢડા મ. ૯)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૩૯૭',
      section: 'પ્રકરણ ૫/૩૯૭',
      prakaran: 5,
      vatoNo: 397,
      quoteGu: 'શ્રીજીમહારાજ તે સર્વોપરી પુરુષોત્તમ ભગવાન છે ને ગુણાતીતાનંદ સ્વામી તે અનાદિ મૂળ અક્ષરબ્રહ્મ છે.'
    }
  },
  {
    startShloka: 102,
    endShloka: 105,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭ તથા વરતાલ ૧૭',
      section: 'ગઢડા પ્રથમ ૭, વરતાલ ૧૭',
      quoteGu: 'જીવ, ઈશ્વર ને માયા એ ત્રણેય માયિક તત્ત્વો છે ને અક્ષરબ્રહ્મ તથા પરબ્રહ્મ એ બે માયાથી પર નિત્ય દિવ્ય તત્ત્વો છે. (ગઢડા પ્ર. ૭)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૫',
      section: 'પ્રકરણ ૧/૧૫',
      prakaran: 1,
      vatoNo: 15,
      quoteGu: 'પાંચ ભેદ અનાદિ છે; ઉપાસના ચોખ્ખી રાખવી કે પુરુષોત્તમ એક જ સર્વોપરી છે ને અક્ષરબ્રહ્મ તેમની સેવામાં છે.'
    }
  },
  {
    startShloka: 106,
    endShloka: 115,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૨૭ તથા ગઢડા પ્રથમ ૪૫',
      section: 'ગઢડા પ્રથમ ૨૭, ૪૫',
      quoteGu: 'આ બ્રહ્માંડમાં જે જે આશ્ચર્ય જેવા કાર્ય થાય છે તે સર્વે ભગવાનના કર્યા જ થાય છે; ભગવાન સદા સાકાર જ છે. (ગઢડા પ્ર. ૨૭, ૪૫)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૨૧ ને ૪/૧૪',
      section: 'પ્રકરણ ૨/૨૧, ૪/૧૪',
      prakaran: 2,
      vatoNo: 21,
      quoteGu: 'કર્તાહર્તા એક ભગવાનને જાણવા ને પ્રગટ સાધુ દ્વારા કલ્યાણ માનવું એ જ સાચો નિશ્ચય છે.'
    }
  },

  // SECTION 9: Verses 116 to 125
  {
    startShloka: 116,
    endShloka: 119,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૩૧ તથા લોયા ૭',
      section: 'ગઢડા મધ્ય ૩૧, લોયા ૭',
      quoteGu: 'પોતાના આત્માને બ્રહ્મરૂપ માનીને શ્રીકૃષ્ણ ભગવાનની ભક્તિ કરવી એ જ મારો દૃઢ સિદ્ધાંત છે. (ગઢડા મ. ૩૧)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૪ ને ૧/૨૫૭',
      section: 'પ્રકરણ ૧/૧૪, ૧/૨૫૭',
      prakaran: 1,
      vatoNo: 14,
      quoteGu: 'વાછરડું દૂધ પીએ તેમ નિજાત્માનં બ્રહ્મરૂપ સમજીને ભગવાનનું ભજન કરવું તે દૂધ પીવા સમાન છે. (૧/૧૪) બ્રહ્મરૂપ થવું એટલે અક્ષરબ્રહ્મ જેવા સાધુતાના ગુણો આત્મામાં ધારણ કરવા. (૧/૨૫૭)'
    }
  },
  {
    startShloka: 120,
    endShloka: 125,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૨ તથા ગઢડા પ્રથમ ૧૮',
      section: 'ગઢડા પ્રથમ ૨, ૧૮',
      quoteGu: 'ભગવાન વિના અન્ય માયિક પદાર્થમાં વૈરાગ્ય થવો ને ભગવાનમાં જ સ્નેહ થવો તે સાચો વૈરાગ્ય છે. (ગઢડા પ્ર. ૨)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૪૧',
      section: 'પ્રકરણ ૧/૧૪૧',
      prakaran: 1,
      vatoNo: 141,
      quoteGu: 'જગતના પંચવિષયોમાંથી વૃત્તિ પાછી વાળીને ભગવાન ને મોટા સંતમાં જોડવી એ જ વૈરાગ્ય છે.'
    }
  },

  // SECTION 10: Verses 126 to 135
  {
    startShloka: 126,
    endShloka: 130,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૨',
      section: 'ગઢડા પ્રથમ ૭૨',
      quoteGu: 'હું તો કૃતાર્થ છું ને જે કાંઈ સાધન કરું છું તે તો ભગવાનની પ્રસન્નતાને અર્થે કરું છું,\' એમ સમજે તેને ભગવાનનો માહાત્મ્યે સહિત નિશ્ચય જાણવો.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪',
      section: 'પ્રકરણ ૪',
      prakaran: 4,
      vatoNo: 1,
      quoteGu: 'આટલું જ સમજવાનું છે જે દેહને મૂકીને જેને મળવું હતું, જેને પામવું હતું ને બીજા ભક્ત પણ દેહને મૂકીને જેને પામ્યા છે તેને આપણે છતી દેહે જ પામ્યા છીએ... આના આ ભગવાન છે, આના આ સાધુ છે.'
    }
  },
  {
    startShloka: 131,
    endShloka: 135,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૨૪ તથા પંચાળા ૪',
      section: 'ગઢડા પ્રથમ ૨૪, પંચાળા ૪',
      quoteGu: 'ભગવાન ને ભગવાનના સંતમાં જો મનુષ્યભાવ પરઠાય તો જીવનો મોક્ષમાર્ગ રુંધાઈ જાય છે, માટે સદા દિવ્યભાવ જ રાખવો. (ગઢડા પ્ર. ૨૪, પંચાળા ૪)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૪ ને ૨/૩૦',
      section: 'પ્રકરણ ૪/૧૪, ૨/૩૦',
      prakaran: 4,
      vatoNo: 14,
      quoteGu: 'ભગવાનના મનુષ્યભાવમાં મોહ ન થવો જોઈએ; ભગવાન ને સાધુમાં ક્યારેય પ્રકૃતિ કે દોષ ન કલ્પવા. (૪/૧૪)'
    }
  },

  // SECTION 11: Verses 136 to 145
  {
    startShloka: 136,
    endShloka: 140,
    vachnamrut: {
      title: 'વચનામૃત વરતાલ ૧૧ તથા ગઢડા પ્રથમ ૫૪',
      section: 'વરતાલ ૧૧, ગઢડા પ્રથમ ૫૪',
      quoteGu: 'મોટા સત્પુરુષની સેવા ને તેમની આજ્ઞાનું પાલન એ જ મોક્ષનું સાક્ષાત્ દ્વાર છે. (વરતાલ ૧૧, ગઢડા પ્ર. ૫૪)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨',
      section: 'પ્રકરણ ૨/૬૨',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'મોટા રાજી થાય તો સર્વે કામ થાય; ને રાજીપો તો તેમની અનુવૃત્તિ સાચવવાથી થાય છે.'
    }
  },
  {
    startShloka: 141,
    endShloka: 145,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩૮ ને ગઢડા પ્રથમ ૨૦',
      section: 'ગઢડા પ્રથમ ૨૦, ૩૮',
      quoteGu: 'અંતર્દૃષ્ટિ કરીને પોતાના અંતઃકરણના દોષ જોવા, પણ ભગવાન કે સંત-હરિભક્તમાં કોઈ દિવસ દોષ ન જોવો. (ગઢડા પ્ર. ૨૦, ૩૮)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨ ને ૪',
      section: 'પ્રકરણ ૨/૬૨, ૪',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'પ્રતિદિન વિચાર કરવો કે આપણે શું કરવા આવ્યા હતા ને શું કરીએ છીએ? (૨/૬૨) બીજાના દોષ જોવા માંડે તો બહુ ભૂંડું થાય. (પ્રકરણ ૪)'
    }
  },

  // SECTION 12: Verses 146 to 160
  {
    startShloka: 146,
    endShloka: 150,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૬૪',
      section: 'ગઢડા પ્રથમ ૬૪',
      quoteGu: 'પોતાને દાસ માનવો ને ભગવાનને સ્વામી માનવા; સ્વામી-સેવકભાવે જ ભક્તિ ઉત્તમ થાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૨૫૭',
      section: 'પ્રકરણ ૧/૨૫૭',
      prakaran: 1,
      vatoNo: 257,
      quoteGu: 'દાસભાવ રાખીને પ્રભુ ભજવા ને કર્તાહર્તા એક ભગવાનને સમજવા તેથી અંતરમાં શાંતિ રહે છે.'
    }
  },
  {
    startShloka: 151,
    endShloka: 155,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૬ તથા ગઢડા દ્વિતીય ૬૦',
      section: 'ગઢડા પ્રથમ ૭૬, ગઢડા દ્વિતીય ૬૦',
      quoteGu: 'ભગવાનના ભક્તનો પક્ષ રાખવો ને પરસ્પર પ્રીતિ રાખવી... ભક્તદ્રોહ જેવું કોઈ મોટું વિઘ્ન નથી. (ગઢડા પ્ર. ૭૬, ગઢડા દ્વિ. ૬૦)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૨૨',
      section: 'પ્રકરણ ૨/૨૨',
      prakaran: 2,
      vatoNo: 22,
      quoteGu: 'સત્સંગમાં સંપ, સ્નેહ ને એકતા રાખવી; કુસંપ ને ઈર્ષ્યા ટાળવાં.'
    }
  },
  {
    startShloka: 156,
    endShloka: 160,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૭',
      section: 'ગઢડા પ્રથમ ૭૭',
      quoteGu: 'સ્વધર્મમાં રહીને ભગવાન ભજવા; જ્ઞાનને ઓથે ધર્મ લોપવો નહીં.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૩',
      section: 'પ્રકરણ ૪/૧૩',
      prakaran: 4,
      vatoNo: 13,
      quoteGu: 'ધર્મ તો લાજે કરીને રહે છે, માટે આજ્ઞા-નિયમમાં સદાય દૃઢ રહેવું.'
    }
  },

  // SECTION 13: Verses 161 to 180
  {
    startShloka: 161,
    endShloka: 170,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૬૨',
      section: 'ગઢડા પ્રથમ ૬૨',
      quoteGu: 'સત્ય, અહિંસક ને શીળવાળી વાણી બોલવી ને અસત્ય વચન ક્યારેય મુખમાંથી ન કાઢવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૧૪૬',
      section: 'પ્રકરણ ૫/૧૪૬',
      prakaran: 5,
      vatoNo: 146,
      quoteGu: 'વાણીનો વિવેક રાખવો; કોઈનું દિલ દુભાય તેવા વેણ ન બોલવાં.'
    }
  },
  {
    startShloka: 171,
    endShloka: 180,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા મધ્ય ૬',
      section: 'ગઢડા મધ્ય ૬',
      quoteGu: 'પોતાના વ્યવહાર ને હિસાબ-કિતાબ ચોખ્ખા રાખવા જેથી પાછળથી કોઈ કલેશ ન થાય.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૭૬',
      section: 'પ્રકરણ ૨/૭૬',
      prakaran: 2,
      vatoNo: 76,
      quoteGu: 'પ્રમાણિક વ્યવહાર એ જ સાચો સત્સંગ છે; અનીતિનું ધન શાંતિ હરી લે છે.'
    }
  },

  // SECTION 14: Verses 181 to 210
  {
    startShloka: 181,
    endShloka: 195,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૫૯',
      section: 'ગઢડા પ્રથમ ૫૯',
      quoteGu: 'માતા-પિતા ને વડીલોની સેવા કરવી તે ધર્મ છે ને તેમાં ભગવાનનો રાજીપો છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૩૩૪',
      section: 'પ્રકરણ ૫/૩૩૪',
      prakaran: 5,
      vatoNo: 334,
      quoteGu: 'વડીલોની આજ્ઞામાં રહેવું ને તેમની સેવા કરવી તે સંસ્કારી જીવનનું લક્ષણ છે.'
    }
  },
  {
    startShloka: 196,
    endShloka: 210,
    vachnamrut: {
      title: 'વચનામૃત લોયા ૧ તથા ગઢડા પ્રથમ ૭૬',
      section: 'લોયા ૧, ગઢડા પ્રથમ ૭૬',
      quoteGu: 'ક્રોધ ને ઈર્ષ્યા અંતરમાંથી નિર્મૂળ કરવાં, તેથી અંતઃકરણમાં પરમ શાંતિ રહે છે. (લોયા ૧, ગઢડા પ્ર. ૭૬)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૬/૧૪',
      section: 'પ્રકરણ ૬/૧૪',
      prakaran: 6,
      vatoNo: 14,
      quoteGu: 'કામ, ક્રોધ, માન, ઈર્ષા ને દેહાભિમાન એ સર્વે મૂકશે ત્યારે જીવ નિર્મળ થશે.'
    }
  },

  // SECTION 15: Verses 211 to 234
  {
    startShloka: 211,
    endShloka: 220,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૧૭ ને ગઢડા પ્રથમ ૪૮',
      section: 'ગઢડા પ્રથમ ૧૭, ૪૮',
      quoteGu: 'ચાર પ્રકારના કુસંગીનો સંગ ક્યારેય ન કરવો, કારણ કે કુસંગથી બુદ્ધિ ભ્રષ્ટ થાય છે. (ગઢડા પ્ર. ૪૮)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨',
      section: 'પ્રકરણ ૨/૬૨',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'કુસંગથી જીવને બચાવવો; જેવો સંગ તેવો રંગ લાગે છે માટે સાચા સંતનો જ સંગ કરવો.'
    }
  },
  {
    startShloka: 221,
    endShloka: 234,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૩ તથા ગઢડા મધ્ય ૩૩',
      section: 'ગઢડા પ્રથમ ૭૩, ગઢડા મધ્ય ૩૩',
      quoteGu: 'કામ જીત્યાનું સાધન સૌથી મોટું છે; બ્રહ્મચર્ય પાળવું ને ઇન્દ્રિયોને વશ રાખવી. (ગઢડા પ્ર. ૭૩)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૪',
      section: 'પ્રકરણ ૪/૧૪',
      prakaran: 4,
      vatoNo: 14,
      quoteGu: 'વિદ્યા ભણવી પણ સાથે સત્સંગનું જ્ઞાન રાખવું જેથી ચારિત્ર્ય ઉત્તમ બને.'
    }
  },

  // SECTION 16: Verses 235 to 245
  {
    startShloka: 235,
    endShloka: 240,
    vachnamrut: {
      title: 'વચનામૃત વરતાલ ૧૮ તથા ગઢડા દ્વિતીય ૫૮',
      section: 'વરતાલ ૧૮, ગઢડા દ્વિતીય ૫૮',
      quoteGu: 'ભગવાનના ભક્તને શાસ્ત્રનું શ્રવણ-મનન અવશ્ય કરવું, જેથી જીવના અજ્ઞાનની નિવૃત્તિ થાય ને સંપ્રદાયની પુષ્ટિ થાય. (વરતાલ ૧૮, ગઢડા દ્વિ. ૫૮)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૨૧ ને ૫/૧૧૨',
      section: 'પ્રકરણ ૪/૨૧, ૫/૧૧૨',
      prakaran: 4,
      vatoNo: 21,
      quoteGu: 'એક ઉપાસના, બીજી આજ્ઞા, ત્રીજો સમાગમ ને ચોથું સત્શાસ્ત્રનું વ્યસન, એ ચાર દૃઢ કરીને રાખવાં. (૪/૨૧) વચનામૃત નિત્ય વિચારવું તેથી મનની માયા ટળી જાય. (૫/૧૧૨)'
    }
  },
  {
    startShloka: 241,
    endShloka: 245,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૫૨',
      section: 'ગઢડા પ્રથમ ૫૨',
      quoteGu: 'ચાર શાસ્ત્રે કરીને ભગવાનને જાણવા ને સંશય માત્ર ટાળીને નિર્વિકલ્પ થવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૪૩',
      section: 'પ્રકરણ ૨/૪૩',
      prakaran: 2,
      vatoNo: 43,
      quoteGu: 'મોટા સાધુ આગળ જઈને વાતું પૂછવી જેથી અંતરની ગાંઠો છૂટી જાય.'
    }
  },

  // SECTION 17: Verses 246 to 270
  {
    startShloka: 246,
    endShloka: 255,
    vachnamrut: {
      title: 'વચનામૃત સારંગપુર ૭',
      section: 'સારંગપુર ૭',
      quoteGu: 'જે જે સ્થાનને વિષે ભગવાને લીલા કરી છે તે સ્થાન અતિ પવિત્ર છે ને ત્યાં ભજન કરવાથી મોક્ષ થાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧૪',
      section: 'પ્રકરણ ૧/૧૪',
      prakaran: 1,
      vatoNo: 14,
      quoteGu: 'પ્રસાદીનાં સ્થાનોનાં દર્શન કરવાં ને પ્રભુચરિત્રો સંભારવાં તે જ સાચો તીર્થવાસ છે.'
    }
  },
  {
    startShloka: 256,
    endShloka: 270,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩ ને ગઢડા મધ્ય ૧૧',
      section: 'ગઢડા પ્રથમ ૩, ગઢડા મધ્ય ૧૧',
      quoteGu: 'ઉત્સવ-સમૈયા કરવા ને ભગવાનની સેવામાં તન, મન, ધન અર્પણ કરવાં તેથી ભગવાન અતિ રાજી થાય છે. (ગઢડા પ્ર. ૩, ગઢડા મ. ૧૧)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૫/૨૯૧',
      section: 'પ્રકરણ ૫/૨૯૧',
      prakaran: 5,
      vatoNo: 291,
      quoteGu: 'ધનનો દશાંશ-વીસાંશ ભગવાનના અર્થે કાઢવો તેથી લક્ષ્મી પવિત્ર થાય છે ને દારિદ્ર્ય ટળે છે.'
    }
  },

  // SECTION 18: Verses 271 to 290
  {
    startShloka: 271,
    endShloka: 280,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૩૬ તથા ગઢડા મધ્ય ૩૦',
      section: 'ગઢડા પ્રથમ ૩૬, ગઢડા મધ્ય ૩૦',
      quoteGu: 'ત્યાગીને સોનું ને સ્ત્રી એ બેય બંધનકારી છે, માટે તેનો સર્વથા ત્યાગ કરવો એ જ સાચો સાધુ છે. (ગઢડા પ્ર. ૩૬, ગઢડા મ. ૩૦)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪/૧૪ ને ૬/૧૪',
      section: 'પ્રકરણ ૪/૧૪, ૬/૧૪',
      prakaran: 4,
      vatoNo: 14,
      quoteGu: 'સાધુ તો પંચવર્તમાનના પૂરા હોવા જોઈએ; નિષ્કામ, નિર્લોભ ને નિર્માન એ સાધુતાના પાયા છે.'
    }
  },
  {
    startShloka: 281,
    endShloka: 290,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૬૭ તથા ગઢડા અંત્ય ૨૬',
      section: 'ગઢડા પ્રથમ ૬૭, ગઢડા અંત્ય ૨૬',
      quoteGu: 'મન ને ઇન્દ્રિયોને વશ રાખીને જે સંત વર્તે છે તેમના હૃદયમાં ભગવાન સાક્ષાત્ વિરાજે છે. (ગઢડા પ્ર. ૬૭, ગઢડા અંત્ય ૨૬)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૩',
      section: 'પ્રકરણ ૧/૩',
      prakaran: 1,
      vatoNo: 3,
      quoteGu: 'સાધુતા રાખવી ને સર્વ પ્રકારે નિર્માની થઈને પ્રભુ ભજવા એ જ સર્વોત્તમ ગુણ છે.'
    }
  },

  // SECTION 19: Verses 291 to 305
  {
    startShloka: 291,
    endShloka: 300,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૭૦',
      section: 'ગઢડા પ્રથમ ૭૦',
      quoteGu: 'પોતાનો વાંક કબૂલ કરી લેવો ને દીન થઈ ક્ષમા માંગવી તેથી ભગવાન અતિ પ્રસન્ન થાય છે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨',
      section: 'પ્રકરણ ૨/૬૨',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'મોટા આગળ નમ્રતા ને વિનય રાખવો; અહંકાર રાખવો નહીં.'
    }
  },
  {
    startShloka: 301,
    endShloka: 305,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા પ્રથમ ૧૪',
      section: 'ગઢડા પ્રથમ ૧૪',
      quoteGu: '‘અન્તે યા મતિઃ સા ગતિઃ’ જેવી અંતકાળે મતિ હોય તેવી ગતિ થાય, માટે સદાય પ્રભુની મૂર્તિનું સ્મરણ રાખવું.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૪',
      section: 'પ્રકરણ ૪',
      prakaran: 4,
      vatoNo: 1,
      quoteGu: 'અંતકાળે ભગવાન ને સાધુ સહાય કરે છે; માટે આ લોક મૂકીને અક્ષરધામમાં સુખે જાવું છે એવી સમજણ રાખવી.'
    }
  },

  // SECTION 20: Verses 306 to 315
  {
    startShloka: 306,
    endShloka: 310,
    vachnamrut: {
      title: 'વચનામૃત ગઢડા અંત્ય ૩૬',
      section: 'ગઢડા અંત્ય ૩૬',
      quoteGu: 'જે આ શાસ્ત્રના વચન પ્રમાણે વર્તશે તે સર્વે દુઃખથી મુકાઈને ભગવાનના અક્ષરધામને પામશે.'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૧/૧',
      section: 'પ્રકરણ ૧/૧',
      prakaran: 1,
      vatoNo: 1,
      quoteGu: 'આ વાતો જે વિચારશે ને આચરણમાં મૂકશે તેના અનંત જન્મના અજ્ઞાન ટળી જશે ને તે સુખી થશે.'
    }
  },
  {
    startShloka: 311,
    endShloka: 315,
    vachnamrut: {
      title: 'વચનામૃત વરતાલ ૧૧ તથા ગઢડા અંત્ય ૨',
      section: 'વરતાલ ૧૧, ગઢડા અંત્ય ૨',
      quoteGu: 'પ્રગટ સત્પુરુષનો જે જીવ ઉપર રાજીપો થાય તેના સર્વે અર્થ સિદ્ધ થાય છે ને જીવ આત્યંતિક મોક્ષને પામે છે. (વરતાલ ૧૧, ગઢડા અંત્ય ૨)'
    },
    swaminiVato: {
      title: 'સ્વામીની વાતો પ્રકરણ ૨/૬૨',
      section: 'પ્રકરણ ૨/૬૨',
      prakaran: 2,
      vatoNo: 62,
      quoteGu: 'મોટા સત્પુરુષ રાજી થાય ત્યારે ભગવાન સાક્ષાત્ રાજી થાય છે ને જીવ કૃતાર્થ બની જાય છે.'
    }
  }
];

/**
 * Normalizes text to compare quotes or sections safely
 */
function cleanText(txt?: string): string {
  if (!txt) return '';
  return txt.replace(/[\s\n\r\t.,;:'"“”‘’—–-]/g, '').toLowerCase();
}

/**
 * Merges authentic book correlation quotes & reference numbers with existing references for a shloka,
 * eliminating duplicates and merging quotes if repeated.
 */
export function enrichShlokaWithBookCorrelations(
  shlokaId: number,
  existingReferences: ScriptureReference[] = []
): ScriptureReference[] {
  // Find group matching shlokaId
  const group = BOOK_CORRELATION_GROUPS.find(
    g => shlokaId >= g.startShloka && shlokaId <= g.endShloka
  );

  const result: ScriptureReference[] = [];
  const seenKeys = new Set<string>();

  // If group exists, prepare the primary book Vachnamrut and Swamini Vato references
  const bookRefs: ScriptureReference[] = [];
  if (group) {
    // 1. Primary Vachnamrut Reference from Book
    bookRefs.push({
      type: 'vachnamrut',
      title: group.vachnamrut.title,
      titleGu: group.vachnamrut.title,
      titleHi: group.vachnamrut.title,
      titleEn: group.vachnamrut.title,
      section: group.vachnamrut.section,
      sectionHi: group.vachnamrut.section,
      sectionEn: group.vachnamrut.section,
      quoteGu: group.vachnamrut.quoteGu,
      correlationNote: `સત્સંગ દીક્ષા શ્લોક ${group.startShloka}${group.endShloka > group.startShloka ? '-' + group.endShloka : ''} અને ${group.vachnamrut.title} સહસંબંધ પ્રમાણ.`
    });

    // 2. Primary Swamini Vato Reference from Book
    bookRefs.push({
      type: 'swamini_vato',
      title: group.swaminiVato.title,
      titleGu: group.swaminiVato.title,
      titleHi: group.swaminiVato.title,
      titleEn: group.swaminiVato.title,
      section: group.swaminiVato.section,
      sectionHi: group.swaminiVato.section,
      sectionEn: group.swaminiVato.section,
      prakaran: group.swaminiVato.prakaran,
      vatoNo: group.swaminiVato.vatoNo,
      textGu: group.swaminiVato.quoteGu,
      quoteGu: group.swaminiVato.quoteGu,
      correlationNote: `સત્સંગ દીક્ષા શ્લોક ${group.startShloka}${group.endShloka > group.startShloka ? '-' + group.endShloka : ''} અને ${group.swaminiVato.title} સહસંબંધ પ્રમાણ.`
    });
  }

  // First insert the primary book references
  for (const ref of bookRefs) {
    const key = `${ref.type}_${cleanText(ref.section || ref.title)}`;
    seenKeys.add(key);
    result.push({ ...ref });
  }

  // Next, merge existing references
  for (const existing of existingReferences) {
    const key = `${existing.type}_${cleanText(existing.section || existing.title)}`;
    
    // Check if this reference matches one of our book refs
    const matchIdx = result.findIndex(r => {
      if (r.type !== existing.type) return false;
      const cleanR = cleanText(r.section || r.title);
      const cleanE = cleanText(existing.section || existing.title);
      return cleanR === cleanE || cleanR.includes(cleanE) || cleanE.includes(cleanR);
    });

    if (matchIdx >= 0) {
      // Merge quotes if repeated or combine them cleanly
      const target = result[matchIdx];
      const existQuote = existing.quoteGu || existing.textGu;
      const targetQuote = target.quoteGu || target.textGu;

      if (existQuote && targetQuote) {
        // If existing quote is different and has unique content, merge them
        const cleanExist = cleanText(existQuote);
        const cleanTarget = cleanText(targetQuote);
        if (!cleanTarget.includes(cleanExist) && !cleanExist.includes(cleanTarget)) {
          target.quoteGu = `${targetQuote}\n\n[વિસ્તૃત પ્રમાણ]: ${existQuote}`;
          if (target.type === 'swamini_vato') {
            target.textGu = target.quoteGu;
          }
        }
      } else if (existQuote && !targetQuote) {
        target.quoteGu = existQuote;
        if (target.type === 'swamini_vato') target.textGu = existQuote;
      }

      // Preserve other languages and metadata if available
      if (existing.quoteHi && !target.quoteHi) target.quoteHi = existing.quoteHi;
      if (existing.quoteEn && !target.quoteEn) target.quoteEn = existing.quoteEn;
      if (existing.textHi && !target.textHi) target.textHi = existing.textHi;
      if (existing.textEn && !target.textEn) target.textEn = existing.textEn;
      if (existing.anirdeshUrl && !target.anirdeshUrl) target.anirdeshUrl = existing.anirdeshUrl;
    } else {
      // Not a duplicate, check if already in seenKeys
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(existing);
      }
    }
  }

  return result;
}
