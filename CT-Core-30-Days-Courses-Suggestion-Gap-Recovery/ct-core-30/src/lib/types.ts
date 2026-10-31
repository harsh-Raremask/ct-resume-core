export type RoleId = 'frontend' | 'backend' | 'data' | 'uiux' | 'marketing';

export interface RoleDef {
  id: RoleId;
  label: string;
  short: string;
  tagline: string;
  skills: string[];
  futureStack: string[];
  accent: string;
}

export interface CourseDef {
  title: string;
  channel: string;
  id?: string;      // YouTube video id (when known-good)
  dur: string;
  lvl: 'Beginner' | 'Core' | 'Intermediate' | 'Advanced';
  url: string;
}

export type DayType = 'Learn' | 'Practice' | 'Project' | 'Review';

export interface PlanDay {
  day: number;
  week: number;
  skill: string;
  title: string;
  tasks: string[];
  type: DayType;
  duration: string;
}

export interface TechRecs {
  missing: { name: string; why: string; demand: 'High' | 'Growing' | 'Essential' }[];
  complementary: { name: string; why: string }[];
  future: { name: string; why: string; demand: string }[];
}

export interface ATSSection {
  key: string;
  label: string;
  score: number;
  max: number;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  tip: string;
}

export interface AnalysisResult {
  roleId: RoleId;
  roleLabel: string;
  gap: string;
  dailyTime: string;
  learningStyle: string;
  candidateName: string;
  lastActiveYear: number | null;
  wordCount: number;
  readingMinutes: number;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  detectedSkills: { name: string; category: string }[];
  atsTotal: number;
  atsGrade: string;
  sections: ATSSection[];
  readiness: number;
  projectedReadiness: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  quantifiedAchievements: number;
  actionVerbsFound: string[];
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedin: boolean;
  hasGithub: boolean;
  hasSummary: boolean;
  tech: TechRecs;
  plan: PlanDay[];
  summary: string;
  aiSummary: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  name: string;
  roleLabel: string;
  atsTotal: number;
  matchScore: number;
  readiness: number;
  topMissing: string[];
  gap: string;
}
