import { SCENARIOS } from '../../data/scenarios';
import type { Scenario, DecisionStep } from '../../data/scenarios/types';
import { REPORTING_ROLES } from '../../data/ops-spec';
import type { SessionChoices } from '../../engines/scoring';
import SlaClock from './SlaClock';

interface Props {
  scenario: Scenario | null;
  phase: 'idle' | 'briefing' | 'playing' | 'done';
  cursor: number;
  session: SessionChoices;
  completed: string[];
  onPick: (scenarioId: string) => void;
  onStartShift: () => void;
  onSelect: (stepId: string, optionId: string) => void;
  onRoute: (stepId: string, roleId: string) => void;
  onMemo: (stepId: string, text: string) => void;
  onReport: (stepId: string, text: string) => void;
  onCommit: () => void;
  onReset: () => void;
  onViewReport: () => void;
}

export default function CrisisRoom(p: Props) {
  /* ---------- picker ---------- */
  if (!p.scenario || p.phase === 'idle') {
    return (
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-fog-100">Crisis Room</h3>
          <p className="text-[13px] text-fog-500">
            Pick a live crisis. Each one drops into your normal shift — you reassign people, escalate,
            communicate, route the reporting chain, and recover. Every important call asks <em>why</em>.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SCENARIOS.map((s) => {
            const done = p.completed.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => p.onPick(s.id)}
                className="group rounded-xl border border-line bg-ink-900/50 p-4 text-left transition-colors hover:border-sky/60"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose/15 text-lg text-rose">{s.glyph}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-fog-600">CRISIS {s.code}</span>
                      {done && <span className="rounded-full bg-mint/15 px-1.5 text-[9px] font-bold text-mint">PLAYED</span>}
                    </div>
                    <div className="text-sm font-semibold text-fog-100">{s.name}</div>
                  </div>
                  <span className="ml-auto font-mono text-[10px] text-fog-600">{s.clock}</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-fog-400">{s.cardSummary}</p>
                <span className="mt-3 inline-block text-[12px] font-semibold text-sky group-hover:underline">
                  {done ? 'Replay →' : 'Start this crisis →'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const scenario = p.scenario;
  const total = scenario.steps.length;

  /* ---------- briefing ---------- */
  if (p.phase === 'briefing') {
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={p.onReset} className="mb-3 text-[12px] text-fog-500 hover:text-fog-200">← All crises</button>
        <div className="rounded-xl border border-rose/30 bg-ink-850/70 p-5">
          <div className="flex items-center gap-2">
            <span className="animate-pulse rounded bg-rose/15 px-2 py-0.5 font-mono text-[11px] font-bold text-rose">● LIVE CRISIS {scenario.code}</span>
            <span className="font-mono text-[11px] text-fog-500">{scenario.clock}</span>
          </div>
          <h2 className="mt-2 text-xl font-bold text-fog-100">{scenario.name}</h2>
          <p className="text-[13px] text-fog-500">{scenario.tagline}</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-fog-300">{scenario.briefing}</pre>
          <button onClick={p.onStartShift} className="mt-4 w-full rounded-lg bg-sky px-4 py-3 text-sm font-semibold text-ink-950 hover:opacity-90">
            Take the shift →
          </button>
          <p className="mt-2 text-center text-[11px] text-fog-600">No login · progress saves automatically</p>
        </div>
      </div>
    );
  }

  /* ---------- done ---------- */
  if (p.phase === 'done') {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-mint/30 bg-mint/5 p-6 text-center">
        <div className="text-3xl">✓</div>
        <h2 className="mt-2 text-lg font-bold text-fog-100">Crisis {scenario.code} handled</h2>
        <p className="mt-1 text-[13px] text-fog-400">Your WorkProof Report is ready — see your scorecard and how I’d handle each call.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={p.onViewReport} className="rounded-lg bg-sky px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90">View WorkProof Report →</button>
          <button onClick={p.onReset} className="rounded-lg border border-line bg-ink-850 px-4 py-2.5 text-sm font-semibold text-fog-300 hover:border-fog-600">Try another crisis</button>
        </div>
      </div>
    );
  }

  /* ---------- playing ---------- */
  const step = scenario.steps[p.cursor];
  const locked = scenario.steps.slice(0, p.cursor).map((s) => {
    let summary = '—';
    if (s.kind === 'choice') summary = s.options?.find((o) => o.id === p.session.selections[s.id])?.label ?? '—';
    else if (s.kind === 'routing') summary = (p.session.routing[s.id] ?? []).map((id) => REPORTING_ROLES.find((r) => r.id === id)?.label).join(', ') || '—';
    else if (s.kind === 'report') summary = (p.session.reports[s.id] ?? '').slice(0, 60) + '…';
    return { title: s.title, summary };
  });

  const memoOk = !step.memoPrompt || (p.session.memos[step.id] ?? '').trim().length > 0;
  let coreOk = false;
  if (step.kind === 'choice') coreOk = Boolean(p.session.selections[step.id]);
  else if (step.kind === 'routing') coreOk = (p.session.routing[step.id] ?? []).length > 0;
  else if (step.kind === 'report') coreOk = (p.session.reports[step.id] ?? '').trim().length > 0;
  const canCommit = coreOk && memoOk;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={p.onReset} className="text-[12px] text-fog-500 hover:text-fog-200">← All crises</button>
        <span className="font-mono text-[11px] text-rose">● LIVE · Crisis {scenario.code}</span>
      </div>

      {/* live clocks */}
      {scenario.liveClocks.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {scenario.liveClocks.map((c) => (
            <SlaClock key={c.label} label={c.label} startMin={c.startMin} countUp={c.startMin === 60 && scenario.code === 'C'} />
          ))}
        </div>
      )}

      {/* progress */}
      <div className="mb-3 flex gap-1.5">
        {scenario.steps.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < p.cursor ? 'bg-mint' : i === p.cursor ? 'bg-sky' : 'bg-ink-700'}`} />
        ))}
      </div>

      {locked.length > 0 && (
        <details className="mb-3 rounded-lg border border-line bg-ink-900/40 px-3 py-2">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-wide text-fog-500">Locked calls ({locked.length})</summary>
          <ul className="mt-2 space-y-1 text-[12px] text-fog-400">
            {locked.map((l, i) => <li key={i}><span className="text-fog-300">{l.title}:</span> {l.summary}</li>)}
          </ul>
        </details>
      )}

      <div className="rounded-xl border border-line bg-ink-850/70 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-sky/15 px-2 py-0.5 font-mono text-[11px] font-bold text-sky">STEP {step.index}/{total}</span>
          <h2 className="text-base font-semibold text-fog-100">{step.title}</h2>
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-fog-300">{step.situation}</p>

        {step.ruleAssist && (
          <div className="mb-3 rounded-lg border border-iris/30 bg-iris/5 px-3 py-2 text-[12px] text-iris">
            <span className="font-semibold">◆ {step.ruleAssist}</span>
          </div>
        )}

        <StepBody step={step} p={p} />

        {/* why memo */}
        {step.memoPrompt && (
          <div className="mt-3">
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">{step.memoPrompt} <span className="text-rose">*</span></label>
            <textarea
              value={p.session.memos[step.id] ?? ''}
              onChange={(e) => p.onMemo(step.id, e.target.value)}
              rows={2}
              placeholder="Record your reasoning — this is the evidence recruiters read."
              className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600"
            />
          </div>
        )}

        <button
          onClick={p.onCommit}
          disabled={!canCommit}
          className="mt-4 w-full rounded-lg bg-sky px-4 py-2.5 text-sm font-semibold text-ink-950 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {p.cursor < total - 1 ? 'Lock in this call →' : 'Submit & see WorkProof Report →'}
        </button>
        {!memoOk && coreOk && <p className="mt-1 text-center text-[11px] text-amber">Add your reasoning to continue.</p>}
      </div>
    </div>
  );
}

function StepBody({ step, p }: { step: DecisionStep; p: Props }) {
  if (step.kind === 'choice') {
    return (
      <div className="space-y-2">
        {step.options!.map((opt) => {
          const active = p.session.selections[step.id] === opt.id;
          return (
            <label key={opt.id} className={`block cursor-pointer rounded-lg border p-3 transition-colors ${active ? 'border-sky bg-sky/10' : 'border-line bg-ink-900/40 hover:border-fog-600'}`}>
              <div className="flex items-start gap-2.5">
                <input type="radio" name={step.id} checked={active} onChange={() => p.onSelect(step.id, opt.id)} className="mt-1 accent-sky" />
                <div>
                  <div className="text-[13px] font-medium text-fog-100">{opt.label}</div>
                  <div className="mt-0.5 text-[12px] text-fog-500">{opt.blurb}</div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    );
  }

  if (step.kind === 'routing') {
    const selected = p.session.routing[step.id] ?? [];
    return (
      <div>
        <p className="mb-2 text-[12px] font-medium text-fog-400">{step.routingPrompt}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {REPORTING_ROLES.map((r) => {
            const on = selected.includes(r.id);
            return (
              <label key={r.id} className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-colors ${on ? 'border-sky bg-sky/10' : 'border-line bg-ink-900/40 hover:border-fog-600'}`}>
                <input type="checkbox" checked={on} onChange={() => p.onRoute(step.id, r.id)} className="mt-0.5 accent-sky" />
                <div>
                  <div className="text-[12px] font-semibold text-fog-100">{r.label}</div>
                  <div className="text-[11px] text-fog-500">{r.scope}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // report
  return (
    <div>
      <label className="mb-1 block text-[11px] uppercase tracking-wide text-fog-500">{step.reportPrompt}</label>
      <textarea
        value={p.session.reports[step.id] ?? ''}
        onChange={(e) => p.onReport(step.id, e.target.value)}
        rows={6}
        placeholder="Incidents, status, owners, customer impact, escalations, next steps + timing…"
        className="w-full resize-y rounded-lg border border-line bg-ink-900/60 p-2 text-sm text-fog-200 placeholder:text-fog-600"
      />
      <p className="mt-1 text-[11px] text-fog-600">Scored locally on clarity + coverage. Not sent anywhere.</p>
    </div>
  );
}
