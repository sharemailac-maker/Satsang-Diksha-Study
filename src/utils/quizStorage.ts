import { QuizAttemptRecord } from '../types';

const STORAGE_ATTEMPTS_KEY = 'sd_quiz_attempts';
const STORAGE_DAILY_STREAK_KEY = 'sd_quiz_daily_streak';

export interface DailyStreakInfo {
  streak: number;
  lastDate: string; // YYYY-MM-DD
  completedToday: boolean;
  totalTestsCompleted: number;
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getQuizAttempts(): QuizAttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizAttemptRecord[];
  } catch (err) {
    console.error('Failed to load quiz attempts from localStorage', err);
    return [];
  }
}

export function saveQuizAttempt(record: QuizAttemptRecord): void {
  try {
    const attempts = getQuizAttempts();
    attempts.unshift(record); // newest first
    // Limit to latest 50 attempts
    const trimmed = attempts.slice(0, 50);
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save quiz attempt', err);
  }
}

export function getBestScores(): Record<string, { score: number; total: number; percentage: number; date: string }> {
  const attempts = getQuizAttempts();
  const best: Record<string, { score: number; total: number; percentage: number; date: string }> = {};

  for (const att of attempts) {
    const key = String(att.testSetId);
    if (!best[key] || att.percentage > best[key].percentage) {
      best[key] = {
        score: att.score,
        total: att.total,
        percentage: att.percentage,
        date: att.date
      };
    }
  }

  return best;
}

export function getDailyStreak(): DailyStreakInfo {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  try {
    const raw = localStorage.getItem(STORAGE_DAILY_STREAK_KEY);
    if (!raw) {
      return { streak: 0, lastDate: '', completedToday: false, totalTestsCompleted: 0 };
    }
    const data = JSON.parse(raw);
    const completedToday = data.lastDate === today;
    let currentStreak = data.streak || 0;

    // If last completion was before yesterday, streak broke
    if (data.lastDate !== today && data.lastDate !== yesterday) {
      currentStreak = 0;
    }

    return {
      streak: currentStreak,
      lastDate: data.lastDate || '',
      completedToday,
      totalTestsCompleted: data.totalTestsCompleted || 0
    };
  } catch (err) {
    return { streak: 0, lastDate: '', completedToday: false, totalTestsCompleted: 0 };
  }
}

export function recordDailyCompletion(): DailyStreakInfo {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const current = getDailyStreak();

  let newStreak = current.streak;
  if (!current.completedToday) {
    if (current.lastDate === yesterday) {
      newStreak = current.streak + 1;
    } else {
      newStreak = 1;
    }
  }

  const updated: DailyStreakInfo = {
    streak: newStreak,
    lastDate: today,
    completedToday: true,
    totalTestsCompleted: (current.totalTestsCompleted || 0) + 1
  };

  try {
    localStorage.setItem(STORAGE_DAILY_STREAK_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save daily streak', err);
  }

  return updated;
}

export interface BonusUnlockInfo {
  isBonus: boolean;
  reqLevels: number[];
  passedLevels: number[];
  passedCount: number;
  totalCount: number;
  isUnlocked: boolean;
  labelGu: string;
  labelHi: string;
  labelEn: string;
  rangeDescGu: string;
  rangeDescHi: string;
  rangeDescEn: string;
}

export function getBonusUnlockStatus(
  bSetId: number, 
  bestScores: Record<string, { score: number; total: number; percentage: number }>
): BonusUnlockInfo {
  if (bSetId < 27 || bSetId > 32) {
    return {
      isBonus: false,
      reqLevels: [],
      passedLevels: [],
      passedCount: 0,
      totalCount: 0,
      isUnlocked: true,
      labelGu: '',
      labelHi: '',
      labelEn: '',
      rangeDescGu: '',
      rangeDescHi: '',
      rangeDescEn: ''
    };
  }

  let reqLevels: number[] = [];
  let rangeDescGu = '';
  let rangeDescHi = '';
  let rangeDescEn = '';

  if (bSetId === 27) {
    reqLevels = [1, 2, 3, 4, 5];
    rangeDescGu = 'લેવલ ૧ થી ૫';
    rangeDescHi = 'लेवल १ से ५';
    rangeDescEn = 'Levels 1 to 5';
  } else if (bSetId === 28) {
    reqLevels = [6, 7, 8, 9, 10];
    rangeDescGu = 'લેવલ ૬ થી ૧૦';
    rangeDescHi = 'लेवल ६ से १०';
    rangeDescEn = 'Levels 6 to 10';
  } else if (bSetId === 29) {
    reqLevels = [11, 12, 13, 14, 15];
    rangeDescGu = 'લેવલ ૧૧ થી ૧૫';
    rangeDescHi = 'लेवल ११ से १५';
    rangeDescEn = 'Levels 11 to 15';
  } else if (bSetId === 30) {
    reqLevels = [16, 17, 18, 19, 20];
    rangeDescGu = 'લેવલ ૧૬ થી ૨૦';
    rangeDescHi = 'लेवल १६ से २०';
    rangeDescEn = 'Levels 16 to 20';
  } else if (bSetId === 31) {
    reqLevels = [21, 22, 23, 24, 25];
    rangeDescGu = 'લેવલ ૨૧ થી ૨૫';
    rangeDescHi = 'लेवल २१ से २५';
    rangeDescEn = 'Levels 21 to 25';
  } else if (bSetId === 32) {
    // 100 Hard Qs Grand Test requires all 26 levels to have >= 90%
    reqLevels = Array.from({ length: 26 }, (_, i) => i + 1);
    rangeDescGu = 'તમામ ૨૬ લેવલ';
    rangeDescHi = 'सभी २६ स्तर';
    rangeDescEn = 'All 26 levels';
  }

  const passedLevels = reqLevels.filter(lvl => {
    const sc = bestScores[String(lvl)];
    return sc !== undefined && sc.percentage >= 90;
  });

  const passedCount = passedLevels.length;
  const totalCount = reqLevels.length;
  const isUnlocked = reqLevels.length > 0 && passedCount === totalCount;

  const labelGu = bSetId === 32
    ? `તમામ ૨૬ લેવલમાં ૯૦%+ ફરજિયાત (${passedCount}/${totalCount} પૂર્ણ)`
    : `${rangeDescGu} તમામ ૫ ટેસ્ટમાં ૯૦%+ ફરજિયાત (${passedCount}/૫ પૂર્ણ)`;

  const labelHi = bSetId === 32
    ? `सभी २६ स्तरों में ९०%+ अनिवार्य (${passedCount}/${totalCount} पूर्ण)`
    : `${rangeDescHi} सभी ५ टेस्ट में ९०%+ अनिवार्य (${passedCount}/५ पूर्ण)`;

  const labelEn = bSetId === 32
    ? `90%+ required in all 26 levels (${passedCount}/${totalCount} completed)`
    : `90%+ required in all 5 tests (${rangeDescEn}) (${passedCount}/5 completed)`;

  return {
    isBonus: true,
    reqLevels,
    passedLevels,
    passedCount,
    totalCount,
    isUnlocked,
    labelGu,
    labelHi,
    labelEn,
    rangeDescGu,
    rangeDescHi,
    rangeDescEn
  };
}
