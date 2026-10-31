import { useCallback, useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Analyzer from '../components/Analyzer';
import ResultsReport from '../components/ResultsReport';
import Plan from '../components/Plan';
import CourseLibrary from '../components/CourseLibrary';
import Testimonials from '../components/Testimonials';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import { analyzeResume } from '../lib/analyze';
import { DEMOS } from '../lib/data';
import { pushHistory } from '../lib/parsers';
import type { AnalysisResult } from '../lib/types';

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [demoRequest, setDemoRequest] = useState<{ key: keyof typeof DEMOS; nonce: number } | null>(null);

  // Pre-analyze the frontend demo on load so the report feels alive immediately.
  useEffect(() => {
    const demo = analyzeResume({ text: DEMOS.frontend, roleId: 'frontend', gap: '3 years', dailyTime: '45-60 minutes', learningStyle: 'Video + Practice' });
    setResult(demo);
  }, []);

  const handleDemo = useCallback((key: keyof typeof DEMOS) => {
    setDemoRequest({ key, nonce: Date.now() });
  }, []);

  const handleResult = useCallback((r: AnalysisResult) => {
    setResult(r);
    pushHistory(r);
    window.dispatchEvent(new Event('gaprecover:history'));
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans text-slate-900">
      <Nav />
      <Hero onDemo={handleDemo} />
      <Analyzer demoRequest={demoRequest} onResult={handleResult} />

      {/* ---------- RESULTS ---------- */}
      <section id="results" className="scroll-mt-20 pb-14">
        {result ? (
          <>
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4 pb-5 pt-2">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-sky-700">YOUR ANALYSIS</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-ink">ATS & Gap Report — {result.candidateName}</h2>
                </div>
                <span className="hidden rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-500 md:inline-flex">SAVED TO HISTORY ✓</span>
              </div>
            </div>
            <ResultsReport result={result} />
            <div className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 lg:px-8">
              <Plan result={result} />
            </div>
            <div className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 lg:px-8">
              <CourseLibrary result={result} />
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"><EmptyState /></div>
        )}
      </section>

      <Testimonials />

      {/* standalone course teaser when no result yet (keeps marketing feel) */}
      {!result && (
        <div className="mx-auto max-w-[1280px] px-4 pb-14 sm:px-6 lg:px-8">
          <CourseLibrary />
        </div>
      )}

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="dark-grid relative overflow-hidden rounded-[32px] px-8 py-14 text-center text-white sm:px-16">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-sky-100">READY WHEN YOU ARE</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">The gap is a chapter.<br /><span className="text-sky-100">Not the story.</span></h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-sky-100">Upload your resume now — 3 minutes to your ATS score, 30 days to your comeback. Free, forever.</p>
          <button onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })} className="mx-auto mt-7 flex h-14 items-center gap-2 rounded-full bg-white px-9 text-[15px] font-extrabold text-ink transition hover:bg-sky-50">Analyze My Resume — Free →</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
