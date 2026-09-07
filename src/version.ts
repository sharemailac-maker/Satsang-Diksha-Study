export interface AppVersionInfo {
  version: string;
  buildTime: number;
  releaseDate: string;
  releaseNotesGu: string;
  releaseNotesHi: string;
  releaseNotesEn: string;
}

export const CURRENT_APP_VERSION: AppVersionInfo = {
  version: '2.5.0',
  buildTime: 1741336000000,
  releaseDate: '2026-09-07',
  releaseNotesGu: 'વિસ્તૃત ૪,૪૧૦ વચનામૃત અને સ્વામીની વાતો સંબંધિત સંદર્ભો અને નવું આપોઆપ બેકગ્રાઉન્ડ અપડેટ નોટિફિકેશન સિસ્ટમ',
  releaseNotesHi: 'विस्तृत ४,४१० वचनामृत और स्वामीनी बातें संबंधित संदर्भ एवं नया स्वचालित बैकग्राउंड अपडेट नोटिफिकेशन सिस्टम',
  releaseNotesEn: 'Expanded 4,410 Vachnamrut and Swamini Vato scriptural cross-references and automatic background update notification system'
};
