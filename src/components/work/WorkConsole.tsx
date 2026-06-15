import { useEffect, useState } from 'react';
import type { Company, TaskStep } from '../../data/companies/types';
import { ACCENT, TONE_CHIP } from '../../utils/theme';
import { computeScore, emptySession, type Session } from '../../engines/score';
import RadarChart from '../ui/RadarChart';
import SlaClock from './SlaClock';

type View = 'brief' | 'work' | 'task' | 'report';
type Phase = 'briefing' | 'playing' | 'done';

interface State {
  view: View;
  phase: Phase;
  cursor: number;
  session: Session;
}

const FRESH: State = { view: 'brief', phase: 'briefing', cursor: 0, session: emptySession() };

export default function WorkConsole({ company }: { company: Company }) {
  const A = ACCENT[company.accent];
  const KEY = `workproof.company.${company.slug}.v1`;
  const [s, setS] = useState<State>(FRESH);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const p = JSON.parse(raw) as State; if (p && typeof p.cursor === 'number') setS({ ...FRESH, ...p, session: { ...emptySession(), ...p.session } }); }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [KEY]);
  useEffect(() => { if (hydrated) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }, [s, hydrated, KEY]);

  const patch = (p: Partial<State>) => setS((prev) => ({ ...prev, ...p }));
  const scenario = company.scenario;
  const taskLive = s.view === 'task' && s.phase === 'playing';

  const select = (id: string, opt: string) => setS((p) => ({ ...p, session: { ...p.session, selections: { ...p.session.selections, [id]: opt } } }));
  const route = (id: string, t: string) => setS((p) => {
    const cur = p.session.routing[id] ?? [];
    const next = cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t];
    return { ...p, session: { ...p.session, routing: { ...p.session.routing, [id]: next } } };
  });
  const memo = (id: string, t: string) => setS((p) => ({ ...p, session: { ...p.session, memos: { ...p.session.memos, [id]: t } } }));
  const report = (id: string, t: string) => setS((p) => ({ ...p, session: { ...p.session, reports: { ...p.session.reports, [id]: t } } }));
  const commit = () => {
    if (s.cursor < scenario.steps.length - 1) patch({ cursor: s.cursor + 1 });
    else patch({ phase: 'done' });
  };
  const restart = () => patch({ phase: 'briefing', cursor: 0, session: emptySession() });

  const NAV: { id: View; label: string; glyph: string }[] = [
    { id: 'brief', label: 'Role Brief', glyph: '◰' },
    { id: 'work', label: company.consoleName, glyph: '◳' },
    { id: 'task', label: 'Live Task', glyph: '⚑' },
    { id: 'report', label: 'WorkProof Report', glyph: '◆' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-900 shadow-2xl shadow-black/40">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-ink-850 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`grid h-7 w-7 place-items-center rounded-md ${A.bg} font-bold ${A.text}`}>{company.name[0]}</span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-fog-100">{company.consoleName}</div>
            <div className="text-[10px] text-fog-600">{company.wordmark}</div>
          </div>
          <span className="ml-3 hidden rounded-full border border-line px-2 py-0.5 text-[11px] text-fog-400 sm:inline">{company.org}</span>
        </div>
        <div className="flex items-center gap-3">
          {taskLive && <span className={`hidden animate-pulse rounded ${A.bg} px-2 py-0.5 font-mono text-[10px] font-bold ${A.text} sm:inline`}>● LIVE TASK</span>}
          <span className="flex items-center gap-1.5 text-[12px] text-fog-300"><span className="grid h-6 w-6 place-items-center rounded-full bg-ink-700 text-[10px]">You</span><span className="hidden sm:inline">Candidate</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[190px_minmax(0,1fr)]">
        {/* sidebar */}
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-ink-900 p-2 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {NAV.map((n) => {
            const active = s.view === n.id;
            return (
              <button key={n.id} onClick={() => patch({ view: n.id })} aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors md:w-full ${active ? 'bg-ink-800 font-semibold text-fog-100' : 'text-fog-400 hover:bg-ink-850 hover:text-fog-200'}`}>
                <span className={active ? A.text : 'text-fog-600'}>{n.glyph}</span>
                <span className="whitespace-nowrap">{n.label}</span>
              </button>
            );
          })}
          <div className="mt-auto hidden px-3 pt-4 text-[10px] text-fog-700 md:block">Tailored for the {company.roleTitle} role. Unofficial candidate demo · fictional data.</div>
        </nav>

        {/* main */}
        <div className="min-h-[560px] bg-ink-950/40 p-4 sm:p-5">
          {s.view === 'brief' && <Brief company={company} onStart={() => patch({ view: 'task', phase: 'briefing' })} />}
          {s.view === 'work' && <Work company={company} />}
          {s.view === 'task' && <Task company={company} state={s} onStart={() => patch({ phase: 'playing', cursor: 0 })} onSelect={select} onRoute={route} onMemo={memo} onReport={report} onCommit={commit} onRestart={restart} onReport2={() => patch({ view: 'report' })} />}
          {s.view === 'report' && <Report company={company} session={s.session} onReplay={restart} onGoTask={() => patch({ view: 'task' })} />}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Role Brief ------------------------------- */
function Brief({ company, onStart }: { company: Company; onStart: () => void }) {
  const A = ACCENT[company.accent];
  return (
    <div className="space-y-5">
      <div className={`rounded-xl border ${A.border} ${A.soft} p-5`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${A.text}`}>Tailored for {company.name}</p>
        <h2 className="mt-1 text-xl font-bold text-fog-100">{company.roleTitle}</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-fog-300">{company.about}</p>
        <button onClick={onStart} className={`mt-4 rounded-lg ${A.btn} px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90`}>Start the live task →</button>
      </div>

      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fog-500">Your requirements → what this demo proves</h3>
        <div className="space-y-2">
          {company.requirements.map((r, i) => (
            <div key={i} className="grid grid-cols-1 gap-1 rounded-lg border border-line bg-ink-850/50 p-3 sm:grid-cols-2 sm:gap-3">
              <div className="text-[13px] text-fog-300"><span className="text-fog-600">JD:</span> {r.req}</div>
              <div className={`text-[13px] ${A.text}`}>→ {r.proof}</div>
            </div>
          ))}
        </div>
        {company.source && <p className="mt-3 text-[11px] text-fog-600">Mapped from: {company.source}. Unofficial candidate demo — not affiliated with {company.name}; all data fictional.</p>}
      </div>
    </div>
  );
}

/* ----------------------------- Work console ----------------------------- */
function Work({ company }: { company: Company }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {company.kpis.map((k, i) => (
          <div key={i} className="rounded-xl border border-line bg-ink-900/50 p-3">
            <div className="text-[10px] uppercase tracking-wide text-fog-500">{k.label}</div>
            <div className="font-mono text-lg font-bold text-fog-100">{k.value}</div>
            <div className="text-[10px] text-fog-600">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">{company.queueTitle}</h3>
          </div>
          <ul className="space-y-1.5">
            {company.queue.map((q) => (
              <li key={q.id} className="rounded-lg border border-line/70 bg-ink-850/60 px-2.5 py-2">
                <div className="flex items-center gap-2 text-sm">
                  {q.tag && <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${TONE_CHIP[q.tagTone ?? 'fog']}`}>{q.tag}</span>}
                  <span className="truncate font-medium text-fog-100">{q.primary}</span>
                  {q.right && <span className="ml-auto shrink-0 font-mono text-[11px] text-fog-500">{q.right}</span>}
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[11px] text-fog-500">
                  <span>{q.secondary}</span>
                </div>
                {q.signal && <div className="mt-1 text-[11px] text-iris">◆ {q.signal}</div>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-fog-600">{company.queueNote}</p>
        </div>

        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">{company.panelTitle}</h3>
          <ul className="space-y-2">
            {company.panel.map((p, i) => (
              <li key={i} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-fog-200">{p.primary}</span>
                  {p.status && <span className={`text-[11px] ${TONE_CHIP[p.statusTone ?? 'fog']} rounded px-1.5 py-0.5`}>{p.status}</span>}
                </div>
                {p.secondary && <div className="text-[11px] text-fog-500">{p.secondary}</div>}
                {typeof p.progress === 'number' && (
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-700"><div className="h-full rounded-full bg-mint" style={{ width: `${p.progress}%` }} /></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Live Task ------------------------------ */
function Task({ company, state, onStart, onSelect, onRoute, onMemo, onReport, onCommit, onRestart, onReport2 }: {
  company: Company; state: State; onStart: () => void;
  onSelect: (id: string, o: string) => void; onRoute: (id: string, t: string) => void;
  onMemo: (id: string, t: string) => void; onReport: (id: string, t: string) => void;
  onCommit: () => void; onRestart: () => void; onReport2: () => void;
}) {
  const A = ACCENT[company.accent];
  const sc = company.scenario;
  const total = sc.steps.length;

  if (state.phase === 'briefing') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className={`rounded-xl border ${A.border} bg-ink-850/70 p-5`}>
          <div className="flex items-center gap-2">
            <span className={`animate-pulse rounded ${A.bg} px-2 py-0.5 font-mono text-[11px] font-bold ${A.text}`}>● LIVE TASK</span>
            {sc.clock && <span className="font-mono text-[11px] text-fog-500">{sc.clock}</span>}
          </div>
          <h2 className="mt-2 text-xl font-bold text-fog-100">{sc.name}</h2>
          <p className="text-[13px] text-fog-500">{sc.tagline}</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-fog-300">{sc.briefing}</pre>
          <button onClick={onStart} className={`mt-4 w-full rounded-lg ${A.btn} px-4 py-3 text-sm font-semibold text-ink-950 hover:opacity-90`}>Begin →</button>
          <p className="mt-2 text-center text-[11px] text-fog-600">No login · progress saves automatically</p>
        </div>
      </div>
    );
  }

  if (state.phase === 'done') {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-mint/30 bg-mint/5 p-6 text-center">
        <div className="text-3xl">✓</div>
        <h2 className="mt-2 text-lg font-bold text-fog-100">Task complete</h2>
        <p className="mt-1 text-[13px] text-fog-400">Your WorkProof Report is ready — scorecard + how I’d handle each call.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={onReport2} className={`rounded-lg ${A.btn} px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90`}>View WorkProof Report →</button>
          <button onClick={onRestart} className="rounded-lg border border-line bg-ink-850 px-4 py-2.5 text-sm font-semibold text-fog-300 hover:border-fog-600">Replay</button>
        </div>
      </div>
    );
  }

  const step = sc.steps[state.cursor];
  const locked = sc.steps.slice(0, state.cursor).map((st) => {
    let v = '—';
    if (st.kind === 'choice') v = st.options?.find((o) => o.id === state.session.selections[st.id])?.label ?? '—';
    else if (st.kind === 'routing') v = (state.session.routing[st.id] ?? []).map((id) => st.routingTargets?.find((t) => t.id === id)?.label).filter(Boolean).join(', ') || '—';
    else if (st.kind === 'report') v = ((state.session.reports[st.id] ?? '').slice(0, 50)) + '…';
    return { title: st.title, v };
  });

  const memoOk = !step.memoPrompt || (state.session.memos[step.id] ?? '').trim().length > 0;
  let coreOk = false;
  if (step.kind === 'choice') coreOk = Boolean(state.session.selections[step.id]);
  else if (step.kind === 'routing') coreOk = (state.session.routing[step.id] ?? []).length > 0;
  else coreOk = (state.session.reports[step.id] ?? '').trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl">
      {sc.liveClocks && sc.liveClocks.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">{sc.liveClocks.map((c) => <SlaClock key={c.label} label={c.label} startMin={c.startMin} countUp={c.countUp} />)}</div>
      )}
      <div className="mb-3 flex gap-1.5">
        {sc.steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < state.cursor ? 'bg-mint' : i === state.cursor ? A.dot : 'bg-ink-700'}`} />)}
      </div>
      {locked.length > 0 && (
        <details className="mb-3 rounded-lg border border-line bg-ink-900/40 px-3 py-2">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-fog-500">Locked calls ({locked.length})</summary>
          <ul className="mt-2 space-y-1 text-[12px] text-fog-400">{locked.map((l, i) => <li key={i}><span className="text-fog-300">{l.title}:</span> {l.v}</li>)}</ul>
        </details>
      )}

      <div className="rounded-xl border border-line bg-ink-850/70 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className={`rounded ${A.bg} px-2 py-0.5 font-mono text-[11px] font-bold ${A.text}`}>STEP {step.index}/{total}</span>
          <h2 className="text-base font-semibold text-fog-100">{step.title}</h2>
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-fog-300">{step.situation}</p>
        {step.assist && <div className="mb-3 rounded-lg border border-iris/30 bg-iris/5 px-3 py-2 text-[12px] text-iris"><span className="font-semibold">◆ {step.assist}</span></div>}

        <StepBody step={step} session={state.session} onSelect={onSelect} onRoute={onRoute} onReport={onReport} />

        {step.memoPrompt && (
          <div className="mt-3">
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">{step.memoPrompt} <span className="text-rose">*</span></label>
            <textarea value={state.session.memos[step.id] ?? ''} onChange={(e) => onMemo(step.id, e.target.value)} rows={2}
              placeholder="Record your reasoning — this is the evidence recruiters read."
              className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600" />
          </div>
        )}

        <button onClick={onCommit} disabled={!coreOk || !memoOk} className={`mt-4 w-full rounded-lg ${A.btn} px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}>
          {state.cursor < total - 1 ? 'Lock in this call →' : 'Submit & see WorkProof Report →'}
        </button>
        {!memoOk && coreOk && <p className="mt-1 text-center text-[11px] text-amber">Add your reasoning to continue.</p>}
      </div>
    </div>
  );
}

function StepBody({ step, session, onSelect, onRoute, onReport }: {
  step: TaskStep; session: Session; onSelect: (id: string, o: string) => void; onRoute: (id: string, t: string) => void; onReport: (id: string, t: string) => void;
}) {
  if (step.kind === 'choice') {
    return (
      <div className="space-y-2">
        {step.options!.map((opt) => {
          const active = session.selections[step.id] === opt.id;
          return (
            <label key={opt.id} className={`block cursor-pointer rounded-lg border p-3 transition-colors ${active ? 'border-sky bg-sky/10' : 'border-line bg-ink-900/40 hover:border-fog-600'}`}>
              <div className="flex items-start gap-2.5">
                <input type="radio" name={step.id} checked={active} onChange={() => onSelect(step.id, opt.id)} className="mt-1 accent-sky" />
                <div><div className="text-[13px] font-medium text-fog-100">{opt.label}</div><div className="mt-0.5 text-[12px] text-fog-500">{opt.blurb}</div></div>
              </div>
            </label>
          );
        })}
      </div>
    );
  }
  if (step.kind === 'routing') {
    const sel = session.routing[step.id] ?? [];
    return (
      <div>
        <p className="mb-2 text-[12px] font-medium text-fog-400">{step.routingPrompt}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {step.routingTargets!.map((t) => {
            const on = sel.includes(t.id);
            return (
              <label key={t.id} className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-colors ${on ? 'border-sky bg-sky/10' : 'border-line bg-ink-900/40 hover:border-fog-600'}`}>
                <input type="checkbox" checked={on} onChange={() => onRoute(step.id, t.id)} className="mt-0.5 accent-sky" />
                <div><div className="text-[12px] font-semibold text-fog-100">{t.label}</div><div className="text-[11px] text-fog-500">{t.scope}</div></div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div>
      <label className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">{step.reportPrompt}</label>
      <textarea value={session.reports[step.id] ?? ''} onChange={(e) => onReport(step.id, e.target.value)} rows={6}
        placeholder="Write clearly — scored locally on clarity + coverage."
        className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600" />
    </div>
  );
}

/* ------------------------------- Report --------------------------------- */
const TONE: Record<string, string> = { mint: 'text-mint border-mint/50 bg-mint/10', sky: 'text-sky border-sky/50 bg-sky/10', amber: 'text-amber border-amber/50 bg-amber/10', rose: 'text-rose border-rose/50 bg-rose/10' };

function Report({ company, session, onReplay, onGoTask }: { company: Company; session: Session; onReplay: () => void; onGoTask: () => void }) {
  const A = ACCENT[company.accent];
  const [ai, setAi] = useState<{ state: 'idle' | 'loading' | 'done'; text: string }>({ state: 'idle', text: '' });
  const anyDecision = Object.keys(session.selections).length > 0 || Object.keys(session.reports).length > 0;
  if (!anyDecision) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-ink-900/40 p-6 text-center">
        <h3 className="text-sm font-semibold text-fog-100">No report yet</h3>
        <p className="mt-1 text-[13px] text-fog-500">Run the live task to generate your WorkProof Report.</p>
        <button onClick={onGoTask} className={`mt-4 rounded-lg ${A.btn} px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90`}>Go to Live Task →</button>
      </div>
    );
  }
  const result = computeScore(company, session);
  const choiceSteps = company.scenario.steps.filter((s) => s.kind === 'choice');
  const routingSteps = company.scenario.steps.filter((s) => s.kind === 'routing');

  async function runAi() {
    setAi({ state: 'loading', text: '' });
    const txt = Object.values(session.reports).join('\n') || Object.values(session.memos).join('\n');
    try {
      const res = await fetch('/api/ai-review', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reportText: txt, total: result.total }) });
      const data = (await res.json()) as { review?: string };
      setAi({ state: 'done', text: data.review || 'No review returned.' });
    } catch { setAi({ state: 'done', text: 'AI review unavailable right now — your deterministic score stands on its own.' }); }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-ink-850/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-fog-500">WorkProof Report · {company.roleTitle} @ {company.name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-mono text-4xl font-bold text-fog-100">{result.total}</span>
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${TONE[result.grade.tone]}`}>{result.grade.label}</span>
        </div>
        <p className="mt-2 max-w-prose text-[13px] text-fog-400">This scores <em>you</em> playing the task — a read on how realistic the role is. The candidate’s evidence is the recorded reasoning on each call.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-fog-500">Competency radar</h3>
          <div className="mx-auto max-w-[360px]"><RadarChart data={result.dimensions} /></div>
        </div>
        <div className="rounded-xl border border-line bg-ink-900/40 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">Role competencies</h3>
          <ul className="space-y-2">
            {result.dimensions.map((d) => (
              <li key={d.key}>
                <div className="mb-1 flex justify-between text-[12px]"><span className="text-fog-300">{d.label} <span className="text-fog-600">· {d.weight}%</span></span><span className="font-mono font-semibold text-fog-200">{d.score}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-700"><div className={`h-full rounded-full ${A.dot}`} style={{ width: `${d.score}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fog-500">Your calls, your reasoning, and how I’d handle it</h3>
        <ol className="space-y-4">
          {choiceSteps.map((step) => {
            const chosen = step.options!.find((o) => o.id === session.selections[step.id]);
            const best = step.options!.find((o) => o.candidatePick);
            const matched = chosen?.id === best?.id;
            const m = session.memos[step.id];
            return (
              <li key={step.id}>
                <div className="text-[13px] font-semibold text-fog-200">Step {step.index}: {step.title}</div>
                {chosen && (
                  <div className="mt-1 rounded-lg border border-sky/40 bg-sky/5 p-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-sky">Your call {matched && '· matches my call'}</div>
                    <div className="text-[13px] text-fog-200">{chosen.label}</div>
                    <div className="mt-1 text-[12px] text-fog-400">→ {chosen.consequence}</div>
                  </div>
                )}
                {m && <div className="mt-1.5 rounded-lg border border-line bg-ink-850/50 p-2.5"><div className="text-[11px] font-semibold uppercase tracking-wide text-fog-500">Your reasoning</div><div className="text-[12px] italic text-fog-300">“{m}”</div></div>}
                {!matched && best && (
                  <div className="mt-1.5 rounded-lg border border-mint/30 bg-mint/5 p-2.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-mint">How I’d handle it</div>
                    <div className="text-[13px] text-fog-200">{best.label}</div>
                    {best.commentary && <div className="mt-1 text-[12px] text-fog-400"><strong className="text-fog-300">Why:</strong> {best.commentary.why}</div>}
                    {best.commentary && <div className="mt-1 text-[12px] text-amber"><strong>Trade-off:</strong> {best.commentary.tradeoff}</div>}
                  </div>
                )}
                {matched && best?.commentary && (
                  <div className="mt-1.5 rounded-lg border border-mint/20 bg-mint/5 p-2.5 text-[12px] text-fog-400"><strong className="text-mint">Why this works:</strong> {best.commentary.why} <span className="text-amber"><strong>Trade-off:</strong> {best.commentary.tradeoff}</span></div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {routingSteps.map((step) => {
        const sel = session.routing[step.id] ?? [];
        const correct = step.routingCorrect ?? [];
        const lab = (id: string) => step.routingTargets?.find((t) => t.id === id)?.label ?? id;
        return (
          <div key={step.id} className="rounded-xl border border-line bg-ink-900/40 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fog-500">{step.title}</h3>
            <div className="grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
              <div><span className="text-fog-500">You chose: </span><span className="text-fog-200">{sel.map(lab).join(', ') || '—'}</span></div>
              <div><span className="text-fog-500">Correct: </span><span className="text-mint">{correct.map(lab).join(', ')}</span></div>
            </div>
          </div>
        );
      })}

      <div className="rounded-xl border border-line bg-ink-900/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-500">Optional: AI review of your written deliverable</h3>
          <button onClick={runAi} disabled={ai.state === 'loading'} className="rounded-lg border border-iris/50 bg-iris/10 px-3 py-1.5 text-[12px] font-semibold text-iris hover:bg-iris/20 disabled:opacity-50">{ai.state === 'loading' ? 'Reviewing…' : 'Run AI review'}</button>
        </div>
        <p className="mt-1 text-[11px] text-fog-600">AI is an assistant, never the judge — your score above is computed by a deterministic local engine.</p>
        {ai.text && <div className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-ink-850/60 p-3 text-[13px] leading-relaxed text-fog-300">{ai.text}</div>}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button onClick={onReplay} className="flex-1 rounded-lg border border-line bg-ink-850 px-4 py-3 text-sm font-semibold text-fog-200 hover:border-fog-600">Replay this task</button>
        <a href="/case-study" className={`flex-1 rounded-lg ${A.btn} px-4 py-3 text-center text-sm font-semibold text-ink-950 hover:opacity-90`}>How I built this →</a>
      </div>
    </div>
  );
}
