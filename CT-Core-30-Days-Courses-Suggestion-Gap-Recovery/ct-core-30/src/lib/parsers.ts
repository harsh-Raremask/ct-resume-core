import type { AnalysisResult, HistoryEntry, RoleId } from './types';

/* ---------------- Resume text extraction (client-side) ---------------- */

export interface ExtractResult {
  text: string;
  pages?: number;
}

export async function extractResumeText(file: File): Promise<ExtractResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const type = file.type;

  if (ext === 'txt' || type.includes('text/plain')) {
    const text = await file.text();
    return { text };
  }

  if (ext === 'md' || ext === 'markdown') {
    const text = await file.text();
    return { text };
  }

  if (ext === 'pdf' || type === 'application/pdf') {
    const pdfjs = await import('pdfjs-dist');
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const data = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data }).promise;
    let out = '';
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      let lastY: number | null = null;
      let line = '';
      for (const item of content.items as { str: string; transform: number[] }[]) {
        if (!('str' in item)) continue;
        const y = item.transform?.[5];
        if (lastY !== null && y !== undefined && Math.abs(y - lastY) > 4) {
          out += line.trim() + '\n';
          line = '';
        }
        line += item.str + (item.str.endsWith(' ') ? '' : ' ');
        lastY = y ?? lastY;
      }
      out += line.trim() + '\n';
    }
    return { text: out.trim(), pages: doc.numPages };
  }

  if (ext === 'docx' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = (await import('mammoth')) as unknown as { extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> };
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: result.value.trim() };
  }

  if (ext === 'doc') {
    throw new Error('Legacy .doc files aren’t supported in-browser. Please save as .docx, .pdf or .txt and try again.');
  }

  // Unknown extension — try as text
  try {
    const text = await file.text();
    if (/[\u0000-\u0008]/.test(text.slice(0, 500))) throw new Error('binary');
    return { text };
  } catch {
    throw new Error(`Couldn’t read “${file.name}”. Supported formats: PDF, DOCX, TXT, MD.`);
  }
}

/* ---------------- History (localStorage) ---------------- */

const KEY = 'gaprecover_history_v1';

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as HistoryEntry[];
  } catch {
    return [];
  }
}

export function pushHistory(r: AnalysisResult) {
  const entry: HistoryEntry = {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    name: r.candidateName,
    roleLabel: r.roleLabel,
    atsTotal: r.atsTotal,
    matchScore: r.matchScore,
    readiness: r.readiness,
    topMissing: r.missingSkills.slice(0, 4),
    gap: r.gap,
  };
  const next = [entry, ...getHistory()].slice(0, 12);
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

/* ---------------- Progress (localStorage) ---------------- */

const COMPLETED_KEY = 'gaprecover_completed_v1';

export function getCompleted(analysisSignature: string): Set<number> {
  try {
    const all = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '{}');
    const arr: number[] = all[analysisSignature] ?? [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function getAllCompletedMap(): Record<string, number[]> {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function setCompleted(analysisSignature: string, days: Set<number>) {
  try {
    const all = getAllCompletedMap();
    all[analysisSignature] = [...days];
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

/* ---------------- Print report ---------------- */

export function openPrintReport(r: AnalysisResult) {
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) return false;
  const sectionsHtml = r.sections.map(s => `
    <tr><td>${s.label}</td><td style="text-align:center"><b>${s.score}</b>/${s.max}</td><td>${s.detail}</td></tr>`).join('');
  const matched = r.matchedSkills.map(s => `<span class="chip ok">${s}</span>`).join('');
  const missing = r.missingSkills.map(s => `<span class="chip miss">${s}</span>`).join('');
  const planRows = r.plan.map(d => `
    <tr><td>Day ${d.day}</td><td>${d.type}</td><td>${d.skill}</td><td>${d.tasks.map(t => '• ' + t).join('<br>')}</td></tr>`).join('');
  const totalHours = r.plan.reduce((acc, d) => {
    const m = d.duration.match(/(\d+):(\d+)/);
    return acc + (m ? parseInt(m[1]) + parseInt(m[2]) / 60 : 0.75);
  }, 0).toFixed(0);

  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>CT Core-30 Report — ${r.candidateName}</title>
  <style>
    body{font-family:Georgia,serif;color:#0c4a6e;margin:0;padding:32px 40px;font-size:12px}
    h1{font-size:26px;margin:0} .sub{color:#666;margin-top:2px}
    .brand{float:right;background:#0369a1;color:#ffffff;padding:6px 12px;border-radius:8px;font-weight:bold;font-family:Helvetica,sans-serif;font-size:14px}
    .scorebar{display:flex;gap:14px;margin:18px 0}
    .card{flex:1;border:1px solid #bae6fd;border-radius:12px;padding:12px 14px;background:#f0f9ff}
    .card .big{font-size:30px;font-weight:800}.card .lab{font-size:10px;letter-spacing:.12em;color:#667;text-transform:uppercase}
    h2{font-size:15px;text-transform:uppercase;letter-spacing:.1em;border-bottom:2px solid #0369a1;padding-bottom:4px;margin:22px 0 10px}
    table{width:100%;border-collapse:collapse} td,th{border:1px solid #e4e6eb;padding:6px 8px;vertical-align:top;text-align:left} th{background:#e0f2fe;font-size:10px;text-transform:uppercase;letter-spacing:.08em}
    .chip{display:inline-block;border:1px solid;border-radius:999px;padding:2px 8px;margin:2px 2px;font-size:10px;font-family:Helvetica,sans-serif}
    .ok{background:#ecfdf5;border-color:#34d399;color:#047857}.miss{background:#fffbeb;border-color:#ffffff;color:#92400e}
    .ai{background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:12px;margin-top:10px;font-style:italic}
    @media print{ body{padding:12px 20px} }
  </style></head><body>
    <div class="brand">CT CORE-30</div>
    <h1>Resume Analysis Report</h1>
    <div class="sub">${r.candidateName} · Target: ${r.roleLabel} · Gap: ${r.gap}${r.lastActiveYear ? ` · Last active ${r.lastActiveYear}` : ''} · Generated ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    <div class="scorebar">
      <div class="card"><div class="lab">ATS Score</div><div class="big">${r.atsTotal}<span style="font-size:16px">/100</span></div><div>Grade ${r.atsGrade}</div></div>
      <div class="card"><div class="lab">Skill Match</div><div class="big">${r.matchScore}<span style="font-size:16px">%</span></div><div>${r.matchedSkills.length}/${r.matchedSkills.length + r.missingSkills.length} keywords</div></div>
      <div class="card"><div class="lab">Readiness</div><div class="big">${r.readiness}<span style="font-size:16px">%</span></div><div>→ ~${r.projectedReadiness}% after sprint</div></div>
      <div class="card"><div class="lab">Est. Effort</div><div class="big">~${totalHours}<span style="font-size:16px">h</span></div><div>30 days · ${r.dailyTime}/day</div></div>
    </div>
    <div class="ai">${r.aiSummary}</div>
    <h2>ATS Score Breakdown</h2>
    <table><thead><tr><th>Section</th><th>Score</th><th>Findings</th></tr></thead><tbody>${sectionsHtml}</tbody></table>
    <h2>Keywords Found</h2><div>${matched || '<i>None detected</i>'}</div>
    <h2>Keywords Missing (weave these in)</h2><div>${missing || '<i>Full coverage — great!</i>'}</div>
    <h2>Your 30-Day Sprint</h2>
    <table><thead><tr><th>Day</th><th>Type</th><th>Skill</th><th>Tasks</th></tr></thead><tbody>${planRows}</tbody></table>
    <div style="margin-top:24px;color:#889;font-size:10px;text-align:center">CT Core-30 Days Courses Suggestion (Gap Recovery) · Free resume analysis & 30-day career comeback system · ${new Date().getFullYear()}</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script>
  </body></html>`);
  win.document.close();
  return true;
}
