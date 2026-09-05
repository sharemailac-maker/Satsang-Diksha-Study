// Global Audio Service for Satsang Diksha Authentic Recitations and Chanting

export type AudioFormat = 'sanskrit' | 'sanskrit_simple' | 'gujarati' | 'hindi';

export interface AudioFormatOption {
  id: AudioFormat;
  labelGu: string;
  labelHi: string;
  labelEn: string;
  descriptionGu: string;
  descriptionEn: string;
}

export const AUDIO_FORMAT_OPTIONS: AudioFormatOption[] = [
  {
    id: 'sanskrit',
    labelGu: 'વૈદિક ગાન (Vedic Raag)',
    labelHi: 'वैदिक गान (Vedic Raag)',
    labelEn: 'Vedic Chanting (Krishna Yajurveda)',
    descriptionGu: 'મહંત સ્વામી મહારાજ નિર્દિષ્ટ કૃષ્ણ યજુર્વેદીય શૈલીમાં પવિત્ર ગાન (બેકગ્રાઉન્ડ સંગીત સાથે)',
    descriptionEn: 'Sacred Krishna Yajurveda chanting in authentic male voice with divine background music'
  },
  {
    id: 'sanskrit_simple',
    labelGu: 'સરળ ગાન (Simple Raag)',
    labelHi: 'सरल गान (Simple Raag)',
    labelEn: 'Simple Classical Melody',
    descriptionGu: 'સરળ મધુર શાસ્ત્રીય રાગમાં સંસ્કૃત શ્લોક ગાન',
    descriptionEn: 'Melodic classical Sanskrit chanting in authentic male voice with background music'
  },
  {
    id: 'gujarati',
    labelGu: 'ગુજરાતી શ્રવણ (Gujarati)',
    labelHi: 'गुजराती श्रवण (Gujarati)',
    labelEn: 'Gujarati Recitation',
    descriptionGu: 'ગુજરાતી અર્થાનુવાદ પઠન (પુરૂષ સ્વરમાં)',
    descriptionEn: 'Clear Gujarati meaning recitation in male voice'
  },
  {
    id: 'hindi',
    labelGu: 'हिन्दी श्रवण (Hindi)',
    labelHi: 'हिन्दी श्रवण (Hindi)',
    labelEn: 'Hindi Recitation',
    descriptionGu: 'હિન્દી ભાવાર્થ પઠન (પુરૂષ સ્વરમાં)',
    descriptionEn: 'Clear Hindi meaning recitation in male voice'
  }
];

/**
 * Returns primary and mirror direct audio URLs for any shloka ID (1 to 315)
 */
export function getAudioUrls(shlokaId: number, format: AudioFormat = 'sanskrit'): string[] {
  const paddedNum = String(shlokaId).padStart(3, '0');
  
  return [
    // Direct fast archive node without redirect
    `https://ia800608.us.archive.org/3/items/satsang_diksha/${format}_${paddedNum}.mp3`,
    // Primary archive download endpoint
    `https://archive.org/download/satsang_diksha/${format}_${paddedNum}.mp3`,
    // Secondary mirror node
    `https://dn721605.ca.archive.org/0/items/satsang_diksha/${format}_${paddedNum}.mp3`
  ];
}

/**
 * Global single-instance audio player to prevent multiple audio tracks playing simultaneously
 */
class GlobalAudioController {
  private static instance: GlobalAudioController;
  private audio: HTMLAudioElement;
  private currentShlokaId: number | null = null;
  private currentFormat: AudioFormat = 'sanskrit';
  private listeners: Set<(state: { isPlaying: boolean; shlokaId: number | null; format: AudioFormat }) => void> = new Set();

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => this.notify());
    this.audio.addEventListener('pause', () => this.notify());
    this.audio.addEventListener('ended', () => {
      this.currentShlokaId = null;
      this.notify();
    });
    this.audio.addEventListener('error', () => {
      this.currentShlokaId = null;
      this.notify();
    });
  }

  public static getInstance(): GlobalAudioController {
    if (!GlobalAudioController.instance) {
      GlobalAudioController.instance = new GlobalAudioController();
    }
    return GlobalAudioController.instance;
  }

  public subscribe(cb: (state: { isPlaying: boolean; shlokaId: number | null; format: AudioFormat }) => void) {
    this.listeners.add(cb);
    cb({
      isPlaying: !this.audio.paused && !this.audio.ended,
      shlokaId: this.currentShlokaId,
      format: this.currentFormat
    });
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const state = {
      isPlaying: !this.audio.paused && !this.audio.ended,
      shlokaId: this.currentShlokaId,
      format: this.currentFormat
    };
    this.listeners.forEach(cb => cb(state));
  }

  public play(shlokaId: number, format: AudioFormat = 'sanskrit') {
    // If already playing this shloka & format, toggle pause
    if (this.currentShlokaId === shlokaId && this.currentFormat === format && !this.audio.paused) {
      this.audio.pause();
      return;
    }

    this.audio.pause();
    this.currentShlokaId = shlokaId;
    this.currentFormat = format;

    const urls = getAudioUrls(shlokaId, format);
    let urlIndex = 0;

    const tryPlayUrl = (index: number) => {
      if (index >= urls.length) {
        console.error('All audio mirrors failed for shloka', shlokaId);
        this.currentShlokaId = null;
        this.notify();
        return;
      }

      this.audio.src = urls[index];
      this.audio.load();
      
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Audio play failed for mirror ${urls[index]}, trying next mirror:`, err);
          tryPlayUrl(index + 1);
        });
      }
    };

    tryPlayUrl(urlIndex);
    this.notify();
  }

  public stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentShlokaId = null;
    this.notify();
  }

  public getPlayingShlokaId(): number | null {
    return !this.audio.paused ? this.currentShlokaId : null;
  }
}

export const globalAudio = GlobalAudioController.getInstance();
