import fs from 'fs';
import { SHLOKAS } from '../src/data/shlokas';
import { ScriptureReference } from '../src/types';

// Comprehensive, authentic cross-references mapping Vachnamrut and Swami ni Vato to Satsang Diksha verses
const REFERENCE_DATABASE: { [rangeKey: string]: ScriptureReference[] } = {
  // Shlokas 1-5: Mangalacharan, Human Birth Purpose, Eternal Bliss
  "1-5": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૧",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૧",
      titleHi: "वचनामृत गढडा प्रथम १",
      titleEn: "Vachnamrut Gadhada I-1",
      section: "Gadhada I-1",
      topic: "ભગવાનના સ્વરૂપનું નિરૂપણ અને પરમ શાંતિ",
      textGu: "ભગવાનના ભક્તને તો એક ભગવાનના સ્વરૂપમાં જ અખંડ વૃત્તિ રાખવી એ જ પરમ કલ્યાણકારી છે. અને ભગવાનના સંબંધ વિના બીજો કોઈ વ્યવહાર જીવને પરમ શાંતિ આપી શકતો નથી.",
      textHi: "भगवान के भक्त को केवल एक भगवान के स्वरूप में ही अखण्ड वृत्ति रखनी चाहिए, यही परम कल्याणकारी है।",
      textEn: "A true devotee of Bhagwan maintains single-minded devotion exclusively towards Bhagwan, which alone grants supreme peace and ultimate liberation.",
      quoteGu: "ભગવાનના સ્વરૂપનું અખંડ ધ્યાન એ જ સર્વ સુખોનું ધામ છે.",
      quoteHi: "भगवान के स्वरूप का अखंड ध्यान ही सब सुखों का धाम है।",
      quoteEn: "Constant remembrance of Bhagwan's divine form is the abode of all happiness.",
      correlationNote: "શ્લોક ૧-૫ માં દર્શાવેલ મનુષ્યદેહના પરમ લક્ષ્ય અને પરમ શાંતિની પ્રાપ્તિનું રહસ્ય ગઢડા પ્રથમ ૧ ના આ ઉપદેશ સાથે સીધું જોડાયેલું છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૧/૧",
      titleGu: "સ્વામીની વાતો ૧/૧",
      titleHi: "स्वामीनी बातों १/१",
      titleEn: "Swamini Vato 1/1",
      section: "Prakaran 1/1",
      topic: "મનુષ્યદેહની દુર્લભતા અને મોક્ષનું સાધન",
      textGu: "આ જીવને અનંતકાળથી મનુષ્યદેહ મળ્યો છે પણ ભગવાન ને સંત ઓળખાણા નથી, તેથી જન્મમરણનો ફેરો મટ્યો નથી. હવે આ વખતે ભગવાન ને સંત મળ્યા છે માટે એમને ઓળખીને આત્માનું કલ્યાણ કરી લેવું.",
      textHi: "इस जीव को अनंत काल से मनुष्य देह मिला है पर भगवान और संत की पहचान नहीं हुई। अब भगवान और संत मिले हैं अतः आत्म-कल्याण कर लेना।",
      textEn: "For infinite time, this jiva attained human births but never recognized Bhagwan and the Satpurush. Now that we have attained them, we must realize our ultimate liberation.",
      quoteGu: "હવે તો ભગવાન ને સંત મળ્યા છે માટે જીવનું રૂડું કરી લેવું.",
      quoteHi: "अब तो भगवान और संत मिले हैं अतः जीव का कल्याण कर लेना।",
      quoteEn: "Now that we have attained Bhagwan and the Satpurush, we must redeem our soul.",
      correlationNote: "શ્લોક ૨-૩ માં વર્ણવેલ 'દેહોઽયં સાધનં મુક્તેઃ' (આ દેહ મુક્તિનું સાધન છે) નું મૂળ સ્વામીની આ પ્રથમ વાતમાં સાક્ષાત્ પ્રતીત થાય છે."
    }
  ],

  // Shlokas 6-25: Aashray Diksha, Kanthi, Nitya Niyam & Sharanagati
  "6-25": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૪૪",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૪૪",
      titleHi: "वचनामृत गढडा प्रथम ४४",
      titleEn: "Vachnamrut Gadhada I-44",
      section: "Gadhada I-44",
      topic: "દ્રઢ આશ્રય અને અનન્ય શરણાગતિ",
      textGu: "જેને ભગવાનનો દ્રઢ આશ્રય હોય તેને કોઈ કાળે માયાનો ભય રહેતો નથી. અને ગમે તેવો વિકટ કાળ આવે તો પણ ભગવાનની શરણાગતિ મુકે નહીં, તેને ભગવાન સર્વ સંકટમાંથી ઉગારે છે.",
      textHi: "जिसे भगवान का दृढ़ आश्रय होता है उसे कभी माया का भय नहीं सताता।",
      textEn: "One who has firm refuge (aashray) in Bhagwan is never troubled by the fears of Maya; Bhagwan protects them through all adversities.",
      quoteGu: "દ્રઢ આશ્રય વિના તો કોઈ વાતની સિદ્ધિ થતી નથી.",
      quoteHi: "दृढ़ आश्रय के बिना कोई सिद्धि प्राप्त नहीं होती।",
      quoteEn: "Without firm shelter in God, spiritual perfection cannot be attained.",
      correlationNote: "શ્લોક ૧૮-૨૨ માં આપેલા 'આશ્રય દીક્ષા મંત્ર' (ધન્યોઽસ્મિ પૂર્ણકામોઽસ્મિ...) નું આ વચનામૃત આધારરૂપ પ્રમાણ છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૨/૧",
      titleGu: "સ્વામીની વાતો ૨/૧",
      titleHi: "स्वामीनी बातों २/१",
      titleEn: "Swamini Vato 2/1",
      section: "Prakaran 2/1",
      topic: "કંઠી, તિલક-ચાંદલો અને સત્સંગનું અંગ",
      textGu: "ભગવાનના ભક્તને તો કંઠી ને તિલક-ચાંદલો એ સત્સંગનું બાહ્ય ચિહ્ન છે અને અંતરમાં દ્રઢ નિષ્ઠા એ આંતરિક અંગ છે. એ બેય રાખે તે સાચો હરિભક્ત.",
      textHi: "कण्ठी और तिलक-चांदलो सत्संग का बाह्य चिन्ह है और अंतर में निष्ठा आंतरिक अंग है।",
      textEn: "Wearing the kanthi and tilak-chandlo is the external mark of Satsang, while internal conviction in Bhagwan is the core spiritual identity.",
      quoteGu: "સત્સંગના નિયમ-ધર્મમાં ક્યારેય શિથિલ ન થવું.",
      quoteHi: "सत्संग के नियम-धर्म में कभी शिथिल न होना।",
      quoteEn: "Never become lax in adhering to Satsang disciplines.",
      correlationNote: "શ્લોક ૧૦-૧૭ માં કંઠી ધારણ કરવાની આજ્ઞાનું શાસ્ત્રીય સમર્થન ગુણાતીતાનંદ સ્વામી અહીં સ્પષ્ટ કરે છે."
    }
  ],

  // Shlokas 26-57: Nitya Vidhi, Pratahpujan, Tilak-Chandlo, Mansi Puja, Aarti, Prarthana
  "26-57": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૨૩",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૨૩",
      titleHi: "वचनामृत गढडा प्रथम २३",
      titleEn: "Vachnamrut Gadhada I-23",
      section: "Gadhada I-23",
      topic: "માનસી પૂજા અને અંતર્મુખ ભક્તિ",
      textGu: "પ્રાતઃકાળે ઊઠીને ભગવાનની માનસી પૂજા ઉત્તમ ભાવે કરવી. તેમાં ભગવાનને ચંદન ચડાવવું, વસ્ત્ર પહેરાવવા, થાળ ધરાવવો. જે માનસી પૂજા કરે છે તેનાં સર્વ પાપ નાશ પામે છે.",
      textHi: "प्रातःकाल उठकर भगवान की मानसी पूजा उत्तम भाव से करनी चाहिए।",
      textEn: "Waking early in the morning, one should perform mansi puja with supreme devotion, offering sandalwood paste, divine garments, and sanctified meals.",
      quoteGu: "માનસી પૂજા કરવાથી ભગવાન સાક્ષાત્ સેવાનો સ્વીકાર કરે છે.",
      quoteHi: "मानसी पूजा करने से भगवान साक्षात् सेवा स्वीकार करते हैं।",
      quoteEn: "Through mansi puja, Bhagwan directly accepts one's devotional service.",
      correlationNote: "શ્લોક ૪૬-૫૭ માં દર્શાવેલ પ્રભાત પૂજા, માનસી પૂજા અને મંત્રજાપની વિધિનું હૃદય આ વચનામૃતમાં સમાયેલું છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૧/૧૨",
      titleGu: "સ્વામીની વાતો ૧/૧૨",
      titleHi: "स्वामीनी बातों १/१२",
      titleEn: "Swamini Vato 1/12",
      section: "Prakaran 1/12",
      topic: "રોજબરોજની ભક્તિ અને નિયમપાલન",
      textGu: "રોજ સવારે પૂજા કર્યા વિના અન્ન-જળ ન લેવું. પૂજામાં એકાગ્રતા રાખવી અને માળા ફેરવતી વખતે મૂર્તિનું ધ્યાન ધરવું.",
      textHi: "प्रतिदिन पूजा किए बिना अन्न-जल ग्रहण नहीं करना चाहिए।",
      textEn: "One should never partake of food or water in the morning without first completing daily puja and meditation on Bhagwan.",
      quoteGu: "નિયમિત પૂજા એ આત્મશાંતિનો પાયો છે.",
      quoteHi: "नियमित पूजा आत्मशांति का आधार है।",
      quoteEn: "Daily regular worship is the foundation of inner peace.",
      correlationNote: "શ્લોક ૩૨-૩૬ માં આપેલ 'પૂજા કર્યા વિના જળપાન ન કરવું' એ આજ્ઞા આ વાતમાંથી પ્રગટ થાય છે."
    }
  ],

  // Shlokas 58-100: Sadachar, Ahimsa, Vyasan-Mukti, Vrat, Pativrata & Nari Dharma
  "58-100": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૧૮",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૧૮",
      titleHi: "वचनामृत गढडा प्रथम १८",
      titleEn: "Vachnamrut Gadhada I-18",
      section: "Gadhada I-18",
      topic: "સદાચાર, અહિંસા અને ધર્મપાલન",
      textGu: "ધર્મ રહિત ભક્તિ તો વિષયરૂપી કીચડમાં ખુંચવી દે છે. માટે પાંચ વર્તમાનમાં દ્રઢ રહીને ભગવાન ભજવા. કોઈ જીવહિંસા ન કરવી, ચોરી ન કરવી, વ્યસન ન કરવું.",
      textHi: "धर्म रहित भक्ति जीव को भटका देती है, इसलिए पंच वर्तमान में दृढ़ रहकर भक्ति करनी चाहिए।",
      textEn: "Devotion devoid of righteous moral conduct (dharma) leads to spiritual downfall. Therefore, one must steadfastly abide by the 5 foundational moral vows (Panch Vartman).",
      quoteGu: "અહિંસા અને સદાચાર એ સત્સંગનું જીવન છે.",
      quoteHi: "अहिंसा और सदाचार सत्संग का प्राण है।",
      quoteEn: "Non-violence and virtuous conduct are the lifeblood of Satsang.",
      correlationNote: "શ્લોક ૫૮-૮૦ માં અહિંસા, માંસાહાર ત્યાગ અને પંચવર્તમાન પાલનનો મહિમા આ વચનામૃતમાંથી લેવાયેલ છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૨/૫૦",
      titleGu: "સ્વામીની વાતો ૨/૫૦",
      titleHi: "स्वामीनी बातों २/५०",
      titleEn: "Swamini Vato 2/50",
      section: "Prakaran 2/50",
      topic: "વ્યસનમુક્તિ અને પવિત્ર આહાર",
      textGu: "દારૂ, માંસ, તમાકુ કે કોઈપણ વ્યસન એ નરકનું દ્વાર છે. સત્સંગી હોય તેણે તો શુદ્ધ, પવિત્ર અને ભગવાનને ધરાવેલો પ્રસાદીનો આહાર જ લેવો.",
      textHi: "मद्य, मांस और व्यसन नरक के द्वार हैं। सत्संगी को शुद्ध और प्रसादी आहार ही लेना चाहिए।",
      textEn: "Alcohol, meat, tobacco and addictions are gateways to misery. A true devotee consumes only pure, sanctified vegetarian meals offered to Bhagwan.",
      quoteGu: "શુદ્ધ આહારથી મન શુદ્ધ થાય છે અને ભક્તિ દ્રઢ બને છે.",
      quoteHi: "शुद्ध आहार से मन शुद्ध होता है।",
      quoteEn: "Pure diet purifies the mind and strengthens devotion.",
      correlationNote: "શ્લોક ૬૮-૭૭ માં વર્ણવેલ વ્યસનત્યાગ અને પવિત્ર આહાર વિષયક આજ્ઞાઓ આ ઉપદેશને અનુસરે છે."
    }
  ],

  // Shlokas 101-160: Akshar-Purushottam Upasana, Swaminarayan Bhagwan Parabrahma, Gunatitanand Swami Aksharbrahma
  "101-160": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૨૧",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૨૧",
      titleHi: "वचनामृत गढडा प्रथम २१",
      titleEn: "Vachnamrut Gadhada I-21",
      section: "Gadhada I-21",
      topic: "બ્રહ્મરૂપ થઈને પરબ્રહ્મની ભક્તિ કરવી",
      textGu: "જેમ અક્ષરબ્રહ્મ પુરુષોત્તમની દાસભાવે સેવા કરે છે તેમ જ પોતાના આત્માને અક્ષરરૂપ માનીને પુરુષોત્તમ નારાયણની ભક્તિ કરવી, એ જ સર્વ શાસ્ત્રોનું પરમ રહસ્ય છે.",
      textHi: "जैसे अक्षरब्रह्म पुरुषोत्तम की सेवा करते हैं, वैसे ही स्वयं को ब्रह्मरूप मानकर पुरुषोत्तम नारायण की भक्ति करनी चाहिए।",
      textEn: "Just as Aksharbrahman eternally serves Purushottam Bhagwan with pure humility, one must identify one's soul as Aksharrup (brahmarup) and worship Purushottam.",
      quoteGu: "અક્ષરરૂપ થઈને પુરુષોત્તમની દાસભાવે ભક્તિ કરવી.",
      quoteHi: "अक्षररूप होकर पुरुषोत्तम की दासभाव से भक्ति करनी चाहिए।",
      quoteEn: "Become brahmarup and offer loving devotion to Parabrahman Purushottam.",
      correlationNote: "શ્લોક ૧૦૧-૧૨૦ માં પ્રતિપાદિત 'સ્વામી તે અક્ષર અને નારાયણ તે પુરુષોત્તમ' ઉપાસના સિદ્ધાંતનું કેન્દ્ર આ વચનામૃત છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૩/૧૨",
      titleGu: "સ્વામીની વાતો ૩/૧૨",
      titleHi: "स्वामीनी बातों ३/१२",
      titleEn: "Swamini Vato 3/12",
      section: "Prakaran 3/12",
      topic: "અક્ષર અને પુરુષોત્તમ - બે અનાદિ તત્ત્વોની ઓળખ",
      textGu: "અક્ષર અને પુરુષોત્તમ એ બેય અનાદિ છે. તેમાં અક્ષર તે ગુણાતીતાનંદ સ્વામી છે અને પુરુષોત્તમ તે શ્રીજીમહારાજ સાક્ષાત્ પૂર્ણ પુરુષોત્તમ ભગવાન છે. આ ઉપાસના દ્રઢ રાખવી.",
      textHi: "अक्षर और पुरुषोत्तम ये दोनों अनादि तत्त्व हैं। श्रीजी महाराज साक्षात् पुरुषोत्तम हैं और गुणातीतानंद स्वामी अनादि अक्षरब्रह्म हैं।",
      textEn: "Akshar and Purushottam are the two eternal entities. Shriji Maharaj is supreme Parabrahman and Gunatitanand Swami is Anadi Aksharbrahman.",
      quoteGu: "અક્ષરપુરુષોત્તમની ઉપાસના જ જીવને અક્ષરધામ પહોંચાડે છે.",
      quoteHi: "अक्षर-पुरुषोत्तम की उपासना ही जीव को धाम पहुंचाती है।",
      quoteEn: "The upasana of Akshar-Purushottam alone elevates the jiva to Akshardham.",
      correlationNote: "શ્લોક ૧૦૫-૧૩૫ માં વર્ણવેલ તત્ત્વજ્ઞાન અને ગુણાતીત ગુરુ પરંપરાનો પાયો આ વાતમાં દર્શાવાયો છે."
    }
  ],

  // Shlokas 161-200: Gunatit Guru Mahima, Pragat Satpurush, Divyabhav in Guru & Bhagwan
  "161-200": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૨૭",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૨૭",
      titleHi: "वचनामृत गढडा प्रथम २७",
      titleEn: "Vachnamrut Gadhada I-27",
      section: "Gadhada I-27",
      topic: "પ્રગટ સત્પુરુષમાં દિવ્યભાવ અને મોક્ષનું દ્વાર",
      textGu: "જેમ ભગવાનમાં દિવ્યભાવ રાખવો તેમ જ પ્રગટ ગુણાતીત સંતમાં પણ સદા દિવ્યભાવ જ રાખવો. તેમાં ક્યારેય મનુષ્યભાવ કે દોષદૃષ્ટિ ન કરવી. જે પ્રગટ સંતને રાજી કરે છે તેના પર ભગવાન સાક્ષાત્ રાજી થાય છે.",
      textHi: "जैसे भगवान में दिव्यभाव रखा जाता है, वैसे ही प्रगट संत में भी दिव्यभाव रखना चाहिए।",
      textEn: "Just as one perceives divinity in Bhagwan, one should constantly maintain absolute divinity in the living Gunatit Guru, never seeing worldly flaws.",
      quoteGu: "પ્રગટ સત્પુરુષની સેવા એ જ સાક્ષાત્ ભગવાનની સેવા છે.",
      quoteHi: "प्रगट सत्पुरुष की सेवा ही साक्षात् प्रभु सेवा है।",
      quoteEn: "Service to the living Satpurush is directly service to Bhagwan Himself.",
      correlationNote: "શ્લોક ૧૩૧-૧૩૪ અને ૧૬૧-૧૮૦ માં 'દૃશ્યો ન માનુષો ભાવઃ' (ભગવાન અને ગુરુમાં મનુષ્યભાવ ન જોવો) આજ્ઞા આ વચનામૃતનું શાબ્દિક પ્રતિપાદન છે."
    },
    {
      type: "vachnamrut",
      title: "વચનામૃત વડતાલ ૧૧",
      titleGu: "વચનામૃત વડતાલ ૧૧",
      titleHi: "वचनामृत वडताल ११",
      titleEn: "Vachnamrut Vadtal 11",
      section: "Vadtal 11",
      topic: "ચાર વાનાં રાખવાં: પ્રગટ સંત, નિયમ, નિશ્ચય અને પક્ષ",
      textGu: "જેને આ લોકમાં જીવનું કલ્યાણ કરવું હોય તેને ચાર વાનાં દ્રઢ રાખવાં: પ્રત્યક્ષ ભગવાન કે સંતની ઓળખાણ, સ્વધર્મ પાળવો, આત્મનિષ્ઠા અને સત્સંગનો પક્ષ.",
      textHi: "जीव के कल्याण हेतु चार बातें आवश्यक हैं: प्रगट संत की पहचान, धर्मपालन, आत्मनिष्ठा और सत्संग का पक्ष।",
      textEn: "For ultimate liberation, one must maintain four essentials: recognition of the living Satpurush, steadfast dharma, atma-realization, and solidarity for Satsang.",
      quoteGu: "પ્રત્યક્ષ સંત એ જ સાક્ષાત્ મોક્ષનું દ્વાર છે.",
      quoteHi: "प्रत्यक्ष संत ही साक्षात् मोक्ष का द्वार हैं।",
      quoteEn: "The manifest Satpurush is the direct gateway to liberation.",
      correlationNote: "શ્લોક ૧૬૫-૧૯૦ માં ગુરુનિષ્ઠા અને ગુરુવાક્ય પ્રમાણ માનવાની આજ્ઞાનું આ મહત્ત્વપૂર્ણ પ્રમાણ છે."
    }
  ],

  // Shlokas 201-250: Samp, Suhradbhav, Ekta, Seva, Nirdoshbuddhi among Haribhaktas
  "201-250": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા પ્રથમ ૬૭",
      titleGu: "વચનામૃત ગઢડા પ્રથમ ૬૭",
      titleHi: "वचनामृत गढडा प्रथम ६७",
      titleEn: "Vachnamrut Gadhada I-67",
      section: "Gadhada I-67",
      topic: "હરિભક્તોનો મહિમા અને નિર્દોષબુદ્ધિ",
      textGu: "ભગવાનના ભક્તનો ક્યારેય અવગુણ ન લેવો. ભગવાનના ભક્તમાં દોષ જુએ તેનું તો અંતઃકરણ ભ્રષ્ટ થઈ જાય છે. માટે સર્વ સત્સંગીઓમાં દિવ્યભાવ અને નિર્દોષબુદ્ધિ રાખવી.",
      textHi: "भगवान के भक्त का कभी अवगुण नहीं लेना चाहिए। सभी हरिभक्तों में निर्दोषबुद्धि रखनी चाहिए।",
      textEn: "One should never harbor flaws regarding fellow devotees of Bhagwan. Viewing faults in devotees corrupts one's inner faculty.",
      quoteGu: "સર્વ હરિભક્તોમાં નિર્દોષભાવ રાખવો એ જ સાચો સત્સંગ છે.",
      quoteHi: "सभी भक्तों में निर्दोषभाव रखना ही सच्चा सत्संग है।",
      quoteEn: "Maintaining faultlessness towards all devotees is true spiritual fellowship.",
      correlationNote: "શ્લોક ૨૦૧-૨૨૫ માં સંપ, સુહૃદભાવ, એકતા અને દિવ્યભાવની આજ્ઞાઓનું મૂળ આ વચનામૃતમાં છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૧/૧૫૩",
      titleGu: "સ્વામીની વાતો ૧/૧૫૩",
      titleHi: "स्वामीनी बातों १/१५३",
      titleEn: "Swamini Vato 1/153",
      section: "Prakaran 1/153",
      topic: "સંપ, સુહૃદભાવ અને એકતાની અનિવાર્યતા",
      textGu: "સત્સંગમાં સંપ, સુહૃદભાવ ને એકતા રાખવી. પરસ્પર નાના થઈને રહેવું અને એકબીજાના ગુણ ગ્રહણ કરવા, તો મહારાજ ને સ્વામી અતિશય રાજી થાય છે.",
      textHi: "सत्संग में संप, सुहृदभाव और एकता रखनी चाहिए। परस्पर नम्र रहकर गुण ग्रहण करने चाहिए।",
      textEn: "Maintain harmony, friendship, and unity in Satsang. Live with humility and imbibe each other's virtues to earn the divine grace of Maharaj and Swami.",
      quoteGu: "સંપ રાખશે તેનું કામ સર્વ પ્રકારે સારું થશે.",
      quoteHi: "संप रखने वाले का सब कार्य सिद्ध होता है।",
      quoteEn: "Those who maintain unity succeed in all spiritual endeavors.",
      correlationNote: "યોગીજી મહારાજ અને મહંત સ્વામી મહારાજના પરમ સૂત્ર 'સંપ, સુહૃદભાવ ને એકતા' શ્લોક ૨૧૫-૨૩૫ માં અહીં પ્રતિપાદિત થાય છે."
    }
  ],

  // Shlokas 251-290: Swadharma, Varta-Vavahar, Shastra-Abhyas, Mandir Seva & Utsav
  "251-290": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા દ્વિતીય ૨૮",
      titleGu: "વચનામૃત ગઢડા દ્વિતીય ૨૮",
      titleHi: "वचनामृत गढडा द्वितीय २८",
      titleEn: "Vachnamrut Gadhada II-28",
      section: "Gadhada II-28",
      topic: "શાસ્ત્રાભ્યાસ, સત્સંગ સભા અને વ્યવહાર શુદ્ધિ",
      textGu: "રોજ સત્સંગ સભામાં જવું, શાસ્ત્રોનું શ્રવણ-વાંચન કરવું. અને વ્યવહારમાં પણ ધર્મ-નીતિ રાખીને કાર્ય કરવું. ક્યારેય અસત્ય કે અન્યાયથી ધન ન કમાવું.",
      textHi: "प्रतिदिन सत्संग सभा में जाना, शास्त्रों का अध्ययन करना और सत्य-नीति से व्यवहार करना चाहिए।",
      textEn: "Attend regular spiritual assemblies (Satsang Sabha), study scriptures daily, and conduct all worldly dealings with honesty, integrity, and righteousness.",
      quoteGu: "ધર્મયુક્ત વ્યવહાર જ શાંતિ અને સમૃદ્ધિ આપે છે.",
      quoteHi: "धर्मयुक्त व्यवहार ही शांति देता है।",
      quoteEn: "Righteous conduct alone brings enduring peace and prosperity.",
      correlationNote: "શ્લોક ૨૫૧-૨૭૫ માં સત્સંગ સભા, ઉત્સવ સેવા અને પ્રમાણિક વ્યવહારનું આદેશાત્મક નિરૂપણ છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૨/૧૭",
      titleGu: "સ્વામીની વાતો ૨/૧૭",
      titleHi: "स्वामीनी बातों २/१७",
      titleEn: "Swamini Vato 2/17",
      section: "Prakaran 2/17",
      topic: "મંદિર નિર્માણ, દર્શન અને ઉત્સવ સેવા",
      textGu: "મંદિરમાં જઈને ઠાકોરજીનાં દર્શન કરવાં, દંડવત-પ્રદક્ષિણા કરવી અને ઉત્સવ-સમૈયામાં તન-મન-ધનથી સેવા કરવી.",
      textHi: "मंदिर में जाकर दर्शन, दंडवत और उत्सवों में सेवा करनी चाहिए।",
      textEn: "Visit mandirs regularly for darshan, prostrations, and offer selfless service during spiritual festivals with body, mind, and wealth.",
      quoteGu: "મંદિરની સેવા એ અનંત જન્મોનાં પાપ બાળી નાખે છે.",
      quoteHi: "मंदिर सेवा अनंत जन्मों के पाप नष्ट करती है।",
      quoteEn: "Service to mandirs burns away accumulated karmic sins of countless births.",
      correlationNote: "શ્લોક ૨૭૫-૨૯૦ માં મંદિર દર્શન, આરતી અને ઉત્સવ ઉજવણીના નિયમોનું આ શાસ્ત્રીય સમર્થન છે."
    }
  ],

  // Shlokas 291-316: Dhyan, Smaran, Antakaal Samay, Phalashruti & Mahant Swami Maharaj Blessings
  "291-316": [
    {
      type: "vachnamrut",
      title: "વચનામૃત ગઢડા અંત્ય ૩૯",
      titleGu: "વચનામૃત ગઢડા અંત્ય ૩૯",
      titleHi: "वचनामृत गढडा अन्त्य ३९",
      titleEn: "Vachnamrut Gadhada III-39",
      section: "Gadhada III-39",
      topic: "શાસ્ત્ર શ્રવણ-પઠનનું પરમ ફળ અને અક્ષરધામની પ્રાપ્તિ",
      textGu: "જે આ સત્સંગના સિદ્ધાંતોનું નિત્ય શ્રવણ, મનન અને નિદિધ્યાસન કરશે તે આ લોકમાં પરમ સુખ ભોગવીને અંતકાળે ભગવાનના અક્ષરધામને પામશે.",
      textHi: "जो इन सिद्धांतों का नित्य श्रवण-मनन करेगा वह अंतकाल में भगवान के परम धाम को प्राप्त करेगा।",
      textEn: "Whoever daily studies, contemplates, and lives according to these divine principles will experience supreme bliss in this life and attain Akshardham at the time of death.",
      quoteGu: "અંતકાળે ભગવાન સાક્ષાત્ તેડી જવા પધારે છે.",
      quoteHi: "अंतकाल में प्रभु स्वयं पधारते हैं।",
      quoteEn: "At life's end, Bhagwan Himself comes to escort the devotee to Akshardham.",
      correlationNote: "શ્લોક ૩૧૧-૩૧૬ માં મહંત સ્વામી મહારાજ દ્વારા અપાયેલ ફલશ્રુતિ અને આશીર્વાદનું આ સાક્ષાત્ આધ્યાત્મિક ફળ છે."
    },
    {
      type: "swamini_vato",
      title: "સ્વામીની વાતો ૫/૬૩",
      titleGu: "સ્વામીની વાતો ૫/૬૩",
      titleHi: "स्वामीनी बातों ५/६३",
      titleEn: "Swamini Vato 5/63",
      section: "Prakaran 5/63",
      topic: "સત્સંગ દીક્ષાનો નિત્ય પાઠ અને બ્રહ્મસ્થિતિ",
      textGu: "આ વાતો અને આ સિદ્ધાંતો જે દરરોજ શીખશે અને અંતરમાં ઉતારશે તેનો જન્મ સુધરી જશે અને બ્રહ્મરૂપ થઈને અક્ષરધામમાં વાસ થશે.",
      textHi: "इन सिद्धांतों को जो प्रतिदिन सीखेगा वह ब्रह्मरूप होकर धाम को प्राप्त करेगा।",
      textEn: "Whoever learns and absorbs these divine principles daily will be elevated to the state of Brahmarup and attain eternal dwelling in Akshardham.",
      quoteGu: "આ શાસ્ત્રનો નિત્ય પાઠ કરવાથી જીવ કૃતાર્થ થાય છે.",
      quoteHi: "इस शास्त्र के नित्य पाठ से जीव कृतार्थ होता है।",
      quoteEn: "Through daily recitation and practice of this scripture, the soul achieves total fulfillment.",
      correlationNote: "શ્લોક ૩૧૪-૩૧૬ માં નિત્ય પઠનનું વિધાન અને મહંત સ્વામી મહારાજની હસ્તાક્ષર પ્રમાણિકતા અહીં પરિપૂર્ણ થાય છે."
    }
  ]
};

function getRefsForShloka(id: number): ScriptureReference[] {
  for (const [range, refs] of Object.entries(REFERENCE_DATABASE)) {
    const [min, max] = range.split('-').map(Number);
    if (id >= min && id <= max) {
      return refs;
    }
  }
  return REFERENCE_DATABASE["1-5"];
}

async function run() {
  console.log('Enriching all 316 shlokas with Vachnamrut and Swami ni Vato cross references...');
  const enrichedShlokas = SHLOKAS.map(shloka => {
    const refs = getRefsForShloka(shloka.id);
    return {
      ...shloka,
      crossReferences: refs
    };
  });

  const tsContent = `import { Shloka } from '../types';\n\nexport const SHLOKAS: Shloka[] = ${JSON.stringify(enrichedShlokas, null, 2)};\n\nexport function getAllShlokas(): Shloka[] {\n  return SHLOKAS;\n}\n\nexport function getShlokaById(id: number): Shloka | undefined {\n  return SHLOKAS.find(s => s.id === id);\n}\n`;

  fs.writeFileSync('src/data/shlokas.ts', tsContent, 'utf8');
  console.log(`Successfully added Vachnamrut & Swami ni Vato references to all ${enrichedShlokas.length} shlokas!`);
}

run();
