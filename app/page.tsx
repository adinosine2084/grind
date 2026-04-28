import Link from 'next/link'
import Cursor from '@/components/Cursor'

const FEATURES = [
  { icon: '⚡', name: 'Instant Capture', desc: 'Add a task in under 2 seconds. Type and hit Enter. No categories, no dropdowns.' },
  { icon: '🎯', name: 'Smart Routing',   desc: 'Type "fix crash" and it auto-routes to urgent. No clicks, no dropdowns.' },
  { icon: '🔗', name: 'Integrations',    desc: 'Pulls from GitHub, Linear, Notion, Slack. Your work in one place.' },
  { icon: '👀', name: 'Team Visibility', desc: 'See what your team is grinding on in real time. No status meetings.' },
  { icon: '📊', name: 'Brutal Analytics', desc: 'The blunt truth about where your time goes. Reports that change behavior.' },
  { icon: '🔒', name: 'Private by Default', desc: 'GDPR compliant, workspace-isolated. Your data stays yours.' },
]

const STATS = [
  { n: '12K+',  l: 'Active Teams' },
  { n: '4.8M',  l: 'Tasks Completed' },
  { n: '99.9%', l: 'Uptime' },
  { n: '0',     l: 'Useless Features' },
]

const PRICING = [
  {
    tier: 'Starter', price: '0', period: 'forever free', featured: false,
    cta: 'Get Started',
    features: ['Up to 3 users', 'Unlimited personal tasks', 'Basic integrations', '7-day history'],
  },
  {
    tier: 'Pro', price: '12', period: 'per user / month', featured: true,
    cta: 'Start Free Trial →',
    features: ['Unlimited users', 'AI task routing', 'All integrations', 'Full history & analytics', 'Priority support'],
  },
  {
    tier: 'Enterprise', price: 'Custom', period: 'talk to us', featured: false,
    cta: 'Contact Sales',
    features: ['SSO & SAML', 'Self-hosted option', 'SLA guarantee', 'Dedicated support'],
  },
]

const PREVIEW_TASKS = [
  { t: 'Fix auth bug on mobile',      s: 'urgent', done: false },
  { t: 'Finalize Q3 roadmap',          s: 'done',   done: true  },
  { t: 'Write onboarding copy',        s: 'todo',   done: false },
  { t: 'Deploy staging build',         s: 'urgent', done: false },
  { t: 'Update design system docs',    s: 'later',  done: false },
]

export default function HomePage() {
  return (
    <>
      <Cursor />

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-2 border-ink sticky top-0 bg-paper z-50">
        <div className="font-display font-extrabold text-2xl tracking-tight select-none">
          <span className="bg-accent px-1">GR</span>IND
        </div>
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {['Features', 'Pricing'].map(item => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest hover:underline text-ink no-underline">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <Link href="/auth/login"  className="btn btn-secondary hidden md:inline-flex">Log in</Link>
          <Link href="/auth/signup" className="btn btn-primary">Start Free →</Link>
        </div>
      </nav>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden border-b-2 border-ink bg-ink text-accent py-2 select-none">
        <div className="marquee-track flex gap-12 whitespace-nowrap w-max">
          {Array(2).fill([
            '★ Ship Faster', '→ No Fluff', '★ Built Different',
            '→ Brutally Simple', '★ Actually Works', '→ Zero BS',
            '★ Keyboard First', '→ Real Time',
          ]).flat().map((t, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest flex-shrink-0">{t}</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[1fr_360px] gap-12 items-center">
        <div>
          <div className="tag mb-6 fade-up delay-1">↳ Now with AI Task Routing</div>
          <h1 className="font-display font-extrabold text-[clamp(3.5rem,8vw,7rem)] leading-[0.92] tracking-tight mb-6 fade-up delay-2">
            GET<br />STUFF<br /><span className="bg-accent px-2">DONE.</span>
          </h1>
          <p className="text-sm leading-relaxed text-[#555] max-w-md mb-8 fade-up delay-3">
            The task manager that doesn&apos;t get in your way. No dashboards for your dashboards.
            No weekly digests you never read. Just work.
          </p>
          <div className="flex flex-wrap gap-3 mb-6 fade-up delay-4">
            <Link href="/auth/signup" className="btn btn-primary">Start for Free →</Link>
            <Link href="#features"    className="btn btn-secondary">See Features</Link>
          </div>
          <p className="text-xs uppercase tracking-widest text-[#888] fade-up delay-5">
            <strong className="text-ink">12,400+</strong> teams already grinding — no credit card needed
          </p>
        </div>

        {/* Live preview card */}
        <div className="card-lg p-5 hidden md:block">
          <div className="flex justify-between items-center pb-4 mb-4 border-b-2 border-ink">
            <span className="font-display font-extrabold text-sm uppercase tracking-wide">Today&apos;s Queue</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 border border-ink inline-block" />
              <span className="text-xs font-bold uppercase tracking-widest">Live</span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {PREVIEW_TASKS.map((task, i) => (
              <div key={i} className="task-row flex items-center gap-3 p-2.5 border-2 border-ink
                hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal transition-all">
                <div className={`w-4 h-4 border-2 border-ink flex-shrink-0 flex items-center
                  justify-center text-[10px] font-black ${task.done ? 'bg-accent' : ''}`}>
                  {task.done ? '✓' : ''}
                </div>
                <span className={`text-xs flex-1 min-w-0 truncate ${task.done ? 'line-through text-[#999]' : ''}`}>
                  {task.t}
                </span>
                <span className={`tag tag-${task.s} flex-shrink-0`}>{task.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t-2 border-ink" />

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#888] mb-2">// What makes it different</p>
        <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-none mb-12">
          NO NONSENSE.<br />JUST FEATURES.
        </h2>
        <div className="grid md:grid-cols-3 border-2 border-ink">
          {FEATURES.map((f, i) => (
            <div key={i} className={[
              'feature-card p-6 hover:bg-accent transition-colors',
              i % 3 !== 2 ? 'md:border-r-2 md:border-ink' : '',
              i < 3       ? 'border-b-2 border-ink'        : '',
            ].join(' ')}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-display font-extrabold text-base mb-2">{f.name}</div>
              <p className="text-xs leading-relaxed text-[#555]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="border-y-2 border-ink bg-ink text-paper">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={[
              'py-10 px-6 text-center',
              /* right border: every item except the last in each row */
              /* mobile (2-col): odd-indexed items (1,3) are right-edge — no border */
              /* desktop (4-col): last item (3) is right-edge — no border */
              i % 2 !== 1 ? 'border-r border-[#333]' : '',
              i === 3     ? 'border-r-0'              : '',
              /* top border for bottom row on mobile */
              i >= 2      ? 'border-t border-[#333] md:border-t-0' : '',
            ].join(' ')}>
              <span className="font-display font-extrabold text-5xl leading-none text-accent block">{s.n}</span>
              <span className="text-xs uppercase tracking-widest text-[#999] mt-2 block">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICING ── */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#888] mb-2">// Honest pricing</p>
        <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-none mb-12">
          PAY FOR WHAT<br />YOU USE.
        </h2>
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {PRICING.map((p, i) => (
            <div key={i} className={[
              'pricing-card relative p-7 border-2 border-ink',
              p.featured ? 'bg-ink text-paper md:-translate-y-2' : '',
              p.featured ? 'shadow-[6px_6px_0px_#0A0A0A]' : 'shadow-[4px_4px_0px_#0A0A0A]',
            ].join(' ')}>
              {p.featured && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent text-ink
                  text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 border-2 border-ink whitespace-nowrap">
                  Most Popular
                </span>
              )}
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.featured ? 'text-[#aaa]' : 'text-[#888]'}`}>
                {p.tier}
              </div>
              <div className="font-display font-extrabold text-5xl leading-none tracking-tight mb-1">
                {p.price === 'Custom'
                  ? 'Custom'
                  : <><sup className="text-xl align-super">$</sup>{p.price}</>
                }
              </div>
              <div className={`text-xs mb-5 ${p.featured ? 'text-[#aaa]' : 'text-[#888]'}`}>{p.period}</div>
              <div className={`h-px mb-5 ${p.featured ? 'bg-[#333]' : 'bg-[#e0e0e0]'}`} />
              <ul className="flex flex-col gap-2 mb-6 list-none p-0">
                {p.features.map((feat, j) => (
                  <li key={j} className={`text-xs pl-4 relative leading-relaxed ${p.featured ? 'text-[#ccc]' : 'text-[#444]'}`}>
                    <span className={`absolute left-0 font-bold ${p.featured ? 'text-accent' : 'text-ink'}`}>→</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup"
                className={`btn w-full text-center ${p.featured ? 'btn-primary' : 'btn-secondary'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-accent border-t-2 border-ink py-24 px-6 text-center">
        <h2 className="font-display font-extrabold text-[clamp(2.5rem,6vw,5.5rem)] tracking-tight leading-none mb-5">
          STOP PLANNING.<br />START SHIPPING.
        </h2>
        <p className="text-sm text-[#555] max-w-sm mx-auto mb-10 leading-relaxed">
          Join thousands of teams that replaced their bloated PM tool with something that actually works.
        </p>
        <Link href="/auth/signup" className="btn btn-dark inline-flex">
          Start Grinding — It&apos;s Free →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-ink px-6 py-5 flex flex-wrap gap-4 justify-between items-center">
        <div className="font-display font-extrabold text-lg">GRIND</div>
        <p className="text-xs uppercase tracking-widest text-[#888]">© 2025 GRIND — Built with zero chill.</p>
        <ul className="flex gap-5 list-none m-0 p-0">
          {['Privacy', 'Terms', 'Twitter'].map(l => (
            <li key={l}>
              <a href="#" className="text-xs uppercase tracking-widest text-[#888] hover:text-ink no-underline">{l}</a>
            </li>
          ))}
        </ul>
      </footer>
    </>
  )
}
