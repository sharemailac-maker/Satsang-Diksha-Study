export interface AppVersionInfo {
  version: string;
  buildTime: number;
  releaseDate: string;
  releaseNotesGu: string;
  releaseNotesHi: string;
  releaseNotesEn: string;
}

export const CURRENT_APP_VERSION: AppVersionInfo = {
  version: '2.6.0',
  buildTime: 1741340000000,
  releaseDate: '2026-09-07',
  releaseNotesGu: 'સ્વામીની વાતો સંબંધિત ચિપ્સ-લાઇક વ્યૂ (Chips-like view) અને અનિર્દેશ.કોમ પરથી તમામ શ્લોકો નીચે વિસ્તૃત સત્તાવાર વાતોનું સંકલન, તેમજ ઓનલાઇન આપોઆપ એપ અપડેટ નોટિફિકેશન',
  releaseNotesHi: 'स्वामीनी बातें संबंधित चिप्स-लाइक व्यू (Chips-like view) एवं Anirdesh.com से सभी श्लोकों के नीचे विस्तृत आधिकारिक बातों का संकलन, तथा ऑनलाइन स्वचालित ऐप अपडेट नोटिफिकेशन',
  releaseNotesEn: 'Swamini Vato chips-like view with authentic discourses from Anirdesh.com listed below each verse, and automatic background online app update notification system'
};
