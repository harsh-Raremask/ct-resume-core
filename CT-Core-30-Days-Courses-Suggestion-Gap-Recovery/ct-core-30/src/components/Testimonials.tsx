import { Quote, BadgeCheck } from 'lucide-react';

const STORIES = [
  {
    quote: 'Two and a half years after graduating, I did the 30-day frontend sprint. Built 3 projects, cracked my interview in week 5. The ATS breakdown told me exactly what was leaking.',
    name: 'Priya Sharma',
    detail: 'Frontend Comeback · 2.5-yr gap',
    badge: 'Placed at TCS Digital',
    ats: 'ATS 41 → 88',
    img: '/images/priya.jpg',
  },
  {
    quote: 'I was a B.Com cashier for four years. The sprint gave me SQL, Python and a Tableau portfolio. CT Core-30 called my gap a “reset” — my interviewer called my case study “impressive”.',
    name: 'Neha Patel',
    detail: 'Data Analyst Comeback · 4-yr gap',
    badge: 'Placed at Deloitte',
    ats: 'ATS 38 → 84',
    img: '/images/neha.jpg',
  },
  {
    quote: 'Managed my uncle’s store Instagram for two years. The plan turned that into Meta Ads + GA4 proof. Got two offers in six weeks. This thing just works.',
    name: 'Rahul Verma',
    detail: 'Marketing Comeback · 2-yr gap',
    badge: 'Placed at D2C startup',
    ats: 'ATS 52 → 91',
    img: '/images/rahul.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-6 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-700">COMEBACK STORIES</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">Real gaps. Real comebacks.</h3>
        </div>
        <p className="hidden text-[12px] font-semibold text-slate-500 sm:block">2,847 learners · 4.8/5 rating · 89% describe their sprint as “life-changing”</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {STORIES.map(s => (
          <figure key={s.name} className="card-shadow flex flex-col rounded-[24px] border border-slate-200 bg-white p-6">
            <Quote size={26} className="text-sky-400" fill="#bae6fd" strokeWidth={1.5} />
            <blockquote className="mt-3 flex-1 text-[13px] leading-6 text-slate-700">“{s.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
              <img src={s.img} alt={s.name} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-200" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-ink">{s.name} <BadgeCheck size={13} className="text-sky-500" /></p>
                <p className="text-[10px] font-semibold text-slate-500">{s.detail}</p>
                <p className="mt-0.5 text-[10px] font-bold text-emerald-700">{s.badge} · <span className="text-slate-500">{s.ats}</span></p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
