import { COURSES, TECH_SKILLS, ACTION_VERBS, SECTION_PATTERNS, ROLES, PLAN_TEMPLATES, COMPLEMENTARY, FUTURE_STACK } from './data';
import type { AnalysisResult, RoleId, ATSSection, PlanDay, TechRecs } from './types';

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export interface AnalyzerInput {
  text: string;
  roleId: RoleId;
  gap: string;
  dailyTime: string;
  learningStyle: string;
}

export function analyzeResume({ text, roleId, gap, dailyTime, learningStyle }: AnalyzerInput): AnalysisResult {
  const role = ROLES.find(r => r.id === roleId)!;
  const raw = text.trim();
  const lower = raw.toLowerCase();
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const words = raw.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 220));

  /* ---------- candidate name ---------- */
  const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
  const PHONE_RE = /(\+?\d[\d\s().-]{9,}\d)/;
  const email = raw.match(EMAIL_RE)?.[0] ?? null;
  const phone = raw.match(PHONE_RE)?.[0]?.trim() ?? null;

  // Blank-the-noise copy: everything meta (years, contact info, URLs, digits) is masked
  // so "gap: 3 years" / "2018-2021" can't masquerade as skills (e.g. matching "ts" inside "45-60").
  const clean = lower
    .replace(new RegExp(EMAIL_RE.source, 'gi'), ' ')
    .replace(new RegExp(PHONE_RE.source, 'g'), ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/(?:19|20)\d{2}/g, ' ')
    .replace(/[₹$€£]?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|x|k\b|lakh|crore|million|monthly|\/\w+)/gi, ' ')
    .replace(/\b\d[\d,]*\b/g, ' ');


  const emailLine = email ? lines.findIndex(l => l.includes(email)) : -1;
  const phoneLine = phone ? lines.findIndex(l => l.includes(phone)) : -1;
  let candidateName = 'Your Resume';
  const isNoiseLine = (l: string) =>
    EMAIL_RE.test(l) || PHONE_RE.test(l) || /https?:|www\.|linkedin|github|portfolio/i.test(l) || l.length > 44 || l.length < 3 || /\d{4}/.test(l);
  const HEADER_NOISE = /^(resume|curriculum vitae|cv|biodata|profile|portfolio|contact|personal details)$/i;
  const nameCandidates = lines
    .slice(0, 8)
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => {
      const t = l.replace(/[,|].*$/, '').trim();
      return /^[A-Za-z][A-Za-z.'-]*(\s+[A-Za-z][A-Za-z.'-]*){0,3}$/.test(t) && !isNoiseLine(l) && !HEADER_NOISE.test(t) && t.split(/\s+/).length <= 4;
    });
  const nameLine = nameCandidates.find(({ i }) => i <= (emailLine === -1 ? 6 : emailLine + 1)) ?? nameCandidates[0];
  if (nameLine) candidateName = nameLine.l.replace(/[,|].*$/, '').trim();
  else if (email) {
    const prefix = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    candidateName = prefix.replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ---------- contact & links ---------- */
  const hasEmail = !!email;
  const hasPhone = !!phone && phone.replace(/\D/g, '').length >= 10;
  const linkedin = /linkedin\.com\/in\/[\w-]+/i.test(raw);
  const github = /github\.com\/[\w-]+/i.test(raw);
  const portfolio = /portfolio|behance\.net|dribbble\.com|personal\s?(site|website)|vercel\.app|netlify\.app/i.test(raw);
  const urlCount = (raw.match(/https?:\/\/\S+/gi) || []).length;

  /* ---------- section detection ---------- */
  const hasEducation = SECTION_PATTERNS.education.test(lower);
  const hasExperience = SECTION_PATTERNS.experience.test(lower) || /\b(19|20)\d{2}\s*[-–—]\s*(19|20)?\d{0,4}/.test(raw);
  const hasSkillsSection = SECTION_PATTERNS.skills.test(lower);
  const hasProjects = SECTION_PATTERNS.projects.test(lower);
  const hasSummary = SECTION_PATTERNS.summary.test(lower);
  const hasCertifications = SECTION_PATTERNS.certifications.test(lower);
  const hasAchievements = SECTION_PATTERNS.achievements.test(lower);
  const sectionCount = [hasEducation, hasExperience, hasSkillsSection, hasProjects, hasSummary, hasCertifications, hasAchievements].filter(Boolean).length;

  /* ---------- dates & gap ---------- */
  const currentYear = new Date().getFullYear();
  const years = (raw.match(/(19|20)\d{2}/g) || []).map(Number).filter(y => y >= 1980 && y <= currentYear + 1);
  const lastActiveYear = years.length ? Math.max(...years) : null;
  const yearsSinceActive = lastActiveYear ? Math.max(0, currentYear - lastActiveYear) : null;

  /* ---------- quantification & verbs ---------- */
  const quantifiedAchievements = (raw.match(/(?:[₹$€£])?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|x|k\b|lakh|crore|million|monthly|\/\w+)|\b\d[\d,]{2,}\+?\b/gi) || []).length;
  const actionVerbsFound = ACTION_VERBS.filter(v => new RegExp(`(?<![a-z])${escapeRegExp(v)}(?![a-z])`, 'i').test(raw));
  const bulletCount = lines.filter(l => /^[-•●▪◦*✓]|^\d+[).]/.test(l)).length;

  /* ---------- skill detection (on cleaned text) ---------- */
  const detectedSkills = TECH_SKILLS.filter(s => s.kw.test(clean)).map(s => ({ name: s.name, category: s.category }));
  const required = role.skills;
  const skillHit = (skill: string) => {
    const entry = TECH_SKILLS.find(s => s.name.toLowerCase() === skill.toLowerCase());
    if (entry) return entry.kw.test(clean);
    return new RegExp(`(?<![a-z])${escapeRegExp(skill.toLowerCase())}(?![a-z])`, 'i').test(clean);
  };
  const matchedSkills = required.filter(skillHit);
  const missingSkills = required.filter(s => !matchedSkills.includes(s));
  const matchScore = Math.round((matchedSkills.length / required.length) * 100);

  /* ---------- ATS scoring: 8 sections, 100 points ---------- */
  const sections: ATSSection[] = [];
  const sec = (key: string, label: string, score: number, max: number, detail: string, tip: string) => {
    const s = clamp(Math.round(score), 0, max);
    const ratio = s / max;
    sections.push({ key, label, score: s, max, status: ratio >= 0.7 ? 'pass' : ratio >= 0.4 ? 'warn' : 'fail', detail, tip });
  };

  // 1. Contact & links (10)
  let contact = 0;
  if (hasEmail) contact += 3; if (hasPhone) contact += 3; if (linkedin) contact += 2; if (github || portfolio) contact += 2;
  sec('contact', 'Contact & Links', contact, 10,
    `${hasEmail ? 'Email ✓' : 'Email ✗'} · ${hasPhone ? 'Phone ✓' : 'Phone ✗'} · ${linkedin ? 'LinkedIn ✓' : 'LinkedIn ✗'} · ${github ? 'GitHub ✓' : portfolio ? 'Portfolio ✓' : 'GitHub/Portfolio ✗'}`,
    linkedin ? 'Add a portfolio link and GitHub if not present.' : 'Add LinkedIn URL and GitHub/portfolio — recruiters check both before calling.');

  // 2. Summary / objective (10)
  let summaryScore = 0;
  if (hasSummary) { summaryScore += 6; if (/(goal|target|aspir|seeking|restart|transition|looking)/i.test(raw)) summaryScore += 4; }
  else summaryScore = 2;
  sec('summary', 'Professional Summary', summaryScore, 10,
    hasSummary ? 'Summary section detected with career direction.' : 'No clear summary/objective found near the top.',
    'Add a 2–3 line summary: who you are, your gap handled honestly, and the role you\'re targeting.');

  // 3. Section structure (15)
  let struct = 0;
  if (hasEducation) struct += 4;
  if (hasExperience) struct += 4;
  if (hasSkillsSection) struct += 3;
  if (hasProjects) struct += 2;
  if (hasCertifications) struct += 1;
  if (hasAchievements) struct += 1;
  sec('structure', 'Section Structure', struct, 15,
    `${sectionCount}/7 standard sections found (${[hasEducation && 'Education', hasExperience && 'Experience', hasSkillsSection && 'Skills', hasProjects && 'Projects', hasSummary && 'Summary', hasCertifications && 'Certifications', hasAchievements && 'Achievements'].filter(Boolean).join(', ') || 'none'})`,
    'Use standard ATS headings: Summary, Skills, Experience, Projects, Education — creative headings confuse parsers.');

  // 4. Skills & keywords (25)
  const skillRatio = matchedSkills.length / required.length;
  let skillPts = skillRatio * 17;
  skillPts += Math.min(8, detectedSkills.length * 0.9);
  sec('keywords', 'Keywords & Skills', skillPts, 25,
    `${matchedSkills.length}/${required.length} role keywords found · ${detectedSkills.length} total technologies detected`,
    missingSkills.length ? `Weave these missing keywords in naturally where true: ${missingSkills.slice(0, 5).join(', ')}.` : 'Keyword coverage is strong — keep it.');

  // 5. Impact & quantification (15)
  let impact = 0;
  if (quantifiedAchievements >= 5) impact = 15; else if (quantifiedAchievements >= 3) impact = 11; else if (quantifiedAchievements >= 1) impact = 7; else impact = 3;
  sec('impact', 'Impact & Numbers', impact, 15,
    `${quantifiedAchievements} quantified ${quantifiedAchievements === 1 ? 'achievement' : 'achievements'} found (%, ₹, counts, growth)`,
    'Add numbers everywhere: “grew X to Y”, “handled 300+ daily”, “reduced time by 40%” — metrics double callback rates.');

  // 6. Action verbs (10)
  let verbPts = 4;
  if (actionVerbsFound.length >= 8) verbPts = 10; else if (actionVerbsFound.length >= 5) verbPts = 8; else if (actionVerbsFound.length >= 2) verbPts = 6;
  sec('verbs', 'Action Verbs', verbPts, 10,
    `${actionVerbsFound.length} strong action verbs (${actionVerbsFound.slice(0, 5).join(', ')}${actionVerbsFound.length > 5 ? '…' : ''})`,
    'Start every bullet with a power verb (Built, Led, Automated, Grew). Avoid “responsible for”.');

  // 7. Readability & formatting (10)
  let format = 0;
  if (wordCount >= 250 && wordCount <= 950) format += 4; else if (wordCount >= 150) format += 2;
  if (bulletCount >= 4) format += 3; else if (bulletCount >= 2) format += 1.5;
  if (readingMinutes <= 3) format += 3; else if (readingMinutes <= 4) format += 1;
  sec('format', 'Readability & Format', format, 10,
    `~${wordCount} words · ${readingMinutes}-min read · ${bulletCount} bullet points`,
    wordCount > 950 ? 'Trim to under 950 words — one page is king for gaps under 5 years.' : 'Keep bullets tight, one line each, and avoid long paragraphs.');

  // 8. Measurable projects & portfolio (5)
  let proj = 1;
  if (hasProjects) proj += 2;
  if (github || portfolio || urlCount >= 2) proj += 2;
  sec('projects', 'Projects & Proof', proj, 5,
    `${hasProjects ? 'Projects section ✓' : 'No projects section ✗'} · ${github ? 'GitHub linked ✓' : portfolio ? 'Portfolio linked ✓' : urlCount >= 2 ? `${urlCount} links ✓` : 'No public proof links ✗'}`,
    'After this sprint, add 2–3 shipped projects with live links — proof beats promises.');

  const atsTotal = Math.round(sections.reduce((a, s) => a + s.score, 0));
  const atsGrade = atsTotal >= 85 ? 'A' : atsTotal >= 75 ? 'B+' : atsTotal >= 65 ? 'B' : atsTotal >= 55 ? 'C' : atsTotal >= 40 ? 'D' : 'F';

  /* ---------- readiness ---------- */
  const gapYears = parseFloat((gap.match(/[\d.]+/) || ['2'])[0]);
  const gapAdj = clamp(gapYears * 4, 2, 16);
  let readiness = 16 + matchScore * 0.42 + atsTotal * 0.32 - gapAdj;
  if (hasProjects) readiness += 4;
  if (quantifiedAchievements >= 3) readiness += 3;
  readiness = clamp(Math.round(readiness), 12, 92);
  const projectedReadiness = clamp(readiness + 24 + Math.round((100 - readiness) * 0.35), readiness + 10, 96);

  /* ---------- keyword gaps vs role ---------- */
  const keywordsFound = matchedSkills;
  const keywordsMissing = missingSkills;

  /* ---------- technology recommendations ---------- */
  const priority = (s: string): TechRecs['missing'][number]['demand'] =>
    ['JavaScript', 'Python', 'React', 'SQL', 'Excel', 'Figma', 'SEO'].includes(s) ? 'High' :
    ['TypeScript', 'Node.js', 'PostgreSQL', 'Tableau', 'Pandas', 'Meta Ads'].includes(s) ? 'Growing' : 'Essential';
  const missingRecs = missingSkills.slice(0, 6).map(s => ({
    name: s,
    why: `Required for ${role.label} roles — recruiters filter on it. ${s === 'Git' ? 'Also your daily workflow once hired.' : ''}`.trim(),
    demand: priority(s),
  }));
  const detectedNames = new Set(detectedSkills.map(d => d.name.toLowerCase()));
  const complementary = COMPLEMENTARY[roleId].filter(c => !detectedNames.has(c.name.split(' ')[0].toLowerCase())).slice(0, 4);
  const future = FUTURE_STACK[roleId];
  const tech: TechRecs = { missing: missingRecs, complementary, future };

  /* ---------- 30-day plan ---------- */
  const templates = PLAN_TEMPLATES[roleId];
  const plan: PlanDay[] = templates.map((t, i) => {
    const week = Math.ceil((i + 1) / 7);
    const course = COURSES[t.skill];
    return {
      day: i + 1,
      week,
      skill: t.skill,
      title: `Day ${i + 1} — ${t.title}`,
      tasks: [...t.tasks],
      type: t.type,
      duration: course ? course.dur : '45 min',
    };
  });

  /* ---------- summaries ---------- */
  const gapPhrase = gapYears >= 3 ? `a ${gap} career break` : `a ${gap} break`;
  const summary = `${candidateName === 'Your Resume' ? 'Your profile' : candidateName.split(' ')[0] + '’s profile'} shows ${gapPhrase}${lastActiveYear ? ` since ${lastActiveYear}` : ''} targeting ${role.label}. ${matchedSkills.length} of ${required.length} core ${role.label} keywords detected in the resume; ${missingSkills.length ? `${missingSkills.slice(0, 3).join(', ')} ${missingSkills.length > 3 ? 'and ' + (missingSkills.length - 3) + ' more' : ''} need building` : 'keyword coverage is excellent'}. ATS currently scores ${atsTotal}/100 (grade ${atsGrade}) with readiness at ${readiness}% — projected to reach ~${projectedReadiness}% after this 30-day sprint.`;

  /* ---------- AI coach summary (deterministic, GPT-style) ---------- */
  const firstName = candidateName === 'Your Resume' ? 'there' : candidateName.split(' ')[0];
  const topMissing = missingSkills.slice(0, 3).join(', ') || 'advanced depth';
  const strength = matchedSkills.length ? matchedSkills.slice(0, 3).join(', ') : 'a willing foundation to build on';
  const impactLine = quantifiedAchievements >= 3 ? `You already speak in numbers (${quantifiedAchievements} quantified wins) — most returning candidates don’t. That’s your unfair advantage.` : `Your resume reads as duties, not impact — we’ll fix that with quantified bullets in Week 4.`;
  const aiSummary = `Hey ${firstName} — real talk: your ${gap} gap feels bigger than it is. Recruiters don't reject gaps; they reject silence after gaps. Right now your resume says “${strength}” but is quiet on ${topMissing}, and ATS bots are filtering you before a human ever looks. Good news: the gap recruiters forgive is a skills gap you haven't addressed yet — not the calendar gap. ${impactLine} This 30-day sprint front-loads ${topMissing} into Weeks 1–2, gets you building proof in Week 3, and makes you interview-proof in Week 4. Do the daily tasks, ship the projects, and your next resume won't ask for a second chance — it'll just show receipts. Let's go.`;

  return {
    roleId,
    roleLabel: role.label,
    gap,
    dailyTime,
    learningStyle,
    candidateName,
    lastActiveYear,
    wordCount,
    readingMinutes,
    matchScore,
    matchedSkills,
    missingSkills,
    detectedSkills,
    atsTotal,
    atsGrade,
    sections,
    readiness,
    projectedReadiness,
    keywordsFound,
    keywordsMissing,
    quantifiedAchievements,
    actionVerbsFound,
    hasEmail,
    hasPhone,
    hasLinkedin: linkedin,
    hasGithub: github,
    hasSummary,
    tech,
    plan,
    summary,
    aiSummary,
  };
}

/* ---------- helpers exported for UI ---------- */
export function courseUrl(skill: string): string {
  return COURSES[skill]?.url ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course')}`;
}

export function buildReportText(r: AnalysisResult): string {
  const line = '='.repeat(64);
  const sections = r.sections.map(s => `  ${s.label.padEnd(24)} ${String(s.score).padStart(2)}/${s.max}`).join('\n');
  return [
    line,
    'CT Core-30 Days Courses Suggestion (Gap Recovery) — Resume Analysis Report',
    line,
    `Candidate     ${r.candidateName}`,
    `Target role   ${r.roleLabel}`,
    `Gap           ${r.gap}${r.lastActiveYear ? ` (last active ${r.lastActiveYear})` : ''}`,
    `Generated     ${new Date().toLocaleString()}`,
    '',
    `ATS SCORE     ${r.atsTotal}/100   (Grade ${r.atsGrade})`,
    `Skill match   ${r.matchScore}%    (${r.matchedSkills.length}/${r.matchedSkills.length + r.missingSkills.length} keywords)`,
    `Readiness     ${r.readiness}%  →  projected ~${r.projectedReadiness}% after 30 days`,
    '',
    'ATS BREAKDOWN',
    sections,
    '',
    'KEYWORDS FOUND       ' + (r.keywordsFound.join(', ') || '—'),
    'KEYWORDS MISSING     ' + (r.keywordsMissing.join(', ') || '—'),
    '',
    'COURSES TO DO (free, YouTube)',
    ...r.plan.filter((d, i, a) => a.findIndex(x => x.skill === d.skill) === i).slice(0, 12).map(d => `  Day ${String(d.day).padStart(2)}  ${d.skill.padEnd(18)} ${courseUrl(d.skill)}`),
    '',
    '30-DAY PLAN',
    ...r.plan.map(d => `  Day ${String(d.day).padStart(2)}  [${d.type}] ${d.title.replace(/^Day \d+ — /, '')}\n         ${d.tasks.join('  |  ')}`),
    '',
    line,
    'CT Core-30 · helping talent restart',
    line,
  ].join('\n');
}
