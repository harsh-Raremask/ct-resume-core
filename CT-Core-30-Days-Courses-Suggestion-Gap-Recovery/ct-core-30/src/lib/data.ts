import type { CourseDef, RoleDef, RoleId, DayType } from './types';

/* ---------------- COURSE LIBRARY (free, hand-picked) ---------------- */
// Known-good video ids come from the original GapRecover spec; the rest route to
// precise YouTube searches so links never rot.
const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const COURSES: Record<string, CourseDef> = {
  HTML: { title: 'HTML Crash Course For Absolute Beginners', channel: 'Traversy Media', id: 'UB1O30fR-EE', dur: '1:00:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' },
  CSS: { title: 'CSS Full Course — Master CSS in 4 Hours', channel: 'Dave Gray', id: 'OXGznpKZ_sA', dur: '4:16:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=OXGznpKZ_sA' },
  JavaScript: { title: 'JavaScript Full Course (12 Hours) — Bro Code', channel: 'Bro Code', id: '8dWL3wF_OMw', dur: '12:00:00', lvl: 'Core', url: 'https://www.youtube.com/watch?v=8dWL3wF_OMw' },
  TypeScript: { title: 'TypeScript Full Course for Beginners', channel: 'Net Ninja', dur: '5:00:00', lvl: 'Core', url: yt('TypeScript full course for beginners Net Ninja') },
  React: { title: 'React Tutorial for Beginners — Mosh', channel: 'Programming with Mosh', dur: '1:12:00', lvl: 'Intermediate', url: yt('Programming with Mosh React Tutorial for Beginners') },
  'Next.js': { title: 'Next.js Full Course — Build & Deploy', channel: 'Academind', dur: '6:30:00', lvl: 'Intermediate', url: yt('Next.js full course Academind build deploy') },
  'Tailwind CSS': { title: 'Tailwind CSS Full Course for Beginners', channel: 'Dave Gray', id: 'lCxcTsOHrjo', dur: '3:00:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=lCxcTsOHrjo' },
  'Responsive Design': { title: 'Responsive Web Design Tutorial', channel: 'freeCodeCamp', id: 'srvUrASNj0s', dur: '1:45:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=srvUrASNj0s' },
  Git: { title: 'Git and GitHub for Beginners — Crash Course', channel: 'freeCodeCamp', id: 'RGOj5yH7evk', dur: '1:08:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
  'Node.js': { title: 'Node.js Full Course', channel: 'freeCodeCamp', id: 'Oe421EPjeBE', dur: '8:00:00', lvl: 'Intermediate', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
  'Express.js': { title: 'Express.js Crash Course', channel: 'Traversy Media', dur: '1:30:00', lvl: 'Core', url: yt('Express.js crash course Traversy Media') },
  'REST APIs': { title: 'REST API Crash Course', channel: 'Traversy Media', id: 'Q-BpqyOT3a8', dur: '1:02:00', lvl: 'Intermediate', url: 'https://www.youtube.com/watch?v=Q-BpqyOT3a8' },
  SQL: { title: 'SQL Tutorial — Full Database Course', channel: 'freeCodeCamp', id: '5OdVJbNCSso', dur: '4:20:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=5OdVJbNCSso' },
  PostgreSQL: { title: 'PostgreSQL Full Course for Beginners', channel: 'freeCodeCamp', dur: '4:00:00', lvl: 'Core', url: yt('PostgreSQL full course for beginners freeCodeCamp') },
  MongoDB: { title: 'MongoDB Full Course', channel: 'freeCodeCamp', dur: '3:30:00', lvl: 'Core', url: yt('MongoDB full course freeCodeCamp') },
  Docker: { title: 'Docker Full Course — Zero to Expert', channel: 'TechWorld with Nana', dur: '3:00:00', lvl: 'Intermediate', url: yt('Docker full course TechWorld with Nana') },
  Excel: { title: 'Excel Tutorial for Beginners — 3 Hours', channel: 'Kevin Stratvert', id: 'VBlSeCfydLg', dur: '2:35:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=VBlSeCfydLg' },
  Python: { title: 'Python for Beginners — Full Course', channel: 'freeCodeCamp', id: '_uQrJ0TkZlc', dur: '4:26:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
  Pandas: { title: 'Pandas Crash Course — Data Analysis with Python', channel: 'Keith Galli', dur: '1:40:00', lvl: 'Core', url: yt('Pandas crash course Keith Galli 1 hour') },
  Tableau: { title: 'Tableau Full Course', channel: 'Simplilearn', id: 'TPMlZxRRaCo', dur: '8:00:00', lvl: 'Intermediate', url: 'https://www.youtube.com/watch?v=TPMlZxRRaCo' },
  'Power BI': { title: 'Power BI Full Course for Beginners', channel: 'Simplilearn', dur: '7:00:00', lvl: 'Intermediate', url: yt('Power BI full course for beginners Simplilearn') },
  Statistics: { title: 'Statistics for Data Science — Crash Course', channel: 'freeCodeCamp', dur: '2:00:00', lvl: 'Beginner', url: yt('Statistics for Data Science crash course freeCodeCamp') },
  Figma: { title: 'Figma Course for Beginners (2 Hours)', channel: 'freeCodeCamp', id: 'jwCmIBJ8Jtc', dur: '2:07:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc' },
  Wireframing: { title: 'Wireframing — UX Design Tutorial', channel: 'The Futur', dur: '1:15:00', lvl: 'Beginner', url: yt('wireframing UX design tutorial The Futur') },
  Prototyping: { title: 'Figma Prototyping Tutorial — Interactive Design', channel: 'Mizko', dur: '1:30:00', lvl: 'Core', url: yt('Figma prototyping tutorial Mizko') },
  'Design Systems': { title: 'Design Systems — Full Course', channel: 'Femke', dur: '2:00:00', lvl: 'Intermediate', url: yt('design systems full course Femke UX') },
  'User Research': { title: 'UX Research Methods — Complete Guide', channel: 'NNgroup', dur: '1:30:00', lvl: 'Core', url: yt('UX research methods complete guide') },
  SEO: { title: 'SEO Full Course — Beginner to Advanced', channel: 'Simplilearn', id: 'xsVTqzratPs', dur: '3:20:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=xsVTqzratPs' },
  'Google Analytics': { title: 'Google Analytics 4 Tutorial', channel: 'Measureschool', id: '_yES-DaTGXg', dur: '1:30:00', lvl: 'Beginner', url: 'https://www.youtube.com/watch?v=_yES-DaTGXg' },
  'Content Marketing': { title: 'Content Marketing Full Course', channel: 'Ahrefs', dur: '2:00:00', lvl: 'Beginner', url: yt('content marketing full course Ahrefs') },
  'Social Media Marketing': { title: 'Social Media Marketing Course', channel: 'HubSpot Academy', dur: '2:30:00', lvl: 'Beginner', url: yt('social media marketing course HubSpot') },
  'Email Marketing': { title: 'Email Marketing Full Course', channel: 'Simplilearn', dur: '2:00:00', lvl: 'Beginner', url: yt('email marketing full course Simplilearn') },
  'Meta Ads': { title: 'Meta Ads (Facebook & Instagram) — Full Course', channel: 'WsCube Tech', dur: '3:00:00', lvl: 'Core', url: yt('Meta Ads Facebook Instagram full course WsCube') },
};

/* ---------------- ROLE DEFINITIONS ---------------- */
export const ROLES: RoleDef[] = [
  { id: 'frontend', label: 'Frontend Developer', short: 'Frontend', tagline: 'HTML · CSS · JavaScript · React', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'Tailwind CSS', 'TypeScript'], futureStack: ['Next.js', 'Vite', 'AI Code Assistants (Copilot/Cursor)', 'Testing (Jest + RTL)'], accent: '#0ea5e9' },
  { id: 'backend', label: 'Backend Developer', short: 'Backend', tagline: 'Node.js · APIs · Databases · Cloud', skills: ['JavaScript', 'Node.js', 'Express.js', 'SQL', 'REST APIs', 'Git', 'PostgreSQL', 'Docker'], futureStack: ['TypeScript', 'Redis', 'GraphQL', 'AWS/GCP Fundamentals'], accent: '#38bdf8' },
  { id: 'data', label: 'Data Analyst', short: 'Data', tagline: 'Excel · SQL · Python · Tableau', skills: ['Excel', 'SQL', 'Python', 'Pandas', 'Tableau', 'Statistics', 'Power BI'], futureStack: ['dbt', 'LLM-assisted Analytics', 'BigQuery/Snowflake', 'Storytelling with Tableau Prep'], accent: '#38bdf8' },
  { id: 'uiux', label: 'UI/UX Designer', short: 'UI/UX', tagline: 'Figma · UX Research · Prototyping', skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'CSS'], futureStack: ['AI Design Tools (Galileo/v0)', 'Motion Design (Framer)', 'Design Tokens', 'Web Accessibility (WCAG)'], accent: '#6366f1' },
  { id: 'marketing', label: 'Digital Marketing', short: 'Marketing', tagline: 'SEO · Analytics · Ads · Content', skills: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Media Marketing', 'Email Marketing', 'Meta Ads'], futureStack: ['AI Content Workflows', 'Marketing Automation (HubSpot)', 'First-party Data & GA4', 'Short-form Video (Reels/Shorts)'], accent: '#3b82f6' },
];

/* ---------------- TECH SKILL DICTIONARY (detection) ---------------- */
export const TECH_SKILLS: { name: string; category: string; kw: RegExp }[] = [
  // Languages
  { name: 'JavaScript', category: 'Languages', kw: /(?<![a-z])(javascript|js)(?![a-z])/i },
  { name: 'TypeScript', category: 'Languages', kw: /(?<![a-z])typescript(?![a-z])|(?<![a-z])ts(?![a-z])/i },
  { name: 'Python', category: 'Languages', kw: /(?<![a-z])python(?![a-z])/i },
  { name: 'Java', category: 'Languages', kw: /(?<![a-z])java(?!script)(?![a-z])/i },
  { name: 'C++', category: 'Languages', kw: /c\+\+/i },
  { name: 'C#', category: 'Languages', kw: /c#/i },
  { name: 'Go', category: 'Languages', kw: /(?<![a-z])golang(?![a-z])|(?<![a-z])go(lang)?\s?(language|lang|programming|programming\s?language|developer|engineer)|(?<![a-z])go\s?programming/i },
  { name: 'SQL', category: 'Languages', kw: /(?<![a-z])sql(?![a-z])/i },
  { name: 'HTML', category: 'Languages', kw: /(?<![a-z])html5?(?![a-z])/i },
  { name: 'CSS', category: 'Languages', kw: /(?<![a-z])css3?(?![a-z])/i },
  // Frontend
  { name: 'React', category: 'Frontend', kw: /(?<![a-z])react(\.js|js)?(?![a-z])/i },
  { name: 'Next.js', category: 'Frontend', kw: /next\.?\s?js/i },
  { name: 'Vue', category: 'Frontend', kw: /(?<![a-z])vue(\.?js)?(?![a-z])/i },
  { name: 'Angular', category: 'Frontend', kw: /(?<![a-z])angular(?![a-z])/i },
  { name: 'Tailwind CSS', category: 'Frontend', kw: /tailwind/i },
  { name: 'Bootstrap', category: 'Frontend', kw: /(?<![a-z])bootstrap(?![a-z])/i },
  { name: 'Sass', category: 'Frontend', kw: /(?<![a-z])(sass|scss)(?![a-z])/i },
  { name: 'Responsive Design', category: 'Frontend', kw: /responsiv|media quer(y|ies)|mobile.first/i },
  // Backend
  { name: 'Node.js', category: 'Backend', kw: /node(\.js|js)?(?![a-z])/i },
  { name: 'Express.js', category: 'Backend', kw: /express(\.js|js)?(?![a-z])/i },
  { name: 'REST APIs', category: 'Backend', kw: /rest\s?(ful)?\s?(api|apis|web\s?services?)|rest api/i },
  { name: 'GraphQL', category: 'Backend', kw: /graphql/i },
  { name: 'Django', category: 'Backend', kw: /(?<![a-z])django(?![a-z])/i },
  { name: 'Spring', category: 'Backend', kw: /(?<![a-z])spring(boot)?(?![a-z])/i },
  { name: 'PHP', category: 'Backend', kw: /(?<![a-z])php(?![a-z])/i },
  // Databases
  { name: 'PostgreSQL', category: 'Databases', kw: /postgres(ql)?/i },
  { name: 'MySQL', category: 'Databases', kw: /mysql/i },
  { name: 'MongoDB', category: 'Databases', kw: /mongo(db)?/i },
  { name: 'Redis', category: 'Databases', kw: /(?<![a-z])redis(?![a-z])/i },
  { name: 'Firebase', category: 'Databases', kw: /firebase/i },
  { name: 'Tally', category: 'Tools', kw: /(?<![a-z])tally(?![a-z])/i },
  // Data & Analytics
  { name: 'Excel', category: 'Data & Analytics', kw: /(?<![a-z])excel(?![a-z])|spreadsheets?(?![a-z])|ms\s?office/i },
  { name: 'Pandas', category: 'Data & Analytics', kw: /pandas/i },
  { name: 'NumPy', category: 'Data & Analytics', kw: /numpy/i },
  { name: 'Tableau', category: 'Data & Analytics', kw: /tableau/i },
  { name: 'Power BI', category: 'Data & Analytics', kw: /power\s?bi/i },
  { name: 'Statistics', category: 'Data & Analytics', kw: /statistic/i },
  { name: 'Machine Learning', category: 'Data & Analytics', kw: /machine\s?learning|deep\s?learning|(?<![a-z])ml(?![a-z])/i },
  { name: 'Google Analytics', category: 'Data & Analytics', kw: /google\s?analytics|\bga4\b/i },
  // Cloud & DevOps
  { name: 'Docker', category: 'Cloud & DevOps', kw: /docker/i },
  { name: 'Kubernetes', category: 'Cloud & DevOps', kw: /kubernetes|k8s/i },
  { name: 'AWS', category: 'Cloud & DevOps', kw: /(?<![a-z])aws(?![a-z])|amazon\s?web\s?services/i },
  { name: 'Azure', category: 'Cloud & DevOps', kw: /(?<![a-z])azure(?![a-z])/i },
  { name: 'CI/CD', category: 'Cloud & DevOps', kw: /ci\s?\/\s?cd|continuous\s?(integration|deployment)|jenkins|github\s?actions/i },
  { name: 'Linux', category: 'Cloud & DevOps', kw: /(?<![a-z])linux|ubuntu|unix(?![a-z])/i },
  // Design
  { name: 'Figma', category: 'Design', kw: /figma/i },
  { name: 'Adobe XD', category: 'Design', kw: /adobe\s?xd|\bxd\b/i },
  { name: 'Photoshop', category: 'Design', kw: /photoshop/i },
  { name: 'Illustrator', category: 'Design', kw: /illustrator/i },
  { name: 'Canva', category: 'Design', kw: /(?<![a-z])canva(?![a-z])/i },
  { name: 'User Research', category: 'Design', kw: /user\s?research|usability\s?test|ux\s?research|interviews?\s+with\s+(users|customers|stakeholders)/i },
  { name: 'Wireframing', category: 'Design', kw: /wireframe/i },
  { name: 'Prototyping', category: 'Design', kw: /prototype|prototyping/i },
  { name: 'Design Systems', category: 'Design', kw: /design\s?system|component\s?library|style\s?guide/i },
  // Marketing
  { name: 'SEO', category: 'Marketing', kw: /(?<![a-z])seo(?![a-z])|search\s?engine\s?optimization/i },
  { name: 'Content Marketing', category: 'Marketing', kw: /content\s?(marketing|strategy|writing)|blogging/i },
  { name: 'Social Media Marketing', category: 'Marketing', kw: /social\s?media|instagram|linkedin\s?marketing|twitter/i },
  { name: 'Email Marketing', category: 'Marketing', kw: /email\s?marketing|mailchimp|newsletter/i },
  { name: 'Meta Ads', category: 'Marketing', kw: /meta\s?ads|facebook\s?ads|instagram\s?ads|ppc/i },
  { name: 'Google Ads', category: 'Marketing', kw: /google\s?ads|adwords|sem(?![a-z])/i },
  // Tools
  { name: 'Git', category: 'Tools', kw: /(?<![a-z])git(hub)?(?![a-z])/i },
  { name: 'Jira', category: 'Tools', kw: /(?<![a-z])jira(?![a-z])/i },
  { name: 'Notion', category: 'Tools', kw: /(?<![a-z])notion(?![a-z])/i },
];

/* ---------------- ACTION VERBS & SECTION SIGNALS ---------------- */
export const ACTION_VERBS = [
  'achieved','accelerated','architected','automated','built','campaign','collaborated','communicated','completed','conducted','conceptualized','coordinated','created','decreased','delivered','deployed','designed','developed','devised','directed','drove','earned','enabled','engineered','enhanced','established','evaluated','executed','expanded','generated','grew','guided','handled','identified','implemented','improved','increased','initiated','integrated','launched','led','maintained','managed','mentored','migrated','negotiated','optimized','orchestrated','organized','owned','partnered','performed','pioneered','planned','presented','produced','reduced','resolved','revamped','scaled','shipped','simplified','spearheaded','streamlined','strengthened','supervised','trained','transformed','validated','won','wrote','analyzed','crafted','formulated','forecasted','budgeted','published','recorded','tracked','measured','researched','tested','launched','monetized','negotiated','closed','prospected','segmented','personalized','a/b tested','optimized'
];

export const SECTION_PATTERNS = {
  education: /education|academic|university|college|b\.?tech|b\.?sc|b\.?com|b\.?ba|m\.?tech|m\.?ba|graduation|bachelor|master/i,
  experience: /experience|internship|worked|employment|professional\s?(background|experience)|work\s?history/i,
  skills: /skills|technical\s?skills|core\s?competenc|technologies|stack/i,
  projects: /projects?(?!ional)|portfolio|built/i,
  summary: /summary|objective|profile|about\s?me|career\s?objective/i,
  certifications: /certif|course|training|licensed?/i,
  achievements: /achievement|award|honor|recognition|accomplishment/i,
};

/* ---------------- COMPLEMENTARY & FUTURE TECH ---------------- */
export const COMPLEMENTARY: Record<RoleId, { name: string; why: string }[]> = {
  frontend: [
    { name: 'Next.js', why: 'The default production React framework — SSR, routing and API routes in one.' },
    { name: 'Vite', why: 'Near-instant dev server / builds; replaces sluggish Webpack setups.' },
    { name: 'Testing (Jest + React Testing Library)', why: 'Employers expect tests for components you ship.' },
    { name: 'Figma (basics)', why: 'Translate designs to code without waiting on a designer.' },
  ],
  backend: [
    { name: 'TypeScript', why: 'Type-safe backends catch entire error classes at compile time.' },
    { name: 'Redis', why: 'Caching and queues — the difference between slow and scalable APIs.' },
    { name: 'AWS or GCP fundamentals', why: 'Deploying your own service is table stakes for backend roles.' },
    { name: 'GitHub Actions (CI/CD)', why: 'Automate tests and deploys on every push — shows engineering maturity.' },
  ],
  data: [
    { name: 'Power BI', why: 'The most requested dashboarding tool after Tableau — doubles your market.' },
    { name: 'dbt', why: 'Transform-in-warehouse SQL — the analytics engineering standard.' },
    { name: 'BigQuery / Snowflake', why: 'Cloud warehouses are where real company data lives.' },
    { name: 'Storytelling with Data', why: 'Analysis nobody understands changes nothing — narrative is the multiplier.' },
  ],
  uiux: [
    { name: 'Design Tokens', why: 'Bridging Figma and code — what mature design systems run on.' },
    { name: 'Framer / Motion', why: 'Ship your own animated prototypes — motion is now expected in portfolios.' },
    { name: 'Web Accessibility (WCAG)', why: 'Accessibility audits are a paid, differentiating skill.' },
    { name: 'HTML & CSS literacy', why: 'Talk to engineers in their language — handoff quality doubles.' },
  ],
  marketing: [
    { name: 'Marketing Automation (HubSpot)', why: 'Automation is how lean teams punch above their weight.' },
    { name: 'First-party Data & GA4', why: 'Cookieless tracking expertise is suddenly rare and paid well.' },
    { name: 'Short-form Video (Reels/Shorts)', why: 'Organic reach in 2026 is won on short video — learn hooks & pacing.' },
    { name: 'Basic SQL', why: 'Pull your own campaign data — analysts charge for what you’ll self-serve.' },
  ],
};

export const FUTURE_STACK: Record<RoleId, { name: string; why: string; demand: string }[]> = {
  frontend: [
    { name: 'AI Code Assistants (Copilot / Cursor)', why: 'Seniors direct, juniors type — fluency with AI pair-programmers is a 2026 hiring filter.', demand: 'Very high' },
    { name: 'React Server Components', why: 'The architecture Next.js App Router is built on — fewer client bundles, faster apps.', demand: 'Very high' },
    { name: 'Edge Deployment (Vercel/Cloudflare)', why: 'APIs at the edge are becoming default infra for frontend-heavy teams.', demand: 'Growing' },
  ],
  backend: [
    { name: 'AI API Integration (OpenAI/Gemini)', why: 'Every backend is becoming an AI backend — streaming, tool-use and RAG patterns.', demand: 'Very high' },
    { name: 'PostgreSQL + pgvector', why: 'One database for relational + vector search — the lean AI-app standard.', demand: 'Very high' },
    { name: 'Observability (OpenTelemetry)', why: 'You can’t fix what you can’t see — traces/metrics are senior-engineer vocabulary.', demand: 'Growing' },
  ],
  data: [
    { name: 'LLM-assisted Analytics', why: 'Text-to-SQL and AI-generated insights — analysts who verify beat analysts who type.', demand: 'Very high' },
    { name: 'dbt + Semantic Layers', why: 'The modern analytics stack — version-controlled, tested metrics.', demand: 'High' },
    { name: 'Python + Vector/Embedding Basics', why: 'Understanding embeddings is the new “knows SQL” for 2026 data roles.', demand: 'Growing' },
  ],
  uiux: [
    { name: 'AI Design Generation (Galileo / v0)', why: 'Generate UI drafts in minutes, then art-direct — 3× iteration speed.', demand: 'Very high' },
    { name: 'Design-to-Code (AI handoff)', why: 'Figma → production UI translation is being automated — curate, don’t just craft.', demand: 'High' },
    { name: 'Voice & Conversational UX', why: 'AI assistants created a whole interaction paradigm to design for.', demand: 'Growing' },
  ],
  marketing: [
    { name: 'AI Content Workflows', why: 'Brief → draft → edit → schedule with AI in the loop is the new content ops.', demand: 'Very high' },
    { name: 'Generative Engine Optimization (GEO)', why: 'Being cited by ChatGPT/Gemini/Perplexity is the SEO of 2026.', demand: 'Very high' },
    { name: 'Marketing Mix Modeling (lite)', why: 'Incrementality thinking separates senior marketers from executors.', demand: 'High' },
  ],
};

/* ---------------- 30-DAY CURRICULA ---------------- */
interface TDay { skill: string; title: string; tasks: [string, string, string]; type: DayType }

export const PLAN_TEMPLATES: Record<RoleId, TDay[]> = {
  frontend: [
    { skill: 'HTML', title: 'HTML5 Semantic Refresh', tasks: ['Rebuild your resume as semantic HTML', 'Practice forms, tables & accessibility', 'Push to GitHub'], type: 'Learn' },
    { skill: 'CSS', title: 'CSS Fundamentals & Box Model', tasks: ['Recreate a Dribbble card with Flexbox', 'Master specificity & the cascade', 'Make 3 layouts fully responsive'], type: 'Learn' },
    { skill: 'Responsive Design', title: 'Flexbox, Grid & Media Queries', tasks: ['Build a responsive landing page', 'Mobile-first conversion exercise', 'Test on a real phone'], type: 'Practice' },
    { skill: 'Git', title: 'Git & GitHub Workflow', tasks: ['Init repo, branches & PR flow', 'Push your work every single day', 'Write clean commit messages'], type: 'Learn' },
    { skill: 'CSS', title: 'Mini Project: Portfolio Landing', tasks: ['Build your personal landing page', 'Deploy on Vercel/Netlify', 'Add the live link to your resume'], type: 'Project' },
    { skill: 'Tailwind CSS', title: 'Tailwind CSS Speedrun', tasks: ['Convert your landing to Tailwind', 'Build 5 components in utility-first style', 'Internalize spacing scale'], type: 'Learn' },
    { skill: 'HTML', title: 'Week 1 Review & Quiz', tasks: ['30-min revision + self-quiz', 'Fix 3 issues found in your project', 'Set week 2 goals'], type: 'Review' },
    { skill: 'JavaScript', title: 'JavaScript Basics & DOM', tasks: ['Variables, loops, functions', 'DOM manipulation kata', 'Build a counter app'], type: 'Learn' },
    { skill: 'JavaScript', title: 'ES6+, Arrays & Objects', tasks: ['map / filter / reduce drills', 'Destructuring & spread', 'Solve 10 JS30 exercises'], type: 'Practice' },
    { skill: 'JavaScript', title: 'Events & Forms', tasks: ['Build client-side form validation', 'localStorage todo logic', 'Handle empty/edge states'], type: 'Practice' },
    { skill: 'JavaScript', title: 'Async JS & Fetch API', tasks: ['Fetch a real API (JSONPlaceholder)', 'Loading & error states', 'Render a dynamic list'], type: 'Learn' },
    { skill: 'JavaScript', title: 'Project: Interactive Dashboard', tasks: ['Build a small JS dashboard', 'Add filters & live search', 'Polish UX micro-details'], type: 'Project' },
    { skill: 'Git', title: 'Code Review & Clean-up', tasks: ['Refactor week-2 code', 'Write a README with a demo GIF', 'Review your own diff like a senior'], type: 'Review' },
    { skill: 'React', title: 'React Fundamentals', tasks: ['Components, props & state', 'Build a Todo in React', 'Compare vanilla vs React mental models'], type: 'Learn' },
    { skill: 'React', title: 'Hooks Deep Dive', tasks: ['useState, useEffect, useRef', 'Write one custom hook', 'Handle side-effect cleanup'], type: 'Learn' },
    { skill: 'TypeScript', title: 'TypeScript Essentials', tasks: ['Types for props & state', 'Type an API response', 'Convert one JS file to TS'], type: 'Learn' },
    { skill: 'React', title: 'React Router & State', tasks: ['Multi-page routing for portfolio', 'Lift state up pattern', 'Deploy the React app'], type: 'Practice' },
    { skill: 'React', title: 'API Integration in React', tasks: ['Integrate a public API', 'Pagination & search', 'Error boundaries'], type: 'Practice' },
    { skill: 'Tailwind CSS', title: 'Project: E-commerce Product Page', tasks: ['Pixel-perfect product UI', 'Cart logic in React + TS', 'Fully responsive & accessible'], type: 'Project' },
    { skill: 'JavaScript', title: 'JS Interview Prep', tasks: ['Closures, hoisting, promises', 'Top 15 JS interview questions', 'Explain one concept out loud'], type: 'Review' },
    { skill: 'React', title: 'Week 3 Demo & Feedback', tasks: ['Record a 2-min demo video', 'Share for feedback', 'Ship one requested fix'], type: 'Review' },
    { skill: 'Git', title: 'Portfolio Build', tasks: ['Design portfolio map on paper first', 'Build with React + Tailwind', 'Add projects, about & contact'], type: 'Project' },
    { skill: 'HTML', title: 'Accessibility Sprint', tasks: ['ARIA labels & keyboard nav', 'SEO meta tags & OpenGraph', 'Contrast & alt-text audit'], type: 'Practice' },
    { skill: 'Responsive Design', title: 'Deployment & Domain', tasks: ['Custom domain + analytics', 'Cross-browser testing', 'Announce on LinkedIn'], type: 'Practice' },
    { skill: 'TypeScript', title: 'Data Structures in JS', tasks: ['Revise arrays, objects, sets & maps', 'Solve 5 easy array problems', 'Time-boxed practice'], type: 'Practice' },
    { skill: 'React', title: 'Mock Interviews', tasks: ['Top 20 React questions', 'Live coding practice', 'STAR stories for your gap'], type: 'Review' },
    { skill: 'CSS', title: 'Project: Rebuild a Real Site', tasks: ['Clone a section of a real site (e.g. Stripe)', 'Match spacing & typography', 'Document what you learned'], type: 'Project' },
    { skill: 'Git', title: 'Resume & LinkedIn Revamp', tasks: ['Rewrite resume with new projects', 'New headline: “Frontend Developer”', 'Write your comeback story post'], type: 'Review' },
    { skill: 'JavaScript', title: 'Application Sprint', tasks: ['Apply to 15 curated roles', 'Tailored cover letters (3 templates)', 'Track everything in a sheet'], type: 'Practice' },
    { skill: 'React', title: 'Final Showcase & Next 30 Days', tasks: ['Portfolio final review', 'Record your presentation', 'Plan your next 30-day sprint'], type: 'Project' },
  ],
  backend: [
    { skill: 'JavaScript', title: 'Modern JavaScript Refresh', tasks: ['ES6+, modules & async/await', 'Error handling patterns', 'Build a CLI utility'], type: 'Learn' },
    { skill: 'Git', title: 'Git Workflow for Teams', tasks: ['Branching strategy & PRs', 'Code review etiquette', 'Daily push habit'], type: 'Learn' },
    { skill: 'Node.js', title: 'Node.js Foundations', tasks: ['Runtime, NPM & package.json', 'fs, path & events modules', 'Build a file organizer script'], type: 'Learn' },
    { skill: 'Node.js', title: 'HTTP & the Request Lifecycle', tasks: ['Raw http module server', 'Routing by hand', 'Understand middleware concept'], type: 'Practice' },
    { skill: 'Express.js', title: 'Express.js Crash Course', tasks: ['Routes, controllers & config', 'Middleware & error handling', 'Build a JSON REST endpoint'], type: 'Learn' },
    { skill: 'REST APIs', title: 'REST Design Principles', tasks: ['Resource naming & verbs', 'Status codes that mean something', 'Design a bookstore API on paper'], type: 'Learn' },
    { skill: 'Node.js', title: 'Week 1 Review & Quiz', tasks: ['Revise Week 1 out loud', 'Refactor your code', 'Set Week 2 targets'], type: 'Review' },
    { skill: 'SQL', title: 'SQL Fundamentals', tasks: ['SELECT, WHERE, ORDER BY, LIMIT', 'Practice 20 queries', 'JOINs until boring'], type: 'Learn' },
    { skill: 'PostgreSQL', title: 'Postgres Essentials', tasks: ['Data types, constraints & keys', 'Design a users/orders schema', 'Indexes & EXPLAIN basics'], type: 'Learn' },
    { skill: 'Express.js', title: 'Connecting Express to Postgres', tasks: ['Pool connections with pg', 'CRUD for one resource', 'Parameterized queries (no SQL injection)'], type: 'Practice' },
    { skill: 'REST APIs', title: 'Validation & Error Handling', tasks: ['Validate request bodies (zod)', 'Consistent error response shape', '404 & 500 handlers'], type: 'Practice' },
    { skill: 'PostgreSQL', title: 'Project: Task API v1', tasks: ['CRUD API with Postgres persistence', 'Test with Postman', 'Document endpoints in README'], type: 'Project' },
    { skill: 'REST APIs', title: 'Authentication Basics', tasks: ['Password hashing with bcrypt', 'JWT issue & verify flow', 'Protect one route'], type: 'Learn' },
    { skill: 'Node.js', title: 'Auth Project: Notes API', tasks: ['Signup/login endpoints', 'Per-user data isolation', 'Add refresh-token flow (concept)'], type: 'Project' },
    { skill: 'SQL', title: 'Advanced SQL', tasks: ['CTEs & window functions', 'Aggregations & grouping', 'Solve 5 StrataScratch-style questions'], type: 'Practice' },
    { skill: 'Express.js', title: 'Pagination, Filtering & Sorting', tasks: ['Add query params to list endpoints', 'Offset vs cursor pagination', 'Rate limiting basics'], type: 'Practice' },
    { skill: 'Docker', title: 'Docker Fundamentals', tasks: ['Images vs containers', 'Dockerfile for your API', 'docker-compose with Postgres'], type: 'Learn' },
    { skill: 'Docker', title: 'Deploy to the Cloud', tasks: ['Deploy API + DB (Render/Railway/Fly)', 'Environment variables done right', 'Health check endpoint'], type: 'Project' },
    { skill: 'REST APIs', title: 'API Design Deep-Dive', tasks: ['Idempotency & versioning', 'Webhooks concept', 'Review a public API’s docs'], type: 'Review' },
    { skill: 'Git', title: 'Testing Your API', tasks: ['Jest + supertest on 3 endpoints', 'Happy path + 1 failure each', 'Add npm test to CI'], type: 'Practice' },
    { skill: 'Node.js', title: 'Week 3 Demo & Feedback', tasks: ['Record API walkthrough', 'Get feedback from a dev community', 'Fix the top issue'], type: 'Review' },
    { skill: 'JavaScript', title: 'Capstone: Full Backend Project', tasks: ['Pick: e-commerce / blog / booking API', 'Auth + CRUD + pagination + tests', 'Deployed & documented'], type: 'Project' },
    { skill: 'PostgreSQL', title: 'Schema Design Masterclass', tasks: ['Normalize your capstone schema', 'Add 2 meaningful indexes', 'EXPLAIN ANALYZE one slow query'], type: 'Practice' },
    { skill: 'Docker', title: 'Production Checklist', tasks: ['Env config, logging, CORS', 'Graceful shutdown', 'Basic security headers'], type: 'Practice' },
    { skill: 'REST APIs', title: 'System Design Basics', tasks: ['Load balancers, caching, queues (concepts)', 'Estimate scale of your API', 'Draw the architecture diagram'], type: 'Learn' },
    { skill: 'Express.js', title: 'Mock Backend Interviews', tasks: ['Top 20 Node/API questions', 'Live-code an endpoint', 'STAR stories for your gap'], type: 'Review' },
    { skill: 'Git', title: 'Resume & GitHub Revamp', tasks: ['Pin your 3 best repos + clean READMEs', 'Rewrite bullets with metrics', 'ATS keyword check vs target JD'], type: 'Review' },
    { skill: 'Node.js', title: 'Application Sprint', tasks: ['Apply to 15 backend roles', 'Customize per JD keywords', 'Track applications & responses'], type: 'Practice' },
    { skill: 'SQL', title: 'Final Showcase', tasks: ['Portfolio README as a product page', 'Record your capstone demo', 'Plan the next 30 days'], type: 'Project' },
  ],
  data: [
    { skill: 'Excel', title: 'Excel Power Refresh', tasks: ['XLOOKUP, pivots & data validation', 'Clean a messy dataset', 'Build a summary dashboard'], type: 'Learn' },
    { skill: 'Excel', title: 'Advanced Excel & Charts', tasks: ['IF/nested logic & TEXT functions', 'Interactive charts with slicers', 'Conditional formatting that informs'], type: 'Practice' },
    { skill: 'Statistics', title: 'Statistics for Analysis', tasks: ['Mean/median/mode & distributions', 'Standard deviation, outliers', 'Hypothesis testing intuition'], type: 'Learn' },
    { skill: 'SQL', title: 'SQL Basics', tasks: ['SELECT, WHERE, ORDER BY', 'Practice 20 queries on Mode/StrataScratch', 'Understand NULLs'], type: 'Learn' },
    { skill: 'SQL', title: 'Joins & Aggregations', tasks: ['INNER/LEFT/RIGHT JOINs', 'GROUP BY, HAVING', 'Subqueries basics'], type: 'Practice' },
    { skill: 'SQL', title: 'Project: E-commerce Analysis in SQL', tasks: ['Analyze a sales database', 'Write a 1-page insight report', 'Chart the findings'], type: 'Project' },
    { skill: 'Excel', title: 'Week 1 Review & Quiz', tasks: ['Revise + self-check quiz', 'Polish your Excel dashboard', 'Set Week 2 targets'], type: 'Review' },
    { skill: 'Python', title: 'Python Foundations', tasks: ['Syntax, lists, dicts & functions', 'Jupyter/notebook setup', 'Solve 10 exercises'], type: 'Learn' },
    { skill: 'Pandas', title: 'Pandas Crash Course', tasks: ['Load CSVs & inspect dataframes', 'Filter, group, merge', 'Your first EDA notebook'], type: 'Learn' },
    { skill: 'Pandas', title: 'Data Cleaning Project', tasks: ['Clean a messy Kaggle dataset', 'Handle nulls, types & duplicates', 'Document every step'], type: 'Project' },
    { skill: 'Python', title: 'Visualization with Matplotlib/Seaborn', tasks: ['10 chart types & when to use them', 'Visual storytelling basics', 'Polish your EDA notebook'], type: 'Practice' },
    { skill: 'Tableau', title: 'Tableau Basics', tasks: ['Connect data & build sheets', 'Calculated fields', 'Your first dashboard'], type: 'Learn' },
    { skill: 'Tableau', title: 'Project: Sales Dashboard', tasks: ['Build a full sales dashboard', 'Add filters & actions', 'Publish to Tableau Public'], type: 'Project' },
    { skill: 'Statistics', title: 'Case Study: Analyze & Present', tasks: ['End-to-end case study', '5-slide insight deck', 'Present it to a camera'], type: 'Project' },
    { skill: 'SQL', title: 'Window Functions', tasks: ['ROW_NUMBER, RANK, LAG/LEAD', 'Advanced aggregation queries', 'Optimize with indexes (EXPLAIN)'], type: 'Learn' },
    { skill: 'Python', title: 'Project: Python EDA Capstone', tasks: ['EDA on a real dataset', 'Insights + recommendations', 'Push to GitHub'], type: 'Project' },
    { skill: 'Tableau', title: 'Advanced Tableau', tasks: ['LODs, parameters & actions', 'Story points for narrative', 'Make it portfolio-grade'], type: 'Practice' },
    { skill: 'Statistics', title: 'A/B Testing & Metrics', tasks: ['Experiment design basics', 'Define KPIs & guardrails', 'Write a test plan'], type: 'Learn' },
    { skill: 'SQL', title: 'Mock Interview: SQL', tasks: ['Timed 45-min SQL test', 'Explain your query out loud', 'Review solutions'], type: 'Review' },
    { skill: 'Python', title: 'Notebook Portfolio Polish', tasks: ['Refactor notebooks with narrative', 'Add visuals & READMEs', 'Share your best notebook'], type: 'Review' },
    { skill: 'Statistics', title: 'Week 3 Demo Day', tasks: ['Record dashboard walkthrough', 'Gather peer feedback', 'Iterate one improvement'], type: 'Review' },
    { skill: 'Tableau', title: 'Portfolio Site Build', tasks: ['Build a one-page portfolio (Notion/website)', 'Add 3 projects with case studies', 'Metrics on every project'], type: 'Project' },
    { skill: 'Excel', title: 'Business Cases Practice', tasks: ['Solve 3 estimation cases', 'Structure issue → analysis → insight', 'Present one to a friend'], type: 'Practice' },
    { skill: 'Statistics', title: 'Resume Revamp', tasks: ['Quantify every bullet with numbers', 'ATS keyword check for target JD', 'Add Tableau Public + GitHub links'], type: 'Review' },
    { skill: 'Python', title: 'Power BI (Bonus Sprint)', tasks: ['Explore Power BI fundamentals', 'Rebuild your Tableau dashboard in it', 'Add it to your skills list'], type: 'Learn' },
    { skill: 'Statistics', title: 'Mock Interviews', tasks: ['Top 30 DA questions', 'STAR story for your gap years', 'Two mock interviews'], type: 'Review' },
    { skill: 'SQL', title: 'Real Dataset Challenge', tasks: ['One more Kaggle micro-project', 'End-to-end: SQL + Python + Tableau', 'Publish everywhere'], type: 'Project' },
    { skill: 'Tableau', title: 'Application Sprint', tasks: ['Apply to 15 analyst roles', 'Tailored resume per JD', 'Referral outreach to 5 analysts'], type: 'Practice' },
    { skill: 'Python', title: 'Networking & Outreach', tasks: ['Connect with 20 people in data', 'Post one insight article on LinkedIn', 'Follow 10 hiring managers'], type: 'Practice' },
    { skill: 'Statistics', title: 'Final Showcase', tasks: ['Portfolio final review', 'Presentation dry-run', 'Plan your next 30 days'], type: 'Project' },
  ],
  uiux: [
    { skill: 'Figma', title: 'Figma Foundations', tasks: ['Workspace, frames & auto-layout', 'Recreate a real app screen', 'Learn shortcuts by heart'], type: 'Learn' },
    { skill: 'Figma', title: 'Components & Styles', tasks: ['Buttons & cards as components', 'Color & text styles', 'Variants basics'], type: 'Learn' },
    { skill: 'Wireframing', title: 'Wireframing Practice', tasks: ['Wireframe 3 screen types (list/detail/form)', 'Low → mid fidelity progression', 'Annotate decisions'], type: 'Practice' },
    { skill: 'User Research', title: 'UX Research 101', tasks: ['User interviews: script 5 questions', 'Jobs-to-be-done framing', 'Analyze one real app’s reviews'], type: 'Learn' },
    { skill: 'User Research', title: 'Personas & Journey Maps', tasks: ['Build one persona', 'Map a 6-step journey', 'Spot the 3 friction points'], type: 'Practice' },
    { skill: 'Figma', title: 'Project: App Redesign — Discovery', tasks: ['Pick an app with a real pain', 'Audit & document issues', 'Define success for your redesign'], type: 'Project' },
    { skill: 'Wireframing', title: 'Week 1 Review & Critique', tasks: ['Crit your wireframes honestly', 'Fix information hierarchy', 'Set Week 2 targets'], type: 'Review' },
    { skill: 'User Research', title: 'Information Architecture', tasks: ['Card sorting exercise', 'Sitemap for your redesign', 'Navigation patterns'], type: 'Learn' },
    { skill: 'Wireframing', title: 'Mid-fidelity Wireframes', tasks: ['Full 5-screen flow', 'Content-first layout', 'Usability test with 2 friends'], type: 'Practice' },
    { skill: 'Figma', title: 'Visual Design Foundations', tasks: ['Type scale & pairing rules', '8pt grid & spacing', 'Color contrast & accessibility'], type: 'Learn' },
    { skill: 'Design Systems', title: 'Design Systems & Tokens', tasks: ['Build a mini token set (color/type/spacing)', 'Document usage rules', 'Create your component library'], type: 'Learn' },
    { skill: 'Figma', title: 'Hi-Fi Mockups — Part 1', tasks: ['Apply tokens to your redesign', 'Pixel-perfect 3 screens', 'Empty/error/loading states'], type: 'Project' },
    { skill: 'Prototyping', title: 'Prototyping Basics', tasks: ['Clickable flow in Figma', 'Transitions & micro-interactions', 'Smart animate practice'], type: 'Learn' },
    { skill: 'Prototyping', title: 'Hi-Fi Mockups — Part 2 + Prototype', tasks: ['Finish all 5 screens', 'Full clickable prototype', 'Test with 2 users & iterate'], type: 'Project' },
    { skill: 'Design Systems', title: 'Design Systems in Figma', tasks: ['Auto-layout everything', 'Component properties', 'Library publishing basics'], type: 'Practice' },
    { skill: 'Prototyping', title: 'Motion & Micro-interactions', tasks: ['Easing concepts', 'Prototype 2 micro-interactions', 'Timing that feels physical'], type: 'Learn' },
    { skill: 'CSS', title: 'Design-to-Code Literacy', tasks: ['Inspect your design in DevTools terms', 'Understand Flexbox/Grid from design', 'Talk tokens with a developer'], type: 'Learn' },
    { skill: 'Figma', title: 'Project: Interactive Case Study', tasks: ['Write your case study narrative', 'Problem → research → design → impact', 'Before/after comparisons'], type: 'Project' },
    { skill: 'User Research', title: 'Portfolio — Case Study 1 Polish', tasks: ['Sharpen the problem statement', 'Add real quotes/data', '3-takeaway summary'], type: 'Practice' },
    { skill: 'Figma', title: 'Week 3 Demo Day', tasks: ['Present prototype to a designer friend', 'Capture feedback notes', 'List quick wins'], type: 'Review' },
    { skill: 'Figma', title: 'Project: End-to-End Case Study 2', tasks: ['New brief: redesign a checkout flow', '4 screens + prototype', 'Ship the full case study'], type: 'Project' },
    { skill: 'Design Systems', title: 'Portfolio Site Build', tasks: ['One-page portfolio (Behance/Notion/site)', '2 case studies, metrics first', 'About page with your story'], type: 'Project' },
    { skill: 'Prototyping', title: 'Design Critique Practice', tasks: ['Critique 3 products publicly', 'Articulate trade-offs', 'Visual vocabulary drill'], type: 'Practice' },
    { skill: 'User Research', title: 'Resume & LinkedIn Revamp', tasks: ['Rewrite with outcome-focused bullets', 'Add portfolio URL everywhere', 'Headline: “UI/UX Designer”'], type: 'Review' },
    { skill: 'Figma', title: 'Tools Survey: Framer/AI', tasks: ['Try an AI UI generator', 'Try Framer for interactive prototypes', 'Update your toolkit list'], type: 'Learn' },
    { skill: 'Prototyping', title: 'Mock Design Interviews', tasks: ['Top 20 UI/UX questions', 'Design-one-thing exercise (45 min)', 'STAR story for your gap'], type: 'Review' },
    { skill: 'Figma', title: 'Final Case Study Push', tasks: ['Polish type, spacing & exports', 'Export assets properly', 'Double-check all links'], type: 'Project' },
    { skill: 'User Research', title: 'Application Sprint', tasks: ['Apply to 15 UI/UX roles', 'Tailor portfolio order per JD', 'Track applications'], type: 'Practice' },
    { skill: 'Prototyping', title: 'Networking', tasks: ['Connect with 20 designers', 'Post one design breakdown on LinkedIn', 'Join one design community'], type: 'Practice' },
    { skill: 'Figma', title: 'Final Showcase', tasks: ['Portfolio final review', 'Present your best case study', 'Plan the next 30 days'], type: 'Project' },
  ],
  marketing: [
    { skill: 'SEO', title: 'SEO Foundations', tasks: ['How search works — crawl, index, rank', 'Keyword research with real tools', 'On-page SEO checklist'], type: 'Learn' },
    { skill: 'Content Marketing', title: 'Content Strategy', tasks: ['Content pillars for a niche', 'Editorial calendar for 30 days', 'Brief writing that works'], type: 'Learn' },
    { skill: 'SEO', title: 'On-Page & Technical SEO', tasks: ['Titles, metas & headings', 'Site structure & internal links', 'Audit one real website'], type: 'Practice' },
    { skill: 'Google Analytics', title: 'Google Analytics 4 Setup', tasks: ['GA4 property & events', 'Reports that matter', 'Connect Search Console'], type: 'Learn' },
    { skill: 'SEO', title: 'Project: SEO Audit & Action Plan', tasks: ['Full audit of a real local business', 'Prioritized fix list (impact × effort)', '1-page recommendations doc'], type: 'Project' },
    { skill: 'Content Marketing', title: 'Copywriting for Conversion', tasks: ['Hook-Body-CTA framework', 'Rewrite 5 weak headlines', 'Landing page copy exercise'], type: 'Practice' },
    { skill: 'SEO', title: 'Week 1 Review & Quiz', tasks: ['Revise SEO concepts', 'Self-quiz: 15 questions', 'Set Week 2 targets'], type: 'Review' },
    { skill: 'Google Analytics', title: 'Analytics Deep-Dive', tasks: ['Acquisition reports', 'Funnels & exploration reports', 'UTM tracking strategy'], type: 'Learn' },
    { skill: 'Social Media Marketing', title: 'Social Strategy', tasks: ['Platform fit matrix', 'Content formats per platform', '30-day content map'], type: 'Learn' },
    { skill: 'Social Media Marketing', title: 'Create 10 Posts', tasks: ['Design 10 posts in Canva', 'Write hooks for short video', 'Schedule with a tool'], type: 'Practice' },
    { skill: 'Email Marketing', title: 'Email Marketing & Automation', tasks: ['List building & lead magnets', 'Write a 3-email welcome sequence', 'Open/click metrics that matter'], type: 'Learn' },
    { skill: 'Email Marketing', title: 'Project: Welcome Sequence Live', tasks: ['Set up a real list (Mailchimp free)', 'Write + send sequence', 'Report open rates'], type: 'Project' },
    { skill: 'Meta Ads', title: 'Meta Ads Fundamentals', tasks: ['Campaign structure: objective → ad', 'Audiences & lookalikes', 'Creatives that stop the scroll'], type: 'Learn' },
    { skill: 'Meta Ads', title: 'Google Ads Basics', tasks: ['Search vs display campaigns', 'Keyword match types', 'Budget pacing & bidding'], type: 'Learn' },
    { skill: 'Meta Ads', title: 'Ad Creative Sprint', tasks: ['Design 3 ad creatives', 'Write 3 ad copies (AIDA)', 'A/B test plan on paper'], type: 'Practice' },
    { skill: 'Meta Ads', title: 'Project: ₹1000-Trial Ad Campaign', tasks: ['Launch a small real campaign', 'Monitor for 3 days', 'Report CTR & CPC'], type: 'Project' },
    { skill: 'Google Analytics', title: 'Tagging & Reporting System', tasks: ['Build a weekly reporting template', 'Dashboard in Sheets/Looker', 'Present insights to a friend'], type: 'Practice' },
    { skill: 'Content Marketing', title: 'Case Study: Campaign Post-mortem', tasks: ['Document your trial campaign', 'What worked / what didn’t', 'Next-test hypotheses'], type: 'Project' },
    { skill: 'Social Media Marketing', title: 'Personal Brand Build', tasks: ['Optimize your LinkedIn profile', 'Pick 2 content themes', 'Write your positioning statement'], type: 'Practice' },
    { skill: 'Social Media Marketing', title: 'Week 3 Demo Day', tasks: ['Review your campaign data out loud', 'Peer feedback on posts', 'Iterate your calendar'], type: 'Review' },
    { skill: 'Content Marketing', title: 'Project: 30-Day Content Engine', tasks: ['Plan + publish 1 week of content', 'Repurpose one piece 3 ways', 'Measure engagement'], type: 'Project' },
    { skill: 'SEO', title: 'Portfolio: 3 Case Studies', tasks: ['SEO audit case', 'Ad campaign case', 'Content/social case'], type: 'Project' },
    { skill: 'Google Analytics', title: 'Funnel Optimization Practice', tasks: ['Map a landing page funnel', 'Identify 3 drop-off fixes', 'Rewrite one page end-to-end'], type: 'Practice' },
    { skill: 'Email Marketing', title: 'Resume & Portfolio Revamp', tasks: ['Rewrite bullets with metrics', 'ATS keyword check for JD', 'Add portfolio/links everywhere'], type: 'Review' },
    { skill: 'Meta Ads', title: 'Marketing Tools Survey', tasks: ['Explore HubSpot free tier', 'Try an AI content workflow', 'Update your tools list'], type: 'Learn' },
    { skill: 'SEO', title: 'Mock Interviews', tasks: ['Top 25 marketing questions', 'Answer “sell me this pen” frameworks', 'STAR story for your gap'], type: 'Review' },
    { skill: 'Content Marketing', title: 'Final Portfolio Push', tasks: ['Metrics on every case study', 'Screenshots & numbers everywhere', 'Links all working'], type: 'Project' },
    { skill: 'Social Media Marketing', title: 'Application Sprint', tasks: ['Apply to 15 marketing roles', 'Tailored resume per JD', 'Referral outreach to 5 marketers'], type: 'Practice' },
    { skill: 'Email Marketing', title: 'Networking', tasks: ['Comment on 10 marketing posts daily', 'Join 2 marketing communities', 'DM 10 hiring managers'], type: 'Practice' },
    { skill: 'Meta Ads', title: 'Final Showcase', tasks: ['Portfolio final review', 'Record your campaign walkthrough', 'Plan the next 30 days'], type: 'Project' },
  ],
};

export const WEEKS = [
  { title: 'Foundations Revival', desc: 'Rebuild fundamentals, confidence & daily habit.', color: '#7dd3fc' },
  { title: 'Core Skills Deep-Dive', desc: 'The skills your target role hires for.', color: '#38bdf8' },
  { title: 'Real Projects & Proof', desc: 'Ship portfolio-worthy work in public.', color: '#0ea5e9' },
  { title: 'Polish & Interview-Ready', desc: 'Resume, applications, mock interviews, offers.', color: '#0369a1' },
];

export const DEMOS = {
  frontend: `Aman Sharma
aman.sharma@gmail.com | +91 98765 43210 | linkedin.com/in/amansharma | github.com/amansharma
B.Sc Computer Science — Delhi University (2018 - 2021) — 72%

Summary: Fresher with a career break. Passionate about building websites.

Break: 3 years after graduation (2021-2024). No formal job, freelanced basic HTML pages for local shops.

Skills: HTML (basic), MS Word, Communication, Teamwork, Problem Solving
Projects: Simple static page for family business, local shop catalogue

Experience: Freelance web work for 4 local shops (updated 2021)
Built static catalogue pages, handled client calls, delivered on time

Goal: frontend roles building modern interactive sites for startups and agencies. One hour available daily.`,
  data: `Neha Patel
neha.patel88@gmail.com | +91 98123 45670 | linkedin.com/in/nehapatel
B.Com — Mumbai University (2017-2020)

Summary: Commerce graduate, strong with numbers, looking to restart with data roles.

Break: 4 years — family responsibilities. Worked briefly as cashier at Reliance Fresh (2020). Managed daily cash reconciliation of 2 lakh with zero discrepancy.

Skills: Advanced Excel (pivot tables & formulas), Tally, Good with numbers, Communication
Tools tried: Completed 1 free Excel certification, never finished an online video course

Experience: Cashier — Reliance Fresh, Mumbai (Jan 2020 - Nov 2020)
Handled billing counter for 300+ customers daily, maintained stock registers in Excel

Target: data roles — insights, dashboards, reporting for a retail business. Can give 2 hours daily.`,
  marketing: `Rahul Verma
rahul.verma@yahoo.in | +91 97654 32100 | linkedin.com/in/rahulverma
BBA Marketing — Pune University (2019-2022) — Break of 2 years

Summary: Creative marketer with grassroots social experience, ready to go digital-first.

Skills: Instagram handling, Canva basics, English communication, Video editing basics
Experience: Grew uncle's store Instagram from 300 to 2,400 followers in 8 months via daily reels and WhatsApp catalogues. Managed ₹25,000/month ad budget for the store.

Goal: growth and marketing roles for D2C and e-commerce brands. Available after 6pm daily.`,
};
