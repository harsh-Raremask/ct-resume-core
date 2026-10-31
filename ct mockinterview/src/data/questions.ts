// ─────────────────────────────────────────────────────────────
//  CTCore Mock Interview — Question Bank & Engine
//  Sections: Technology · Aptitude · Critical Thinking
//  Formats : MCQ · Code-Output Prediction · Theory (free text)
//  Timing  : MCQ / Code → 30s   ·   Theory → 90s
// ─────────────────────────────────────────────────────────────

export type SectionId = 'technology' | 'aptitude' | 'critical';
export type QuestionKind = 'mcq' | 'code' | 'theory';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  section: SectionId;
  kind: QuestionKind;
  difficulty: Difficulty;
  prompt: string;
  code?: string;
  language?: string;
  options?: string[];
  answerIndex?: number;
  keywords?: string[];
  modelAnswer?: string;
  explanation: string;
  company?: string;
  timeLimit: number; // seconds
  points: number;
}

export const TIME_MCQ = 30;
export const TIME_THEORY = 90;
export const POINTS_MCQ = 2;
export const POINTS_CODE = 3;
export const POINTS_THEORY = 6;

export const SECTION_META: Record<
  SectionId,
  { label: string; short: string; tagline: string; description: string; topics: string[] }
> = {
  technology: {
    label: 'Technology',
    short: 'TECH',
    tagline: 'Code, frameworks, DBMS & data structures',
    description:
      'Languages, frameworks, databases, data structures and output-prediction on real code snippets the way top product companies ask.',
    topics: ['JavaScript & React', 'Java & OOP', 'SQL & DBMS', 'Data Structures', 'HTML & Web', 'Output Prediction'],
  },
  aptitude: {
    label: 'Aptitude',
    short: 'APT',
    tagline: 'Quantitative, logical & numerical reasoning',
    description:
      'Speed math, percentages, ratios, averages, time-work-distance and probability — the eliminator round of every mass hiring drive.',
    topics: ['Speed & Distance', 'Percentages', 'Averages', 'Time & Work', 'Ratios', 'Probability', 'Number Series'],
  },
  critical: {
    label: 'Critical Thinking',
    short: 'CRIT',
    tagline: 'Reasoning, logic & structured judgement',
    description:
      'Syllogisms, assumptions, argument evaluation, debugging mindset and estimation — how companies test the way you think.',
    topics: ['Syllogisms', 'Assumptions', 'Argument Analysis', 'Debugging Mindset', 'Estimation', 'Logic Puzzles'],
  },
};
export const SECTION_ORDER: SectionId[] = ['technology', 'aptitude', 'critical'];

const T = TIME_MCQ, TH = TIME_THEORY;
const PM = POINTS_MCQ, PC = POINTS_CODE, PT = POINTS_THEORY;

export const QUESTION_BANK: Question[] = [
  // ═══════════ TECHNOLOGY (12) ═══════════
  { id: 't1', section: 'technology', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'TCS',
    prompt: 'Which React hook is used to add local state to a functional component?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'], answerIndex: 1,
    explanation: 'useState returns a state variable and an updater function. useEffect handles side effects, useContext reads context, and useReducer manages complex state transitions — but the primary local-state hook is useState.' },
  { id: 't2', section: 'technology', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'Infosys',
    prompt: 'What does a DBMS (Database Management System) primarily provide?',
    options: ['A compiler for query languages', 'A file compressor for backups', 'A system to store, retrieve and manage data with controlled access', 'A network protocol for database servers'], answerIndex: 2,
    explanation: 'A DBMS is software that defines, stores, retrieves and administers data while enforcing consistency, security and concurrent-access control.' },
  { id: 't3', section: 'technology', kind: 'code', difficulty: 'Medium', timeLimit: T, points: PC, language: 'JavaScript', company: 'Wipro',
    prompt: 'What will be printed to the console?',
    code: 'let count = 0;\nfor (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 2; j++) {\n    count++;\n  }\n}\nconsole.log(count);',
    options: ['3', '5', '6', '9'], answerIndex: 2,
    explanation: 'The outer loop runs 3 times and the inner loop runs 2 times per iteration, so count is incremented 3 × 2 = 6 times.' },
  { id: 't4', section: 'technology', kind: 'code', difficulty: 'Medium', timeLimit: T, points: PC, language: 'JavaScript', company: 'Accenture',
    prompt: 'What is the output of this statement?',
    code: 'console.log(typeof null);',
    options: ['"null"', '"undefined"', '"object"', '"number"'], answerIndex: 2,
    explanation: 'typeof null returns "object" — a well-known legacy bug in JavaScript that has been kept for backwards compatibility since the first version of the language.' },
  { id: 't5', section: 'technology', kind: 'code', difficulty: 'Hard', timeLimit: T, points: PC, language: 'Java', company: 'HCLTech',
    prompt: 'What does this Java program print?',
    code: 'String s = "CTCore";\nSystem.out.println(s.substring(1, 4));',
    options: ['"CT"', '"TCo"', '"TCor"', '"Core"'], answerIndex: 1,
    explanation: 'substring(1, 4) extracts characters at index 1, 2 and 3 — indexes are zero-based and the end index is exclusive. "C"=0, "T"=1, "C"=2, "o"=3 → "TCo".' },
  { id: 't6', section: 'technology', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Cognizant',
    prompt: 'What is the time complexity of Binary Search on a sorted array of n elements?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answerIndex: 2,
    explanation: 'Each comparison eliminates half of the remaining search space, so the number of steps is log₂n — giving O(log n) complexity.' },
  { id: 't7', section: 'technology', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Tech Mahindra',
    prompt: 'An INNER JOIN between tables A and B returns…',
    options: ['All rows from A, matched or not', 'Only rows that have a matching key in both A and B', 'All rows from both tables regardless of match', 'Rows in A with no match in B'], answerIndex: 1,
    explanation: 'INNER JOIN keeps only the rows where the join condition matches in both tables. LEFT JOIN would keep unmatched rows from A; FULL OUTER JOIN keeps everything.' },
  { id: 't8', section: 'technology', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Capgemini',
    prompt: 'In OOP, restricting direct access to an object’s internal state using access modifiers is called…',
    options: ['Inheritance', 'Polymorphism', 'Abstraction of interfaces', 'Encapsulation'], answerIndex: 3,
    explanation: 'Encapsulation bundles data and behaviour together and hides internal state behind controlled access (private fields + public getters/setters), preventing invalid external mutation.' },
  { id: 't9', section: 'technology', kind: 'theory', difficulty: 'Medium', timeLimit: TH, points: PT, company: 'Amazon',
    prompt: 'Explain the difference between == and === in JavaScript with a concrete example. What would you flag in a code review?',
    keywords: ['type', 'coer', 'strict', 'compare'],
    modelAnswer: '== performs abstract equality with type coercion — it converts operands to a common type before comparing (e.g. 0 == "0" → true). === is strict equality: it compares both value and type with no coercion (e.g. 0 === "0" → false). In code review I would require === by default, because implicit coercion hides bugs (null == undefined, "" == 0, NaN quirks) and makes intent ambiguous.',
    explanation: 'Key points: type coercion vs strict comparison, concrete coerced example, and the review rule — always prefer === unless you explicitly need null/undefined detection.' },
  { id: 't10', section: 'technology', kind: 'theory', difficulty: 'Easy', timeLimit: TH, points: PT, company: 'LTIMindtree',
    prompt: 'What is normalization in a DBMS? Explain the problem it solves and name at least one normal form.',
    keywords: ['redund', 'anomal', 'dependency', 'form'],
    modelAnswer: 'Normalization is the process of structuring relational tables to eliminate data redundancy and the anomalies it causes — insertion, update and deletion anomalies. It does this by splitting tables so every attribute depends on the key. Normal forms progress: 1NF removes repeating groups, 2NF removes partial dependencies on a composite key, 3NF removes transitive dependencies.',
    explanation: 'Interviewers listen for: redundancy as the enemy, the three anomalies, and at least one normal form with its dependency rule.' },
  { id: 't11', section: 'technology', kind: 'code', difficulty: 'Easy', timeLimit: T, points: PC, language: 'JavaScript', company: 'Persistent',
    prompt: 'What is the output?',
    code: 'const nums = [10, 20, 30, 40];\nconst keep = nums.filter(n => n > 15);\nconsole.log(keep.length);',
    options: ['1', '2', '3', '4'], answerIndex: 2,
    explanation: 'filter keeps elements satisfying n > 15 → [20, 30, 40]. Array length 3 is printed.' },
  { id: 't12', section: 'technology', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'Oracle',
    prompt: 'Which HTML element renders the largest main heading on a page?',
    options: ['<heading>', '<h6>', '<h1>', '<head>'], answerIndex: 2,
    explanation: '<h1> is the top-level heading (h1…h6 descending). <head> holds metadata and <heading> is not valid HTML.' },

  // ═══════════ APTITUDE (12) ═══════════
  { id: 'a1', section: 'aptitude', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'TCS',
    prompt: 'A car travels 240 km in 3 hours. What is its average speed?',
    options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'], answerIndex: 2,
    explanation: 'Average speed = total distance ÷ total time = 240 ÷ 3 = 80 km/h.' },
  { id: 'a2', section: 'aptitude', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'Wipro',
    prompt: 'What is the average of 10, 20, 30, 40 and 50?',
    options: ['25', '28', '30', '32'], answerIndex: 2,
    explanation: 'Sum = 150; number of values = 5; average = 150 ÷ 5 = 30.' },
  { id: 'a3', section: 'aptitude', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Accenture',
    prompt: 'If 5 machines take 5 minutes to make 5 widgets, how long will 100 machines take to make 100 widgets?',
    options: ['100 minutes', '20 minutes', '5 minutes', '1 minute'], answerIndex: 2,
    explanation: '5 machines make 5 widgets in 5 minutes → 1 machine makes 1 widget in 5 minutes. 100 machines in parallel still take 5 minutes per widget — so 100 widgets take 5 minutes.' },
  { id: 'a4', section: 'aptitude', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Infosys',
    prompt: 'A bat and a ball together cost ₹110. The bat costs ₹100 more than the ball. How much does the ball cost?',
    options: ['₹10', '₹5', '₹1', '₹15'], answerIndex: 1,
    explanation: 'Let ball = x → bat = x + 100 → 2x + 100 = 110 → x = ₹5. The intuitive ₹10 answer is wrong: then bat = ₹110 and total ₹120.' },
  { id: 'a5', section: 'aptitude', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'HCLTech',
    prompt: 'What is the sum of the first 50 natural numbers (1 + 2 + … + 50)?',
    options: ['1225', '1275', '1250', '1325'], answerIndex: 1,
    explanation: 'Sum = n(n+1)/2 = 50 × 51 ÷ 2 = 1275.' },
  { id: 'a6', section: 'aptitude', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Cognizant',
    prompt: 'A price is increased by 20% and then decreased by 20%. What is the net effect?',
    options: ['No change', '2% increase', '4% increase', '4% decrease'], answerIndex: 3,
    explanation: 'Successive changes multiply: 1.20 × 0.80 = 0.96 → a net decrease of 4%. The bases differ, so the changes never cancel out.' },
  { id: 'a7', section: 'aptitude', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Tech Mahindra',
    prompt: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'], answerIndex: 2,
    explanation: 'Terms are n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30 → next 6×7 = 42. Differences (4,6,8,10) also rise by 2 → +12 → 42.' },
  { id: 'a8', section: 'aptitude', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Capgemini',
    prompt: 'A fair die is rolled once. What is the probability of getting an even number?',
    options: ['1/3', '1/6', '1/2', '2/3'], answerIndex: 2,
    explanation: 'Even faces are 2, 4, 6 → 3 favourable out of 6 faces → probability = 3/6 = 1/2.' },
  { id: 'a9', section: 'aptitude', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Amdocs',
    prompt: 'A can finish a piece of work in 12 days and B in 24 days. Working together, how long will they take?',
    options: ['6 days', '8 days', '9 days', '10 days'], answerIndex: 1,
    explanation: 'A’s rate = 1/12 per day, B’s rate = 1/24 per day. Combined = 1/12 + 1/24 = 2/24 + 1/24 = 3/24 = 1/8 → 8 days.' },
  { id: 'a10', section: 'aptitude', kind: 'theory', difficulty: 'Medium', timeLimit: TH, points: PT, company: 'Amazon',
    prompt: 'A pipe fills a tank in 6 hours and a drain empties it in 9 hours. Both are opened together on an empty tank. Explain step by step how long the tank takes to fill.',
    keywords: ['18', 'rate', 'net'],
    modelAnswer: 'Fill rate = 1/6 tank per hour; drain rate = 1/9 tank per hour. Net rate = 1/6 − 1/9 = 3/18 − 2/18 = 1/18 tank per hour. So the tank fills completely in 18 hours. Always convert times to rates, combine, then invert.',
    explanation: 'Graders look for the rate-conversion method: individual rates → net rate (difference) → reciprocal → 18 hours. Saying “9 hours” means you added rates wrongly; “15 hours” means you averaged.' },
  { id: 'a11', section: 'aptitude', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'LTIMindtree',
    prompt: 'If A : B = 2 : 3 and B : C = 4 : 5, what is A : C?',
    options: ['2 : 5', '6 : 12', '8 : 15', '4 : 9'], answerIndex: 2,
    explanation: 'Make B common: LCM of 3 and 4 = 12. A:B = 8:12, B:C = 12:15 → A:C = 8:15.' },
  { id: 'a12', section: 'aptitude', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Oracle',
    prompt: 'A man walks 2 hours at 5 km/h and then 3 hours at 4 km/h. What is his average speed for the whole journey?',
    options: ['4.5 km/h', '4.6 km/h', '4.2 km/h', '4.4 km/h'], answerIndex: 3,
    explanation: 'Distance = (2 × 5) + (3 × 4) = 10 + 12 = 22 km. Total time = 5 h. Average speed = 22 ÷ 5 = 4.4 km/h. Averaging the speeds (4.5) is the trap.' },

  // ═══════════ CRITICAL THINKING (12) ═══════════
  { id: 'c1', section: 'critical', kind: 'mcq', difficulty: 'Easy', timeLimit: T, points: PM, company: 'Deloitte',
    prompt: 'All Bloops are Razzies. All Razzies are Lazzies. Therefore, all Bloops are Lazzies. This conclusion is…',
    options: ['True', 'False', 'Cannot be determined', 'Only sometimes true'], answerIndex: 0,
    explanation: 'Classic syllogism: if every Bloop is a Razzie and every Razzie is a Lazzie, then transitivity forces every Bloop to be a Lazzie. The chain holds unconditionally.' },
  { id: 'c2', section: 'critical', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'EY',
    prompt: '“If it rains, the match is cancelled.” The match was NOT cancelled. What can you conclude?',
    options: ['It rained', 'It did not rain', 'The match was postponed', 'Nothing can be concluded'], answerIndex: 1,
    explanation: 'Modus tollens: Rain → Cancelled. Not cancelled → not rain. (The converse — “if it did not rain, the match happens” — is what you may not assume.)' },
  { id: 'c3', section: 'critical', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Google',
    prompt: 'Five people A, B, C, D, E stand in a row. E stands first. C stands somewhere after E but before A. B stands immediately after A. D stands somewhere after B. What is the final order?',
    options: ['E C A B D', 'E A C B D', 'C E A D B', 'E C A D B'], answerIndex: 0,
    explanation: 'E first → E _ _ _ _. C after E, before A → E C A _ _. B immediately after A → E C A B _. D after B → E C A B D.' },
  { id: 'c4', section: 'critical', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Microsoft',
    prompt: 'A test suite is flaky: it passes 9 out of 10 runs with no code changes. What is the most probable root cause?',
    options: ['The compiler has a bug', 'A race condition or hidden external-state dependency', 'The CPU is too fast', 'The IDE is corrupting files'], answerIndex: 1,
    explanation: 'Non-determinism with zero code change points at hidden state: timing races, shared test data, network/timezone dependence — not at the compiler or CPU, which are deterministic.' },
  { id: 'c5', section: 'critical', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'KPMG',
    prompt: 'No cat is a dog. Some dogs are pets. Conclusion: Some pets are not cats. This conclusion…',
    options: ['Follows logically', 'Does not follow', 'Is only true if all pets are dogs', 'Cannot be evaluated without more data'], answerIndex: 0,
    explanation: 'The pets that are dogs exist (given). No dog is a cat. Therefore those pets are not cats — at least one pet is not a cat, which is exactly what the conclusion claims.' },
  { id: 'c6', section: 'critical', kind: 'theory', difficulty: 'Medium', timeLimit: TH, points: PT, company: 'Atlassian',
    prompt: 'A client keeps changing requirements midway through a sprint. Walk me through exactly how you would handle this situation as a team member.',
    keywords: ['scope', 'priorit', 'stakeholder', 'communic'],
    modelAnswer: 'First, pause and communicate — document the change and raise it with the product owner/stakeholder, not silently absorb it. Then assess scope impact: what existing committed stories are affected? Re-prioritize with the team using impact vs. urgency, and swap items out of the sprint explicitly rather than stretching it. Agree on a change-control rule (e.g. change freeze after mid-sprint) so the behaviour does not repeat. Throughout, keep the client informed with clear trade-offs and options.',
    explanation: 'Strong answers cover: acknowledge, communicate, scope assessment, re-prioritization with stakeholders, explicit trade-offs, and a systemic fix (change-control) — not just “work harder”.' },
  { id: 'c7', section: 'critical', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Flipkart',
    prompt: '“9 of 10 engineers on our team prefer Framework X, so the whole company should adopt it.” What is the biggest flaw?',
    options: ['Framework X might be slower', 'The sample is biased — it only surveys a team already using X', '9 of 10 is too small a majority', 'Engineers are not decision makers'], answerIndex: 1,
    explanation: 'Selection bias: the 9/10 preference comes from people already working with X daily, so it cannot represent the whole company. Speed is speculation; the sampling flaw is structural.' },
  { id: 'c8', section: 'critical', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'PayPal',
    prompt: 'Some engineers are introverts. All introverts dislike crowds. Conclusion: Some engineers dislike crowds. This follows…',
    options: ['Yes, definitely', 'No, never', 'Only if all engineers are introverts', 'Cannot be determined'], answerIndex: 0,
    explanation: 'The introverts who are engineers exist (“some”). Every introvert dislikes crowds. Hence at least one engineer dislikes crowds — a valid particular syllogism.' },
  { id: 'c9', section: 'critical', kind: 'code', difficulty: 'Medium', timeLimit: T, points: PC, language: 'JavaScript', company: 'Swiggy',
    prompt: 'What will this code print?',
    code: 'const data = [3, 1, 4, 1, 5, 9, 2, 6];\nconst sorted = [...data].sort((a, b) => a - b);\nconsole.log(sorted[3] + sorted[4]);',
    options: ['5', '6', '7', '9'], answerIndex: 2,
    explanation: 'Sorted: [1, 1, 2, 3, 4, 5, 6, 9]. Index 3 → 3, index 4 → 4. Sum = 7. Note the numeric comparator is essential — default string sort would give a different order.' },
  { id: 'c10', section: 'critical', kind: 'mcq', difficulty: 'Hard', timeLimit: T, points: PM, company: 'Morgan Stanley',
    prompt: '“This sentence is false.” Which of the following best describes this statement?',
    options: ['A tautology', 'A contradiction in form', 'A self-referential liar paradox', 'A valid proposition'], answerIndex: 2,
    explanation: 'If true, the sentence asserts its own falsity; if false, it must be true. No consistent truth value exists — the classic liar paradox arising from unrestricted self-reference.' },
  { id: 'c11', section: 'critical', kind: 'theory', difficulty: 'Hard', timeLimit: TH, points: PT, company: 'McKinsey',
    prompt: 'Estimate how many tennis balls would fit inside a standard school bus. Explain your reasoning step by step.',
    keywords: ['volume', 'assum', 'estimate', 'pack'],
    modelAnswer: 'Structure the estimate: bus ≈ 12 m long × 2.5 m wide × 2 m tall ≈ 60 m³ interior; usable volume after seats and driver ≈ 60–70% → ~40 m³. A tennis ball has diameter ≈ 6.7 cm → radius 0.0335 m → volume ≈ 1.57 × 10⁻⁴ m³. Packing efficiency for spheres ≈ 64%. Balls ≈ (40 × 0.64) / 1.57e-4 ≈ 160,000–165,000. State assumptions, compute volume, apply packing factor — the method matters more than the exact number.',
    explanation: 'Fermi-style estimation is graded on method: boxed assumptions, volume maths, packing efficiency, sanity check. A confident order-of-magnitude (~150k) with clear assumptions beats a lucky exact number.' },
  { id: 'c12', section: 'critical', kind: 'mcq', difficulty: 'Medium', timeLimit: T, points: PM, company: 'Deloitte',
    prompt: '“After we hired 2 ML engineers, our revenue grew 30%. Machine learning caused the growth.” What is the flaw?',
    options: ['Two ML engineers cannot work on revenue', 'Correlation does not imply causation', '30% growth is too small to matter', 'Revenue data is unreliable'], answerIndex: 1,
    explanation: 'Post-hoc reasoning: two events occurring in sequence does not prove causation. Growth could come from sales, seasonality or pricing. Controlled evidence is needed.' },
];

// ─────────────────────────────────────────────────────────────
//  Engine helpers
// ─────────────────────────────────────────────────────────────

export type InterviewMode = 'full' | SectionId;

export const MODE_LABEL: Record<InterviewMode, string> = {
  full: 'Full Interview Simulation',
  technology: 'Technology Round',
  aptitude: 'Aptitude Round',
  critical: 'Critical Thinking Round',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a fresh interview session. `full` samples 4 per section (12 total). */
export function buildSession(mode: InterviewMode, disabledIds: string[] = []): Question[] {
  const pool = QUESTION_BANK.filter((q) => !disabledIds.includes(q.id));
  if (mode === 'full') {
    const per = SECTION_ORDER.flatMap((s) => shuffle(pool.filter((q) => q.section === s)).slice(0, 4));
    return shuffle(per);
  }
  return shuffle(pool.filter((q) => q.section === mode));
}

export interface TheoryEvaluation {
  earned: number;
  fraction: number;
  matched: string[];
  missed: string[];
}

/** Keyword-coverage scoring for theory answers. */
export function evaluateTheory(answer: string, q: Question): TheoryEvaluation {
  const keys = q.keywords ?? [];
  if (!answer.trim()) return { earned: 0, fraction: 0, matched: [], missed: [...keys] };
  const text = answer.toLowerCase();
  const matched = keys.filter((k) => text.includes(k.toLowerCase()));
  const missed = keys.filter((k) => !matched.includes(k));
  const wordBonus = Math.min(answer.trim().split(/\s+/).length / 60, 1); // reward substantive answers
  const raw = matched.length / Math.max(keys.length, 1);
  const fraction = Math.min(1, raw * 0.8 + wordBonus * 0.2);
  return { earned: Math.round(fraction * q.points), fraction, matched, missed };
}

export function gradeFor(pct: number): string {
  if (pct >= 90) return 'Outstanding';
  if (pct >= 80) return 'Excellent';
  if (pct >= 70) return 'Strong';
  if (pct >= 60) return 'Good';
  if (pct >= 40) return 'Needs Improvement';
  return 'Keep Practising';
}

export const gradeColor = (pct: number): string =>
  pct >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
  : pct >= 60 ? 'text-sky-700 bg-sky-50 border-sky-200'
  : pct >= 40 ? 'text-amber-700 bg-amber-50 border-amber-200'
  : 'text-rose-600 bg-rose-50 border-rose-200';
