// ─────────────────────────────────────────────────────────────
//  CTCore Mock Interview — global state (context + localStorage)
// ─────────────────────────────────────────────────────────────
import {
  createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode,
} from 'react';
import {
  type Question, type SectionId, type QuestionKind, type InterviewMode, type Difficulty,
  buildSession, evaluateTheory, gradeFor, SECTION_META, TIME_THEORY,
} from '../data/questions';

/* ── types ─────────────────────────────────────────────────── */
export interface AnswerRecord {
  question: Question;
  selectedIndex: number | null;   // mcq / code
  answerText: string;             // theory
  correct: boolean | null;        // null for unattempted theory scoring, boolean otherwise
  fraction: number;               // 0..1
  earned: number;
  timeTaken: number;              // seconds used
  timedOut: boolean;
}

export interface Attempt {
  id: string;
  date: number;
  mode: InterviewMode;
  modeLabel: string;
  candidateName: string;
  answers: AnswerRecord[];
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;               // % of attempted non-theory correct + theory fraction blend
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalQuestions: number;
  avgTime: number;                // seconds per question
  sectionBreakdown: Record<SectionId, { earned: number; max: number; percentage: number }>;
  weakest: SectionId | null;
  strongest: SectionId | null;
}

export interface SessionSnapshot {
  section: 'in-progress';
  mode: InterviewMode;
  modeLabel: string;
  questions: Question[];
  answers: AnswerRecord[];
  currentIndex: number;
  startedAt: number;
}

export type InterviewResult = Omit<Attempt, 'id' | 'date'>;

export interface BookmarkedQuestion extends Question {}

interface CTCoreContextType {
  // profile
  candidateName: string;
  setCandidateName: (n: string) => void;
  // question bank admin
  disabledIds: string[];
  toggleQuestionDisabled: (id: string) => void;
  resetBank: () => void;
  // bookmarks
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  // attempts
  attempts: Attempt[];
  recordAttempt: (a: Attempt) => void;
  clearHistory: () => void;
  // in-flight session handoff to /results
  lastResult: InterviewResult | null;
  setLastResult: (r: InterviewResult | null) => void;
}

const Ctx = createContext<CTCoreContextType | null>(null);
const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};

/* ── seeded demo history (first visit only) ────────────────── */
const SEED_KEY = 'ctcore.seeded';

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeedAttempts(): Attempt[] {
  const rand = mulberry32(20261030);
  const names = ['Full Interview Simulation'];
  const seeds: { daysAgo: number; pct: number }[] = [
    { daysAgo: 21, pct: 45 }, { daysAgo: 14, pct: 58 }, { daysAgo: 9, pct: 64 }, { daysAgo: 4, pct: 74 }, { daysAgo: 1, pct: 80 },
  ];
  const sections: SectionId[] = ['technology', 'aptitude', 'critical'];
  const attemptsBuilt = seeds.map((s, i) => {
    const questions = buildSession('full');
    const answers: AnswerRecord[] = questions.map((q) => {
      const acc = Math.min(0.97, Math.max(0.15, s.pct / 100 + (rand() - 0.5) * 0.35));
      const isCorrect = rand() < acc;
      const fraction = q.kind === 'theory' ? (isCorrect ? 0.5 + rand() * 0.5 : rand() * 0.45) : isCorrect ? 1 : 0;
      return {
        question: q,
        selectedIndex: q.kind === 'theory' ? null : isCorrect ? q.answerIndex! : (q.answerIndex! + 1 + Math.floor(rand() * 3)) % 4,
        answerText: q.kind === 'theory' ? (fraction > 0.5 ? 'Structured answer covering the key concepts with examples and clear reasoning steps.' : 'Attempted answer with partial reasoning.') : '',
        correct: q.kind === 'theory' ? null : isCorrect,
        fraction,
        earned: q.kind === 'theory' ? Math.round(fraction * q.points) : isCorrect ? q.points : 0,
        timeTaken: Math.round(6 + rand() * (q.timeLimit - 8)),
        timedOut: false,
      };
    });
    const score = answers.reduce((s2, a) => s2 + a.earned, 0);
    const maxScore = answers.reduce((s2, a) => s2 + a.question.points, 0);
    const breakdown = {} as Attempt['sectionBreakdown'];
    sections.forEach((sec) => {
      const sa = answers.filter((a) => a.question.section === sec);
      const earned = sa.reduce((x, a) => x + a.earned, 0);
      const max = sa.reduce((x, a) => x + a.question.points, 0);
      breakdown[sec] = { earned, max, percentage: max ? Math.round((earned / max) * 100) : 0 };
    });
    const order = [...sections].sort((x, y) => breakdown[x].percentage - breakdown[y].percentage);
    const d = new Date(); d.setDate(d.getDate() - s.daysAgo); d.setHours(10 + i * 3, 15 + i * 7, 0, 0);
    return {
      id: `seed-${i}`,
      date: d.getTime(),
      mode: 'full' as InterviewMode,
      modeLabel: names[0],
      candidateName: 'You',
      answers,
      score,
      maxScore,
      percentage: maxScore ? Math.round((score / maxScore) * 100) : 0,
      accuracy: maxScore ? Math.round((score / maxScore) * 100) : 0,
      correctCount: answers.filter((a) => a.earned > 0).length,
      incorrectCount: answers.filter((a) => a.earned === 0 && a.selectedIndex !== null).length,
      skippedCount: answers.filter((a) => a.selectedIndex === null && !a.answerText).length,
      totalQuestions: answers.length,
      avgTime: Math.round(answers.reduce((x, a) => x + a.timeTaken, 0) / answers.length),
      sectionBreakdown: breakdown,
      weakest: order[0],
      strongest: order[order.length - 1],
    };
  });
  return attemptsBuilt.sort((a, b) => b.date - a.date);
}

/* ── provider ──────────────────────────────────────────────── */
export function CTCoreProvider({ children }: { children: ReactNode }) {
  const [candidateName, setCandidateNameState] = useState<string>(() => load('ctcore.name', 'You'));
  const [disabledIds, setDisabledIds] = useState<string[]>(() => load('ctcore.disabled', []));
  const [bookmarks, setBookmarks] = useState<string[]>(() => load('ctcore.bookmarks', [] as string[]));
  const [attempts, setAttempts] = useState<Attempt[]>(() => {
    const existing = load<Attempt[] | null>('ctcore.attempts', null);
    if (existing) return existing;
    if (typeof localStorage !== 'undefined' && !localStorage.getItem(SEED_KEY)) {
      const seeded = buildSeedAttempts();
      localStorage.setItem(SEED_KEY, '1');
      localStorage.setItem('ctcore.attempts', JSON.stringify(seeded));
      return seeded;
    }
    return [];
  });
  const [lastResult, setLastResult] = useState<InterviewResult | null>(null);

  useEffect(() => { localStorage.setItem('ctcore.name', JSON.stringify(candidateName)); }, [candidateName]);
  useEffect(() => { localStorage.setItem('ctcore.disabled', JSON.stringify(disabledIds)); }, [disabledIds]);
  useEffect(() => { localStorage.setItem('ctcore.bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('ctcore.attempts', JSON.stringify(attempts)); }, [attempts]);

  const setCandidateName = useCallback((n: string) => setCandidateNameState(n.trim() || 'You'), []);
  const toggleQuestionDisabled = useCallback((id: string) =>
    setDisabledIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), []);
  const resetBank = useCallback(() => setDisabledIds([]), []);
  const toggleBookmark = useCallback((id: string) =>
    setBookmarks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), []);
  const recordAttempt = useCallback((a: Attempt) => setAttempts((p) => [a, ...p]), []);
  const clearHistory = useCallback(() => { setAttempts([]); localStorage.setItem('ctcore.attempts', '[]'); }, []);

  const value = useMemo(() => ({
    candidateName, setCandidateName,
    disabledIds, toggleQuestionDisabled, resetBank,
    bookmarks, toggleBookmark,
    attempts, recordAttempt, clearHistory,
    lastResult, setLastResult,
  }), [candidateName, setCandidateName, disabledIds, toggleQuestionDisabled, resetBank,
       bookmarks, toggleBookmark, attempts, recordAttempt, clearHistory, lastResult]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCTCore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCTCore must be used inside <CTCoreProvider>');
  return ctx;
}

/* ── scoring helper used by the interview flow ─────────────── */
export function scoreAnswers(questions: Question[], selected: (number | null)[], texts: string[], times: number[], timedOuts: boolean[]): AnswerRecord[] {
  return questions.map((q, i) => {
    const sel = selected[i];
    const text = texts[i] ?? '';
    const taken = times[i] ?? q.timeLimit;
    const isTheory = q.kind === 'theory';
    if (isTheory) {
      const ev = evaluateTheory(text, q);
      return { question: q, selectedIndex: null, answerText: text, correct: null, fraction: ev.fraction, earned: ev.earned, timeTaken: taken, timedOut: timedOuts[i] };
    }
    if (sel === null) {
      return { question: q, selectedIndex: null, answerText: '', correct: false, fraction: 0, earned: 0, timeTaken: taken, timedOut: timedOuts[i] };
    }
    const ok = sel === q.answerIndex;
    return { question: q, selectedIndex: sel, answerText: '', correct: ok, fraction: ok ? 1 : 0, earned: ok ? q.points : 0, timeTaken: taken, timedOut: timedOuts[i] };
  });
}

export function buildResult(questions: Question[], answers: AnswerRecord[], mode: InterviewMode, modeLabel: string, name: string): InterviewResult {
  const sections: SectionId[] = ['technology', 'aptitude', 'critical'];
  const score = answers.reduce((s, a) => s + a.earned, 0);
  const maxScore = answers.reduce((s, a) => s + a.question.points, 0);
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const breakdown = {} as InterviewResult['sectionBreakdown'];
  sections.forEach((sec) => {
    const sa = answers.filter((a) => a.question.section === sec);
    const earned = sa.reduce((x, a) => x + a.earned, 0);
    const max = sa.reduce((x, a) => x + a.question.points, 0);
    breakdown[sec] = { earned, max, percentage: max ? Math.round((earned / max) * 100) : 0 };
  });
  const present = sections.filter((s) => answers.some((a) => a.question.section === s));
  const order = [...present].sort((x, y) => breakdown[x].percentage - breakdown[y].percentage);
  const skipped = answers.filter((a) => a.selectedIndex === null && !a.answerText.trim()).length;
  const incorrect = answers.filter((a) => a.earned === 0 && (a.selectedIndex !== null || a.answerText.trim())).length;
  const correct = answers.length - skipped - incorrect;
  return {
    mode, modeLabel, candidateName: name, answers,
    score, maxScore, percentage, accuracy: percentage,
    correctCount: correct, incorrectCount: incorrect, skippedCount: skipped,
    totalQuestions: questions.length,
    avgTime: Math.round(answers.reduce((x, a) => x + a.timeTaken, 0) / Math.max(answers.length, 1)),
    sectionBreakdown: breakdown,
    weakest: order[0] ?? null,
    strongest: order[order.length - 1] ?? null,
  };
}

export { SECTION_META, gradeFor, TIME_THEORY };
export type { Question, QuestionKind, Difficulty, InterviewMode, SectionId };
