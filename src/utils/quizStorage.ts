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
