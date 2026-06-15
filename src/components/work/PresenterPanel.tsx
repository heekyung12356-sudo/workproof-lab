import { useEffect, useState } from 'react';
import { ACCENT } from '../../utils/theme';
import type { AccentKey } from '../../data/companies/types';

interface CompanyLite {
  slug: string;
  name: string;
  roleTitle: string;
  tagline: string;
  accent: AccentKey;
}

const KEY = 'workproof.presenter.v1';

/* The candidate's private control panel:
   - toggle which targets are "active" (your own view; recruiters get per-company links)
   - jump into each tailored simulation
   - copy the clean, focused link to send to a specific recruiter            */
export default function PresenterPanel({ companies, liveUrl }: { companies: CompanyLite[]; liveUrl: string }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOn(JSON.parse(raw));
      else setOn(Object.fromEntries(companies.map((c) => [c.slug, true])));
    } catch {
      setOn(Object.fromEntries(companies.map((c) => [c.slug, true])));
    }
  }, []);
  useEffect(() => {
    if (Object.keys(on).length) try { localStorage.setItem(KEY, JSON.stringify(on)); } catch { /* ignore */ }
  }, [on]);

  const toggle = (slug: string) => setOn((p) => ({ ...p, [slug]: !p[slug] }));
  const activeCount = companies.filter((c) => on[c.slug]).length;

  async function copyLink(slug: string) {
    const url = `${liveUrl.replace(/\/$/, '')}/apply/${slug}`;
    try { await navigator.clipboard.writeText(url); setCopied(slug); setTimeout(() => setCopied(''), 1400); } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-fog-500">
          Your target companies · {activeCount} shown
        </p>
        <span className="text-[11px] text-fog-600">Toggles are private (this browser). Recruiters get the per-company link only.</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {companies.map((c) => {
          const A = ACCENT[c.accent];
          const active = on[c.slug];
          return (
            <div key={c.slug} className={`rounded-xl border ${active ? A.border : 'border-line'} ${active ? A.soft : 'bg-ink-900/40'} p-4 transition-colors`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-7 w-7 place-items-center rounded-md ${A.bg} text-[12px] font-bold ${A.text}`}>{c.name[0]}</span>
                    <div className="leading-tight">
                      <div className="text-sm font-semibold text-fog-100">{c.name}</div>
                      <div className="text-[11px] text-fog-500">{c.roleTitle}</div>
                    </div>
                  </div>
                </div>
                {/* on/off switch */}
                <button
                  onClick={() => toggle(c.slug)}
                  role="switch"
                  aria-checked={active}
                  aria-label={`Show ${c.name}`}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? A.btn : 'bg-ink-700'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink-950 transition-all ${active ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>

              <p className="mt-2 text-[12px] leading-relaxed text-fog-400">{c.tagline}</p>

              {active && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/apply/${c.slug}`} className={`rounded-lg ${A.btn} px-3 py-1.5 text-[12px] font-semibold text-ink-950 hover:opacity-90`}>Open simulation →</a>
                  <button onClick={() => copyLink(c.slug)} className="rounded-lg border border-line bg-ink-850 px-3 py-1.5 text-[12px] font-semibold text-fog-300 hover:border-fog-600">
                    {copied === c.slug ? 'Copied!' : 'Copy recruiter link'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
